"use client"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Sidebar } from "@/components/layout/sidebar"

interface MobileSidebarProps {
  userEmail?: string | null
  userAvatarUrl?: string | null
  userFullName?: string | null
}

export function MobileSidebar({ userEmail, userAvatarUrl, userFullName }: MobileSidebarProps) {
  const [open, setOpen] = useState(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[220px]">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <Sidebar
          userEmail={userEmail}
          userFullName={userFullName}
          userAvatarUrl={userAvatarUrl}
        />
      </SheetContent>
    </Sheet>
  )
}
