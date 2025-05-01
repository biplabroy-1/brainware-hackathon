"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
  trigger: React.ReactNode
  items: {
    label: string
    onClick?: () => void
    href?: string
    icon?: React.ReactNode
  }[]
  align?: "left" | "right"
  className?: string
  itemClassName?: string
}

export function DropdownMenu({
  trigger,
  items,
  align = "right",
  className,
  itemClassName,
}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const toggleMenu = () => setIsOpen(!isOpen)

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <div onClick={toggleMenu} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute z-50 mt-2 min-w-[200px] rounded-xl bg-gray-800/90 backdrop-blur-sm border border-gray-700 shadow-lg",
              align === "right" ? "right-0" : "left-0",
              className
            )}
          >
            <div className="py-2 px-1">
              {items.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  item={item}
                  onClick={() => {
                    if (item.onClick) item.onClick()
                    setIsOpen(false)
                  }}
                  className={itemClassName}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface DropdownMenuItemProps {
  item: {
    label: string
    onClick?: () => void
    href?: string
    icon?: React.ReactNode
  }
  onClick: () => void
  className?: string
}

function DropdownMenuItem({ item, onClick, className }: DropdownMenuItemProps) {
  const content = (
    <motion.div
      whileHover={{ x: 5 }}
      className={cn(
        "flex items-center gap-2 px-4 py-2.5 text-sm text-gray-200 rounded-lg hover:bg-gray-700/50 cursor-pointer transition-colors",
        className
      )}
      onClick={onClick}
    >
      {item.icon && <span className="text-indigo-400">{item.icon}</span>}
      {item.label}
    </motion.div>
  )

  if (item.href) {
    return <a href={item.href}>{content}</a>
  }

  return content
}

