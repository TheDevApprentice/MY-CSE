import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Subject from '#models/subject'
import { UuidHelper } from '#helper/uuid'
import Tag from '#models/tag'

export default class SubjectSeeder extends BaseSeeder {
  static environment = ['development', 'testing']

  public async run() {
    await Subject.createMany([
      { id: UuidHelper.v7(), name: 'Programmation' },
      { id: UuidHelper.v7(), name: 'Voyages' },
      { id: UuidHelper.v7(), name: 'Cuisine' },
      { id: UuidHelper.v7(), name: 'Evenements' },
    ])

    // Attacher le tag "adonisjs" au sujet "Programmation"
    const subject = await Subject.findBy('name', 'Programmation')
    const tag = await Tag.findBy('name', 'adonisjs')
    if (subject && tag) {
      await subject.related('tags').attach([tag.id])
    }
    const subject2 = await Subject.findBy('name', 'Evenements')
    const tag2 = await Tag.findBy('name', 'evenement')
    if (subject2 && tag2) {
      await subject2.related('tags').attach([tag2.id])
    }
  }
}
