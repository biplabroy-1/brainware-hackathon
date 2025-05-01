
import type React from "react"
import Navbar from "@/components/navbar";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { GoogleOneTap } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Routine Tracker",
  description: "Track your daily routines and build better habits",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <html lang="en">
        <body
          className={cn(
            "min-h-screen antialiased bg-background text-foreground",
            font.className
          )}
        >
          <GoogleOneTap />
          <Toaster richColors theme="light" />
          <Navbar />
          {children}
        </body>
      </html>
    </Providers>
  );
}
