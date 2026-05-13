-- ============================================================
-- MIGRATION 007 — Restaurants
-- ============================================================

CREATE TABLE restaurants (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                    TEXT NOT NULL,
  slug                    TEXT NOT NULL UNIQUE,
  description             TEXT,
  cuisine_types           TEXT[] NOT NULL DEFAULT '{}',
  image_url               TEXT,
  cover_url               TEXT,
  address                 TEXT NOT NULL,
  city                    TEXT NOT NULL,
  latitude                DOUBLE PRECISION NOT NULL,
  longitude               DOUBLE PRECISION NOT NULL,
  rating                  NUMERIC(3,2) NOT NULL DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  rating_count            INTEGER NOT NULL DEFAULT 0,
  avg_delivery_time_mins  INTEGER NOT NULL DEFAULT 30,
  min_order_amount        NUMERIC(10,2) NOT NULL DEFAULT 0,
  delivery_fee            NUMERIC(10,2) NOT NULL DEFAULT 0,
  is_pure_veg             BOOLEAN NOT NULL DEFAULT FALSE,
  is_open                 BOOLEAN NOT NULL DEFAULT TRUE,
  opens_at                TIME,
  closes_at               TIME,
  is_active               BOOLEAN NOT NULL DEFAULT TRUE,
  is_approved             BOOLEAN NOT NULL DEFAULT FALSE,
  owner_id                UUID REFERENCES user_profiles(id),
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON restaurants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_restaurants_slug ON restaurants(slug);
CREATE INDEX idx_restaurants_city ON restaurants(city);
CREATE INDEX idx_restaurants_is_active ON restaurants(is_active);
CREATE INDEX idx_restaurants_is_approved ON restaurants(is_approved);
CREATE INDEX idx_restaurants_rating ON restaurants(rating DESC);
CREATE INDEX idx_restaurants_cuisine ON restaurants USING GIN (cuisine_types);
CREATE INDEX idx_restaurants_name_trgm ON restaurants USING GIN (name gin_trgm_ops);
CREATE INDEX idx_restaurants_location ON restaurants(latitude, longitude);

-- RLS
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active approved restaurants"
  ON restaurants FOR SELECT
  USING (is_active = TRUE AND is_approved = TRUE);

CREATE POLICY "Owners can read own restaurant"
  ON restaurants FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Owners can update own restaurant"
  ON restaurants FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Admins manage all restaurants"
  ON restaurants FOR ALL
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
