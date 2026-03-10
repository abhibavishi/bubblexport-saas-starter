import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarDays, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface ProjectCardProps {
  id: string
  title: string
  description: string | null
  status: string
  memberCount: number
  dueDate: string | null
  taskCount?: number
}

function dueDateClass(dueDate: string | null): string {
  if (!dueDate) return "text-muted-foreground"
  const diff = new Date(dueDate).getTime() - Date.now()
  const days = diff / (1000 * 60 * 60 * 24)
  if (days < 0) return "text-red-600 dark:text-red-400"
  if (days < 7) return "text-amber-600 dark:text-amber-400"
  return "text-emerald-600 dark:text-emerald-400"
}

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  active:    "default",
  paused:    "secondary",
  completed: "outline",
}

export function ProjectCard({ id, title, description, status, memberCount, dueDate, taskCount }: ProjectCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <Badge variant={statusVariant[status] ?? "secondary"} className="capitalize shrink-0">
          {status}
        </Badge>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-3">
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-auto pt-2">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {memberCount} member{memberCount !== 1 ? "s" : ""}
          </span>
          {taskCount !== undefined && (
            <span>{taskCount} task{taskCount !== 1 ? "s" : ""}</span>
          )}
          {dueDate && (
            <span className={cn("flex items-center gap-1", dueDateClass(dueDate))}>
              <CalendarDays className="h-3.5 w-3.5" />
              {new Date(dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </span>
          )}
        </div>
        <Button variant="outline" size="sm" asChild className="w-full mt-1">
          <Link href={`/projects/${id}`}>Open project →</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
