# Admin Audit Matrix

| Route | Status before upgrade | Notes |
| --- | --- | --- |
| `/admin` | `partial` | Dashboard dùng dữ liệu thật một phần nhưng chưa thống nhất analytics và thiếu số liệu mở rộng. |
| `/admin/quan-ly-bai-viet` | `partial` | CRUD và moderation có thật, nhưng stats dùng mock và có CTA lọc giả. |
| `/admin/quan-ly-binh-luan` | `partial` | Dữ liệu thật, moderation thật, nhưng còn map UI/mock enum và chưa hoàn thiện anchor/comment UX. |
| `/admin/quan-ly-nguoi-dung` | `partial` | Dữ liệu thật và role/status thật, nhưng chưa có deactivate rõ ràng và chưa hiện đủ trạng thái xử lý. |
| `/admin/quan-ly-thiet-bi` | `partial` | CRUD thật, nhưng stats/tips dùng mock và có CTA lọc giả. |
| `/admin/thong-ke` | `mock` | Placeholder chart và chỉ hiển thị vài chỉ số cơ bản. |
| `/admin/cai-dat` | `mock` | Hầu hết card và quick actions chỉ dùng state cục bộ. |
| `/admin/cai-dat-giao-dien` | `partial` | Banner/announcement thật, nhưng chưa quản lý hero runtime cho `/bai-da-luu`. |

## Scope upgraded in this implementation

- Chuẩn hóa settings runtime trên `platform_settings`.
- Thêm luồng backup ứng dụng trên `system_backups`.
- Nâng `StatisticsPage` và `AdminDashboardPage` sang dữ liệu thật.
- Bỏ stats mock ở `PostManagementPage` và `DeviceManagementPage`.
- Bổ sung deactivate account, ban metadata và session guard cho user bị khóa/vô hiệu hóa.
- Nối `saved_posts_hero_image` từ admin settings/theme sang trang public `/bai-da-luu`.
