import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ItemCardProps {
  id: string
  title: string
  category: string
  price: number
  description: string | null
}

const categoryGradient: Record<string, string> = {
  Template: "from-blue-500/20 to-purple-500/20",
  Plugin:   "from-emerald-500/20 to-teal-500/20",
}

export function ItemCard({ id, title, category, price, description }: ItemCardProps) {
  const gradient = categoryGradient[category] ?? "from-muted to-muted"
  return (
    <Card className="flex flex-col overflow-hidden">
      {/* Cover area */}
      <div className={cn("h-32 bg-gradient-to-br flex items-center justify-center", gradient)}>
        <span className="text-3xl font-bold text-foreground/10 select-none">{title[0]}</span>
      </div>
      <CardContent className="flex-1 pt-4 pb-2">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-sm leading-tight">{title}</h3>
          <Badge variant="secondary" className="shrink-0 text-[10px]">{category}</Badge>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-0">
        <span className="text-sm font-bold">${price.toFixed(2)}</span>
        <Button size="sm" variant="outline">View</Button>
      </CardFooter>
    </Card>
  )
}
