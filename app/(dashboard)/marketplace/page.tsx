import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ItemCard } from "@/components/marketplace/item-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface MarketplacePageProps {
  searchParams: Promise<{ category?: string; q?: string }>
}

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const { category, q } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  let query = supabase
    .from("marketplace_items")
    .select("id, title, category, price, description")
    .order("category", { ascending: true })
    .order("title", { ascending: true })

  if (category && category !== "All") {
    query = query.eq("category", category)
  }
  if (q) {
    query = query.ilike("title", `%${q}%`)
  }

  const { data: items } = await query

  // Get distinct categories for tabs
  const { data: allItems } = await supabase
    .from("marketplace_items")
    .select("category")

  const categories = ["All", ...new Set((allItems ?? []).map((i) => i.category))]
  const activeCategory = category ?? "All"

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Marketplace</h1>
          <p className="text-muted-foreground text-sm">{items?.length ?? 0} items</p>
        </div>
        {/* Search bar */}
        <form className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Search items…"
            className="pl-8"
          />
          {/* Pass through category param */}
          {activeCategory !== "All" && (
            <input type="hidden" name="category" value={activeCategory} />
          )}
        </form>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 flex-wrap">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={cat === "All" ? "/marketplace" : `/marketplace?category=${encodeURIComponent(cat)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Item grid */}
      {items && items.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              id={item.id}
              title={item.title}
              category={item.category}
              price={item.price}
              description={item.description}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
          <p className="text-muted-foreground text-sm">No items found.</p>
        </div>
      )}
    </div>
  )
}
