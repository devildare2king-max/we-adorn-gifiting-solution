import { getSession } from '@/lib/auth'
import Sidebar from '@/components/layout/Sidebar'
import styles from './dashboard.module.css'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  return (
    <div className={styles.layout}>
      <Sidebar role={session?.role} />
      <main className={styles.main}>
        <header className={styles.header}>
          <div>
            <h1>Welcome back, {session?.name}</h1>
            <p>{session?.role === 'CORP_USER' ? 'Employee' : 'Admin'} Portal</p>
          </div>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>
              {session?.name?.charAt(0)}
            </div>
          </div>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  )
}
