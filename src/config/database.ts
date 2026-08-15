import { existsSync } from 'node:fs';
import mongoose from 'mongoose';
// Node needs a real file extension in imports (browsers/bundlers often hide this).
// We write `.ts` in source; the compiler turns it into `.js` in the built files.
import { errorDetail, logger } from '../lib/logger.ts';

const loadLocalEnv = () => {
  // `.env` holds local secrets (like the database password). Git ignores it so it never goes to GitHub.
  // Node 22 can read `.env` itself with `loadEnvFile` — similar to how Vite loads env on the frontend.
  if (existsSync('.env')) {
    process.loadEnvFile();
  }
};

const getMongoUri = (): string => {
  const mongoUri = process.env['MONGODB_URI'];

  if (mongoUri === undefined || mongoUri === '') {
    logger.fail({
      message: 'Missing MONGODB_URI',
      detail: 'Copy .env.example to .env and paste your MongoDB connection string.',
    });
    throw new Error('Missing MONGODB_URI');
  }

  return mongoUri;
};

export const connectDB = async () => {
  try {
    loadLocalEnv();
    await mongoose.connect(getMongoUri());
    logger.success({
      message: 'Connected to MongoDB',
      detail: mongoose.connection.host,
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.fail({
        message: 'Failed to connect to MongoDB',
        detail: errorDetail({ error }),
      });
      throw error;
    }

    logger.fail({ message: 'Failed to connect to MongoDB' });
    throw error;
  }
};
