import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProjectCard } from "@/components/projects/project-card"
import { NewProjectDialog } from "@/components/projects/new-project-dialog"

export default async function ProjectsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: projects } = await supabase
    .from("projects")
    .select("id, title, description, status, member_count, due_date")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground text-sm">Manage your active projects.</p>
        </div>
        <NewProjectDialog userId={user.id} />
      </div>

      {projects && projects.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              title={project.title}
              description={project.description}
              status={project.status}
              memberCount={project.member_count ?? 1}
              dueDate={project.due_date}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
          <p className="text-muted-foreground text-sm">No projects yet.</p>
          <p className="text-muted-foreground text-xs mt-1">Create your first project to get started.</p>
        </div>
      )}
    </div>
  )
}
