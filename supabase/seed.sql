-- ============================================================
-- E-XANH Seed Data
-- Chạy file này SAU schema.sql trong Supabase SQL Editor
-- ============================================================

-- ============================================
-- CATEGORIES
-- ============================================
INSERT INTO categories (name, slug, description) VALUES
  ('Điều hòa', 'dieu-hoa', 'Mẹo sử dụng điều hòa tiết kiệm điện'),
  ('Laptop', 'laptop', 'Tiết kiệm điện khi dùng laptop'),
  ('Tủ lạnh', 'tu-lanh', 'Cách dùng tủ lạnh hiệu quả'),
  ('Thiết bị điện', 'thiet-bi-dien', 'Kiến thức chung về thiết bị điện'),
  ('Thói quen', 'thoi-quen', 'Thói quen tiết kiệm điện hằng ngày');

-- ============================================
-- DEVICES
-- ============================================
INSERT INTO devices (name, default_power, category, icon, tips) VALUES
  ('Điều hòa 9000BTU', 850, 'Làm mát', '❄️', 'Đặt 26–28°C và kết hợp quạt để tiết kiệm đến 40% điện năng.'),
  ('Điều hòa 12000BTU', 1200, 'Làm mát', '❄️', 'Chọn chế độ Eco/Sleep ban đêm để giảm công suất tiêu thụ.'),
  ('Laptop', 65, 'Học tập', '💻', 'Rút sạc khi pin đầy, giảm độ sáng màn hình để tiết kiệm điện.'),
  ('Tủ lạnh mini', 80, 'Bảo quản', '🧊', 'Đặt cách tường 10cm, không nhét quá đầy để tản nhiệt tốt.'),
  ('Quạt điện', 50, 'Làm mát', '🌀', 'Dùng quạt kết hợp điều hòa giúp giảm nhiệt độ cài đặt.'),
  ('Đèn LED', 10, 'Chiếu sáng', '💡', 'Chọn đèn LED thay bóng sợi đốt, tiết kiệm đến 80% điện.'),
  ('Máy giặt', 500, 'Gia dụng', '🧺', 'Giặt đủ mẻ, chọn chế độ nước lạnh để tiết kiệm điện năng.'),
  ('Bình nóng lạnh', 2500, 'Gia dụng', '🚿', 'Chỉ bật trước khi dùng 15 phút, tắt ngay sau khi tắm xong.'),
  ('Nồi cơm điện', 700, 'Nấu ăn', '🍚', 'Ngâm gạo trước khi nấu giúp giảm thời gian và điện tiêu thụ.'),
  ('Bếp từ', 2000, 'Nấu ăn', '🔥', 'Dùng nồi đáy phẳng đúng kích cỡ mặt bếp để truyền nhiệt tối ưu.');

-- ============================================
-- PLATFORM_SETTINGS
-- ============================================
INSERT INTO platform_settings (key, value) VALUES
  ('platform_name', '"E-XANH"'),
  ('slogan', '"Dùng điện thông minh, sống xanh bền vững."'),
  ('contact_email', '"support@exanh.vn"'),
  ('platform_description', '"E-XANH giúp người trẻ tiết kiệm điện, chia sẻ kinh nghiệm sống xanh và theo dõi chi phí điện hằng tháng."'),
  ('approve_before_publish', 'true'),
  ('moderate_comments', 'true'),
  ('allow_reporting', 'true'),
  ('auto_hide_reported', 'false'),
  ('notify_new_post', 'true'),
  ('notify_reported_comment', 'true'),
  ('notify_new_user', 'false'),
  ('weekly_email', 'true');
