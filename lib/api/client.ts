/**
 * Core REST API Client (Native Fetch Layer)
 * Supports configurable base URL, JWT auto-attachment, 401 interception,
 * and error message normalization for NestJS + Mock fallback environments.
 */

export class ApiClientError extends Error {
  statusCode: number;
  data?: unknown;
  errors?: string[];
  isNetworkError: boolean;

  constructor(
    message: string,
    statusCode = 500,
    data?: unknown,
    errors?: string[],
    isNetworkError = false
  ) {
    super(message);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
    this.data = data;
    this.errors = errors;
    this.isNetworkError = isNetworkError;
  }
}

export interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  params?: Record<string, string | number | boolean | undefined>;
  skipAuth?: boolean;
}

type UnauthorizedHandler = () => void;

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private unauthorizedHandlers: Set<UnauthorizedHandler> = new Set();

  constructor() {
    this.baseUrl = (
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1"
    ).replace(/\/+$/, "");
  }

  /**
   * Set API base URL dynamically if needed
   */
  public setBaseUrl(url: string) {
    this.baseUrl = url.replace(/\/+$/, "");
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  /**
   * Store token in memory for rapid REST API requests
   */
  public setToken(token: string | null) {
    this.token = token;
  }

  public getToken(): string | null {
    return this.token;
  }

  /**
   * Register a callback to fire on 401 Unauthorized responses
   */
  public onUnauthorized(handler: UnauthorizedHandler): () => void {
    this.unauthorizedHandlers.add(handler);
    return () => this.unauthorizedHandlers.delete(handler);
  }

  private triggerUnauthorized() {
    this.unauthorizedHandlers.forEach((handler) => {
      try {
        handler();
      } catch (err) {
        console.error("Error in unauthorized handler", err);
      }
    });
  }

  /**
   * Main request method
   */
  public async request<T = unknown>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { body, params, headers = {}, skipAuth = false, ...fetchOptions } = options;

    // Build URL with query params
    const normalizedEndpoint = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;
    let fullUrl = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseUrl}${normalizedEndpoint}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null) {
          searchParams.append(key, String(val));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        fullUrl += (fullUrl.includes("?") ? "&" : "?") + queryString;
      }
    }

    // Prepare headers
    const reqHeaders: Record<string, string> = {
      Accept: "application/json",
      ...(headers as Record<string, string>),
    };

    if (
      body !== undefined &&
      body !== null &&
      !(body instanceof FormData) &&
      !reqHeaders["Content-Type"]
    ) {
      reqHeaders["Content-Type"] = "application/json";
    }

    // Attach JWT Authorization Bearer token if present
    const effectiveToken =
      this.token ||
      (typeof window !== "undefined"
        ? localStorage.getItem("auth_token")
        : null);

    if (!skipAuth && effectiveToken) {
      reqHeaders["Authorization"] = `Bearer ${effectiveToken}`;
    }

    // Prepare body
    let reqBody: BodyInit | undefined;
    if (body !== undefined && body !== null) {
      if (body instanceof FormData) {
        reqBody = body;
      } else if (typeof body === "string") {
        reqBody = body;
      } else {
        reqBody = JSON.stringify(body);
      }
    }

    let response: Response;
    try {
      response = await fetch(fullUrl, {
        ...fetchOptions,
        headers: reqHeaders,
        body: reqBody,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network request failed";
      // Mark as network error for seamless fallback
      throw new ApiClientError(
        `Network error: ${msg}`,
        0,
        null,
        undefined,
        true
      );
    }

    // Handle 401 Unauthorized
    if (response.status === 401) {
      this.triggerUnauthorized();
    }

    // Parse response body
    let data: any = null;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        data = await response.json();
      } catch {
        data = null;
      }
    } else {
      try {
        data = await response.text();
      } catch {
        data = null;
      }
    }

    // Handle non-2xx status codes
    if (!response.ok) {
      let normalizedMessage = `Request failed with status ${response.status}`;
      let errors: string[] | undefined;

      if (data && typeof data === "object") {
        // NestJS format: { message: string | string[], error?: string }
        if (Array.isArray(data.message)) {
          errors = data.message;
          normalizedMessage = data.message.join(", ");
        } else if (typeof data.message === "string") {
          normalizedMessage = data.message;
        } else if (typeof data.error === "string") {
          normalizedMessage = data.error;
        }
      }

      throw new ApiClientError(
        normalizedMessage,
        response.status,
        data,
        errors,
        false
      );
    }

    // If NestJS wrapped response in { success: true, data: T }, unwrap if helpful
    if (
      data &&
      typeof data === "object" &&
      "data" in data &&
      ("statusCode" in data || "success" in data)
    ) {
      return data.data as T;
    }

    return data as T;
  }

  // Convenience methods
  public get<T = unknown>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  public post<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "POST", body });
  }

  public put<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "PUT", body });
  }

  public patch<T = unknown>(
    endpoint: string,
    body?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "PATCH", body });
  }

  public delete<T = unknown>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }
}

// Global singleton instance
export const apiClient = new ApiClient();
