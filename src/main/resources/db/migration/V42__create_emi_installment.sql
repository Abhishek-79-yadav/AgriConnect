CREATE TABLE emi_installment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    emi_plan_id BIGINT NOT NULL,
    installment_number INT NOT NULL,
    amount DOUBLE NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL,
    paid_at TIMESTAMP,
    CONSTRAINT fk_emi_installment_plan FOREIGN KEY (emi_plan_id) REFERENCES emi_plan(id)
);

CREATE INDEX idx_emi_installment_plan ON emi_installment(emi_plan_id);
