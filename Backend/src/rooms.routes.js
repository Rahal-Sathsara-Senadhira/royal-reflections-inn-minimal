import { Router } from "express";
import { pool } from "./db.js";

const router = Router();

/** GET /api/rooms -> { rooms: [], types: [], stats: { byType: {name: count}, totals: {...} } } */
router.get("/", async (_req, res) => {
  try {
    const [types] = await pool.query("SELECT id, name FROM room_types ORDER BY id ASC");

    const [rows] = await pool.query(
      `SELECT r.id, r.number, r.beds, r.price, r.status, t.name AS type
       FROM rooms r
       JOIN room_types t ON t.id = r.type_id
       ORDER BY r.number ASC`
    );

    // stats by type
    const byType = {};
    for (const t of types) byType[t.name] = 0;
    for (const r of rows) byType[r.type] = (byType[r.type] || 0) + 1;

    const totals = {
      totalRooms: rows.length,
      available: rows.filter(r => r.status === "available").length,
      occupied: rows.filter(r => r.status === "occupied").length,
      maintenance: rows.filter(r => r.status === "maintenance").length,
    };

    res.json({ rooms: rows, types, stats: { byType, totals } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** POST /api/rooms  body: { number, type_id, beds, price, status } */
router.post("/", async (req, res) => {
  try {
    const { number, type_id, beds, price, status = "available" } = req.body || {};
    if (!number || !type_id) return res.status(400).json({ error: "number and type_id are required" });

    await pool.query(
      "INSERT INTO rooms (number, type_id, beds, price, status) VALUES (?,?,?,?,?)",
      [number, type_id, Number(beds || 1), Number(price || 0), status]
    );

    res.json({ ok: true });
  } catch (e) {
    if (e.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "Room number already exists" });
    res.status(500).json({ error: e.message });
  }
});

export default router;
