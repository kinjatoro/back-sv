import { connection } from "../config/db.js";

// Insertar registros solo en la columna `csv`
const insertCsvColumn = `
ALTER TABLE historial_analisis ADD COLUMN csv TEXT;
`;

connection.query(insertCsvColumn, (err) => {
  if (err) {
    console.error("❌ Error modificando la tabla:", err.message);
  } else {
    console.log("✅ CSVs insertados en historial_analisis.");
  }

  connection.end(); // Cerrar conexión
});
