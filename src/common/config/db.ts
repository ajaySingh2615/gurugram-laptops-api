import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { env } from './env.js';

// We use a Connection Pool so multiple requests don't block each other
const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
});

// This `db` object is what we will import in our Services to write queries!
export const db = drizzle(pool);

// A helper function to verify the connection when the server starts
export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL Database!');
    client.release();
  } catch (error) {
    console.error('Failed to connect to the Database', error);
    process.exit(1); // Exit with failure
  }
};
