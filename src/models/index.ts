import fs from 'fs';
import path from 'path';
import { Sequelize } from 'sequelize';
import process from 'process';
import { fileURLToPath, pathToFileURL } from 'url';
import configList from '../config/database.js';

// Recreate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Config
const env = process.env.NODE_ENV || 'development';
const config = (configList as any)[env];

// Debugging Block
if (!config) {
  console.error('❌ Fatal Error: Could not find database config.');
  console.error(`   Looking for environment: "${env}"`);
  console.error('   Loaded Config:', JSON.stringify(configList, null, 2));
  process.exit(1);
}

const db: any = {};
let sequelize: Sequelize;

// Initialize Sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable] as string, config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const basename = path.basename(__filename);

// Read Directory
const files = fs.readdirSync(__dirname).filter((file) => {
  return (
    file.indexOf('.') !== 0 &&
    file !== basename &&
    (file.slice(-3) === '.ts' || file.slice(-3) === '.js')
  );
});

// Dynamic Import Models
for (const file of files) {
  const modelPath = pathToFileURL(path.join(__dirname, file)).href;
  const modelModule = await import(modelPath);
  const model = modelModule.default;

  if (model && model.initModel) {
    model.initModel(sequelize);
    db[model.name] = model;
  }
}

// Setup Associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;