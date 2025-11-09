import { connection } from "../config/db.js";

// Consultas SQL
const viewUsuarios = `SELECT * FROM usuarios;`;
const viewHistorial = `SELECT * FROM historial_analisis;`;
const viewCorrecciones = `SELECT * FROM correcciones;`;

// Ejecutar consultas en orden
connection.query(viewUsuarios, (err, results) => {
  if (err) {
    console.error("Error visualizando tabla 'usuarios':", err.message);
  } else {
    console.log("Datos de la tabla 'usuarios':");
    console.table(results);

    // historial
    connection.query(viewHistorial, (err, results) => {
      if (err) {
        console.error("Error visualizando tabla 'historial_analisis':", err.message);
      } else {
        console.log("Datos de la tabla 'historial_analisis':");
        console.table(results);

        // correcciones
        connection.query(viewCorrecciones, (err, results) => {
          if (err) {
            console.error("Error visualizando tabla 'correcciones':", err.message);
          } else {
            console.log("Datos de la tabla 'correcciones':");
            console.table(results);
          }
          // Cerrar conexión al final
          connection.end();
        });
      }
    });
  }
});
