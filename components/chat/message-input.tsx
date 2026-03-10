"use client"

import { useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"

interface MessageInputProps {
  channelId: string
  userId: string
}

export function MessageInput({ channelId, userId }: MessageInputProps) {
  const [value, setValue] = useState("")
  const [sending, setSending] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function send() {
    const text = value.trim()
    if (!text) return
    setValue("")
    setSending(true)
    const supabase = createClient()
    await supabase.from("messages").insert({
      channel_id: channelId,
      sender_id:  userId,
      content:    text,
    })
    setSending(false)
    inputRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void send()
    }
  }

  return (
    <div className="flex items-center gap-2 border-t p-4">
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message…"
        className="flex-1"
        disabled={sending}
      />
      <Button size="icon" onClick={() => void send()} disabled={!value.trim() || sending}>
        <Send className="h-4 w-4" />
        <span className="sr-only">Send</span>
      </Button>
    </div>
  )
}
