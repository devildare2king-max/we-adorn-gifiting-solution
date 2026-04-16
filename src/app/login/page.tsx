'use client'

import { authenticate } from '@/lib/actions'
import { useState } from 'react'
import styles from './login.module.css'
import { Lock, Mail, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await authenticate(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.background}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
      </div>
      
      <div className={`${styles.card} glass`}>
        <div className={styles.header}>
          <div className={styles.logo}>WA</div>
          <h1>We Adorn</h1>
          <p>Corporate Gifting Portal</p>
        </div>

        <form action={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <Mail size={18} className={styles.icon} />
            <input 
              name="email" 
              type="email" 
              placeholder="Corporate Email" 
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <Lock size={18} className={styles.icon} />
            <input 
              name="password" 
              type="password" 
              placeholder="Password" 
              required 
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? <Loader2 className={styles.spinner} /> : 'Login to Dashboard'}
          </button>
        </form>

        <div className={styles.footer}>
          <p>Secure Enterprise Login</p>
        </div>
      </div>
    </div>
  )
}
