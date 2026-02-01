import UserFactory from '../factories/UserFactory.js';

class DatabaseSeeder {
  /**
   * Run the database seeds.
   */
  async run() {
    console.log('🌱 Seeding database...');

    try {
      // 1. Create a specific Admin User
      await UserFactory.create({
        email: 'admin@lumina.com',
        firstname: 'Admin',
        lastname: 'Lumina',
        role: 'admin',
      });

      // 2. Create random users
      await UserFactory.createMany(20);

      console.log('✅ Seeding complete!');
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      throw error;
    }
  }
}

export default new DatabaseSeeder();