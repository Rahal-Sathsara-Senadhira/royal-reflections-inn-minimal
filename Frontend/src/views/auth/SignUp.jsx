import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout.jsx";
import { api } from "../../lib/api.js";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      nav("/dashboard");
    } catch (e) {
      setError(e.message || "Sign up failed");
    }
  };

  return (
    <AuthLayout title="Create account" subtitle="Start managing the inn">
      <form className="space-y-4" onSubmit={onSubmit}>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <div>
          <label className="block text-sm font-medium mb-1">Full name</label>
          <input className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600" required value={name} onChange={e=>setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600" type="email" required value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-600" type="password" required value={password} onChange={e=>setPass(e.target.value)} />
        </div>
        <button className="inline-flex items-center justify-center rounded-lg px-4 py-2 font-medium bg-indigo-600 text-white hover:bg-indigo-700 w-full">
          Create account Now
        </button>
      </form>
      <div className="mt-4 text-sm text-center">
        Already have an account? <Link className="text-indigo-600 hover:underline" to="/">Sign in</Link>
      </div>
    </AuthLayout>
  );
}
