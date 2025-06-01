import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { GoogleOneTap } from "@clerk/nextjs";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Remind Me",
  description: "A Next level app for your schedules",
};

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
          {children}
        </body>
      </html>
    </Providers>
  );
}
