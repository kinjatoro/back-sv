import { connection } from "../config/db.js";
import bcrypt from "bcrypt";

// Usuarios de prueba
const users = [
  {
    nombre: "Lucas",
    email: "lucas@test.com",
    password: bcrypt.hashSync("lucas123", 10),
  },
  {
    nombre: "Valentina",
    email: "valentina@test.com",
    password: bcrypt.hashSync("vale123", 10),
  },
];

// Análisis de prueba (se asociarán por `usuario_id`)
const analysis = [
  {
    usuario_id: 1,
    estilo: "crawl",
    tipo_error: "Cabeza alta, brazo rígido",
    duracion_video: 45,
    observaciones: "Necesita relajar hombros",
  },
  {
    usuario_id: 1,
    estilo: "pecho",
    tipo_error: "Poca patada, respiración tardía",
    duracion_video: 38,
    observaciones: "Se sugiere trabajo con tabla",
  },
  {
    usuario_id: 2,
    estilo: "mariposa",
    tipo_error: "Movimiento descoordinado",
    duracion_video: 52,
    observaciones: "Buena actitud, necesita más fuerza",
  },
];

// Función para insertar usuarios
const insertUsers = () => {
  return Promise.all(
    users.map((user) => {
      return new Promise((resolve, reject) => {
        const query = `INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)`;
        connection.query(
          query,
          [user.nombre, user.email, user.password],
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
      });
    })
  );
};

// Función para insertar análisis
const insertAnalysis = () => {
  return Promise.all(
    analysis.map((a) => {
      return new Promise((resolve, reject) => {
        const query = `
          INSERT INTO historial_analisis 
          (usuario_id, estilo, tipo_error, duracion_video, observaciones) 
          VALUES (?, ?, ?, ?, ?)
        `;
        connection.query(
          query,
          [a.usuario_id, a.estilo, a.tipo_error, a.duracion_video, a.observaciones],
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          }
        );
      });
    })
  );
};

// Ejecutar el seeding
const seed = async () => {
  try {
    console.log("⏳ Insertando usuarios...");
    await insertUsers();
    console.log("✅ Usuarios insertados");

    console.log("⏳ Insertando historial de análisis...");
    await insertAnalysis();
    console.log("✅ Historial de análisis insertado");

    process.exit();
  } catch (err) {
    console.error("❌ Error durante el seeding:", err.message);
    process.exit(1);
  }
};

seed();