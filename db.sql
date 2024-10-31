CREATE DATABASE db_beamin;

USE db_beamin;

CREATE TABLE food_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE foods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image_url VARCHAR(255) DEFAULT '',
    description VARCHAR(255),
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0 NOT NULL,
    category_id INT,
    created_at TIMESTAMP(6) DEFAULT NOW(),
    FOREIGN KEY (category_id) REFERENCES food_categories (id) ON UPDATE NO ACTION
);

CREATE TABLE inventory (
    id SERIAL PRIMARY KEY,
    food_id INT UNIQUE,
    quantity INT NOT NULL,
    last_updated TIMESTAMP(6) DEFAULT NOW(),
    FOREIGN KEY (food_id) REFERENCES foods (id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INT,
    food_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (food_id) REFERENCES foods (id) ON UPDATE NO ACTION,
    FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE ON UPDATE NO ACTION
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT,
    status VARCHAR(20) DEFAULT 'pending',
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP(6) DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE NO ACTION
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP(6) DEFAULT NOW(),
    avatar VARCHAR(255) DEFAULT ''
);

CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP(6) DEFAULT NOW(),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE NO ACTION
);

INSERT INTO food_categories (name, description) VALUES
('Pizza', 'Các loại pizza thơm ngon'),
('Burger', 'Các loại burger hấp dẫn'),
('Drinks', 'Các loại đồ uống giải khát');

INSERT INTO foods (name, image_url, description, price, stock, category_id) VALUES
('Margherita Pizza', '', 'Pizza với phô mai và cà chua', 5.99, 10, 1),
('Pepperoni Pizza', '', 'Pizza với xúc xích Pepperoni', 7.99, 8, 1),
('Cheeseburger', '', 'Burger phô mai với bò', 4.99, 15, 2),
('Veggie Burger', '', 'Burger rau củ', 4.49, 10, 2),
('Coke', '', 'Nước ngọt Coca Cola', 1.99, 20, 3),
('Sprite', '', 'Nước ngọt Sprite', 1.99, 18, 3);

INSERT INTO users (username, password, email, avatar) VALUES
('admin', '$2b$10$prE7DpSAY/mKdJv4O7xX6.JTeo5jaF4c1L8rlK2rRJPPvtNR3.Qeu', 'admin@gmail.com', '') --password tuong duong voi 123456

INSERT INTO orders (user_id, status, total_price) VALUES
(1, 'confirmed', 15.97),
(2, 'pending', 9.98);

INSERT INTO order_items (order_id, food_id, quantity, price) VALUES
(1, 1, 2, 5.99),
(1, 5, 1, 1.99),
(2, 2, 1, 7.99),
(2, 6, 1, 1.99);

INSERT INTO inventory (food_id, quantity) VALUES
(1, 10),
(2, 8),
(3, 15),
(4, 10),
(5, 20),
(6, 18);
