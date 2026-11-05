import { useState } from "react";
import type { FormEvent } from "react";
import { AlertCircle, Eye, EyeOff, Home, Loader2, Lock, Mail, User as UserIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import type { User } from "../../context/AuthContext";

type Mode = "login" | "register";
type SignupRole = "guest" | "host";

interface AuthFormProps {
  onSuccess: (user: User, mode: Mode) => void;
  initialMode?: Mode;
  compact?: boolean;
}

const inputClass =
  "w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

export function AuthForm({ onSuccess, initialMode = "login", compact = false }: AuthFormProps) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [role, setRole] = useState<SignupRole>("guest");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const isLogin = mode === "login";

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (error) setError("");
  };

  const switchMode = () => {
    setMode(isLogin ? "register" : "login");
    setError("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLogin && form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const user = isLogin
        ? await login(form.email, form.password)
        : await register({ name: form.name.trim(), email: form.email, password: form.password, role });
      onSuccess(user, mode);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className={compact ? "mb-5" : "mb-8"}>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {isLogin ? "Welcome back" : "Create your account"}
        </h3>
        <p className="text-gray-600 text-sm">
          {isLogin ? "Sign in to manage your stays and bookings" : "Join UrbanStay in less than a minute"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <fieldset>
              <legend className="block text-sm font-semibold text-gray-900 mb-2">I want to</legend>
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    { value: "guest", label: "Book stays", Icon: UserIcon },
                    { value: "host", label: "Host property", Icon: Home },
                  ] as const
                ).map(({ value, label, Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRole(value)}
                    aria-pressed={role === value}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      role === value
                        ? "border-blue-600 bg-blue-50 text-blue-700"
                        : "border-gray-200 text-gray-700 hover:border-blue-300"
                    }`}
                  >
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    <div className="text-sm font-semibold">{label}</div>
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="auth-name" className="block text-sm font-semibold text-gray-900 mb-2">
                Full name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="auth-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Ali Khan"
                  value={form.name}
                  onChange={update("name")}
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </>
        )}

        <div>
          <label htmlFor="auth-email" className="block text-sm font-semibold text-gray-900 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={update("email")}
              className={inputClass}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="auth-password" className="block text-sm font-semibold text-gray-900 mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              id="auth-password"
              type={showPassword ? "text" : "password"}
              autoComplete={isLogin ? "current-password" : "new-password"}
              placeholder={isLogin ? "Your password" : "At least 6 characters"}
              value={form.password}
              onChange={update("password")}
              className={`${inputClass} pr-12`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {error && (
          <div role="alert" className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
        >
          {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
          {isLogin ? "Sign in" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        {isLogin ? "New to UrbanStay?" : "Already have an account?"}{" "}
        <button type="button" onClick={switchMode} className="text-blue-600 hover:underline font-semibold">
          {isLogin ? "Create an account" : "Sign in"}
        </button>
      </p>
    </div>
  );
}
