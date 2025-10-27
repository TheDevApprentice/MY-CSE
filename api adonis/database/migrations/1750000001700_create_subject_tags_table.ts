import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'subject_tags'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('subject_id', 36).notNullable().references('id').inTable('subjects').onDelete('CASCADE')
      table.string('tag_id', 36).notNullable().references('id').inTable('tags').onDelete('CASCADE')
      table.primary(['subject_id', 'tag_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
