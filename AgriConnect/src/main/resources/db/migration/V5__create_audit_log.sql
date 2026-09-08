CREATE TABLE audit_log (
                           id BIGINT AUTO_INCREMENT PRIMARY KEY,
                           action VARCHAR(255),
                           username VARCHAR(255),
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);