import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, manyToMany, hasMany } from '@adonisjs/lucid/orm'
import type { ManyToMany, HasMany, BelongsTo } from '@adonisjs/lucid/types/relations'
import Subject from '#models/subject'
import Tag from '#models/tag'
import Comment from '#models/comment'
import User from '#models/user'

export default class Post extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare title: string

  @column()
  declare content: string

  @column()
  declare coverImage: string | null

  @column()
  declare subjectId: string

  @belongsTo(() => Subject, { foreignKey: 'subjectId' })
  declare subject: BelongsTo<typeof Subject>

  @column()
  declare authorId: string

  @belongsTo(() => User, { foreignKey: 'authorId' })
  declare author: BelongsTo<typeof User>

  @manyToMany(() => Tag, {
    pivotTable: 'post_tags',
    pivotForeignKey: 'post_id',
    pivotRelatedForeignKey: 'tag_id',
  })
  declare tags: ManyToMany<typeof Tag>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
