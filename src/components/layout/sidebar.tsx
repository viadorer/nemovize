"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Building2,
  Users,
  Calculator,
  MessageSquare,
  FileText,
  UserCircle,
  Settings,
  BarChart3,
  Inbox,
  ChevronLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebarStore } from "@/stores/sidebar-store"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Nemovitosti", href: "/dashboard/properties", icon: Building2 },
  { name: "Klienti", href: "/dashboard/clients", icon: Users },
  { name: "Ocenění", href: "/dashboard/valuations", icon: Calculator },
  { name: "Poptávky", href: "/dashboard/inquiries", icon: Inbox },
  { name: "Zprávy", href: "/dashboard/messages", icon: MessageSquare },
  { name: "Dokumenty", href: "/dashboard/documents", icon: FileText },
  { name: "Konzultanti", href: "/dashboard/consultants", icon: UserCircle },
  { name: "Analytika", href: "/dashboard/analytics", icon: BarChart3 },
]

const bottomNavigation = [
  { name: "Nastavení", href: "/dashboard/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, toggle } = useSidebarStore()

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-glass backdrop-blur-2xl border-r border-glass-border transition-all duration-300 hidden lg:flex flex-col",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex items-center justify-between h-16 px-6 border-b border-border">
        {isOpen && (
          <Link href="/dashboard" className="text-xl font-bold tracking-tight">
            Nemovize
          </Link>
        )}
        <button
          onClick={toggle}
          className={cn(
            "p-2 rounded-xl hover:bg-glass-hover transition-colors text-muted-foreground hover:text-foreground",
            !isOpen && "mx-auto"
          )}
        >
          <ChevronLeft className={cn("w-4 h-4 transition-transform", !isOpen && "rotate-180")} />
        </button>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-accent text-accent-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-glass-hover",
                !isOpen && "justify-center px-0"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {isOpen && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-border space-y-1">
        {bottomNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-glass-hover",
                !isOpen && "justify-center px-0"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {isOpen && <span>{item.name}</span>}
            </Link>
          )
        })}
      </div>
    </aside>
  )
}
