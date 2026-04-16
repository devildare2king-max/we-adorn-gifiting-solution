import prisma from '@/lib/db'
import { getSession } from '@/lib/auth'
import styles from '../dashboard/dashboard.module.css'
import { 
  Building2, 
  CreditCard, 
  Activity, 
  PieChart,
  Globe,
  Settings
} from 'lucide-react'
import Link from 'next/link'

export default async function SuperAdminDashboard() {
  const session = await getSession()
  
  if (!session || session.role !== 'SUPER_ADMIN') {
    return <div>Access Denied</div>
  }

  const organizations = await prisma.organization.count()
  const totalUsers = await prisma.user.count()
  const totalProducts = await prisma.product.count()
  const recentActivity = await prisma.activity.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
    include: { actor: true, request: true }
  })

  return (
    <div className={styles.dashboard}>
       <header className={styles.header}>
          <div>
            <h1>Super Admin Panel</h1>
            <p>Platform Control Center</p>
          </div>
          <div className={styles.settingsIcon}>
            <Settings size={20} />
          </div>
        </header>

      <div className={styles.content}>
        <div className={styles.statsRow}>
          <div className={`${styles.statCard} glass shadow-md`}>
            <div className={styles.statInfo}>
              <p>Corporate Clients</p>
              <h3>{organizations}</h3>
            </div>
            <div className={`${styles.statIcon} ${styles.blue}`}>
              <Building2 size={24} />
            </div>
          </div>

          <div className={`${styles.statCard} glass shadow-md`}>
            <div className={styles.statInfo}>
              <p>Total Users</p>
              <h3>{totalUsers}</h3>
            </div>
            <div className={`${styles.statIcon} ${styles.green}`}>
              <PieChart size={24} />
            </div>
          </div>

          <div className={`${styles.statCard} glass shadow-md`}>
            <div className={styles.statInfo}>
              <p>Catalog Items</p>
              <h3>{totalProducts}</h3>
            </div>
            <div className={`${styles.statIcon} ${styles.warningIcon}`}>
              <CreditCard size={24} />
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={`${styles.wideCard} glass`}>
            <div className={styles.sectionHeader}>
               <div className={styles.titleInfo}>
                  <Activity size={20} className={styles.icon} />
                  <h2>System Audit Logs</h2>
               </div>
            </div>

            <div className={styles.auditList}>
              {recentActivity.length > 0 ? (
                recentActivity.map((log) => (
                  <div key={log.id} className={styles.logItem}>
                    <div className={styles.logMeta}>
                      <span className={styles.logTime}>{new Date(log.createdAt).toLocaleTimeString()}</span>
                      <span className={styles.logActor}>{log.actor.name}</span>
                    </div>
                    <p className={styles.logMessage}>
                      <strong>{log.type}</strong>: {log.message}
                    </p>
                  </div>
                ))
              ) : (
                <p className={styles.empty}>No audit logs found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
