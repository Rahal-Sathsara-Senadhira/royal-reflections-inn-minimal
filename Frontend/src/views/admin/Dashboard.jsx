import { useEffect, useMemo, useState } from "react";

/** Small helper for GET with graceful fallback */
async function getJSON(url, fallback = null) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  } catch {
    return fallback;
  }
}

function StatCard({ label, value, sub, icon }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="text-gray-400">{icon}</span>
      </div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {sub ? <div className="mt-1 text-xs text-gray-500">{sub}</div> : null}
    </div>
  );
}

function ProgressBar({ value, max, label }) {
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-end justify-between gap-2">
        <div className="text-sm text-gray-600">{label}</div>
        <div className="text-sm tabular-nums text-gray-500">{pct}%</div>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-indigo-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function MiniKPI({ title, value, delta }) {
  const up = delta > 0;
  const color = up ? "text-emerald-600" : delta < 0 ? "text-rose-600" : "text-gray-600";
  const sign = up ? "▲" : delta < 0 ? "▼" : "•";
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
      <div className={`mt-1 text-xs ${color}`}>{sign} {Math.abs(delta)}%</div>
    </div>
  );
}

function RecentBookings({ rows }) {
  return (
    <div className="rounded-2xl border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold text-gray-700">Recent bookings</h3>
        <a href="/bookings" className="text-sm text-indigo-600 hover:underline">View all</a>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Guest</th>
              <th className="px-4 py-2 text-left font-medium">Room</th>
              <th className="px-4 py-2 text-left font-medium">Dates</th>
              <th className="px-4 py-2 text-left font-medium">Status</th>
              <th className="px-4 py-2 text-right font-medium">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-gray-500" colSpan={5}>
                  No recent bookings yet.
                </td>
              </tr>
            ) : rows.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50/60">
                <td className="px-4 py-3">
                  <div className="font-medium">{b.guest_name}</div>
                  <div className="text-xs text-gray-500">{b.guest_email}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">#{b.room_number}</div>
                  <div className="text-xs text-gray-500">{b.room_type}</div>
                </td>
                <td className="px-4 py-3">
                  <div>{b.check_in} → {b.check_out}</div>
                  <div className="text-xs text-gray-500">{b.nights} nights</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${
                    b.status === "confirmed" ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : b.status === "checked_in" ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}>
                    {b.status.replace("_"," ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-right tabular-nums">${b.total?.toFixed?.(2) ?? "0.00"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch stats + recent bookings from your backend (routes are lightweight; if missing, we fall back)
  useEffect(() => {
    (async () => {
      setLoading(true);
      const s = await getJSON("/api/stats", null);
      const r = await getJSON("/api/bookings/recent", []);
      setStats(s);
      setRecent(r);
      setLoading(false);
    })();
  }, []);

  // Safe derived values + nice defaults
  const derived = useMemo(() => {
    const s = stats || {
      rooms_total: 0,
      rooms_available: 0,
      rooms_occupied: 0,
      rooms_maintenance: 0,
      checkins_today: 0,
      checkouts_today: 0,
      revenue_today: 0,
      occupancy_pct: 0,
      adr: 0, // average daily rate
      revpar: 0,
      deltas: { revenue: 0, occupancy: 0, adr: 0 },
    };
    const occPct = s.occupancy_pct || Math.round((s.rooms_occupied / Math.max(1, s.rooms_total)) * 100);
    return { ...s, occupancy_pct: occPct };
  }, [stats]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <div className="flex gap-2">
          <a href="/bookings/new" className="btn bg-indigo-600 text-white hover:bg-indigo-700">+ New booking</a>
          <a href="/rooms" className="btn border border-gray-300 hover:bg-gray-50">Manage rooms</a>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Rooms" value={derived.rooms_total} sub="All inventory" icon="🏨" />
        <StatCard label="Available" value={derived.rooms_available} sub="Ready to sell" icon="✅" />
        <StatCard label="Occupied" value={derived.rooms_occupied} sub="Currently in-house" icon="🛎️" />
        <StatCard label="Maintenance" value={derived.rooms_maintenance} sub="Out of order" icon="🧰" />
      </div>

      {/* Middle row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MiniKPI title="Revenue (today)" value={`$${(derived.revenue_today ?? 0).toLocaleString()}`} delta={derived.deltas?.revenue ?? 0} />
            <MiniKPI title="Occupancy" value={`${derived.occupancy_pct}%`} delta={derived.deltas?.occupancy ?? 0} />
            <MiniKPI title="ADR" value={`$${(derived.adr ?? 0).toFixed(0)}`} delta={derived.deltas?.adr ?? 0} />
          </div>
          <RecentBookings rows={recent} />
        </div>

        <div className="space-y-4">
          <ProgressBar value={derived.rooms_occupied} max={Math.max(1, derived.rooms_total)} label="Occupancy today" />
          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="mb-3 text-sm font-semibold text-gray-700">Today’s flow</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border bg-gray-50 p-3">
                <div className="text-xs text-gray-500">Check-ins</div>
                <div className="mt-1 text-2xl font-semibold">{derived.checkins_today}</div>
              </div>
              <div className="rounded-xl border bg-gray-50 p-3">
                <div className="text-xs text-gray-500">Check-outs</div>
                <div className="mt-1 text-2xl font-semibold">{derived.checkouts_today}</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-500">
              {loading ? "Loading live data…" : "Live stats from /api/stats"}
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-4 shadow-sm">
            <div className="mb-3 text-sm font-semibold text-gray-700">Quick actions</div>
            <div className="grid gap-2">
              <a href="/rooms/new" className="btn border border-gray-300 hover:bg-gray-50">Add room</a>
              <a href="/users" className="btn border border-gray-300 hover:bg-gray-50">Invite staff</a>
              <a href="/settings" className="btn border border-gray-300 hover:bg-gray-50">Property settings</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
