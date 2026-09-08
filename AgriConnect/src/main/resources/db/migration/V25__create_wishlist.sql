CREATE TABLE wishlist (
                          id BIGINT AUTO_INCREMENT PRIMARY KEY,
                          user_id BIGINT,
                          product_id BIGINT,
                          CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES users(id),
                          CONSTRAINT fk_wishlist_product FOREIGN KEY (product_id) REFERENCES products(id)
);