CREATE TABLE farmer_profile (
                                id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                farmer_id BIGINT,
                                soil_type VARCHAR(255),
                                state VARCHAR(255),
                                city VARCHAR(255),
                                CONSTRAINT fk_farmer_profile_farmer FOREIGN KEY (farmer_id) REFERENCES users(id)
);