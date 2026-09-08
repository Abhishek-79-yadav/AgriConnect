CREATE TABLE tax_record (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    period VARCHAR(20) NOT NULL,
    taxable_amount DOUBLE NOT NULL,
    tax_amount DOUBLE NOT NULL,
    tax_type VARCHAR(30) NOT NULL DEFAULT 'GST',
    status VARCHAR(20) NOT NULL,
    due_date DATE,
    paid_at TIMESTAMP,
    remarks VARCHAR(1000),
    created_by BIGINT,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_tax_record_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_tax_record_created_by FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX idx_tax_record_user ON tax_record(user_id);
CREATE INDEX idx_tax_record_status ON tax_record(status);
