import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const sales = [
  { name: "Olivia Martin",   email: "olivia@example.com",   amount: "+$149.00" },
  { name: "Jackson Lee",     email: "jackson@example.com",  amount: "+$199.00" },
  { name: "Isabella Nguyen", email: "isabella@example.com", amount: "+$299.00" },
  { name: "William Kim",     email: "will@example.com",     amount: "+$199.00" },
  { name: "Sofia Davis",     email: "sofia@example.com",    amount: "+$49.00"  },
]

export function LatestSales() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Latest Sales</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sales.map((s) => (
          <div key={s.email} className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{s.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{s.name}</p>
              <p className="truncate text-xs text-muted-foreground">{s.email}</p>
            </div>
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">{s.amount}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
