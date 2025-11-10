import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthed } from "../lib/auth";

export default function Protected({ children }) {
  if (!isAuthed()) return <Navigate to="/" replace />;
  return children;
}
