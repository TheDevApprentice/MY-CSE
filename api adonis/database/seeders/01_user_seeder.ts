// database/seeders/user_seeder.ts

import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import { UuidHelper } from '#helper/uuid'

export default class UserSeeder extends BaseSeeder {
  static environment = ['development', 'testing']

  public async run() {
    // Créer des utilisateurs de test avec UUID v7
    await User.createMany([
      {
        id: UuidHelper.v7(),
        fullName: 'John Doe',
        email: 'john@example.com',
        password: await hash.use('argon2').make('password123'),
      },
      {
        id: UuidHelper.v7(),
        fullName: 'Jane Smith',
        email: 'jane@example.com',
        password: await hash.use('argon2').make('supersecret'),
      },
      {
        id: UuidHelper.v7(),
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: await hash.use('argon2').make('admin123'),
      },
      {
        id: UuidHelper.v7(),
        fullName: 'Test User',
        email: 'test@example.com',
        password: await hash.use('argon2').make('test123'),
      },
    ])
  }
}