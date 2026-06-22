-- Thêm cột reaction_type vào bảng post_likes
ALTER TABLE post_likes 
ADD COLUMN IF NOT EXISTS reaction_type VARCHAR(20) DEFAULT 'like';
