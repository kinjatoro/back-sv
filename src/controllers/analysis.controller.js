// src/controllers/analysis.controller.js

import {
  insertAnalysis,
  fetchAllAnalysis,
  fetchAnalysisByUser,
  removeAnalysis,
} from "../services/analysis.service.js";

export const createAnalysis = async (req, res) => {
  try {
    const { usuario_id, estilo, tipo_error, duracion_video, observaciones } = req.body;

    if (!usuario_id || !estilo || !duracion_video) {
      return res.status(400).json({ msg: "Faltan campos obligatorios" });
    }

    await insertAnalysis({ usuario_id, estilo, tipo_error, duracion_video, observaciones });
    res.status(201).json({ msg: "Análisis creado correctamente" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error al crear el análisis" });
  }
};

export const getAllAnalysis = async (req, res) => {
  try {
    const data = await fetchAllAnalysis();
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Error al obtener análisis" });
  }
};

export const getAnalysisByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = await fetchAnalysisByUser(userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ msg: "Error al obtener análisis del usuario" });
  }
};

export const deleteAnalysis = async (req, res) => {
  try {
    const analysisId = req.params.id;
    await removeAnalysis(analysisId);
    res.json({ msg: "Análisis eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ msg: "Error al eliminar análisis" });
  }
};
