import mysql from 'mysql2/promise';
import { User, QueryResult } from '@/types/db';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'urbanai',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function executeQuery<T>({ query, values }: { query: string; values?: (string | number)[] }): Promise<T> {
  try {
    const [results] = await pool.execute(query, values);
    return results as T;
  } catch (error) {
    throw error;
  }
}

// User related queries
export const userQueries = {
  createUser: async (name: string, email: string, hashedPassword: string): Promise<QueryResult> => {
    const query = `
      INSERT INTO users (name, email, password, created_at, updated_at)
      VALUES (?, ?, ?, NOW(), NOW())
    `;
    return executeQuery<QueryResult>({ query, values: [name, email, hashedPassword] });
  },

  getUserByEmail: async (email: string): Promise<User | null> => {
    const query = `
      SELECT * FROM users WHERE email = ? LIMIT 1
    `;
    const results = await executeQuery<User[]>({ query, values: [email] });
    return results[0] || null;
  },

  getUserById: async (id: number): Promise<User | null> => {
    const query = `
      SELECT * FROM users WHERE id = ? LIMIT 1
    `;
    const results = await executeQuery<User[]>({ query, values: [id] });
    return results[0] || null;
  }
}; 