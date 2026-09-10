CREATE TABLE wallet_transaction (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    wallet_id BIGINT NOT NULL,
    type VARCHAR(20) NOT NULL,
    amount DOUBLE NOT NULL,
    reason VARCHAR(255),
    reference_type VARCHAR(50),
    reference_id BIGINT,
    balance_after DOUBLE NOT NULL,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_wallet_txn_wallet FOREIGN KEY (wallet_id) REFERENCES wallet(id)
);

CREATE INDEX idx_wallet_txn_wallet ON wallet_transaction(wallet_id);
