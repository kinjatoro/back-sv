// index.js
import express from "express";
import {authRouter} from "./src/routes/auth.routes.js"
import { analysisRouter } from "./src/routes/analysis.routes.js";
import cors from 'cors'

const app = express();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRouter);
app.use("/api/analysis", analysisRouter);

// app.use("/test")

app.listen(4000, () => {
  console.log("Server on port 4000");
});
