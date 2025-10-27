import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 36).primary().notNullable()
      table.string('title').notNullable()
      table.text('description').nullable()
      table.timestamp('start_date', { useTz: true }).notNullable()
      table.timestamp('end_date', { useTz: true }).nullable()
      table.string('location').nullable()
      table.string('created_by', 36).references('id').inTable('users').onDelete('SET NULL')
      table.string('subject_id', 36).references('id').inTable('subjects').onDelete('SET NULL')
      table.string('post_id', 36).references('id').inTable('posts').onDelete('SET NULL')
      table.timestamp('published_at', { useTz: true }).nullable()
      table.enum('status', ['draft', 'scheduled', 'published', 'cancelled']).defaultTo('draft')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
