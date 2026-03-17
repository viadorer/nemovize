"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const links = [
  { href: "/nemovitosti", label: "Nemovitosti" },
  { href: "/valuation", label: "Ocenění" },
  { href: "/consultants", label: "Konzultanti" },
  { href: "/about", label: "O nás" },
  { href: "/contact", label: "Kontakt" },
]

export function PublicHeader() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[rgba(240,255,240,0.65)] backdrop-blur-[10px] border-b border-[rgba(0,112,243,0.15)] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3 py-3 px-2 transition-all duration-300 hover:opacity-90">
            <Image 
              src="/LOGO_NEMOVIZOR WEB.png" 
              alt="Nemovize Logo" 
              width={180} 
              height={48}
              className="h-12 w-auto"
              priority
            />
            <span className="text-[1.3rem] font-bold tracking-tight text-[#111111]">
              Nemovize
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "py-2 text-base font-semibold transition-all duration-300 relative",
                  pathname === link.href
                    ? "text-[#111111] after:absolute after:bottom-[-3px] after:left-0 after:right-0 after:h-0.5 after:bg-[#555555] after:transition-all after:duration-300"
                    : "text-[rgba(0,0,0,0.7)] hover:text-[#555555] after:absolute after:bottom-[-3px] after:left-0 after:w-0 after:h-0.5 after:bg-[#555555] after:transition-all after:duration-300 hover:after:w-full"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" size="md">Přihlášení</Button>
            </Link>
            <Link href="/valuation">
              <Button size="md">Ocenit nemovitost</Button>
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-glass-hover transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-accent bg-accent/5"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 flex flex-col gap-2 px-4">
              <Link href="/login">
                <Button variant="outline" className="w-full" size="sm">Přihlášení</Button>
              </Link>
              <Link href="/valuation">
                <Button className="w-full" size="sm">Ocenit nemovitost</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
