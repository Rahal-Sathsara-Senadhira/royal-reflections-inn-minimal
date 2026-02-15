import React from "react";

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen grid place-items-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-indigo-600 grid place-items-center text-white font-bold">R</div>
          <h1 className="mt-4 text-3xl font-semibold">{title}</h1>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <div className="bg-white shadow-sm rounded-2xl border border-gray-100 p-6">
          {children}
        </div>
        <p className="text-center text-xs text-gray-500">
          Royal Reflections Inn — Admin Portal
        </p>
      </div>
    </div>
  );
}
