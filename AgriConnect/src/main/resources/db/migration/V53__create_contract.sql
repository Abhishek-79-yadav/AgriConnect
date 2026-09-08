CREATE TABLE contract (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    buyer_id BIGINT NOT NULL,
    farmer_id BIGINT NOT NULL,
    crop_id BIGINT,
    quantity DOUBLE,
    unit VARCHAR(30),
    agreed_price DECIMAL(12,2),
    advance_payment DECIMAL(12,2),
    start_date DATE,
    delivery_date DATE,
    terms VARCHAR(2000),
    status VARCHAR(20) NOT NULL,
    delivered_quantity DOUBLE NOT NULL DEFAULT 0,
    responded_at DATETIME,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_contract_buyer FOREIGN KEY (buyer_id) REFERENCES users(id),
    CONSTRAINT fk_contract_farmer FOREIGN KEY (farmer_id) REFERENCES users(id),
    CONSTRAINT fk_contract_crop FOREIGN KEY (crop_id) REFERENCES crop(id)
);

CREATE TABLE contract_delivery (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    contract_id BIGINT NOT NULL,
    quantity DOUBLE,
    note VARCHAR(500),
    delivered_at DATETIME NOT NULL,
    CONSTRAINT fk_contract_delivery_contract FOREIGN KEY (contract_id) REFERENCES contract(id)
);

CREATE INDEX idx_contract_buyer ON contract(buyer_id);
CREATE INDEX idx_contract_farmer ON contract(farmer_id);
CREATE INDEX idx_contract_delivery_contract ON contract_delivery(contract_id);
