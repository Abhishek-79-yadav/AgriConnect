ALTER TABLE orders ADD COLUMN carrier VARCHAR(255);
ALTER TABLE orders ADD COLUMN tracking_number VARCHAR(255);
ALTER TABLE orders ADD COLUMN tracking_url VARCHAR(500);
ALTER TABLE orders ADD COLUMN expected_delivery_date DATE;
ALTER TABLE orders ADD COLUMN delivered_at TIMESTAMP;
