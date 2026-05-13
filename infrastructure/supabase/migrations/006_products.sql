-- ============================================================
-- MIGRATION 006 — Products (Quick Commerce / Grocery)
-- ============================================================

CREATE TYPE weight_unit AS ENUM ('g', 'kg', 'ml', 'l', 'pcs');

CREATE TABLE products (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                 TEXT NOT NULL,
  slug                 TEXT NOT NULL UNIQUE,
  description          TEXT,
  sku                  TEXT NOT NULL UNIQUE,
  barcode              TEXT,
  brand                TEXT,
  category_id          UUID NOT NULL REFERENCES categories(id),
  darkstore_id         UUID NOT NULL REFERENCES darkstores(id),
  price                NUMERIC(10,2) NOT NULL CHECK (price > 0),
  mrp                  NUMERIC(10,2) NOT NULL CHECK (mrp > 0),
  discount_percentage  NUMERIC(5,2) GENERATED ALWAYS AS (
                         ROUND(((mrp - price) / mrp * 100), 2)
                       ) STORED,
  weight               NUMERIC(10,3),
  weight_unit          weight_unit,
  stock_quantity       INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  low_stock_threshold  INTEGER NOT NULL DEFAULT 10,
  image_urls           TEXT[] NOT NULL DEFAULT '{}',
  is_active            BOOLEAN NOT NULL DEFAULT TRUE,
  is_approved          BOOLEAN NOT NULL DEFAULT FALSE,
  created_by           UUID NOT NULL REFERENCES user_profiles(id),
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_darkstore_id ON products(darkstore_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_approved ON products(is_approved);
CREATE INDEX idx_products_name_trgm ON products USING GIN (name gin_trgm_ops);
CREATE INDEX idx_products_low_stock ON products(darkstore_id, stock_quantity)
  WHERE is_active = TRUE;

-- RPC: safe stock update (prevents negative stock)
CREATE OR REPLACE FUNCTION update_product_stock(
  p_product_id UUID,
  p_quantity_delta INTEGER
)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock_quantity = GREATEST(0, stock_quantity + p_quantity_delta),
      updated_at = NOW()
  WHERE id = p_product_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product % not found', p_product_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active approved products"
  ON products FOR SELECT
  USING (is_active = TRUE AND is_approved = TRUE);

CREATE POLICY "Sellers can read own products"
  ON products FOR SELECT
  USING (created_by = auth.uid());

CREATE POLICY "Sellers can insert products"
  ON products FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('seller', 'admin'))
  );

CREATE POLICY "Sellers can update own products"
  ON products FOR UPDATE
  USING (
    created_by = auth.uid() AND
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('seller', 'admin'))
  );

CREATE POLICY "Admins manage all products"
  ON products FOR ALL
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );
