// src/routes/analysis.routes.js
import express from "express";
import {
  createAnalysis,
  getAllAnalysis,
  getAnalysisByUserId,
  deleteAnalysis,
  getPresignedUploadUrl,
} from "../controllers/analysis.controller.js";

export const analysisRouter = express.Router();

analysisRouter.post("/", createAnalysis);
analysisRouter.get("/", getAllAnalysis);
analysisRouter.get("/user/:id", getAnalysisByUserId);
analysisRouter.delete("/:id", deleteAnalysis);
analysisRouter.get("/upload-url", getPresignedUploadUrl);
