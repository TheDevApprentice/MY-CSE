import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Post from '#models/post'
import Subject from '#models/subject'
import User from '#models/user'
import { UuidHelper } from '#helper/uuid'
import Tag from '#models/tag'

export default class PostSeeder extends BaseSeeder {
  static environment = ['development', 'testing']

  public async run() {
    const subject = await Subject.findBy('name', 'Programmation')
    const subject2 = await Subject.findBy('name', 'Evenements')
    const user = await User.findBy('email', 'john@example.com')
    if (!subject || !user) return
    if (!subject2 || !user) return

    const post = await Post.create({
      id: UuidHelper.v7(),
      title: 'Premier post sur AdonisJS',
      content: 'AdonisJS est un super framework Node.js pour les apps web modernes.',
      coverImage: null,
      subjectId: subject.id,
      authorId: user.id,
    })

    const post2 = await Post.create({
      id: UuidHelper.v7(),
      title: 'Les événements du mois',
      content: 'Voici les événements du mois de juin.',
      coverImage: null,
      subjectId: subject2.id,
      authorId: user.id,
    })
    // Attacher le tag "adonisjs" au post
    const tag = await Tag.findBy('name', 'adonisjs')
    if (post && tag) {
      await post.related('tags').attach([tag.id])
    }
    const tag2 = await Tag.findBy('name', 'evenement')
    if (post2 && tag2) {
      await post2.related('tags').attach([tag2.id])
    }
  }
}
