// src/services/analysis.service.js

import { connection } from "../../config/db.js";

export const insertAnalysis = ({ usuario_id, estilo, duracion_video, observaciones, csv, video }) => {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO historial_analisis 
      (usuario_id, estilo, duracion_video, observaciones, csv, video) 
      VALUES (?, ?, ?, ?, ?, ?)`;

    connection.query(
      query,
      [usuario_id, estilo, duracion_video, observaciones, csv, video ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

export const fetchAllAnalysis = () => {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM historial_analisis`;
    connection.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

export const fetchAnalysisByUser = (userId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT 
        ha.id AS analisis_id,
        ha.usuario_id,
        ha.estilo,
        ha.duracion_video,
        ha.fecha_analisis,
        ha.observaciones,
        ha.csv,
        ha.video,
        c.id AS correccion_id,
        c.tipo_error,
        c.descripcion,
        c.snapshot_url
      FROM historial_analisis ha
      LEFT JOIN correcciones c ON ha.id = c.analisis_id
      WHERE ha.usuario_id = ?
      ORDER BY ha.id, c.id
    `;

    connection.query(query, [userId], (err, results) => {
      if (err) return reject(err);

      // Agrupar resultados por análisis
      const analisisMap = {};

      for (const row of results) {
        const analisisId = row.analisis_id;

        if (!analisisMap[analisisId]) {
          analisisMap[analisisId] = {
            id: analisisId,
            usuario_id: row.usuario_id,
            estilo: row.estilo,
            duracion_video: row.duracion_video,
            fecha_analisis: row.fecha_analisis,
            observaciones: row.observaciones,
            csv: row.csv,
            video: row.video,
            correcciones: [],
          };
        }

        // Si hay corrección asociada, agregarla
        if (row.correccion_id) {
          analisisMap[analisisId].correcciones.push({
            id: row.correccion_id,
            tipo_error: row.tipo_error,
            descripcion: row.descripcion,
            snapshot_url: row.snapshot_url,
          });
        }
      }

      // Convertir el objeto en array
      const analisisConCorrecciones = Object.values(analisisMap);
      resolve(analisisConCorrecciones);
    });
  });
};


export const removeAnalysis = (id) => {
  return new Promise((resolve, reject) => {
    const query = `DELETE FROM historial_analisis WHERE id = ?`;
    connection.query(query, [id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};

export const fetchAnalysisWithCorrections = (video) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM historial_analisis WHERE video = ?;
    `;

    connection.query(query, [video], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};
