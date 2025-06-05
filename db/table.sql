CREATE TABLE surveys (
    id SERIAL PRIMARY KEY,
    full_names VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    favorite_foods TEXT[],
    movies_rating INTEGER NOT NULL,
    radio_rating INTEGER NOT NULL,
    eat_out_rating INTEGER NOT NULL,
    tv_rating INTEGER NOT NULL,
    submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);