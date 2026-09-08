CREATE TABLE support_ticket (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message VARCHAR(2000) NOT NULL,
    status VARCHAR(20) NOT NULL,
    admin_response VARCHAR(2000),
    created_at TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP,
    CONSTRAINT fk_support_ticket_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_support_ticket_user ON support_ticket(user_id);
