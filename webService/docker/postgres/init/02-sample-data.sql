-- 插入用户数据
INSERT INTO users (username, email, password, created_at, last_login) VALUES
('pgadmin', 'pgadmin@example.com', '$2a$10$JH7XzfhdS0qw1XHuie9AduBX1Xwn6MgCOTHYgQ2tLV3mxNn4xNwXi', NOW() - INTERVAL '30 DAY', NOW()),
('user1', 'pg_user1@example.com', '$2a$10$KxTL.DNJLMqi2mOqbSYbFudxaUfFc/6DCwHFZ5z.rCbmE3UwVsrGS', NOW() - INTERVAL '25 DAY', NOW() - INTERVAL '2 DAY'),
('user2', 'pg_user2@example.com', '$2a$10$IYBGj9tZ41hMBLAzBYUFTuv2x1qHH9.vnyWOV2P5mGwgvz7hLPtgu', NOW() - INTERVAL '20 DAY', NOW() - INTERVAL '1 DAY'),
('user3', 'pg_user3@example.com', '$2a$10$JqXIKYDnhAZBOdQUjPlnB.X7dAXU8zX1J.TIHTJmQCvQVjvllV5AC', NOW() - INTERVAL '15 DAY', NOW() - INTERVAL '3 DAY'),
('user4', 'pg_user4@example.com', '$2a$10$KIbBQgSs0ogJw.FBQ2NaZer0BIjTQI80hcMwmYW9QZ.m2VpNz9zUa', NOW() - INTERVAL '10 DAY', NOW() - INTERVAL '5 DAY'),
('user5', 'pg_user5@example.com', '$2a$10$9vbpEGoABLm1ZL5t24YmZusL1QGXx6jlBM1fNcwBA.4kyDvZlVDcm', NOW() - INTERVAL '5 DAY', NOW()),
('user6', 'pg_user6@example.com', '$2a$10$XN9JxBzJvxRHY2xDKTdlC.OXAUYhK0A4/C0LcZzlM/E8eKiKQy/.u', NOW(), NULL);

-- 插入类别数据
INSERT INTO categories (category_name, description) VALUES
('数码', '数码电子产品分类'),
('办公', '办公用品分类'),
('家电', '家用电器分类'),
('家具', '家居家具分类'),
('服饰', '服装服饰分类');

-- 插入产品数据
INSERT INTO products (name, price, description, category_id, created_at) VALUES
('华为 P50', 5999.00, '华为P50智能手机', 1, NOW() - INTERVAL '60 DAY'),
('联想 ThinkPad', 8999.00, '联想ThinkPad笔记本电脑', 1, NOW() - INTERVAL '55 DAY'),
('小米平板 6', 2999.00, '小米平板6平板电脑', 1, NOW() - INTERVAL '50 DAY'),
('得力文件夹', 39.90, '得力A4文件夹', 2, NOW() - INTERVAL '45 DAY'),
('惠普打印机', 1599.00, '惠普激光打印机', 2, NOW() - INTERVAL '40 DAY'),
('美的空调', 3599.00, '美的1.5匹空调', 3, NOW() - INTERVAL '35 DAY'),
('海尔冰箱', 4599.00, '海尔双门冰箱', 3, NOW() - INTERVAL '30 DAY'),
('全友沙发', 5999.00, '全友真皮沙发', 4, NOW() - INTERVAL '25 DAY'),
('索菲亚衣柜', 8999.00, '索菲亚定制衣柜', 4, NOW() - INTERVAL '20 DAY'),
('优衣库T恤', 99.00, '优衣库纯棉T恤', 5, NOW() - INTERVAL '15 DAY'),
('李宁运动鞋', 399.00, '李宁跑步运动鞋', 5, NOW() - INTERVAL '10 DAY'),
('阿迪达斯外套', 599.00, '阿迪达斯运动外套', 5, NOW() - INTERVAL '5 DAY');

-- 插入订单数据
INSERT INTO orders (user_id, total_amount, status, created_at) VALUES
(1, 14998.00, '已完成', NOW() - INTERVAL '30 DAY'),
(2, 5999.00, '已完成', NOW() - INTERVAL '25 DAY'),
(3, 2999.00, '已完成', NOW() - INTERVAL '20 DAY'),
(4, 1639.90, '已完成', NOW() - INTERVAL '15 DAY'),
(5, 8198.00, '已完成', NOW() - INTERVAL '10 DAY'),
(1, 5999.00, '已完成', NOW() - INTERVAL '7 DAY'),
(2, 99.00, '已完成', NOW() - INTERVAL '5 DAY'),
(3, 4599.00, '处理中', NOW() - INTERVAL '3 DAY'),
(4, 399.00, '处理中', NOW() - INTERVAL '2 DAY'),
(5, 8999.00, '待付款', NOW() - INTERVAL '1 DAY'),
(1, 599.00, '待付款', NOW());

-- 插入订单项数据
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 2, 1, 8999.00),
(1, 8, 1, 5999.00),
(2, 1, 1, 5999.00),
(3, 3, 1, 2999.00),
(4, 4, 1, 39.90),
(4, 5, 1, 1599.00),
(5, 6, 1, 3599.00),
(5, 7, 1, 4599.00),
(6, 8, 1, 5999.00),
(7, 10, 1, 99.00),
(8, 7, 1, 4599.00),
(9, 11, 1, 399.00),
(10, 9, 1, 8999.00),
(11, 12, 1, 599.00);

-- 插入页面访问记录
INSERT INTO page_visits (page_url, user_id, visit_date, visit_time, ip_address, user_agent) VALUES
('/home', 1, CURRENT_DATE, '08:00:00', '192.168.1.100', 'Mozilla/5.0'),
('/products', 1, CURRENT_DATE, '08:05:00', '192.168.1.100', 'Mozilla/5.0'),
('/product/1', 1, CURRENT_DATE, '08:10:00', '192.168.1.100', 'Mozilla/5.0'),
('/cart', 1, CURRENT_DATE, '08:15:00', '192.168.1.100', 'Mozilla/5.0'),
('/checkout', 1, CURRENT_DATE, '08:20:00', '192.168.1.100', 'Mozilla/5.0'),
('/home', 2, CURRENT_DATE, '09:00:00', '192.168.1.101', 'Chrome/101.0'),
('/products', 2, CURRENT_DATE, '09:05:00', '192.168.1.101', 'Chrome/101.0'),
('/product/2', 2, CURRENT_DATE, '09:10:00', '192.168.1.101', 'Chrome/101.0'),
('/home', 3, CURRENT_DATE - INTERVAL '1 DAY', '08:00:00', '192.168.1.102', 'Firefox/98.0'),
('/products', 3, CURRENT_DATE - INTERVAL '1 DAY', '08:05:00', '192.168.1.102', 'Firefox/98.0'),
('/product/3', 3, CURRENT_DATE - INTERVAL '1 DAY', '08:10:00', '192.168.1.102', 'Firefox/98.0'),
('/home', 4, CURRENT_DATE - INTERVAL '1 DAY', '09:00:00', '192.168.1.103', 'Safari/15.0'),
('/products', 4, CURRENT_DATE - INTERVAL '1 DAY', '09:05:00', '192.168.1.103', 'Safari/15.0'),
('/product/4', 4, CURRENT_DATE - INTERVAL '1 DAY', '09:10:00', '192.168.1.103', 'Safari/15.0'),
('/home', 5, CURRENT_DATE - INTERVAL '2 DAY', '08:00:00', '192.168.1.104', 'Edge/99.0'),
('/products', 5, CURRENT_DATE - INTERVAL '2 DAY', '08:05:00', '192.168.1.104', 'Edge/99.0'),
('/product/5', 5, CURRENT_DATE - INTERVAL '2 DAY', '08:10:00', '192.168.1.104', 'Edge/99.0');

-- 插入系统监控数据
INSERT INTO system_metrics (timestamp, hostname, cpu_usage, memory_usage, disk_usage, network_in, network_out) VALUES
(NOW() - INTERVAL '60 MINUTE', 'pg-server-1', 35.2, 42.5, 68.1, 824000, 412000),
(NOW() - INTERVAL '55 MINUTE', 'pg-server-1', 38.7, 45.2, 68.1, 924000, 518000),
(NOW() - INTERVAL '50 MINUTE', 'pg-server-1', 42.3, 48.7, 68.2, 1056000, 628000),
(NOW() - INTERVAL '45 MINUTE', 'pg-server-1', 45.8, 52.3, 68.2, 1162000, 756000),
(NOW() - INTERVAL '40 MINUTE', 'pg-server-1', 52.1, 55.6, 68.3, 1289000, 824000),
(NOW() - INTERVAL '35 MINUTE', 'pg-server-1', 48.5, 53.2, 68.3, 1225000, 762000),
(NOW() - INTERVAL '30 MINUTE', 'pg-server-1', 38.2, 50.1, 68.4, 1145000, 682000),
(NOW() - INTERVAL '25 MINUTE', 'pg-server-1', 32.6, 47.3, 68.4, 1056000, 552000),
(NOW() - INTERVAL '20 MINUTE', 'pg-server-1', 28.9, 45.2, 68.5, 952000, 442000),
(NOW() - INTERVAL '15 MINUTE', 'pg-server-1', 22.3, 41.8, 68.5, 886000, 386000),
(NOW() - INTERVAL '10 MINUTE', 'pg-server-1', 18.5, 38.2, 68.6, 756000, 323000),
(NOW() - INTERVAL '5 MINUTE', 'pg-server-1', 15.2, 35.8, 68.6, 685000, 286000),
(NOW(), 'pg-server-1', 12.6, 32.4, 68.7, 625000, 256000); 