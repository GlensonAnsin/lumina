import UserFactory from '../factories/UserFactory.js';
import Logger from '../../utils/Logger.js';

class DatabaseSeeder {
  /**
   * Run the database seeds.
   */
  async run() {
    Logger.info('Seeding database...');

    try {
      // 1. Create a specific Admin User
      await UserFactory.create({
        firstname: 'Admin',
        lastname: 'Lumina',
        email: 'admin@lumina.com',
        password: "lumina123",
        role: 'admin',
      });

      // 2. Create random users
      await UserFactory.createMany(20);

      Logger.info('Seeding complete!');
    } catch (error) {
      Logger.error('Seeding failed:', error);
      throw error;
    }
  }
}

export default new DatabaseSeeder();