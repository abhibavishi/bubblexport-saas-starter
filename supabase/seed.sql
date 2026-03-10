-- ============================================================
-- BubbleExport SaaS Starter — Seed Data
-- Run AFTER schema.sql. Replace the UUIDs with real auth user IDs
-- from your Supabase Auth dashboard after creating test accounts.
-- ============================================================

-- Sample admin profile
-- Replace '00000000-0000-0000-0000-000000000001' with a real auth user UUID
insert into public.profiles (id, full_name, avatar_url, role)
values (
  '00000000-0000-0000-0000-000000000001',
  'Alice Admin',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
  'admin'
)
on conflict (id) do update set
  full_name  = excluded.full_name,
  avatar_url = excluded.avatar_url,
  role       = excluded.role;

-- Sample projects
insert into public.projects (id, owner_id, title, description, status)
values
  (
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'CRM Dashboard',
    'Customer relationship management tool migrated from Bubble.io. Tracks leads, deals, and customer interactions.',
    'active'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Booking Platform',
    'Online appointment scheduling system. Supports multi-timezone bookings and automated email reminders.',
    'active'
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Marketplace MVP',
    'Two-sided marketplace for freelancers. Includes payments, reviews, and dispute resolution workflows.',
    'paused'
  )
on conflict (id) do nothing;

-- ============================================================
-- Premium Dashboard Seed Data
-- ============================================================

-- Seed channels
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
