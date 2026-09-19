CREATE TABLE order_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    note VARCHAR(500),
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_status_history_order FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE INDEX idx_status_history_order ON order_status_history(order_id);
