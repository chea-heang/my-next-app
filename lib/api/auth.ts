import { apiClient, ApiClientError } from "./client";
import { User } from "@/types";
import { generateMockJwt } from "@/lib/jwt";
import { mockCurrentUser } from "@/lib/data";

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password?: string;
  phone?: string;
}

export interface AuthResult {
  success: boolean;
  message?: string;
  token?: string;
  refresh_token?: string;
  user?: User;
}

// Built-in mock accounts for offline/demo operation
export const MOCK_ADMIN_USER: User = {
  id: "usr_admin_999",
  name: "អ្នកគ្រប់គ្រងប្រព័ន្ធ (Admin Director)",
  email: "admin@cinemas.kh",
  phone: "012 999 888",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  role: "admin",
  memberPoints: 9999,
};

export const MOCK_DEFAULT_USER: User = {
  ...mockCurrentUser,
  role: "user",
};

/**
 * Auth API Service with Live NestJS Backend + Automatic Mock Fallback
 */
export const authApi = {
  /**
   * Log in user
   * Tries POST /auth/login on NestJS backend.
   * If backend is offline (NetworkError), seamlessly falls back to mock auth.
   */
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const cleanEmail = credentials.email.toLowerCase().trim();
    const isAdmin =
      cleanEmail === "admin@cinemas.kh" ||
      cleanEmail === "admin@example.com" ||
      cleanEmail.includes("admin");

    try {
      // 1. Try real NestJS backend
      const res = await apiClient.post<any>("/auth/login", {
        email: cleanEmail,
        password: credentials.password || "password123",
      }, { skipAuth: true });

      // Live NestJS returns { access_token, refresh_token, user }
      if (res && res.access_token) {
        const user: User = {
          id: res.user?.id || `usr_${Date.now()}`,
          name: res.user?.name || cleanEmail.split("@")[0],
          email: res.user?.email || cleanEmail,
          phone: res.user?.phone || "012 345 678",
          avatar:
            res.user?.avatar ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
          role: isAdmin ? "admin" : (res.user?.role || "user"),
          memberPoints: res.user?.memberPoints || (isAdmin ? 5000 : 350),
        };

        apiClient.setToken(res.access_token);
        return {
          success: true,
          message: "ចូលគណនីជោគជ័យ (NestJS Backend)",
          token: res.access_token,
          refresh_token: res.refresh_token,
          user,
        };
      }
    } catch (err: unknown) {
      if (err instanceof ApiClientError && !err.isNetworkError) {
        // Real backend returned 400 or 401 (e.g. invalid password)
        return {
          success: false,
          message: err.message || "Email ឬ Password មិនត្រឹមត្រូវ!",
        };
      }
      // If network error (backend offline), proceed to mock fallback below
    }

    // 2. Mock Fallback (when backend is offline)
    const mockUser: User = isAdmin
      ? { ...MOCK_ADMIN_USER, email: cleanEmail }
      : cleanEmail === mockCurrentUser.email.toLowerCase()
      ? { ...MOCK_DEFAULT_USER }
      : {
          id: `usr_${Date.now()}`,
          name: cleanEmail.split("@")[0],
          email: cleanEmail,
          phone: "012 345 678",
          avatar:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
          role: "user",
          memberPoints: 100,
        };

    const mockToken = generateMockJwt(mockUser);
    apiClient.setToken(mockToken);

    return {
      success: true,
      message: isAdmin
        ? "ចូលគណនី Admin ជោគជ័យ (Demo Mode)!"
        : "ចូលគណនីជោគជ័យ (Demo Mode)!",
      token: mockToken,
      user: mockUser,
    };
  },

  /**
   * Register new user
   */
  async register(data: RegisterPayload): Promise<AuthResult> {
    const cleanEmail = data.email.toLowerCase().trim();

    try {
      // 1. Try real NestJS backend
      const res = await apiClient.post<any>("/auth/register", {
        name: data.name,
        email: cleanEmail,
        password: data.password || "password123",
      }, { skipAuth: true });

      // If registered, auto-login
      if (res && res.id) {
        return await this.login({
          email: cleanEmail,
          password: data.password,
        });
      }
    } catch (err: unknown) {
      if (err instanceof ApiClientError && !err.isNetworkError) {
        return {
          success: false,
          message: err.message || "ការចុះឈ្មោះមិនបានសម្រេច!",
        };
      }
    }

    // 2. Mock Fallback
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: data.name,
      email: cleanEmail,
      phone: data.phone || "012 345 678",
      avatar:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      role: cleanEmail.includes("admin") ? "admin" : "user",
      memberPoints: 50,
    };

    const mockToken = generateMockJwt(newUser);
    apiClient.setToken(mockToken);

    return {
      success: true,
      message: "ចុះឈ្មោះជោគជ័យ! អ្នកទទួលបាន 50 ពិន្ទុ VIP (Demo Mode)",
      token: mockToken,
      user: newUser,
    };
  },

  /**
   * Get current authenticated profile
   * Supports both /auth/me and /auth/profile NestJS endpoints
   */
  async getProfile(): Promise<User | null> {
    try {
      let res: any = null;
      try {
        res = await apiClient.get<any>("/auth/me");
      } catch {
        res = await apiClient.get<any>("/auth/profile");
      }
      if (res && (res.id || res.email)) {
        return {
          id: res.id || `usr_${Date.now()}`,
          name: res.name || (res.email ? res.email.split("@")[0] : "User"),
          email: res.email,
          phone: res.phone || "012 345 678",
          avatar:
            res.avatar ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
          role: res.role || (res.email?.includes("admin") ? "admin" : "user"),
          memberPoints: res.memberPoints ?? (res.role === "admin" ? 1000 : 350),
        };
      }
    } catch {
      // Backend not available or unauthorized
    }
    return null;
  },

  /**
   * Update profile
   */
  async updateProfile(data: {
    name?: string;
    email?: string;
    phone?: string;
  }): Promise<{ success: boolean; user?: User; message?: string }> {
    try {
      const res = await apiClient.patch<any>("/auth/profile", data);
      if (res && res.id) {
        const updated: User = {
          id: res.id,
          name: res.name,
          email: res.email,
          phone: data.phone || res.phone || "012 345 678",
          avatar:
            res.avatar ||
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
          role: res.role || "user",
          memberPoints: res.memberPoints || 350,
        };
        return { success: true, user: updated, message: "ព័ត៌មានត្រូវបានកែសម្រួល!" };
      }
    } catch (err: unknown) {
      if (err instanceof ApiClientError && !err.isNetworkError) {
        return { success: false, message: err.message };
      }
    }

    return {
      success: true,
      message: "បានកែប្រែដោយជោគជ័យ (Demo Mode)",
    };
  },

  /**
   * Logout
   */
  async logout(refreshToken?: string): Promise<void> {
    try {
      if (refreshToken) {
        await apiClient.post("/auth/logout", { refresh_token: refreshToken });
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      apiClient.setToken(null);
    }
  },
};
