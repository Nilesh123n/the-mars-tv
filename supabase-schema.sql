-- =========================================================================
-- THE MARS TV - COMPLETE SUPABASE REAL ESTATE SCHEMA & REALTIME SYNC
-- =========================================================================
-- Run this full SQL script in your Supabase Project -> SQL Editor.
-- It creates all 7 tables with proper column types, default values,
-- Row-Level-Security (RLS) policies, indexes, and enables Supabase Realtime
-- for instant multi-device synchronization between Admin Panel & Website.
-- =========================================================================

-- -------------------------------------------------------------------------
-- 1. PROPERTIES TABLE (Listings, Verification, RERA & Submissions)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.properties (
    id TEXT PRIMARY KEY,
    submission_id TEXT,
    title TEXT NOT NULL,
    slug TEXT,
    description TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    price_label TEXT,
    location TEXT,
    city TEXT DEFAULT 'Indore',
    locality TEXT,
    address TEXT,
    pincode TEXT,
    coordinates TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    area NUMERIC DEFAULT 0,
    area_unit TEXT DEFAULT 'sq.ft',
    configuration TEXT,
    bedrooms INTEGER DEFAULT 1,
    bathrooms INTEGER DEFAULT 1,
    parking INTEGER DEFAULT 0,
    price_per_sq_ft NUMERIC,
    maintenance_charges NUMERIC,
    possession_status TEXT DEFAULT 'READY_TO_MOVE',
    possession_date TEXT,
    property_type TEXT DEFAULT 'APARTMENT',
    sub_category TEXT,
    listing_type TEXT DEFAULT 'BUY',
    status TEXT NOT NULL DEFAULT 'PENDING_APPROVAL',
    is_sponsored BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_rera_reg BOOLEAN DEFAULT FALSE,
    rera_number TEXT,
    approval_authority TEXT,
    ownership_proof_doc TEXT,
    user_role TEXT DEFAULT 'DEVELOPER',
    contact_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    agency_name TEXT,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    images JSONB DEFAULT '[]'::jsonb,
    amenities JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure all property columns exist
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS submission_id TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS sub_category TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS locality TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS coordinates TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS price_per_sq_ft NUMERIC;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS maintenance_charges NUMERIC;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS possession_status TEXT DEFAULT 'READY_TO_MOVE';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS possession_date TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS approval_authority TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS ownership_proof_doc TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS user_role TEXT DEFAULT 'DEVELOPER';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS agency_name TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS is_phone_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- -------------------------------------------------------------------------
-- 2. NEWS ITEMS TABLE (Real Estate News, Policy Updates & Market Trends)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.news_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT,
    excerpt TEXT,
    content TEXT,
    category TEXT DEFAULT 'Indore Real Estate',
    region TEXT DEFAULT 'India',
    image TEXT,
    author TEXT DEFAULT 'The Mars TV News Desk',
    published_at TIMESTAMPTZ DEFAULT NOW(),
    publishedAt TIMESTAMPTZ DEFAULT NOW(),
    is_featured BOOLEAN DEFAULT FALSE,
    isFeatured BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'PUBLISHED',
    view_count INT DEFAULT 120,
    viewCount INT DEFAULT 120,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 3. PR SERVICES TABLE (Marketing, Launch Campaigns & Media Coverage)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pr_services (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    tagline TEXT,
    description TEXT,
    icon_name TEXT DEFAULT 'Megaphone',
    iconName TEXT DEFAULT 'Megaphone',
    deliverables JSONB DEFAULT '[]'::jsonb,
    price_starting_from TEXT DEFAULT '₹ 25,000',
    priceStartingFrom TEXT DEFAULT '₹ 25,000',
    price_numeric NUMERIC DEFAULT 25000,
    priceNumeric NUMERIC DEFAULT 25000,
    highlight BOOLEAN DEFAULT FALSE,
    "order" INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 4. LEADS TABLE (Inquiries, Site Visits, PR Requests & Contact Forms)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    message TEXT,
    lead_type TEXT DEFAULT 'PROPERTY_ENQUIRY',
    leadType TEXT DEFAULT 'PROPERTY_ENQUIRY',
    status TEXT DEFAULT 'NEW',
    source TEXT DEFAULT 'WEBSITE',
    property_id TEXT,
    propertyId TEXT,
    property_title TEXT,
    propertyTitle TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    createdAt TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 5. CONSTRUCTION PACKAGES TABLE (Turnkey & Civil Construction)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.construction_packages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price_per_sq_ft NUMERIC NOT NULL DEFAULT 1650,
    pricePerSqFt NUMERIC DEFAULT 1650,
    description TEXT,
    features JSONB DEFAULT '[]'::jsonb,
    is_popular BOOLEAN DEFAULT FALSE,
    isPopular BOOLEAN DEFAULT FALSE,
    steel_grade TEXT DEFAULT 'Fe-500',
    steelGrade TEXT DEFAULT 'Fe-500',
    cement_grade TEXT DEFAULT 'Grade 53',
    cementGrade TEXT DEFAULT 'Grade 53',
    warranty_years INT DEFAULT 5,
    warrantyYears INT DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 6. SITE SETTINGS TABLE (Branding, Support Phone, Email & Socials)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'main_settings',
    site_name TEXT DEFAULT 'The Mars TV',
    siteName TEXT DEFAULT 'The Mars TV',
    tagline TEXT DEFAULT 'Central India’s Premier Real Estate Portal',
    contact_email TEXT DEFAULT 'support@themarstv.in',
    contactEmail TEXT DEFAULT 'support@themarstv.in',
    contact_phone TEXT DEFAULT '+91 123 456 7890',
    contactPhone TEXT DEFAULT '+91 123 456 7890',
    office_address TEXT DEFAULT '101-104 The Mars TV Tower, Vijay Nagar Square, Indore, MP 452001',
    officeAddress TEXT DEFAULT '101-104 The Mars TV Tower, Vijay Nagar Square, Indore, MP 452001',
    rera_reg_no TEXT DEFAULT 'RERA/MP/IND/2024/09912',
    reraRegNo TEXT DEFAULT 'RERA/MP/IND/2024/09912',
    gstin TEXT DEFAULT '23AABCT1234F1Z5',
    facebook_url TEXT DEFAULT '#',
    facebookUrl TEXT DEFAULT '#',
    instagram_url TEXT DEFAULT '#',
    instagramUrl TEXT DEFAULT '#',
    youtube_url TEXT DEFAULT '#',
    youtubeUrl TEXT DEFAULT '#',
    linkedin_url TEXT DEFAULT '#',
    linkedinUrl TEXT DEFAULT '#',
    twitter_url TEXT DEFAULT '#',
    twitterUrl TEXT DEFAULT '#',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- 7. PROJECTS TABLE (Featured Real Estate Townships & Commercial Hubs)
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT,
    developer TEXT NOT NULL,
    location TEXT NOT NULL,
    city TEXT DEFAULT 'Indore',
    price NUMERIC DEFAULT 0,
    price_label TEXT,
    priceLabel TEXT,
    project_type TEXT DEFAULT 'RESIDENTIAL',
    projectType TEXT DEFAULT 'RESIDENTIAL',
    possession_status TEXT DEFAULT 'READY_TO_MOVE',
    possessionStatus TEXT DEFAULT 'READY_TO_MOVE',
    possession_date TEXT,
    possessionDate TEXT,
    rera_number TEXT,
    reraNumber TEXT,
    description TEXT,
    image TEXT,
    amenities JSONB DEFAULT '[]'::jsonb,
    is_featured BOOLEAN DEFAULT TRUE,
    isFeatured BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    createdAt TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (Allows Full Read & Write via Anon Key)
-- =========================================================================
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pr_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.construction_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Properties Policies
DROP POLICY IF EXISTS "Public Read Properties" ON public.properties;
CREATE POLICY "Public Read Properties" ON public.properties FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Insert Properties" ON public.properties;
CREATE POLICY "Public Insert Properties" ON public.properties FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public Update Properties" ON public.properties;
CREATE POLICY "Public Update Properties" ON public.properties FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public Delete Properties" ON public.properties;
CREATE POLICY "Public Delete Properties" ON public.properties FOR DELETE USING (true);

-- News Policies
DROP POLICY IF EXISTS "Public Read News" ON public.news_items;
CREATE POLICY "Public Read News" ON public.news_items FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Insert News" ON public.news_items;
CREATE POLICY "Public Insert News" ON public.news_items FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public Update News" ON public.news_items;
CREATE POLICY "Public Update News" ON public.news_items FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public Delete News" ON public.news_items;
CREATE POLICY "Public Delete News" ON public.news_items FOR DELETE USING (true);

-- PR Services Policies
DROP POLICY IF EXISTS "Public Read PR" ON public.pr_services;
CREATE POLICY "Public Read PR" ON public.pr_services FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Insert PR" ON public.pr_services;
CREATE POLICY "Public Insert PR" ON public.pr_services FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public Update PR" ON public.pr_services;
CREATE POLICY "Public Update PR" ON public.pr_services FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public Delete PR" ON public.pr_services;
CREATE POLICY "Public Delete PR" ON public.pr_services FOR DELETE USING (true);

-- Leads Policies
DROP POLICY IF EXISTS "Public Read Leads" ON public.leads;
CREATE POLICY "Public Read Leads" ON public.leads FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Insert Leads" ON public.leads;
CREATE POLICY "Public Insert Leads" ON public.leads FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public Update Leads" ON public.leads;
CREATE POLICY "Public Update Leads" ON public.leads FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public Delete Leads" ON public.leads;
CREATE POLICY "Public Delete Leads" ON public.leads FOR DELETE USING (true);

-- Construction Packages Policies
DROP POLICY IF EXISTS "Public Read Construction" ON public.construction_packages;
CREATE POLICY "Public Read Construction" ON public.construction_packages FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Insert Construction" ON public.construction_packages;
CREATE POLICY "Public Insert Construction" ON public.construction_packages FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public Update Construction" ON public.construction_packages;
CREATE POLICY "Public Update Construction" ON public.construction_packages FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public Delete Construction" ON public.construction_packages;
CREATE POLICY "Public Delete Construction" ON public.construction_packages FOR DELETE USING (true);

-- Site Settings Policies
DROP POLICY IF EXISTS "Public Read Settings" ON public.site_settings;
CREATE POLICY "Public Read Settings" ON public.site_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Insert Settings" ON public.site_settings;
CREATE POLICY "Public Insert Settings" ON public.site_settings FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public Update Settings" ON public.site_settings;
CREATE POLICY "Public Update Settings" ON public.site_settings FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public Delete Settings" ON public.site_settings;
CREATE POLICY "Public Delete Settings" ON public.site_settings FOR DELETE USING (true);

-- Projects Policies
DROP POLICY IF EXISTS "Public Read Projects" ON public.projects;
CREATE POLICY "Public Read Projects" ON public.projects FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Insert Projects" ON public.projects;
CREATE POLICY "Public Insert Projects" ON public.projects FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public Update Projects" ON public.projects;
CREATE POLICY "Public Update Projects" ON public.projects FOR UPDATE USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Public Delete Projects" ON public.projects;
CREATE POLICY "Public Delete Projects" ON public.projects FOR DELETE USING (true);

-- =========================================================================
-- ENABLE SUPABASE REALTIME REPLICATION (Instant Live Sync on All Screens)
-- =========================================================================
DO $$
BEGIN
  -- Properties
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'properties') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.properties;
  END IF;

  -- News Items
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'news_items') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.news_items;
  END IF;

  -- PR Services
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'pr_services') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.pr_services;
  END IF;

  -- Leads
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'leads') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
  END IF;

  -- Construction Packages
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'construction_packages') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.construction_packages;
  END IF;

  -- Site Settings
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'site_settings') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
  END IF;

  -- Projects
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'projects') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
  END IF;
END $$;

-- =========================================================================
-- OPTIMIZATION INDEXES
-- =========================================================================
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties (status);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties (city);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_published_at ON public.news_items (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);
