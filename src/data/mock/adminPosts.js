export const postStatusMap = {
  pending: { label: 'Chờ duyệt', className: 'is-pending' },
  approved: { label: 'Đã duyệt', className: 'is-approved' },
  rejected: { label: 'Bị từ chối', className: 'is-rejected' },
  blocked: { label: 'Đã khóa', className: 'is-hidden' },
}

export const postCategories = [
  'Tất cả',
  'Mẹo tiết kiệm',
  'Cộng đồng',
  'Hỏi đáp',
  'Review thiết bị',
]

export const postStatusOptions = [
  'Tất cả',
  'Chờ duyệt',
  'Đã duyệt',
  'Bị từ chối',
  'Đã khóa',
]

export const postDateOptions = [
  'Tất cả',
  'Hôm nay',
  '7 ngày qua',
  'Tháng này',
]

export const adminPostStats = [
  {
    label: 'Chờ duyệt',
    value: 18,
    icon: 'pending',
    accent: 'warning',
  },
  {
    label: 'Đã duyệt',
    value: 126,
    icon: 'approved',
    accent: 'success',
  },
  {
    label: 'Bị từ chối',
    value: 9,
    icon: 'rejected',
    accent: 'muted',
  },
  {
    label: 'Bài mới hôm nay',
    value: 5,
    icon: 'today',
    accent: 'highlight',
  },
]

export const adminPosts = [
  {
    id: 'post-001',
    title: '5 cách dùng điều hòa tiết kiệm điện mùa nóng',
    author: 'Nguyễn Văn A',
    type: 'Mẹo tiết kiệm',
    category: 'Mẹo tiết kiệm',
    submittedAt: '2026-06-07',
    status: 'pending',
    thumbnail: 'https://images.unsplash.com/photo-1631545806609-3c480b4bb12a?w=400&h=260&fit=crop',
    description:
      'Hướng dẫn 5 mẹo đơn giản giúp giảm hóa đơn điện khi sử dụng điều hòa vào mùa hè nóng bức, phù hợp cho phòng trọ và căn hộ nhỏ.',
    contentPreview:
      'Mùa hè đến, điều hòa trở thành thiết bị không thể thiếu. Tuy nhiên, nhiều người lo lắng về hóa đơn tiền điện tăng vọt. Dưới đây là 5 cách đơn giản giúp bạn vừa mát mẻ vừa tiết kiệm:\n\n1. Đặt nhiệt độ 26–28°C thay vì 18–20°C\n2. Vệ sinh lưới lọc định kỳ mỗi 2 tuần\n3. Đóng kín cửa khi bật điều hòa\n4. Dùng quạt kết hợp để phân bổ khí mát\n5. Hẹn giờ tắt tự động khi ngủ',
    likes: 42,
    comments: 8,
  },
  {
    id: 'post-002',
    title: 'Có nên rút sạc laptop khi pin đầy?',
    author: 'Lan Anh',
    type: 'Hỏi đáp',
    category: 'Hỏi đáp',
    submittedAt: '2026-06-06',
    status: 'pending',
    thumbnail: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=260&fit=crop',
    description:
      'Giải đáp thắc mắc phổ biến về việc rút sạc laptop có thực sự cần thiết và giúp tiết kiệm điện hay không.',
    contentPreview:
      'Nhiều bạn sinh viên thắc mắc: "Có nên rút sạc laptop khi pin đầy 100%?" Thực tế, laptop hiện đại có mạch bảo vệ ngắt sạc khi đầy pin. Tuy nhiên, việc cắm sạc liên tục vẫn tạo ra mức tiêu thụ điện "chờ" khoảng 3-5W. Trong 1 tháng, con số này tuy nhỏ nhưng nếu cả ký túc xá thực hiện, sẽ tiết kiệm đáng kể.',
    likes: 31,
    comments: 15,
  },
  {
    id: 'post-003',
    title: 'Checklist 30 giây trước khi rời phòng',
    author: 'Minh Tuấn',
    type: 'Cộng đồng',
    category: 'Cộng đồng',
    submittedAt: '2026-06-05',
    status: 'pending',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=260&fit=crop',
    description:
      'Chia sẻ checklist nhanh 30 giây giúp tiết kiệm điện mỗi khi rời khỏi phòng, đặc biệt dành cho sinh viên ở trọ.',
    contentPreview:
      'Trước khi bước ra khỏi phòng, hãy dành 30 giây kiểm tra:\n\n✅ Tắt đèn\n✅ Tắt quạt / điều hòa\n✅ Rút sạc điện thoại & laptop\n✅ Tắt màn hình máy tính\n✅ Kiểm tra bếp điện / nồi cơm\n✅ Đóng cửa sổ nếu bật điều hòa\n\nChỉ 30 giây nhưng giúp bạn tiết kiệm hàng trăm nghìn đồng mỗi tháng!',
    likes: 56,
    comments: 12,
  },
  {
    id: 'post-004',
    title: 'Cách đặt tủ lạnh giúp giảm hao phí điện',
    author: 'Hoàng Tuấn',
    type: 'Mẹo tiết kiệm',
    category: 'Mẹo tiết kiệm',
    submittedAt: '2026-06-03',
    status: 'approved',
    thumbnail: 'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=260&fit=crop',
    description:
      'Vị trí đặt tủ lạnh ảnh hưởng lớn đến mức tiêu thụ điện. Bài viết hướng dẫn cách đặt tủ lạnh tối ưu nhất.',
    contentPreview:
      'Tủ lạnh là thiết bị chạy 24/7 nên vị trí đặt rất quan trọng. Một số nguyên tắc:\n\n• Đặt cách tường ít nhất 10cm để tản nhiệt tốt\n• Tránh đặt gần bếp, lò nướng hoặc nơi có ánh nắng trực tiếp\n• Không đặt ở nơi quá chật, bí gió\n• Để tủ trên mặt phẳng, không nghiêng\n\nChỉ cần thay đổi vị trí tủ lạnh, bạn có thể giảm 10-15% điện năng tiêu thụ.',
    likes: 78,
    comments: 20,
  },
  {
    id: 'post-005',
    title: 'Thiết bị nào trong phòng trọ tốn điện nhất?',
    author: 'Minh Đức',
    type: 'Review thiết bị',
    category: 'Review thiết bị',
    submittedAt: '2026-06-01',
    status: 'rejected',
    thumbnail: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=260&fit=crop',
    description:
      'Phân tích chi tiết top thiết bị tiêu tốn điện năng nhiều nhất trong phòng trọ sinh viên.',
    contentPreview:
      'Mình đã đo thực tế mức tiêu thụ của các thiết bị phổ biến trong phòng trọ:\n\n🔌 Điều hòa: ~1.000W (chiếm 40-50% hóa đơn)\n🔌 Bình nóng lạnh: ~2.500W (dùng 30 phút/ngày)\n🔌 Tủ lạnh mini: ~80W (chạy 24/7)\n🔌 Laptop: ~60W (8 tiếng/ngày)\n🔌 Quạt điện: ~50W\n🔌 Đèn LED: ~10W\n\nKết luận: Điều hòa và bình nóng lạnh là 2 "thủ phạm" chính.',
    likes: 95,
    comments: 34,
  },
]
