"use client"
import { useState } from "react"
import { motion } from "framer-motion"

export const AnimatedTooltip = ({
  items,
}: {
  items: {
    id: number
    name: string
    designation: string
    image: string
  }[]
}) => {
  return (
    <div className="flex flex-row items-center justify-center gap-2 py-8">
      {items.map((item) => (
        <TooltipComponent key={item.id} item={item} />
      ))}
    </div>
  )
}

const TooltipComponent = ({
  item,
}: {
  item: {
    id: number
    name: string
    designation: string
    image: string
  }
}) => {
  const [isHovered, setIsHovered] = useState(false)
  return (
    <div className="relative group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <motion.div className="flex items-center justify-center" initial={{ scale: 1 }} whileHover={{ scale: 1.1 }}>
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          className="rounded-full h-14 w-14 object-cover border-2 border-white group-hover:border-indigo-500 transition-all duration-200"
        />
      </motion.div>

      {isHovered && (
        <motion.div
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20, scale: 0.6 }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
              type: "spring",
              stiffness: 260,
              damping: 10,
            },
          }}
          exit={{ opacity: 0, y: 20, scale: 0.6 }}
        >
          <div className="px-4 py-2 bg-black/80 backdrop-blur-sm rounded-md flex flex-col items-center justify-center text-center z-50">
            <div className="text-base font-bold text-white">{item.name}</div>
            <div className="text-xs text-white/80">{item.designation}</div>
          </div>
          <div className="w-4 h-4 bg-black/80 backdrop-blur-sm rotate-45 -mt-2 z-0"></div>
        </motion.div>
      )}
    </div>
  )
}
