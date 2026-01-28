import { Umzug, SequelizeStorage } from 'umzug';
import db from '../src/models/index';
import { Sequelize } from 'sequelize';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import configList from '../src/config/database';

// Recreate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createDatabaseIfNotExists = async () => {
  const env = process.env.NODE_ENV || 'development';
  const config = (configList as any)[env];
  const dbName = config.database;

  // Create a temporary connection without a specific database
  const tempSequelize = new Sequelize('', config.username, config.password, {
    host: config.host,
    dialect: config.dialect,
    logging: false,
  });

  try {
    // Run the Create SQL
    await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
  } catch (error) {
    console.error('❌ Failed to create database:', error);
    process.exit(1);
  } finally {
    await tempSequelize.close();
  }
};

const runMigrations = async () => {
  // Auto-create DB before connecting
  await createDatabaseIfNotExists();

  const sequelize = db.sequelize;

  // Verify connection first
  try {
    await sequelize.authenticate();
    console.log('🔌 Database connected successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }

  const umzug = new Umzug({
    migrations: {
      glob: 'src/database/migrations/*.js',
      resolve: ({ name, path, context }) => {
        return {
          name,
          up: async () => {
            const migration = await import(pathToFileURL(path as string).href);
            return migration.default.up(context, sequelize.Sequelize);
          },
          down: async () => {
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

  const command = process.argv[2];

  try {
    if (command === 'up') {
      console.log('🚀 Running Migrations...');
      await umzug.up();
      console.log('✅ Migrations executed successfully.');
    } else if (command === 'down') {
      console.log('↩️  Rolling back last migration...');
      await umzug.down();
      console.log('✅ Rollback complete.');
    } else if (command === 'reset') {
      console.log('💥 Resetting Database...');
      await umzug.down({ to: 0 });
      console.log('✅ Database reset complete.');
    } else {
      console.log(`
      Unknown command. usage:
      npm run migrate       -> Run pending migrations
      npm run migrate:undo  -> Undo last migration
      npm run migrate:reset -> Undo all migrations
      `);
    }
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }

  process.exit(0);
};

runMigrations();