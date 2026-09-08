CREATE TABLE notification (
                              id BIGINT AUTO_INCREMENT PRIMARY KEY,
                              message VARCHAR(500),
                              read_status BOOLEAN DEFAULT FALSE,
                              user_id BIGINT,
                              CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES users(id)
);