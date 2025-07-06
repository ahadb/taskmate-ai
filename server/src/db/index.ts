import { Pool, PoolClient, QueryResult } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env["DB_USER"],
  host: process.env["DB_HOST"],
  database: process.env["DB_NAME"],
  password: process.env["DB_PASSWORD"],
  port: parseInt(process.env["DB_PORT"] || "5432"),
});

export const query = async <T extends Record<string, any> = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T>> => {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  console.log("Executed query", { text, duration, rows: res.rowCount });
  return res;
};

export const getClient = async (): Promise<PoolClient> => {
  return await pool.connect();
};

export default pool;
