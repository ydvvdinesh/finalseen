"use client"

import { useEffect } from "react"

interface PerformanceMonitorProps {
  onMetrics?: (metrics: {
    lcp: number
    fid: number
    cls: number
    ttfb: number
  }) => void
}

export default function PerformanceMonitor({ onMetrics }: PerformanceMonitorProps) {
  useEffect(() => {
    if (typeof window === "undefined") return

    // Track Largest Contentful Paint (LCP)
    const trackLCP = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as PerformanceEntry
        const lcp = lastEntry.startTime
        console.log("LCP:", lcp)
        
        if (onMetrics) {
          onMetrics({ lcp, fid: 0, cls: 0, ttfb: 0 })
        }
      })
      
      observer.observe({ entryTypes: ["largest-contentful-paint"] })
    }

    // Track First Input Delay (FID)
    const trackFID = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          const fid = entry.processingStart - entry.startTime
          console.log("FID:", fid)
          
          if (onMetrics) {
            onMetrics({ lcp: 0, fid, cls: 0, ttfb: 0 })
          }
        })
      })
      
      observer.observe({ entryTypes: ["first-input"] })
    }

    // Track Cumulative Layout Shift (CLS)
    const trackCLS = () => {
      let clsValue = 0
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries() as any[]
        entries.forEach((entry) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            console.log("CLS:", clsValue)
            
            if (onMetrics) {
              onMetrics({ lcp: 0, fid: 0, cls: clsValue, ttfb: 0 })
            }
          }
        })
      })
      
      observer.observe({ entryTypes: ["layout-shift"] })
    }

    // Track Time to First Byte (TTFB)
    const trackTTFB = () => {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
      if (navigation) {
        const ttfb = navigation.responseStart - navigation.requestStart
        console.log("TTFB:", ttfb)
        
        if (onMetrics) {
          onMetrics({ lcp: 0, fid: 0, cls: 0, ttfb })
        }
      }
    }

    // Track resource loading performance
    const trackResourceTiming = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          const resource = entry as PerformanceResourceTiming
          if (resource.initiatorType === "img" || resource.initiatorType === "script") {
            console.log(`${resource.initiatorType} load time:`, resource.duration)
          }
        })
      })
      
      observer.observe({ entryTypes: ["resource"] })
    }

    // Track long tasks
    const trackLongTasks = () => {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          const task = entry as PerformanceEntry
          if (task.duration > 50) {
            console.warn("Long task detected:", task.duration, "ms")
          }
        })
      })
      
      observer.observe({ entryTypes: ["longtask"] })
    }

    // Initialize all tracking
    if ("PerformanceObserver" in window) {
      trackLCP()
      trackFID()
      trackCLS()
      trackTTFB()
      trackResourceTiming()
      trackLongTasks()
    }

    // Report initial metrics after page load
    window.addEventListener("load", () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
        if (navigation) {
          console.log("Page load time:", navigation.loadEventEnd - navigation.loadEventStart)
          console.log("DOM content loaded:", navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart)
        }
      }, 1000)
    })

    return () => {
      // Cleanup observers if needed
    }
  }, [onMetrics])

  return null // This component doesn't render anything
} 