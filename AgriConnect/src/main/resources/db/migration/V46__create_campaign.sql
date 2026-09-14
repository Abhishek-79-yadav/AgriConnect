CREATE TABLE campaign (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          description VARCHAR(1000),
                          type VARCHAR(30) NOT NULL,
                          status VARCHAR(20) NOT NULL,
                          banner_image_url VARCHAR(500),
                          link_url VARCHAR(500),
                          coupon_code VARCHAR(50),
                          target_role VARCHAR(20) NOT NULL DEFAULT 'ALL',
                          start_date TIMESTAMP NOT NULL,
                          end_date TIMESTAMP NOT NULL,
                          impressions BIGINT NOT NULL DEFAULT 0,
                          clicks BIGINT NOT NULL DEFAULT 0,

    -- CHANGED FROM created_by TO created_by_id
                          created_by_id BIGINT,

                          created_at TIMESTAMP NOT NULL,

                          CONSTRAINT fk_campaign_created_by
                              FOREIGN KEY (created_by_id)
                                  REFERENCES users(id)
);

CREATE INDEX idx_campaign_status
    ON campaign(status);

CREATE INDEX idx_campaign_dates
    ON campaign(start_date, end_date);