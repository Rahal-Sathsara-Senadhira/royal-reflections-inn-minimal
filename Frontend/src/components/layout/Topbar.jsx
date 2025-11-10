import React from "react";
import { currentUser, logout } from "../../lib/auth";

export default function Topbar() {
  const user = currentUser();
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white grid place-items-center font-bold">R</div>
          <span className="font-semibold">Royal Reflections Inn — Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 hidden sm:block">
            {user?.name || "Admin"}
          </span>
          <button
            onClick={logout}
            className="inline-flex items-center rounded-lg bg-gray-900 text-white text-sm px-3 py-1.5 hover:bg-gray-800"
            title="Logout"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zM20 3h-8v2h8v14h-8v2h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z"/>
            </svg>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
