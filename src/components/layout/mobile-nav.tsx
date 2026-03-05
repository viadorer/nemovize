"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { X,
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
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobileNavStore } from "@/stores/mobile-nav-store"

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
  { name: "Nastavení", href: "/dashboard/settings", icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()
  const { isOpen, close } = useMobileNavStore()

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden" onClick={close} />
      <div className="fixed left-0 top-0 z-50 h-full w-72 bg-glass backdrop-blur-2xl border-r border-glass-border lg:hidden">
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <span className="text-xl font-bold tracking-tight">Nemovize</span>
          <button
            onClick={close}
            className="p-2 rounded-xl hover:bg-glass-hover transition-colors text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-glass-hover"
                )}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span>{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
