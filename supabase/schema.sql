-- =============================================================================
-- Kamalayang Kapwa Kalikasan - Comprehensive Database Schema & RLS Policies
-- Safe & Idempotent Migration: Uses CREATE TABLE IF NOT EXISTS
-- Does NOT touch or drop existing tables.
-- =============================================================================

-- 1. PROFILES (if not already existing)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'member', -- 'admin' or 'member'
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helper function to check if the current authenticated user is an admin
-- Strictly checks profiles.role = 'admin'
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE public.profiles.id = auth.uid()
      AND public.profiles.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create a profile entry when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    'member',
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles read access" ON public.profiles;
CREATE POLICY "Profiles read access" ON public.profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Profiles update own or admin" ON public.profiles;
CREATE POLICY "Profiles update own or admin" ON public.profiles
  FOR UPDATE USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Profiles insert own or admin" ON public.profiles;
CREATE POLICY "Profiles insert own or admin" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id OR public.is_admin());


-- 2. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT DEFAULT 'Jennifer Gutierrez Baltazar',
  author_role TEXT DEFAULT 'Executive Director',
  author_avatar TEXT,
  image_url TEXT,
  animal_species_id TEXT,
  animal_species_name TEXT,
  pinned BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  publish_to_main BOOLEAN DEFAULT TRUE,
  publish_to_members BOOLEAN DEFAULT TRUE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published announcements" ON public.announcements;
CREATE POLICY "Public read published announcements" ON public.announcements
  FOR SELECT USING (is_published = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "Admin insert announcements" ON public.announcements;
CREATE POLICY "Admin insert announcements" ON public.announcements
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin update announcements" ON public.announcements;
CREATE POLICY "Admin update announcements" ON public.announcements
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete announcements" ON public.announcements;
CREATE POLICY "Admin delete announcements" ON public.announcements
  FOR DELETE USING (public.is_admin());


-- 3. EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT DEFAULT 'Tree Growing',
  date TEXT NOT NULL,
  time TEXT DEFAULT '8:00 AM',
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  target_volunteers INTEGER DEFAULT 100,
  signed_up INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Confirmed',
  image_url TEXT,
  animal_species_id TEXT,
  animal_species_name TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  publish_to_main BOOLEAN DEFAULT TRUE,
  publish_to_members BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published events" ON public.events;
CREATE POLICY "Public read published events" ON public.events
  FOR SELECT USING (is_published = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "Admin insert events" ON public.events;
CREATE POLICY "Admin insert events" ON public.events
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin update events" ON public.events;
CREATE POLICY "Admin update events" ON public.events
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete events" ON public.events;
CREATE POLICY "Admin delete events" ON public.events
  FOR DELETE USING (public.is_admin());


-- 4. PROGRAMS TABLE
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT,
  description TEXT NOT NULL,
  detailed_content TEXT,
  status TEXT DEFAULT 'ongoing',
  category TEXT DEFAULT 'Forestry & Reforestation',
  location TEXT DEFAULT 'Tanay, Rizal',
  beneficiaries TEXT DEFAULT 'Dumagat-Remontado Ancestral Domain',
  cover_image TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published programs" ON public.programs;
CREATE POLICY "Public read published programs" ON public.programs
  FOR SELECT USING (is_published = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "Admin insert programs" ON public.programs;
CREATE POLICY "Admin insert programs" ON public.programs
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin update programs" ON public.programs;
CREATE POLICY "Admin update programs" ON public.programs
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete programs" ON public.programs;
CREATE POLICY "Admin delete programs" ON public.programs
  FOR DELETE USING (public.is_admin());


-- 5. RESOURCES TABLE
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT,
  category TEXT DEFAULT 'Biodiversity',
  description TEXT NOT NULL,
  format TEXT DEFAULT 'PDF Document',
  download_url TEXT NOT NULL,
  file_size TEXT DEFAULT '3.5 MB',
  tags TEXT[] DEFAULT ARRAY['Conservation', 'Sierra Madre'],
  image_url TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published resources" ON public.resources;
CREATE POLICY "Public read published resources" ON public.resources
  FOR SELECT USING (is_published = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "Admin insert resources" ON public.resources;
CREATE POLICY "Admin insert resources" ON public.resources
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin update resources" ON public.resources;
CREATE POLICY "Admin update resources" ON public.resources
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete resources" ON public.resources;
CREATE POLICY "Admin delete resources" ON public.resources
  FOR DELETE USING (public.is_admin());


-- 6. GALLERY ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  album TEXT NOT NULL DEFAULT 'Tree Planting',
  caption TEXT NOT NULL,
  media_url TEXT NOT NULL,
  media_type TEXT DEFAULT 'image',
  video_embed_url TEXT,
  location TEXT DEFAULT 'Tanay, Rizal',
  date TEXT DEFAULT '2026',
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read published gallery" ON public.gallery_items;
CREATE POLICY "Public read published gallery" ON public.gallery_items
  FOR SELECT USING (is_published = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "Admin insert gallery" ON public.gallery_items;
CREATE POLICY "Admin insert gallery" ON public.gallery_items
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin update gallery" ON public.gallery_items;
CREATE POLICY "Admin update gallery" ON public.gallery_items
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete gallery" ON public.gallery_items;
CREATE POLICY "Admin delete gallery" ON public.gallery_items
  FOR DELETE USING (public.is_admin());


-- 7. PARTNERS TABLE
CREATE TABLE IF NOT EXISTS public.partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT DEFAULT 'Environmental NGOs',
  logo_url TEXT,
  website TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read active partners" ON public.partners;
CREATE POLICY "Public read active partners" ON public.partners
  FOR SELECT USING (is_active = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "Admin insert partners" ON public.partners;
CREATE POLICY "Admin insert partners" ON public.partners
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin update partners" ON public.partners;
CREATE POLICY "Admin update partners" ON public.partners
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete partners" ON public.partners;
CREATE POLICY "Admin delete partners" ON public.partners
  FOR DELETE USING (public.is_admin());


-- 8. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  gcash_name TEXT DEFAULT 'Kamalayang Kapwa Kalikasan Foundation Inc.',
  gcash_number TEXT DEFAULT '0917-829-KAPWA (0917-829-5279)',
  gcash_qr_url TEXT DEFAULT 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
  bank_name TEXT DEFAULT 'Bank of the Philippine Islands (BPI)',
  bank_account_name TEXT DEFAULT 'Kamalayang Kapwa Kalikasan Foundation Inc.',
  bank_account_number TEXT DEFAULT '3891-0428-19',
  contact_email TEXT DEFAULT 'ugnayan@kapwakalikasan.org.ph',
  contact_phone TEXT DEFAULT '+63 (02) 8920-5381 / +63 917 829 5279',
  office_address TEXT DEFAULT 'HANNAH GRACE BUILDING BLOCK 21 LOT 9 MANGO VILLAGE SALITARAN IV 4114 CITY OF DASMARINAS CAVITE PHILIPPINES',
  office_hours TEXT DEFAULT 'Monday - Friday: 8:30 AM - 5:30 PM (PST)',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site_settings" ON public.site_settings;
CREATE POLICY "Public read site_settings" ON public.site_settings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin insert site_settings" ON public.site_settings;
CREATE POLICY "Admin insert site_settings" ON public.site_settings
  FOR INSERT WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin update site_settings" ON public.site_settings;
CREATE POLICY "Admin update site_settings" ON public.site_settings
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());


-- 9. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'Unread', -- 'Unread', 'Read', 'Resolved'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert contact_messages" ON public.contact_messages;
CREATE POLICY "Public insert contact_messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin read contact_messages" ON public.contact_messages;
CREATE POLICY "Admin read contact_messages" ON public.contact_messages
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admin update contact_messages" ON public.contact_messages;
CREATE POLICY "Admin update contact_messages" ON public.contact_messages
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete contact_messages" ON public.contact_messages;
CREATE POLICY "Admin delete contact_messages" ON public.contact_messages
  FOR DELETE USING (public.is_admin());


-- 10. VOLUNTEERS TABLE
CREATE TABLE IF NOT EXISTS public.volunteers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT,
  interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  availability TEXT,
  program TEXT DEFAULT 'Sierra Madre Reforestation',
  message TEXT,
  status TEXT DEFAULT 'Pending Review', -- 'Approved', 'Pending Review', 'Rejected'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.volunteers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert volunteers" ON public.volunteers;
CREATE POLICY "Public insert volunteers" ON public.volunteers
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin read volunteers" ON public.volunteers;
CREATE POLICY "Admin read volunteers" ON public.volunteers
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admin update volunteers" ON public.volunteers;
CREATE POLICY "Admin update volunteers" ON public.volunteers
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete volunteers" ON public.volunteers;
CREATE POLICY "Admin delete volunteers" ON public.volunteers
  FOR DELETE USING (public.is_admin());


-- 11. DONATIONS TABLE
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name TEXT NOT NULL,
  email TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  trees INTEGER DEFAULT 0,
  payment_method TEXT DEFAULT 'GCash',
  reference_no TEXT NOT NULL,
  proof_url TEXT,
  status TEXT DEFAULT 'Pending', -- 'Pending', 'Verified', 'Rejected'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert donations" ON public.donations;
CREATE POLICY "Public insert donations" ON public.donations
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin read donations" ON public.donations;
CREATE POLICY "Admin read donations" ON public.donations
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admin update donations" ON public.donations;
CREATE POLICY "Admin update donations" ON public.donations
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete donations" ON public.donations;
CREATE POLICY "Admin delete donations" ON public.donations
  FOR DELETE USING (public.is_admin());


-- 12. SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public insert subscribers" ON public.subscribers;
CREATE POLICY "Public insert subscribers" ON public.subscribers
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Admin read subscribers" ON public.subscribers;
CREATE POLICY "Admin read subscribers" ON public.subscribers
  FOR SELECT USING (public.is_admin());

DROP POLICY IF EXISTS "Admin update subscribers" ON public.subscribers;
CREATE POLICY "Admin update subscribers" ON public.subscribers
  FOR UPDATE USING (public.is_admin()) WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Admin delete subscribers" ON public.subscribers;
CREATE POLICY "Admin delete subscribers" ON public.subscribers
  FOR DELETE USING (public.is_admin());


-- 13. SEED INITIAL SITE SETTINGS (Only if not already present)
INSERT INTO public.site_settings (
  id,
  gcash_name,
  gcash_number,
  gcash_qr_url,
  bank_name,
  bank_account_name,
  bank_account_number,
  contact_email,
  contact_phone,
  office_address,
  office_hours
) VALUES (
  'default',
  'Kamalayang Kapwa Kalikasan Foundation Inc.',
  '0917-829-KAPWA (0917-829-5279)',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
  'Bank of the Philippine Islands (BPI)',
  'Kamalayang Kapwa Kalikasan Foundation Inc.',
  '3891-0428-19',
  'ugnayan@kapwakalikasan.org.ph',
  '+63 (02) 8920-5381 / +63 917 829 5279',
  'HANNAH GRACE BUILDING BLOCK 21 LOT 9 MANGO VILLAGE SALITARAN IV 4114 CITY OF DASMARINAS CAVITE PHILIPPINES',
  'Monday - Friday: 8:30 AM - 5:30 PM (PST)'
) ON CONFLICT (id) DO NOTHING;
