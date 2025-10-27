import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'comments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 36).primary().notNullable()
      table.text('content').notNullable()
      table.string('post_id', 36).notNullable().references('id').inTable('posts').onDelete('CASCADE')
      table.string('author_id', 36).notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
