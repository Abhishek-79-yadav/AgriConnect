CREATE TABLE order_item (
                            id BIGINT AUTO_INCREMENT PRIMARY KEY,
                            order_id BIGINT,
                            product_id BIGINT,
                            quantity DOUBLE,
                            price DOUBLE,
                            CONSTRAINT fk_order_item_order FOREIGN KEY (order_id) REFERENCES orders(id),
                            CONSTRAINT fk_order_item_product FOREIGN KEY (product_id) REFERENCES products(id)
);