export function apiFetch(path: string, init?: RequestInit) {
  // Always use relative paths in the browser so Vercel rewrites can proxy
  // `/api/*` to the Render backend and keep cookies same-origin.
  const url = path.startsWith('http') ? path : path;
  return fetch(url, init);
}

export async function apiJson(path: string, init?: RequestInit) {
  const res = await apiFetch(path, init);
  return res.json();
}
