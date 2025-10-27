import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import { DateTime } from 'luxon'

export default class UserAccountSeeder extends BaseSeeder {
  static environment = ['development', 'testing']

  public async run() {
    // Récupère tous les users créés
    // User: John Doe
    const john = await User.findBy('email', 'john@example.com')
    if (john) {
      await john.related('userAccount').create({
        phoneNumber: '0600000000',
        dob: DateTime.fromISO('1990-01-01'),
        avatarUrl: "https://www.w3schools.com/w3images/avatar2.png",
        isVerified: true,
        landlineNumber: null,
        gender: 'male',
        countryCode: '+33',
        status: 'active',
      })
    }

    // User: Jane Smith
    const jane = await User.findBy('email', 'jane@example.com')
    if (jane) {
      await jane.related('userAccount').create({
        phoneNumber: '0600000001',
        dob: DateTime.fromISO('1992-02-02'),
        avatarUrl: "https://www.w3schools.com/w3images/avatar2.png",
        isVerified: false,
        landlineNumber: null,
        gender: 'female',
        countryCode: '+33',
        status: 'active',
      })
    }

    // User: Admin User
    const admin = await User.findBy('email', 'admin@example.com')
    if (admin) {
      await admin.related('userAccount').create({
        phoneNumber: '0600000002',
        dob: DateTime.fromISO('1985-03-03'),
        avatarUrl: "https://www.w3schools.com/w3images/avatar2.png",
        isVerified: true,
        landlineNumber: null,
        gender: 'male',
        countryCode: '+33',
        status: 'active',
      })
    }

    // User: Test User
    const test = await User.findBy('email', 'test@example.com')
    if (test) {
      await test.related('userAccount').create({
        phoneNumber: '0600000003',
        dob: DateTime.fromISO('2000-04-04'),
        avatarUrl: "https://www.w3schools.com/w3images/avatar2.png",
        isVerified: false,
        landlineNumber: null,
        gender: 'hybride',
        countryCode: '+33',
        status: 'active',
      })
    }
  }
}
