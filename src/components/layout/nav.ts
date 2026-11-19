import { LayoutDashboard, UserCog, type LucideIcon } from 'lucide-react'
import type { Role } from '../../data/types'

export type NavItem = { to: string; label: string; icon: LucideIcon }

export const NAV: Record<Role, NavItem[]> = {
  dg: [
    { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { to: '/directeurs', label: 'Directeurs régionaux', icon: UserCog },
  ],
  dr: [{ to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard }],
}

export const ROLE_LABEL: Record<Role, string> = {
  dg: 'Directeur Général',
  dr: 'Directeur Régional',
}
