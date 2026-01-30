import UserFactory from '../factories/UserFactory.js';

export default class DatabaseSeeder {
  async run() {
    console.log('🌱 Seeding database...');

    try {
      // Create a specific Admin User
      await UserFactory.create({
        email: 'admin@lumina.com',
        firstname: 'Admin',
        lastname: 'Lumina',
        role: 'admin',
      });

      // Create random users
      await UserFactory.createMany(20);

      console.log('Seeding complete!');
    } catch (error) {
      console.error('Seeding failed:', error);
    }
  }
}