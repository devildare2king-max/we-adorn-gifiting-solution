import prisma from '@/lib/db'
export const dynamic = 'force-dynamic'

import { getSession } from '@/lib/auth'
import styles from './dashboard.module.css'
import { 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Package
} from 'lucide-react'
import Link from 'next/link'

export default async function UserDashboard() {
  const session = await getSession()
  
  const requests = await prisma.giftRequest.findMany({
    where: { requesterId: session.id },
    orderBy: { createdAt: 'desc' },
    take: 5
  })

  const stats = {
    pending: requests.filter(r => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW').length,
    approved: requests.filter(r => r.status === 'APPROVED' || r.status === 'COMPLETED').length,
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.statsRow}>
        <div className={`${styles.statCard} glass shadow-md`}>
          <div className={styles.statInfo}>
            <p>Active Requests</p>
            <h3>{stats.pending}</h3>
          </div>
          <div className={`${styles.statIcon} ${styles.blue}`}>
            <Clock size={24} />
          </div>
        </div>

        <div className={`${styles.statCard} glass shadow-md`}>
          <div className={styles.statInfo}>
            <p>Approved Orders</p>
            <h3>{stats.approved}</h3>
          </div>
          <div className={`${styles.statIcon} ${styles.green}`}>
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className={`${styles.statAction} shadow-md`}>
          <Link href="/dashboard/catalog" className={styles.actionButton}>
            <Plus size={20} />
            <span>New Gift Request</span>
          </Link>
        </div>
      </div>

      <div className={styles.sectionHeader}>
        <h2>Recent Requests</h2>
        <Link href="/dashboard/orders" className={styles.viewAll}>
          View All <ChevronRight size={16} />
        </Link>
      </div>

      <div className={styles.requestList}>
        {requests.length > 0 ? (
          requests.map((request) => (
            <div key={request.id} className={`${styles.requestCard} glass`}>
              <div className={styles.packageIcon}>
                <Package size={24} />
              </div>
              <div className={styles.requestInfo}>
                <h4>{request.occasion}</h4>
                <p>Request ID: {request.requestId || request.id.slice(0, 8)}</p>
              </div>
              <div className={styles.requestMeta}>
                <p className={styles.amount}>₹ {request.totalAmount.toLocaleString()}</p>
                <p className={styles.date}>{new Date(request.createdAt).toLocaleDateString()}</p>
              </div>
              <div className={`${styles.status} ${styles[request.status.toLowerCase()]}`}>
                {request.status.replace('_', ' ')}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.emptyState}>
            <AlertCircle size={48} />
            <p>No gift requests found. Start by browsing the catalog!</p>
            <Link href="/dashboard/catalog" className={styles.emptyButton}>
              Browse Catalog
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
