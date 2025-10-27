import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Comment from '#models/comment'
import Post from '#models/post'
import User from '#models/user'
import { UuidHelper } from '#helper/uuid'

export default class CommentSeeder extends BaseSeeder {
  static environment = ['development', 'testing']

  public async run() {
    const post = await Post.first()
    const user = await User.findBy('email', 'jane@example.com')
    if (!post || !user) return

    await Comment.create({
      id: UuidHelper.v7(),
      content: 'Super article, merci !',
      postId: post.id,
      authorId: user.id,
    })
  }
}
