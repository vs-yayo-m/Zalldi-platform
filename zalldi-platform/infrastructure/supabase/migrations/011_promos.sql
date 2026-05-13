-- ============================================================
-- MIGRATION 011 — Promo Codes / Coupons
-- ============================================================

CREATE TYPE discount_type AS ENUM ('percentage', 'flat');
CREATE TYPE promo_vertical AS ENUM ('food', 'grocery', 'both');

CREATE TABLE promo_codes (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code                 TEXT NOT NULL UNIQUE,
  description          TEXT NOT NULL,
  discount_type        discount_type NOT NULL,
  discount_value       NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
  min_order_amount     NUMERIC(10,2) NOT NULL DEFAULT 0,
  max_discount_amount  NUMERIC(10,2),
  usage_limit          INTEGER,
  used_count           INTEGER NOT NULL DEFAULT 0,
  valid_from           TIMESTAMPTZ NOT NULL,
  valid_until          TIMESTAMPTZ NOT NULL,
  applicable_to        promo_vertical NOT NULL DEFAULT 'both',
  is_active            BOOLEAN NOT NULL DEFAULT TRUE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_active ON promo_codes(is_active);
CREATE INDEX idx_promo_codes_valid ON promo_codes(valid_from, valid_until);

-- RLS
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active valid promo codes"
  ON promo_codes FOR SELECT
  USING (
    is_active = TRUE
    AND valid_from <= NOW()
    AND valid_until >= NOW()
    AND (usage_limit IS NULL OR used_count < usage_limit)
  );

CREATE POLICY "Admins manage promo codes"
  ON promo_codes FOR ALL
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin'));

-- RPC: validate and apply promo code
CREATE OR REPLACE FUNCTION validate_promo_code(
  p_code TEXT,
  p_order_amount NUMERIC,
  p_vertical promo_vertical
)
RETURNS JSONB AS $$
DECLARE
  v_promo promo_codes%ROWTYPE;
  v_discount NUMERIC;
BEGIN
  SELECT * INTO v_promo
  FROM promo_codes
  WHERE code = UPPER(p_code)
    AND is_active = TRUE
    AND valid_from <= NOW()
    AND valid_until >= NOW()
    AND (usage_limit IS NULL OR used_count < usage_limit)
    AND (applicable_to = 'both' OR applicable_to = p_vertical);

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', FALSE, 'error', 'Invalid or expired promo code');
  END IF;

  IF p_order_amount < v_promo.min_order_amount THEN
    RETURN jsonb_build_object(
      'valid', FALSE,
      'error', FORMAT('Minimum order amount is ₹%s', v_promo.min_order_amount)
    );
  END IF;

  IF v_promo.discount_type = 'percentage' THEN
    v_discount := p_order_amount * v_promo.discount_value / 100;
  ELSE
    v_discount := v_promo.discount_value;
  END IF;

  IF v_promo.max_discount_amount IS NOT NULL THEN
    v_discount := LEAST(v_discount, v_promo.max_discount_amount);
  END IF;

  RETURN jsonb_build_object(
    'valid', TRUE,
    'discount', v_discount,
    'promo_id', v_promo.id,
    'description', v_promo.description
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
