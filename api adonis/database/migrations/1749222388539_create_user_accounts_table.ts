import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'user_accounts'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.string('user_id', 36).primary().references('id').inTable('users').onDelete('CASCADE')
      table.string('phone_number').notNullable()
      table.string('dob').notNullable()
      table.string('avatar_url').nullable().defaultTo('https://www.w3schools.com/w3images/avatar2.png')
      table.boolean('is_verified').notNullable().defaultTo(false)
      table.string('landline_number').nullable()
      table.string('country_code').notNullable()
      table.enum('status', ['active', 'suspended', 'inactive']).notNullable().defaultTo('active')
      table.enum('gender', ['male', 'female', 'hybride', 'notSay']).notNullable().defaultTo('notSay')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    }) 
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}