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
    const query = `SELECT * FROM historial_analisis WHERE usuario_id = ?`;
    connection.query(query, [userId], (err, results) => {
      if (err) return reject(err);
      resolve(results);
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
