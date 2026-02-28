/**
 * Central API configuration.
 * All fetch calls should use `API_URL` instead of hardcoded localhost:5000.
 */
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000';

/**
 * Convenience helper that wraps fetch with the base API URL and auth header.
 */
export async function apiFetch(
    path: string,
    token: string,
    options: RequestInit = {}
): Promise<Response> {
    const headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options.headers as Record<string, string> || {}),
    };
    return fetch(`${API_URL}${path}`, { ...options, headers });
}
