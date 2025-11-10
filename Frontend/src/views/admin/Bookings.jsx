import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";

function Stat({ title, value, hint }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
    </div>
  );
}

function AddBookingModal({ open, onClose, rooms, onCreated }) {
  const [f, setF] = useState({
    room_id: "",
    guest_name: "",
    guest_email: "",
    check_in: "",
    check_out: "",
    total_price: 0,
    status: "booked"
  });
  const [err, setErr] = useState("");

  useEffect(() => {
    if (open) {
      setF({
        room_id: rooms?.[0]?.id || "",
        guest_name: "",
        guest_email: "",
        check_in: "",
        check_out: "",
        total_price: 0,
        status: "booked"
      });
      setErr("");
    }
  }, [open, rooms]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setErr("");
      await api("/api/bookings", { method: "POST", body: JSON.stringify(f) });
      onCreated?.(); onClose();
    } catch (e) {
      setErr(e.message || "Failed to add booking");
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add Booking</h3>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>✕</button>
        </div>
        {err && <div className="mb-3 text-sm text-red-600">{err}</div>}
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={submit}>
          <div>
            <label className="block text-sm mb-1">Room</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
              value={f.room_id}
              onChange={(e) => setF(s => ({ ...s, room_id: Number(e.target.value) }))}
              required
            >
              {rooms.length === 0
                ? <option value="">No rooms available</option>
                : rooms.map(r => <option key={r.id} value={r.id}>{r.number} — {r.type}</option>)
              }
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Guest Name</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
              value={f.guest_name}
              onChange={(e) => setF(s => ({ ...s, guest_name: e.target.value }))}
              required
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Guest Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
              value={f.guest_email}
              onChange={(e) => setF(s => ({ ...s, guest_email: e.target.value }))}
              placeholder="example@mail.com"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Total Price (USD)</label>
            <input
              type="number"
              step="0.01"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
              value={f.total_price}
              onChange={(e) => setF(s => ({ ...s, total_price: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Check-in</label>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
              value={f.check_in}
              onChange={(e) => setF(s => ({ ...s, check_in: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Check-out</label>
            <input
              type="date"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
              value={f.check_out}
              onChange={(e) => setF(s => ({ ...s, check_out: e.target.value }))}
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-sm mb-1">Status</label>
            <div className="flex gap-3">
              {["booked","checked_in","checked_out","cancelled"].map(s => (
                <label key={s} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={f.status === s}
                    onChange={() => setF(st => ({ ...st, status: s }))}
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
            <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2">Cancel</button>
            <button type="submit" className="rounded-lg bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Bookings() {
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState({ total: 0, byStatus: {}, upcoming7d: 0 });
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const data = await api("/api/bookings");
      setRooms(data.rooms || []);
      setRows(data.bookings || []);
      setStats(data.stats || { total: 0, byStatus: {}, upcoming7d: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(b =>
      (b.guest_name || "").toLowerCase().includes(term) ||
      (b.guest_email || "").toLowerCase().includes(term) ||
      (b.room_number || "").toLowerCase().includes(term) ||
      (b.room_type || "").toLowerCase().includes(term) ||
      (b.status || "").toLowerCase().includes(term)
    );
  }, [q, rows]);

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold">Bookings</h1>
        <div className="flex gap-3">
          <input
            className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
            placeholder="Search bookings…"
            value={q}
            onChange={(e)=>setQ(e.target.value)}
          />
          <button
            className="rounded-lg bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700"
            onClick={() => setOpen(true)}
          >
            + Add Booking
          </button>
        </div>
      </div>

      {/* wedges */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat title="Total" value={stats.total ?? 0} />
        <Stat title="Booked" value={stats.byStatus?.booked ?? 0} />
        <Stat title="Checked-in" value={stats.byStatus?.checked_in ?? 0} />
        <Stat title="Upcoming (7d)" value={stats.upcoming7d ?? 0} />
      </div>

      {/* table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 text-sm text-gray-600">
          {loading ? "Loading…" : `${filtered.length} of ${rows.length} bookings`}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-2">Guest</th>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">Room</th>
                <th className="text-left px-4 py-2">Type</th>
                <th className="text-left px-4 py-2">Check-in</th>
                <th className="text-left px-4 py-2">Check-out</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id} className="border-t">
                  <td className="px-4 py-2 font-medium">{b.guest_name}</td>
                  <td className="px-4 py-2">{b.guest_email || "-"}</td>
                  <td className="px-4 py-2">{b.room_number}</td>
                  <td className="px-4 py-2">{b.room_type}</td>
                  <td className="px-4 py-2">{b.check_in?.slice(0,10)}</td>
                  <td className="px-4 py-2">{b.check_out?.slice(0,10)}</td>
                  <td className="px-4 py-2">
                    <span className={
                      "rounded-full px-2 py-0.5 text-xs border " +
                      (b.status === "booked" ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                       b.status === "checked_in" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                       b.status === "checked_out" ? "bg-gray-50 text-gray-700 border-gray-200" :
                       "bg-rose-50 text-rose-700 border-rose-200")
                    }>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">${Number(b.total_price || 0).toFixed(2)}</td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-center text-gray-500" colSpan={8}>No bookings found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* modal */}
      <AddBookingModal open={open} onClose={() => setOpen(false)} rooms={rooms} onCreated={fetchAll} />
    </div>
  );
}
