import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const goals = [
  { name: "Q4 Revenue",       current: 8520, target: 10000 },
  { name: "New Users",        current: 342,  target: 500 },
  { name: "Churn Reduction",  current: 68,   target: 100 },
]

export function GoalsPanel() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {goals.map((goal) => {
          const pct = Math.round((goal.current / goal.target) * 100)
          return (
            <div key={goal.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{goal.name}</span>
                <span className="text-muted-foreground tabular-nums">{pct}%</span>
              </div>
              <Progress value={pct} className="h-1.5" />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
