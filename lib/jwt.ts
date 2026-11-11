/**
 * Universal JWT utilities compatible with:
 * - Next.js Edge Middleware
 * - Node.js Server Runtime
 * - Browser Client Components
 */

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: "user" | "admin";
  phone?: string;
  memberPoints?: number;
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

/**
 * Universal base64url decoder
 */
export function base64UrlDecode(input: string): string {
  try {
    let base64 = input.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    if (typeof Buffer !== "undefined") {
      return Buffer.from(base64, "base64").toString("utf-8");
    }
    if (typeof atob === "function") {
      const binaryStr = atob(base64);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      return new TextDecoder().decode(bytes);
    }
  } catch (err) {
    // Decoding failed
  }
  return "";
}

/**
 * Universal base64url encoder
 */
export function base64UrlEncode(input: string): string {
  try {
    let base64 = "";
    if (typeof Buffer !== "undefined") {
      base64 = Buffer.from(input, "utf-8").toString("base64");
    } else if (typeof btoa === "function") {
      const bytes = new TextEncoder().encode(input);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      base64 = btoa(binary);
    }
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  } catch (err) {
    return "";
  }
}

/**
 * Decode JWT token payload without external library dependencies
 */
export function decodeJwt<T = JwtPayload>(token: string | null | undefined): T | null {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 3) {
    // If it's a legacy or mock raw token formatted as user_xxx, handle gracefully
    return null;
  }

  try {
    const jsonStr = base64UrlDecode(parts[1]);
    if (!jsonStr) return null;
    return JSON.parse(jsonStr) as T;
  } catch (e) {
    return null;
  }
}

/**
 * Check if a JWT token is expired or invalid
 */
export function isTokenExpired(token: string | null | undefined): boolean {
  if (!token) return true;
  const payload = decodeJwt(token);
  // Crucial fix: an unparseable or null payload is invalid and MUST be treated as expired
  if (!payload) return true;
  if (!payload.exp) return false; // If no exp specified, consider valid
  // exp is in seconds, Date.now() in milliseconds
  return Date.now() >= payload.exp * 1000;
}

/**
 * Generate a standalone mock JWT token with role and expiry
 * Used for development or mock fallback when backend is unreachable
 */
export function generateMockJwt(data: {
  id?: string;
  sub?: string;
  email: string;
  name: string;
  role?: "user" | "admin";
  phone?: string;
  memberPoints?: number;
}): string {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const nowSeconds = Math.floor(Date.now() / 1000);
  const payload: JwtPayload = {
    sub: data.sub || data.id || `usr_${Date.now()}`,
    email: data.email,
    name: data.name,
    role: data.role || (data.email.toLowerCase().includes("admin") ? "admin" : "user"),
    phone: data.phone || "012 345 678",
    memberPoints: data.memberPoints ?? (data.role === "admin" ? 1000 : 350),
    iat: nowSeconds,
    exp: nowSeconds + 7 * 24 * 60 * 60, // 7 days
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  // Deterministic mock signature
  const mockSignature = base64UrlEncode(`mock_sig_${data.email}_${payload.exp}`);

  return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
}
