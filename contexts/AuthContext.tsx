"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { User } from "@/types";
import { mockCurrentUser } from "@/lib/data";

interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
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
  quickLogin: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "user_session";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"login" | "register">("login");

  // Load user session on mount
  useEffect(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        queueMicrotask(() => {
          setUser(parsed);
          setIsLoading(false);
        });
        return;
      }
    } catch (e) {
      console.error("Failed to parse user session", e);
    }
    queueMicrotask(() => setIsLoading(false));
  }, []);

  const openLoginModal = useCallback((mode: "login" | "register" = "login") => {
    setModalMode(mode);
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, []);

  const saveUserSession = (userData: User) => {
    setUser(userData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch (e) {
      console.error("Failed to save user session", e);
    }
  };

  const login = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", email, password }),
      });
      const data = await res.json();

      if (data.success && data.user) {
        saveUserSession(data.user);
        setIsLoginModalOpen(false);
        return { success: true, message: data.message };
      } else {
        return {
          success: false,
          message: data.message || "Email ឬ Password មិនត្រឹមត្រូវ!",
        };
      }
    } catch {
      // Fallback demo user if network/API fails
      const fallbackUser: User = {
        ...mockCurrentUser,
        name: email ? email.split("@")[0] : mockCurrentUser.name,
        email: email || mockCurrentUser.email,
      };
      saveUserSession(fallbackUser);
      setIsLoginModalOpen(false);
      return { success: true, message: "ចូលគណនីជោគជ័យ (Demo Mode)!" };
    }
  };

  const register = async (
    data: RegisterData
  ): Promise<{ success: boolean; message?: string }> => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "register", ...data }),
      });
      const resData = await res.json();

      if (resData.success && resData.user) {
        saveUserSession(resData.user);
        setIsLoginModalOpen(false);
        return { success: true, message: resData.message };
      } else {
        return {
          success: false,
          message: resData.message || "ការចុះឈ្មោះមិនបានសម្រេច!",
        };
      }
    } catch {
      const newUser: User = {
        id: `usr_${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone || "012 345 678",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        role: "user",
        memberPoints: 50,
      };
      saveUserSession(newUser);
      setIsLoginModalOpen(false);
      return { success: true, message: "ចុះឈ្មោះជោគជ័យ (Demo Mode)!" };
    }
  };

  const quickLogin = useCallback(() => {
    saveUserSession(mockCurrentUser);
    setIsLoginModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error("Failed to remove user session", e);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoginModalOpen,
        modalMode,
        setModalMode,
        openLoginModal,
        closeLoginModal,
        login,
        register,
        quickLogin,
        logout,
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
