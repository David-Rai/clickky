import mysql from 'mysql2';
import fs from 'fs'
import { configDotenv } from 'dotenv';
configDotenv();

console.log("database connection ...")

const poolOptions = {
  host: process.env.HOST,
  user: process.env.USER,
  port: process.env.DBPORT,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  waitForConnections: true,
  ssl: {
    ca: fs.readFileSync(new URL('./isrgrootx1.pem', import.meta.url)),
    rejectUnauthorized: false
  }
};

// Create pool with correct typings
const pool = mysql.createPool(poolOptions).promise();
export default pool;