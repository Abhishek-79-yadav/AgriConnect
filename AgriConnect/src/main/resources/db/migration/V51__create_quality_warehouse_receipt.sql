CREATE TABLE warehouse_receipt (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    warehouse_license_id BIGINT NOT NULL,
    farmer_id BIGINT NOT NULL,
    crop_id BIGINT,
    quantity DOUBLE,
    unit VARCHAR(30),
    status VARCHAR(30) NOT NULL,
    receipt_number VARCHAR(100),
    remarks VARCHAR(1000),
    stored_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_receipt_license FOREIGN KEY (warehouse_license_id) REFERENCES warehouse_license(id),
    CONSTRAINT fk_receipt_farmer FOREIGN KEY (farmer_id) REFERENCES users(id),
    CONSTRAINT fk_receipt_crop FOREIGN KEY (crop_id) REFERENCES crop(id)
);

CREATE TABLE quality_inspection (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    warehouse_receipt_id BIGINT NOT NULL,
    inspector_id BIGINT,
    grade VARCHAR(20),
    moisture_percent DOUBLE,
    foreign_matter_percent DOUBLE,
    passed BOOLEAN NOT NULL,
    remarks VARCHAR(1000),
    inspected_at DATETIME NOT NULL,
    CONSTRAINT fk_inspection_receipt FOREIGN KEY (warehouse_receipt_id) REFERENCES warehouse_receipt(id),
    CONSTRAINT fk_inspection_inspector FOREIGN KEY (inspector_id) REFERENCES users(id)
);

CREATE INDEX idx_receipt_farmer ON warehouse_receipt(farmer_id);
CREATE INDEX idx_receipt_license ON warehouse_receipt(warehouse_license_id);
CREATE INDEX idx_inspection_receipt ON quality_inspection(warehouse_receipt_id);
