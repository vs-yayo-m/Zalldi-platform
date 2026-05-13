-- ============================================================
-- MIGRATION 001 — Extensions & helpers
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pg_trgm for fast ILIKE / similarity search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Utility: auto-update updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
