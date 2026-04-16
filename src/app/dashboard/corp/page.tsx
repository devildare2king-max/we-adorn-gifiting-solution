import prisma from '@/lib/db'
import { getSession } from '@/lib/auth'
import styles from '../dashboard.module.css'
import { 
  Users, 
  BarChart3, 
  CheckCircle, 
  Clock, 
  ChevronRight,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'

export default async function CorpAdminDashboard() {
  const session = await getSession()
  
  if (!session || session.role !== 'CORP_ADMIN') {
    return <div>Access Denied</div>
  }

  const organization = await prisma.organization.findUnique({
    where: { id: session.organizationId },
    include: {
      users: true,
      requests: {
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { requester: true }
      }
    }
  })

  const stats = {
    totalUsers: organization?.users.length || 0,
    pendingApprovals: organization?.requests.filter(r => r.status === 'SUBMITTED' || r.status === 'UNDER_REVIEW').length || 0,
    totalSpent: 50000, // Mock value
    activeRequests: 12, // Mock value
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.statsRow}>
        <div className={`${styles.statCard} glass shadow-md`}>
          <div className={styles.statInfo}>
            <p>Total Employees</p>
            <h3>{stats.totalUsers}</h3>
          </div>
          <div className={`${styles.statIcon} ${styles.blue}`}>
            <Users size={24} />
          </div>
        </div>

        <div className={`${styles.statCard} glass shadow-md`}>
          <div className={styles.statInfo}>
            <p>Pending Approvals</p>
            <h3>{stats.pendingApprovals}</h3>
          </div>
          <div className={`${styles.statIcon} ${styles.warningIcon}`}>
            <Clock size={24} />
          </div>
        </div>

        <div className={`${styles.statCard} glass shadow-md`}>
          <div className={styles.statInfo}>
            <p>Monthly Budget Used</p>
            <h3>₹ {stats.totalSpent.toLocaleString()}</h3>
          </div>
          <div className={`${styles.statIcon} ${styles.green}`}>
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={`${styles.wideCard} glass shadow-md`}>
          <div className={styles.sectionHeader}>
            <div className={styles.titleInfo}>
               <BarChart3 size={20} className={styles.icon} />
               <h2>Recent Requests for Approval</h2>
            </div>
            <Link href="/dashboard/corp/approvals" className={styles.viewAll}>
              Review All <ChevronRight size={16} />
            </Link>
          </div>

          <div className={styles.requestTable}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Occasion</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {organization?.requests.map((request) => (
                  <tr key={request.id}>
                    <td>
                      <div className={styles.userInfo}>
                        <div className={styles.miniAvatar}>{request.requester.name.charAt(0)}</div>
                        <span>{request.requester.name}</span>
                      </div>
                    </td>
                    <td>{request.occasion}</td>
                    <td>₹{request.totalAmount.toLocaleString()}</td>
                    <td>
                      <span className={`${styles.status} ${styles[request.status.toLowerCase()]}`}>
                        {request.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <Link href={`/dashboard/corp/approvals/${request.id}`} className={styles.reviewBtn}>
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
