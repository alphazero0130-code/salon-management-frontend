import { Navigate, useLocation } from "react-router";
import { useUser } from "../context/UserContext";
import { Shell } from "./Shell";

export function Protected({ children, admin = false }) {
  const { user } = useUser();
  const location = useLocation();
  if (!user)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (admin && user.role !== "admin")
    return <Navigate to="/appointments" replace />;
  return <Shell>{children}</Shell>;
}
