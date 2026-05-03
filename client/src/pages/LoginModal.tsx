import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Mail, Lock, User, Eye, EyeOff, X, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState<"guest" | "host" | "admin">("guest");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const url = isLogin
    ? "http://localhost:5000/api/auth/login"
    : "http://localhost:5000/api/auth/register";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: userType,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Request failed");
      return;
    }

    login({
      name: data.name,
      email: data.email,
      avatar: "👤",
      role: data.role,
    });

    onClose();

    if (data.role === "admin") navigate("/admin");
    else if (data.role === "host") navigate("/host");

  } catch (err) {
    alert("Server not running or API error");
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h3>
            <p className="text-gray-600 text-sm">
              {isLogin ? "Sign in to continue" : "Join UrbanStay today"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* User Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            I am a:
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setUserType("guest")}
              className={`p-3 rounded-lg border-2 transition-all ${
                userType === "guest"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:border-blue-300"
              }`}
            >
              <User className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs font-semibold">Guest</div>
            </button>
            <button
              type="button"
              onClick={() => setUserType("host")}
              className={`p-3 rounded-lg border-2 transition-all ${
                userType === "host"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:border-blue-300"
              }`}
            >
              <Home className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs font-semibold">Host</div>
            </button>
            <button
              type="button"
              onClick={() => setUserType("admin")}
              className={`p-3 rounded-lg border-2 transition-all ${
                userType === "admin"
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-300 hover:border-blue-300"
              }`}
            >
              <AlertCircle className="w-5 h-5 mx-auto mb-1" />
              <div className="text-xs font-semibold">Admin</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {isLogin && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                <span className="text-gray-700">Remember me</span>
              </label>
              <a href="#" className="text-blue-600 hover:underline">
                Forgot password?
              </a>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:underline font-semibold"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors text-sm">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-semibold">Google</span>
            </button>
            <button className="flex items-center justify-center px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors text-sm">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span className="font-semibold">Facebook</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
