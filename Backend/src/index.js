import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import authRoutes from "./auth.routes.js";
import roomsRoutes from "./rooms.routes.js";
import bookingsRoutes from "./bookings.routes.js";
import usersRoutes from "./users.routes.js";
import statsRoutes from "./stats.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS ok");
    res.json({ status: "ok", db: rows?.[0]?.ok === 1 });
  } catch (e) {
    res.status(500).json({ status: "error", error: e.message });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomsRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/users", usersRoutes); 

// example protected endpoint placeholder
app.get("/api/ping", (_req, res) => res.json({ pong: true }));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
