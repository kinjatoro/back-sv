// src/controllers/analysis.controller.js

import {
  insertAnalysis,
  fetchAllAnalysis,
  fetchAnalysisByUser,
  removeAnalysis,fetchAnalysisWithCorrections,
  insertCorrecciones
} from "../services/analysis.service.js";

import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});


// src/controllers/analysis.controller.js
export const createAnalysis = async (req, res) => {
  try {
    const {
      usuario_id,
      estilo,
      duracion_video,
      observaciones,
      csv,
      nombre_video,
      correcciones = [],
    } = req.body;

    if (!usuario_id || !estilo) {
      return res.status(400).json({ msg: "Faltan campos obligatorios" });
    }

    const video = (typeof nombre_video === 'string' && nombre_video.includes('_')) 
      ? nombre_video.split('_')[0] 
      : nombre_video;

    const result = await insertAnalysis({ usuario_id, estilo, duracion_video, observaciones, csv, video });
    const analisis_id = result.insertId;

    if (correcciones.length > 0) {
      await insertCorrecciones(analisis_id, correcciones);
    }

    res.status(201).json({ msg: "Análisis creado correctamente", analisis_id });
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

export const getPresignedUploadUrl = async (req, res) => {
  try {
    const { filename, contentType } = req.query;

    console.log('🖊️ Firmando con contentType:', contentType);

    const key = `videos/${uuidv4()}_${filename}`;

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Expires: 300, // válido por 60 segundos
      ContentType: contentType
    };
    console.log('🔐 Key generado:', key);
    
    const uploadUrl = s3.getSignedUrl("putObject", params);
    console.log('🔗 URL firmada:', uploadUrl);
    return res.json({ uploadUrl, key });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error generating pre-signed URL" });
  }
}

export const getStatus = async (req, res) => {
  try {
    const { video } = req.params;
    const result = await fetchAnalysisWithCorrections(video);

    if (result.length === 0) {
      return res.status(404).json({ msg: "Análisis no encontrado" });
    }

    const analysis = result[0];

    const status = analysis.video ? "complete" : "pending";

    res.json({
      ...analysis,
      status, 
    });
  } catch (err) {
    console.error("Error en getStatus:", err);
    res.status(500).json({ msg: "Error al obtener el análisis" });
  }
};


