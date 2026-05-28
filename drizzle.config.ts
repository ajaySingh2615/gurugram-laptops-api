import { defineConfig } from 'drizzle-kit';
import { env } from './src/common/config/env.ts'; // Read our connection string

export default defineConfig({
  // Tell Drizzle to look for any file ending in .model.ts inside our modules
  schema: './src/modules/**/*.model.ts',
  out: './drizzle', // Where the generated SQL migration files will be saved
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
