# Avatar Frame CSS Fix Report

## Nguyen nhan loi

- He avatar cu dang dung cung mot asset PNG mascot + chu `E-XANH` de overlay len nhieu kich thuoc avatar khac nhau.
- Asset nay khong phai `ring-only frame`, nen khi ap vao avatar nho se gay roi mat, che mat va lam avatar bi lech visual.
- Trong modal, viec overlay truc tiep cung asset nay len anh dai dien lam cho bo cuc khong chuyen nghiep va kho can chinh chinh xac cho moi ti le anh.

## Vi sao khong nen dung frame mascot lon cho moi avatar

- Avatar nho can uu tien nhan dien khuon mat, khong phai chi tiet trang tri.
- Asset mascot co nhieu chi tiet va chu, rat de lam vo layout khi scale xuong `xs/sm/md`.
- Cach lam dung la tach mode:
  - avatar nho: `ring`
  - avatar profile: `profile`
  - avatar modal: `showcase`

## File da sua

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
- `src/components/posts/AuthorSidebarCard.jsx`
- `src/pages/user/CommunityPostDetailPage.jsx`
- `src/config/avatarFrames.js`
- `src/styles/profile-cover.css`
- `src/styles/public-profile.css`

## frameMode da them

- `none`: avatar thuong, khong them vi tri decor.
- `ring`: ring xanh nhe cho avatar nho o navbar/card/comment.
- `profile`: avatar lon o trang ca nhan, border trang + shadow xanh nhe + leaf badge.
- `showcase`: chi dung cho modal/lightbox.

## Test da chay

- `npm run build`
- `npm run dev`
- Kiem tra cac trang:
  - `/tai-khoan`
  - `/nguoi-dung/:id`
  - navbar
  - card bai viet cong dong
  - card bai meo
  - modal avatar desktop/mobile

## Ket qua

- Avatar nho khong con bi frame mascot che.
- Avatar profile dung ring/profile style gon hon, ro mat hon.
- Modal avatar tach showcase mode, khong con overlay frame mascot truc tiep len mat.
- Build pass.

## Ghi chu phase sau

- Can export them file `public/avatar-frames/exanh-ring-only.png`.
- File moi phai la PNG nen trong suot, chi co vong tron xanh + la, khong co chu `E-XANH`, khong co mascot.
- Sau khi co `ring-only`, co the cho admin quan ly frame dep hon tu Supabase Storage ma khong can hack CSS theo asset showcase.
