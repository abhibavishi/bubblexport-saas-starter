import { redirect } from "next/navigation"
import { Users, FolderOpen, TrendingUp, TrendingDown } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { DashboardHeader } from "@/components/layout/dashboard-header"
import { MrrChart } from "@/components/dashboard/mrr-chart"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

async function getStats(userId: string) {
  const supabase = await createClient()

  const [
    { count: projectCount },
    { data: subscription },
    { count: userCount },
  ] = await Promise.all([
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .eq("owner_id", userId),
    supabase
      .from("subscriptions")
      .select("plan, status")
      .eq("user_id", userId)
      .maybeSingle(),
    // In a real app this would be an admin-only aggregation
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true }),
  ])

  return { projectCount: projectCount ?? 0, subscription, userCount: userCount ?? 1 }
}

interface StatCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend?: "up" | "down"
  trendValue?: string
}

function StatCard({ title, value, description, icon, trend, trendValue }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
          {trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
          {trend === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
          {trendValue && (
            <span className={trend === "up" ? "text-green-600" : "text-red-600"}>
              {trendValue}
            </span>
          )}{" "}
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single()

  const { projectCount, userCount } = await getStats(user.id)

  return (
    <div className="flex flex-col">
      <DashboardHeader
        title="Dashboard"
        userEmail={user.email}
        userFullName={profile?.full_name}
        userAvatarUrl={profile?.avatar_url}
      />

      <div className="flex-1 space-y-6 p-6">
        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={userCount.toLocaleString()}
            description="from last month"
            icon={<Users className="h-4 w-4" />}
            trend="up"
            trendValue="+12.5%"
          />
          <StatCard
            title="Active Projects"
            value={projectCount.toLocaleString()}
            description="projects in workspace"
            icon={<FolderOpen className="h-4 w-4" />}
            trend="up"
            trendValue="+3"
          />
          <StatCard
            title="MRR"
            value="$2,840"
            description="from last month"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            }
            trend="up"
            trendValue="+14.6%"
          />
          <StatCard
            title="Churn Rate"
            value="2.4%"
            description="from last month"
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            }
            trend="down"
            trendValue="-0.3%"
          />
        </div>

        {/* MRR Chart */}
        <MrrChart />
      </div>
    </div>
  )
}
