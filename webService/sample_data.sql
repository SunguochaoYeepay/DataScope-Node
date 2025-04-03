-- 创建示例表：用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    age INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active'
);

-- 创建示例表：订单表
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 创建示例表：产品表
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    category VARCHAR(50)
);

-- 创建示例表：订单项目表
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 插入用户数据
INSERT INTO users (username, email, age, status) VALUES
('zhang_wei', 'zhang_wei@example.com', 28, 'active'),
('li_na', 'li_na@example.com', 34, 'active'),
('wang_fang', 'wang_fang@example.com', 22, 'active'),
('zhao_ming', 'zhao_ming@example.com', 45, 'inactive'),
('liu_jie', 'liu_jie@example.com', 31, 'active'),
('chen_yu', 'chen_yu@example.com', 29, 'active'),
('yang_hui', 'yang_hui@example.com', 26, 'suspended'),
('wu_tao', 'wu_tao@example.com', 37, 'active'),
('sun_feng', 'sun_feng@example.com', 42, 'active'),
('ma_lan', 'ma_lan@example.com', 24, 'inactive');

-- 插入产品数据
INSERT INTO products (name, description, price, stock, category) VALUES
('华为P50 Pro', '高端智能手机，搭载麒麟9000处理器', 5999.00, 100, '手机'),
('小米电视4A', '55英寸4K超高清智能电视', 2299.00, 50, '电视'),
('联想ThinkPad X1', '14英寸商务笔记本电脑', 8999.00, 30, '电脑'),
('戴森吸尘器V11', '无线手持吸尘器', 3999.00, 20, '家电'),
('苹果AirPods Pro', '主动降噪无线耳机', 1899.00, 200, '配件'),
('华硕ROG游戏本', '17.3英寸游戏笔记本', 12999.00, 15, '电脑'),
('三星Galaxy S22', '高端Android智能手机', 6499.00, 80, '手机'),
('索尼WH-1000XM4', '无线降噪耳机', 2499.00, 40, '配件'),
('格力空调KFR-35GW', '1.5匹变频冷暖', 3699.00, 25, '家电'),
('小米手环6', '智能健康监测手环', 229.00, 500, '配件');

-- 插入订单数据
INSERT INTO orders (user_id, total_amount, status, order_date) VALUES
(1, 8898.00, 'delivered', '2025-03-01 10:00:00'),
(2, 3999.00, 'shipped', '2025-03-02 11:30:00'),
(3, 2299.00, 'delivered', '2025-03-03 09:15:00'),
(4, 1899.00, 'cancelled', '2025-03-04 14:20:00'),
(5, 12999.00, 'processing', '2025-03-05 16:45:00'),
(1, 2499.00, 'pending', '2025-03-06 08:30:00'),
(6, 6499.00, 'delivered', '2025-03-07 13:10:00'),
(7, 229.00, 'shipped', '2025-03-08 17:25:00'),
(8, 5999.00, 'processing', '2025-03-09 10:40:00'),
(9, 3699.00, 'pending', '2025-03-10 12:50:00'),
(2, 8999.00, 'delivered', '2025-03-11 15:15:00'),
(3, 2728.00, 'shipped', '2025-03-12 09:20:00');

-- 插入订单项目数据
INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES
(1, 3, 1, 8999.00),
(2, 4, 1, 3999.00),
(3, 2, 1, 2299.00),
(4, 5, 1, 1899.00),
(5, 6, 1, 12999.00),
(6, 8, 1, 2499.00),
(7, 7, 1, 6499.00),
(8, 10, 1, 229.00),
(9, 1, 1, 5999.00),
(10, 9, 1, 3699.00),
(11, 3, 1, 8999.00),
(12, 5, 1, 1899.00),
(12, 10, 1, 229.00),
(12, 10, 2, 229.00),
(1, 5, 1, 1899.00),
(3, 10, 2, 229.00);
