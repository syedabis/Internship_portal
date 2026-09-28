-- =====================================================
-- Cortexa AI Internship Portal — Production Database Setup & Hardened RLS
-- Run this in Supabase Dashboard > SQL Editor
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

-- 2. Announcements Table
CREATE TABLE IF NOT EXISTS announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  author_email TEXT,
  pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Products & Perks Table
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
  popular BOOLEAN DEFAULT FALSE,
  rating NUMERIC(3,2) DEFAULT 4.5,
  reviews_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Resources / Masterclasses Table
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
  rating NUMERIC(3,2) DEFAULT 4.5,
  enrolled_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Support Messages Table
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

-- 6. Internship Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  track TEXT NOT NULL,
  difficulty TEXT DEFAULT 'Intermediate',
  duration TEXT DEFAULT '2 Weeks',
  description TEXT NOT NULL,
  deliverables JSONB DEFAULT '[]'::jsonb,
  resources JSONB DEFAULT '[]'::jsonb,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Project Submissions Table
CREATE TABLE IF NOT EXISTS project_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT,
  github_url TEXT NOT NULL,
  demo_url TEXT,
  notes TEXT,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rejected')),
  grade TEXT,
  feedback TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Chapters Table
CREATE TABLE IF NOT EXISTS chapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT 'City',
  lead_name TEXT NOT NULL DEFAULT 'Lead',
  whatsapp_link TEXT NOT NULL,
  members_count INTEGER DEFAULT 0,
  badge TEXT DEFAULT 'Official',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. Ambassadors Table
CREATE TABLE IF NOT EXISTS ambassadors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  university TEXT,
  chapter_id TEXT,
  chapter_name TEXT NOT NULL,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =====================================================
-- Hardened Row-Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE ambassadors ENABLE ROW LEVEL SECURITY;

-- Clean existing policies
DROP POLICY IF EXISTS "Anyone can read announcements" ON announcements;
DROP POLICY IF EXISTS "Allow all inserts on announcements" ON announcements;
DROP POLICY IF EXISTS "Allow all updates on announcements" ON announcements;
DROP POLICY IF EXISTS "Allow all deletes on announcements" ON announcements;

DROP POLICY IF EXISTS "Anyone can read products" ON products;
DROP POLICY IF EXISTS "Allow all inserts on products" ON products;
DROP POLICY IF EXISTS "Allow all updates on products" ON products;
DROP POLICY IF EXISTS "Allow all deletes on products" ON products;

DROP POLICY IF EXISTS "Anyone can read resources" ON resources;
DROP POLICY IF EXISTS "Allow all inserts on resources" ON resources;
DROP POLICY IF EXISTS "Allow all updates on resources" ON resources;
DROP POLICY IF EXISTS "Allow all deletes on resources" ON resources;

DROP POLICY IF EXISTS "Allow select on chapters" ON chapters;
DROP POLICY IF EXISTS "Allow all updates/inserts on chapters" ON chapters;

DROP POLICY IF EXISTS "Allow select on ambassadors" ON ambassadors;
DROP POLICY IF EXISTS "Allow all updates/inserts on ambassadors" ON ambassadors;

DROP POLICY IF EXISTS "Authenticated users can create support messages" ON support_messages;
DROP POLICY IF EXISTS "Users can read own support messages" ON support_messages;
DROP POLICY IF EXISTS "Allow all selects on support_messages for admin" ON support_messages;
DROP POLICY IF EXISTS "Allow all updates on support_messages" ON support_messages;

-- Announcements: Public read, admin-only write
CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Admin write announcements" ON announcements FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update announcements" ON announcements FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete announcements" ON announcements FOR DELETE USING (is_admin());

-- Products: Public read, admin-only write
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Admin write products" ON products FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update products" ON products FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete products" ON products FOR DELETE USING (is_admin());

-- Resources: Public read, admin-only write
CREATE POLICY "Public read resources" ON resources FOR SELECT USING (true);
CREATE POLICY "Admin write resources" ON resources FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update resources" ON resources FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete resources" ON resources FOR DELETE USING (is_admin());

-- Chapters: Public read, admin-only write
CREATE POLICY "Public read chapters" ON chapters FOR SELECT USING (true);
CREATE POLICY "Admin write chapters" ON chapters FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update chapters" ON chapters FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete chapters" ON chapters FOR DELETE USING (is_admin());

-- Ambassadors: Public read, admin-only write
CREATE POLICY "Public read ambassadors" ON ambassadors FOR SELECT USING (true);
CREATE POLICY "Admin write ambassadors" ON ambassadors FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update ambassadors" ON ambassadors FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete ambassadors" ON ambassadors FOR DELETE USING (is_admin());

-- Projects: Public read, admin-only write
CREATE POLICY "Public read projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Admin write projects" ON projects FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admin update projects" ON projects FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete projects" ON projects FOR DELETE USING (is_admin());

-- Support Messages: User sees own + Admin sees all; Authenticated users create
CREATE POLICY "Users read own support messages" ON support_messages
  FOR SELECT USING (is_admin() OR auth.jwt() ->> 'email' = user_email);
CREATE POLICY "Authenticated users submit support messages" ON support_messages
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR is_admin());
CREATE POLICY "Admin manage support messages" ON support_messages
  FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete support messages" ON support_messages
  FOR DELETE USING (is_admin());

-- Project Submissions: User sees own + Admin sees all; Authenticated users submit
CREATE POLICY "Users read own submissions" ON project_submissions
  FOR SELECT USING (is_admin() OR auth.jwt() ->> 'email' = user_email OR auth.uid()::text = user_id);
CREATE POLICY "Authenticated users submit project" ON project_submissions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR is_admin());
CREATE POLICY "Admin manage submissions" ON project_submissions
  FOR UPDATE USING (is_admin()) WITH CHECK (is_admin());
CREATE POLICY "Admin delete submissions" ON project_submissions
  FOR DELETE USING (is_admin());

-- =====================================================
-- Seed Data: Announcements
-- =====================================================
INSERT INTO announcements (title, body, author_email, pinned) VALUES
('Weekly Scoring Refresh Policy', 'Scoring algorithms now refresh every 6 hours using a weekly baseline snapshot. Check your standing card on the leaderboard tab!', 'abis@datacrumbs.org', false)
ON CONFLICT DO NOTHING;

-- =====================================================
-- Seed Data: Products & Perks
-- =====================================================
INSERT INTO products (name, provider, category, description, badge, features, icon_name, icon_bg, popular, rating, reviews_count) VALUES
('Google AI One Premium', 'Google Gemini', 'AI Models', 'Get Gemini 1.5 Pro, 2TB Google One Cloud Storage, and seamless integration in Docs & Gmail.', 'Popular', '["Gemini 1.5 Pro with 1M context","2TB Google One Storage","Integration with Docs, Sheets & Gmail","Priority Access to Experimental Features"]', 'Brain', 'from-blue-600 to-indigo-600', true, 4.9, 1420),
('Higgsfield AI Pro', 'Higgsfield Inc.', 'Video & Motion', 'Create cinematic AI video animations with precise camera controls and photorealistic render quality.', 'Trending', '["4K Camera-controlled Video Gens","Anime & Photorealistic Models","Unlimited Image-to-Video conversion","Commercial Royalty-free License"]', 'Video', 'from-rose-500 to-purple-600', false, 4.8, 890),
('Zoom Pro + AI Companion', 'Zoom Video Communications', 'Productivity', 'Unlimited meeting duration, AI automated meeting summaries, and smart action item generation.', 'Best Seller', '["Unlimited 30-hour meeting duration","Automated AI Meeting Summaries","5GB Cloud Recording Storage","Custom Branded Meeting Rooms"]', 'Video', 'from-blue-500 to-cyan-500', false, 4.7, 3100),
('ChatGPT Plus / Team', 'OpenAI', 'AI Models', 'Access GPT-4o, DALL-E 3 image creation, Advanced Data Analysis, and custom GPT builders.', 'Top Rated', '["GPT-4o & GPT-4o-mini Priority","DALL-E 3 High-Res Image Generation","Custom GPT creation & Code Interpreter","Browsing & File Upload Analysis"]', 'MessageSquare', 'from-emerald-600 to-teal-700', true, 4.95, 5200),
('Claude Pro (Anthropic)', 'Anthropic', 'AI Models', 'Leverage Claude 3.5 Sonnet with 200k context window, interactive code artifacts, and deep reasoning.', 'Dev Pick', '["Claude 3.5 Sonnet & Opus","200,000 Token Context Window","Interactive Artifacts & Canvas","5x More Usage vs Free Tier"]', 'Brain', 'from-amber-600 to-orange-600', false, 4.9, 2400),
('Cursor Pro AI Editor', 'Anysphere', 'Developer Tools', 'The ultimate AI-first code editor. Instant code edits, multi-file codebase indexing, and terminal agent.', 'Essential for Devs', '["Unlimited Fast Copilot Auto-complete","500 Fast GPT-4o & Sonnet Edits/mo","Codebase-wide Indexing & Chat","Terminal Command Generation"]', 'Code', 'from-slate-800 to-slate-950', true, 4.98, 1850),
('Midjourney Standard', 'Midjourney Inc.', 'Video & Motion', 'State-of-the-art AI image generation. High-definition concept art, web assets, and commercial license.', 'Creative Choice', '["15 Fast GPU hours per month","Unlimited Relaxed GPU hours","General Commercial Terms","Access to Web & Discord Generator"]', 'Wand2', 'from-indigo-700 to-purple-800', false, 4.88, 4100),
('ElevenLabs AI Voice', 'ElevenLabs', 'Audio & Voice', 'Realistic voice cloning, text-to-speech in 29 languages, and AI audio dubbing for media projects.', 'High Demand', '["100,000 Text-to-Speech characters/mo","Instant Voice Cloning (10 voices)","Multi-lingual Dubbing Studio","Commercial Usage License"]', 'Volume2', 'from-cyan-600 to-blue-700', false, 4.85, 1290),
('Perplexity Pro Research', 'Perplexity AI', 'Productivity', 'AI-powered deep research search engine with inline academic citation and multi-modal file parsing.', 'Research Pick', '["300+ Pro Searches per day","Choice of Claude 3.5, Sonar & GPT-4o","Unlimited File & PDF Uploads","$5/mo API Credits Included"]', 'Compass', 'from-teal-600 to-emerald-700', false, 4.92, 2980),
('Luma Dream Machine Pro', 'Luma AI', 'Video & Motion', 'Next-gen 3D asset generator and realistic video synthesis for game developers and motion designers.', 'Next-Gen', '["120 High-Priority Video Gens/mo","Text-to-3D Model Export (GLTF/OBJ)","Commercial Rendering Rights","Keyframe Camera Control"]', 'Video', 'from-fuchsia-600 to-pink-600', false, 4.79, 750)
ON CONFLICT DO NOTHING;

-- =====================================================
-- Seed Data: Resources / Masterclasses
-- =====================================================
INSERT INTO resources (title, instructor, role, duration, level, category, description, youtube_id, thumbnail_url, avatar_url, resource_links, rating, enrolled_count) VALUES
('Building & Fine-Tuning Multi-Agent LLMs with QLoRA', 'Dr. Aris Thorne', 'Head of AI Research @ Cortexa', '2h 15m', 'Advanced', 'Generative AI & LLMs', 'Learn how to fine-tune open-source models like Llama 3 and Mistral using QLoRA techniques. We build an automated multi-agent collaboration framework from scratch.', NULL, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', '[{"name":"PyTorch QLoRA Fine-tuning Notebook","type":"code","url":"#"},{"name":"Multi-Agent System Architecture Slides (PDF)","type":"pdf","url":"#"}]', 4.9, 1420),
('Production Computer Vision: ResNet to Vision Transformers', 'Elena Rostova', 'Senior Vision Engineer @ DataLab', '1h 45m', 'Intermediate', 'Computer Vision', 'Deep dive into computer vision pipelines. Transfer learning, data augmentation strategies, and deploying ViT models with TensorRT.', NULL, 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', '[{"name":"OpenCV & PyTorch Vision Repo","type":"code","url":"#"},{"name":"Data Augmentation Cheat Sheet","type":"pdf","url":"#"}]', 4.8, 980),
('NLP Mastery: Transformers, RAG & Vector Databases', 'Prof. Kenji Takahashi', 'NLP Lead @ LangChain Labs', '2h 30m', 'Intermediate', 'NLP & Transformers', 'Build production retrieval-augmented generation systems using LangChain, Pinecone, and HuggingFace Transformers.', NULL, 'https://images.unsplash.com/photo-1639322537228-f710d846310a?w=600&auto=format&fit=crop&q=80', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', '[{"name":"LangChain & Pinecone RAG Architecture Guide","type":"pdf","url":"#"}]', 4.9, 1890)
ON CONFLICT DO NOTHING;
