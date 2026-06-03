/**
 * useAdminApi — thin wrapper around fetch for admin API calls.
 * Base URL is read from VITE_API_BASE env var (falls back to '/api').
 */

const BASE_URL = import.meta.env.VITE_API_BASE || '/api'

export function useAdminApi() {
  /**
   * @param {string} endpoint  e.g. '/admin/subscription-plans'
   * @param {string} method    GET | POST | PUT | DELETE
   * @param {object} body      request body (JSON), optional
   */
  async function apiFetch(endpoint, method = 'GET', body = null) {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    }
    if (body && method !== 'GET') {
      options.body = JSON.stringify(body)
    }

    const res = await fetch(`${BASE_URL}${endpoint}`, options)

    // For 204 No Content (DELETE success), return null
    if (res.status === 204) return null

    const data = await res.json().catch(() => null)

    if (!res.ok) {
      const msg = data?.message || data?.error || `HTTP ${res.status}`
      throw new Error(msg)
    }

    return data
  }

  return { apiFetch }
}
