export function isAuthed() {
  return !!localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/"; // back to Sign in
}

export function currentUser() {
  try { return JSON.parse(localStorage.getItem("user") || "{}"); }
  catch { return {}; }
}
