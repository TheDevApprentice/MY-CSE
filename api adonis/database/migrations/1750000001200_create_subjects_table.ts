import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'subjects'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('id', 36).primary().notNullable()
      table.string('name').notNullable()
      table.timestamp('created_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
