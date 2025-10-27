import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany } from '@adonisjs/lucid/orm'
import type { ManyToMany } from '@adonisjs/lucid/types/relations'
import Post from '#models/post'

export default class Tag extends BaseModel {
  @column({ isPrimary: true })
  declare id: string

  @column()
  declare name: string

  @manyToMany(() => Post, {
    pivotTable: 'post_tags',
    pivotForeignKey: 'post_id',
    pivotRelatedForeignKey: 'tag_id',
  })
  declare posts: ManyToMany<typeof Post>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
