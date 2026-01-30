import db from '../src/models/index.js';
import DatabaseSeeder from '../src/database/seeders/DatabaseSeeder.js';

const runSeeders = async () => {
  await db.sequelize.authenticate();
  const seeder = new DatabaseSeeder();
  await seeder.run();
  process.exit();
};

runSeeders();