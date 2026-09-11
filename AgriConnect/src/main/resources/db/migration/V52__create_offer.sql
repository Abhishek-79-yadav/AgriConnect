CREATE TABLE offer (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    buyer_id BIGINT NOT NULL,
    farmer_id BIGINT NOT NULL,
    quantity DOUBLE,
    offered_price DECIMAL(12,2),
    message VARCHAR(500),
    status VARCHAR(20) NOT NULL,
    counter_price DECIMAL(12,2),
    counter_message VARCHAR(500),
    responded_at DATETIME,
    converted_order_id BIGINT,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_offer_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_offer_buyer FOREIGN KEY (buyer_id) REFERENCES users(id),
    CONSTRAINT fk_offer_farmer FOREIGN KEY (farmer_id) REFERENCES users(id)
);

CREATE INDEX idx_offer_buyer ON offer(buyer_id);
CREATE INDEX idx_offer_farmer ON offer(farmer_id);
CREATE INDEX idx_offer_product ON offer(product_id);
