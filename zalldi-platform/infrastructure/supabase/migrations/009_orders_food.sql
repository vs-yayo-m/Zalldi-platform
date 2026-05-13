-- ============================================================
-- MIGRATION 009 — Food Orders
-- ============================================================

CREATE TYPE food_order_status AS ENUM (
  'pending', 'accepted', 'preparing', 'ready',
  'picked_up', 'delivered', 'cancelled'
);

CREATE TYPE payment_method AS ENUM ('upi', 'card', 'cod', 'wallet');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

CREATE TABLE food_orders (
  id                     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id            UUID NOT NULL REFERENCES user_profiles(id),
  restaurant_id          UUID NOT NULL REFERENCES restaurants(id),
  delivery_address_id    UUID NOT NULL REFERENCES addresses(id),
  status                 food_order_status NOT NULL DEFAULT 'pending',
  items                  JSONB NOT NULL DEFAULT '[]',
  subtotal               NUMERIC(10,2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee           NUMERIC(10,2) NOT NULL DEFAULT 0,
  platform_fee           NUMERIC(10,2) NOT NULL DEFAULT 0,
  taxes                  NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount               NUMERIC(10,2) NOT NULL DEFAULT 0,
  total                  NUMERIC(10,2) NOT NULL CHECK (total >= 0),
  promo_code             TEXT,
  cooking_instructions   TEXT,
  estimated_delivery_at  TIMESTAMPTZ,
  delivered_at           TIMESTAMPTZ,
  cancelled_reason       TEXT,
  payment_method         payment_method NOT NULL DEFAULT 'cod',
  payment_status         payment_status NOT NULL DEFAULT 'pending',
  created_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_food_orders_updated_at
  BEFORE UPDATE ON food_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_food_orders_customer ON food_orders(customer_id);
CREATE INDEX idx_food_orders_restaurant ON food_orders(restaurant_id);
CREATE INDEX idx_food_orders_status ON food_orders(status);
CREATE INDEX idx_food_orders_created_at ON food_orders(created_at DESC);
CREATE INDEX idx_food_orders_payment_status ON food_orders(payment_status);

-- Enable Realtime for live order tracking
ALTER PUBLICATION supabase_realtime ADD TABLE food_orders;

-- RLS
ALTER TABLE food_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers read own food orders"
  ON food_orders FOR SELECT
  USING (customer_id = auth.uid());

CREATE POLICY "Customers create food orders"
  ON food_orders FOR INSERT
  WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Restaurant owners read their orders"
  ON food_orders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = food_orders.restaurant_id
        AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Restaurant owners update order status"
  ON food_orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE restaurants.id = food_orders.restaurant_id
        AND restaurants.owner_id = auth.uid()
    )
  );

CREATE POLICY "Admins manage all food orders"
  ON food_orders FOR ALL
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));
