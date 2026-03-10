import { createClient } from "@/lib/supabase/client"

export function subscribeToMessages(
  channelId: string,
  onMessage: (message: { id: string; channel_id: string; sender_id: string; content: string; created_at: string }) => void
) {
  const supabase = createClient()

  const channel = supabase
    .channel(`messages:${channelId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `channel_id=eq.${channelId}`,
      },
      (payload) => onMessage(payload.new as { id: string; channel_id: string; sender_id: string; content: string; created_at: string })
    )
    .subscribe()

  return () => { void supabase.removeChannel(channel) }
}
