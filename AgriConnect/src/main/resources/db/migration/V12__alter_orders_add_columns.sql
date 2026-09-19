ALTER TABLE orders
    ADD COLUMN buyer_id BIGINT,
    ADD COLUMN total_price DOUBLE,
    ADD COLUMN status VARCHAR(30),
    ADD COLUMN paid BOOLEAN DEFAULT FALSE,
    ADD COLUMN payment_id VARCHAR(255),
    ADD COLUMN invoice_url VARCHAR(500),
    ADD COLUMN coupon_code VARCHAR(255),
    ADD COLUMN discount DOUBLE,
    ADD COLUMN created_at DATETIME NULL,
    ADD CONSTRAINT fk_order_buyer FOREIGN KEY (buyer_id) REFERENCES users(id);