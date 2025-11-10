import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";

const router = Router();

function signToken(user) {
  return jwt.sign(
    { sub: user.id, name: user.name, email: user.email },
    process.env.JWT_SECRET || "dev_jwt_secret",
    { expiresIn: "2h" }
  );
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const [exists] = await pool.query("SELECT id FROM users WHERE email = ?", [email]);
    if (exists.length) return res.status(409).json({ error: "Email already registered" });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?,?,?)",
      [name, email, hash]
    );

    const user = { id: result.insertId, name, email };
    const token = signToken(user);

    res.json({ ok: true, token, user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const [rows] = await pool.query(
      "SELECT id, name, email, password_hash FROM users WHERE email = ?",
      [email]
    );
    if (!rows.length) return res.status(401).json({ error: "Invalid credentials" });

    const user = rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = signToken(user);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
