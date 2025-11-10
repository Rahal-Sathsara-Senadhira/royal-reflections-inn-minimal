import React from "react";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-2xl p-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome, {user.name || "Admin"}.</p>
      </div>
    </div>
  );
}
