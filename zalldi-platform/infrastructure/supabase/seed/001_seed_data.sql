-- ============================================================
-- SEED DATA — Development only
-- Run after all migrations
-- ============================================================

-- Darkstores
INSERT INTO darkstores (id, name, address, city, latitude, longitude, service_radius_km, opens_at, closes_at, avg_delivery_time_mins)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'Zalldi Banjara Hills', 'Road No 12, Banjara Hills', 'Hyderabad', 17.4156, 78.4347, 5.0, '06:00', '23:59', 12),
  ('22222222-2222-2222-2222-222222222222', 'Zalldi Jubilee Hills', 'Film Nagar, Jubilee Hills', 'Hyderabad', 17.4239, 78.4088, 5.0, '06:00', '23:59', 15),
  ('33333333-3333-3333-3333-333333333333', 'Zalldi Madhapur', 'Hi-Tech City, Madhapur', 'Hyderabad', 17.4486, 78.3908, 5.0, '06:00', '23:59', 10);

-- Categories
INSERT INTO categories (id, name, slug, sort_order)
VALUES
  ('aaaa0001-0000-0000-0000-000000000000', 'Vegetables & Fruits', 'vegetables-fruits', 1),
  ('aaaa0002-0000-0000-0000-000000000000', 'Dairy & Eggs', 'dairy-eggs', 2),
  ('aaaa0003-0000-0000-0000-000000000000', 'Bakery & Bread', 'bakery-bread', 3),
  ('aaaa0004-0000-0000-0000-000000000000', 'Snacks & Beverages', 'snacks-beverages', 4),
  ('aaaa0005-0000-0000-0000-000000000000', 'Meat & Seafood', 'meat-seafood', 5),
  ('aaaa0006-0000-0000-0000-000000000000', 'Breakfast & Cereals', 'breakfast-cereals', 6),
  ('aaaa0007-0000-0000-0000-000000000000', 'Personal Care', 'personal-care', 7),
  ('aaaa0008-0000-0000-0000-000000000000', 'Cleaning Supplies', 'cleaning-supplies', 8);

-- Restaurants
INSERT INTO restaurants (name, slug, cuisine_types, address, city, latitude, longitude, rating, rating_count, avg_delivery_time_mins, min_order_amount, delivery_fee, is_pure_veg, is_open, is_active, is_approved, opens_at, closes_at)
VALUES
  ('Biryani Blues', 'biryani-blues', ARRAY['Biryani', 'Mughlai'], 'Road No 3, Banjara Hills', 'Hyderabad', 17.4160, 78.4350, 4.3, 1240, 35, 150, 30, FALSE, TRUE, TRUE, TRUE, '11:00', '23:00'),
  ('Pizza Palace', 'pizza-palace', ARRAY['Pizza', 'Italian', 'Fast Food'], 'Jubilee Hills Check Post', 'Hyderabad', 17.4245, 78.4092, 4.1, 876, 25, 199, 40, FALSE, TRUE, TRUE, TRUE, '10:00', '23:30'),
  ('Green Bowl', 'green-bowl', ARRAY['Salads', 'Healthy', 'Vegan'], 'Hi-Tech City Lane', 'Hyderabad', 17.4489, 78.3912, 4.5, 562, 20, 100, 0, TRUE, TRUE, TRUE, TRUE, '09:00', '22:00'),
  ('Burger Barn', 'burger-barn', ARRAY['Burger', 'American', 'Fast Food'], 'Madhapur Main Road', 'Hyderabad', 17.4492, 78.3920, 4.0, 2103, 20, 99, 25, FALSE, TRUE, TRUE, TRUE, '10:00', '01:00'),
  ('Dosa Dynasty', 'dosa-dynasty', ARRAY['South Indian', 'Breakfast'], 'Banjara Hills Colony', 'Hyderabad', 17.4155, 78.4340, 4.6, 3450, 30, 80, 15, TRUE, TRUE, TRUE, TRUE, '07:00', '22:00');

-- Promo codes
INSERT INTO promo_codes (code, description, discount_type, discount_value, min_order_amount, max_discount_amount, valid_from, valid_until, applicable_to)
VALUES
  ('ZALLDI50', 'Get 50% off up to ₹100 on your first order', 'percentage', 50, 149, 100, NOW(), NOW() + INTERVAL '30 days', 'both'),
  ('FREESHIP', 'Free delivery on grocery orders above ₹299', 'flat', 40, 299, NULL, NOW(), NOW() + INTERVAL '7 days', 'grocery'),
  ('FOOD30', '30% off on food orders', 'percentage', 30, 200, 80, NOW(), NOW() + INTERVAL '14 days', 'food');
