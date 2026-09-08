CREATE TABLE cart (
                      id BIGINT AUTO_INCREMENT PRIMARY KEY,
                      quantity DOUBLE NOT NULL,
                      buyer_id BIGINT,
                      product_id BIGINT,
                      CONSTRAINT fk_cart_buyer FOREIGN KEY (buyer_id) REFERENCES users(id),
                      CONSTRAINT fk_cart_product FOREIGN KEY (product_id) REFERENCES products(id)
);