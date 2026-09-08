CREATE TABLE brand_profile (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    company_name VARCHAR(150) NOT NULL,
    gst_number VARCHAR(20),
    category VARCHAR(100),
    CONSTRAINT fk_brand_profile_user FOREIGN KEY (user_id) REFERENCES users(id)
);
