-- 选择数据库
USE datascope;

-- 插入用户数据
INSERT INTO users (username, email, password, created_at, last_login) VALUES
('admin', 'admin@example.com', '$2a$10$JH7XzfhdS0qw1XHuie9AduBX1Xwn6MgCOTHYgQ2tLV3mxNn4xNwXi', DATE_SUB(NOW(), INTERVAL 30 DAY), NOW()),
('user1', 'user1@example.com', '$2a$10$KxTL.DNJLMqi2mOqbSYbFudxaUfFc/6DCwHFZ5z.rCbmE3UwVsrGS', DATE_SUB(NOW(), INTERVAL 25 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY)),
('user2', 'user2@example.com', '$2a$10$IYBGj9tZ41hMBLAzBYUFTuv2x1qHH9.vnyWOV2P5mGwgvz7hLPtgu', DATE_SUB(NOW(), INTERVAL 20 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
('user3', 'user3@example.com', '$2a$10$JqXIKYDnhAZBOdQUjPlnB.X7dAXU8zX1J.TIHTJmQCvQVjvllV5AC', DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY)),
('user4', 'user4@example.com', '$2a$10$KIbBQgSs0ogJw.FBQ2NaZer0BIjTQI80hcMwmYW9QZ.m2VpNz9zUa', DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
('user5', 'user5@example.com', '$2a$10$9vbpEGoABLm1ZL5t24YmZusL1QGXx6jlBM1fNcwBA.4kyDvZlVDcm', DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),
('user6', 'user6@example.com', '$2a$10$XN9JxBzJvxRHY2xDKTdlC.OXAUYhK0A4/C0LcZzlM/E8eKiKQy/.u', NOW(), NULL),
('user7', 'user7@example.com', '$2a$10$v8IKAIEUXjD6EyMD/1h3e.kBhJQfBLQTLxcPQtq00XeYZJOX1W1za', NOW(), NULL),
('user8', 'user8@example.com', '$2a$10$oYynx.xI3U.zfRijCOZ5OewvWXJMQfmAGsUJyqjYYFo7GTtPJOOh2', NOW(), NULL),
('user9', 'user9@example.com', '$2a$10$G6DT1JhQFQMr0pOlgzjzbu4B6Q4xwEIUxRr7P8T07MJzC5JzIY0Aq', NOW(), NULL);

-- 插入类别数据
INSERT INTO categories (category_name, description) VALUES
('电子产品', '包括手机、电脑、平板等电子设备'),
('服装', '包括男装、女装、童装等服饰类商品'),
('家居', '包括家具、厨具、装饰品等家居商品'),
('食品', '包括零食、饮料、生鲜等食品'),
('图书', '包括小说、教材、杂志等图书商品');

-- 插入产品数据
INSERT INTO products (name, price, description, category_id, created_at) VALUES
('iPhone 14', 6999.00, '苹果iPhone 14智能手机', 1, DATE_SUB(NOW(), INTERVAL 60 DAY)),
('MacBook Pro', 12999.00, '苹果MacBook Pro笔记本电脑', 1, DATE_SUB(NOW(), INTERVAL 55 DAY)),
('iPad Air', 4799.00, '苹果iPad Air平板电脑', 1, DATE_SUB(NOW(), INTERVAL 50 DAY)),
('男士牛仔裤', 299.00, '时尚潮流男士牛仔裤', 2, DATE_SUB(NOW(), INTERVAL 45 DAY)),
('女士连衣裙', 399.00, '时尚潮流女士连衣裙', 2, DATE_SUB(NOW(), INTERVAL 40 DAY)),
('儿童T恤', 99.00, '纯棉儿童T恤', 2, DATE_SUB(NOW(), INTERVAL 35 DAY)),
('沙发', 3999.00, '现代风格三人沙发', 3, DATE_SUB(NOW(), INTERVAL 30 DAY)),
('餐桌', 1999.00, '实木餐桌', 3, DATE_SUB(NOW(), INTERVAL 25 DAY)),
('床', 2999.00, '1.8米双人床', 3, DATE_SUB(NOW(), INTERVAL 20 DAY)),
('薯片', 9.90, '原味薯片', 4, DATE_SUB(NOW(), INTERVAL 15 DAY)),
('可乐', 5.00, '可口可乐', 4, DATE_SUB(NOW(), INTERVAL 10 DAY)),
('巧克力', 15.00, '进口巧克力', 4, DATE_SUB(NOW(), INTERVAL 5 DAY)),
('小说', 39.00, '畅销小说', 5, NOW()),
('教材', 59.00, '大学教材', 5, NOW()),
('杂志', 20.00, '时尚杂志', 5, NOW());

-- 插入订单数据
INSERT INTO orders (user_id, total_amount, status, created_at) VALUES
(1, 19998.00, '已完成', DATE_SUB(NOW(), INTERVAL 30 DAY)),
(2, 6999.00, '已完成', DATE_SUB(NOW(), INTERVAL 25 DAY)),
(3, 4799.00, '已完成', DATE_SUB(NOW(), INTERVAL 20 DAY)),
(4, 698.00, '已完成', DATE_SUB(NOW(), INTERVAL 15 DAY)),
(5, 3999.00, '已完成', DATE_SUB(NOW(), INTERVAL 10 DAY)),
(1, 118.00, '已完成', DATE_SUB(NOW(), INTERVAL 7 DAY)),
(2, 79.00, '已完成', DATE_SUB(NOW(), INTERVAL 5 DAY)),
(3, 3999.00, '处理中', DATE_SUB(NOW(), INTERVAL 3 DAY)),
(4, 399.00, '处理中', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(5, 12999.00, '待付款', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(6, 299.00, '待付款', NOW()),
(7, 4799.00, '已取消', DATE_SUB(NOW(), INTERVAL 12 DAY)),
(8, 6999.00, '已取消', DATE_SUB(NOW(), INTERVAL 8 DAY));

-- 插入订单项数据
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 2, 1, 12999.00),
(1, 7, 1, 3999.00),
(1, 10, 10, 9.90),
(1, 11, 20, 5.00),
(2, 1, 1, 6999.00),
(3, 3, 1, 4799.00),
(4, 4, 2, 299.00),
(4, 10, 10, 9.90),
(5, 7, 1, 3999.00),
(6, 10, 5, 9.90),
(6, 11, 10, 5.00),
(6, 12, 1, 15.00),
(7, 13, 1, 39.00),
(7, 14, 1, 59.00),
(8, 7, 1, 3999.00),
(9, 5, 1, 399.00),
(10, 2, 1, 12999.00),
(11, 4, 1, 299.00),
(12, 3, 1, 4799.00),
(13, 1, 1, 6999.00);

-- 插入页面访问记录
INSERT INTO page_visits (page_url, user_id, visit_date, visit_time, ip_address, user_agent) VALUES
('/home', 1, CURRENT_DATE(), '08:00:00', '192.168.1.1', 'Mozilla/5.0'),
('/products', 1, CURRENT_DATE(), '08:05:00', '192.168.1.1', 'Mozilla/5.0'),
('/product/1', 1, CURRENT_DATE(), '08:10:00', '192.168.1.1', 'Mozilla/5.0'),
('/cart', 1, CURRENT_DATE(), '08:15:00', '192.168.1.1', 'Mozilla/5.0'),
('/checkout', 1, CURRENT_DATE(), '08:20:00', '192.168.1.1', 'Mozilla/5.0'),
('/home', 2, CURRENT_DATE(), '09:00:00', '192.168.1.2', 'Chrome/101.0'),
('/products', 2, CURRENT_DATE(), '09:05:00', '192.168.1.2', 'Chrome/101.0'),
('/product/2', 2, CURRENT_DATE(), '09:10:00', '192.168.1.2', 'Chrome/101.0'),
('/cart', 2, CURRENT_DATE(), '09:15:00', '192.168.1.2', 'Chrome/101.0'),
('/checkout', 2, CURRENT_DATE(), '09:20:00', '192.168.1.2', 'Chrome/101.0'),
('/home', NULL, CURRENT_DATE(), '10:00:00', '192.168.1.3', 'Safari/15.0'),
('/products', NULL, CURRENT_DATE(), '10:05:00', '192.168.1.3', 'Safari/15.0'),
('/product/3', NULL, CURRENT_DATE(), '10:10:00', '192.168.1.3', 'Safari/15.0'),
('/home', NULL, CURRENT_DATE(), '11:00:00', '192.168.1.4', 'Firefox/98.0'),
('/products', NULL, CURRENT_DATE(), '11:05:00', '192.168.1.4', 'Firefox/98.0'),
('/product/4', NULL, CURRENT_DATE(), '11:10:00', '192.168.1.4', 'Firefox/98.0'),
('/home', 3, DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '08:00:00', '192.168.1.5', 'Mozilla/5.0'),
('/products', 3, DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '08:05:00', '192.168.1.5', 'Mozilla/5.0'),
('/product/5', 3, DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '08:10:00', '192.168.1.5', 'Mozilla/5.0'),
('/home', 4, DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '09:00:00', '192.168.1.6', 'Chrome/101.0'),
('/products', 4, DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '09:05:00', '192.168.1.6', 'Chrome/101.0'),
('/product/6', 4, DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY), '09:10:00', '192.168.1.6', 'Chrome/101.0'),
('/home', 5, DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '08:00:00', '192.168.1.7', 'Mozilla/5.0'),
('/products', 5, DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '08:05:00', '192.168.1.7', 'Mozilla/5.0'),
('/product/7', 5, DATE_SUB(CURRENT_DATE(), INTERVAL 2 DAY), '08:10:00', '192.168.1.7', 'Mozilla/5.0');

-- 插入系统监控数据
INSERT INTO system_metrics (timestamp, hostname, cpu_usage, memory_usage, disk_usage, network_in, network_out) VALUES
(DATE_SUB(NOW(), INTERVAL 60 MINUTE), 'server-1', 45.2, 62.5, 78.1, 1024000, 512000),
(DATE_SUB(NOW(), INTERVAL 55 MINUTE), 'server-1', 48.7, 65.2, 78.1, 1124000, 618000),
(DATE_SUB(NOW(), INTERVAL 50 MINUTE), 'server-1', 52.3, 68.7, 78.2, 1256000, 728000),
(DATE_SUB(NOW(), INTERVAL 45 MINUTE), 'server-1', 65.8, 72.3, 78.2, 1362000, 856000),
(DATE_SUB(NOW(), INTERVAL 40 MINUTE), 'server-1', 72.1, 75.6, 78.3, 1489000, 924000),
(DATE_SUB(NOW(), INTERVAL 35 MINUTE), 'server-1', 68.5, 73.2, 78.3, 1325000, 862000),
(DATE_SUB(NOW(), INTERVAL 30 MINUTE), 'server-1', 58.2, 70.1, 78.4, 1245000, 782000),
(DATE_SUB(NOW(), INTERVAL 25 MINUTE), 'server-1', 52.6, 67.3, 78.4, 1156000, 652000),
(DATE_SUB(NOW(), INTERVAL 20 MINUTE), 'server-1', 48.9, 65.2, 78.5, 1052000, 542000),
(DATE_SUB(NOW(), INTERVAL 15 MINUTE), 'server-1', 42.3, 61.8, 78.5, 986000, 486000),
(DATE_SUB(NOW(), INTERVAL 10 MINUTE), 'server-1', 38.5, 58.2, 78.6, 856000, 423000),
(DATE_SUB(NOW(), INTERVAL 5 MINUTE), 'server-1', 35.2, 55.8, 78.6, 785000, 386000),
(NOW(), 'server-1', 32.6, 52.4, 78.7, 725000, 356000),
(DATE_SUB(NOW(), INTERVAL 60 MINUTE), 'server-2', 35.6, 58.2, 65.3, 856000, 423000),
(DATE_SUB(NOW(), INTERVAL 55 MINUTE), 'server-2', 38.2, 60.5, 65.3, 892000, 456000),
(DATE_SUB(NOW(), INTERVAL 50 MINUTE), 'server-2', 42.8, 62.3, 65.4, 956000, 486000),
(DATE_SUB(NOW(), INTERVAL 45 MINUTE), 'server-2', 45.2, 65.8, 65.4, 1024000, 512000),
(DATE_SUB(NOW(), INTERVAL 40 MINUTE), 'server-2', 48.5, 68.2, 65.5, 1124000, 562000),
(DATE_SUB(NOW(), INTERVAL 35 MINUTE), 'server-2', 52.3, 70.5, 65.5, 1256000, 628000),
(DATE_SUB(NOW(), INTERVAL 30 MINUTE), 'server-2', 56.8, 72.3, 65.6, 1362000, 682000),
(DATE_SUB(NOW(), INTERVAL 25 MINUTE), 'server-2', 58.2, 73.5, 65.6, 1425000, 712000),
(DATE_SUB(NOW(), INTERVAL 20 MINUTE), 'server-2', 55.6, 71.2, 65.7, 1325000, 662000),
(DATE_SUB(NOW(), INTERVAL 15 MINUTE), 'server-2', 52.3, 68.5, 65.7, 1256000, 628000),
(DATE_SUB(NOW(), INTERVAL 10 MINUTE), 'server-2', 48.5, 65.2, 65.8, 1124000, 562000),
(DATE_SUB(NOW(), INTERVAL 5 MINUTE), 'server-2', 45.2, 62.5, 65.8, 1024000, 512000),
(NOW(), 'server-2', 42.6, 60.1, 65.9, 986000, 493000); 