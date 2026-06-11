export const communityFilters = [
  'Tất cả',
  'Mới nhất',
  'Nhiều tương tác',
  'Hỏi đáp',
  'Kinh nghiệm',
  'Đã lưu nhiều',
]

export const communityHero = {
  badge: 'Không gian chia sẻ sống xanh',
  title: 'Cộng đồng E-XANH',
  description:
    'Chia sẻ kinh nghiệm tiết kiệm điện, đặt câu hỏi, lưu lại mẹo hữu ích và cùng lan tỏa thói quen sống xanh mỗi ngày.',
  image:
    '/images/fallback-green.jpg',
}

export const communityPosts = [
  {
    id: 'community-1',
    author: 'Minh Tuấn',
    avatar:
      '/images/fallback-green.jpg',
    role: 'Sinh viên Bách Khoa',
    time: '2 giờ trước',
    publishedAt: '2024-06-12T08:30:00',
    topic: 'Kinh nghiệm',
    category: 'Điều hòa',
    title: 'Mình giảm gần 200k tiền điện chỉ nhờ chỉnh lại cách dùng điều hòa',
    excerpt:
      'Trước đây mình hay để điều hòa 20 độ và bật cả đêm. Sau khi đổi sang 26 độ, bật thêm quạt số nhỏ và đóng kín cửa hơn, hóa đơn điện tháng này giảm thấy rõ mà phòng vẫn đủ mát.',
    image:
      '/images/fallback-green.jpg',
    likes: 302,
    commentsCount: 45,
    savedCount: 128,
    shares: 17,
    isLiked: false,
    isSaved: true,
    previewComments: [
      {
        id: 'community-1-comment-1',
        author: 'Lan Trinh',
        avatar:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80',
        content: 'Mình cũng tăng lên 27 độ và dùng thêm quạt. Hiệu quả hơn hẳn so với tưởng tượng.',
      },
    ],
  },
  {
    id: 'community-2',
    author: 'Lan Anh',
    avatar:
      '/images/fallback-green.jpg',
    role: 'Hỏi đáp',
    time: '5 giờ trước',
    publishedAt: '2024-06-12T05:15:00',
    topic: 'Hỏi đáp',
    category: 'Laptop',
    title: 'Có nên rút sạc laptop khi pin đầy không?',
    excerpt:
      'Mình nghe nhiều ý kiến trái chiều: người thì bảo cứ cắm vì máy mới có mạch tự ngắt, người lại bảo nên rút để bớt nóng và tiết kiệm điện. Mọi người đang áp dụng cách nào vậy?',
    image: '',
    likes: 45,
    commentsCount: 18,
    savedCount: 94,
    shares: 6,
    isLiked: false,
    isSaved: false,
    previewComments: [
      {
        id: 'community-2-comment-1',
        author: 'Hoàng Hải',
        avatar:
          '/images/fallback-green.jpg',
        content: 'Nếu dùng bàn học cả ngày, mình thường rút khi pin đủ và máy không cần tải nặng để bớt nóng.',
      },
      {
        id: 'community-2-comment-2',
        author: 'Bảo Nam',
        avatar:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80',
        content: 'Bạn nhớ kiểm tra chế độ sạc giới hạn pin nếu máy hỗ trợ, khá hữu ích đó.',
      },
    ],
  },
  {
    id: 'community-3',
    author: 'Team E-XANH',
    avatar:
      '/images/fallback-green.jpg',
    role: 'Quản trị viên',
    time: 'Hôm nay',
    publishedAt: '2024-06-12T09:45:00',
    topic: 'Kinh nghiệm',
    category: 'Mẹo nhanh',
    title: 'Checklist 30 giây trước khi ra khỏi phòng trọ',
    excerpt:
      'Trước khi rời phòng, hãy nhìn nhanh 3 điểm: công tắc đèn, phích cắm sạc và điều hòa hoặc quạt còn chạy hay không. Chỉ mất nửa phút nhưng giúp bạn tránh lãng phí điện cả buổi.',
    image: '',
    likes: 214,
    commentsCount: 29,
    savedCount: 186,
    shares: 13,
    isLiked: true,
    isSaved: true,
    previewComments: [
      {
        id: 'community-3-comment-1',
        author: 'Khánh Linh',
        avatar:
          '/images/fallback-green.jpg',
        content: 'Mình dán hẳn checklist trước cửa nên đỡ quên hẳn.',
      },
    ],
  },
  {
    id: 'community-4',
    author: 'Hoài Nam',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=240&q=80',
    role: 'Sinh viên năm 3',
    time: 'Hôm qua',
    publishedAt: '2024-06-11T20:10:00',
    topic: 'Kinh nghiệm',
    category: 'Đèn học',
    title: 'Mẹo dùng đèn học tiết kiệm mà vẫn không mỏi mắt',
    excerpt:
      'Mình chuyển sang đèn LED ánh sáng trung tính, đặt đèn lệch tay thuận và chỉ bật đúng khu vực học. Mắt đỡ mỏi hơn mà tiền điện cũng nhẹ đi đáng kể.',
    image:
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80',
    likes: 88,
    commentsCount: 11,
    savedCount: 72,
    shares: 8,
    isLiked: false,
    isSaved: false,
    previewComments: [],
  },
  {
    id: 'community-5',
    author: 'Đức Minh',
    avatar:
      '/images/fallback-green.jpg',
    role: 'Kinh nghiệm phòng trọ',
    time: '2 ngày trước',
    publishedAt: '2024-06-10T18:40:00',
    topic: 'Hỏi đáp',
    category: 'Thiết bị điện',
    title: 'Thiết bị nào trong phòng trọ tốn điện nhất?',
    excerpt:
      'Mình đang định theo dõi lại mức tiêu thụ của từng thiết bị trong phòng. Theo mọi người thì điều hòa, tủ lạnh mini hay bếp điện mới là thứ kéo hóa đơn lên nhanh nhất?',
    image: '',
    likes: 67,
    commentsCount: 24,
    savedCount: 138,
    shares: 5,
    isLiked: false,
    isSaved: true,
    previewComments: [
      {
        id: 'community-5-comment-1',
        author: 'Minh Hằng',
        avatar:
          'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=240&q=80',
        content: 'Nếu dùng thường xuyên thì điều hòa vẫn chiếm nhiều nhất, sau đó mới tới tủ lạnh mini.',
      },
    ],
  },
]

export const activeMembers = [
  {
    id: 'member-1',
    name: 'Khánh Linh',
    avatar:
      '/images/fallback-green.jpg',
    contribution: '42 bài chia sẻ',
    badge: '#1',
  },
  {
    id: 'member-2',
    name: 'Đức Minh',
    avatar:
      '/images/fallback-green.jpg',
    contribution: '38 bài chia sẻ',
    badge: '#2',
  },
  {
    id: 'member-3',
    name: 'Lan Anh',
    avatar:
      '/images/fallback-green.jpg',
    contribution: '26 bài chia sẻ',
    badge: 'Gợi ý hay',
  },
]

export const trendingTopics = [
  '#ĐiềuHòaMùaHè',
  '#PhòngTrọXanh',
  '#TủLạnh',
  '#GócHọcTập',
  '#SinhViênTiếtKiệm',
]

export const popularCommunityPosts = [
  {
    id: 'popular-1',
    title: 'Checklist 30 giây trước khi rời phòng',
    likes: 302,
    comments: 45,
  },
  {
    id: 'popular-2',
    title: 'Cách dùng điều hòa tiết kiệm hơn',
    likes: 214,
    comments: 29,
  },
  {
    id: 'popular-3',
    title: 'Có nên rút sạc laptop khi pin đầy?',
    likes: 45,
    comments: 18,
  },
]

export const communityRules = [
  'Tôn trọng mọi thành viên và góc nhìn khác nhau.',
  'Ưu tiên chia sẻ thông tin hữu ích, thực tế và có trải nghiệm thật.',
  'Không spam, không quảng cáo sai sự thật hoặc gây hiểu nhầm.',
]
