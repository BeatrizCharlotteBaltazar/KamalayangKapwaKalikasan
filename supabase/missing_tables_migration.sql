-- =============================================================================
-- Kamalayang Kapwa Kalikasan - Missing Tables Migration Script
-- Creates ONLY the missing tables (announcements, events, programs, resources,
-- gallery_items, partners, site_settings) with exact column names.
-- Does NOT drop or alter existing tables (profiles, volunteers, donations, subscribers, contact_messages).
-- Enables Row Level Security (RLS): Public can read published rows,
-- and only admins can insert, update, or delete using public.is_admin().
-- =============================================================================

-- Ensure helper function public.is_admin() exists without altering profiles table
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


-- -----------------------------------------------------------------------------
-- 1. ANNOUNCEMENTS (POSTS) TABLE
-- -----------------------------------------------------------------------------
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


-- -----------------------------------------------------------------------------
-- 2. EVENTS TABLE
-- -----------------------------------------------------------------------------
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


-- -----------------------------------------------------------------------------
-- 3. PROGRAMS TABLE
-- -----------------------------------------------------------------------------
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


-- -----------------------------------------------------------------------------
-- 4. RESOURCES TABLE
-- -----------------------------------------------------------------------------
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


-- -----------------------------------------------------------------------------
-- 5. GALLERY ITEMS TABLE
-- -----------------------------------------------------------------------------
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


-- -----------------------------------------------------------------------------
-- 6. PARTNERS TABLE
-- -----------------------------------------------------------------------------
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


-- -----------------------------------------------------------------------------
-- 7. SITE SETTINGS TABLE
-- -----------------------------------------------------------------------------
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

-- Seed default site settings if row does not already exist
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
