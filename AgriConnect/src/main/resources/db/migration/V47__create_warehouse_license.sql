CREATE TABLE warehouse_license (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    farmer_id BIGINT NOT NULL,
    warehouse_name VARCHAR(255) NOT NULL,
    location VARCHAR(500),
    capacity_tonnes DOUBLE,
    license_number VARCHAR(100),
    document_url VARCHAR(500),
    status VARCHAR(20) NOT NULL,
    remarks VARCHAR(1000),
    applied_at TIMESTAMP NOT NULL,
    reviewed_at TIMESTAMP,
    expiry_date DATE,
    reviewed_by BIGINT,
    CONSTRAINT fk_warehouse_license_farmer FOREIGN KEY (farmer_id) REFERENCES users(id),
    CONSTRAINT fk_warehouse_license_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

CREATE INDEX idx_warehouse_license_farmer ON warehouse_license(farmer_id);
CREATE INDEX idx_warehouse_license_status ON warehouse_license(status);
