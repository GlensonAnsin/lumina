import { Umzug, SequelizeStorage } from 'umzug';
import { Sequelize, QueryInterface } from 'sequelize';
import { pathToFileURL } from 'url';
import db from '../src/models/index.js';
import configList from '../src/config/database.js';
import Logger from '../src/utils/Logger.js';
import dotenv from 'dotenv';

dotenv.config();

class MigrationRunner {
  /**
   * The command line argument (e.g., 'up', 'down', 'reset')
   */
  private command: string;

  constructor() {
    // Get the command from process arguments
    this.command = process.argv[2] || '';
  }

  /**
   * Main entry point to execute the migration logic.
   */
  public async run(): Promise<void> {
    try {
      // 1. Ensure Database Exists
      await this.ensureDatabaseExists();

      // 2. Connect to the App Database
      await this.connectDatabase();

      // 3. Configure Umzug (The Migration Engine)
      const umzug = this.getUmzugInstance();

      // 4. Execute the requested command
      await this.executeCommand(umzug);
      
      process.exit(0);
    } catch (error) {
      Logger.error('Migration failed:', error);
      process.exit(1);
    }
  }

  /**
   * Check if the database exists and create it if not.
   */
  private async ensureDatabaseExists(): Promise<void> {
    const env = process.env.NODE_ENV || 'development';
    const config = (configList as any)[env];
    const dbName = config.database;

    // Connect to the server, not the specific DB
    const tempSequelize = new Sequelize('', config.username, config.password, {
      host: config.host,
      dialect: config.dialect,
      logging: false,
    });

    try {
      await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    } catch (error) {
      Logger.error('Failed to create database:', error);
      throw error;
    } finally {
      await tempSequelize.close();
    }
  }

  /**
   * Verify the database connection.
   */
  private async connectDatabase(): Promise<void> {
      await db.connect();
  }

  /**
   * Initialize and configure Umzug.
   */
  private getUmzugInstance(): Umzug<QueryInterface> {
    const sequelize = db.sequelize;

    return new Umzug<QueryInterface>({
      migrations: {
        glob: 'src/database/migrations/*.js',
        resolve: ({ name, path, context }) => {
          return {
            name,
            up: async () => {
              // Windows Fix: Convert path to URL
              const migration = await import(pathToFileURL(path as string).href);
              return migration.default.up(context, sequelize.Sequelize);
            },
            down: async () => {
              // Windows Fix: Convert path to URL
              const migration = await import(pathToFileURL(path as string).href);
              return migration.default.down(context, sequelize.Sequelize);
            },
          };
        },
      },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize }),
      logger: console,
    });
  }

  /**
   * Handle the specific CLI command logic.
   */
  private async executeCommand(umzug: Umzug<QueryInterface>): Promise<void> {
    switch (this.command) {
      case 'up':
        Logger.info('Running Migrations...');
        await umzug.up();
        Logger.info('Migrations executed successfully.');
        break;

      case 'down':
        Logger.info('Rolling back last migration...');
        await umzug.down();
        Logger.info('Rollback complete.');
        break;

      case 'reset':
        Logger.info('Resetting Database...');
        await umzug.down({ to: 0 });
        Logger.info('Database reset complete.');
        break;

      default:
        Logger.info(`
        Unknown command: "${this.command}"
        
        Usage:
          npm run migrate       -> Run pending migrations
          npm run migrate:undo  -> Undo last migration
          npm run migrate:reset -> Undo all migrations
        `);
        break;
    }
  }
}

new MigrationRunner().run();