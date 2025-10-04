import { connection } from "../config/db.js";

// Visualizar tabla usuarios
const viewUsuarios = `
SELECT * FROM usuarios;
`;

// Visualizar tabla historial_analisis
const viewHistorial = `
SELECT * FROM historial_analisis;
`;

connection.query(viewUsuarios, (err, results) => {
  if (err) {
    console.error("Error visualizando tabla 'usuarios':", err.message);
  } else {
    console.log("Datos de la tabla 'usuarios':");
    console.table(results); // <-- Muestra en formato tabla en consola

    // Después de ver usuarios, vemos historial
    connection.query(viewHistorial, (err, results) => {
      if (err) {
        console.error("Error visualizando tabla 'historial_analisis':", err.message);
      } else {
        console.log("Datos de la tabla 'historial_analisis':");
        console.table(results);
      }
      process.exit(); // Finalizar proceso correctamente
    });
  }
});
