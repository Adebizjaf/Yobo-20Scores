import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleApiSportsStatus, proxyApiSports } from "./routes/apisports";
import { handleLiveScores } from "./routes/live-scores";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // API-SPORTS integration
  app.get("/api/live-scores", handleLiveScores);
  app.get("/api/apisports/status", handleApiSportsStatus);
  app.use("/api/apisports", proxyApiSports);

  return app;
}
