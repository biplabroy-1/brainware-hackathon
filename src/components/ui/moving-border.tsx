"use client"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export const MovingBorder = ({
  children,
  duration = 2000,
  className,
  containerClassName,
  borderRadius = "1.75rem",
  colors = ["#4f46e5", "#06b6d4"],
  as: Component = "div",
  ...otherProps
}: {
  children: React.ReactNode
  duration?: number
  className?: string
  containerClassName?: string
  borderRadius?: string
  colors?: string[]
  as?: any
} & React.HTMLAttributes<HTMLDivElement>) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setPos({ x, y })
      setOpacity(1)
    }

    const handleMouseLeave = () => {
      setOpacity(0)
    }

    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  return (
    <Component
      ref={containerRef}
      className={cn(
        "relative flex items-center justify-center rounded-[1.75rem] bg-transparent p-[1px] overflow-hidden",
        containerClassName,
      )}
      style={{
        borderRadius,
      }}
      {...otherProps}
    >
      <div
        className="absolute inset-0 z-10 rounded-[1.75rem]"
        style={{
          background: `radial-gradient(circle at ${pos.x}px ${pos.y}px, ${colors[0]} 0%, ${colors[1]} 50%, transparent 100%)`,
          borderRadius,
          opacity,
          transition: `opacity ${duration}ms`,
        }}
      />

      <div
        className={cn("relative z-20 bg-black rounded-[calc(1.75rem-1px)] p-4", className)}
        style={{
          borderRadius: `calc(${borderRadius} - 1px)`,
        }}
      >
        {children}
      </div>
    </Component>
  )
}
