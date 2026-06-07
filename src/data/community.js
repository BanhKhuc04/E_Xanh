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
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAyrbNoUK3ekPS_9QZPba6To3U0N3fqwEUwR-YpGGdX_RyIBgsV-SY673FiF5gHdEKlgXkGqx_FCltaQjPimutPUjOjz8skWxG81YOw6G7lhw2NnY7OOwWdibC5udn3PGHs_iIkei7HdbWUYFKO1ui4h2SV27JlPZVYfpUp7v9jtizJJU5BZcU_LmSFl5RCOHUWGD2-EVzDHb6NMnytdX77NaRGbsvteQiLJzT1aRBTqzd4aLRzk2hOmBSvLL2WrumMdkwQZw3cXWQl',
}

export const communityPosts = [
  {
    id: 'community-1',
    author: 'Minh Tuấn',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB4_KoYlcMLHiqq69Sigcvh8P86KEhZj_RYstiqV5kh9hDfiScotSrw8lZuTnaLHYki95wR6d8vrpPmfcec6uxga25KbMFTxdQkoYQb5Kr2QYrRvk7W1a-giyMbpTahZr_2UxAth69isMzRte8ESnrkF_Kl4rycmchngZiUO0Zluib9H9fJAu_Z9CEc5UMt3ulgp570HStmBKzYtjdUIv4Kgbf7m7X5wVLYm-dx684axxMpz-PIf4Dm7ed4k1L4l7X-0OOKQ1MWcyEm',
    role: 'Sinh viên Bách Khoa',
    time: '2 giờ trước',
    publishedAt: '2024-06-12T08:30:00',
    topic: 'Kinh nghiệm',
    category: 'Điều hòa',
    title: 'Mình giảm gần 200k tiền điện chỉ nhờ chỉnh lại cách dùng điều hòa',
    excerpt:
      'Trước đây mình hay để điều hòa 20 độ và bật cả đêm. Sau khi đổi sang 26 độ, bật thêm quạt số nhỏ và đóng kín cửa hơn, hóa đơn điện tháng này giảm thấy rõ mà phòng vẫn đủ mát.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDVJ9xLD4__aCKF7XA4ImafdJzy4racjqf6ylb0SeXPO2ou3rslckIEOMB3iPhAeO2q6vOpFFnl_qcquvy0SaL6SltsKMjG6IKILKdU7iXWayfHQH8TJnWhNW8jPKs9uP6wCr2-i8s6izoqD5MOVQbJaqYY9WqN6tlBbgh6HvcPT8L1GvvtxQV9DDtHKM6_q5KdHS4ubBQbuTi0Bn5g3JxB4bzXBtTH7uOS3zdwInqozyT88KgsaLMcmIC1XSN3BqNshmy9nPU9DKsk',
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
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAz90FHzzrBRJ5Lu1xekY9SQ5iOsS1G_ZpZR4vzP6Ifhtn-XFfqNKX1MWzPMZNv0aqi7g5LRBperq8Z_71QjDwWXDO4W51CmRb7fNAOAJLip-mmraB9bvd_Fr59OVsTNrUBCbZkY9ELZsigZBpNjGODtg01hNtWZEVk7JmpvFOTymIweU0G56IkJbzAeaqL1ZG0XpNQCzI9sIjBB7xB5P5bn9jR0G-OX2z0-kiwsS-ogtKx0AQBe5mUt9ci4sUVQaKguJiLUzvXlEJ5',
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
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBLdfakE43oINnNZwRZq8gX527nzkgbNMoqa34V61FRD4ucJzdssH-wAYwWfhm8Ir5CRQFubzMtGlwlFBo66SFrMwvKlZ-nde_7WD7ocK6x5vWrrdvPlUse3i4ytftIcr2i-VrABkJ8D9t0lQTbRHn_C5MT0dZzoRSdmMEYgh7lS68aD-5UyT3pCobB3KwJePI4Hl3IHFm6SabMEwG9HjlOflO-_ezbiWOzZvK341bGxUnvOu8i_DR6NIN9lAi_2FU4fENzCRteDC14',
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
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD02qOWYyqMVvbDbbFbf0A6-kJE5L7pcCb_pY-LZOt829UqIqGZgMQxNZrYI1z_kPeVMXIyJfxv52s2QgH2gM_dObRujbHYpdP8wEFnUk0mfK4TUtH6gmYoHr49qCP_ps7-TiCfVXDZZ1r-ccG9XaghfRI3UYXYh7zIMJEobjYDTpseyhgJ9vaq80p1otByOmPZIe4lzNfywpKu9gLK5StBL4k1vuf4-PxdMPw_2kIUb3MNnaDEmwg6i_NqyueqipXWOHKcYBRugu6J',
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
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBu2itfGNIyFdRxZLpRaTNBwimMkj8RiWrXwFIGBXbaqH9lBgtp3Vhz8RAGoovimC09CZsCqi9zN7TQVNAxbrCfxwO2HqWzmF6DfxXALaU6ZaKgwz2Wr-mst6Zf-bzrlx_H6xb_edk0hv8HvUfJGXfCWlD-NsJ0lgOh7EF-t3ISHVfwM3bqApfTKgNvinvzXuIo-VQC_d34XP6uuSFT4R_wIUJbFrfXDNCOUDEKs4wgYbXGA0cd9KF-c7aJXkth1TRLcZwNXeiBSGn3',
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
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDIt8JpkLRhJ8yjNAi4yzmjaVetynXS6kCCQddc8iaWu5IwRFuAuedMYCXpBAM1NjZHB-tBMIlGzJn5w3N9uYyJGo9FWm14wnIQxJlRDOyMK4U6szmRf2VDsbWscBFEwv4AVOwwTXC9XUINrKd3N60J4qSo9mnlWZbhGvJJN2LDGCzLINsYMx4zzel3rdPmLocqOXngEbgrh1EsfSM3VqRYloEYpM39ai-tEO7tkaQi0EsV4aCsQJvhfCkazRAYb1lZnAgMN-QnCm1U',
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
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBu2itfGNIyFdRxZLpRaTNBwimMkj8RiWrXwFIGBXbaqH9lBgtp3Vhz8RAGoovimC09CZsCqi9zN7TQVNAxbrCfxwO2HqWzmF6DfxXALaU6ZaKgwz2Wr-mst6Zf-bzrlx_H6xb_edk0hv8HvUfJGXfCWlD-NsJ0lgOh7EF-t3ISHVfwM3bqApfTKgNvinvzXuIo-VQC_d34XP6uuSFT4R_wIUJbFrfXDNCOUDEKs4wgYbXGA0cd9KF-c7aJXkth1TRLcZwNXeiBSGn3',
    contribution: '42 bài chia sẻ',
    badge: '#1',
  },
  {
    id: 'member-2',
    name: 'Đức Minh',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDIt8JpkLRhJ8yjNAi4yzmjaVetynXS6kCCQddc8iaWu5IwRFuAuedMYCXpBAM1NjZHB-tBMIlGzJn5w3N9uYyJGo9FWm14wnIQxJlRDOyMK4U6szmRf2VDsbWscBFEwv4AVOwwTXC9XUINrKd3N60J4qSo9mnlWZbhGvJJN2LDGCzLINsYMx4zzel3rdPmLocqOXngEbgrh1EsfSM3VqRYloEYpM39ai-tEO7tkaQi0EsV4aCsQJvhfCkazRAYb1lZnAgMN-QnCm1U',
    contribution: '38 bài chia sẻ',
    badge: '#2',
  },
  {
    id: 'member-3',
    name: 'Lan Anh',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAz90FHzzrBRJ5Lu1xekY9SQ5iOsS1G_ZpZR4vzP6Ifhtn-XFfqNKX1MWzPMZNv0aqi7g5LRBperq8Z_71QjDwWXDO4W51CmRb7fNAOAJLip-mmraB9bvd_Fr59OVsTNrUBCbZkY9ELZsigZBpNjGODtg01hNtWZEVk7JmpvFOTymIweU0G56IkJbzAeaqL1ZG0XpNQCzI9sIjBB7xB5P5bn9jR0G-OX2z0-kiwsS-ogtKx0AQBe5mUt9ci4sUVQaKguJiLUzvXlEJ5',
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
