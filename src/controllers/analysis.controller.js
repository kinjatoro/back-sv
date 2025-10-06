// src/controllers/analysis.controller.js

import {
  insertAnalysis,
  fetchAllAnalysis,
  fetchAnalysisByUser,
  removeAnalysis,
} from "../services/analysis.service.js";

import AWS from "aws-sdk";
import { v4 as uuidv4 } from "uuid";

// Configurar S3 usando import y variables de entorno
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});


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

export const getPresignedUploadUrl = async (req, res) => {
  try {
    const { filename, contentType } = req.query;

    const key = `videos/${uuidv4()}_${filename}`;

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: key,
      Expires: 300, // válido por 60 segundos
      ContentType: contentType
    };

    const uploadUrl = s3.getSignedUrl("putObject", params);

    return res.json({ uploadUrl, key });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error generating pre-signed URL" });
  }
}
