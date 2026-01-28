import UserFactory from '../factories/UserFactory.js';

export default class DatabaseSeeder {
  async run() {
    console.log('🌱 Seeding database...');

    try {
      // Create a specific Admin User
      await UserFactory.create({
        email: 'admin@lumina.com',
        firstname: 'Admin',
        role: 'admin',
      });

      // Create 50 random users
      await UserFactory.createMany(50);

      console.log('Seeding complete!');
    } catch (error) {
      console.error('Seeding failed:', error);
    }
  }
}