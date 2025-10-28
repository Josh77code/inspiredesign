"use client"

import { useState, useEffect } from 'react'

export function usePurchaseStatus() {
  const [hasPurchase, setHasPurchase] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for order ID or session ID in localStorage
    const orderId = localStorage.getItem('orderId')
    const sessionId = localStorage.getItem('sessionId')
    
    setHasPurchase(!!(orderId || sessionId))
    setIsLoading(false)
  }, [])

  const checkPurchaseStatus = () => {
    const orderId = localStorage.getItem('orderId')
    const sessionId = localStorage.getItem('sessionId')
    const hasValidPurchase = !!(orderId || sessionId)
    setHasPurchase(hasValidPurchase)
    return hasValidPurchase
  }

  return {
    hasPurchase,
    isLoading,
    checkPurchaseStatus
  }
}
