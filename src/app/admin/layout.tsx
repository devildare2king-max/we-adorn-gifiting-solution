import { getSession } from '@/lib/auth'
import Sidebar from '@/components/layout/Sidebar'
import styles from '../dashboard/dashboard.module.css'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  return (
    <div className={styles.layout}>
      <Sidebar role="SUPER_ADMIN" />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}
