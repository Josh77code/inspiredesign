"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface OrderItem {
  id: number
  title: string
  price: number
  image: string
  artist: string
  category: string
  quantity: number
}

export interface Order {
  orderId: string
  sessionId: string
  customerEmail: string
  amountTotal: number
  items: OrderItem[]
  purchasedAt: string
  status: 'completed' | 'pending' | 'failed'
}

interface OrderStore {
  orders: Order[]
  currentOrder: Order | null
  addOrder: (order: Order) => void
  getOrderById: (orderId: string) => Order | null
  hasValidOrder: () => boolean
  getCurrentOrderId: () => string | null
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      currentOrder: null,

      addOrder: (order) => {
        const orders = get().orders
        const existingOrderIndex = orders.findIndex(o => o.orderId === order.orderId)
        
        if (existingOrderIndex >= 0) {
          // Update existing order
          const updatedOrders = [...orders]
          updatedOrders[existingOrderIndex] = order
          set({ orders: updatedOrders, currentOrder: order })
        } else {
          // Add new order
          set({ 
            orders: [...orders, order], 
            currentOrder: order 
          })
        }
        
        // Store in localStorage for download access
        localStorage.setItem('orderId', order.orderId)
        localStorage.setItem('sessionId', order.sessionId)
        
        console.log('Order added:', order.orderId)
      },

      getOrderById: (orderId) => {
        const orders = get().orders
        return orders.find(order => order.orderId === orderId) || null
      },

      hasValidOrder: () => {
        const currentOrder = get().currentOrder
        const orderId = localStorage.getItem('orderId')
        const sessionId = localStorage.getItem('sessionId')
        
        return !!(currentOrder || orderId || sessionId)
      },

      getCurrentOrderId: () => {
        const currentOrder = get().currentOrder
        if (currentOrder) return currentOrder.orderId
        
        return localStorage.getItem('orderId')
      }
    }),
    {
      name: "order-storage",
    }
  )
)