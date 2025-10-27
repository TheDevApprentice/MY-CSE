import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 36).primary().notNullable()
      table.string('title').notNullable()
      table.text('content').notNullable()
      table.string('cover_image').nullable()
      table.string('subject_id', 36).notNullable().references('id').inTable('subjects').onDelete('CASCADE')
      table.string('author_id', 36).notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
