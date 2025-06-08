export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

export interface QueryResult {
  affectedRows: number;
  insertId: number;
  warningStatus: number;
} 