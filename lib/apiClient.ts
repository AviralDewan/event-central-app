import { getSession } from "next-auth/react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";

interface FetchOptions extends RequestInit {
  requireAuth?: boolean;
}

/**
 * Centralized API client for backend calls.
 * Returns null on any error — callers should handle null with fallback logic.
 * Throws only on network-level failure (no internet, etc.)
 */
export async function fetchApi(endpoint: string, options: FetchOptions = {}) {
  const { requireAuth = true, headers, ...restOptions } = options;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (requireAuth) {
    const session = await getSession();
    const token = (session as any)?.accessToken;

    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    } else {
      console.warn(`[apiClient] No auth token found for ${endpoint}. Request will be unauthenticated.`);
    }
  }

  // If authentication is required, get the access token from NextAuth session
  let authHeaders: HeadersInit = {};
  if (requireAuth) {
    const session = await getSession();
    const token = (session as any)?.accessToken;
    if (token) {
      authHeaders = { Authorization: `Bearer ${token}` };
    } else {
      console.warn(`[apiClient] No auth token found for ${endpoint}. Request will be unauthenticated.`);
    }
  }

  const mergedHeaders = { ...defaultHeaders, ...authHeaders, ...headers };

  const url = `${API_BASE_URL}${endpoint}`;

  let response: Response;
  try {
    response = await fetch(url, {
      ...restOptions,
      headers: mergedHeaders,
    });
  } catch (networkError) {
    // Network-level failure (backend not running, no internet, etc.)
    console.warn(`[apiClient] Network error for ${endpoint}:`, networkError);
    return null;
  }

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    console.warn(
      `[apiClient] ${response.status} ${response.statusText} for ${endpoint}`,
      body ? `— ${body.slice(0, 200)}` : ""
    );
    return null;
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
