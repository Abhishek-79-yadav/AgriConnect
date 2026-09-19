CREATE TABLE shipment (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL UNIQUE,
    status VARCHAR(30) NOT NULL,
    carrier VARCHAR(255),
    tracking_number VARCHAR(255),
    tracking_url VARCHAR(500),
    delivery_agent_name VARCHAR(255),
    delivery_agent_phone VARCHAR(20),
    vehicle_number VARCHAR(50),
    expected_delivery_date DATE,
    picked_up_at DATETIME,
    delivered_at DATETIME,
    delivery_attempts INT NOT NULL DEFAULT 0,
    proof_of_delivery_name VARCHAR(255),
    proof_of_delivery_note VARCHAR(500),
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_shipment_order FOREIGN KEY (order_id) REFERENCES orders(id)
);

CREATE TABLE shipment_event (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    shipment_id BIGINT NOT NULL,
    status VARCHAR(30) NOT NULL,
    location VARCHAR(255),
    note VARCHAR(500),
    created_at DATETIME NOT NULL,
    CONSTRAINT fk_shipment_event_shipment FOREIGN KEY (shipment_id) REFERENCES shipment(id)
);

CREATE INDEX idx_shipment_event_shipment ON shipment_event(shipment_id);
