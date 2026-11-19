import type { Db, Directeur, Role, Session } from '../data/types'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api'
const TOKEN_KEY = 'steg_jwt'

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (res.status === 204) return undefined as T

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    if (res.status === 401 && path !== '/auth/login') {
      setToken(null)
    }
    const message =
      body?.message ||
      (body?.errors && Object.values(body.errors).flat().join(' ')) ||
      `Erreur API (${res.status})`
    throw new Error(message)
  }
  return body as T
}

type ApiUtilisateur = {
  id_user: number
  nom: string
  prenom: string
  email: string
  num: string
  cin: string
  adresse: string | null
}

type ApiDr = {
  id_dr: number
  role: string
  nom_region: string | null
  utilisateur: ApiUtilisateur
}

type AuthUser = {
  id: string
  role: Role
  name: string
  email: string
  region?: string | null
}

type AuthResponse = {
  access_token: string
  token_type: string
  expires_in: number
  user: AuthUser
}

const mapDr = (d: ApiDr): Directeur => ({
  id: String(d.id_dr),
  nom: d.utilisateur.nom,
  prenom: d.utilisateur.prenom,
  email: d.utilisateur.email,
  tel: d.utilisateur.num,
  cin: d.utilisateur.cin,
  adresse: d.utilisateur.adresse ?? '',
  region: d.nom_region ?? '',
})

function toSession(user: AuthUser, token: string): Session {
  return {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    region: user.region,
    token,
  }
}

export async function loginRequest(email: string, password: string): Promise<Session> {
  const data = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setToken(data.access_token)
  return toSession(data.user, data.access_token)
}

export async function fetchMe(): Promise<Session | null> {
  const token = getToken()
  if (!token) return null
  try {
    const data = await request<{ user: AuthUser }>('/auth/me')
    return toSession(data.user, token)
  } catch {
    setToken(null)
    return null
  }
}

export async function logoutRequest(): Promise<void> {
  try {
    if (getToken()) await request('/auth/logout', { method: 'POST' })
  } finally {
    setToken(null)
  }
}

export async function fetchDb(): Promise<Db> {
  const drs = await request<ApiDr[]>('/directeurs-regionaux')
  return { drs: drs.map(mapDr) }
}

export async function saveDirecteur(item: Directeur): Promise<void> {
  const payload = {
    nom: item.nom,
    prenom: item.prenom,
    email: item.email,
    num: item.tel,
    cin: item.cin,
    adresse: item.adresse || null,
    nom_region: item.region,
  }

  if (item.id) {
    await request(`/directeurs-regionaux/${item.id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  } else {
    await request('/directeurs-regionaux', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }
}

export async function deleteDirecteur(id: string): Promise<void> {
  await request(`/directeurs-regionaux/${id}`, { method: 'DELETE' })
}
