import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Tag from '#models/tag'
import { UuidHelper } from '#helper/uuid'

export default class TagSeeder extends BaseSeeder {
  static environment = ['development', 'testing']

  public async run() {
    await Tag.createMany([
      { id: UuidHelper.v7(), name: 'adonisjs' },
      { id: UuidHelper.v7(), name: 'typescript' },
      { id: UuidHelper.v7(), name: 'voyage' },
      { id: UuidHelper.v7(), name: 'recette' },
      { id: UuidHelper.v7(), name: 'astuce' },
      { id: UuidHelper.v7(), name: 'evenement' },
    ])
  }
}
