export const postCategories = [
  'Tất cả',
  'Điều hòa',
  'Laptop',
  'Tủ lạnh',
  'Thiết bị điện',
  'Thói quen',
]

export const postSortOptions = [
  'Mới nhất',
  'Nhiều lượt lưu',
  'Nhiều tương tác',
]

const postContentMap = {
  '5-cach-dung-dieu-hoa-tiet-kiem-dien-mua-nong': {
    sections: [
      {
        heading: '1) Đặt nhiệt độ từ 26–28°C',
        body:
          'Mức nhiệt độ lý tưởng để tiết kiệm điện mà vẫn đảm bảo sức khỏe là từ 26 đến 28 độ C. Việc hạ nhiệt độ xuống quá thấp sẽ khiến điều hòa phải hoạt động mạnh hơn và làm hóa đơn điện tăng nhanh.',
      },
      {
        heading: '2. Kết hợp quạt',
        body:
          'Sử dụng thêm quạt trần hoặc quạt cây giúp luồng khí lạnh lan tỏa đều hơn trong phòng. Nhờ đó bạn vẫn thấy dễ chịu dù cài điều hòa ở mức nhiệt cao hơn.',
      },
      {
        heading: '3. Đóng kín cửa',
        body:
          'Đảm bảo phòng kín gió để hơi lạnh không thất thoát ra ngoài. Rèm cửa, gioăng cửa và việc hạn chế mở cửa thường xuyên đều giúp điều hòa đỡ tốn điện hơn.',
      },
      {
        heading: '4. Vệ sinh bộ lọc',
        body:
          'Bộ lọc bụi bẩn làm giảm hiệu suất làm lạnh và khiến máy phải chạy lâu hơn. Hãy vệ sinh lưới lọc định kỳ mỗi tháng và bảo dưỡng tổng thể vài lần mỗi năm.',
      },
      {
        heading: '5. Tắt trước khi ra ngoài',
        body:
          'Nếu chuẩn bị rời phòng, bạn có thể tắt điều hòa trước khoảng 20 đến 30 phút. Nhiệt độ trong phòng vẫn còn dễ chịu trong một khoảng thời gian ngắn và bạn sẽ tiết kiệm được điện.',
      },
    ],
    quickTip:
      'Hãy sử dụng chế độ Cool thay vì Dry trong những ngày nhiệt độ cao thực sự, vì chế độ Dry chỉ hiệu quả khi độ ẩm cao.',
    comments: [
      {
        id: 'comment-1',
        author: 'Minh Tuấn',
        time: '2 giờ trước',
        content:
          'Mình hay dùng cách kết hợp quạt, công nhận thấy mát nhanh hơn hẳn mà điều hòa chỉ cần để 28 độ là đủ.',
        likes: 12,
      },
      {
        id: 'comment-2',
        author: 'Lan Anh',
        time: '5 giờ trước',
        content:
          'Bài viết rất hữu ích. Tháng trước nhà mình quên vệ sinh lưới lọc, tiền điện tăng vọt, tháng này rút kinh nghiệm ngay.',
        likes: 8,
      },
    ],
  },
}

const fallbackSections = [
  {
    heading: '1. Quan sát thiết bị đang dùng',
    body:
      'Hãy bắt đầu từ việc nhận biết thiết bị nào đang tiêu thụ điện nhiều nhất trong sinh hoạt hằng ngày để ưu tiên thay đổi đúng chỗ.',
  },
  {
    heading: '2. Điều chỉnh thói quen nhỏ',
    body:
      'Những thay đổi nhỏ như tắt thiết bị khi không dùng, rút sạc đúng lúc hoặc bật đúng chế độ có thể mang lại hiệu quả lớn sau một tháng.',
  },
  {
    heading: '3. Theo dõi kết quả mỗi tuần',
    body:
      'Việc ghi chú mức tiêu thụ hoặc tự đánh giá theo tuần sẽ giúp bạn duy trì thói quen tốt và nhìn thấy kết quả rõ ràng hơn.',
  },
]

const fallbackComments = [
  {
    id: 'fallback-comment-1',
    author: 'Khánh Linh',
    time: '1 ngày trước',
    content: 'Mẹo này dễ áp dụng thật, mình sẽ thử ngay trong tuần này.',
    likes: 6,
  },
  {
    id: 'fallback-comment-2',
    author: 'Đức Minh',
    time: '2 ngày trước',
    content: 'Phần giải thích rất rõ ràng, đọc xong thấy dễ hình dung hơn nhiều.',
    likes: 4,
  },
]

export const posts = [
  {
    id: 1,
    title: '5 cách dùng điều hòa tiết kiệm điện mùa nóng',
    slug: '5-cach-dung-dieu-hoa-tiet-kiem-dien-mua-nong',
    description:
      'Áp dụng ngay những mẹo nhỏ này để giảm tải cho điều hòa và tiết kiệm đáng kể chi phí điện năng trong những ngày hè oi bức.',
    category: 'Điều hòa',
    image:
      '/images/fallback-green.jpg',
    author: 'E-XANH Team',
    date: '12/05/2024',
    readTime: '5 phút đọc',
    likes: 124,
    comments: 28,
    savedCount: 89,
    status: 'published',
    authorBio:
      'Chia sẻ kiến thức sử dụng điện an toàn, tiết kiệm và lối sống xanh bền vững.',
  },
  {
    id: 2,
    title: 'Sạc laptop qua đêm có thật sự tốn điện?',
    slug: 'sac-laptop-qua-dem-co-that-su-ton-dien',
    description:
      'Sự thật về việc cắm sạc laptop liên tục và những cách tối ưu hóa pin để vừa tiết kiệm điện vừa kéo dài tuổi thọ thiết bị.',
    category: 'Laptop',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    author: 'Minh Hải',
    date: '10/05/2024',
    readTime: '5 phút đọc',
    likes: 89,
    comments: 15,
    savedCount: 144,
    status: 'published',
    authorBio:
      'Chia sẻ góc nhìn thực tế về thiết bị học tập, pin laptop và các thói quen công nghệ tiết kiệm điện.',
  },
  {
    id: 3,
    title: 'Tắt thiết bị ở chế độ chờ có tiết kiệm không?',
    slug: 'tat-thiet-bi-o-che-do-cho-co-tiet-kiem-khong',
    description:
      "Tìm hiểu lượng điện năng tiêu thụ 'ngầm' của các thiết bị gia dụng và cách xử lý hiệu quả để tránh hao phí mỗi ngày.",
    category: 'Thiết bị điện',
    image:
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    author: 'Lan Trinh',
    date: '08/05/2024',
    readTime: '3 phút đọc',
    likes: 210,
    comments: 45,
    savedCount: 232,
    status: 'published',
    authorBio:
      'Lan Trinh tập trung vào những mẹo nhỏ nhưng thực tế giúp sinh viên giảm lãng phí điện từ các thiết bị dùng hằng ngày.',
  },
  {
    id: 4,
    title: 'Cách đặt tủ lạnh giúp giảm hao phí điện',
    slug: 'cach-dat-tu-lanh-giup-giam-hao-phi-dien',
    description:
      'Vị trí đặt tủ lạnh ảnh hưởng lớn đến khả năng tản nhiệt và mức tiêu thụ điện. Cùng tìm hiểu vị trí tối ưu nhất.',
    category: 'Tủ lạnh',
    image:
      '/images/fallback-green.jpg',
    author: 'E-XANH Team',
    date: '05/05/2024',
    readTime: '4 phút đọc',
    likes: 156,
    comments: 32,
    savedCount: 198,
    status: 'published',
    authorBio:
      'Nhóm E-XANH tổng hợp các giải pháp dễ áp dụng để giữ bếp gọn, lạnh đều và tiết kiệm điện hơn.',
  },
  {
    id: 5,
    title: 'Checklist 30 giây trước khi rời phòng',
    slug: 'checklist-30-giay-truoc-khi-roi-phong',
    description:
      'Một checklist cực ngắn nhưng rất hiệu quả giúp bạn tránh quên tắt đèn, quạt, sạc và các thiết bị tiêu thụ điện không cần thiết.',
    category: 'Thói quen',
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    author: 'Hoài Nam',
    date: '02/05/2024',
    readTime: '2 phút đọc',
    likes: 95,
    comments: 18,
    savedCount: 268,
    status: 'published',
    authorBio:
      'Hoài Nam yêu thích việc biến các mẹo tiết kiệm điện thành checklist ngắn, dễ nhớ và áp dụng mỗi ngày.',
  },
  {
    id: 6,
    title: 'Những thói quen nhỏ giúp giảm hóa đơn điện mỗi tháng',
    slug: 'nhung-thoi-quen-nho-giup-giam-hoa-don-dien-moi-thang',
    description:
      'Thay đổi những thói quen đơn giản hàng ngày có thể mang lại hiệu quả bất ngờ cho túi tiền của bạn và duy trì lối sống xanh lâu dài.',
    category: 'Thói quen',
    image:
      'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    author: 'E-XANH Team',
    date: '28/04/2024',
    readTime: '6 phút đọc',
    likes: 342,
    comments: 56,
    savedCount: 301,
    status: 'published',
    authorBio:
      'E-XANH Team tập trung vào những thay đổi đơn giản nhưng bền vững để việc tiết kiệm điện trở thành thói quen tự nhiên.',
  },
].map((post) => {
  const detail = postContentMap[post.slug]

  return {
    ...post,
    contentSections: detail?.sections ?? fallbackSections,
    quickTip:
      detail?.quickTip ??
      'Ưu tiên theo dõi thói quen dùng điện trong một tuần để biết thay đổi nào đang đem lại hiệu quả rõ rệt nhất.',
    commentItems: detail?.comments ?? fallbackComments,
  }
})

export const featuredTopics = [
  'Điều hòa',
  'Tủ lạnh',
  'Máy giặt',
  'Thiết bị gia dụng',
  'Laptop',
  'Thói quen',
  'Mùa nắng nóng',
]

export const todaySuggestion = {
  title: 'Gợi ý hôm nay',
  content:
    'Đặt điều hòa ở 26-28°C và kết hợp sử dụng quạt gió. Mỗi độ C tăng lên giúp bạn tiết kiệm khoảng 10% điện năng tiêu thụ.',
}

export const savedHighlights = [
  {
    id: 'saved-1',
    title: 'Mẹo rã đông tủ lạnh đúng cách không tốn điện',
    savedCount: 452,
    icon: 'TL',
  },
  {
    id: 'saved-2',
    title: 'Sử dụng máy nước nóng lạnh sao cho hiệu quả?',
    savedCount: 389,
    icon: 'MN',
  },
  {
    id: 'saved-3',
    title: 'Lượng quần áo tối ưu cho mỗi mẻ giặt',
    savedCount: 315,
    icon: 'MG',
  },
]

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug)
}

const savedPostMeta = {
  '5-cach-dung-dieu-hoa-tiet-kiem-dien-mua-nong': {
    savedAt: 'Đã lưu 2 ngày trước',
    savedType: 'Mẹo tiết kiệm',
    recentReadAt: 'Đọc 2 giờ trước',
    savedCategoryLabel: 'Mẹo hay',
  },
  'sac-laptop-qua-dem-co-that-su-ton-dien': {
    savedAt: 'Đã lưu 3 ngày trước',
    savedType: 'Cộng đồng',
    recentReadAt: 'Đọc 3 ngày trước',
    savedCategoryLabel: 'Giải đáp',
  },
  'checklist-30-giay-truoc-khi-roi-phong': {
    savedAt: 'Đã lưu 5 ngày trước',
    savedType: 'Đã đọc gần đây',
    recentReadAt: 'Đọc hôm qua',
    savedCategoryLabel: 'Thói quen',
  },
  'cach-dat-tu-lanh-giup-giam-hao-phi-dien': {
    savedAt: 'Đã lưu 1 tuần trước',
    savedType: 'Review thiết bị',
    recentReadAt: 'Đọc 5 ngày trước',
    savedCategoryLabel: 'Thiết bị',
  },
  'tat-thiet-bi-o-che-do-cho-co-tiet-kiem-khong': {
    savedAt: 'Đã lưu 2 tuần trước',
    savedType: 'Review thiết bị',
    recentReadAt: 'Đọc 1 tuần trước',
    savedCategoryLabel: 'Kiến thức',
  },
  'nhung-thoi-quen-nho-giup-giam-hoa-don-dien-moi-thang': {
    savedAt: 'Đã lưu 1 tháng trước',
    savedType: 'Mẹo tiết kiệm',
    recentReadAt: 'Đọc 2 tuần trước',
    savedCategoryLabel: 'Sống xanh',
  },
}

export const savedFilterChips = [
  'Tất cả',
  'Mẹo tiết kiệm',
  'Cộng đồng',
  'Review thiết bị',
  'Đã đọc gần đây',
]

export const savedSortOptions = ['Mới lưu nhất', 'Cũ nhất', 'Nhiều lượt thích']

export const savedPosts = posts
  .filter((post) => savedPostMeta[post.slug])
  .map((post) => ({
    ...post,
    ...savedPostMeta[post.slug],
  }))

export const savedFolderSummary = [
  { id: 'all', label: 'Tất cả bài lưu', count: 12, isActive: true },
  { id: 'tips', label: 'Mẹo tiết kiệm', count: 5 },
  { id: 'community', label: 'Cộng đồng', count: 3 },
  { id: 'review', label: 'Review thiết bị', count: 2 },
  { id: 'later', label: 'Đọc sau', count: 2 },
]

export const savedRecentlyRead = [
  savedPosts[0],
  savedPosts[2],
  savedPosts[1],
].filter(Boolean)
