-- ============================================================
-- MIGRATION 010 — Grocery Orders
-- ============================================================

CREATE TYPE grocery_order_status AS ENUM (
  'pending', 'confirmed', 'picking', 'packed',
  'dispatched', 'delivered', 'cancelled'
);

CREATE TABLE grocery_orders (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id           UUID NOT NULL REFERENCES user_profiles(id),
  darkstore_id          UUID NOT NULL REFERENCES darkstores(id),
  delivery_address_id   UUID NOT NULL REFERENCES addresses(id),
  status                grocery_order_status NOT NULL DEFAULT 'pending',
  items                 JSONB NOT NULL DEFAULT '[]',
  subtotal              NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee          NUMERIC(10,2) NOT NULL DEFAULT 0,
  platform_fee          NUMERIC(10,2) NOT NULL DEFAULT 0,
  taxes                 NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount              NUMERIC(10,2) NOT NULL DEFAULT 0,
  total                 NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  promo_code            TEXT,
  estimated_delivery_at TIMESTAMPTZ,
  delivered_at          TIMESTAMPTZ,
  cancelled_reason      TEXT,
  payment_method        payment_method NOT NULL DEFAULT 'cod',
  payment_status        payment_status NOT NULL DEFAULT 'pending',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_grocery_orders_updated_at
  BEFORE UPDATE ON grocery_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_grocery_orders_customer ON grocery_orders(customer_id);
CREATE INDEX idx_grocery_orders_darkstore ON grocery_orders(darkstore_id);
CREATE INDEX idx_grocery_orders_status ON grocery_orders(status);
CREATE INDEX idx_grocery_orders_created_at ON grocery_orders(created_at DESC);
CREATE INDEX idx_grocery_orders_payment_status ON grocery_orders(payment_status);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE grocery_orders;

-- RLS
ALTER TABLE grocery_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers read own grocery orders"
  ON grocery_orders FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "Customers create grocery orders"
  ON grocery_orders FOR INSERT
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Sellers/operators read darkstore orders"
  ON grocery_orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('seller', 'admin')
    )
  );

CREATE POLICY "Sellers/operators update grocery order status"
  ON grocery_orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('seller', 'admin')
    )
  );

CREATE POLICY "Admins manage all grocery orders"
  ON grocery_orders FOR ALL
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
