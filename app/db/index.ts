import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("⚠️ DATABASE_URL is not defined. Database operations will fail at runtime.");
}

// Initialize with a placeholder if missing to prevent module evaluation crash
const sql = neon(databaseUrl || "postgresql://placeholder:placeholder@localhost:5432/placeholder");
export const db = drizzle(sql, { schema });
