"use client"
import type React from "react"
import { useRef, useState, useEffect } from "react"

export function Spotlight({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseX = useRef(0)
  const mouseY = useRef(0)

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  useEffect(() => {
    if (!isMounted) return
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      mouseX.current = x
      mouseY.current = y
      updateSpotlight()
    }

    const updateSpotlight = () => {
      if (containerRef.current) {
        const spotlight = containerRef.current.querySelector(".spotlight") as HTMLElement
        if (spotlight) {
          spotlight.style.background = `radial-gradient(circle at ${mouseX.current}px ${mouseY.current}px, rgba(79, 70, 229, 0.15) 0%, transparent 80%)`
        }
      }
    }

    container.addEventListener("mousemove", handleMouseMove)
    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isMounted])

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div className="spotlight absolute inset-0 pointer-events-none z-10"></div>
      {children}
    </div>
  )
}
