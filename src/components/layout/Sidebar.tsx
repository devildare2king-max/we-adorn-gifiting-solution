'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart, 
  History, 
  Users, 
  Settings, 
  Package, 
  ShieldCheck,
  LogOut
} from 'lucide-react'
import { signout } from '@/lib/actions'
import styles from './sidebar.module.css'

interface SidebarProps {
  role: 'SUPER_ADMIN' | 'CORP_ADMIN' | 'CORP_USER'
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()

  const menuItems = {
    CORP_USER: [
      { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      { name: 'Gift Catalog', icon: ShoppingBag, href: '/dashboard/catalog' },
      { name: 'My Cart', icon: ShoppingCart, href: '/dashboard/cart' },
      { name: 'Order History', icon: History, href: '/dashboard/orders' },
    ],
    CORP_ADMIN: [
      { name: 'Overview', icon: LayoutDashboard, href: '/dashboard/corp' },
      { name: 'Pending Approvals', icon: ShieldCheck, href: '/dashboard/corp/approvals' },
      { name: 'Org Users', icon: Users, href: '/dashboard/corp/users' },
      { name: 'Reports', icon: History, href: '/dashboard/corp/reports' },
    ],
    SUPER_ADMIN: [
      { name: 'Platform Stats', icon: LayoutDashboard, href: '/admin' },
      { name: 'Corporate Clients', icon: Users, href: '/admin/clients' },
      { name: 'Global Catalog', icon: Package, href: '/admin/catalog' },
      { name: 'System Logs', icon: Settings, href: '/admin/logs' },
    ]
  }

  const items = menuItems[role] || []

  return (
    <aside className={`${styles.sidebar} glass`}>
      <div className={styles.top}>
        <div className={styles.logo}>WA</div>
        <span className={styles.brand}>We Adorn</span>
      </div>

      <nav className={styles.nav}>
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className={styles.bottom}>
        <button onClick={() => signout()} className={styles.logout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
