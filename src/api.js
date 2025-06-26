const BASE_URL = 'http://127.0.0.1:5000' 
export async function apiFetch(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}
