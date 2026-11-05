import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { toast } from "sonner";
import { AuthForm } from "../components/auth/AuthForm";
import { dashboardPathFor, useAuth } from "../context/AuthContext";
import type { User } from "../context/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();

  // Where to go after signing in (set by RequireAuth or "sign in to continue" prompts).
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;

  const destinationFor = (u: User) => from || (u.role === "guest" ? "/" : dashboardPathFor(u.role));

  if (isAuthenticated && user) {
    return <Navigate to={destinationFor(user)} replace />;
  }

  const handleSuccess = (signedIn: User, mode: "login" | "register") => {
    toast.success(mode === "login" ? `Welcome back, ${signedIn.name.split(" ")[0]}!` : "Account created");
    navigate(destinationFor(signedIn), { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="text-white space-y-6 text-center lg:text-left">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center">
              <Home className="w-8 h-8 text-blue-600" />
            </div>
            <span className="text-3xl font-bold">UrbanStay</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">Find your perfect urban stay</h1>
          <p className="text-lg text-blue-100 max-w-md mx-auto lg:mx-0">
            Book apartments, adventures and local guides, or list your own place and start hosting.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto">
          <AuthForm onSuccess={handleSuccess} />
          <div className="mt-6 pt-6 border-t text-center">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 font-medium">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
