import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'post_tags'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('post_id', 36).notNullable().references('id').inTable('posts').onDelete('CASCADE')
      table.string('tag_id', 36).notNullable().references('id').inTable('tags').onDelete('CASCADE')
      table.primary(['post_id', 'tag_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
