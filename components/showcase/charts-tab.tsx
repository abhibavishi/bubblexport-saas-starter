"use client"

import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const revenueData = [
  { month: "Jan", value: 1200 },
  { month: "Feb", value: 1800 },
  { month: "Mar", value: 1400 },
  { month: "Apr", value: 2100 },
  { month: "May", value: 1900 },
  { month: "Jun", value: 2400 },
]

const usersData = [
  { day: "Mon", users: 420 },
  { day: "Tue", users: 380 },
  { day: "Wed", users: 510 },
  { day: "Thu", users: 490 },
  { day: "Fri", users: 620 },
  { day: "Sat", users: 280 },
  { day: "Sun", users: 190 },
]

const pieData = [
  { name: "Templates", value: 45 },
  { name: "Plugins",   value: 30 },
  { name: "Services",  value: 25 },
]

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"]

export function ChartsTab() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Revenue Trend</CardTitle>
          <CardDescription className="text-xs">Area chart</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ value: { label: "Revenue", color: "hsl(var(--chart-1))" } }} className="h-[160px] w-full">
            <AreaChart data={revenueData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="showcaseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area dataKey="value" stroke="hsl(var(--chart-1))" fill="url(#showcaseGrad)" strokeWidth={2} />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Weekly Users</CardTitle>
          <CardDescription className="text-xs">Bar chart</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={{ users: { label: "Users", color: "hsl(var(--chart-2))" } }} className="h-[160px] w-full">
            <BarChart data={usersData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="users" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Revenue by Category</CardTitle>
          <CardDescription className="text-xs">Pie chart</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <ChartContainer config={{}} className="h-[160px] w-[160px]">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label={({ name, percent }: { name: string; percent: number }) => `${name} ${Math.round(percent * 100)}%`}
                labelLine={false}
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
