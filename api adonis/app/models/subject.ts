import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'
import Post from '#models/post'
import Tag from '#models/tag'

export default class Subject extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string


  @hasMany(() => Post)
  declare posts: HasMany<typeof Post>

  @manyToMany(() => Tag, {
    pivotTable: 'subject_tags',
    localKey: 'id',
    relatedKey: 'id',
    pivotForeignKey: 'subject_id',
    pivotRelatedForeignKey: 'tag_id',
  })
  declare tags: ManyToMany<typeof Tag>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
