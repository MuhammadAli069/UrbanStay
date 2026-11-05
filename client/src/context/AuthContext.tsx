import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { api, ApiError, tokenStore } from "../lib/api";

export type Role = "guest" | "host" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: Exclude<Role, "admin">;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  /** True while a saved session is being restored on page load. */
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => void;
  /** Replace the signed-in user's details, e.g. after the server changes their role. */
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** Initials for avatar circles, e.g. "Ali Khan" -> "AK". */
export function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}

export function dashboardPathFor(role: Role) {
  if (role === "admin") return "/admin";
  if (role === "host") return "/host";
  return "/profile";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(() => tokenStore.get() !== null);

  // Restore the session from a saved token.
  useEffect(() => {
    if (!tokenStore.get()) return;
    api<{ user: User }>("/auth/me")
      .then(({ user }) => setUser(user))
      .catch((err) => {
        if (err instanceof ApiError && err.status === 401) tokenStore.clear();
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleAuth = useCallback(({ token, user }: AuthResponse) => {
    tokenStore.set(token);
    setUser(user);
    return user;
  }, []);

  const login = useCallback(
    async (email: string, password: string) =>
      handleAuth(
        await api<AuthResponse>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password }),
        })
      ),
    [handleAuth]
  );

  const register = useCallback(
    async (input: RegisterInput) =>
      handleAuth(
        await api<AuthResponse>("/auth/register", {
          method: "POST",
          body: JSON.stringify(input),
        })
      ),
    [handleAuth]
  );

  const logout = useCallback(() => {
    tokenStore.clear();
    setUser(null);
  }, []);

  const updateUser = useCallback((next: User) => setUser(next), []);

  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, isLoading, login, register, logout, updateUser }),
    [user, isLoading, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
