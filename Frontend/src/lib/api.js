const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

export async function api(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
    credentials: "omit",
    ...opts,
  });

  const ct = res.headers.get("content-type") || "";
  const body = ct.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const msg = typeof body === "string" ? body : body?.error || res.statusText;
    throw new Error(msg || `HTTP ${res.status}`);
  }
  return body;
}
