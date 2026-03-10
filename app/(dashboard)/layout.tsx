import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileSidebar } from "@/components/layout/mobile-sidebar"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden lg:flex">
        <Sidebar
          userEmail={user.email}
          userFullName={profile?.full_name}
          userAvatarUrl={profile?.avatar_url}
        />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <header className="flex h-14 items-center border-b px-4 lg:hidden">
          <MobileSidebar
            userEmail={user.email}
            userFullName={profile?.full_name}
            userAvatarUrl={profile?.avatar_url}
          />
          <span className="ml-2 font-semibold">SaaS Starter</span>
        </header>
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
