import { existsSync } from 'node:fs';

export const loadLocalEnv = () => {
  // `.env` holds local secrets (like the database password). Git ignores it so it never goes to GitHub.
  // Node 22 can read `.env` itself with `loadEnvFile` — similar to how Vite loads env on the frontend.
  if (existsSync('.env')) {
    process.loadEnvFile();
  }
};
