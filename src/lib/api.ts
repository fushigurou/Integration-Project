import type { Db, Directeur, Driver, Region, Vehicle } from '../data/types'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (res.status === 204) return undefined as T

  const body = await res.json().catch(() => ({}))
  if (!res.ok) {
    const message =
      body?.message ||
      (body?.errors && Object.values(body.errors).flat().join(' ')) ||
      `Erreur API (${res.status})`
    throw new Error(message)
  }
  return body as T
}

type ApiRegion = {
  id_r: number
  nom: string
  adresse: string | null
  id_dr: number | null
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
  utilisateur: ApiUtilisateur
  region?: ApiRegion | null
}

type ApiDg = {
  id_dg: number
  role: string
  utilisateur: ApiUtilisateur
}

type ApiChauffeur = {
  id_ch: number
  nom: string
  prenom: string
  email: string
  num: string
  cin: string
  adresse: string | null
  id_r: number
}

type ApiVehicule = {
  id_v: number
  matricule: string
  marque: string
  etat: Vehicle['etat']
  id_r: number
}

const mapRegion = (r: ApiRegion): Region => ({
  id: String(r.id_r),
  nom: r.nom,
  adresse: r.adresse ?? '',
})

const mapDr = (d: ApiDr): Directeur => ({
  id: String(d.id_dr),
  nom: d.utilisateur.nom,
  prenom: d.utilisateur.prenom,
  email: d.utilisateur.email,
  tel: d.utilisateur.num,
  cin: d.utilisateur.cin,
  adresse: d.utilisateur.adresse ?? '',
  regionId: d.region?.id_r != null ? String(d.region.id_r) : '',
})

const mapDriver = (c: ApiChauffeur): Driver => ({
  id: String(c.id_ch),
  nom: c.nom,
  prenom: c.prenom,
  email: c.email,
  tel: c.num,
  cin: c.cin,
  adresse: c.adresse ?? '',
  regionId: String(c.id_r),
})

const mapVehicle = (v: ApiVehicule): Vehicle => ({
  id: String(v.id_v),
  matricule: v.matricule,
  marque: v.marque,
  etat: v.etat,
  regionId: String(v.id_r),
})

export async function fetchDb(): Promise<Db> {
  const [regions, drs, drivers, vehicles] = await Promise.all([
    request<ApiRegion[]>('/regions'),
    request<ApiDr[]>('/directeurs-regionaux'),
    request<ApiChauffeur[]>('/chauffeurs'),
    request<ApiVehicule[]>('/vehicules'),
  ])

  return {
    regions: regions.map(mapRegion),
    drs: drs.map(mapDr),
    drivers: drivers.map(mapDriver),
    vehicles: vehicles.map(mapVehicle),
  }
}

export async function fetchDirecteursGeneraux(): Promise<ApiDg[]> {
  return request<ApiDg[]>('/directeurs-generaux')
}

export async function saveRegion(item: Region): Promise<void> {
  const payload = {
    nom: item.nom,
    adresse: item.adresse || null,
  }
  if (item.id) {
    await request(`/regions/${item.id}`, { method: 'PUT', body: JSON.stringify(payload) })
  } else {
    await request('/regions', { method: 'POST', body: JSON.stringify(payload) })
  }
}

export async function deleteRegion(id: string): Promise<void> {
  await request(`/regions/${id}`, { method: 'DELETE' })
}

export async function saveDirecteur(item: Directeur): Promise<void> {
  const payload = {
    nom: item.nom,
    prenom: item.prenom,
    email: item.email,
    num: item.tel,
    cin: item.cin,
    adresse: item.adresse || null,
  }

  let drId = item.id
  if (item.id) {
    await request(`/directeurs-regionaux/${item.id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  } else {
    const created = await request<ApiDr>('/directeurs-regionaux', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
    drId = String(created.id_dr)
  }

  // Keep 1 DR <-> 1 region: clear previous assignment, then set region.id_dr
  const regions = await request<ApiRegion[]>('/regions')
  for (const r of regions) {
    if (r.id_dr != null && String(r.id_dr) === drId && String(r.id_r) !== item.regionId) {
      await request(`/regions/${r.id_r}`, {
        method: 'PUT',
        body: JSON.stringify({ id_dr: null }),
      })
    }
  }
  if (item.regionId) {
    await request(`/regions/${item.regionId}`, {
      method: 'PUT',
      body: JSON.stringify({ id_dr: Number(drId) }),
    })
  }
}

export async function deleteDirecteur(id: string): Promise<void> {
  await request(`/directeurs-regionaux/${id}`, { method: 'DELETE' })
}

export async function saveDriver(item: Driver): Promise<void> {
  const payload = {
    nom: item.nom,
    prenom: item.prenom,
    email: item.email,
    num: item.tel,
    cin: item.cin,
    adresse: item.adresse || null,
    id_r: Number(item.regionId),
  }
  if (item.id) {
    await request(`/chauffeurs/${item.id}`, { method: 'PUT', body: JSON.stringify(payload) })
  } else {
    await request('/chauffeurs', { method: 'POST', body: JSON.stringify(payload) })
  }
}

export async function deleteDriver(id: string): Promise<void> {
  await request(`/chauffeurs/${id}`, { method: 'DELETE' })
}

export async function saveVehicle(item: Vehicle): Promise<void> {
  const payload = {
    matricule: item.matricule,
    marque: item.marque,
    etat: item.etat,
    id_r: Number(item.regionId),
  }
  if (item.id) {
    await request(`/vehicules/${item.id}`, { method: 'PUT', body: JSON.stringify(payload) })
  } else {
    await request('/vehicules', { method: 'POST', body: JSON.stringify(payload) })
  }
}

export async function deleteVehicle(id: string): Promise<void> {
  await request(`/vehicules/${id}`, { method: 'DELETE' })
}
