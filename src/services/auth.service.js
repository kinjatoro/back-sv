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


        const token = jwt.sign({ id: user.id, 
          nombre: user.nombre, 
          email: user.email, 
          foto_perfil:  user.foto_perfil, 
          metas: user.metas}, 
          JWT_SECRET, {
          expiresIn: "1d",
        });

        resolve({
          user: {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            foto_perfil: user.foto_perfil,
            metas: user.metas,
          },
          token,
        });

      } catch (e) {
        return reject(new Error("Error al autenticar"));
      }
    });
  });
};

export const updateUserProfile = (userId, datosActualizados) => {
  return new Promise((resolve, reject) => {
    const campos = [];
    const valores = [];

    if (datosActualizados.nombre) {
      campos.push("nombre = ?");
      valores.push(datosActualizados.nombre);
    }

    if (typeof datosActualizados.foto_perfil !== "undefined") {
      campos.push("foto_perfil = ?");
      valores.push(datosActualizados.foto_perfil);
    }

    if (typeof datosActualizados.metas !== "undefined") {
      campos.push("metas = ?");
      valores.push(datosActualizados.metas);
    }

    if (campos.length === 0) {
      return resolve(null); // Nada para actualizar
    }

    const query = `UPDATE usuarios SET ${campos.join(", ")} WHERE id = ?`;
    valores.push(userId);

    connection.query(query, valores, (err, result) => {
      if (err) return reject(err);

      // Traer los datos actualizados
      connection.query("SELECT id, nombre, email, foto_perfil, metas FROM usuarios WHERE id = ?", [userId], (err, rows) => {
        if (err) return reject(err);
        resolve(rows[0]);
      });
    });
  });
};

