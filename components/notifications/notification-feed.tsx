import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: 'liked' | 'commented' | 'mentioned' | 'followed'
  content: string
  read: boolean
  created_at: string
}

const typeBadgeClass: Record<Notification["type"], string> = {
  liked:      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  commented:  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  mentioned:  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  followed:   "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

interface NotificationFeedProps {
  notifications: Notification[]
}

export function NotificationFeed({ notifications }: NotificationFeedProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-muted-foreground text-sm">No notifications yet.</p>
      </div>
    )
  }

  return (
    <div className="divide-y">
      {notifications.map((n) => {
        const initials = n.content.slice(0, 2).toUpperCase()
        return (
          <div key={n.id} className={cn("flex items-start gap-3 p-4 transition-colors hover:bg-muted/50", !n.read && "bg-muted/20")}>
            {/* Unread indicator */}
            <div className={cn("mt-2 h-2 w-2 rounded-full shrink-0", n.read ? "bg-transparent" : "bg-primary")} />
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium capitalize", typeBadgeClass[n.type])}>
                  {n.type}
                </span>
                <p className="text-sm text-muted-foreground flex-1 min-w-0 truncate">{n.content}</p>
              </div>
            </div>
            <span className="text-xs text-muted-foreground shrink-0 tabular-nums">{relativeTime(n.created_at)}</span>
          </div>
        )
      })}
    </div>
  )
}
