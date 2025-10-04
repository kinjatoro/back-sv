// scripts/createTables.js
import { connection } from "../config/db.js";

// Tabla usuarios
const createUsuarios = `
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);
`;

// Tabla historial_analisis
const createHistorial = `
CREATE TABLE IF NOT EXISTS historial_analisis (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  estilo VARCHAR(50) NOT NULL,
  tipo_error TEXT,
  duracion_video INT,
  fecha_analisis DATETIME DEFAULT CURRENT_TIMESTAMP,
  observaciones TEXT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);
`;

connection.query(createUsuarios, (err) => {
  if (err) {
    console.error("Error creando tabla usuarios:", err.message);
  } else {
    console.log("Tabla 'usuarios' creada o ya existe.");
    connection.query(createHistorial, (err) => {
      if (err) {
        console.error("Error creando tabla historial_analisis:", err.message);
      } else {
        console.log("Tabla 'historial_analisis' creada o ya existe.");
      }
      process.exit(); // Cerrar conexión al finalizar
    });
  }
});
