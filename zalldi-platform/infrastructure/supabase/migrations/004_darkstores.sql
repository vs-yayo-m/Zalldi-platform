-- ============================================================
-- MIGRATION 004 — Darkstores
-- ============================================================

CREATE TABLE darkstores (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                    TEXT NOT NULL,
  address                 TEXT NOT NULL,
  city                    TEXT NOT NULL,
  latitude                DOUBLE PRECISION NOT NULL,
  longitude               DOUBLE PRECISION NOT NULL,
  service_radius_km       NUMERIC(5,2) NOT NULL DEFAULT 5.0,
  is_open                 BOOLEAN NOT NULL DEFAULT TRUE,
  opens_at                TIME NOT NULL DEFAULT '06:00',
  closes_at               TIME NOT NULL DEFAULT '23:00',
  avg_delivery_time_mins  INTEGER NOT NULL DEFAULT 15,
  is_active               BOOLEAN NOT NULL DEFAULT TRUE,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE darkstores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active darkstores"
  ON darkstores FOR SELECT
  USING (is_active = TRUE);

CREATE POLICY "Admins manage darkstores"
  ON darkstores FOR ALL
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
