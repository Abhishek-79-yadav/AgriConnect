CREATE TABLE plan (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    tier VARCHAR(20) NOT NULL,
    price DOUBLE NOT NULL,
    duration_days INT NOT NULL,
    description VARCHAR(255)
);

INSERT INTO plan (name, tier, price, duration_days, description) VALUES
    ('Basic', 'BASIC', 499, 30, 'Browse and list agri-inputs for 30 days'),
    ('Premium', 'PREMIUM', 1499, 30, 'Basic + featured placement on farmer dashboards for 30 days');

CREATE TABLE subscription (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    plan_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_subscription_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_subscription_plan FOREIGN KEY (plan_id) REFERENCES plan(id)
);

CREATE TABLE agri_input (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    description VARCHAR(500),
    category VARCHAR(50) NOT NULL,
    price DOUBLE NOT NULL,
    stock DOUBLE NOT NULL DEFAULT 0,
    unit VARCHAR(20),
    image_url VARCHAR(500),
    CONSTRAINT fk_agri_input_company FOREIGN KEY (company_id) REFERENCES users(id)
);
