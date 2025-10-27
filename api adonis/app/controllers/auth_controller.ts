// API/app/controllers/auth_controller.ts

import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import UserAccount from '#models/user_account'
import { UuidHelper } from '#helper/uuid'
import mail from '@adonisjs/mail/services/main'
import redis from '@adonisjs/redis/services/main'

export default class AuthController {
  // Création de compte (inscription) - avec invalidation cache
  public async register({ request, response }: HttpContext) {
    try {
      // 🛡️ AJOUT : Rate limiting inscription (3 créations par IP par heure)
      const clientIp = request.ip()
      const rateLimitKey = `rate_limit:register:${clientIp}`
      const attempts = await redis.incr(rateLimitKey)
      
      if (attempts === 1) {
        await redis.expire(rateLimitKey, 3600) // 1 heure
      }
      
      if (attempts > 3) {
        return response.status(429).json({
          error: 'Trop de créations de compte. Limite : 3 par heure.',
          retryAfter: 3600
        })
      }

      // 📚 CONSERVÉ : Toute la logique de validation existante
      const { fullName, email, password, dob, phoneNumber, landlineNumber, countryCode, gender } =
        request.only([
          'fullName',
          'email',
          'password',
          'dob',
          'phoneNumber',
          'landlineNumber',
          'countryCode',
          'gender',
        ])

      if (!email || !password || !fullName || !dob || !phoneNumber || !countryCode || !gender) {
        return response.status(400).json({ error: 'Tout les champs sont requis.' })
      }

      const exist = await User.findBy('email', email)
      if (exist) {
        return response.status(409).json({ error: 'Email déjà utilisé.' })
      }

      const user = await User.create({ email, password, fullName })
      
      // Création du UserAccount associé
      const userAccount = await UserAccount.create({
        userId: user.id,
        isVerified: false,
        dob: dob,
        avatarUrl: 'https://www.w3schools.com/w3images/avatar2.png',
        phoneNumber: phoneNumber,
        landlineNumber: landlineNumber,
        status: 'inactive',
        countryCode: countryCode,
        gender: gender,
      })

      const userCreated = await User.findBy('id', user.id)
      if (userCreated && userAccount.isVerified === false && userCreated.validationCode === null) {
        userCreated.validationCode = UuidHelper.v4()
        await userCreated.save()
      }

      // ⚡ AJOUT : Invalide le cache des utilisateurs (nouveau user créé)
      await redis.del('users:all')

      // 📚 CONSERVÉ : Envoi du mail de validation (logique identique)
      try {
        console.log('Envoi du mail de validation')
        
        const mailSent = await mail.send((message) => {
          message
            .to(user.email)
            .from(process.env.MAIL_FROM!, process.env.MAIL_FROM_NAME!)
            .subject('🌐 Activation de votre compte Mon CSE - Mon CSE')
            .htmlView('emails/verify_email_html', {
              user: {
                ...userCreated?.toObject(),
                fullName: userCreated?.fullName,
                email: userCreated?.email,
                validationCode: userCreated?.validationCode
              },
              companyName: 'Mon CSE',
              supportEmail: process.env.SUPPORT_EMAIL || 'support@worldgridCSE.com',
              validationUrl: `${process.env.APP_URL}/v1/auth/validate-account/${userCreated?.validationCode}`,
              currentYear: new Date().getFullYear()
            })
        })
        console.log("Mail sent", mailSent)
      } catch (error) {
        console.log(error)
        return response.status(500).json({ error: "Impossible d'envoyer le mail de validation." })
      }

      return response.status(201).json({
        message: 'Compte créé avec succès.',
        user: { id: user.id, email: user.email, fullName: user.fullName },
      })
    } catch (error) {
      return response.status(500).json({
        error: 'Erreur lors de la création du compte',
        message: error.message
      })
    }
  }

  // Mot de passe oublié avec rate limiting Redis
  public async forgotPassword({ request, response }: HttpContext) {
    try {
      // 🛡️ AJOUT : Rate limiting forgot password (5 tentatives par IP par heure)
      const clientIp = request.ip()
      const rateLimitKey = `rate_limit:forgot_password:${clientIp}`
      const attempts = await redis.incr(rateLimitKey)
      
      if (attempts === 1) {
        await redis.expire(rateLimitKey, 3600) // 1 heure
      }
      
      if (attempts > 5) {
        return response.status(429).json({
          error: 'Trop de demandes de réinitialisation. Limite : 5 par heure.',
          retryAfter: 3600
        })
      }

      // 🛡️ AJOUT : Rate limiting par email (1 demande par email toutes les 5 minutes)
      const {email} = request.only(['email'])
      if (!email) {
        return response.status(400).json({ error: 'Email requis.' })
      }

      const emailRateLimitKey = `rate_limit:forgot_password:email:${email}`
      const emailAttempts = await redis.incr(emailRateLimitKey)
      
      if (emailAttempts === 1) {
        await redis.expire(emailRateLimitKey, 300) // 5 minutes
      }
      
      if (emailAttempts > 1) {
        // Réponse générique pour ne pas révéler l'existence de l'email
        return response.status(200).json({
          message: 'Si cet email existe, un lien de réinitialisation a été envoyé.'
        })
      }

      // 📚 CONSERVÉ : Toute la logique de validation existante
      const user = await User.findBy('email', email)
      const genericMsg = { message: 'Si cet email existe, un lien de réinitialisation a été envoyé.' }
      
      if (!user) {
        return response.status(200).json(genericMsg)
      }

      // Génération d'un token de reset
      const resetToken = Math.random().toString(36).substring(2, 15)
      user.validationCode = resetToken
      await user.save()

      // ⚡ AJOUT : Invalide le cache de cet utilisateur (modifié)
      await redis.del(`user:${user.id}`)
      await redis.del(`user_profile:${user.id}`)

      // Envoi réel du mail
      await mail.send((message) => {
        message
          .to(user.email)
          .subject('Réinitialisation de votre mot de passe')
          .htmlView('emails/forgot_password_html', {
            user: {
              ...user.toObject(),
              fullName: user.fullName,
              email: user.email,
              validationCode: user.validationCode
            },
            resetUrl: `${process.env.APP_URL}/v1/auth/reset-password-validate/${user.validationCode}`,
            expirationMinutes: 15,
            currentYear: new Date().getFullYear()
          })
      })

      return response.status(200).json(genericMsg)
    } catch (error) {
      return response.status(500).json({
        error: 'Erreur lors de la demande de réinitialisation',
        message: error.message
      })
    }
  }

  public async resetPasswordValidate({ params, request, response }: HttpContext) {
    try {
      // 🛡️ AJOUT : Rate limiting validation (10 tentatives par IP par heure)
      const clientIp = request.ip()
      const rateLimitKey = `rate_limit:reset_validate:${clientIp}`
      const attempts = await redis.incr(rateLimitKey)
      
      if (attempts === 1) {
        await redis.expire(rateLimitKey, 3600) // 1 heure
      }
      
      if (attempts > 10) {
        return response.status(429).json({
          error: 'Trop de tentatives de validation. Limite : 10 par heure.',
          retryAfter: 3600
        })
      }

      // 📚 CONSERVÉ : Toute la logique de validation existante
      const validationCode = params.validationCode
      if (!validationCode) {
        return response.status(400).json({ error: 'Code de validation requis.' })
      }

      const user = await User.findBy('validationCode', validationCode)
      if (!user) {
        return response.status(401).json({ error: 'l\'utilisateur n\'existe pas.' })
      }
      if (user.validationCode !== validationCode) {
        return response.status(401).json({ error: 'Code de validation invalide.' })
      }

      return response.status(200).json({ message: 'Code de validation valide.' })
    } catch (error) {
      return response.status(500).json({
        error: 'Erreur lors de la validation',
        message: error.message
      })
    }
  }

  public async resetPassword({ params, request, response }: HttpContext) {
    try {
      // 🛡️ AJOUT : Rate limiting reset password (5 tentatives par IP par heure)
      const clientIp = request.ip()
      const rateLimitKey = `rate_limit:reset_password:${clientIp}`
      const attempts = await redis.incr(rateLimitKey)
      
      if (attempts === 1) {
        await redis.expire(rateLimitKey, 3600) // 1 heure
      }
      
      if (attempts > 5) {
        return response.status(429).json({
          error: 'Trop de tentatives de réinitialisation. Limite : 5 par heure.',
          retryAfter: 3600
        })
      }

      // 📚 CONSERVÉ : Toute la logique de validation existante
      const validationCode = params.validationCode
      if (!validationCode) {
        return response.status(400).json({ error: 'Code de validation requis.' })
      }

      const { password, passwordConfirmation } = request.only(['password', 'passwordConfirmation'])
      const user = await User.findBy('validationCode', validationCode)
      
      if (!user) {
        return response.status(401).json({ error: 'l\'utilisateur n\'existe pas.' })
      }
      if (user.validationCode !== validationCode) {
        return response.status(401).json({ error: 'Code de validation invalide.' })
      }
      if (!password) {
        return response.status(400).json({ error: 'Mot de passe requis.' })
      }
      if (!passwordConfirmation) {
        return response.status(400).json({ error: 'Confirmation du mot de passe requise.' })
      }
      if (password.length < 8) {
        return response.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères.' })
      }
      if (passwordConfirmation.length < 8) {
        return response.status(400).json({ error: 'La confirmation du mot de passe doit contenir au moins 8 caractères.' })
      }

      const isValid = await hash.verify(user.password, password)
      if(isValid){
        return response.status(400).json({ error: 'Le mot de passe est le même que le mot de passe actuel.' })
      }
      if (password !== passwordConfirmation) {
        return response.status(400).json({ error: 'Les mots de passe ne correspondent pas.' })
      }

      user.validationCode = null
      user.password = password
      await user.save()

      // ⚡ AJOUT : Invalide TOUS les caches de cet utilisateur (mot de passe changé)
      await redis.del(`user:${user.id}`)
      await redis.del(`user_profile:${user.id}`)
      await redis.del(`user_session:${user.id}`)

      return response.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' })
    } catch (error) {
      return response.status(500).json({
        error: 'Erreur lors de la réinitialisation',
        message: error.message
      })
    }
  }

  // Connexion utilisateur avec rate limiting anti-bruteforce Redis
  public async login({ auth, request, response }: HttpContext) {
    try {
      const { email, password } = request.only(['email', 'password'])
      
      if (!email || !password) {
        return response.status(400).json({ error: 'Email et mot de passe requis.' })
      }
      if(password && password.length < 8){
        return response.status(400).json({ error: 'Le mot de passe N\'est pas valide.' })
      }

      // 🛡️ AJOUT : Rate limiting login par IP (10 tentatives par heure)
      const clientIp = request.ip()
      const ipRateLimitKey = `rate_limit:login:ip:${clientIp}`
      const ipAttempts = await redis.incr(ipRateLimitKey)
      
      if (ipAttempts === 1) {
        await redis.expire(ipRateLimitKey, 3600) // 1 heure
      }
      
      if (ipAttempts > 10) {
        return response.status(429).json({
          error: 'Trop de tentatives de connexion. Limite : 10 par heure.',
          retryAfter: 3600
        })
      }

      // 🛡️ AJOUT : Rate limiting login par email (5 tentatives par email toutes les 15 minutes)
      const emailRateLimitKey = `rate_limit:login:email:${email}`
      const emailAttempts = await redis.incr(emailRateLimitKey)
      
      if (emailAttempts === 1) {
        await redis.expire(emailRateLimitKey, 900) // 15 minutes
      }
      
      if (emailAttempts > 5) {
        return response.status(429).json({
          error: 'Trop de tentatives de connexion pour cet email. Limite : 5 toutes les 15 minutes.',
          retryAfter: 900
        })
      }

      // 📚 CONSERVÉ : Toute la logique de validation existante
      const user = await User.findBy('email', email)
      if (!user) {
        return response.status(401).json({ error: 'Identifiants invalides email.' })
      }

      const isValid = await User.verifyCredentials(email, password)
      if (!isValid) {
        return response.status(401).json({ error: 'Identifiants invalides password verification.' })
      }

      // ⚡ AJOUT : Supprime les rate limits en cas de connexion réussie
      await redis.del(emailRateLimitKey)

      // Génération d'un access token
      const accessToken = await auth.use('api').createToken(user)
      const token = accessToken.value?.release()

      // ⚡ AJOUT : Cache la session utilisateur (pour whoami rapide)
      const userAccount = await UserAccount.find(user.id)
      if (userAccount) {
        const sessionData = {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
          status: userAccount.status,
          gender: userAccount.gender,
          avatarUrl: userAccount.avatarUrl,
          dob: userAccount.dob,
          phoneNumber: userAccount.phoneNumber,
          landlineNumber: userAccount.landlineNumber,
          countryCode: userAccount.countryCode,
          lastLogin: new Date().toISOString()
        }
        
        // Cache pour 2 heures
        await redis.setex(`user_session:${user.id}`, 7200, JSON.stringify(sessionData))
      }

      return response.status(200).json({
        user: { id: user.id, email: user.email },
        token,
      })
    } catch (error) {
      return response.status(500).json({
        error: 'Erreur lors de la connexion',
        message: error.message
      })
    }
  }

  // Déconnexion utilisateur avec nettoyage cache Redis
  public async logout({ auth, response }: HttpContext) {
    try {
      const user = await auth.use('api').authenticate()
      
      // ⚡ AJOUT : Supprime la session en cache
      await redis.del(`user_session:${user.id}`)
      await redis.del(`user_profile:${user.id}`)
      
      await auth.use('api').invalidateToken()
      return response.status(200).json({ message: 'Déconnexion réussie.' })
    } catch (error) {
      console.log(error)
      return response.status(400).json({ error: 'Impossible de se déconnecter.' })
    }
  }

  // Supprime le compte utilisateur authentifié avec nettoyage cache
  public async deleteAccount({ auth, response }: HttpContext) {
    try {
      const user = await auth.use('api').authenticate()
      
      // ⚡ AJOUT : Supprime TOUS les caches de cet utilisateur
      await redis.del(`user:${user.id}`)
      await redis.del(`user_profile:${user.id}`)
      await redis.del(`user_session:${user.id}`)
      await redis.del('users:all') // Liste des users
      
      await auth.use('api').invalidateToken()
      await user.delete()
      return response.status(200).json({ message: 'Compte supprimé avec succès.' })
    } catch (error) {
      return response.status(400).json({ error: 'Impossible de supprimer le compte.' })
    }
  }

  public async deleteAccountByUserId({ auth, params, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const userIdAccountToDelete = params.id
      const userAccountToDelete = await UserAccount.find(userIdAccountToDelete)
      if (!userAccountToDelete) {
        return response.status(404).json({ error: 'Compte non trouvé.' })
      }

      // ⚡ AJOUT : Supprime les caches de l'utilisateur supprimé
      await redis.del(`user:${userIdAccountToDelete}`)
      await redis.del(`user_profile:${userIdAccountToDelete}`)
      await redis.del(`user_session:${userIdAccountToDelete}`)
      await redis.del('users:all')

      await auth.use('api').invalidateToken()
      await userAccountToDelete.delete()
      return response.status(200).json({ message: 'Compte supprimé avec succès.' })
    } catch (error) {
      return response.status(400).json({ error: 'Impossible de supprimer le compte.' })
    }
  }

  public async deleteAccountByAccountId({ auth, params, response }: HttpContext) {
    try {
      await auth.use('api').authenticate()
      const userIdAccountToDelete = params.id
      const userAccountToDelete = await UserAccount.find(userIdAccountToDelete)
      if (!userAccountToDelete) {
        return response.status(404).json({ error: 'Compte non trouvé.' })
      }

      // ⚡ AJOUT : Supprime les caches de l'utilisateur supprimé
      await redis.del(`user:${userIdAccountToDelete}`)
      await redis.del(`user_profile:${userIdAccountToDelete}`)
      await redis.del(`user_session:${userIdAccountToDelete}`)
      await redis.del('users:all')

      await auth.use('api').invalidateToken()
      await userAccountToDelete.delete()
      return response.status(200).json({ message: 'Compte supprimé avec succès.' })
    } catch (error) {
      return response.status(400).json({ error: 'Impossible de supprimer le compte.' })
    }
  }

  // Suspend le compte utilisateur avec invalidation cache
  public async suspendAccount({ auth, response }: HttpContext) {
    try {
      const user = await auth.use('api').authenticate()
      const userAccountToSuspend = await UserAccount.find(user.id)
      if (!userAccountToSuspend) {
        return response.status(404).json({ error: 'Compte non trouvé.' })
      }

      userAccountToSuspend.status = 'suspended'
      await userAccountToSuspend.save()

      // ⚡ AJOUT : Invalide TOUS les caches de cet utilisateur (statut changé)
      await redis.del(`user:${user.id}`)
      await redis.del(`user_profile:${user.id}`)
      await redis.del(`user_session:${user.id}`)
      await redis.del('users:all')

      return response.status(200).json({ message: 'Compte suspendu.' })
    } catch (error) {
      return response.status(400).json({ error: 'Impossible de suspendre le compte.' })
    }
  }

  // whoami optimisé avec cache Redis intelligent
  public async whoami({ auth, response }: HttpContext) {
    try {
      const user = await auth.use('api').authenticate()
      
      // ⚡ AJOUT : Essaie de récupérer depuis le cache session d'abord
      const sessionCacheKey = `user_session:${user.id}`
      const cachedSession = await redis.get(sessionCacheKey)
      
      if (cachedSession) {
        const sessionData = JSON.parse(cachedSession)
        return response.status(200).json({
          ...sessionData,
          fromCache: true,
          cacheType: 'session'
        })
      }

      // ⚡ AJOUT : Sinon essaie le cache profile
      const profileCacheKey = `user_profile:${user.id}`
      const cachedProfile = await redis.get(profileCacheKey)
      
      if (cachedProfile) {
        const profileData = JSON.parse(cachedProfile)
        return response.status(200).json({
          ...profileData,
          fromCache: true,
          cacheType: 'profile'
        })
      }

      // 📚 CONSERVÉ : Si pas en cache, requête MySQL + mise en cache
      const userAccount = await UserAccount.find(user.id)
      if (!userAccount) {
        return response.status(404).json({ error: 'Compte non trouvé.' })
      }

      const profileData = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        status: userAccount.status,
        gender: userAccount.gender,
        avatarUrl: userAccount.avatarUrl,
        dob: userAccount.dob,
        phoneNumber: userAccount.phoneNumber,
        landlineNumber: userAccount.landlineNumber,
        countryCode: userAccount.countryCode,
      }

      // ⚡ AJOUT : Met en cache pour 30 minutes (données sensibles = TTL court)
      await redis.setex(profileCacheKey, 1800, JSON.stringify(profileData))

      return response.status(200).json({
        ...profileData,
        fromCache: false
      })
    } catch (error) {
      return response.status(401).json({ error: 'Token invalide ou expiré.' })
    }
  }

  // Validation du compte utilisateur avec invalidation cache
  public async validateAccount({ params, response }: HttpContext) {
    try {
      // 📚 CONSERVÉ : Toute la logique de validation existante
      const validationCode = params.validationCode
      if (!validationCode) {
        return response.status(400).json({ error: 'validationCode requis.' })
      }

      const user = await User.findBy('validationCode', validationCode)
      if (!user) {
        return response.status(404).json({ error: 'Utilisateur non trouvé.' })
      }
      if (user.validationCode !== validationCode) {
        return response.status(400).json({ error: 'Code de validation invalide.' })
      }

      user.validationCode = null
      await user.save()

      // On valide le compte
      const UserAccount = (await import('#models/user_account')).default
      const account = await UserAccount.find(user.id)
      if (!account) {
        return response.status(404).json({ error: 'UserAccount non trouvé.' })
      }

      account.isVerified = true
      account.status = 'active'
      await account.save()

      // ⚡ AJOUT : Invalide TOUS les caches de cet utilisateur (statut changé)
      await redis.del(`user:${user.id}`)
      await redis.del(`user_profile:${user.id}`)
      await redis.del(`user_session:${user.id}`)
      await redis.del('users:all')

      return response.status(200).json({ message: 'Compte validé avec succès.' })
    } catch (error) {
      return response.status(500).json({
        error: 'Erreur lors de la validation du compte',
        message: error.message
      })
    }
  }
}