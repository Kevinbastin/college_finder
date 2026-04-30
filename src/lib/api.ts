export const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export function apiFetch(path: string, init?: RequestInit) {
  // If API_BASE is set (e.g., https://backend.onrender.com), prefix it.
  // Otherwise, use relative paths so same-host API routes keep working.
  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  return fetch(url, init);
}

export async function apiJson(path: string, init?: RequestInit) {
  const res = await apiFetch(path, init);
  return res.json();
}
