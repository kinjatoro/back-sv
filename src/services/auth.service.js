// src/services/auth.service.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { connection } from "../../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "2025tesis";

export const createUser = ({ nombre, email, password }) => {
  return new Promise((resolve, reject) => {
    const checkQuery = "SELECT id FROM usuarios WHERE email = ?";
    connection.query(checkQuery, [email], (err, results) => {
      if (err) return reject(err);
      if (results.length > 0) {
        return resolve({ emailInUse: true });
      }

      const hashedPassword = bcrypt.hashSync(password, 10);
      const insertQuery = "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)";
      connection.query(insertQuery, [nombre, email, hashedPassword], (err, result) => {
        if (err) return reject(err);
        resolve({ success: true });
      });
    });
  });
};

export const authenticateUser = ({ email, password }) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM usuarios WHERE email = ?";
    connection.query(query, [email], async (err, results) => {
      if (err || results.length === 0) {
        return reject(new Error("Credenciales inválidas"));
      }

      try {
        const user = results[0];

        // Validación defensiva de campos críticos
        if (!user || !user.id || !user.nombre || !user.email || !user.password) {
        return reject(new Error("Credenciales inválidas"));
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) return reject(new Error("Credenciales inválidas"));


        const token = jwt.sign({ id: user.id, nombre: user.nombre, email: user.email }, JWT_SECRET, {
          expiresIn: "1d",
        });

        resolve({
          user: { id: user.id, nombre: user.nombre, email: user.email },
          token,
        });
      } catch (e) {
        return reject(new Error("Error al autenticar"));
      }
    });
  });
};
