-- CẢNH BÁO: chứa TRUNCATE không điều kiện, không chạy trên DB có dữ liệu thật

-- ====================================================================
-- E-XANH DATABASE CLEANUP PLAN (SQL DRAFT ONLY - DO NOT RUN DIRECTLY)
-- ====================================================================
--
-- Kế hoạch dọn dẹp dữ liệu test/demo trước khi đưa website vào hoạt động.
-- Chỉ chạy script này trên môi trường Supabase SQL Editor khi được phê duyệt.
--

BEGIN;

-- 1. DỌN DẸP DỮ LIỆU TƯƠNG TÁC NGƯỜI DÙNG & MOCK (CÓ THỂ CLEAR)
TRUNCATE TABLE comments CASCADE;
TRUNCATE TABLE post_likes CASCADE;
TRUNCATE TABLE saved_posts CASCADE;
TRUNCATE TABLE reports CASCADE;
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE notification_batches CASCADE;
TRUNCATE TABLE user_notifications CASCADE;
TRUNCATE TABLE electricity_checks CASCADE;
TRUNCATE TABLE electricity_check_items CASCADE;
TRUNCATE TABLE user_follows CASCADE;
TRUNCATE TABLE admin_audit_logs CASCADE;
TRUNCATE TABLE admin_user_notes CASCADE;

-- 2. DỮ LIỆU POSTS (BÀI VIẾT)
-- LƯU Ý: posts chỉ được clear khi toàn bộ 12 bài hiện tại là demo/test.
-- Bỏ dấu comment (--) dưới đây để clear posts:
-- TRUNCATE TABLE posts CASCADE;

-- 3. KHÔNG XÓA CÁC BẢNG SAU (MASTER / CẤU HÌNH HỆ THỐNG):
-- - profiles
-- - devices
-- - categories
-- - website_banners
-- - website_announcements
-- - platform_settings
-- - system_settings
-- - system_backups

COMMIT;
