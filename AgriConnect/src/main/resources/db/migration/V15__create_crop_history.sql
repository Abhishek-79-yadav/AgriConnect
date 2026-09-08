CREATE TABLE crop_history (
                              id BIGINT AUTO_INCREMENT PRIMARY KEY,
                              farmer_id BIGINT,
                              crop_name VARCHAR(255),
                              yield DOUBLE,
                              season VARCHAR(255),
                              `date` DATE,
                              selling_price_per_unit DOUBLE,
                              cost_price_per_unit DOUBLE,
                              quantity DOUBLE,
                              CONSTRAINT fk_crop_history_farmer FOREIGN KEY (farmer_id) REFERENCES users(id)
);