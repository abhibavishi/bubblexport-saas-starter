import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/layout/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Fetch profile for sidebar
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single()

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        userEmail={user.email}
        userFullName={profile?.full_name}
        userAvatarUrl={profile?.avatar_url}
      />
      <main className="flex-1 overflow-y-auto bg-background">{children}</main>
    </div>
  )
}
