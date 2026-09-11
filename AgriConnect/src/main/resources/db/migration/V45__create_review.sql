CREATE TABLE review (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    buyer_id BIGINT NOT NULL,
    order_item_id BIGINT NOT NULL,
    rating INT NOT NULL,
    comment VARCHAR(1000),
    farmer_reply VARCHAR(1000),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    CONSTRAINT fk_review_product FOREIGN KEY (product_id) REFERENCES products(id),
    CONSTRAINT fk_review_buyer FOREIGN KEY (buyer_id) REFERENCES users(id),
    CONSTRAINT fk_review_order_item FOREIGN KEY (order_item_id) REFERENCES order_item(id),
    CONSTRAINT uq_review_buyer_order_item UNIQUE (buyer_id, order_item_id)
);

CREATE INDEX idx_review_product ON review(product_id);
CREATE INDEX idx_review_buyer ON review(buyer_id);
