"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface Method {
  id: string
  name: string
  icon: string
  connected: boolean
}

const methods: Method[] = [
  { id: "stripe",  name: "Stripe",  icon: "💳", connected: true  },
  { id: "paypal",  name: "PayPal",  icon: "🅿️", connected: false },
]

export function PaymentMethodSelector() {
  const [selected, setSelected] = useState("stripe")
  return (
    <div className="space-y-2">
      {methods.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => setSelected(m.id)}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg border p-3 text-left transition-all",
            selected === m.id ? "ring-2 ring-primary border-primary" : "hover:border-border/80"
          )}
        >
          <span className="text-xl" aria-hidden="true">{m.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{m.name}</p>
            <p className="text-xs text-muted-foreground">{m.connected ? "Connected" : "Not connected"}</p>
          </div>
          {selected === m.id && (
            <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-primary-foreground" />
            </div>
          )}
        </button>
      ))}
    </div>
  )
}
