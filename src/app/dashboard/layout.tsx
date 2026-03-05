"use client"

import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { useSidebarStore } from "@/stores/sidebar-store"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isOpen } = useSidebarStore()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileNav />
      <div
        className={cn(
          "transition-all duration-300",
          isOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        <Topbar />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
