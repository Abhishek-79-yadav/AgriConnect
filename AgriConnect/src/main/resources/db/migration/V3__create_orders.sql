CREATE TABLE orders (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        user_id BIGINT,
                        product_id BIGINT,
                        quantity INT,
                        total_amount DECIMAL(10,2)
);