"use client"

import { useState, useEffect, useRef } from "react"

interface CounterAnimationProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
  startOnView?: boolean
  delay?: number
  easing?: 'linear' | 'easeOut' | 'easeInOut' | 'bounce'
}

export function CounterAnimation({ 
  end, 
  duration = 2000, 
  suffix = "", 
  prefix = "", 
  className = "",
  startOnView = true,
  delay = 0,
  easing = 'easeOut'
}: CounterAnimationProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(!startOnView)
  const [isMounted, setIsMounted] = useState(false)
  const counterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!startOnView) {
      // Start animation immediately with delay
      const timer = setTimeout(() => {
        animateCounter()
      }, delay)
      return () => clearTimeout(timer)
    }

    // Intersection Observer for startOnView
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
          setTimeout(() => {
            animateCounter()
          }, delay)
        }
      },
      { threshold: 0.1 }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current)
      }
    }
  }, [startOnView, isVisible])

  const getEasingFunction = (progress: number): number => {
    switch (easing) {
      case 'linear':
        return progress
      case 'easeOut':
        return 1 - Math.pow(1 - progress, 3)
      case 'easeInOut':
        return progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 3) / 2
      case 'bounce':
        if (progress < 1 / 2.75) {
          return 7.5625 * progress * progress
        } else if (progress < 2 / 2.75) {
          return 7.5625 * (progress -= 1.5 / 2.75) * progress + 0.75
        } else if (progress < 2.5 / 2.75) {
          return 7.5625 * (progress -= 2.25 / 2.75) * progress + 0.9375
        } else {
          return 7.5625 * (progress -= 2.625 / 2.75) * progress + 0.984375
        }
      default:
        return 1 - Math.pow(1 - progress, 3)
    }
  }

  const animateCounter = () => {
    const startTime = Date.now()
    const startValue = 0

    const updateCounter = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Apply easing function
      const easedProgress = getEasingFunction(progress)
      const currentValue = Math.floor(startValue + (end - startValue) * easedProgress)

      setCount(currentValue)

      if (progress < 1) {
        requestAnimationFrame(updateCounter)
      } else {
        setCount(end)
      }
    }

    requestAnimationFrame(updateCounter)
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div ref={counterRef} className={className}>
      {isMounted ? `${prefix}${formatNumber(count)}${suffix}` : `${prefix}0${suffix}`}
    </div>
  )
}


