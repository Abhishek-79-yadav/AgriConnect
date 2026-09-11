CREATE TABLE coupon (
                        id BIGINT AUTO_INCREMENT PRIMARY KEY,
                        code VARCHAR(255) UNIQUE,
                        discount DOUBLE,
                        expiry_date DATE,
                        active BOOLEAN DEFAULT TRUE
);