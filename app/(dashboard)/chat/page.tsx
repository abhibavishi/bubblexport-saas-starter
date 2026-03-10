import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ConversationList } from "@/components/chat/conversation-list"
import { MessageThread } from "@/components/chat/message-thread"
import { MessageInput } from "@/components/chat/message-input"

interface ChatPageProps {
  searchParams: Promise<{ channel?: string }>
}

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const { channel: channelParam } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fetch channels
  const { data: channels } = await supabase
    .from("channels")
    .select("id, name")
    .order("name")

  const activeChannelId = channelParam ?? channels?.[0]?.id ?? ""

  // Fetch initial messages for active channel
  const { data: messages } = await supabase
    .from("messages")
    .select("id, channel_id, sender_id, content, created_at")
    .eq("channel_id", activeChannelId)
    .order("created_at", { ascending: true })
    .limit(50)

  const activeChannel = channels?.find((c) => c.id === activeChannelId)

  return (
    <div className="flex h-full">
      {/* Channel list */}
      <ConversationList
        channels={channels ?? []}
        activeChannelId={activeChannelId}
      />

      {/* Message area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Channel header */}
        <div className="flex h-14 items-center border-b px-4 shrink-0">
          <h1 className="font-semibold"># {activeChannel?.name ?? "Select a channel"}</h1>
        </div>

        <MessageThread
          channelId={activeChannelId}
          initialMessages={messages ?? []}
          currentUserId={user.id}
        />

        <MessageInput channelId={activeChannelId} userId={user.id} />
      </div>

      {/* Profile panel */}
      <div className="hidden lg:flex w-[200px] shrink-0 border-l flex-col">
        <div className="flex h-14 items-center border-b px-4">
          <span className="text-sm font-semibold">Channel Info</span>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Channel</p>
            <p className="text-sm font-medium"># {activeChannel?.name ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Messages</p>
            <p className="text-sm tabular-nums">{messages?.length ?? 0}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
