-- ============================================
-- ANTI-SPAM & RATE LIMIT (Bài viết và Bình luận)
-- Hỗ trợ Cảnh cáo 30 phút lần 1, Khóa vĩnh viễn lần 2
-- ============================================

-- 1. Thêm cột spam_strikes vào profiles để theo dõi vi phạm
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS spam_strikes INT NOT NULL DEFAULT 0;

-- 2. Sửa admin_action_logs để cho phép Hệ thống (System) ghi log (admin_id = NULL)
ALTER TABLE public.admin_action_logs ALTER COLUMN admin_id DROP NOT NULL;

-- 3. Tạo bảng danh sách đen IP (banned_ips) với expires_at cho phép cấm tạm thời
CREATE TABLE IF NOT EXISTS public.banned_ips (
  ip TEXT PRIMARY KEY,
  reason TEXT,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  expires_at TIMESTAMPTZ, -- Nếu NULL là cấm vĩnh viễn
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.banned_ips ENABLE ROW LEVEL SECURITY;

-- Chỉ Admin và Moderator mới được xem danh sách IP bị cấm
DROP POLICY IF EXISTS "banned_ips_admin_select" ON public.banned_ips;
CREATE POLICY "banned_ips_admin_select"
  ON public.banned_ips
  FOR SELECT
  TO authenticated
  USING (public.is_admin_or_moderator());

-- Không ai được INSERT/UPDATE trực tiếp từ client (Chỉ hệ thống xử lý qua Trigger SECURITY DEFINER)

-- 4. Tạo Hàm Trigger chống Spam
CREATE OR REPLACE FUNCTION public.check_spam_and_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
  client_ip TEXT;
  recent_count INT;
  threshold INT;
  time_window INTERVAL := '1 minute';
  v_status TEXT;
  v_banned_at TIMESTAMPTZ;
  v_strikes INT;
  ip_ban_record RECORD;
  target_user_id UUID;
BEGIN
  -- Cố gắng lấy IP thực từ Header x-forwarded-for
  BEGIN
    client_ip := split_part(current_setting('request.headers', true)::json->>'x-forwarded-for', ',', 1);
  EXCEPTION WHEN OTHERS THEN
    client_ip := NULL;
  END;
  
  -- Nếu không có client IP, bỏ qua check IP (nhưng vẫn check user spam)
  IF client_ip IS NULL OR client_ip = '' THEN
    RETURN NEW;
  END IF;

  -- Thiết lập thông số dựa vào bảng
  IF TG_TABLE_NAME = 'posts' THEN
    threshold := 5; -- Tối đa 5 bài viết / phút
    target_user_id := NEW.author_id;
  ELSIF TG_TABLE_NAME = 'comments' THEN
    threshold := 10; -- Tối đa 10 bình luận / phút
    target_user_id := NEW.user_id;
  ELSE
    RETURN NEW;
  END IF;

  -- KIỂM TRA IP BỊ KHÓA
  SELECT * INTO ip_ban_record FROM public.banned_ips WHERE ip = client_ip;
  IF FOUND THEN
    IF ip_ban_record.expires_at IS NULL THEN
      RAISE EXCEPTION 'Hệ thống: Từ chối. Địa chỉ IP của bạn đã bị khóa vĩnh viễn do lạm dụng/spam.';
    ELSIF ip_ban_record.expires_at > now() THEN
      RAISE EXCEPTION 'Hệ thống: Từ chối. Địa chỉ IP của bạn đang bị khóa tạm thời đến %.', to_char(ip_ban_record.expires_at AT TIME ZONE 'Asia/Ho_Chi_Minh', 'HH24:MI DD/MM/YYYY');
    ELSE
      -- Đã hết hạn khóa IP, xóa khỏi danh sách đen
      DELETE FROM public.banned_ips WHERE ip = client_ip;
    END IF;
  END IF;

  -- LẤY THÔNG TIN TÀI KHOẢN VÀ KIỂM TRA KHÓA
  SELECT status, banned_at, COALESCE(spam_strikes, 0) INTO v_status, v_banned_at, v_strikes 
  FROM public.profiles WHERE id = target_user_id;

  IF v_status = 'blocked' THEN
    RAISE EXCEPTION 'Hệ thống: Từ chối. Tài khoản của bạn đã bị khóa vĩnh viễn.';
  ELSIF v_status = 'locked' THEN
    IF v_banned_at > now() - interval '30 minutes' THEN
      RAISE EXCEPTION 'Hệ thống: Từ chối. Tài khoản của bạn đang bị khóa cảnh cáo 30 phút do hành vi spam trước đó.';
    ELSE
      -- Đã hết 30 phút cảnh cáo, mở lại tài khoản tạm thời để cho phép thao tác này đi tiếp
      UPDATE public.profiles SET status = 'active' WHERE id = target_user_id;
      v_status := 'active';
    END IF;
  END IF;

  -- ĐẾM HÀNH ĐỘNG GẦN ĐÂY ĐỂ PHÁT HIỆN SPAM
  IF TG_TABLE_NAME = 'posts' THEN
    SELECT count(*) INTO recent_count FROM public.posts 
    WHERE author_id = target_user_id AND created_at > now() - time_window;
  ELSIF TG_TABLE_NAME = 'comments' THEN
    SELECT count(*) INTO recent_count FROM public.comments 
    WHERE user_id = target_user_id AND created_at > now() - time_window;
  END IF;

  -- XỬ LÝ NẾU VƯỢT NGƯỠNG (PHÁT HIỆN SPAM)
  IF recent_count >= threshold THEN
    IF v_strikes = 0 THEN
      -- LẦN 1: Cảnh cáo 30 phút
      INSERT INTO public.banned_ips (ip, reason, user_id, expires_at) 
      VALUES (client_ip, 'Cảnh cáo: Spam ' || TG_TABLE_NAME, target_user_id, now() + interval '30 minutes')
      ON CONFLICT (ip) DO UPDATE SET expires_at = now() + interval '30 minutes', reason = EXCLUDED.reason;
      
      UPDATE public.profiles 
      SET status = 'locked', 
          banned_at = now(),
          spam_strikes = 1,
          ban_reason = 'Cảnh cáo: Khóa tạm thời 30 phút do spam ' || TG_TABLE_NAME
      WHERE id = target_user_id;
      
      INSERT INTO public.admin_action_logs (action, target_type, target_id, metadata)
      VALUES (
        'system_auto_warn', 'profiles', target_user_id::text, 
        jsonb_build_object('ip', client_ip, 'reason', 'Spam lần 1: Khóa 30p (' || recent_count || '/' || threshold || ' trên phút ở ' || TG_TABLE_NAME || ')')
      );
              
      RAISE EXCEPTION 'Hệ thống phát hiện bạn thao tác quá nhanh. Tài khoản và IP của bạn bị tạm khóa 30 phút để cảnh cáo. Nếu tái phạm sẽ bị khóa vĩnh viễn.';
    
    ELSE
      -- LẦN 2 TRỞ LÊN: Khóa vĩnh viễn
      INSERT INTO public.banned_ips (ip, reason, user_id, expires_at) 
      VALUES (client_ip, 'Khóa vĩnh viễn: Tái phạm Spam ' || TG_TABLE_NAME, target_user_id, NULL)
      ON CONFLICT (ip) DO UPDATE SET expires_at = NULL, reason = EXCLUDED.reason;
      
      UPDATE public.profiles 
      SET status = 'blocked', 
          banned_at = now(),
          spam_strikes = v_strikes + 1,
          ban_reason = 'Khóa vĩnh viễn: Tiếp tục spam sau khi đã bị cảnh cáo (' || TG_TABLE_NAME || ')'
      WHERE id = target_user_id;
      
      INSERT INTO public.admin_action_logs (action, target_type, target_id, metadata)
      VALUES (
        'system_auto_ban', 'profiles', target_user_id::text, 
        jsonb_build_object('ip', client_ip, 'reason', 'Tái phạm spam: Khóa vĩnh viễn (' || recent_count || '/' || threshold || ' trên phút ở ' || TG_TABLE_NAME || ')')
      );
              
      RAISE EXCEPTION 'Hệ thống phát hiện hành vi spam tái phạm. Tài khoản và IP của bạn đã bị khóa vĩnh viễn. Vui lòng liên hệ Admin.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Áp dụng Trigger vào bảng posts và comments
DROP TRIGGER IF EXISTS trg_anti_spam_posts ON public.posts;
CREATE TRIGGER trg_anti_spam_posts
  BEFORE INSERT ON public.posts
  FOR EACH ROW
  EXECUTE FUNCTION public.check_spam_and_rate_limit();

DROP TRIGGER IF EXISTS trg_anti_spam_comments ON public.comments;
CREATE TRIGGER trg_anti_spam_comments
  BEFORE INSERT ON public.comments
  FOR EACH ROW
  EXECUTE FUNCTION public.check_spam_and_rate_limit();
