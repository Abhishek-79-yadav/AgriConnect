CREATE TABLE refund (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    order_item_id BIGINT,
    buyer_id BIGINT NOT NULL,
    amount DOUBLE NOT NULL,
    reason VARCHAR(500),
    status VARCHAR(20) NOT NULL,
    method VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP,
    CONSTRAINT fk_refund_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_refund_order_item FOREIGN KEY (order_item_id) REFERENCES order_item(id),
    CONSTRAINT fk_refund_buyer FOREIGN KEY (buyer_id) REFERENCES users(id)
);

CREATE INDEX idx_refund_order ON refund(order_id);
CREATE INDEX idx_refund_buyer ON refund(buyer_id);
