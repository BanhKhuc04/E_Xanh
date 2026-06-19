# Media Audit Report

## 1. Image Keywords Usage in Codebase

### Keyword: `image_url`
- src/components/common/BannerCarousel.jsx
- src/components/common/PageHero.jsx
- src/components/home/CommunityPreview.jsx
- src/components/home/FeaturedPosts.jsx
- src/components/home/HeroSection.jsx
- src/pages/admin/PostManagementPage.jsx
- src/pages/admin/ThemeSettingsPage.jsx
- src/pages/user/CommunityPage.jsx
- src/pages/user/CommunityPostDetailPage.jsx
- src/pages/user/PostDetailPage.jsx
- src/pages/user/SavedPostsPage.jsx
- src/pages/user/TipsPage.jsx
- src/services/bannerService.js
- src/services/interactionService.js
- src/services/postService.js
- src/utils/postMedia.js

### Keyword: `cover_url`
- src/components/account/ProfileCoverSettings.jsx
- src/components/account/ProfileHeader.jsx
- src/pages/user/AccountPage.jsx
- src/pages/user/PublicProfilePage.jsx
- src/pages/user/SettingsUserPage.jsx
- src/services/postService.js
- src/services/profileService.js

### Keyword: `cover_thumb_url`
*No matches found*

### Keyword: `cover_card_url`
*No matches found*

### Keyword: `cover_detail_url`
*No matches found*

### Keyword: `avatar_url`
- src/components/account/ProfileAvatarSettings.jsx
- src/components/account/ProfileHeader.jsx
- src/components/community/InlineCommentSection.jsx
- src/components/community/PostComposer.jsx
- src/components/community/PostLivePreview.jsx
- src/components/home/CommunityPreview.jsx
- src/components/home/FeaturedPosts.jsx
- src/layouts/user/UserNavbar.jsx
- src/pages/admin/CommentManagementPage.jsx
- src/pages/auth/AuthCallbackPage.jsx
- src/pages/user/AccountPage.jsx
- src/pages/user/CommunityPage.jsx
- src/pages/user/CommunityPostDetailPage.jsx
- src/pages/user/PostDetailPage.jsx
- src/pages/user/PublicProfilePage.jsx
- src/pages/user/SettingsUserPage.jsx
- src/pages/user/TipsPage.jsx
- src/services/adminUserService.js
- src/services/commentService.js
- src/services/interactionService.js
- src/services/postService.js
- src/services/profileService.js

### Keyword: `banner_url`
- src/utils/postMedia.js

### Keyword: `thumbnail_url`
- src/utils/postMedia.js

### Keyword: `getPublicUrl`
- src/services/bannerService.js
- src/services/mediaUploadService.js
- src/utils/avatar.js
- src/utils/imageUrl.js

### Keyword: `supabase.storage`
- src/services/bannerService.js
- src/services/mediaUploadService.js
- src/services/settingsService.js
- src/utils/avatar.js
- src/utils/imageUrl.js

### Keyword: `upload`
- src/components/account/AvatarUploader.jsx
- src/components/account/ProfileAvatarSettings.jsx
- src/components/account/ProfileCoverSettings.jsx
- src/components/community/CreatePostForm.jsx
- src/components/community/PostComposerModal.jsx
- src/components/community/PostContentEditor.jsx
- src/hooks/usePostComposerForm.js
- src/pages/admin/PostManagementPage.jsx
- src/pages/admin/ThemeSettingsPage.jsx
- src/pages/user/CreatePostPage.jsx
- src/services/bannerService.js
- src/services/mediaUploadService.js
- src/services/postService.js
- src/services/profileService.js
- src/services/siteNoticeService.js

### Keyword: `transform`
- src/components/common/CustomSelect.jsx
- src/components/common/PostImage.jsx
- src/utils/imageUrl.js

### Keyword: `<img`
- src/components/account/AvatarUploader.jsx
- src/components/account/ProfileAvatarSettings.jsx
- src/components/account/ProfileCoverSettings.jsx
- src/components/account/ProfileHeader.jsx
- src/components/admin/posts/AdminPostList.jsx
- src/components/admin/users/AdminUserDrawer.jsx
- src/components/auth/AuthHero.jsx
- src/components/common/BrandLogo.jsx
- src/components/common/HeroMedia.jsx
- src/components/common/MarkdownContent.jsx
- src/components/common/PostImage.jsx
- src/components/community/ActiveMemberAvatar.jsx
- src/components/community/CommunityPostCard.jsx
- src/components/community/InlineCommentSection.jsx
- src/components/community/PostComposer.jsx
- src/components/community/PostContentEditor.jsx
- src/components/community/PostLivePreview.jsx
- src/components/home/CommunityPreview.jsx
- src/components/media/SmartImage.jsx
- src/components/media/SmartVideo.jsx
- src/components/posts/AuthorSidebarCard.jsx
- src/components/posts/PostAuthorAvatar.jsx
- src/layouts/user/UserNavbar.jsx
- src/pages/user/AboutPage.jsx
- src/pages/user/CommunityPostDetailPage.jsx
- src/pages/user/PublicProfilePage.jsx
- src/pages/user/SettingsUserPage.jsx

### Keyword: `<picture`
- src/components/common/BrandLogo.jsx
- src/components/common/HeroMedia.jsx

### Keyword: `backgroundImage`
*No matches found*

### Keyword: `background-image`
*No matches found*

## 2. Summary of Findings

### Files Displaying Images (Potential components needing OptimizedImage)
- src/components/account/AvatarUploader.jsx
- src/components/account/ProfileAvatarSettings.jsx
- src/components/account/ProfileCoverSettings.jsx
- src/components/account/ProfileHeader.jsx
- src/components/admin/posts/AdminPostList.jsx
- src/components/admin/users/AdminUserDrawer.jsx
- src/components/auth/AuthHero.jsx
- src/components/common/BrandLogo.jsx
- src/components/common/HeroMedia.jsx
- src/components/common/MarkdownContent.jsx
- src/components/common/PostImage.jsx
- src/components/community/ActiveMemberAvatar.jsx
- src/components/community/CommunityPostCard.jsx
- src/components/community/InlineCommentSection.jsx
- src/components/community/PostComposer.jsx
- src/components/community/PostContentEditor.jsx
- src/components/community/PostLivePreview.jsx
- src/components/home/CommunityPreview.jsx
- src/components/media/SmartImage.jsx
- src/components/media/SmartVideo.jsx
- src/components/posts/AuthorSidebarCard.jsx
- src/components/posts/PostAuthorAvatar.jsx
- src/layouts/user/UserNavbar.jsx
- src/pages/user/AboutPage.jsx
- src/pages/user/CommunityPostDetailPage.jsx
- src/pages/user/PublicProfilePage.jsx
- src/pages/user/SettingsUserPage.jsx

### Files Uploading Images
- src/services/bannerService.js
- src/services/mediaUploadService.js
- src/services/settingsService.js
- src/utils/avatar.js
- src/utils/imageUrl.js
- src/components/account/AvatarUploader.jsx
- src/components/account/ProfileAvatarSettings.jsx
- src/components/account/ProfileCoverSettings.jsx
- src/components/community/CreatePostForm.jsx
- src/components/community/PostComposerModal.jsx
- src/components/community/PostContentEditor.jsx
- src/hooks/usePostComposerForm.js
- src/pages/admin/PostManagementPage.jsx
- src/pages/admin/ThemeSettingsPage.jsx
- src/pages/user/CreatePostPage.jsx
- src/services/postService.js
- src/services/profileService.js
- src/services/siteNoticeService.js

### DB Fields Used
- image_url
- cover_url
- avatar_url
- banner_url
- thumbnail_url

### Observations & Potential Issues
- **Large original images**: Used in PostDetail, feed, etc. wherever `image_url` or `cover_url` is used directly in `<img>` without variants.
- **Blank/blue empty images**: Caused by missing `src` handling, no fallback or loading skeleton, which is common in current `<img>` tags.
- **Overfetching**: Likely in feed queries where `content` or large text fields might be fetched alongside `image_url`.

