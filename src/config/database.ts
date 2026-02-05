import { Options } from 'sequelize';
import Logger from '../utils/Logger.js';
import dotenv from 'dotenv';

dotenv.config();

class DatabaseConfig {
  public development: Options;
  public test: Options;
  public production: Options;

  constructor() {
    this.development = this.getEnvironmentConfig();
    this.test = this.getEnvironmentConfig('test');
    this.production = this.getEnvironmentConfig('production');
  }

  /**
   * Helper to generate config based on the environment.
   * This reduces repetition.
   */
  private getEnvironmentConfig(env: 'development' | 'test' | 'production' = 'development'): Options {
    const isTest = env === 'test';
    const isProd = env === 'production';

    return {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: isTest ? process.env.DB_DATABASE_TEST : process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      dialect: (process.env.DB_DIALECT as any) || 'mysql',
      // Disable logging in test/production to keep logs clean
      logging: isProd || isTest ? false : (msg) => Logger.info(`[SQL] ${msg}`),
    };
  }
}

export default new DatabaseConfig();