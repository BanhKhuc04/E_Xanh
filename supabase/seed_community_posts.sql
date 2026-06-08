-- Chạy script này trong Supabase SQL Editor để tạo dữ liệu mẫu cho trang Cộng Đồng
-- Yêu cầu: Đã có ít nhất 1 tài khoản đăng ký trên hệ thống (có dữ liệu trong bảng profiles)

DO $$
DECLARE
  v_author_id UUID;
BEGIN
  -- Lấy 1 user đầu tiên từ bảng profiles để làm tác giả bài viết
  SELECT id INTO v_author_id FROM public.profiles LIMIT 1;
  
  IF v_author_id IS NULL THEN
    RAISE EXCEPTION 'Không tìm thấy user nào trong bảng profiles. Vui lòng đăng ký 1 tài khoản (hoặc đăng nhập) trước khi chạy seed data.';
  END IF;

  -- Insert bài 1
  INSERT INTO public.posts (author_id, title, slug, description, content, type, status, published_at, likes_count, comments_count)
  VALUES (
    v_author_id,
    'Cách làm phân bón hữu cơ tại nhà siêu đơn giản',
    'cach-lam-phan-bon-huu-co-tai-nha-' || substring(md5(random()::text) from 1 for 6),
    'Chỉ với rác thải nhà bếp như vỏ hoa quả, rau thừa... bạn có thể tự làm phân bón hữu cơ an toàn cho vườn rau nhỏ của mình.',
    'Nội dung chi tiết cách làm phân bón hữu cơ: <br/><br/>Bước 1: Chuẩn bị một thùng xốp có đục lỗ thoát nước.<br/>Bước 2: Thu gom vỏ trái cây, gốc rau, vỏ trứng...<br/>Bước 3: Trộn đều rác nhà bếp với đất mầu theo tỷ lệ 1:1, thêm một ít men vi sinh (nếu có).<br/>Bước 4: Đậy kín thùng và ủ trong 2-3 tuần. Bạn sẽ có một lớp mùn hữu cơ cực tốt cho cây trồng.',
    'community',
    'approved',
    now() - interval '2 hours',
    12,
    0
  );

  -- Insert bài 2
  INSERT INTO public.posts (author_id, title, slug, description, content, type, status, image_url, published_at, likes_count, comments_count)
  VALUES (
    v_author_id,
    'Khoe góc xanh ban công sau 1 tháng chăm sóc',
    'khoe-goc-xanh-ban-cong-' || substring(md5(random()::text) from 1 for 6),
    'Chào cả nhà, hôm nay mình xin phép khoe thành quả ban công xanh mướt sau những ngày cày cuốc.',
    'Sau 1 tháng áp dụng các mẹo trồng cây trên E-XANH, ban công nhà mình đã phủ một màu xanh mát rượi. Mình ưu tiên các loại cây dễ trồng như Trầu bà, Lưỡi hổ và một ít rau thơm ăn lá. Cảm giác mỗi buổi sáng ra tưới cây thật sự rất "chữa lành" mọi người ạ!',
    'community',
    'approved',
    'https://images.unsplash.com/photo-1585320806297-9794b3e4ce88?auto=format&fit=crop&w=800&q=80',
    now() - interval '1 day',
    34,
    0
  );

  -- Insert bài 3
  INSERT INTO public.posts (author_id, title, slug, description, content, type, status, published_at, likes_count, comments_count)
  VALUES (
    v_author_id,
    'Gợi ý 5 thói quen giúp giảm rác thải nhựa khi đi siêu thị',
    'giam-rac-thai-nhua-khi-di-sieu-thi-' || substring(md5(random()::text) from 1 for 6),
    'Mang theo túi vải, hạn chế mua đồ đóng gói sẵn hay chọn các sản phẩm dùng hộp thủy tinh/giấy là những mẹo rất hay.',
    'Hàng tuần đi siêu thị là dịp nhà mình thải ra nhiều rác thải nhựa nhất. Sau một thời gian tìm hiểu, mình đúc kết được vài thói quen nhỏ này:<br/>1. Luôn để sẵn 2-3 chiếc túi vải tote trong cốp xe máy.<br/>2. Mang theo hộp nhựa tái sử dụng để đựng thịt cá (một số siêu thị có hỗ trợ trừ bì).<br/>3. Từ chối lấy túi nilon nhỏ đựng rau củ nếu không quá cần thiết.<br/>4. Ưu tiên mua sữa tươi chai giấy thay vì chai nhựa.<br/>5. Tránh mua các loại quả gọt sẵn bọc màng bọc thực phẩm nilon.<br/>Mọi người có mẹo nào khác không, chia sẻ với mình nhé!',
    'community',
    'approved',
    now() - interval '3 days',
    56,
    0
  );

  RAISE NOTICE 'Đã chèn thành công 3 bài viết mẫu vào bảng posts.';
END $$;
