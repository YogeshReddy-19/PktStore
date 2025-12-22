CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE,
  password TEXT,
  address TEXT,
  mobilenumber TEXT
);

CREATE TABLE products(
  prod_id SERIAL PRIMARY KEY,
  prodname TEXT,
  price NUMERIC(10,2),
  prodimg TEXT,
  reviews TEXT,
  description TEXT
);

CREATE TABLE orders (
  ordid SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(prod_id) ON DELETE CASCADE,
  review TEXT,
  quantity INT,
  totalam NUMERIC(10,2)
);

INSERT INTO products (prodname, price, prodimg, description) VALUES
('Apple Watch Series 11', 45900, '/watch11.jpg', 'Latest Apple Watch Series 10 with fitness tracking, AMOLED display, and advanced sensors'),

('MacBook M5 Pro', 189000, '/macbookm5.jpg',  'High-performance MacBook M5 Pro for creators and developers'),

('iPhone 17 Pro', 149900, '/iphone17pro.jpg', 'iPhone 17 Pro with A20 chip, enhanced camera, and titanium frame'),

('Samsung Z Fold 7', 164999, '/zfold7.jpg',  'Samsung Galaxy Z Fold 7 foldable phone with 7.9-inch dynamic display'),

('Classic Plain T-Shirt', 499, '/tshirt.jpg', 'Comfortable plain cotton T-shirt available in multiple sizes'),

('Wireless Headphones', 2499, '/headphone.jpg', 'Noise-cancelling wireless headphones with 20-hour battery life'),

('ATV Off-road Bike', 129999, '/atv.jpg', 'All-terrain vehicle with high-performance engine for off-road riding'),

('Washing Machine 7kg', 18999, '/washingmachine.jpg',  'Fully automatic front-load washing machine'),

('Indoor Plant', 299, '/plant.jpg',  'Beautiful indoor plant for home and office environments'),

('PlayStation 5', 49999, '/ps5.jpg',  'Sony PS5 gaming console with ultra-fast SSD'),

('Smart TV 55-inch 4K', 44999, 'tv.jpg',  '55-inch Ultra HD 4K Smart TV with HDR and OTT apps'),

('iPhone 17 Pro Case', 799, '17procase.jpg',  'Shockproof premium case designed for iPhone 17 Pro');


ALTER TABLE users 
ADD COLUMN cart JSONB DEFAULT '[]';