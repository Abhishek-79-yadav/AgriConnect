CREATE TABLE rating (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        stars INT,
                        comment VARCHAR(500),
                        buyer_id BIGINT,
                        farmer_id BIGINT,
                        CONSTRAINT fk_rating_buyer FOREIGN KEY (buyer_id) REFERENCES users(id),
                        CONSTRAINT fk_rating_farmer FOREIGN KEY (farmer_id) REFERENCES users(id)
);