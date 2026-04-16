'use server'

import prisma from './db'
import { login, logout } from './auth'
import { redirect } from 'next/navigation'

export async function authenticate(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const user = await prisma.user.findUnique({
    where: { email },
    include: { organization: true }
  })

  // In real app, use bcrypt to compare hashes
  if (!user || user.password !== password) {
    return { error: 'Invalid credentials' }
  }

  await login({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    organizationId: user.organizationId
  })

  if (user.role === 'SUPER_ADMIN') {
    redirect('/admin')
  } else if (user.role === 'CORP_ADMIN') {
    redirect('/dashboard/corp')
  } else {
    redirect('/dashboard')
  }
}

export async function signout() {
  await logout()
  redirect('/login')
}
