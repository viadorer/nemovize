"use client"

import { Menu, Search, Bell, LogOut } from "lucide-react"
import { useUser } from "@/hooks/use-user"
import { logout } from "@/app/(auth)/actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dropdown,
  DropdownTrigger,
  DropdownContent,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
} from "@/components/ui/dropdown"
import { useSidebarStore } from "@/stores/sidebar-store"
import { useMobileNavStore } from "@/stores/mobile-nav-store"
import { cn } from "@/lib/utils"

export function Topbar() {
  const { profile } = useUser()
  const { isOpen: sidebarOpen } = useSidebarStore()
  const { toggle: toggleMobile } = useMobileNavStore()

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() ?? "?"

  return (
    <header
      className={cn(
        "sticky top-0 z-30 h-16 bg-glass/80 backdrop-blur-2xl border-b border-glass-border transition-all duration-300",
        sidebarOpen ? "lg:pl-64" : "lg:pl-20"
      )}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMobile}
            className="lg:hidden p-2 rounded-xl hover:bg-glass-hover transition-colors text-muted-foreground"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden sm:flex items-center gap-2 bg-glass/50 backdrop-blur-sm border border-glass-border rounded-xl px-4 h-10 w-72">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Hledat..."
              className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
          </Button>

          <Dropdown>
            <DropdownTrigger asChild>
              <button className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-glass-hover transition-colors cursor-pointer">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url ?? undefined} />
                  <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium">
                  {profile?.full_name}
                </span>
              </button>
            </DropdownTrigger>
            <DropdownContent align="end">
              <DropdownLabel>{profile?.email}</DropdownLabel>
              <DropdownSeparator />
              <DropdownItem asChild>
                <a href="/dashboard/settings/profile">Profil</a>
              </DropdownItem>
              <DropdownItem asChild>
                <a href="/dashboard/settings">Nastavení</a>
              </DropdownItem>
              <DropdownSeparator />
              <DropdownItem
                onClick={() => logout()}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
Odhlásit se
              </DropdownItem>
            </DropdownContent>
          </Dropdown>
        </div>
      </div>
    </header>
  )
}
