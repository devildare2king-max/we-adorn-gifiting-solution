'use client'

import { useState } from 'react'
import { useCart } from '@/components/cart/CartContext'
import styles from './catalog.module.css'
import { Check, ShoppingCart, Info } from 'lucide-react'

interface GiftCardProps {
  product: {
    id: string
    title: string
    description: string
    image: string | null
    denominations: string
  }
}

export default function GiftCard({ product }: GiftCardProps) {
  const { addToCart } = useCart()
  const denominations = product.denominations.split(',').map(Number)
  const [selectedDenom, setSelectedDenom] = useState(denominations[0])
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      image: product.image || '',
      denomination: selectedDenom,
      quantity: 1
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className={`${styles.card} glass`}>
      <div className={styles.imageContainer}>
        {product.image ? (
          <img src={product.image} alt={product.title} className={styles.image} />
        ) : (
          <div className={styles.placeholder} />
        )}
      </div>

      <div className={styles.content}>
        <h3>{product.title}</h3>
        <p className={styles.description}>{product.description}</p>
        
        <div className={styles.selection}>
          <p>Select Denomination (₹)</p>
          <div className={styles.denomGrid}>
            {denominations.map((d) => (
              <button
                key={d}
                className={`${styles.denomBtn} ${selectedDenom === d ? styles.active : ''}`}
                onClick={() => setSelectedDenom(d)}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <button 
          className={`${styles.addBtn} ${added ? styles.success : ''}`}
          onClick={handleAddToCart}
        >
          {added ? (
            <>
              <Check size={18} />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingCart size={18} />
              <span>Add to Request</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
