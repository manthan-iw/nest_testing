import { registerAs } from '@nestjs/config';

/**
 * PostgreSQL Database Connection Configuration Factory.
 * Maps process.env variables to type-safe 'database' namespace options.
 */
export default registerAs('database', () => ({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || '1234',
  database: process.env.POSTGRES_DB || 'go_to_message',
  url: process.env.DATABASE_URL,
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  logging: process.env.DB_LOGGING === 'true',
}));
