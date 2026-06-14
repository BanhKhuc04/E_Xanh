# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 16-dead-buttons.spec.js >> EXANH-016 Dead buttons - rà nút chết/nút giả >> EX-BTN-CLICK /meo-tiet-kiem click thử các nút an toàn
- Location: tests\16-dead-buttons.spec.js:16:5

# Error details

```
Test timeout of 30000ms exceeded.
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - button "Báo cáo lỗi" [ref=e3] [cursor=pointer]:
    - img [ref=e4]
    - text: Báo cáo lỗi
  - generic [ref=e6]:
    - banner [ref=e7]:
      - generic [ref=e8]:
        - link "E-XANH về trang chủ" [ref=e9] [cursor=pointer]:
          - /url: /
          - img "E-XANH" [ref=e11]
        - navigation "Điều hướng người dùng" [ref=e12]:
          - link "Trang chủ" [ref=e13] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e14] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e15] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e16] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Bài đã lưu" [ref=e17] [cursor=pointer]:
            - /url: /bai-da-luu
        - generic [ref=e18]:
          - link "Đăng nhập" [ref=e19] [cursor=pointer]:
            - /url: /dang-nhap
          - button "Đăng bài" [ref=e20] [cursor=pointer]
    - main [ref=e21]:
      - generic [ref=e23]:
        - generic [ref=e24]:
          - generic [ref=e25]:
            - generic [ref=e26]:
              - link "E-XANH về trang chủ" [ref=e28] [cursor=pointer]:
                - /url: /
                - img "E-XANH" [ref=e30]
              - generic [ref=e31]: Cộng đồng sống xanh
            - generic [ref=e32]:
              - heading "Tham gia E-XANH để sống xanh hơn mỗi ngày" [level=1] [ref=e33]:
                - text: Tham gia E-XANH
                - text: để sống xanh hơn
                - text: mỗi ngày
              - paragraph [ref=e34]: Một tài khoản E-XANH giúp bạn lưu bài viết, tham gia cộng đồng và theo dõi thói quen sử dụng điện cá nhân.
              - generic [ref=e35]:
                - generic [ref=e36]: Lưu bài viết
                - generic [ref=e37]: •
                - generic [ref=e38]: Bình luận
                - generic [ref=e39]: •
                - generic [ref=e40]: Theo dõi điện năng
          - generic [ref=e42]:
            - img "banner_cropped.jpeg" [ref=e45]
            - img "auth-hero.jpeg" [ref=e48]
            - img "auth-hero.jpeg" [ref=e51]
            - generic [ref=e52]:
              - button "Go to slide 1" [ref=e53] [cursor=pointer]
              - button "Go to slide 2" [ref=e55] [cursor=pointer]
              - button "Go to slide 3" [ref=e57] [cursor=pointer]
        - generic [ref=e59]:
          - generic [ref=e60]:
            - heading "Chào mừng trở lại" [level=2] [ref=e61]
            - paragraph [ref=e62]: Đăng nhập để tiếp tục hành trình sống xanh cùng E-XANH.
          - generic [ref=e63]:
            - generic [ref=e64]: Đăng nhập
            - link "Đăng ký" [ref=e65] [cursor=pointer]:
              - /url: /dang-ky
          - alert [ref=e66]: Vui lòng nhập email.
          - generic [ref=e67]:
            - generic [ref=e68]:
              - generic [ref=e69]: Email
              - textbox "Email" [ref=e70]:
                - /placeholder: Nhập email của bạn
            - generic [ref=e71]:
              - generic [ref=e72]: Mật khẩu
              - textbox "Mật khẩu" [ref=e73]:
                - /placeholder: Nhập mật khẩu
            - generic [ref=e74]:
              - generic [ref=e75]:
                - checkbox "Ghi nhớ đăng nhập" [ref=e76]
                - generic [ref=e77]: Ghi nhớ đăng nhập
              - button "Quên mật khẩu?" [disabled] [ref=e78] [cursor=pointer]
            - button "Đăng nhập" [active] [ref=e79] [cursor=pointer]
          - paragraph [ref=e80]:
            - text: Chưa có tài khoản?
            - link "Tạo tài khoản ngay" [ref=e81] [cursor=pointer]:
              - /url: /dang-ky
          - generic [ref=e82]:
            - strong [ref=e83]: Bảo mật thông tin
            - paragraph [ref=e84]: Khách chưa đăng nhập vẫn có thể xem bài viết và tính tiền điện. Đăng nhập giúp bạn lưu lại dữ liệu cá nhân hóa.
    - contentinfo [ref=e85]:
      - generic [ref=e86]:
        - generic [ref=e87]:
          - img [ref=e89]
          - text: Hoàng Sa & Trường Sa là của Việt Nam!
        - generic [ref=e91]:
          - link "E-XANH về trang chủ" [ref=e92] [cursor=pointer]:
            - /url: /
            - img "E-XANH" [ref=e94]
          - paragraph [ref=e95]: Dùng điện thông minh, sống xanh bền vững.
        - navigation "Liên kết chân trang" [ref=e96]:
          - link "Trang chủ" [ref=e97] [cursor=pointer]:
            - /url: /
          - link "Mẹo tiết kiệm" [ref=e98] [cursor=pointer]:
            - /url: /meo-tiet-kiem
          - link "Cộng đồng" [ref=e99] [cursor=pointer]:
            - /url: /cong-dong
          - link "Kiểm tra tiền điện" [ref=e100] [cursor=pointer]:
            - /url: /kiem-tra-tien-dien
          - link "Về chúng tôi" [ref=e101] [cursor=pointer]:
            - /url: /ve-chung-toi
          - link "Điều khoản" [ref=e102] [cursor=pointer]:
            - /url: /dieu-khoan
          - link "Liên hệ" [ref=e103] [cursor=pointer]:
            - /url: /lien-he
        - paragraph [ref=e105]: © 2024 E-XANH. Made by VanhKhucDev
```