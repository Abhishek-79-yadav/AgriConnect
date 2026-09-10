ALTER TABLE users
    ADD COLUMN suspension_reason VARCHAR(255);

ALTER TABLE products
    ADD COLUMN approved BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE agri_input
    ADD COLUMN approved BOOLEAN NOT NULL DEFAULT TRUE;

CREATE TABLE dispute (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    buyer_id BIGINT NOT NULL,
    reason VARCHAR(100) NOT NULL,
    description VARCHAR(1000),
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    admin_response VARCHAR(1000),
    created_at TIMESTAMP,
    resolved_at TIMESTAMP,
    CONSTRAINT fk_dispute_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_dispute_buyer FOREIGN KEY (buyer_id) REFERENCES users(id)
);
