import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Subject from '#models/subject'
import Post from '#models/post'
import User from '#models/user'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column.dateTime()
  declare startDate: DateTime

  @column.dateTime()
  declare endDate: DateTime | null

  @column()
  declare location: string | null

  @column()
  declare createdBy: string | null
  @belongsTo(() => User, { foreignKey: 'createdBy' })
  declare creator: BelongsTo<typeof User>

  @column()
  declare subjectId: string | null
  @belongsTo(() => Subject, { foreignKey: 'subjectId' })
  declare subject: BelongsTo<typeof Subject>

  @column()
  declare postId: string | null
  @belongsTo(() => Post, { foreignKey: 'postId' })
  declare post: BelongsTo<typeof Post>

  @column.dateTime()
  declare publishedAt: DateTime | null

  @column()
  declare status: 'draft' | 'scheduled' | 'published' | 'cancelled'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
