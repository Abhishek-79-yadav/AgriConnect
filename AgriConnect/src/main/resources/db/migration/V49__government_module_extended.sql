-- Departments
CREATE TABLE department (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(1000),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL
);

-- Government schemes gain a department + eligibility criteria
ALTER TABLE government_scheme ADD COLUMN department_id BIGINT;
ALTER TABLE government_scheme ADD COLUMN eligibility_criteria VARCHAR(2000);
ALTER TABLE government_scheme ADD CONSTRAINT fk_scheme_department FOREIGN KEY (department_id) REFERENCES department(id);

-- Scheme applications (farmer applies, government verifies documents + approves/rejects)
CREATE TABLE scheme_application (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    scheme_id BIGINT NOT NULL,
    applicant_id BIGINT NOT NULL,
    document_url VARCHAR(500),
    status VARCHAR(30) NOT NULL,
    document_verified BOOLEAN NOT NULL DEFAULT FALSE,
    verification_remarks VARCHAR(1000),
    decision_remarks VARCHAR(1000),
    applied_at TIMESTAMP NOT NULL,
    reviewed_at TIMESTAMP,
    reviewed_by BIGINT,
    CONSTRAINT fk_scheme_app_scheme FOREIGN KEY (scheme_id) REFERENCES government_scheme(id),
    CONSTRAINT fk_scheme_app_applicant FOREIGN KEY (applicant_id) REFERENCES users(id),
    CONSTRAINT fk_scheme_app_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

CREATE INDEX idx_scheme_app_scheme ON scheme_application(scheme_id);
CREATE INDEX idx_scheme_app_applicant ON scheme_application(applicant_id);
CREATE INDEX idx_scheme_app_status ON scheme_application(status);

-- Government notices / announcements
CREATE TABLE government_notice (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content VARCHAR(3000) NOT NULL,
    department_id BIGINT,
    target_role VARCHAR(20) NOT NULL DEFAULT 'ALL',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_by BIGINT,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_notice_department FOREIGN KEY (department_id) REFERENCES department(id),
    CONSTRAINT fk_notice_created_by FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE INDEX idx_notice_active ON government_notice(active);

-- Tax configuration (reference rates, distinct from per-user TaxRecord filings)
CREATE TABLE tax_config (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tax_type VARCHAR(50) NOT NULL,
    category VARCHAR(100),
    rate_percent DOUBLE NOT NULL,
    description VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    effective_from DATE,
    created_by BIGINT,
    created_at TIMESTAMP NOT NULL,
    CONSTRAINT fk_tax_config_created_by FOREIGN KEY (created_by) REFERENCES users(id)
);
