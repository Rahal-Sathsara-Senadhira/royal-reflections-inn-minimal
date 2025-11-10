import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "db",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "rri_user",
  password: process.env.DB_PASS || "supersecretapp",
  database: process.env.DB_NAME || "rri",
  waitForConnections: true,
  connectionLimit: 10,
});
