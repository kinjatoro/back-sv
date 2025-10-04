// src/routes/analysis.routes.js
import express from "express";
import {
  createAnalysis,
  getAllAnalysis,
  getAnalysisByUserId,
  deleteAnalysis,
} from "../controllers/analysis.controller.js";

export const analysisRouter = express.Router();

analysisRouter.post("/", createAnalysis);                    // Crear análisis
analysisRouter.get("/", getAllAnalysis);                    // Todos los análisis
analysisRouter.get("/user/:id", getAnalysisByUserId);       // Por usuario
analysisRouter.delete("/:id", deleteAnalysis);              // Borrar por ID