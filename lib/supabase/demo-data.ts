export const DEMO_USER = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "demo@example.com",
  app_metadata: {},
  user_metadata: {},
  aud: "authenticated",
  created_at: "2024-01-01T00:00:00Z",
} as const

export const DEMO_PROFILE = {
  id: DEMO_USER.id,
  full_name: "Alex Demo",
  avatar_url: null,
  role: "admin" as const,
  stripe_customer_id: null,
  updated_at: "2024-01-01T00:00:00Z",
}

export const DEMO_DATA: Record<string, unknown[]> = {
  profiles: [DEMO_PROFILE],
  projects: [
    { id: "p1", owner_id: DEMO_USER.id, title: "Website Redesign", description: "Modernize the company website", status: "active", due_date: "2026-04-15T00:00:00Z", member_count: 3, created_at: "2024-01-10T00:00:00Z" },
    { id: "p2", owner_id: DEMO_USER.id, title: "Mobile App v2",    description: "Major feature update", status: "active", due_date: "2026-03-28T00:00:00Z", member_count: 5, created_at: "2024-01-15T00:00:00Z" },
    { id: "p3", owner_id: DEMO_USER.id, title: "API Migration",    description: "Move to REST v3",            status: "paused", due_date: "2026-05-01T00:00:00Z", member_count: 2, created_at: "2024-02-01T00:00:00Z" },
    { id: "p4", owner_id: DEMO_USER.id, title: "Analytics Dashboard", description: "Internal reporting", status: "completed", due_date: "2025-12-31T00:00:00Z", member_count: 4, created_at: "2024-02-20T00:00:00Z" },
  ],
  subscriptions: [
    { id: "s1", user_id: DEMO_USER.id, plan: "pro", status: "active", stripe_subscription_id: null, current_period_end: "2026-04-01T00:00:00Z", updated_at: "2024-01-01T00:00:00Z" },
  ],
  channels: [
    { id: "00000000-0000-0000-0000-000000000001", name: "general",     created_at: "2024-01-01T00:00:00Z" },
    { id: "00000000-0000-0000-0000-000000000002", name: "design",      created_at: "2024-01-01T00:00:00Z" },
    { id: "00000000-0000-0000-0000-000000000003", name: "engineering", created_at: "2024-01-01T00:00:00Z" },
  ],
  messages: [
    { id: "m1", channel_id: "00000000-0000-0000-0000-000000000001", sender_id: DEMO_USER.id,                             content: "Hey team, how's everyone doing?",         created_at: "2024-03-10T09:00:00Z" },
    { id: "m2", channel_id: "00000000-0000-0000-0000-000000000001", sender_id: "00000000-0000-0000-0000-000000000099", content: "All good! Working on the new feature.",    created_at: "2024-03-10T09:05:00Z" },
    { id: "m3", channel_id: "00000000-0000-0000-0000-000000000001", sender_id: DEMO_USER.id,                             content: "Awesome, let me know if you need help.",    created_at: "2024-03-10T09:10:00Z" },
    { id: "m4", channel_id: "00000000-0000-0000-0000-000000000002", sender_id: "00000000-0000-0000-0000-000000000099", content: "Check out the new mockups in Figma.",       created_at: "2024-03-10T10:00:00Z" },
    { id: "m5", channel_id: "00000000-0000-0000-0000-000000000002", sender_id: DEMO_USER.id,                             content: "Love the direction! Looks clean.",          created_at: "2024-03-10T10:15:00Z" },
  ],
  notifications: [
    { id: "n1", user_id: DEMO_USER.id, type: "liked",     content: "Sarah liked your project update",           read: false, created_at: new Date(Date.now() - 5 * 60000).toISOString() },
    { id: "n2", user_id: DEMO_USER.id, type: "commented", content: "James commented on your task",               read: false, created_at: new Date(Date.now() - 30 * 60000).toISOString() },
    { id: "n3", user_id: DEMO_USER.id, type: "mentioned", content: "Emma mentioned you in #design",             read: false, created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
    { id: "n4", user_id: DEMO_USER.id, type: "followed",  content: "Michael started following you",             read: true,  created_at: new Date(Date.now() - 5 * 3600000).toISOString() },
    { id: "n5", user_id: DEMO_USER.id, type: "liked",     content: "Lisa liked your comment",                    read: true,  created_at: new Date(Date.now() - 24 * 3600000).toISOString() },
    { id: "n6", user_id: DEMO_USER.id, type: "commented", content: "Tom left a review on Website Redesign",    read: true,  created_at: new Date(Date.now() - 48 * 3600000).toISOString() },
  ],
  marketplace_items: [
    { id: "mi1", title: "EzProfi Template",       category: "Template", price: 149, description: "Professional portfolio template",         image_url: null, created_at: "2024-01-01T00:00:00Z" },
    { id: "mi2", title: "EzJob Board",            category: "Template", price: 199, description: "Full job board with applications",        image_url: null, created_at: "2024-01-01T00:00:00Z" },
    { id: "mi3", title: "EzConstruction",         category: "Template", price: 299, description: "Construction management system",          image_url: null, created_at: "2024-01-01T00:00:00Z" },
    { id: "mi4", title: "EzRent",                 category: "Template", price: 199, description: "Property rental management",              image_url: null, created_at: "2024-01-01T00:00:00Z" },
    { id: "mi5", title: "Analytics Pro Plugin",   category: "Plugin",    price:  49, description: "Advanced analytics dashboard plugin",    image_url: null, created_at: "2024-01-01T00:00:00Z" },
    { id: "mi6", title: "Payment Gateway Plugin", category: "Plugin",    price:  79, description: "Multi-gateway payment processing",       image_url: null, created_at: "2024-01-01T00:00:00Z" },
  ],
  transactions: [
    { id: "t1", user_id: DEMO_USER.id, amount: 149.00, method: "stripe", status: "paid",    fees: 4.47, created_at: new Date(Date.now() - 1 * 86400000).toISOString() },
    { id: "t2", user_id: DEMO_USER.id, amount: 199.00, method: "stripe", status: "paid",    fees: 5.97, created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: "t3", user_id: DEMO_USER.id, amount:  79.00, method: "paypal", status: "pending", fees: 2.37, created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
    { id: "t4", user_id: DEMO_USER.id, amount: 299.00, method: "stripe", status: "paid",    fees: 8.97, created_at: new Date(Date.now() - 8 * 86400000).toISOString() },
    { id: "t5", user_id: DEMO_USER.id, amount:  49.00, method: "stripe", status: "failed",  fees: 0,    created_at: new Date(Date.now() - 10 * 86400000).toISOString() },
    { id: "t6", user_id: DEMO_USER.id, amount: 199.00, method: "paypal", status: "paid",    fees: 5.97, created_at: new Date(Date.now() - 14 * 86400000).toISOString() },
  ],
  tasks: [
    { id: "tk1", project_id: "p1", title: "Define requirements",     status: "done",        assignee_id: DEMO_USER.id, created_at: "2024-01-10T00:00:00Z" },
    { id: "tk2", project_id: "p1", title: "Create wireframes",       status: "done",        assignee_id: DEMO_USER.id, created_at: "2024-01-11T00:00:00Z" },
    { id: "tk3", project_id: "p1", title: "Build homepage",          status: "in-progress", assignee_id: DEMO_USER.id, created_at: "2024-01-12T00:00:00Z" },
    { id: "tk4", project_id: "p1", title: "Write copy",              status: "in-progress", assignee_id: null,         created_at: "2024-01-13T00:00:00Z" },
    { id: "tk5", project_id: "p1", title: "QA testing",              status: "todo",        assignee_id: null,         created_at: "2024-01-14T00:00:00Z" },
    { id: "tk6", project_id: "p2", title: "Research competitors",    status: "done",        assignee_id: DEMO_USER.id, created_at: "2024-01-15T00:00:00Z" },
    { id: "tk7", project_id: "p2", title: "Design new UI",           status: "in-progress", assignee_id: DEMO_USER.id, created_at: "2024-01-16T00:00:00Z" },
    { id: "tk8", project_id: "p2", title: "Implement auth changes",  status: "todo",        assignee_id: null,         created_at: "2024-01-17T00:00:00Z" },
  ],
}
