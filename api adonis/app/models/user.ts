// app/models/user.ts

import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, beforeCreate, hasOne } from '@adonisjs/lucid/orm'
import type { HasOne } from '@adonisjs/lucid/types/relations'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { UuidHelper } from '#helper/uuid'
import UserAccount from '#models/user_account'

const AuthFinder = withAuthFinder(() => hash.use('argon2'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @hasOne(() => UserAccount, { foreignKey: 'userId' })
  declare userAccount: HasOne<typeof UserAccount>

  /**
   * UUID v7 comme clé primaire
   */
  @column({ isPrimary: true })
  declare id: string

  /**
   * Nom complet de l'utilisateur
   */
  @column()
  declare fullName: string | null

  /**
   * Email unique
   */
  @column()
  declare email: string

  /**
   * Mot de passe hashé (jamais sérialisé dans les réponses)
   */
  @column({ serializeAs: null })
  declare password: string

  /**
   * Date de création
   */
  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  /**
   * Date de mise à jour
   */
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  /**
   * Configuration pour les tokens d'accès JWT
   */
  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  /**
   * Code de validation
   */
  @column()
  declare validationCode: string | null

  /**
   * Hook pour générer automatiquement un UUID v7 avant la création
   * UUID v7 = chronologique + unique + sécurisé
   */
  @beforeCreate()
  static assignUuid(user: User) {
    if (!user.id) {
      user.id = UuidHelper.v7()
    }
  }

  /**
   * Méthode utilitaire pour sérialiser un utilisateur sans le mot de passe
   */
  serialize() {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}