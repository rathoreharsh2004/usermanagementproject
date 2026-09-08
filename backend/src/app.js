import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(",").map((item) => item.trim()) || "*"
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "user-management-api" });
});

app.use("/api/users", userRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;