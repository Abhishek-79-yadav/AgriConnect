CREATE TABLE email_verification_token (
                                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                          token VARCHAR(255) UNIQUE,
                                          user_id BIGINT,
                                          expiry_time DATETIME,
                                          CONSTRAINT fk_evt_user FOREIGN KEY (user_id) REFERENCES users(id)
);