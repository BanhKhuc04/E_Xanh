# Avatar Frame & Lightbox Report

## File da sua/tao

- `public/avatar-frames/exanh-default-frame.png`
- `src/config/avatarFrames.js`
- `src/components/common/UserAvatar.jsx`
- `src/components/common/UserAvatar.css`
- `src/components/common/AvatarLightbox.jsx`
- `src/components/common/AvatarLightbox.css`
- `src/components/account/ProfileHeader.jsx`
- `src/pages/user/PublicProfilePage.jsx`
- `src/components/community/CommunityPostCard.jsx`
- `src/components/home/CommunityPreview.jsx`
- `src/components/posts/PostAuthorAvatar.jsx`
- `src/components/community/ActiveMemberAvatar.jsx`
- `src/layouts/user/UserNavbar.jsx`
- `src/pages/user/CommunityPostDetailPage.jsx`
- `src/components/posts/AuthorSidebarCard.jsx`
- `src/styles/profile-cover.css`
- `src/styles/public-profile.css`
- `src/styles/layout.css`
- `src/pages/user/CommunityPostDetailPage.css`
- `src/styles/author-sidebar-card.css`

## Component moi

- `UserAvatar`: avatar dung chung, co fallback initials, fallback khi anh loi, ring nhe cho avatar nho va frame PNG cho avatar lon.
- `AvatarLightbox`: modal xem avatar lon, dong bang nut X, overlay va phim `ESC`.
- `avatarFrames.js`: diem mo rong de sau nay map frame tu Supabase Storage / admin panel.

## Cach dat asset frame

Dat file PNG trong suot tai:

- `public/avatar-frames/exanh-default-frame.png`

Frame hien tai da duoc kiem tra co alpha trong suot, nen an toan de overlay len avatar.

## Cach test

1. Chay `npm run dev`
2. Mo:
   - `/tai-khoan`
   - `/nguoi-dung/:id`
   - navbar tren cac trang user
   - card cong dong / bai viet noi bat
3. Kiem tra:
   - Avatar lon co frame E-XANH
   - Click avatar mo lightbox
   - Lightbox dong bang `X`, overlay, `ESC`
   - Avatar nho van gon, khong vo layout
   - Mobile `390px` lightbox khong tran man

## Ket qua npm run build

- `npm run build`: `PASS`
- Vite build thanh cong tren workspace vao ngay `2026-06-19`.
- Co canh bao san co ve `INEFFECTIVE_DYNAMIC_IMPORT` trong `src/services/bannerService.js`, khong lien quan den avatar/frame phase nay.

## Ket qua test nhanh

- `http://127.0.0.1:4173/nguoi-dung/ecd19cb8-39ea-4a1b-ba37-09b502e84132`
  - Avatar lon co frame E-XANH.
  - Click avatar mo lightbox thanh cong.
  - Dong lightbox bang nut `X`, click vung nen toi va phim `ESC` deu thanh cong.
- Trang chu:
  - Avatar nho trong community preview va featured posts van render binh thuong qua `UserAvatar`.
- Mobile `390x844`:
  - Lightbox panel rong `347px` trong viewport `390px`, khong tran man.
  - Frame avatar trong lightbox van nam gon trong panel.
- `/tai-khoan`:
  - Moi truong test hien tai khong co session dang nhap, nen route hien man hinh yeu cau dang nhap.
  - Da xac nhan component `ProfileHeader` duoc cap nhat trong code va build thanh cong, nhung can dang nhap de QA luong thuc te.

## Ghi chu phase sau

- Dua danh sach frame vao Supabase Storage.
- Tao bang `avatar_frames` de admin quan ly metadata frame.
- Map frame theo user thong qua profile preference hoac bang lien ket rieng.
- Cho phep admin bat/tat frame mac dinh va sap xep thu tu uu tien.
