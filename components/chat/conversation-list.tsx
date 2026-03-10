import Link from "next/link"
import { cn } from "@/lib/utils"
import { Hash } from "lucide-react"

interface Channel {
  id: string
  name: string
}

interface ConversationListProps {
  channels: Channel[]
  activeChannelId: string
}

export function ConversationList({ channels, activeChannelId }: ConversationListProps) {
  return (
    <div className="w-[200px] shrink-0 border-r bg-sidebar">
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <span className="text-sm font-semibold text-sidebar-foreground">Channels</span>
      </div>
      <nav className="p-2 space-y-0.5" aria-label="Channels">
        {channels.map((channel) => {
          const isActive = channel.id === activeChannelId
          return (
            <Link
              key={channel.id}
              href={`/chat?channel=${channel.id}`}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Hash className="h-3.5 w-3.5 shrink-0" />
              {channel.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
