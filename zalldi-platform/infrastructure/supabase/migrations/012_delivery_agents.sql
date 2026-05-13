-- ============================================================
-- MIGRATION 012 — Delivery Agents
-- ============================================================

CREATE TYPE vehicle_type AS ENUM ('bike', 'bicycle', 'scooter');

CREATE TABLE delivery_agents (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL UNIQUE REFERENCES user_profiles(id) ON DELETE CASCADE,
  full_name           TEXT NOT NULL,
  phone               TEXT NOT NULL,
  vehicle_type        vehicle_type NOT NULL DEFAULT 'bike',
  vehicle_number      TEXT,
  is_online           BOOLEAN NOT NULL DEFAULT FALSE,
  is_verified         BOOLEAN NOT NULL DEFAULT FALSE,
  current_latitude    DOUBLE PRECISION,
  current_longitude   DOUBLE PRECISION,
  location_updated_at TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_delivery_agents_user_id ON delivery_agents(user_id);
CREATE INDEX idx_delivery_agents_is_online ON delivery_agents(is_online);

-- Enable Realtime for live location tracking
ALTER PUBLICATION supabase_realtime ADD TABLE delivery_agents;

-- RLS
ALTER TABLE delivery_agents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agents read own record"
  ON delivery_agents FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Agents update own location and status"
  ON delivery_agents FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins manage agents"
  ON delivery_agents FOR ALL
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- RPC: update agent location efficiently
CREATE OR REPLACE FUNCTION update_agent_location(
  p_agent_user_id UUID,
  p_latitude DOUBLE PRECISION,
  p_longitude DOUBLE PRECISION
)
RETURNS VOID AS $$
BEGIN
  UPDATE delivery_agents
  SET current_latitude = p_latitude,
      current_longitude = p_longitude,
      location_updated_at = NOW()
  WHERE user_id = p_agent_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
