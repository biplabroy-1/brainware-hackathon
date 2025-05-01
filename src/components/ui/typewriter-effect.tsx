"use client"
import { cn } from "@/lib/utils"
import { motion, stagger, useAnimate, useInView } from "framer-motion"
import { useEffect } from "react"

export const TypewriterEffect = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string
    className?: string
  }[]
  className?: string
  cursorClassName?: string
}) => {
  const [scope, animate] = useAnimate()
  const isInView = useInView(scope)
  useEffect(() => {
    if (isInView) {
      animate(
        "span",
        {
          display: "inline-block",
          opacity: 1,
        },
        {
          duration: 0.3,
          delay: stagger(0.1),
          ease: "easeInOut",
        },
      )
    }
  }, [isInView])

  const renderWords = () => {
    return (
      <motion.div ref={scope} className="inline">
        {words.map((word, idx) => {
          return (
            <div key={`word-${idx}`} className="inline-block">
              {word.text.split("").map((char, index) => (
                <motion.span
                  initial={{
                    opacity: 0,
                    display: "none",
                  }}
                  key={`char-${index}`}
                  className={cn(`opacity-0 hidden`, word.className)}
                >
                  {char}
                </motion.span>
              ))}
              &nbsp;
            </div>
          )
        })}
      </motion.div>
    )
  }
  return (
    <div className={cn("flex items-center", className)}>
      <div className="inline-block">{renderWords()}</div>
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        className={cn("inline-block h-4 w-[2px] bg-blue-500 dark:bg-white ml-1", cursorClassName)}
      ></motion.span>
    </div>
  )
}

export const TypewriterEffectSmooth = ({
  words,
  className,
  cursorClassName,
}: {
  words: {
    text: string
    className?: string
  }[]
  className?: string
  cursorClassName?: string
}) => {
  const wordsArray = words.map((word) => word.text)
  const [scope, animate] = useAnimate()
  const isInView = useInView(scope)

  useEffect(() => {
    if (isInView) {
      let delay = 0
      words.forEach((word, i) => {
        const characters = word.text.split("")
        characters.forEach((_, j) => {
          animate(
            `#word-${i}-char-${j}`,
            {
              opacity: 1,
              y: 0,
            },
            {
              delay: delay,
              duration: 0.2,
              ease: "easeInOut",
            },
          )
          delay += 0.05
        })
        delay += 0.1
      })
    }
  }, [isInView])

  const renderWords = () => {
    return (
      <div ref={scope}>
        {words.map((word, i) => {
          return (
            <div key={`word-${i}`} className="inline-block mr-1">
              {word.text.split("").map((char, j) => (
                <motion.span
                  id={`word-${i}-char-${j}`}
                  key={`word-${i}-char-${j}`}
                  initial={{ opacity: 0, y: 10 }}
                  className={cn("", word.className)}
                >
                  {char}
                </motion.span>
              ))}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className={cn("flex items-center", className)}>
      <div className="inline-block">{renderWords()}</div>
      <motion.span
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
        className={cn("inline-block h-6 w-[2px] bg-blue-500 dark:bg-white ml-1", cursorClassName)}
      ></motion.span>
    </div>
  )
}
