-- 选择数据库
USE datascope;

-- 插入用户数据
INSERT INTO users (username, email, password, created_at, last_login) VALUES
('mariaadmin', 'mariaadmin@example.com', '$2a$10$JH7XzfhdS0qw1XHuie9AduBX1Xwn6MgCOTHYgQ2tLV3mxNn4xNwXi', NOW() - INTERVAL 30 DAY, NOW()),
('muser1', 'muser1@example.com', '$2a$10$KxTL.DNJLMqi2mOqbSYbFudxaUfFc/6DCwHFZ5z.rCbmE3UwVsrGS', NOW() - INTERVAL 25 DAY, NOW() - INTERVAL 2 DAY),
('muser2', 'muser2@example.com', '$2a$10$IYBGj9tZ41hMBLAzBYUFTuv2x1qHH9.vnyWOV2P5mGwgvz7hLPtgu', NOW() - INTERVAL 20 DAY, NOW() - INTERVAL 1 DAY),
('muser3', 'muser3@example.com', '$2a$10$JqXIKYDnhAZBOdQUjPlnB.X7dAXU8zX1J.TIHTJmQCvQVjvllV5AC', NOW() - INTERVAL 15 DAY, NOW() - INTERVAL 3 DAY),
('muser4', 'muser4@example.com', '$2a$10$KIbBQgSs0ogJw.FBQ2NaZer0BIjTQI80hcMwmYW9QZ.m2VpNz9zUa', NOW() - INTERVAL 10 DAY, NOW() - INTERVAL 5 DAY),
('muser5', 'muser5@example.com', '$2a$10$9vbpEGoABLm1ZL5t24YmZusL1QGXx6jlBM1fNcwBA.4kyDvZlVDcm', NOW() - INTERVAL 5 DAY, NOW()),
('muser6', 'muser6@example.com', '$2a$10$XN9JxBzJvxRHY2xDKTdlC.OXAUYhK0A4/C0LcZzlM/E8eKiKQy/.u', NOW(), NULL);

-- 插入类别数据
INSERT INTO categories (category_name, description) VALUES
('电子设备', '电子设备及配件分类'),
('食品饮料', '食品饮料分类'),
('健康医疗', '健康医疗相关产品'),
('图书音像', '图书、音乐和电影分类'),
('运动户外', '运动装备与户外用品');

-- 插入产品数据
INSERT INTO products (name, price, description, category_id, created_at) VALUES
('三星Galaxy S22', 6499.00, '三星旗舰智能手机', 1, NOW() - INTERVAL 60 DAY),
('苹果MacBook Air', 7999.00, '苹果轻薄笔记本电脑', 1, NOW() - INTERVAL 55 DAY),
('戴尔XPS 15', 10999.00, '戴尔高性能笔记本电脑', 1, NOW() - INTERVAL 50 DAY),
('农夫山泉矿泉水', 2.50, '天然矿泉水500ml', 2, NOW() - INTERVAL 45 DAY),
('统一老坛酸菜牛肉面', 4.50, '方便面', 2, NOW() - INTERVAL 40 DAY),
('维生素C片', 45.00, '维生素C补充剂', 3, NOW() - INTERVAL 35 DAY),
('血压计', 89.00, '家用电子血压计', 3, NOW() - INTERVAL 30 DAY),
('活着', 29.80, '余华著，长篇小说', 4, NOW() - INTERVAL 25 DAY),
('霍金时间简史', 45.50, '科普读物', 4, NOW() - INTERVAL 20 DAY),
('耐克篮球鞋', 699.00, '专业篮球运动鞋', 5, NOW() - INTERVAL 15 DAY),
('迪卡侬登山包', 199.00, '户外登山背包', 5, NOW() - INTERVAL 10 DAY),
('探路者帐篷', 599.00, '户外双人帐篷', 5, NOW() - INTERVAL 5 DAY);

-- 插入订单数据
INSERT INTO orders (user_id, total_amount, status, created_at) VALUES
(1, 14498.00, '已完成', NOW() - INTERVAL 30 DAY),
(2, 6499.00, '已完成', NOW() - INTERVAL 25 DAY),
(3, 7999.00, '已完成', NOW() - INTERVAL 20 DAY),
(4, 7.00, '已完成', NOW() - INTERVAL 15 DAY),
(5, 134.00, '已完成', NOW() - INTERVAL 10 DAY),
(1, 599.00, '已完成', NOW() - INTERVAL 7 DAY),
(2, 29.80, '已完成', NOW() - INTERVAL 5 DAY),
(3, 699.00, '处理中', NOW() - INTERVAL 3 DAY),
(4, 199.00, '处理中', NOW() - INTERVAL 2 DAY),
(5, 10999.00, '待付款', NOW() - INTERVAL 1 DAY),
(1, 45.50, '待付款', NOW());

-- 插入订单项数据
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 6499.00),
(1, 2, 1, 7999.00),
(2, 1, 1, 6499.00),
(3, 2, 1, 7999.00),
(4, 4, 2, 2.50),
(4, 5, 1, 4.50),
(5, 6, 1, 45.00),
(5, 7, 1, 89.00),
(6, 12, 1, 599.00),
(7, 8, 1, 29.80),
(8, 10, 1, 699.00),
(9, 11, 1, 199.00),
(10, 3, 1, 10999.00),
(11, 9, 1, 45.50);

-- 插入页面访问记录
INSERT INTO page_visits (page_url, user_id, visit_date, visit_time, ip_address, user_agent) VALUES
('/homepage', 1, CURRENT_DATE, '08:30:00', '192.168.1.200', 'Mozilla/5.0'),
('/category/1', 1, CURRENT_DATE, '08:35:00', '192.168.1.200', 'Mozilla/5.0'),
('/product/1', 1, CURRENT_DATE, '08:40:00', '192.168.1.200', 'Mozilla/5.0'),
('/product/2', 1, CURRENT_DATE, '08:45:00', '192.168.1.200', 'Mozilla/5.0'),
('/cart', 1, CURRENT_DATE, '08:50:00', '192.168.1.200', 'Mozilla/5.0'),
('/homepage', 2, CURRENT_DATE, '09:30:00', '192.168.1.201', 'Chrome/101.0'),
('/category/5', 2, CURRENT_DATE, '09:35:00', '192.168.1.201', 'Chrome/101.0'),
('/product/10', 2, CURRENT_DATE, '09:40:00', '192.168.1.201', 'Chrome/101.0'),
('/homepage', 3, CURRENT_DATE - INTERVAL 1 DAY, '08:30:00', '192.168.1.202', 'Firefox/98.0'),
('/category/4', 3, CURRENT_DATE - INTERVAL 1 DAY, '08:35:00', '192.168.1.202', 'Firefox/98.0'),
('/product/8', 3, CURRENT_DATE - INTERVAL 1 DAY, '08:40:00', '192.168.1.202', 'Firefox/98.0'),
('/homepage', 4, CURRENT_DATE - INTERVAL 1 DAY, '09:30:00', '192.168.1.203', 'Safari/15.0'),
('/category/2', 4, CURRENT_DATE - INTERVAL 1 DAY, '09:35:00', '192.168.1.203', 'Safari/15.0'),
('/product/4', 4, CURRENT_DATE - INTERVAL 1 DAY, '09:40:00', '192.168.1.203', 'Safari/15.0'),
('/homepage', 5, CURRENT_DATE - INTERVAL 2 DAY, '08:30:00', '192.168.1.204', 'Edge/99.0'),
('/category/3', 5, CURRENT_DATE - INTERVAL 2 DAY, '08:35:00', '192.168.1.204', 'Edge/99.0'),
('/product/6', 5, CURRENT_DATE - INTERVAL 2 DAY, '08:40:00', '192.168.1.204', 'Edge/99.0');

-- 插入系统监控数据
INSERT INTO system_metrics (timestamp, hostname, cpu_usage, memory_usage, disk_usage, network_in, network_out) VALUES
(NOW() - INTERVAL 60 MINUTE, 'mariadb-server-1', 25.6, 38.2, 45.3, 625000, 318000),
(NOW() - INTERVAL 55 MINUTE, 'mariadb-server-1', 28.3, 40.1, 45.3, 728000, 425000),
(NOW() - INTERVAL 50 MINUTE, 'mariadb-server-1', 32.1, 42.5, 45.4, 862000, 532000),
(NOW() - INTERVAL 45 MINUTE, 'mariadb-server-1', 35.4, 45.8, 45.4, 978000, 652000),
(NOW() - INTERVAL 40 MINUTE, 'mariadb-server-1', 42.2, 48.3, 45.5, 1089000, 725000),
(NOW() - INTERVAL 35 MINUTE, 'mariadb-server-1', 38.7, 46.5, 45.5, 1012000, 668000),
(NOW() - INTERVAL 30 MINUTE, 'mariadb-server-1', 30.1, 43.2, 45.6, 956000, 592000),
(NOW() - INTERVAL 25 MINUTE, 'mariadb-server-1', 25.8, 40.1, 45.6, 882000, 476000),
(NOW() - INTERVAL 20 MINUTE, 'mariadb-server-1', 22.3, 37.8, 45.7, 765000, 385000),
(NOW() - INTERVAL 15 MINUTE, 'mariadb-server-1', 18.1, 35.2, 45.7, 685000, 325000),
(NOW() - INTERVAL 10 MINUTE, 'mariadb-server-1', 15.6, 32.5, 45.8, 593000, 287000),
(NOW() - INTERVAL 5 MINUTE, 'mariadb-server-1', 12.8, 30.1, 45.8, 525000, 246000),
(NOW(), 'mariadb-server-1', 10.5, 28.3, 45.9, 485000, 212000); 