-- =========================================================================
-- THE MARS TV - SUPABASE PROPERTIES TABLE SCHEMA & REALTIME CONFIGURATION
-- =========================================================================
-- Run this SQL in your Supabase Project -> SQL Editor to ensure all fields,
-- permissions, and Realtime synchronization are fully configured.

-- 1. Create or ensure table exists
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

-- 2. Add columns if missing in existing database
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS submission_id TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS price NUMERIC DEFAULT 0;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS price_label TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Indore';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS locality TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS coordinates TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS area NUMERIC DEFAULT 0;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS area_unit TEXT DEFAULT 'sq.ft';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS configuration TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS bedrooms INTEGER DEFAULT 1;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS bathrooms INTEGER DEFAULT 1;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS parking INTEGER DEFAULT 0;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS price_per_sq_ft NUMERIC;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS maintenance_charges NUMERIC;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS possession_status TEXT DEFAULT 'READY_TO_MOVE';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS possession_date TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS property_type TEXT DEFAULT 'APARTMENT';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS sub_category TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS listing_type TEXT DEFAULT 'BUY';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'PENDING_APPROVAL';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS is_sponsored BOOLEAN DEFAULT FALSE;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS is_rera_reg BOOLEAN DEFAULT FALSE;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS rera_number TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS approval_authority TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS ownership_proof_doc TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS user_role TEXT DEFAULT 'DEVELOPER';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS agency_name TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS is_phone_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS amenities JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. Row Level Security (RLS) Configuration
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on properties" ON public.properties;
CREATE POLICY "Allow public read access on properties"
    ON public.properties FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Allow public insert on properties" ON public.properties;
CREATE POLICY "Allow public insert on properties"
    ON public.properties FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on properties" ON public.properties;
CREATE POLICY "Allow public update on properties"
    ON public.properties FOR UPDATE
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on properties" ON public.properties;
CREATE POLICY "Allow public delete on properties"
    ON public.properties FOR DELETE
    USING (true);

-- 4. Enable Supabase Realtime for instant multi-device synchronization
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'properties'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.properties;
  END IF;
END $$;

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties (status);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties (city);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties (created_at DESC);
