"use client"

import { useEffect, useRef, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { subscribeToMessages } from "@/lib/realtime"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  channel_id: string
  sender_id: string
  content: string
  created_at: string
}

interface MessageThreadProps {
  channelId: string
  initialMessages: Message[]
  currentUserId: string
}

export function MessageThread({ channelId, initialMessages, currentUserId }: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const unsubscribe = subscribeToMessages(channelId, (newMessage) => {
      setMessages((prev) => [...prev, newMessage])
    })
    return unsubscribe
  }, [channelId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUserId
          return (
            <div key={msg.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2 text-sm",
                  isMine
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted text-foreground rounded-bl-sm"
                )}
              >
                <p>{msg.content}</p>
                <p className={cn("mt-1 text-[10px]", isMine ? "text-primary-foreground/60" : "text-muted-foreground")}>
                  {new Date(msg.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  )
}
