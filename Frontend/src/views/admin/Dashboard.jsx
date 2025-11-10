import React from "react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-sm text-gray-500">Total Rooms</div>
          <div className="mt-2 text-2xl font-semibold">42</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-sm text-gray-500">Booked Today</div>
          <div className="mt-2 text-2xl font-semibold">7</div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="text-sm text-gray-500">Occupancy</div>
          <div className="mt-2 text-2xl font-semibold">68%</div>
        </div>
      </div>
    </div>
  );
}
