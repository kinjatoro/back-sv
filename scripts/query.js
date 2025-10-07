import { connection } from "../config/db.js";




// Insertar registros solo en la columna `csv`
const insertCsvColumn = `
INSERT INTO correcciones (analisis_id, tipo_error, descripcion, snapshot_url)
VALUES
  (18, 'Ángulo de brazada muy alto.', 'El ángulo de brazada actual es demasiado grande (162°). Lo ideal es entre 45° y 60°. Recomendamos ejercicios drill con tabla unilateral.', 'https://swimvision-upload-videos.s3.us-east-1.amazonaws.com/outputs/vid4-error1.png'),
  (18, 'Patada tipo bicicleta', 'La patada actualmente tiene un ángulo demasiado chico. Eso genera resistencia al agua y se pierde velocidad en el nado. Recomendamos ejercicios de patada con tabla.', 'https://swimvision-upload-videos.s3.us-east-1.amazonaws.com/outputs/vid4-error2.png')
`;




/*
const insertCsvColumn = `
DELETE FROM historial_analisis
WHERE usuario_id = 3;
`
;
*/




/*
const insertCsvColumn = `
ALTER TABLE correcciones DROP FOREIGN KEY correcciones_ibfk_1;



`*/






connection.query(insertCsvColumn, (err) => {
  if (err) {
    console.error("❌ Error modificando la tabla:", err.message);
  } else {
    console.log("✅ CSVs insertados en historial_analisis.");
  }

  connection.end(); // Cerrar conexión
});
