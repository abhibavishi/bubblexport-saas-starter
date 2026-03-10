# Premium Dashboard Rebuild — Design Document

**Date:** 2026-03-10
**Repo:** `bubblexport-saas-starter`
**Approach:** Full in-place rebuild (Approach A)

## Goal

Rebuild the EZ Pro Dashboard (48.7k Bubble installs) as a premium, minimal Next.js 15 + shadcn/ui showcase. The result is used as the "after" in BubbleExport's before/after template comparison at `/templates/saas-admin` on bubblexport.com.

The design must be visibly, dramatically better than the Bubble original — not just functional, but a reference-quality implementation that makes a Bubble founder think "I want my app to look like that."

---

## Design System & Shell

**Typography:** Inter (already installed)
**Spacing:** 8px grid throughout
**Color mode:** System default — both light and dark polished equally, via `next-themes`
**Cards:** `border-border/50` with `hover:border-border` transition. No drop shadows on flat cards — shadows reserved for modals/popovers only.
**Active nav state:** Left-border accent (`border-l-2 border-primary`) + subtle background, not a filled pill
**Page titles:** Inline on each page — top header bar removed entirely
**Dark mode toggle:** Icon button in sidebar footer (`Sun`/`Moon` swap)

### Sidebar nav (top → bottom)
```
Overview          (LayoutDashboard)
Chat              (MessageSquare) + unread count badge
Notifications     (Bell) + unread count badge
Marketplace       (Store)
Wallet            (Wallet)
Projects          (Folder)
Components        (Blocks)
────────────────
Settings          (Settings)
[Avatar + name]
[Dark mode toggle]
[Sign out]
```

---

## Pages

### 1. Overview (`/dashboard`)
- 4 KPI stat cards: Active Users, Clicks, Revenue, Items — with trend delta and colored indicator
- Main chart: shadcn `AreaChart` (revenue over time, gradient fill) — 2/3 width
- Right panel: Goals with `Progress` bars + Latest Sales feed — 1/3 width
- Bottom row: Users `BarChart` (left) + Income card with "Withdraw earnings" button (right)

### 2. Chat (`/chat`)
- Three-column: conversation list (280px) | message thread (flex-1) | contact profile (280px, collapsible mobile)
- Supabase Realtime subscription on `messages` table filtered by `channel_id`
- Optimistic UI — message renders immediately on send, syncs to DB in background
- Typing indicator via Realtime presence

### 3. Notifications (`/notifications`)
- Activity feed: avatar + type label + content preview + relative timestamp
- Right panel: checkbox filter (Likes, Comments, Mentions, Followers, Other)
- Mark all read button — clears sidebar badge
- Items stored in `notifications` table, filtered by `user_id`

### 4. Marketplace (`/marketplace`)
- Responsive card grid (3 cols desktop, 2 tablet, 1 mobile)
- Each card: cover image, title, category `Badge`, price, "View" CTA
- Static seeded data (no purchase flow for showcase)
- Search bar using `cmdk` command palette pattern

### 5. Wallet (`/wallet`)
- Top: payment method selector (PayPal + Stripe cards, selectable)
- Earnings summary card with "Withdraw all earnings" button
- `DataTable` using `@tanstack/react-table` v8 + shadcn Table:
  - Columns: Transaction, Amount, Method, Status badge, Date, Fees
  - Column sorting, status filter dropdown, 10-row pagination
  - Export CSV button

### 6. Projects (`/projects`)
- Card grid: title, member avatar stack, task count badge, due date (color-coded urgency)
- "+ New Project" → shadcn `Dialog` with form (title, description, due date, status)
- `/projects/[id]` → task list with three status columns (Todo, In Progress, Done)

### 7. Components (`/components`)
Three shadcn `Tabs`:
- **Charts** — AreaChart, BarChart, PieChart rendered with live sample data
- **Forms** — Input, Select, DatePicker, Combobox, Textarea patterns
- **Data** — Sortable/filterable Table with pagination

---

## Data Layer

### New tables (added to `supabase/schema.sql`)

```sql
-- Chat
channels    (id, name, created_at)
messages    (id, channel_id, sender_id, content, created_at)
            -- Realtime publication enabled

-- Notifications
notifications (id, user_id, type, content, read, created_at)

-- Marketplace
marketplace_items (id, title, category, price, image_url, description)

-- Wallet
transactions (id, user_id, amount, method, status, fees, created_at)

-- Projects extension
ALTER TABLE projects ADD COLUMN due_date timestamptz;
ALTER TABLE projects ADD COLUMN members uuid[];

-- Tasks
tasks (id, project_id, title, status, assignee_id, created_at)
```

All new tables: RLS enabled, users see only their own rows.
Seed file updated with sample data for all new tables.

---

## New Dependencies

| Package | Use |
|---------|-----|
| `next-themes` | Dark/light/system mode |
| `@tanstack/react-table` | Wallet DataTable |
| `cmdk` | Command palette / search |

`recharts` — already in `package.json` ✓
shadcn chart primitives — added via `npx shadcn@latest add chart`

---

## File Changes Summary

**Modified:**
- `supabase/schema.sql` — new tables
- `supabase/seed.sql` — seed new tables
- `tailwind.config.ts` — ensure chart CSS vars present
- `app/layout.tsx` — add ThemeProvider
- `components/layout/sidebar.tsx` — full nav + dark mode toggle
- `app/(dashboard)/dashboard/page.tsx` — new layout
- `app/(dashboard)/projects/page.tsx` — card grid
- `app/(dashboard)/projects/[id]/page.tsx` — task view
- `app/(dashboard)/settings/page.tsx` — keep, minor polish
- `app/(dashboard)/billing/page.tsx` — keep, minor polish

**New:**
- `components/ui/chart.tsx` — shadcn chart primitive
- `components/ui/progress.tsx`
- `components/ui/command.tsx`
- `components/ui/scroll-area.tsx`
- `components/dashboard/area-chart.tsx`
- `components/dashboard/bar-chart.tsx`
- `components/dashboard/goals-panel.tsx`
- `components/dashboard/latest-sales.tsx`
- `app/(dashboard)/chat/page.tsx`
- `app/(dashboard)/notifications/page.tsx`
- `app/(dashboard)/marketplace/page.tsx`
- `app/(dashboard)/wallet/page.tsx`
- `app/(dashboard)/components/page.tsx`
- `lib/realtime.ts` — Supabase Realtime helpers
