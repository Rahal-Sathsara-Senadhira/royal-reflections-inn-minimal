import { Router } from "express";
import { pool } from "./db.js";

const router = Router();

/** helper: overlap check where existing booking is not cancelled */
async function hasConflict(room_id, check_in, check_out) {
  const [rows] = await pool.query(
    `SELECT id FROM bookings
     WHERE room_id = ?
       AND status <> 'cancelled'
       AND NOT (check_out <= ? OR check_in >= ?)`,
    [room_id, check_in, check_out]
  );
  return rows.length > 0;
}

/** GET /api/bookings
 *  -> { bookings: [...], rooms: [...], stats: {...} }
 */
router.get("/", async (_req, res) => {
  try {
    const [rooms] = await pool.query(
      `SELECT r.id, r.number, t.name AS type
       FROM rooms r JOIN room_types t ON t.id = r.type_id
       ORDER BY r.number`
    );

    const [rows] = await pool.query(
      `SELECT b.id, b.guest_name, b.guest_email, b.room_id, r.number AS room_number,
              t.name AS room_type, b.check_in, b.check_out, b.status, b.total_price, b.created_at
       FROM bookings b
       JOIN rooms r ON r.id = b.room_id
       JOIN room_types t ON t.id = r.type_id
       ORDER BY b.check_in DESC, b.id DESC`
    );

    const stats = {
      total: rows.length,
      byStatus: {
        booked: rows.filter(b => b.status === "booked").length,
        checked_in: rows.filter(b => b.status === "checked_in").length,
        checked_out: rows.filter(b => b.status === "checked_out").length,
        cancelled: rows.filter(b => b.status === "cancelled").length,
      },
      upcoming7d: rows.filter(b => {
        const now = new Date();
        const in7 = new Date(); in7.setDate(now.getDate() + 7);
        const ci = new Date(b.check_in);
        return ci >= now && ci <= in7 && b.status !== "cancelled";
      }).length
    };

    res.json({ bookings: rows, rooms, stats });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

/** POST /api/bookings
 * body: { room_id, guest_name, guest_email?, check_in(YYYY-MM-DD), check_out(YYYY-MM-DD), total_price?, status? }
 */
router.post("/", async (req, res) => {
  try {
    const { room_id, guest_name, guest_email, check_in, check_out, total_price = 0, status = "booked" } = req.body || {};
    if (!room_id || !guest_name || !check_in || !check_out) {
      return res.status(400).json({ error: "room_id, guest_name, check_in, check_out are required" });
    }
    const [roomRows] = await pool.query("SELECT id FROM rooms WHERE id = ?", [room_id]);
    if (!roomRows.length) return res.status(404).json({ error: "Room not found" });

    if (new Date(check_out) <= new Date(check_in)) {
      return res.status(400).json({ error: "check_out must be after check_in" });
    }

    if (await hasConflict(room_id, check_in, check_out)) {
      return res.status(409).json({ error: "Dates conflict with an existing booking" });
    }

    await pool.query(
      `INSERT INTO bookings (room_id, guest_name, guest_email, check_in, check_out, status, total_price)
       VALUES (?,?,?,?,?,?,?)`,
      [room_id, guest_name, guest_email || null, check_in, check_out, status, Number(total_price)]
    );

    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

export default router;
