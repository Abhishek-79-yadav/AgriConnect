CREATE TABLE government_scheme (
                                   id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                   title VARCHAR(255),
                                   description VARCHAR(2000),
                                   state VARCHAR(255),
                                   category VARCHAR(255),
                                   apply_link VARCHAR(500),
                                   active BOOLEAN DEFAULT TRUE
);