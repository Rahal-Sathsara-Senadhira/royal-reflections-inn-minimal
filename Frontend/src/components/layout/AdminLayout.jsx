import React from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Topbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          <Sidebar />
          <main className="flex-1 py-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
