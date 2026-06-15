# MOBILE AUDIT REPORT

## Scope

- Breakpoints audited: `390x844`, `430x932`, `768x1024`, `1440x900`
- Priority constraints followed:
  - Giữ desktop `>= 1024px`
  - Không đổi auth flow, route, service, Supabase
  - Ưu tiên CSS/media query
  - Không dùng `html/body overflow-x: hidden` để che lỗi

## Notes

- Route `/cong-dong/:id` được kiểm tra bằng đường dẫn detail `/cong-dong/test-mobile` để xác nhận layout detail/fallback không tràn khi local preview không có seed ID ổn định.
- Các route cần auth như `/dang-bai`, `/bai-da-luu`, `/tai-khoan`, `/lich-su-kiem-tra`, `/admin*` đã được kiểm tra trên preview `127.0.0.1:4173` sau khi rebuild.

## Audit Matrix

| Route | Lỗi phát hiện | File đã sửa | Cách sửa | Đã test 390px chưa | Đã test 430px chưa | Có ảnh hưởng desktop không |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | Hero/home cards cần gọn hơn trên mobile; kiểm tra glow không gây body overflow | `src/styles/global.css`, `src/styles/layout.css`, `src/styles/home.css`, `src/styles/social-ui.css` | Tối ưu shell, navbar, spacing, stack section và giữ floating card không làm tràn body | Có | Có | Không đáng kể |
| `/meo-tiet-kiem` | Hero và filter bar từng gây overflow trên mobile | `src/pages/user/TipsPage.jsx`, `src/styles/tips.css`, `src/styles/social-ui.css`, `src/styles/global.css` | Ép hero tips về block layout ở mobile, giữ filter chip trong vùng cuộn riêng, giảm padding mobile | Có | Có | Không |
| `/meo-tiet-kiem/:slug` | Cần đảm bảo article/sidebar stack đúng trên màn nhỏ | `src/styles/post-detail.css`, `src/styles/global.css` | Stack layout, cho related card xuống 1 cột ở very small mobile, tăng wrap text | Có | Có | Không |
| `/cong-dong` | Cần giữ composer/card/share popup không tràn | `src/styles/community.css`, `src/components/community/CommunityPostCard.jsx`, `src/styles/layout.css` | Co share popup theo viewport, grid/sidebar stack đúng, action wrap gọn | Có | Có | Không |
| `/cong-dong/:id` | Kiểm tra layout detail/fallback responsive | `src/styles/community.css`, `src/styles/social-ui.css`, `src/styles/layout.css` | Dùng cùng shared responsive + xác nhận route detail fallback không có horizontal scroll | Có | Có | Không |
| `/dang-bai` | Uploader ảnh bìa + hidden file input từng làm tăng `scrollWidth` | `src/styles/create-post.css`, `src/components/community/CreatePostForm.jsx`, `src/styles/social-ui.css` | Khóa uploader về width fluid, bỏ tác nhân overflow từ file input ẩn, form/action stack chuẩn mobile | Có | Có | Không |
| `/kiem-tra-tien-dien` | Kiểm tra form grid và suggestion cards trên mobile | `src/styles/electricity-check.css`, `src/styles/global.css` | Chuyển grid về 1 cột ở mobile, giữ button/input full width | Có | Có | Không |
| `/bai-da-luu` | Đồng bộ hero/layout với các page khác, filter chip không làm body tràn | `src/data/pageHeroes.js`, `src/pages/user/SavedPostsPage.jsx`, `src/styles/saved-posts.css`, `src/styles/social-ui.css` | Dùng shared `PageHero`, chỉnh card/filter/sidebar đồng bộ, giữ chip trong vùng cuộn an toàn | Có | Có | Không |
| `/dang-nhap` | Kiểm tra card auth và socials trên mobile | `src/styles/auth.css`, `src/styles/layout.css` | Giảm padding mobile, socials về 1 cột, form row stack | Có | Có | Không |
| `/dang-ky` | Tương tự đăng nhập | `src/styles/auth.css`, `src/styles/layout.css` | Dùng cùng responsive auth stack | Có | Có | Không |
| `/tai-khoan` | Header/profile/my-posts từng tràn ở mobile | `src/styles/account.css`, `src/styles/profile-cover.css`, `src/styles/global.css` | Co avatar/cover mobile, ép card/item wrap đúng, cho actions/meta full width khi màn nhỏ | Có | Có | Không |
| `/lich-su-kiem-tra` | Hero/filter/modal/card cần vừa màn | `src/styles/electricity-history.css`, `src/styles/global.css` | Stack filters/stats/modal summary, giảm padding trên mobile | Có | Có | Không |
| `/ve-chung-toi` | Kiểm tra hero/grid/card | `src/styles/static-pages.css`, `src/styles/layout.css`, `src/styles/global.css` | Stack hero/grid, giảm padding/radius ở mobile | Có | Có | Không |
| `/dieu-khoan` | Kiểm tra menu + content terms | `src/styles/static-pages.css`, `src/styles/layout.css`, `src/styles/global.css` | Bỏ sticky sidebar trên màn nhỏ, stack về 1 cột | Có | Có | Không |
| `/lien-he` | Kiểm tra form/contact cards | `src/styles/static-pages.css`, `src/styles/global.css` | Form row về 1 cột, action button full width ở mobile | Có | Có | Không |
| `/admin` | Kiểm tra shell/topbar/cards mobile | `src/styles/admin.css`, `src/styles/layout.css`, `src/styles/global.css` | Sidebar/topbar/cards co gọn, grid stats xuống 1-2 cột theo breakpoint | Có | Có | Không |
| `/admin/quan-ly-bai-viet` | Kiểm tra list/panel responsive | `src/styles/admin.css`, `src/styles/global.css` | Dùng admin shell responsive chung, giữ panel/card không tràn | Có | Có | Không |
| `/admin/quan-ly-binh-luan` | Kiểm tra filter/list responsive | `src/styles/admin.css`, `src/styles/global.css` | Dùng admin shell responsive chung, card/list co gọn | Có | Có | Không |
| `/admin/quan-ly-nguoi-dung` | Kiểm tra stats/list responsive | `src/styles/admin.css`, `src/styles/global.css` | Dùng admin shell responsive chung, stats grid co lại | Có | Có | Không |
| `/admin/quan-ly-thiet-bi` | Kiểm tra device cards responsive | `src/styles/admin.css`, `src/styles/global.css` | Dùng admin shell responsive chung, padding/card giảm ở mobile | Có | Có | Không |
| `/admin/cai-dat-giao-dien` | Kiểm tra settings/admin form responsive | `src/styles/admin.css`, `src/styles/global.css` | Dùng admin shell responsive chung, panel/settings cards co gọn | Có | Có | Không |

## Verification Summary

- Kết quả audit cuối cùng trên preview `127.0.0.1:4173`:
  - Tất cả route trong danh sách trên đều `không còn horizontal scroll` ở `390`, `430`, `768`, `1440`
  - Desktop `1440x900` vẫn giữ bố cục hiện có, chỉ nhận các tinh chỉnh padding/wrapping an toàn

## Build / Lint

- `npm run build`: Passed
- `npm run lint`: Failed do lint đang quét cả thư mục generated/test artifact như `exanh-playwright-tests/playwright-report/**` và `exanh-playwright-tests/data/routes.js`, không phải do các sửa responsive lần này
