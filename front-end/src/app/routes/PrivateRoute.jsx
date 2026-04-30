import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";

export default function PrivateRoute() {
  const { isAuthenticated, isBootstrapping } = useAuth();

  if (isBootstrapping) {
    return null;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
