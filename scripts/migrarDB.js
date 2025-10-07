import { connection } from "../config/db.js";

// 1. Agregar columna foto_perfil
const alterUsuarios = `
ALTER TABLE usuarios
ADD COLUMN foto_perfil INT DEFAULT 0;
`;

// 2. Eliminar columna tipo_error
const alterHistorial = `
ALTER TABLE historial_analisis
DROP COLUMN tipo_error;
`;

// 3. Crear nueva tabla correcciones
const createCorrecciones = `
CREATE TABLE IF NOT EXISTS correcciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  analisis_id INT NOT NULL,
  tipo_error VARCHAR(255) NOT NULL,
  descripcion TEXT,
  snapshot_url TEXT,
  FOREIGN KEY (analisis_id) REFERENCES historial_analisis(id) ON DELETE CASCADE
);
`;

// Ejecutar migraciones en orden
connection.query(alterUsuarios, (err) => {
  if (err) {
    console.error("❌ Error agregando 'foto_perfil':", err.message);
  } else {
    console.log("✅ Columna 'foto_perfil' agregada con éxito.");
  }

  connection.query(alterHistorial, (err) => {
    if (err) {
      console.error("❌ Error eliminando 'tipo_error':", err.message);
    } else {
      console.log("✅ Columna 'tipo_error' eliminada de 'historial_analisis'.");
    }

    connection.query(createCorrecciones, (err) => {
      if (err) {
        console.error("❌ Error creando tabla 'correcciones':", err.message);
      } else {
        console.log("✅ Tabla 'correcciones' creada con éxito.");
      }

      connection.end(); // Cierra la conexión
    });
  });
});
