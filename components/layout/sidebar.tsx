"use client"

import type React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, MessageSquare, Bell, Store,
  Wallet, FolderOpen, Blocks, Settings, LogOut, Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  badge?: number
}

const navItems: NavItem[] = [
  { href: "/dashboard",      label: "Overview",       icon: LayoutDashboard },
  { href: "/chat",           label: "Chat",            icon: MessageSquare,  badge: 3 },  // TODO: replace with live unread count
  { href: "/notifications",  label: "Notifications",   icon: Bell,           badge: 9 },  // TODO: replace with live unread count
  { href: "/marketplace",    label: "Marketplace",     icon: Store },
  { href: "/wallet",         label: "Wallet",          icon: Wallet },
  { href: "/projects",       label: "Projects",        icon: FolderOpen },
  { href: "/components",     label: "Components",      icon: Blocks },
]

function navLinkClass(isActive: boolean) {
  return cn(
    "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
    isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-l-2 border-primary pl-[10px]" // pl-[10px] = px-3(12px) - border-l-2(2px)
      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
  )
}

interface SidebarProps {
  userEmail?: string | null
  userAvatarUrl?: string | null
  userFullName?: string | null
}

export function Sidebar({ userEmail, userAvatarUrl, userFullName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const initials = userFullName
    ? userFullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : userEmail?.slice(0, 2).toUpperCase() ?? "??"

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.refresh()
    router.push("/login")
  }

  return (
    <aside aria-label="Sidebar" className="flex h-screen w-[220px] flex-col border-r bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center px-4 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sidebar-foreground">SaaS Starter</span>
        </Link>
      </div>

      {/* Nav */}
      <nav aria-label="Main" className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={navLinkClass(isActive)}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-[10px]">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}

        <Separator className="my-2 bg-sidebar-border" />

        <Link
          href="/settings"
          aria-current={pathname === "/settings" ? "page" : undefined}
          className={navLinkClass(pathname === "/settings")}
        >
          <Settings className="h-4 w-4 shrink-0" />
          Settings
        </Link>
      </nav>

      {/* User footer */}
      <div className="border-t border-sidebar-border p-3 space-y-2">
        <div className="flex items-center gap-2.5 px-1">
          <Avatar className="h-7 w-7">
            {userAvatarUrl && <AvatarImage src={userAvatarUrl} alt={userFullName ?? "User avatar"} />}
            <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-sidebar-foreground">{userFullName ?? userEmail}</p>
            {userFullName && <p className="truncate text-[10px] text-sidebar-foreground/60">{userEmail}</p>}
          </div>
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-sidebar-foreground/60 hover:text-destructive h-8 px-3"
          onClick={handleSignOut}
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="text-xs">Sign out</span>
        </Button>
      </div>
    </aside>
  )
}
