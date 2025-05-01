"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedDropdownProps {
  trigger: React.ReactNode
  children: React.ReactNode
  align?: "left" | "right"
  className?: string
  width?: string
}

export function AnimatedDropdown({
  trigger,
  children,
  align = "right",
  className,
  width = "200px",
}: AnimatedDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const toggleDropdown = () => setIsOpen(!isOpen)

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Animation variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
        staggerChildren: 0.05,
        delayChildren: 0.05,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={dropdownVariants}
            className={cn(
              "absolute z-50 mt-2 rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 backdrop-blur-md border border-gray-700/50 shadow-lg overflow-hidden",
              align === "right" ? "right-0" : "left-0",
              className,
            )}
            style={{ width }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent opacity-0"
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
            />
            <div className="relative z-10 py-2 px-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function DropdownItem({
  children,
  onClick,
  icon,
  className,
  href,
}: {
  children: React.ReactNode
  onClick?: () => void
  icon?: React.ReactNode
  className?: string
  href?: string
}) {
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  }

  const content = (
    <motion.div
      variants={itemVariants}
      whileHover={{ x: 5, backgroundColor: "rgba(79, 70, 229, 0.1)" }}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 text-sm text-gray-200 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors",
        className,
      )}
      onClick={onClick}
    >
      {icon && <span className="text-indigo-400">{icon}</span>}
      {children}
    </motion.div>
  )

  if (href) {
    return <a href={href}>{content}</a>
  }

  return content
}

export function DropdownSeparator() {
  return <div className="h-px bg-gray-700/50 my-1 mx-2" />
}
