CREATE TABLE emi_plan (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE,
    buyer_id BIGINT NOT NULL,
    total_amount DOUBLE NOT NULL,
    number_of_installments INT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_emi_plan_order FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_emi_plan_buyer FOREIGN KEY (buyer_id) REFERENCES users(id)
);
