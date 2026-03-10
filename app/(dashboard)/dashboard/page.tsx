import { redirect } from "next/navigation"
import { Users, MousePointerClick, DollarSign, Package } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { StatCard } from "@/components/dashboard/stat-card"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { GoalsPanel } from "@/components/dashboard/goals-panel"
import { LatestSales } from "@/components/dashboard/latest-sales"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const [{ count: userCount }, { count: projectCount }] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("owner_id", user.id),
  ])

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground text-sm">Your business at a glance.</p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Users"  value={(userCount ?? 482).toLocaleString()} delta="+12.5%"  icon={Users} />
        <StatCard title="Clicks"        value="116"  delta="+8.2%"   icon={MousePointerClick} />
        <StatCard title="Revenue"       value="$547" delta="+14.6%"  icon={DollarSign} />
        <StatCard title="Items"         value={(projectCount ?? 3).toLocaleString()} delta="+3" icon={Package} />
      </div>

      {/* Charts row: 2/3 + 1/3 */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2"><RevenueChart /></div>
        <GoalsPanel />
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 lg:grid-cols-2">
        <LatestSales />
      </div>
    </div>
  )
}
