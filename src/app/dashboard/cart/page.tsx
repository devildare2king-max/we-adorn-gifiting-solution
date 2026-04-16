'use client'

import { useCart } from '@/components/cart/CartContext'
import { useState } from 'react'
import styles from './cart.module.css'
import { 
  Trash2, 
  Upload, 
  FileSpreadsheet, 
  AlertCircle, 
  Send,
  Loader2,
  CheckCircle2
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { items, removeFromCart, clearCart, totalAmount } = useCart()
  const [occasion, setOccasion] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [bulkRecipients, setBulkRecipients] = useState<{name: string, email: string, amount: number}[]>([])
  const router = useRouter()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '')
      const recipients = lines.slice(1).map(line => {
        const [name, email, amount] = line.split(',').map(s => s.trim())
        return { name, email, amount: parseFloat(amount) }
      }).filter(r => r.name && r.email && !isNaN(r.amount))
      
      setBulkRecipients(recipients)
    }
    reader.readAsText(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // In a real app, this would be a server action call to create a GiftRequest
    // For now, we simulate the submission
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      clearCart()
      setTimeout(() => router.push('/dashboard'), 3000)
    }, 2000)
  }

  if (submitted) {
    return (
      <div className={styles.successState}>
        <CheckCircle2 size={64} className={styles.successIcon} />
        <h2>Request Submitted Successfully!</h2>
        <p>Your gift request has been sent for approval. You will be notified once it's reviewed.</p>
        <button onClick={() => router.push('/dashboard')} className={styles.homeBtn}>
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2>Your Reward Request</h2>
        <p>Review your selection and submit for corporate approval.</p>
      </header>

      <div className={styles.main}>
        <div className={styles.left}>
          <section className={`${styles.section} glass`}>
            <h3>1. Selected Gift Cards</h3>
            {items.length > 0 ? (
              <div className={styles.itemList}>
                {items.map((item) => (
                  <div key={`${item.id}-${item.denomination}`} className={styles.item}>
                    <img src={item.image} alt={item.title} className={styles.itemImage} />
                    <div className={styles.itemInfo}>
                      <h4>{item.title}</h4>
                      <p>Denomination: ₹{item.denomination}</p>
                    </div>
                    <div className={styles.itemQty}>
                      <span>x {item.quantity}</span>
                    </div>
                    <div className={styles.itemTotal}>
                      ₹{(item.denomination * item.quantity).toLocaleString()}
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id, item.denomination)}
                      className={styles.removeBtn}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyItems}>
                <p>Your cart is empty.</p>
              </div>
            )}
          </section>

          <section className={`${styles.section} glass`}>
            <div className={styles.sectionTitle}>
              <h3>2. Bulk Recipient Upload (Optional)</h3>
              <span className={styles.badge}>CSV Only</span>
            </div>
            <p className={styles.helperText}>
              Upload a list of recipients to distribute these gift cards. 
              CSV format: <code>name, email, amount</code>
            </p>
            
            <div className={styles.uploadBox}>
              <input 
                type="file" 
                id="bulk-upload" 
                accept=".csv" 
                onChange={handleFileUpload} 
                className={styles.hiddenInput}
              />
              <label htmlFor="bulk-upload" className={styles.uploadLabel}>
                <Upload size={24} />
                <span>{bulkRecipients.length > 0 ? `${bulkRecipients.length} Recipients Loaded` : 'Click to Upload CSV'}</span>
              </label>
            </div>

            {bulkRecipients.length > 0 && (
              <div className={styles.preview}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulkRecipients.slice(0, 5).map((r, i) => (
                      <tr key={i}>
                        <td>{r.name}</td>
                        <td>{r.email}</td>
                        <td>₹{r.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {bulkRecipients.length > 5 && <p className={styles.more}>+ {bulkRecipients.length - 5} more recipients</p>}
              </div>
            )}
          </section>
        </div>

        <div className={styles.right}>
          <form onSubmit={handleSubmit} className={`${styles.summary} glass`}>
            <h3>Order Summary</h3>
            
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>₹{totalAmount.toLocaleString()}</span>
            </div>
            {bulkRecipients.length > 0 && (
              <div className={styles.summaryRow}>
                <span>Bulk Recipients</span>
                <span>{bulkRecipients.length}</span>
              </div>
            )}
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total Amount</span>
              <span>₹{(totalAmount + bulkRecipients.reduce((a, b) => a + b.amount, 0)).toLocaleString()}</span>
            </div>

            <div className={styles.inputs}>
              <div className={styles.field}>
                <label>Occasion / Purpose</label>
                <input 
                  type="text" 
                  placeholder="e.g. Employee Appreciation Q1" 
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  required
                />
              </div>
              <div className={styles.field}>
                <label>Notes (Optional)</label>
                <textarea 
                  placeholder="Additional instructions..." 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={styles.submitBtn} 
              disabled={loading || (items.length === 0 && bulkRecipients.length === 0)}
            >
              {loading ? (
                <Loader2 className={styles.spin} />
              ) : (
                <>
                  <Send size={18} />
                  <span>Submit for Approval</span>
                </>
              )}
            </button>

            <p className={styles.disclaimer}>
              By submitting, you agree to the corporate procurement policy.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
