// app/controllers/users_controller.ts

import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import UserAccount from '#models/user_account'
import { UuidHelper } from '#helper/uuid'
import redis from '@adonisjs/redis/services/main'

export default class UsersController {
  /**
   * GET /v1/users
   * Récupère tous les utilisateurs (avec cache Redis)
   */
  public async getAllUsers({ request, response }: HttpContext) {
    try {
      // 🛡️ AJOUT : Rate limiting (100 requêtes par IP par heure)
      const clientIp = request.ip()
      const rateLimitKey = `rate_limit:get_users:${clientIp}`
      const requests = await redis.incr(rateLimitKey)
      
      if (requests === 1) {
        await redis.expire(rateLimitKey, 3600) // 1 heure
      }
      
      if (requests > 100) {
        return response.status(429).json({
          success: false,
          error: 'Trop de requêtes. Limite : 100 par heure.',
          retryAfter: 3600
        })
      }

      // ⚡ AJOUT : Essaie de récupérer depuis le cache Redis d'abord
      const cacheKey = 'users:all'
      const cachedUsers = await redis.get(cacheKey)
      
      if (cachedUsers) {
        const users = JSON.parse(cachedUsers)
        return response.json({
          success: true,
          data: users,
          count: users.length,
          fromCache: true, // 🔍 Info pour debugging
          cachedAt: new Date().toISOString()
        })
      }

      // 📚 CONSERVÉ : Requête MySQL originale (source de vérité)
      const users = await User.all()
      const serializedUsers = users.map((user) => user.serialize())

      // ⚡ AJOUT : Met en cache pour 30 minutes
      await redis.setex(cacheKey, 1800, JSON.stringify(serializedUsers))

      return response.json({
        success: true,
        data: serializedUsers,
        count: serializedUsers.length,
        fromCache: false // 🔍 Info pour debugging
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        error: 'Erreur lors de la récupération des utilisateurs',
        message: error.message,
      })
    }
  }

  /**
   * GET /v1/users/:id
   * Récupère un utilisateur par son UUID (avec cache Redis)
   */
  public async getUserById({ params, request, response }: HttpContext) {
    // Validation de l'UUID (CONSERVÉ)
    if (!UuidHelper.isValid(params.id)) {
      return response.status(400).json({
        success: false,
        error: 'UUID invalide',
        message: "L'ID doit être un UUID valide (format: 01933b4e-8f2a-7890-b456-0123456789ab)",
        provided: params.id,
      })
    }

    try {
      // 🛡️ AJOUT : Rate limiting (200 requêtes par IP par heure pour les détails user)
      const clientIp = request.ip()
      const rateLimitKey = `rate_limit:get_user:${clientIp}`
      const requests = await redis.incr(rateLimitKey)
      
      if (requests === 1) {
        await redis.expire(rateLimitKey, 3600) // 1 heure
      }
      
      if (requests > 200) {
        return response.status(429).json({
          success: false,
          error: 'Trop de requêtes. Limite : 200 par heure.',
          retryAfter: 3600
        })
      }

      // ⚡ AJOUT : Essaie de récupérer depuis le cache Redis d'abord
      const cacheKey = `user:${params.id}`
      const cachedUser = await redis.get(cacheKey)
      
      if (cachedUser) {
        const user = JSON.parse(cachedUser)
        return response.json({
          success: true,
          data: user,
          fromCache: true, // 🔍 Info pour debugging
          cachedAt: new Date().toISOString()
        })
      }

      // 📚 CONSERVÉ : Requête MySQL originale (source de vérité)
      const user = await User.find(params.id)

      if (!user) {
        return response.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé',
          id: params.id,
        })
      }

      const serializedUser = user.serialize()

      // ⚡ AJOUT : Met en cache pour 1 heure
      await redis.setex(cacheKey, 3600, JSON.stringify(serializedUser))

      return response.json({
        success: true,
        data: serializedUser,
        fromCache: false // 🔍 Info pour debugging
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        error: "Erreur lors de la récupération de l'utilisateur",
        message: error.message,
      })
    }
  }

  /**
   * POST /v1/users
   * Crée un nouvel utilisateur (avec invalidation cache Redis)
   */
  public async createUser({ request, response }: HttpContext) {
    try {
      // 🛡️ AJOUT : Rate limiting création (10 créations par IP par heure)
      const clientIp = request.ip()
      const rateLimitKey = `rate_limit:create_user:${clientIp}`
      const requests = await redis.incr(rateLimitKey)
      
      if (requests === 1) {
        await redis.expire(rateLimitKey, 3600) // 1 heure
      }
      
      if (requests > 10) {
        return response.status(429).json({
          success: false,
          error: 'Trop de créations d\'utilisateurs. Limite : 10 par heure.',
          retryAfter: 3600
        })
      }

      // 📚 CONSERVÉ : Toute la logique de création MySQL originale
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

      if (
        !email ||
        !password ||
        !fullName ||
        !dob ||
        !phoneNumber ||
        !countryCode ||
        !gender
      ) {
        return response.status(400).json({ error: 'Tout les champs sont requis.' })
      }
      
      const exist = await User.findBy('email', email)
      if (exist) {
        return response.status(409).json({ error: 'Email déjà utilisé.' })
      }
      
      const user = await User.create({ email, password, fullName })
      
      // Création du UserAccount associé
      await UserAccount.create({
        userId: user.id,
        isVerified: true,
        dob: dob,
        avatarUrl: 'https://www.w3schools.com/w3images/avatar2.png',
        phoneNumber: phoneNumber,
        landlineNumber: landlineNumber,
        status: 'active',
        countryCode: countryCode,
        gender: gender,
      })

      // ⚡ AJOUT : Invalide le cache de la liste des utilisateurs
      await redis.del('users:all')
      
      // ⚡ AJOUT : Met le nouvel utilisateur en cache
      await redis.setex(`user:${user.id}`, 3600, JSON.stringify(user.serialize()))

      return response.status(201).json({
        success: true,
        message: 'Utilisateur créé avec succès',
        data: user.serialize(),
        cacheInvalidated: true // 🔍 Info pour debugging
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        error: "Erreur lors de la création de l'utilisateur",
        message: error.message,
      })
    }
  }

  /**
   * PUT /v1/users/:id
   * Modifie complètement un utilisateur (avec invalidation cache Redis)
   */
  public async updateUser({ params, request, response }: HttpContext) {
    // Validation de l'UUID (CONSERVÉ)
    if (!UuidHelper.isValid(params.id)) {
      return response.status(400).json({
        success: false,
        error: 'UUID invalide',
        provided: params.id,
      })
    }

    try {
      // 🛡️ AJOUT : Rate limiting modification (20 modifications par IP par heure)
      const clientIp = request.ip()
      const rateLimitKey = `rate_limit:update_user:${clientIp}`
      const requests = await redis.incr(rateLimitKey)
      
      if (requests === 1) {
        await redis.expire(rateLimitKey, 3600) // 1 heure
      }
      
      if (requests > 20) {
        return response.status(429).json({
          success: false,
          error: 'Trop de modifications. Limite : 20 par heure.',
          retryAfter: 3600
        })
      }

      // 📚 CONSERVÉ : Toute la logique de modification MySQL originale
      const user = await User.find(params.id)
      if (!user) {
        return response.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé',
        })
      }

      const { fullName, email, dob, phoneNumber, landlineNumber, countryCode, gender } =
        request.only([
          'fullName',
          'email',
          'dob',
          'phoneNumber',
          'landlineNumber',
          'countryCode',
          'gender',
        ])

      if (
        !fullName ||
        !email ||
        !dob ||
        !phoneNumber ||
        !countryCode ||
        !gender
      ) {
        return response.status(400).json({
          success: false,
          error: 'Tout les champs sont requis pour PUT',
        })
      }

      // Vérifier l'unicité de l'email (sauf pour l'utilisateur actuel)
      if (email !== user.email) {
        const emailExists = await User.query()
          .where('email', email)
          .andWhereNot('id', user.id)
          .first()
        if (emailExists) {
          return response.status(409).json({
            success: false,
            error: 'Email déjà utilisé par un autre utilisateur',
          })
        }
      }

      user.fullName = fullName
      user.email = email
      await user.save()

      // ⚡ AJOUT : Invalide les caches liés à cet utilisateur
      await redis.del(`user:${params.id}`) // Cache de cet utilisateur
      await redis.del('users:all') // Cache de la liste des utilisateurs

      return response.json({
        success: true,
        message: 'Utilisateur modifié avec succès',
        data: user.serialize(),
        cacheInvalidated: true // 🔍 Info pour debugging
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        error: 'Erreur lors de la modification',
        message: error.message,
      })
    }
  }

  /**
   * PATCH /v1/users/:id
   * Modifie partiellement un utilisateur (avec invalidation cache Redis)
   */
  public async patchUser({ params, request, response }: HttpContext) {
    // Validation de l'UUID (CONSERVÉ)
    if (!UuidHelper.isValid(params.id)) {
      return response.status(400).json({
        success: false,
        error: 'UUID invalide',
        provided: params.id,
      })
    }

    try {
      // 🛡️ AJOUT : Rate limiting modification (même limite que PUT)
      const clientIp = request.ip()
      const rateLimitKey = `rate_limit:patch_user:${clientIp}`
      const requests = await redis.incr(rateLimitKey)
      
      if (requests === 1) {
        await redis.expire(rateLimitKey, 3600) // 1 heure
      }
      
      if (requests > 20) {
        return response.status(429).json({
          success: false,
          error: 'Trop de modifications. Limite : 20 par heure.',
          retryAfter: 3600
        })
      }

      // 📚 CONSERVÉ : Toute la logique de modification MySQL originale
      const user = await User.find(params.id)
      if (!user) {
        return response.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé',
        })
      }

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

      // Mise à jour conditionnelle
      if (fullName !== undefined) user.fullName = fullName

      if (email !== undefined && email !== user.email) {
        // Vérifier l'unicité de l'email
        const emailExists = await User.query()
          .where('email', email)
          .andWhereNot('id', user.id)
          .first()
        if (emailExists) {
          return response.status(409).json({
            success: false,
            error: 'Email déjà utilisé par un autre utilisateur',
          })
        }
        user.email = email
      }

      if (password !== undefined) {
        const hash = (await import('@adonisjs/core/services/hash')).default
        user.password = await hash.use('argon2').make(password)
      }

      await user.save()

      // ⚡ AJOUT : Invalide les caches liés à cet utilisateur
      await redis.del(`user:${params.id}`) // Cache de cet utilisateur
      await redis.del('users:all') // Cache de la liste des utilisateurs

      return response.json({
        success: true,
        message: 'Utilisateur modifié avec succès',
        data: user.serialize(),
        cacheInvalidated: true // 🔍 Info pour debugging
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        error: 'Erreur lors de la modification',
        message: error.message,
      })
    }
  }

  /**
   * DELETE /v1/users/:id
   * Supprime un utilisateur (avec invalidation cache Redis)
   */
  public async deleteUser({ params, request, response }: HttpContext) {
    // Validation de l'UUID (CONSERVÉ)
    if (!UuidHelper.isValid(params.id)) {
      return response.status(400).json({
        success: false,
        error: 'UUID invalide',
        provided: params.id,
      })
    }

    try {
      // 🛡️ AJOUT : Rate limiting suppression (5 suppressions par IP par heure)
      const clientIp = request.ip()
      const rateLimitKey = `rate_limit:delete_user:${clientIp}`
      const requests = await redis.incr(rateLimitKey)
      
      if (requests === 1) {
        await redis.expire(rateLimitKey, 3600) // 1 heure
      }
      
      if (requests > 5) {
        return response.status(429).json({
          success: false,
          error: 'Trop de suppressions. Limite : 5 par heure.',
          retryAfter: 3600
        })
      }

      // 📚 CONSERVÉ : Toute la logique de suppression MySQL originale
      const user = await User.find(params.id)
      if (!user) {
        return response.status(404).json({
          success: false,
          error: 'Utilisateur non trouvé',
        })
      }

      const userData = user.serialize()
      await user.delete()

      // ⚡ AJOUT : Invalide les caches liés à cet utilisateur
      await redis.del(`user:${params.id}`) // Cache de cet utilisateur
      await redis.del('users:all') // Cache de la liste des utilisateurs

      return response.json({
        success: true,
        message: 'Utilisateur supprimé avec succès',
        deleted: userData,
        cacheInvalidated: true // 🔍 Info pour debugging
      })
    } catch (error) {
      return response.status(500).json({
        success: false,
        error: 'Erreur lors de la suppression',
        message: error.message,
      })
    }
  }
}