import { registerAs } from '@nestjs/config';

/**
 * Server Configuration Factory.
 * Maps process.env variables to type-safe 'app' namespace configuration properties.
 */
export default registerAs('app', () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  apiPrefix: process.env.API_PREFIX || 'api/v1',
  corsOrigin: process.env.CORS_ORIGIN || '*',
}));
