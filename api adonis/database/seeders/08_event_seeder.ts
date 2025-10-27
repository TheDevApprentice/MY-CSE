import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Event from '#models/event'
import Subject from '#models/subject'
import Post from '#models/post'
import User from '#models/user'
import { UuidHelper } from '#helper/uuid'
import { DateTime } from 'luxon'

export default class EventSeeder extends BaseSeeder {
  static environment = ['development', 'testing']

  public async run() {
    const subject = await Subject.findBy('name', 'Evenements')
    const post = await Post.findBy('title', 'Les événements du mois')
    const user = await User.findBy('email', 'john@example.com')

    await Event.create({
      id: UuidHelper.v7(),
      title: 'Sortie Théâtre - La grande pièce',
      description: 'Venez assister à une pièce de théâtre exceptionnelle organisée par le Mon CSE.',
      startDate: DateTime.now().plus({ days: 10, hours: 19 }),
      endDate: DateTime.now().plus({ days: 10, hours: 21 }),
      location: 'Théâtre de la Ville',
      createdBy: user?.id ?? null,
      subjectId: subject?.id ?? null,
      postId: post?.id ?? null,
      publishedAt: DateTime.now().plus({ days: 2 }),
      status: 'scheduled',
    })
  }
}
