import React, { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";

function StatCard({ title, value, hint }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {hint && <div className="text-xs text-gray-400 mt-1">{hint}</div>}
    </div>
  );
}

function TypeWedge({ name, count }) {
  return (
    <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 flex items-center justify-between">
      <div className="font-medium text-indigo-800">{name}</div>
      <div className="text-indigo-600">{count}</div>
    </div>
  );
}

function AddRoomModal({ open, onClose, types, onCreated }) {
  const [form, setForm] = useState({
    number: "",
    type_id: "",
    beds: 1,
    price: 0,
    status: "available",
  });
  const [err, setErr] = useState("");

  useEffect(() => {
    if (open) {
      setForm({
        number: "",
        type_id: types?.[0]?.id || "",
        beds: 1,
        price: 0,
        status: "available",
      });
      setErr("");
    }
  }, [open, types]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setErr("");
      await api("/api/rooms", {
        method: "POST",
        body: JSON.stringify(form),
      });
      onCreated?.();
      onClose();
    } catch (e) {
      setErr(e.message || "Failed to add room");
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add Room</h3>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        {err && <div className="mb-3 text-sm text-red-600">{err}</div>}
        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          onSubmit={submit}
        >
          <div>
            <label className="block text-sm mb-1">Room Number</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
              value={form.number}
              onChange={(e) =>
                setForm((f) => ({ ...f, number: e.target.value }))
              }
              required
              placeholder="e.g., 204"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Type</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
              value={form.type_id}
              onChange={(e) =>
                setForm((f) => ({ ...f, type_id: Number(e.target.value) }))
              }
              required
            >
              {types.length === 0 ? (
                <option value="">No types found — seed the DB</option>
              ) : (
                types.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))
              )}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Beds</label>
            <input
              type="number"
              min={1}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
              value={form.beds}
              onChange={(e) =>
                setForm((f) => ({ ...f, beds: Number(e.target.value) }))
              }
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Price (USD)</label>
            <input
              type="number"
              step="0.01"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: Number(e.target.value) }))
              }
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm mb-1">Status</label>
            <div className="flex gap-3">
              {["available", "occupied", "maintenance"].map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    checked={form.status === s}
                    onChange={() => setForm((f) => ({ ...f, status: s }))}
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>
          <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Rooms() {
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({ byType: {}, totals: {} });
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const data = await api("/api/rooms");
      setTypes(data.types || []);
      setRooms(data.rooms || []);
      setStats(data.stats || { byType: {}, totals: {} });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rooms;
    return rooms.filter(
      (r) =>
        r.number.toLowerCase().includes(term) ||
        r.type.toLowerCase().includes(term) ||
        String(r.beds).includes(term) ||
        r.status.toLowerCase().includes(term)
    );
  }, [q, rooms]);

  return (
    <div className="space-y-6">
      {/* header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold">Rooms</h1>
        <div className="flex gap-3">
          <input
            className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
            placeholder="Search rooms…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button
            className="rounded-lg bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700"
            onClick={() => setOpen(true)}
          >
            + Add Room
          </button>
        </div>
      </div>

      {/* wedges */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Rooms" value={stats.totals?.totalRooms ?? 0} />
        <StatCard title="Available" value={stats.totals?.available ?? 0} />
        <StatCard title="Occupied" value={stats.totals?.occupied ?? 0} />
        <StatCard title="Maintenance" value={stats.totals?.maintenance ?? 0} />
      </div>

      {/* by-type wedges */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {types.map((t) => (
          <TypeWedge
            key={t.id}
            name={t.name}
            count={stats.byType?.[t.name] ?? 0}
          />
        ))}
      </div>

      {/* table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 text-sm text-gray-600">
          {loading ? "Loading…" : `${filtered.length} of ${rooms.length} rooms`}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-2">Room #</th>
                <th className="text-left px-4 py-2">Type</th>
                <th className="text-left px-4 py-2">Beds</th>
                <th className="text-left px-4 py-2">Price</th>
                <th className="text-left px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-4 py-2 font-medium">{r.number}</td>
                  <td className="px-4 py-2">{r.type}</td>
                  <td className="px-4 py-2">{r.beds}</td>
                  <td className="px-4 py-2">${Number(r.price).toFixed(2)}</td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        "rounded-full px-2 py-0.5 text-xs " +
                        (r.status === "available"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : r.status === "occupied"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200")
                      }
                    >
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-6 text-center text-gray-500"
                    colSpan={5}
                  >
                    No rooms match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* modal */}
      <AddRoomModal
        open={open}
        onClose={() => setOpen(false)}
        types={types}
        onCreated={fetchAll}
      />
    </div>
  );
}
