ALTER TABLE farmer_profile
    ADD COLUMN land_size_acres DOUBLE;

ALTER TABLE crop_history
    ADD COLUMN fertilizer_used VARCHAR(255),
    ADD COLUMN fertilizer_quantity_kg DOUBLE,
    ADD COLUMN pesticide_used VARCHAR(255),
    ADD COLUMN pesticide_quantity_l DOUBLE;
