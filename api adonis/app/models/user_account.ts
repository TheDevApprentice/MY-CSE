import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, afterCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import { UuidHelper } from '#helper/uuid'

export default class UserAccount extends BaseModel {
  @belongsTo(() => User, { foreignKey: 'userId' })
  declare user: BelongsTo<typeof User>

  @column({ isPrimary: true })
  declare userId: string // Clé primaire et clé étrangère vers users.id (UUID)

  @column()
  declare isVerified: boolean

  @column()
  declare avatarUrl: string | null

  @column.date()
  declare dob: DateTime

  @column()
  declare phoneNumber: string

  @column()
  declare landlineNumber?: string | null

  @column()
  declare countryCode: string // Indicatif pays (ex: +33)

  @column()
  declare status: 'active' | 'suspended' | 'inactive'

  @column()
  declare gender: 'male' | 'female' | 'hybride' | 'notSay'

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

  @afterCreate()
  static async assignUuid(userAccount: UserAccount) {
    // ✅ Solution 1: Charger la relation puis accéder à l'instance
    if (userAccount.isVerified === false) {
      await userAccount.load('user')

      if (userAccount.user) {
        userAccount.user.validationCode = UuidHelper.v7()
        await userAccount.user.save()
      }
    }
  }

   serialize() {
    return {
      userId: this.userId,
      isVerified: this.isVerified,
      avatarUrl: this.avatarUrl,
      dob: this.dob,
      phoneNumber: this.phoneNumber,
      landlineNumber: this.landlineNumber,
      countryCode: this.countryCode,
      status: this.status,
      gender: this.gender,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
