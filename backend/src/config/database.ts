import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const isTest = process.env.NODE_ENV === 'test';
const dbDialect = (process.env.DB_DIALECT as any) || 'mysql';

const sequelize = new Sequelize(
  process.env.DB_NAME || 'afera_sms',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: dbDialect,
    storage: dbDialect === 'sqlite' ? './database.sqlite' : undefined,
    logging: false,
    pool: dbDialect === 'mysql' ? {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    } : undefined,
  }
);

export default sequelize;
