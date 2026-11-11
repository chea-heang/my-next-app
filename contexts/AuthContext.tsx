"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { User } from "@/types";
import { authApi, MOCK_ADMIN_USER, MOCK_DEFAULT_USER } from "@/lib/api/auth";
import { apiClient } from "@/lib/api/client";
import { decodeJwt, isTokenExpired } from "@/lib/jwt";

interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoginModalOpen: boolean;
  modalMode: "login" | "register";
  setModalMode: (mode: "login" | "register") => void;
  openLoginModal: (mode?: "login" | "register") => void;
  closeLoginModal: () => void;
  login: (
    email: string,
    password?: string
  ) => Promise<{ success: boolean; message?: string }>;
  register: (
    data: RegisterData
  ) => Promise<{ success: boolean; message?: string }>;
  quickLogin: (role?: "user" | "admin") => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: {
    name?: string;
    email?: string;
    phone?: string;
  }) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_USER_KEY = "user_session";
const STORAGE_TOKEN_KEY = "auth_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"login" | "register">("login");

  // Sync token to cookie via server route handler for Edge middleware
  const syncCookieSession = async (jwtToken: string | null): Promise<void> => {
    try {
      if (jwtToken) {
        await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: jwtToken }),
        });
      } else {
        await fetch("/api/auth/session", {
          method: "DELETE",
        });
      }
    } catch (e) {
      console.error("Failed to sync session cookie", e);
    }
  };

  // Synchronize state, localStorage, and HttpOnly session cookie
  const commitSession = async (userData: User, jwtToken: string): Promise<void> => {
    setUser(userData);
    setToken(jwtToken);
    apiClient.setToken(jwtToken);

    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));
      localStorage.setItem(STORAGE_TOKEN_KEY, jwtToken);
    } catch (e) {
      console.error("Failed to persist user session", e);
    }

    // Await cookie sync to avoid race condition where route middleware runs before cookie is set
    await syncCookieSession(jwtToken);
  };

  const clearSession = async (): Promise<void> => {
    setUser(null);
    setToken(null);
    apiClient.setToken(null);

    try {
      localStorage.removeItem(STORAGE_USER_KEY);
      localStorage.removeItem(STORAGE_TOKEN_KEY);
    } catch (e) {
      console.error("Failed to clear local session", e);
    }

    await syncCookieSession(null);
  };

  // Load user session on mount: checks localStorage and HttpOnly cookie session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        let activeToken =
          typeof window !== "undefined"
            ? localStorage.getItem(STORAGE_TOKEN_KEY)
            : null;
        let activeUserStr =
          typeof window !== "undefined"
            ? localStorage.getItem(STORAGE_USER_KEY)
            : null;

        // If no token in localStorage, query server-side HttpOnly cookie session
        if (!activeToken) {
          try {
            const sessionRes = await fetch("/api/auth/session");
            if (sessionRes.ok) {
              const sessionData = await sessionRes.json();
              if (sessionData.authenticated && sessionData.token) {
                activeToken = sessionData.token;
              }
            }
          } catch {
            // Server route unavailable
          }
        }

        if (activeToken && !isTokenExpired(activeToken)) {
          apiClient.setToken(activeToken);
          setToken(activeToken);

          if (activeUserStr) {
            try {
              const parsedUser: User = JSON.parse(activeUserStr);
              const payload = decodeJwt(activeToken);
              if (payload && payload.role) {
                parsedUser.role = payload.role;
              }
              setUser(parsedUser);
            } catch {
              activeUserStr = null;
            }
          }

          if (!activeUserStr) {
            // Restore user profile from token claims
            const payload = decodeJwt(activeToken);
            if (payload) {
              const restored: User = {
                id: payload.sub || `usr_${Date.now()}`,
                name: payload.name || "User",
                email: payload.email || "",
                phone: payload.phone || "012 345 678",
                role: payload.role || "user",
                memberPoints: payload.memberPoints || 100,
              };
              setUser(restored);
              try {
                localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(restored));
                localStorage.setItem(STORAGE_TOKEN_KEY, activeToken);
              } catch {}
            }
          }

          // Ensure HttpOnly cookie is updated with current active token
          syncCookieSession(activeToken);

          // Background auto-refresh user profile from NestJS /auth/me or /auth/profile
          authApi.getProfile().then((freshProfile) => {
            if (freshProfile) {
              setUser(freshProfile);
              try {
                localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(freshProfile));
              } catch {}
            }
          }).catch(() => {});
        } else if (activeToken && isTokenExpired(activeToken)) {
          await clearSession();
        }
      } catch (err) {
        console.error("Auth initialization error", err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen to 401 Unauthorized from API client
    const unregister = apiClient.onUnauthorized(() => {
      console.warn("401 Unauthorized received, logging out...");
      clearSession();
    });

    return () => unregister();
  }, []);

  const openLoginModal = useCallback(
    (mode: "login" | "register" = "login") => {
      setModalMode(mode);
      setIsLoginModalOpen(true);
    },
    []
  );

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; message?: string }> => {
    const res = await authApi.login({ email, password });
    if (res.success && res.user && res.token) {
      await commitSession(res.user, res.token);
      return { success: true, message: res.message };
    }
    return {
      success: false,
      message: res.message || "Email ឬ Password មិនត្រឹមត្រូវ!",
    };
  };

  const register = async (
    data: RegisterData
  ): Promise<{ success: boolean; message?: string }> => {
    const res = await authApi.register(data);
    if (res.success && res.user && res.token) {
      await commitSession(res.user, res.token);
      return { success: true, message: res.message };
    }
    return {
      success: false,
      message: res.message || "ការចុះឈ្មោះមិនបានសម្រេច!",
    };
  };

  const quickLogin = useCallback(async (role: "user" | "admin" = "user") => {
    const targetEmail =
      role === "admin" ? MOCK_ADMIN_USER.email : MOCK_DEFAULT_USER.email;
    const res = await authApi.login({
      email: targetEmail,
      password: "password123",
    });

    if (res.success && res.user && res.token) {
      await commitSession(res.user, res.token);
      setIsLoginModalOpen(false);
    }
  }, []);

  const logout = useCallback(async () => {
    const currentToken = token;
    await authApi.logout(currentToken || undefined);
    await clearSession();
  }, [token]);

  const updateUserProfile = async (data: {
    name?: string;
    email?: string;
    phone?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    if (!user) return { success: false, message: "User not logged in" };

    const res = await authApi.updateProfile(data);
    const updatedUser: User = {
      ...user,
      name: data.name ?? user.name,
      email: data.email ?? user.email,
      phone: data.phone ?? user.phone,
    };

    setUser(updatedUser);
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updatedUser));
    } catch {}

    return {
      success: true,
      message: res.message || "បានកែប្រែដោយជោគជ័យ!",
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isLoginModalOpen,
        modalMode,
        setModalMode,
        openLoginModal,
        closeLoginModal,
        login,
        register,
        quickLogin,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
