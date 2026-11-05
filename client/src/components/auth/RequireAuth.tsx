import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { dashboardPathFor, useAuth } from "../../context/AuthContext";
import type { Role } from "../../context/AuthContext";

interface RequireAuthProps {
  children: ReactNode;
  /** If set, only these roles may see the page. */
  roles?: Role[];
}

export function RequireAuth({ children, roles }: RequireAuthProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500">
        <Loader2 className="w-6 h-6 animate-spin" aria-label="Loading" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={dashboardPathFor(user.role)} replace />;
  }

  return <>{children}</>;
}
