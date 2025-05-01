import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { ClerkProvider } from "@clerk/nextjs"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Routine Tracker",
  description: "Track your daily routines and build better habits",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
    <html lang="en" className="dark">
      <body className={`${inter.className} dark:bg-black dark:text-white`}>{children}</body>
    </html>
    </ClerkProvider>
  )
}
