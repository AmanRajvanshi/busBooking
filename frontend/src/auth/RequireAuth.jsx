import { Navigate, Outlet } from "react-router";

const RequireAuth = ({ role }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Not logged in → go to login
  if (!token) return <Navigate to="/login" replace />;

  // Role mismatch → go to login
  if (role && user.role !== role) return <Navigate to="/login" replace />;

  // Auth OK → load the child routes
  return <Outlet />;
};

export default RequireAuth;
