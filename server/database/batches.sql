CREATE TABLE IF NOT EXISTS batches (
    id SERIAL PRIMARY KEY,

    batch_no VARCHAR(20) UNIQUE NOT NULL,

    customer_id INTEGER NOT NULL,

    vehicle_id INTEGER NOT NULL,

    driver_id INTEGER NOT NULL,

    grade VARCHAR(20) NOT NULL,

    quantity NUMERIC(10,2) NOT NULL,

    batch_date DATE NOT NULL,

    batch_time TIME NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'Pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_batch_customer
        FOREIGN KEY (customer_id)
        REFERENCES customers(id),

    CONSTRAINT fk_batch_vehicle
        FOREIGN KEY (vehicle_id)
        REFERENCES vehicles(id),

    CONSTRAINT fk_batch_driver
        FOREIGN KEY (driver_id)
        REFERENCES drivers(id)
);