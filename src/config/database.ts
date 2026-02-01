import dotenv from 'dotenv';
import { Options } from 'sequelize';

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
      dialect: (process.env.DB_CONNECTION as any) || 'mysql',
      // Disable logging in test/production to keep logs clean
      logging: isProd || isTest ? false : console.log,
    };
  }
}

export default new DatabaseConfig();