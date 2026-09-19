CREATE TABLE product_video (
                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                               video_url VARCHAR(500),
                               title VARCHAR(255),
                               product_id BIGINT,
                               farmer_id BIGINT,
                               CONSTRAINT fk_product_video_product FOREIGN KEY (product_id) REFERENCES products(id),
                               CONSTRAINT fk_product_video_farmer FOREIGN KEY (farmer_id) REFERENCES users(id)
);