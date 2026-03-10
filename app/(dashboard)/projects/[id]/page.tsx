import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("owner_id", user.id)
    .single()

  if (error || !project) notFound()

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single()

  async function updateProject(formData: FormData) {
    "use server"
    const supabase = await createClient()

    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const status = formData.get("status") as "active" | "paused" | "completed"

    const { error } = await supabase
      .from("projects")
      .update({ title, description: description || null, status })
      .eq("id", id)

    if (!error) {
      redirect("/projects")
    }
  }

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Edit Project"
        userEmail={user.email}
        userFullName={profile?.full_name}
        userAvatarUrl={profile?.avatar_url}
      />

      <div className="flex-1 p-6">
        <div className="mb-6">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </Link>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Project details</CardTitle>
            <CardDescription>
              Update the title, description, and status of your project.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateProject} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={project.title}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={project.description ?? ""}
                  rows={4}
                  placeholder="Describe what this project is about…"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={project.status}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit">Save changes</Button>
                <Button variant="outline" asChild>
                  <Link href="/projects">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
