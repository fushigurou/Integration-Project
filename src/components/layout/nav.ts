import {
  Car,
  LayoutDashboard,
  Map,
  UserCog,
  Users,
  type LucideIcon,
} from 'lucide-react'
import type { Role } from '../../data/types'

export type NavItem = { to: string; label: string; icon: LucideIcon }

const common: NavItem[] = [
  { to: '/vehicules', label: 'Véhicules', icon: Car },
  { to: '/chauffeurs', label: 'Chauffeurs', icon: Users },
]

export const NAV: Record<Role, NavItem[]> = {
  dg: [
    { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { to: '/regions', label: 'Régions', icon: Map },
    { to: '/directeurs', label: 'Directeurs régionaux', icon: UserCog },
    ...common,
  ],
  dr: [{ to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard }, ...common],
}

export const ROLE_LABEL: Record<Role, string> = {
  dg: 'Directeur Général',
  dr: 'Directeur Régional',
}
