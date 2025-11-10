import React from "react";
import { createBrowserRouter } from "react-router-dom";

import SignIn from "./views/auth/SignIn.jsx";
import SignUp from "./views/auth/SignUp.jsx";

import Protected from "./components/Protected.jsx";
import AdminLayout from "./components/layout/AdminLayout.jsx";

import Dashboard from "./views/admin/Dashboard.jsx";
import Rooms from "./views/admin/Rooms.jsx";
import Bookings from "./views/admin/Bookings.jsx";
import Users from "./views/admin/Users.jsx";
import Settings from "./views/admin/Settings.jsx";

const router = createBrowserRouter([
  // auth
  { path: "/", element: <SignIn /> },
  { path: "/signup", element: <SignUp /> },

  // admin (protected)
  {
    path: "/",
    element: (
      <Protected>
        <AdminLayout />
      </Protected>
    ),
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/rooms", element: <Rooms /> },
      { path: "/bookings", element: <Bookings /> },
      { path: "/users", element: <Users /> },
      { path: "/settings", element: <Settings /> },
    ],
  },
]);

export default router;
