CREATE TABLE refresh_token (
                               id BIGINT AUTO_INCREMENT PRIMARY KEY,
                               token VARCHAR(500),
                               email VARCHAR(255),
                               expiry_date DATETIME
);