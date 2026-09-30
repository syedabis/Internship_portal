-- =====================================================
-- Cortexa AI Internship Portal — Production Database Setup & Hardened RLS
-- Run this in Supabase Dashboard > SQL Editor
-- (Tables already exist in production; this ensures indexes and hardened RLS)
-- =====================================================

-- 1. Helper function: check if current user is an authorized administrator
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    (auth.jwt() ->> 'email') IN (
      'abis@datacrumbs.org',
      'admin@datacrumbs.org',
      'aun@datacrumbs.org'
    )
    OR
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    OR
    auth.role() = 'service_role'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Schema Reference & Table Definitions (IF NOT EXISTS)

CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  author_email TEXT,
  pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'AI Models',
  description TEXT NOT NULL,
  badge TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  icon_name TEXT DEFAULT 'Brain',
  icon_bg TEXT DEFAULT 'from-blue-600 to-indigo-600',
  popular BOOLEAN DEFAULT false,
  rating NUMERIC DEFAULT 4.5,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  image_url TEXT
);

CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  instructor TEXT NOT NULL,
  role TEXT,
  duration TEXT,
  level TEXT DEFAULT 'Beginner',
  category TEXT,
  description TEXT,
  youtube_id TEXT,
  thumbnail_url TEXT,
  avatar_url TEXT,
  resource_links JSONB DEFAULT '[]'::jsonb,
  rating NUMERIC DEFAULT 4.5,
  enrolled_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS support_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  user_name TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'resolved')),
  admin_reply TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'City',
  lead_name TEXT NOT NULL DEFAULT 'Lead',
  whatsapp_link TEXT NOT NULL,
  members_count INTEGER DEFAULT 0,
  badge TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ambassadors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  university TEXT,
  chapter_id TEXT,
  chapter_name TEXT NOT NULL,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT now(),
  is_group_admin BOOLEAN DEFAULT false,
  notes TEXT
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  domain TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
  duration TEXT NOT NULL,
  team_size TEXT DEFAULT '1-2',
  tech_stack TEXT[] DEFAULT '{}'::text[],
  learning_outcomes TEXT[] DEFAULT '{}'::text[],
  points INTEGER DEFAULT 350,
  popularity INTEGER DEFAULT 90,
  created_at TIMESTAMPTZ DEFAULT now(),
  case_study JSONB,
  weekly_plan JSONB,
  final_deliverable TEXT,
  evaluation_criteria JSONB
);

CREATE TABLE IF NOT EXISTS project_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL,
  user_name TEXT,
  project_id TEXT NOT NULL,
  week_number INTEGER NOT NULL, -- -1 = Project Enrollment Record; 0 = Custom Project Proposal; 1..4 = Weekly Deliverable Milestones
  deliverable_url TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  points_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Unique Index to enable upserts on project_submissions
CREATE UNIQUE INDEX IF NOT EXISTS idx_project_submissions_conflict 
ON project_submissions (user_email, project_id, week_number);

-- =====================================================
-- 4. Enable Row-Level Security (RLS) on all tables
-- =====================================================
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambassadors ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. Drop old / permissive policies
-- =====================================================
DROP POLICY IF EXISTS "Anyone can read announcements" ON announcements;
DROP POLICY IF EXISTS "Allow all inserts on announcements" ON announcements;
DROP POLICY IF EXISTS "Allow all updates on announcements" ON announcements;
DROP POLICY IF EXISTS "Allow all deletes on announcements" ON announcements;
DROP POLICY IF EXISTS "Public read announcements" ON announcements;
DROP POLICY IF EXISTS "Admin write announcements" ON announcements;
DROP POLICY IF EXISTS "Admin update announcements" ON announcements;
DROP POLICY IF EXISTS "Admin delete announcements" ON announcements;

DROP POLICY IF EXISTS "Anyone can read products" ON products;
DROP POLICY IF EXISTS "Allow all inserts on products" ON products;
DROP POLICY IF EXISTS "Allow all updates on products" ON products;
DROP POLICY IF EXISTS "Allow all deletes on products" ON products;
DROP POLICY IF EXISTS "Public read products" ON products;
DROP POLICY IF EXISTS "Admin write products" ON products;
DROP POLICY IF EXISTS "Admin update products" ON products;
DROP POLICY IF EXISTS "Admin delete products" ON products;

DROP POLICY IF EXISTS "Anyone can read resources" ON resources;
DROP POLICY IF EXISTS "Allow all inserts on resources" ON resources;
DROP POLICY IF EXISTS "Allow all updates on resources" ON resources;
DROP POLICY IF EXISTS "Allow all deletes on resources" ON resources;
DROP POLICY IF EXISTS "Public read resources" ON resources;
DROP POLICY IF EXISTS "Admin write resources" ON resources;
DROP POLICY IF EXISTS "Admin update resources" ON resources;
DROP POLICY IF EXISTS "Admin delete resources" ON resources;

DROP POLICY IF EXISTS "Allow select on chapters" ON chapters;
DROP POLICY IF EXISTS "Allow all updates/inserts on chapters" ON chapters;
DROP POLICY IF EXISTS "Public read chapters" ON chapters;
DROP POLICY IF EXISTS "Admin write chapters" ON chapters;
DROP POLICY IF EXISTS "Admin update chapters" ON chapters;
DROP POLICY IF EXISTS "Admin delete chapters" ON chapters;

DROP POLICY IF EXISTS "Allow select on ambassadors" ON ambassadors;
DROP POLICY IF EXISTS "Allow all updates/inserts on ambassadors" ON ambassadors;
DROP POLICY IF EXISTS "Public read ambassadors" ON ambassadors;
DROP POLICY IF EXISTS "Admin write ambassadors" ON ambassadors;
DROP POLICY IF EXISTS "Admin update ambassadors" ON ambassadors;
DROP POLICY IF EXISTS "Admin delete ambassadors" ON ambassadors;

DROP POLICY IF EXISTS "Public read projects" ON projects;
DROP POLICY IF EXISTS "Admin write projects" ON projects;
DROP POLICY IF EXISTS "Admin update projects" ON projects;
DROP POLICY IF EXISTS "Admin delete projects" ON projects;

DROP POLICY IF EXISTS "Authenticated users can create support messages" ON support_messages;
DROP POLICY IF EXISTS "Users can read own support messages" ON support_messages;
DROP POLICY IF EXISTS "Allow all selects on support_messages for admin" ON support_messages;
DROP POLICY IF EXISTS "Allow all updates on support_messages" ON support_messages;
DROP POLICY IF EXISTS "Users read own support messages" ON support_messages;
DROP POLICY IF EXISTS "Authenticated users submit support messages" ON support_messages;
DROP POLICY IF EXISTS "Users submit support messages" ON support_messages;
DROP POLICY IF EXISTS "Admin manage support messages" ON support_messages;
DROP POLICY IF EXISTS "Admin delete support messages" ON support_messages;

DROP POLICY IF EXISTS "Users read own submissions" ON project_submissions;
DROP POLICY IF EXISTS "Authenticated users submit project" ON project_submissions;
DROP POLICY IF EXISTS "Users submit project" ON project_submissions;
DROP POLICY IF EXISTS "Users update own pending submission or admin" ON project_submissions;
DROP POLICY IF EXISTS "Admin manage submissions" ON project_submissions;
DROP POLICY IF EXISTS "Admin delete submissions" ON project_submissions;

-- =====================================================
-- 6. Apply Hardened RLS Policies
-- =====================================================

-- Announcements: Public read, Admin write/update/delete
CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Admin write announcements" ON announcements FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update announcements" ON announcements FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete announcements" ON announcements FOR DELETE USING (is_admin());

-- Products: Public read, Admin write/update/delete
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin write products" ON products FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update products" ON products FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete products" ON products FOR DELETE USING (is_admin());

-- Resources: Public read, Admin write/update/delete
CREATE POLICY "Public read resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Admin write resources" ON resources FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update resources" ON resources FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete resources" ON resources FOR DELETE USING (is_admin());

-- Chapters: Public read, Admin write/update/delete
CREATE POLICY "Public read chapters" ON chapters FOR SELECT USING (true);
CREATE POLICY "Admin write chapters" ON chapters FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update chapters" ON chapters FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete chapters" ON chapters FOR DELETE USING (is_admin());

-- Ambassadors: Public read, Admin write/update/delete
CREATE POLICY "Public read ambassadors" ON ambassadors FOR SELECT USING (true);
CREATE POLICY "Admin write ambassadors" ON ambassadors FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update ambassadors" ON ambassadors FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete ambassadors" ON ambassadors FOR DELETE USING (is_admin());

-- Projects: Public read, Admin write/update/delete
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Admin write projects" ON projects FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update projects" ON projects FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete projects" ON projects FOR DELETE USING (is_admin());

-- Support Messages: User sees own + Admin sees all; Anyone can insert
CREATE POLICY "Users read own support messages" ON support_messages
  FOR SELECT USING (is_admin() OR auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users submit support messages" ON support_messages
  FOR INSERT WITH CHECK (user_email IS NOT NULL AND length(user_email) > 3);

CREATE POLICY "Admin manage support messages" ON support_messages
  FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Admin delete support messages" ON support_messages
  FOR DELETE USING (is_admin());

-- Project Submissions: User sees own + Admin sees all
CREATE POLICY "Users read own submissions" ON project_submissions
  FOR SELECT USING (is_admin() OR auth.jwt() ->> 'email' = user_email);

CREATE POLICY "Users submit project" ON project_submissions
  FOR INSERT WITH CHECK (user_email IS NOT NULL AND length(user_email) > 3);

CREATE POLICY "Users update own pending submission or admin" ON project_submissions
  FOR UPDATE USING (
    is_admin() OR (auth.jwt() ->> 'email' = user_email AND status = 'pending')
  )
  WITH CHECK (
    is_admin() OR (auth.jwt() ->> 'email' = user_email AND status = 'pending')
  );

CREATE POLICY "Admin delete submissions" ON project_submissions
  FOR DELETE USING (is_admin());
