"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const FILTER_OPTIONS = [
  { value: "liked",     label: "Likes" },
  { value: "commented", label: "Comments" },
  { value: "mentioned", label: "Mentions" },
  { value: "followed",  label: "Follows" },
] as const

export function NotificationFilters({ activeTypes }: { activeTypes: string[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function toggle(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    const existing = params.getAll("type")
    if (existing.includes(value)) {
      params.delete("type")
      existing.filter((v) => v !== value).forEach((v) => params.append("type", v))
    } else {
      params.append("type", value)
    }
    router.push(`/notifications?${params.toString()}`)
  }

  function selectAll() {
    const params = new URLSearchParams()
    FILTER_OPTIONS.forEach((o) => params.append("type", o.value))
    router.push(`/notifications?${params.toString()}`)
  }

  function clearAll() {
    router.push("/notifications")
  }

  return (
    <Card className="w-[200px] shrink-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Filter by type</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {FILTER_OPTIONS.map((opt) => (
          <div key={opt.value} className="flex items-center gap-2">
            <Checkbox
              id={opt.value}
              checked={activeTypes.includes(opt.value)}
              onCheckedChange={() => toggle(opt.value)}
            />
            <Label htmlFor={opt.value} className="text-sm font-normal cursor-pointer">{opt.label}</Label>
          </div>
        ))}
        <div className="flex gap-2 pt-1">
          <Button variant="outline" size="sm" className="flex-1 h-7 text-xs" onClick={selectAll}>All</Button>
          <Button variant="ghost"   size="sm" className="flex-1 h-7 text-xs" onClick={clearAll}>Clear</Button>
        </div>
      </CardContent>
    </Card>
  )
}
