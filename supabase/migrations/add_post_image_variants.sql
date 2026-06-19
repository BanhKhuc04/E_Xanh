-- Add image variants and metadata columns to posts table
ALTER TABLE posts
ADD COLUMN IF NOT EXISTS cover_thumb_url text,
ADD COLUMN IF NOT EXISTS cover_card_url text,
ADD COLUMN IF NOT EXISTS cover_detail_url text,
ADD COLUMN IF NOT EXISTS cover_width int,
ADD COLUMN IF NOT EXISTS cover_height int,
ADD COLUMN IF NOT EXISTS cover_aspect_ratio text;

-- Add avatar_webp to profiles if we want to store optimized avatar explicitly,
-- although avatar_url could just point to the optimized version.
-- ALTER TABLE profiles
-- ADD COLUMN IF NOT EXISTS avatar_webp_url text;

-- Banners could also have variants if we have a separate table.
