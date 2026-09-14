CREATE TABLE return_request (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    order_item_id BIGINT,
    buyer_id BIGINT NOT NULL,
    reason VARCHAR(1000) NOT NULL,
    status VARCHAR(30) NOT NULL,
    admin_note VARCHAR(1000),
    requested_at TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP,
    CONSTRAINT fk_return_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_return_order_item FOREIGN KEY (order_item_id) REFERENCES order_item(id),
    CONSTRAINT fk_return_buyer FOREIGN KEY (buyer_id) REFERENCES users(id)
);

CREATE INDEX idx_return_order ON return_request(order_id);
CREATE INDEX idx_return_buyer ON return_request(buyer_id);
