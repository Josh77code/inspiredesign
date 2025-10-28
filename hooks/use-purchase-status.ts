"use client"

import { useState, useEffect } from 'react'
import { useOrderStore } from '@/lib/order-store'

export function usePurchaseStatus() {
  const [hasPurchase, setHasPurchase] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { hasValidOrder } = useOrderStore()

  useEffect(() => {
    // Check for valid order in order store or localStorage
    const orderId = localStorage.getItem('orderId')
    const sessionId = localStorage.getItem('sessionId')
    const hasOrderStore = hasValidOrder()
    
    setHasPurchase(!!(orderId || sessionId || hasOrderStore))
    setIsLoading(false)
  }, [hasValidOrder])

  const checkPurchaseStatus = () => {
    const orderId = localStorage.getItem('orderId')
    const sessionId = localStorage.getItem('sessionId')
    const hasOrderStore = hasValidOrder()
    const hasValidPurchase = !!(orderId || sessionId || hasOrderStore)
    setHasPurchase(hasValidPurchase)
    return hasValidPurchase
  }

  return {
    hasPurchase,
    isLoading,
    checkPurchaseStatus
  }
}
