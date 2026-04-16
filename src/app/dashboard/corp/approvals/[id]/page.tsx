import prisma from '@/lib/db'
export const dynamic = 'force-dynamic'
import { getSession } from '@/lib/auth'
import styles from './approval_detail.module.css'
import { 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  User, 
  Calendar,
  IndianRupee,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function ApprovalDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession()
  const request = await prisma.giftRequest.findUnique({
    where: { id: params.id },
    include: {
      requester: true,
      recipients: true,
      activities: {
        include: { actor: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!request) {
    return <div>Request not found</div>
  }

  // Action would normally be a server action
  // Here we just render the UI

  return (
    <div className={styles.container}>
      <Link href="/dashboard/corp" className={styles.back}>
        <ArrowLeft size={16} />
        <span>Back to Requests</span>
      </Link>

      <div className={styles.header}>
        <div className={styles.titleInfo}>
          <h1>{request.occasion}</h1>
          <div className={styles.meta}>
            <span className={styles.id}>#{request.id.slice(0, 8)}</span>
            <span className={`${styles.status} ${styles[request.status.toLowerCase()]}`}>
              {request.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        
        <div className={styles.actions}>
          <button className={`${styles.btn} ${styles.reject}`}>
            <XCircle size={18} />
            <span>Reject</span>
          </button>
          <button className={`${styles.btn} ${styles.clarify}`}>
            <MessageSquare size={18} />
            <span>Request Clarification</span>
          </button>
          <button className={`${styles.btn} ${styles.approve}`}>
            <CheckCircle size={18} />
            <span>Approve Request</span>
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.details}>
          <section className={`${styles.section} glass`}>
            <h3>Requester Information</h3>
            <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
                <label>Name</label>
                <div>{request.requester.name}</div>
              </div>
              <div className={styles.infoItem}>
                <label>Email</label>
                <div>{request.requester.email}</div>
              </div>
              <div className={styles.infoItem}>
                <label>Date Submitted</label>
                <div>{new Date(request.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </section>

          <section className={`${styles.section} glass`}>
            <h3>Request Details</h3>
            <div className={styles.amountBox}>
              <IndianRupee size={24} />
              <div className={styles.amount}>
                <span>Total Budget Requested</span>
                <h2>₹ {request.totalAmount.toLocaleString()}</h2>
              </div>
            </div>
            {request.notes && (
              <div className={styles.notes}>
                <label>Requester Notes</label>
                <p>{request.notes}</p>
              </div>
            )}
          </section>

          <section className={`${styles.section} glass`}>
            <h3>Recipients ({request.recipients.length})</h3>
            <div className={styles.recipientList}>
              {request.recipients.map((r) => (
                <div key={r.id} className={styles.recipient}>
                  <span>{r.name}</span>
                  <span>{r.email}</span>
                  <span className={styles.reqAmount}>₹{r.amount}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className={styles.sidebar}>
          <div className={`${styles.history} glass`}>
            <h3>Timeline & Comments</h3>
            <div className={styles.timeline}>
              {request.activities.map((a) => (
                <div key={a.id} className={styles.timelineItem}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineContent}>
                    <p className={styles.log}>
                      <strong>{a.actor.name}</strong> {a.type.toLowerCase()} this
                    </p>
                    {a.message && <p className={styles.msg}>{a.message}</p>}
                    <span className={styles.time}>{new Date(a.createdAt).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.commentBox}>
              <textarea placeholder="Add a comment or internal note..." />
              <button className={styles.sendBtn}>Post Comment</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
