// config/db.js
import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

export const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Prueba de conexión
connection.getConnection((err, conn) => {
  if (err) {
    console.error("Error al conectar a MySQL:", err.message);
  } else {
    console.log("Conectado a MySQL con pool de conexiones");
    conn.release(); // liberar la conexión después de probar
  }
});
