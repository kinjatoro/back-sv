import { connection } from "../config/db.js";

// 1. Insertar usuarios
const insertUsuarios = `
INSERT INTO usuarios (nombre, email, password, foto_perfil)
VALUES 
  ('Valentina', 'valentina@test.com', 'hash_valentina', 3),
  ('Lucas', 'lucas@test.com', 'hash_lucas', 7),
  ('Carlos', 'carlos@test.com', 'hash_carlos', 0);
`;

// 2. Insertar historial_analisis
const insertHistorial = `
INSERT INTO historial_analisis (usuario_id, estilo, duracion_video, fecha_analisis, observaciones)
VALUES
  (1, 'pecho', 38, '2025-09-21 23:11:33', 'Se sugiere trabajo con tabla'),
  (1, 'crawl', 45, '2025-09-21 23:11:33', 'Necesita relajar hombros'),
  (2, 'mariposa', 52, '2025-09-21 23:11:33', 'Buena actitud, necesita más fuerza'),
  (2, 'mariposa', 40, '2025-09-22 00:32:24', 'Se sugiere drill con 1 brazo');
`;

// 3. Insertar correcciones
const insertCorrecciones = `
INSERT INTO correcciones (analisis_id, tipo_error, descripcion, snapshot_url)
VALUES
  (1, 'Poca patada', 'No se observan impulsos de piernas en fase de empuje.', 'https://s3.amazonaws.com/tu-bucket/snapshots/pecho1.jpg'),
  (1, 'Respiración tardía', 'Cabeza sale muy tarde y corta el ritmo.', 'https://s3.amazonaws.com/tu-bucket/snapshots/pecho2.jpg'),
  (2, 'Cabeza alta', 'Mira al frente en vez de hacia abajo.', 'https://s3.amazonaws.com/tu-bucket/snapshots/crawl1.jpg'),
  (3, 'Descoordinación', 'Brazada y patada no están sincronizadas.', 'https://s3.amazonaws.com/tu-bucket/snapshots/mariposa1.jpg'),
  (4, 'Brazada alta', 'Los brazos pasan demasiado por encima del agua.', 'https://s3.amazonaws.com/tu-bucket/snapshots/mariposa2.jpg');
`;

// Ejecutar en orden
connection.query(insertUsuarios, (err) => {
  if (err) {
    console.error("❌ Error insertando usuarios:", err.message);
  } else {
    console.log("✅ Usuarios insertados.");
  }

  connection.query(insertHistorial, (err) => {
    if (err) {
      console.error("❌ Error insertando historial:", err.message);
    } else {
      console.log("✅ Historial de análisis insertado.");
    }

    connection.query(insertCorrecciones, (err) => {
      if (err) {
        console.error("❌ Error insertando correcciones:", err.message);
      } else {
        console.log("✅ Correcciones insertadas.");
      }

      connection.end(); // Cerrar conexión
    });
  });
});
