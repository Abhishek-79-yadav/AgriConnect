CREATE TABLE password_reset_otp (
                                    id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                    email VARCHAR(255),
                                    otp VARCHAR(10),
                                    expiry_time DATETIME,
                                    used BOOLEAN DEFAULT FALSE
);