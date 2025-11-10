import React, { useState } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z"/></svg>
    ) },
  { to: "/rooms", label: "Rooms", icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v14H4z"/><path d="M2 20h20v2H2z"/></svg>
    ) },
  { to: "/bookings", label: "Bookings", icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h2v2h8V2h2v2h2v18H4V4h2V2zm0 6v12h12V8H6z"/></svg>
    ) },
  { to: "/users", label: "Users", icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5zm0 2c-4 0-8 2-8 5v3h16v-3c0-3-4-5-8-5z"/></svg>
    ) },
  { to: "/settings", label: "Settings", icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14 12.94a7.06 7.06 0 0 0 0-1.88l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.08 7.08 0 0 0-1.62-.94l-.36-2.54a.5.5 0 0 0-.5-.42h-3.84a.5.5 0 0 0-.5.42l-.36 2.54a7.08 7.08 0 0 0-1.62.94l-2.39-.96a.5.5 0 0 0-.6.22L2.71 8.84a.5.5 0 0 0 .12.64l2.03 1.58a7.06 7.06 0 0 0 0 1.88L2.83 15.7a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.39 1.05.71 1.62.94l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54c.57-.23 1.12-.55 1.62-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 15.5 12 3.5 3.5 0 0 1 12 15.5z"/></svg>
    ) },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <aside className={`${open ? "w-64" : "w-16"} transition-all duration-200 border-r border-gray-200 bg-white h-[calc(100vh-56px)] sticky top-14`}>
      <div className="p-3 flex items-center justify-between">
        <span className={`text-sm font-semibold text-gray-700 ${open ? "block" : "hidden"}`}>Navigation</span>
        <button
          className="rounded-md border px-2 py-1 text-xs hover:bg-gray-50"
          onClick={() => setOpen(o => !o)}
          title="Toggle"
        >
          {open ? "«" : "»"}
        </button>
      </div>

      <nav className="px-2">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2 mb-1 text-sm ${
                isActive ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"
              }`
            }
          >
            <span className="text-gray-500">{l.icon}</span>
            <span className={`${open ? "block" : "hidden"}`}>{l.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
