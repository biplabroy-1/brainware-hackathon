"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MenuButtonProps {
  onClick?: () => void
  className?: string
  isOpen?: boolean
  onToggle?: (isOpen: boolean) => void
}

export function MenuButton({ onClick, className, isOpen, onToggle }: MenuButtonProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)

  const isMenuOpen = isOpen !== undefined ? isOpen : internalIsOpen

  const handleClick = () => {
    if (isOpen === undefined) {
      setInternalIsOpen(!internalIsOpen)
    }

    if (onToggle) {
      onToggle(!isMenuOpen)
    }

    if (onClick) {
      onClick()
    }
  }

  const topLineVariants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: 45, y: 6 },
  }

  const middleLineVariants = {
    closed: { opacity: 1 },
    open: { opacity: 0 },
  }

  const bottomLineVariants = {
    closed: { rotate: 0, y: 0 },
    open: { rotate: -45, y: -6 },
  }

  return (
    <motion.button
      className={cn(
        "flex flex-col justify-center items-center w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 focus:outline-none",
        className,
      )}
      onClick={handleClick}
      whileTap={{ scale: 0.9 }}
    >
      <div className="w-6 h-5 flex flex-col justify-between">
        <motion.span
          className="w-full h-0.5 bg-white rounded-full"
          variants={topLineVariants}
          animate={isMenuOpen ? "open" : "closed"}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="w-full h-0.5 bg-white rounded-full"
          variants={middleLineVariants}
          animate={isMenuOpen ? "open" : "closed"}
          transition={{ duration: 0.3 }}
        />
        <motion.span
          className="w-full h-0.5 bg-white rounded-full"
          variants={bottomLineVariants}
          animate={isMenuOpen ? "open" : "closed"}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.button>
  )
}
