import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

const COLUMNS = [
  { status: "todo",        label: "Todo" },
  { status: "in-progress", label: "In Progress" },
  { status: "done",        label: "Done" },
] as const

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: project } = await supabase
    .from("projects")
    .select("id, title, description, status")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single()

  if (!project) notFound()

  const { data: tasks } = await supabase
    .from("tasks")
    .select("id, title, status, created_at")
    .eq("project_id", id)
    .order("created_at", { ascending: true })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{project.title}</h1>
          {project.description && (
            <p className="text-muted-foreground text-sm">{project.description}</p>
          )}
        </div>
        <Badge variant="secondary" className="capitalize ml-auto">{project.status}</Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {COLUMNS.map((col) => {
          const colTasks = (tasks ?? []).filter((t) => t.status === col.status)
          return (
            <div key={col.status} className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-sm font-semibold">{col.label}</span>
                <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-[10px]">
                  {colTasks.length}
                </Badge>
              </div>
              <div className="space-y-2 min-h-[120px]">
                {colTasks.map((task) => (
                  <Card key={task.id} className="cursor-default">
                    <CardContent className="p-3">
                      <p className="text-sm">{task.title}</p>
                    </CardContent>
                  </Card>
                ))}
                {colTasks.length === 0 && (
                  <div className="flex items-center justify-center rounded-lg border border-dashed h-[80px]">
                    <span className="text-xs text-muted-foreground">No tasks</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
