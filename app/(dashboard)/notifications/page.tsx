import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { NotificationFeed } from "@/components/notifications/notification-feed"
import { NotificationFilters } from "@/components/notifications/notification-filters"
import { Button } from "@/components/ui/button"

interface NotificationsPageProps {
  searchParams: Promise<{ type?: string | string[] }>
}

export default async function NotificationsPage({ searchParams }: NotificationsPageProps) {
  const { type } = await searchParams
  const activeTypes = type
    ? Array.isArray(type) ? type : [type]
    : []

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  let query = supabase
    .from("notifications")
    .select("id, type, content, read, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (activeTypes.length > 0) {
    query = query.in("type", activeTypes as ('liked' | 'commented' | 'mentioned' | 'followed')[])
  }

  const { data: notifications } = await query

  // Server action: mark all read
  async function markAllRead() {
    "use server"
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from("notifications").update({ read: true }).eq("user_id", user.id)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground text-sm">
            {notifications?.filter((n) => !n.read).length ?? 0} unread
          </p>
        </div>
        <form action={markAllRead}>
          <Button variant="outline" size="sm" type="submit">Mark all read</Button>
        </form>
      </div>

      <div className="flex gap-6 items-start">
        <div className="flex-1 min-w-0 rounded-lg border overflow-hidden">
          <NotificationFeed notifications={notifications ?? []} />
        </div>
        <NotificationFilters activeTypes={activeTypes} />
      </div>
    </div>
  )
}
