-- ============================================================
-- MIGRATION 003 — Addresses
-- ============================================================

CREATE TYPE address_label AS ENUM ('home', 'work', 'other');

CREATE TABLE addresses (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  label         address_label NOT NULL DEFAULT 'home',
  full_address  TEXT NOT NULL,
  flat_no       TEXT,
  landmark      TEXT,
  city          TEXT NOT NULL,
  state         TEXT NOT NULL,
  pincode       TEXT NOT NULL,
  latitude      DOUBLE PRECISION,
  longitude     DOUBLE PRECISION,
  is_default    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure only one default per user
CREATE UNIQUE INDEX idx_addresses_one_default
  ON addresses (user_id)
  WHERE is_default = TRUE;

CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- RLS
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own addresses"
  ON addresses FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Admins read all addresses"
  ON addresses FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
