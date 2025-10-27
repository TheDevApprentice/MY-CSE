import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Post from '#models/post'
import User from '#models/user'

export default class Comment extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare content: string

  @column()
  declare postId: string

  @column()
  declare authorId: string

  @belongsTo(() => Post, { foreignKey: 'postId' })
  declare post: BelongsTo<typeof Post>

  @belongsTo(() => User, { foreignKey: 'authorId' })
  declare author: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
