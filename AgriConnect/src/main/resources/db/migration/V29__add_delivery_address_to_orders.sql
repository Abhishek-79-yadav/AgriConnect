ALTER TABLE orders
    ADD COLUMN delivery_name VARCHAR(150),
    ADD COLUMN delivery_phone VARCHAR(20),
    ADD COLUMN delivery_address_line VARCHAR(255),
    ADD COLUMN delivery_city VARCHAR(100),
    ADD COLUMN delivery_state VARCHAR(100),
    ADD COLUMN delivery_pincode VARCHAR(10);
