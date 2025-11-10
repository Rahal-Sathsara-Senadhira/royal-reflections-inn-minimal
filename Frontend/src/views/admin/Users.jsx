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

function AddUserModal({ open, onClose, onCreated }) {
  const [f, setF] = useState({ name: "", email: "", password: "", role: "staff" });
  const [err, setErr] = useState("");

  useEffect(() => {
    if (open) {
      setF({ name: "", email: "", password: "", role: "staff" });
      setErr("");
    }
  }, [open]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setErr("");
      await api("/api/users", { method: "POST", body: JSON.stringify(f) });
      onCreated?.();
      onClose();
    } catch (e) {
      setErr(e.message || "Failed to create user");
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 grid place-items-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add User</h3>
          <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>✕</button>
        </div>
        {err && <div className="mb-3 text-sm text-red-600">{err}</div>}
        <form className="grid grid-cols-1 gap-4" onSubmit={submit}>
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
              value={f.name}
              onChange={(e)=>setF(s=>({...s, name:e.target.value}))}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
              value={f.email}
              onChange={(e)=>setF(s=>({...s, email:e.target.value}))}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
              value={f.password}
              onChange={(e)=>setF(s=>({...s, password:e.target.value}))}
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Role</label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
              value={f.role}
              onChange={(e)=>setF(s=>({...s, role:e.target.value}))}
            >
              <option value="admin">admin</option>
              <option value="staff">staff</option>
              <option value="guest">guest</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2">Cancel</button>
            <button type="submit" className="rounded-lg bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Users() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState({ total: 0, admins: 0, staff: 0, guests: 0, recent7d: 0 });
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const data = await api("/api/users");
      setRows(data.users || []);
      setStats(data.stats || { total: 0, admins: 0, staff: 0, guests: 0, recent7d: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(u =>
      (u.name || "").toLowerCase().includes(term) ||
      (u.email || "").toLowerCase().includes(term) ||
      (u.role || "").toLowerCase().includes(term)
    );
  }, [q, rows]);

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold">Users</h1>
        <div className="flex gap-3">
          <input
            className="rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-indigo-600"
            placeholder="Search users…"
            value={q}
            onChange={(e)=>setQ(e.target.value)}
          />
          <button className="rounded-lg bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700" onClick={() => setOpen(true)}>
            + Add User
          </button>
        </div>
      </div>

      {/* wedges */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Stat title="Total" value={stats.total ?? 0} />
        <Stat title="Admins" value={stats.admins ?? 0} />
        <Stat title="Staff" value={stats.staff ?? 0} />
        <Stat title="Guests" value={stats.guests ?? 0} />
        <Stat title="New (7d)" value={stats.recent7d ?? 0} />
      </div>

      {/* table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 text-sm text-gray-600">
          {loading ? "Loading…" : `${filtered.length} of ${rows.length} users`}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">Role</th>
                <th className="text-left px-4 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="px-4 py-2 font-medium">{u.name}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">
                    <span className={
                      "rounded-full px-2 py-0.5 text-xs border " +
                      (u.role === "admin" ? "bg-rose-50 text-rose-700 border-rose-200" :
                       u.role === "staff" ? "bg-indigo-50 text-indigo-700 border-indigo-200" :
                       "bg-gray-50 text-gray-700 border-gray-200")
                    }>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-2">{new Date(u.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td className="px-4 py-6 text-center text-gray-500" colSpan={4}>No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddUserModal open={open} onClose={() => setOpen(false)} onCreated={fetchAll} />
    </div>
  );
}
