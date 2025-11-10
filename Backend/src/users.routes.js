import { Router } from "express";
import { pool } from "./db.js";
import bcrypt from "bcryptjs";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT id, name, email, role, created_at
       FROM users
       ORDER BY created_at DESC`
    );
    const stats = {
      total: rows.length,
      admins: rows.filter(u => u.role === "admin").length,
      staff: rows.filter(u => u.role === "staff").length,
      guests: rows.filter(u => u.role === "guest").length,
      recent7d: rows.filter(u => {
        const created = new Date(u.created_at);
        return (Date.now() - created) / 86400000 <= 7;
      }).length
    };
    res.json({ users: rows, stats });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, email, password, role = "staff" } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email, password are required" });
    }
    if (!["admin","staff","guest"].includes(role)) {
      return res.status(400).json({ error: "invalid role" });
    }
    const [exists] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length) return res.status(409).json({ error: "Email already in use" });

    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)",
      [name, email, hash, role]
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
