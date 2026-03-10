# Premium Dashboard Rebuild Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild `bubblexport-saas-starter` as a premium, minimal 7-page SaaS admin dashboard that makes Bubble founders think "I want my app to look like that."

**Architecture:** Full in-place rebuild of the existing repo. All 7 pages (Overview, Chat, Notifications, Marketplace, Wallet, Projects, Components) are server components where possible, client components only for interactivity (chat, realtime, theme toggle, data table). Supabase Realtime powers the chat page. shadcn/ui throughout — no custom component primitives.

**Tech Stack:** Next.js 15 App Router · TypeScript · Tailwind CSS · shadcn/ui · Recharts (via shadcn charts) · Supabase (Auth + PostgreSQL + Realtime) · @tanstack/react-table · next-themes · cmdk

**Design reference:** See `docs/plans/2026-03-10-premium-dashboard-rebuild-design.md`
**Bubble original screenshots:** `screenshots/` directory in this repo

---

## Task 1: Install dependencies + shadcn primitives

**Files:**
- Modify: `package.json`
- Modify: `app/layout.tsx`
- Create: `components/ui/theme-toggle.tsx`
- Create: `components/providers.tsx`

**Step 1: Install new packages**

```bash
cd /Users/abhi/Github/bubblexport-saas-starter
npm install next-themes @tanstack/react-table cmdk --legacy-peer-deps
```

**Step 2: Add shadcn chart, progress, command, scroll-area primitives**

```bash
npx shadcn@latest add chart progress command scroll-area --yes
```

Expected: Creates `components/ui/chart.tsx`, `progress.tsx`, `command.tsx`, `scroll-area.tsx`

**Step 3: Create `components/providers.tsx`**

```tsx
"use client"

import { ThemeProvider } from "next-themes"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}
```

**Step 4: Update `app/layout.tsx` — wrap with Providers**

Add `import { Providers } from "@/components/providers"` and wrap `{children}` with `<Providers>`.

**Step 5: Create `components/ui/theme-toggle.tsx`**

```tsx
"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

**Step 6: Verify dev server starts without errors**

```bash
npm run dev
```

Expected: Server starts at localhost:3000, no TypeScript errors.

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: add next-themes, tanstack-table, cmdk, shadcn chart/progress/command/scroll-area"
```

---

## Task 2: Update globals.css + tailwind config

**Files:**
- Modify: `app/globals.css`
- Modify: `tailwind.config.ts`

**Step 1: Replace `app/globals.css` with full shadcn theme + chart CSS variables**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 224 71.4% 4.1%;
    --card: 0 0% 100%;
    --card-foreground: 224 71.4% 4.1%;
    --popover: 0 0% 100%;
    --popover-foreground: 224 71.4% 4.1%;
    --primary: 220.9 39.3% 11%;
    --primary-foreground: 210 20% 98%;
    --secondary: 220 14.3% 95.9%;
    --secondary-foreground: 220.9 39.3% 11%;
    --muted: 220 14.3% 95.9%;
    --muted-foreground: 220 8.9% 46.1%;
    --accent: 220 14.3% 95.9%;
    --accent-foreground: 220.9 39.3% 11%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 20% 98%;
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 224 71.4% 4.1%;
    --radius: 0.5rem;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
    --sidebar-background: 0 0% 98%;
    --sidebar-foreground: 240 5.3% 26.1%;
    --sidebar-primary: 240 5.9% 10%;
    --sidebar-primary-foreground: 0 0% 98%;
    --sidebar-accent: 240 4.8% 95.9%;
    --sidebar-accent-foreground: 240 5.9% 10%;
    --sidebar-border: 220 13% 91%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }

  .dark {
    --background: 224 71.4% 4.1%;
    --foreground: 210 20% 98%;
    --card: 224 71.4% 4.1%;
    --card-foreground: 210 20% 98%;
    --popover: 224 71.4% 4.1%;
    --popover-foreground: 210 20% 98%;
    --primary: 210 20% 98%;
    --primary-foreground: 220.9 39.3% 11%;
    --secondary: 215 27.9% 16.9%;
    --secondary-foreground: 210 20% 98%;
    --muted: 215 27.9% 16.9%;
    --muted-foreground: 217.9 10.6% 64.9%;
    --accent: 215 27.9% 16.9%;
    --accent-foreground: 210 20% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 20% 98%;
    --border: 215 27.9% 16.9%;
    --input: 215 27.9% 16.9%;
    --ring: 216 12.2% 83.9%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
    --sidebar-background: 240 5.9% 10%;
    --sidebar-foreground: 240 4.8% 95.9%;
    --sidebar-primary: 224.3 76.3% 48%;
    --sidebar-primary-foreground: 0 0% 100%;
    --sidebar-accent: 240 3.7% 15.9%;
    --sidebar-accent-foreground: 240 4.8% 95.9%;
    --sidebar-border: 240 3.7% 15.9%;
    --sidebar-ring: 217.2 91.2% 59.8%;
  }
}

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; }
}
```

**Step 2: Verify colors render in browser**

Visit `http://localhost:3000` — background should be white (light) / dark navy (dark).

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: update design tokens — full shadcn theme with chart vars and sidebar vars"
```

---

## Task 3: Rebuild sidebar + dashboard layout

**Files:**
- Modify: `components/layout/sidebar.tsx`
- Modify: `app/(dashboard)/layout.tsx`
- Delete: `components/layout/dashboard-header.tsx`

**Step 1: Rewrite `components/layout/sidebar.tsx`**

```tsx
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard, MessageSquare, Bell, Store,
  Wallet, FolderOpen, Blocks, Settings, LogOut, Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"

const navItems = [
  { href: "/dashboard",      label: "Overview",       icon: LayoutDashboard },
  { href: "/chat",           label: "Chat",            icon: MessageSquare,  badge: 3 },
  { href: "/notifications",  label: "Notifications",   icon: Bell,           badge: 9 },
  { href: "/marketplace",    label: "Marketplace",     icon: Store },
  { href: "/wallet",         label: "Wallet",          icon: Wallet },
  { href: "/projects",       label: "Projects",        icon: FolderOpen },
  { href: "/components",     label: "Components",      icon: Blocks },
]

interface SidebarProps {
  userEmail?: string | null
  userAvatarUrl?: string | null
  userFullName?: string | null
}

export function Sidebar({ userEmail, userAvatarUrl, userFullName }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const initials = userFullName
    ? userFullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : userEmail?.slice(0, 2).toUpperCase() ?? "??"

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <aside className="flex h-screen w-[220px] flex-col border-r bg-sidebar">
      {/* Logo */}
      <div className="flex h-14 items-center px-4 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
            <Zap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sidebar-foreground">SaaS Starter</span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-l-2 border-primary pl-[10px]"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <Badge variant="secondary" className="h-5 min-w-5 px-1.5 text-[10px]">
                  {item.badge}
                </Badge>
              )}
            </Link>
          )
        })}

        <Separator className="my-2 bg-sidebar-border" />

        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
            pathname === "/settings"
              ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium border-l-2 border-primary pl-[10px]"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          Settings
        </Link>
      </nav>

      {/* User footer */}
      <div className="border-t border-sidebar-border p-3 space-y-2">
        <div className="flex items-center gap-2.5 px-1">
          <Avatar className="h-7 w-7">
            {userAvatarUrl && <AvatarImage src={userAvatarUrl} />}
            <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-sidebar-foreground">{userFullName ?? userEmail}</p>
            {userFullName && <p className="truncate text-[10px] text-sidebar-foreground/60">{userEmail}</p>}
          </div>
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-sidebar-foreground/60 hover:text-destructive h-8 px-3"
          onClick={handleSignOut}
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="text-xs">Sign out</span>
        </Button>
      </div>
    </aside>
  )
}
```

**Step 2: Update `app/(dashboard)/layout.tsx`**

Remove `DashboardHeader` import and usage. The layout becomes:

```tsx
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Sidebar } from "@/components/layout/sidebar"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar
        userEmail={user.email}
        userFullName={profile?.full_name}
        userAvatarUrl={profile?.avatar_url}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
```

**Step 3: Delete `components/layout/dashboard-header.tsx`**

```bash
rm /Users/abhi/Github/bubblexport-saas-starter/components/layout/dashboard-header.tsx
```

**Step 4: Verify sidebar renders at localhost:3000/dashboard**

Expected: 220px sidebar with logo, 7 nav items + separator + Settings, user footer with theme toggle.

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: rebuild sidebar with full 7-page nav, theme toggle, active border-l indicator"
```

---

## Task 4: Update Supabase schema + seed

**Files:**
- Modify: `supabase/schema.sql`
- Modify: `supabase/seed.sql`
- Modify: `types/database.ts`

**Step 1: Append new tables to `supabase/schema.sql`**

```sql
-- Chat channels
create table public.channels (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz default now()
);

-- Chat messages (Realtime enabled)
create table public.messages (
  id         uuid primary key default gen_random_uuid(),
  channel_id uuid not null references public.channels(id) on delete cascade,
  sender_id  uuid not null references public.profiles(id) on delete cascade,
  content    text not null,
  created_at timestamptz default now()
);

alter table public.messages enable row level security;
create policy "Users can read all messages" on public.messages for select using (auth.uid() is not null);
create policy "Users can insert own messages" on public.messages for insert with check (auth.uid() = sender_id);

-- Enable Realtime for messages
alter publication supabase_realtime add table public.messages;

-- Notifications
create table public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  type       text not null check (type in ('liked','commented','mentioned','followed')),
  content    text not null,
  read       boolean not null default false,
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;
create policy "Users manage own notifications" on public.notifications for all using (auth.uid() = user_id);

-- Marketplace
create table public.marketplace_items (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  category    text not null,
  price       numeric(10,2) not null default 0,
  image_url   text,
  description text,
  created_at  timestamptz default now()
);

alter table public.marketplace_items enable row level security;
create policy "Anyone can read marketplace" on public.marketplace_items for select using (true);

-- Transactions (Wallet)
create table public.transactions (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  amount     numeric(10,2) not null,
  method     text not null default 'stripe',
  status     text not null default 'paid' check (status in ('paid','pending','failed')),
  fees       numeric(10,2) not null default 0,
  created_at timestamptz default now()
);

alter table public.transactions enable row level security;
create policy "Users read own transactions" on public.transactions for select using (auth.uid() = user_id);

-- Projects: add due_date + members
alter table public.projects add column if not exists due_date timestamptz;
alter table public.projects add column if not exists member_count integer not null default 1;

-- Tasks
create table public.tasks (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references public.projects(id) on delete cascade,
  title       text not null,
  status      text not null default 'todo' check (status in ('todo','in-progress','done')),
  assignee_id uuid references public.profiles(id),
  created_at  timestamptz default now()
);

alter table public.tasks enable row level security;
create policy "Users manage tasks in own projects"
  on public.tasks for all
  using (exists (select 1 from public.projects where id = project_id and owner_id = auth.uid()));
```

**Step 2: Update `supabase/seed.sql` with sample data for all new tables**

Add after existing seed data:

```sql
-- Seed channels + messages
insert into public.channels (id, name) values
  ('00000000-0000-0000-0000-000000000001', 'general'),
  ('00000000-0000-0000-0000-000000000002', 'design'),
  ('00000000-0000-0000-0000-000000000003', 'engineering');

-- Seed marketplace items
insert into public.marketplace_items (title, category, price, description) values
  ('EzProfi Template',       'Template',  149.00, 'Professional portfolio template'),
  ('EzJob Board',            'Template',  199.00, 'Full job board with applications'),
  ('EzConstruction',         'Template',  299.00, 'Construction management system'),
  ('EzRent',                 'Template',  199.00, 'Property rental management'),
  ('Analytics Pro Plugin',   'Plugin',     49.00, 'Advanced analytics dashboard'),
  ('Payment Gateway Plugin', 'Plugin',     79.00, 'Multi-gateway payment processing');

-- Seed transactions (will need real user_id at runtime — these are placeholders)
-- In production these are inserted by the app after auth
```

**Step 3: Update `types/database.ts` to add new table types**

Add `channels`, `messages`, `notifications`, `marketplace_items`, `transactions`, `tasks` to the `Database` interface following the existing pattern.

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: add schema for chat/notifications/marketplace/wallet/tasks tables"
```

---

## Task 5: Rebuild Overview page (`/dashboard`)

**Files:**
- Modify: `app/(dashboard)/dashboard/page.tsx`
- Create: `components/dashboard/revenue-chart.tsx`
- Create: `components/dashboard/goals-panel.tsx`
- Create: `components/dashboard/latest-sales.tsx`
- Create: `components/dashboard/stat-card.tsx`

**Step 1: Create `components/dashboard/stat-card.tsx`**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  delta: string
  deltaPositive?: boolean
  icon: LucideIcon
  description?: string
}

export function StatCard({ title, value, delta, deltaPositive = true, icon: Icon, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
          <Icon className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">
          <span className={cn("font-medium", deltaPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400")}>
            {delta}
          </span>{" "}
          {description ?? "from last month"}
        </p>
      </CardContent>
    </Card>
  )
}
```

**Step 2: Create `components/dashboard/revenue-chart.tsx`**

Use shadcn `AreaChart`. Sample data Jan–Aug. Gradient fill using `linearGradient` defs. Title "Monthly Revenue" with total in top-right.

```tsx
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
```

**Step 3: Create `components/dashboard/goals-panel.tsx`**

```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

const goals = [
  { name: "Q4 Revenue",    current: 8520,  target: 10000 },
  { name: "New Users",     current: 342,   target: 500 },
  { name: "Churn Reduction", current: 68, target: 100 },
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
```

**Step 4: Create `components/dashboard/latest-sales.tsx`**

```tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const sales = [
  { name: "Olivia Martin",   email: "olivia@example.com",  amount: "+$149.00" },
  { name: "Jackson Lee",     email: "jackson@example.com", amount: "+$199.00" },
  { name: "Isabella Nguyen", email: "isabella@example.com",amount: "+$299.00" },
  { name: "William Kim",     email: "will@example.com",    amount: "+$199.00" },
  { name: "Sofia Davis",     email: "sofia@example.com",   amount: "+$49.00"  },
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
              <AvatarFallback className="text-xs">{s.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
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
```

**Step 5: Rewrite `app/(dashboard)/dashboard/page.tsx`**

```tsx
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

      {/* Charts row */}
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
```

**Step 6: Verify at localhost:3000/dashboard**

Expected: 4 stat cards, area chart with gradient, goals progress bars, latest sales list.

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: rebuild overview page with shadcn AreaChart, stat cards, goals, latest sales"
```

---

## Task 6: Projects page + task detail (`/projects`)

**Files:**
- Modify: `app/(dashboard)/projects/page.tsx`
- Modify: `app/(dashboard)/projects/[id]/page.tsx`
- Create: `components/projects/project-card.tsx`
- Create: `components/projects/new-project-dialog.tsx`

**Step 1: Create `components/projects/project-card.tsx`**

Card with: title, status badge, `member_count` avatar stack placeholder, due date with color-coded urgency (red if past, amber if <7 days, green otherwise), "Open" button.

**Step 2: Create `components/projects/new-project-dialog.tsx`**

shadcn `Dialog` with form: title (required), description, status `Select`, due_date `Input[type=date]`. Submit calls a server action that inserts into `projects`.

**Step 3: Rewrite `app/(dashboard)/projects/page.tsx`**

```tsx
// Server component — fetches projects, renders card grid
// "+ New Project" button opens NewProjectDialog (client)
// 3-col grid on desktop, 2-col tablet, 1-col mobile
```

**Step 4: Rewrite `app/(dashboard)/projects/[id]/page.tsx`**

Three-column kanban board: Todo | In Progress | Done. Each column lists tasks as draggable cards (static for now — no drag, just columns). "+ Add task" button at bottom of each column inserts via server action.

**Step 5: Verify at localhost:3000/projects**

**Step 6: Commit**

```bash
git add -A && git commit -m "feat: projects card grid + task kanban view"
```

---

## Task 7: Chat page with Supabase Realtime (`/chat`)

**Files:**
- Create: `app/(dashboard)/chat/page.tsx`
- Create: `components/chat/conversation-list.tsx`
- Create: `components/chat/message-thread.tsx`
- Create: `components/chat/message-input.tsx`
- Create: `lib/realtime.ts`

**Step 1: Create `lib/realtime.ts`**

```ts
import { createClient } from "@/lib/supabase/client"

export function subscribeToMessages(
  channelId: string,
  onMessage: (message: any) => void
) {
  const supabase = createClient()

  const channel = supabase
    .channel(`messages:${channelId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `channel_id=eq.${channelId}`,
      },
      (payload) => onMessage(payload.new)
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}
```

**Step 2: Create `components/chat/message-thread.tsx`**

Client component:
- Props: `channelId`, `initialMessages`, `currentUserId`
- `useState` for messages (initialized with `initialMessages`)
- `useEffect` calls `subscribeToMessages`, appends new messages to state
- Renders messages in a `ScrollArea` — sent messages right-aligned, received left-aligned
- `useEffect` to scroll to bottom on new message

**Step 3: Create `components/chat/message-input.tsx`**

Client component:
- `Input` + "Send" `Button`
- On submit: insert message to Supabase directly from client (`supabase.from("messages").insert(...)`)
- Optimistic: append to local state before awaiting DB response
- Enter key submits

**Step 4: Create `components/chat/conversation-list.tsx`**

Static list of channels from `channels` table. Active channel highlighted. Shows last message preview (truncated).

**Step 5: Create `app/(dashboard)/chat/page.tsx`**

```tsx
// Server component — fetch channels + initial messages for first channel
// Three-column layout: ConversationList | MessageThread | profile panel
// Profile panel: name, email, "Members in channel" count
```

**Step 6: Verify at localhost:3000/chat**

Open two browser tabs — send a message in one, verify it appears instantly in the other.

**Step 7: Commit**

```bash
git add -A && git commit -m "feat: real-time chat page with Supabase Realtime + optimistic UI"
```

---

## Task 8: Notifications page (`/notifications`)

**Files:**
- Create: `app/(dashboard)/notifications/page.tsx`
- Create: `components/notifications/notification-feed.tsx`
- Create: `components/notifications/notification-filters.tsx`

**Step 1: Create `components/notifications/notification-feed.tsx`**

Server component. Maps over notifications array:
- Avatar (fallback initials)
- Type badge (liked=emerald, commented=blue, mentioned=amber, followed=purple)
- Content text
- Relative time (`Intl.RelativeTimeFormat`)
- Unread indicator (blue dot left of row)

**Step 2: Create `components/notifications/notification-filters.tsx`**

Client component. Checkbox group (Likes, Comments, Mentions, Followers, Other). "Select All" / "Unselect All" buttons. Emits `onFilterChange` callback. Uses URL search params to persist filter state.

**Step 3: Create `app/(dashboard)/notifications/page.tsx`**

```tsx
// Two-column layout: feed (flex-1) + filter panel (240px)
// Fetch notifications from Supabase, sorted by created_at desc
// "Mark all read" button → server action sets read=true for user's notifications
```

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: notifications page with activity feed and filter panel"
```

---

## Task 9: Marketplace page (`/marketplace`)

**Files:**
- Create: `app/(dashboard)/marketplace/page.tsx`
- Create: `components/marketplace/item-card.tsx`

**Step 1: Create `components/marketplace/item-card.tsx`**

Card with: placeholder image area (colored gradient by category), title, category `Badge`, price formatted as currency, description (2-line clamp), "View" `Button`.

**Step 2: Create `app/(dashboard)/marketplace/page.tsx`**

```tsx
// Fetch marketplace_items from Supabase
// Header: "Marketplace" title + search Input (cmdk trigger)
// Responsive card grid: 3 cols lg, 2 cols md, 1 col sm
// Category filter tabs above grid (All, Templates, Plugins)
```

**Step 3: Commit**

```bash
git add -A && git commit -m "feat: marketplace page with item cards and category filter tabs"
```

---

## Task 10: Wallet page with DataTable (`/wallet`)

**Files:**
- Create: `app/(dashboard)/wallet/page.tsx`
- Create: `components/wallet/transactions-table.tsx`
- Create: `components/wallet/payment-method-selector.tsx`

**Step 1: Create `components/wallet/transactions-table.tsx`**

Client component using `@tanstack/react-table` v8 + shadcn `Table`:

```tsx
// Columns: checkbox | Transaction ID | Amount | Method | Status | Date | Fees
// Status cell: Badge (paid=emerald, pending=amber, failed=red)
// Column sorting on Amount + Date
// Status filter dropdown (All, Paid, Pending, Failed)
// Pagination: 10 rows per page, prev/next buttons
// Export CSV button: generates CSV from table data + triggers download
```

**Step 2: Create `components/wallet/payment-method-selector.tsx`**

Two cards (PayPal + Stripe) with radio-style selection. Selected card has `ring-2 ring-primary`. Shows connected status.

**Step 3: Create `app/(dashboard)/wallet/page.tsx`**

```tsx
// Three sections stacked:
// 1. Top row: PaymentMethodSelector (left) + earnings summary card (right: "$2,342 this month" + Withdraw button)
// 2. TransactionsTable with fetched transactions
```

**Step 4: Commit**

```bash
git add -A && git commit -m "feat: wallet page with payment method selector and sortable/filterable DataTable"
```

---

## Task 11: Components showcase page (`/components`)

**Files:**
- Create: `app/(dashboard)/components/page.tsx`
- Create: `components/showcase/charts-tab.tsx`
- Create: `components/showcase/forms-tab.tsx`
- Create: `components/showcase/data-tab.tsx`

**Step 1: Create `components/showcase/charts-tab.tsx`**

Three charts side-by-side using shadcn chart primitives:
- `AreaChart` — revenue (reuse from dashboard)
- `BarChart` — weekly active users
- `PieChart` — revenue by category (Templates 45%, Plugins 30%, Services 25%)

Each wrapped in a `Card` with title + description.

**Step 2: Create `components/showcase/forms-tab.tsx`**

A card showing a sample form with: `Input` (name, email), `Select` (role), `Textarea` (bio), date `Input`, `Button` row. No real submit — visual showcase only. Fully keyboard-navigable.

**Step 3: Create `components/showcase/data-tab.tsx`**

A card with a shadcn `Table` of 8 sample rows: Name, Email, Role, Status badge, Joined date. Sortable by name. Filter input above table.

**Step 4: Create `app/(dashboard)/components/page.tsx`**

```tsx
// Page title "Components" + subtitle "shadcn/ui component showcase"
// shadcn Tabs: Charts | Forms | Data
// Each tab renders its respective showcase component
```

**Step 5: Commit**

```bash
git add -A && git commit -m "feat: components showcase page with charts, forms, and data table tabs"
```

---

## Task 12: Polish — auth pages, settings, mobile responsiveness

**Files:**
- Modify: `app/(auth)/login/page.tsx`
- Modify: `app/(auth)/signup/page.tsx`
- Modify: `app/(auth)/forgot-password/page.tsx`
- Modify: `app/(dashboard)/settings/page.tsx`

**Step 1: Polish auth pages**

Centered card layout. Logo + app name above card. Card: `max-w-sm`, subtle border, proper spacing. Input labels aligned. Error state: red border + message below input. Link to signup/login below form. Matches light + dark mode.

**Step 2: Polish settings page**

Two sections in `Card` components: "Profile" (full name, avatar URL) and "Security" (change password). Success `Toast` on save. Destructive "Delete Account" button at bottom in a separate danger zone card.

**Step 3: Add mobile sidebar (sheet)**

On `< lg` screens, sidebar becomes a `Sheet` (slide-over drawer). Hamburger button in a top bar. Use shadcn `Sheet` component.

**Step 4: Final build check**

```bash
npm run build
```

Expected: 0 errors, all pages SSG or SSR as expected.

**Step 5: Push to GitHub**

```bash
git push origin master
```

**Step 6: Commit any remaining polish**

```bash
git add -A && git commit -m "feat: polish auth pages, settings, mobile responsive sidebar"
```

---

## Task 13: Update bubblexport.com template showcase

**Files (in bubblexport.com worktree):**
- Modify: `content/templates/saas-admin.ts`
- Replace: `public/templates/saas-admin/before/dashboard.svg` → PNG screenshot from Playwright
- Replace: `public/templates/saas-admin/after/dashboard.svg` → PNG screenshot from localhost

**Step 1: Take before screenshot via Playwright**

Navigate to `https://ezdashboardpro.bubbleapps.io/overview_new`, wait for load, save to `public/templates/saas-admin/before/dashboard.png`.

**Step 2: Take after screenshot via Playwright**

Navigate to `http://localhost:3000/dashboard` (saas-starter running), save to `public/templates/saas-admin/after/dashboard.png`.

**Step 3: Update `content/templates/saas-admin.ts`**

- Update `name` to "Ez Pro Dashboard"
- Update `description` to match Pro version
- Update `beforeImage`/`afterImage` to `.png`
- Update `features` list to match all 7 pages
- Update `stats` to reflect the Pro version

**Step 4: Commit bubblexport.com changes**

```bash
git add -A && git commit -m "feat: update template showcase with real before/after screenshots of Pro rebuild"
```
