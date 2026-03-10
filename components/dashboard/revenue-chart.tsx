"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 1800 },
  { month: "Mar", revenue: 1400 },
  { month: "Apr", revenue: 2100 },
  { month: "May", revenue: 1900 },
  { month: "Jun", revenue: 2400 },
  { month: "Jul", revenue: 2200 },
  { month: "Aug", revenue: 2840 },
]

const chartConfig = {
  revenue: { label: "Revenue", color: "hsl(var(--chart-1))" },
}

export function RevenueChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
        <CardDescription>January – August 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[240px] w-full">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="hsl(var(--chart-1))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} className="fill-muted-foreground" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area dataKey="revenue" type="monotone" stroke="hsl(var(--chart-1))" fill="url(#revGrad)" strokeWidth={2} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
