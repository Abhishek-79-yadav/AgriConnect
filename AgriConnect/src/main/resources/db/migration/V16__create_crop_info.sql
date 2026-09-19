CREATE TABLE crop_info (
                           id BIGINT AUTO_INCREMENT PRIMARY KEY,
                           crop_id BIGINT,
                           title VARCHAR(255),
                           description VARCHAR(255),
                           video_url VARCHAR(500),
                           CONSTRAINT fk_crop_info_crop FOREIGN KEY (crop_id) REFERENCES crop(id)
);