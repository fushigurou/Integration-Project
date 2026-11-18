export type Role = 'dg' | 'dr'

export type Session = {
  role: Role
  id: string
  name: string
  regionId?: string
}

export type Region = { id: string; nom: string; adresse: string }

export type Directeur = {
  id: string
  nom: string
  prenom: string
  email: string
  tel: string
  adresse: string
  cin: string
  regionId: string
}

export type VehicleEtat =
  | 'AVAILABLE'
  | 'ON_MISSION'
  | 'UNDER_MAINTENANCE'
  | 'UNAVAILABLE'

export type Vehicle = {
  id: string
  matricule: string
  marque: string
  regionId: string
  etat: VehicleEtat
}

export type Driver = {
  id: string
  nom: string
  prenom: string
  adresse: string
  cin: string
  email: string
  tel: string
  regionId: string
}

export type Db = {
  regions: Region[]
  drs: Directeur[]
  vehicles: Vehicle[]
  drivers: Driver[]
}

export type ToastKind = 'success' | 'error' | 'info'

export type ToastItem = {
  id: string
  kind: ToastKind
  message: string
}
