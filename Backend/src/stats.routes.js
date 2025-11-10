import { Router } from "express";
import { pool } from "./db.js";

const r = Router();

r.get("/", async (_req, res) => {
  try {
    const [[rooms]] = await pool.query(`
      SELECT
        COUNT(*)                  AS rooms_total,
        SUM(status='available')   AS rooms_available,
        SUM(status='occupied')    AS rooms_occupied,
        SUM(status='maintenance') AS rooms_maintenance
      FROM rooms;
    `);

    const today = new Date().toISOString().slice(0,10);

    const [[flow]] = await pool.query(`
      SELECT
        SUM(check_in = ?)  AS checkins_today,
        SUM(check_out = ?) AS checkouts_today
      FROM bookings;
    `, [today, today]);

    const [[rev]] = await pool.query(`
      SELECT COALESCE(SUM(total_amount),0) AS revenue_today
      FROM bookings
      WHERE check_in <= ? AND check_out >= ? AND status IN ('confirmed','checked_in','checked_out');
    `, [today, today]);

    const occupancy_pct = rooms.rooms_total
      ? Math.round((rooms.rooms_occupied / rooms.rooms_total) * 100)
      : 0;

    res.json({
      ...rooms,
      ...flow,
      ...rev,
      occupancy_pct,
      adr: 120,
      revpar: 0,
      deltas: { revenue: 5, occupancy: 2, adr: -1 }
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default r;
