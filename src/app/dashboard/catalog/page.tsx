import prisma from '@/lib/db'
import GiftCard from '@/components/catalog/GiftCard'
import styles from './catalog_page.module.css'
import { ShoppingCart } from 'lucide-react'
import Link from 'next/link'

export default async function CatalogPage() {
  const products = await prisma.product.findMany({
    where: { active: true }
  })

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>Gift Card Catalog</h2>
          <p>Browse and select gift cards for corporate rewards.</p>
        </div>
        <Link href="/dashboard/cart" className={`${styles.cartLink} glass`}>
          <ShoppingCart size={20} />
          <span>View Request Cart</span>
        </Link>
      </div>

      <div className={styles.grid}>
        {products.map((product) => (
          <GiftCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
