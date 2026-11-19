export type Role = 'dg' | 'dr'

export type Session = {
  role: Role
  id: string
  name: string
  email: string
  region?: string | null
  token: string
}

export type Directeur = {
  id: string
  nom: string
  prenom: string
  email: string
  tel: string
  adresse: string
  cin: string
  region: string
}

export type Db = {
  drs: Directeur[]
}

export type ToastKind = 'success' | 'error' | 'info'

export type ToastItem = {
  id: string
  kind: ToastKind
  message: string
}
