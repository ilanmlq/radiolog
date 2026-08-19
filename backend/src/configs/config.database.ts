import dotenv from 'dotenv';
import { MongoClient, Db } from 'mongodb';

dotenv.config();

function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var ${name}`);
  return v;
}

const MONGODB_URI = getEnv('MONGODB_URI');
const DB_NAME = getEnv('DB_NAME');


let client: MongoClient;
let db: Db;

export async function connectDatabase(): Promise<void> {
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Database connection established');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

export function getDatabase(): Db {
  if (!db) {
    throw new Error('Database not initialized. Call connectDatabase first.');
  }
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();
  }
}

