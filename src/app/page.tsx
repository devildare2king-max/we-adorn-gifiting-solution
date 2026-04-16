import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function LandingPage() {
  const session = await getSession()

  if (session) {
    if (session.role === 'SUPER_ADMIN') redirect('/admin')
    if (session.role === 'CORP_ADMIN') redirect('/dashboard/corp')
    redirect('/dashboard')
  }

  // If no session, redirect to login
  redirect('/login')
}
