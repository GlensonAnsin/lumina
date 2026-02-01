import db from '../src/models/index.js';
import DatabaseSeeder from '../src/database/seeders/DatabaseSeeder.js';

class SeederRunner {
  /**
   * Main entry point to execute the seeding logic.
   */
  public async run(): Promise<void> {
    try {
      // 1. Connect to the Database
      await this.connectDatabase();

      // 2. Execute the Main Seeder
      await this.executeSeeding();

      console.log('✅ Database seeding completed successfully.');
      process.exit(0);
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    }
  }

  /**
   * Verify the database connection.
   */
  private async connectDatabase(): Promise<void> {
    try {
      await db.sequelize.authenticate();
      console.log('🔌 Database connected successfully.');
    } catch (error) {
      console.error('❌ Unable to connect to the database:', error);
      throw error;
    }
  }

  /**
   * Instantiate and run the main DatabaseSeeder.
   */
  private async executeSeeding(): Promise<void> {
    console.log('🌱 Starting Database Seeder...');
    
    await DatabaseSeeder.run();
  }
}

new SeederRunner().run();