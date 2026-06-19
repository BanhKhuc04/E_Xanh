import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp'; // Assuming sharp is available since it's a Node script

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Lỗi: Thiếu VITE_SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY.');
  console.error('Vui lòng cung cấp service role key để có quyền chạy migration ảnh.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const args = process.argv.slice(2);
const isDryRun = !args.includes('--apply');
const limitArg = args.find(a => a.startsWith('--limit='));
const LIMIT = limitArg ? parseInt(limitArg.split('=')[1], 10) : 20;

const VARIANTS = {
  thumb: 360,
  card: 900,
  detail: 1440
};

async function processPost(post) {
  console.log(`\nĐang xử lý post ID: ${post.id}`);
  
  if (isDryRun) {
    console.log(`[DRY RUN] Bỏ qua tải ảnh và upload cho ${post.id}`);
    return true;
  }

  try {
    const response = await fetch(post.image_url);
    if (!response.ok) {
      console.error(`Không thể tải ảnh: ${post.image_url}`);
      return false;
    }

    const buffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(buffer);
    
    // Get metadata
    const metadata = await sharp(imageBuffer).metadata();
    const { width: originalWidth, height: originalHeight } = metadata;
    const aspectRatio = `${originalWidth}/${originalHeight}`;

    const timestamp = Date.now();
    const uploadedUrls = {};

    for (const [key, targetWidth] of Object.entries(VARIANTS)) {
      const resizeWidth = Math.min(originalWidth, targetWidth);
      const resizeHeight = Math.round(originalHeight * (resizeWidth / originalWidth));
      
      const optimizedBuffer = await sharp(imageBuffer)
        .resize(resizeWidth, resizeHeight)
        .webp({ quality: 85 })
        .toBuffer();

      const filePath = `posts/${post.id}/${key}-${timestamp}.webp`;

      const { data, error } = await supabase.storage
        .from('post-images')
        .upload(filePath, optimizedBuffer, {
          contentType: 'image/webp',
          upsert: false
        });

      if (error) {
        console.error(`Lỗi upload variant ${key}:`, error);
        return false;
      }

      const { data: publicUrlData } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);

      uploadedUrls[`cover_${key}_url`] = publicUrlData.publicUrl;
    }

    // Update database
    const { error: updateError } = await supabase
      .from('posts')
      .update({
        ...uploadedUrls,
        cover_width: originalWidth,
        cover_height: originalHeight,
        cover_aspect_ratio: aspectRatio
      })
      .eq('id', post.id);

    if (updateError) {
      console.error('Lỗi cập nhật DB:', updateError);
      return false;
    }

    console.log(`Thành công! Đã tạo các variant cho bài viết ${post.id}.`);
    return true;

  } catch (err) {
    console.error('Lỗi khi xử lý ảnh:', err);
    return false;
  }
}

async function run() {
  console.log('=== BẮT ĐẦU MIGRATE ẢNH CŨ ===');
  if (isDryRun) {
    console.log('Chế độ: DRY RUN (Chỉ hiển thị, không thay đổi DB)');
  } else {
    console.log('Chế độ: APPLY (Sẽ thay đổi DB và Storage)');
  }
  console.log(`Giới hạn: ${LIMIT} bài viết\n`);

  // Lấy các bài viết có ảnh nhưng chưa có cover_card_url
  const { data: posts, error } = await supabase
    .from('posts')
    .select('id, image_url')
    .not('image_url', 'is', null)
    .is('cover_card_url', null)
    .limit(LIMIT);

  if (error) {
    console.error('Lỗi truy vấn posts:', error);
    process.exit(1);
  }

  if (!posts || posts.length === 0) {
    console.log('Không có bài viết nào cần migrate.');
    return;
  }

  console.log(`Tìm thấy ${posts.length} bài viết cần xử lý.`);

  let successCount = 0;
  let failCount = 0;

  for (const post of posts) {
    // Basic URL check
    if (!post.image_url.startsWith('http')) {
      console.log(`Bỏ qua URL không hợp lệ: ${post.image_url}`);
      failCount++;
      continue;
    }

    const success = await processPost(post);
    if (success) successCount++;
    else failCount++;
  }

  console.log('\n=== TỔNG KẾT ===');
  console.log(`Thành công: ${successCount}`);
  console.log(`Thất bại: ${failCount}`);
}

run();
