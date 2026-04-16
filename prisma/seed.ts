import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Create Super Admin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@weadorn.com' },
    update: {},
    create: {
      email: 'admin@weadorn.com',
      password: 'password123', // In real app, hash this
      name: 'Platform Moderator',
      role: 'SUPER_ADMIN',
    },
  })

  // 2. Create Organization
  const org = await prisma.organization.create({
    data: {
      name: 'Adorn Corporate Solutions',
    },
  })

  // 3. Create Corporate Admin
  await prisma.user.create({
    data: {
      email: 'corp-admin@adorn.com',
      password: 'password123',
      name: 'John Doe',
      role: 'CORP_ADMIN',
      organizationId: org.id,
    },
  })

  // 4. Create Corporate User
  await prisma.user.create({
    data: {
      email: 'user@adorn.com',
      password: 'password123',
      name: 'Jane Smith',
      role: 'CORP_USER',
      organizationId: org.id,
    },
  })

  // 5. Create Catalog Items
  const giftCards = [
    {
      title: 'Amazon.in Gift Card',
      description: 'The classic gifting choice for any occasion. Flexible and easy to use.',
      image: 'https://m.media-amazon.com/images/I/41-AAMK-EPL._SY445_SX342_QL70_ML2_.jpg',
      denominations: '500,1000,2000,5000,10000',
      deliveryType: 'Email',
      validity: '1Year',
      terms: 'Applicable on all items on Amazon.in. Non-refundable.',
    },
    {
      title: 'Amazon Prime Membership',
      description: 'Gift the convenience of Prime. Fast delivery, streaming, and more.',
      image: 'https://m.media-amazon.com/images/I/51pT2ZUKjYL._SY445_SX342_QL70_ML2_.jpg',
      denominations: '1499',
      deliveryType: 'Email',
      validity: '1 Year',
      terms: 'Amazon Prime Terms & Conditions apply.',
    },
  ]

  for (const card of giftCards) {
    await prisma.product.create({
      data: card,
    })
  }

  console.log('Seeding completed successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
