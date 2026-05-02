'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Tag,
  FolderOpen,
  Package,
  ShoppingBag,
  LogOut,
  ChevronRight,
  Store,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: 'Marcas',
    href: '/admin/marcas',
    icon: Tag,
  },
  {
    label: 'Categorías',
    href: '/admin/categorias',
    icon: FolderOpen,
  },
  {
    label: 'Productos',
    href: '/admin/productos',
    icon: Package,
  },
  {
    label: 'Órdenes',
    href: '/admin/ordenes',
    icon: ShoppingBag,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  function isActive(item: { href: string; exact?: boolean }) {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-slate-900">
      {/* Logo / Brand */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-slate-700">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <Store className="text-white" size={16} />
        </div>
        <div>
          <p className="text-sm font-bold text-white">Mi Promesa</p>
          <p className="text-xs text-slate-400">Panel Admin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={[
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white',
                  ].join(' ')}
                >
                  <item.icon size={18} className="shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {active && <ChevronRight size={14} className="opacity-60" />}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Sign out */}
      <div className="border-t border-slate-700 p-3">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <LogOut size={18} className="shrink-0" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )
}
