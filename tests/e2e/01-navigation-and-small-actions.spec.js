import { test, expect } from '@playwright/test'
import {
  collectBrowserIssues,
  createIssueBag,
  gotoAndWait,
  assertPageIsUsable,
  assertNoCriticalBrowserIssues,
  expectToastOrDialog,
} from './utils/qa-helpers.js'

test.describe('01 - Navigation and small public actions', () => {
  test('main navbar links navigate correctly', async ({ page }) => {
    const issueBag = createIssueBag()
    collectBrowserIssues(page, issueBag)

    await gotoAndWait(page, '/')
    await assertPageIsUsable(page, '/')

    const navChecks = [
      { name: /mẹo tiết kiệm/i, url: /\/meo-tiet-kiem/ },
      { name: /cộng đồng/i, url: /\/cong-dong/ },
      { name: /kiểm tra tiền điện/i, url: /\/kiem-tra-tien-dien/ },
    ]

    for (const item of navChecks) {
      await page.getByRole('link', { name: item.name }).first().click()
      await expect(page).toHaveURL(item.url)
      await assertPageIsUsable(page, String(item.url))
    }

    await assertNoCriticalBrowserIssues(issueBag, 'main navbar flow')
  })

  test('tips page search/filter/detail link does not break', async ({ page }) => {
    const issueBag = createIssueBag()
    collectBrowserIssues(page, issueBag)
    await gotoAndWait(page, '/meo-tiet-kiem')
    await assertPageIsUsable(page, '/meo-tiet-kiem')

    const searchInput = page.locator('input[type="search"], input[placeholder*="Tìm"], input[placeholder*="tìm"]').first()
    if (await searchInput.isVisible({ timeout: 2500 }).catch(() => false)) {
      await searchInput.fill('điện')
      await page.keyboard.press('Enter').catch(() => {})
      await expect(page.locator('body')).toContainText(/điện|không tìm thấy|chưa có/i, { timeout: 5000 })
    }

    const cardLink = page.getByTestId('tip-card-link').first()
    if (await cardLink.isVisible({ timeout: 5000 }).catch(() => false)) {
      await cardLink.click()
      await expect(page).toHaveURL(/\/meo-tiet-kiem\//)
      await assertPageIsUsable(page, 'tips detail')
    } else {
      test.info().annotations.push({ type: 'warning', description: 'Không có tip-card-link để test chi tiết bài viết.' })
    }

    await assertNoCriticalBrowserIssues(issueBag, 'tips small actions')
  })

  test('community share/like/save/comment buttons give user-visible feedback for anonymous user', async ({ page }) => {
    const issueBag = createIssueBag()
    collectBrowserIssues(page, issueBag)
    await gotoAndWait(page, '/cong-dong')
    await assertPageIsUsable(page, '/cong-dong')

    const firstCard = page.getByTestId('community-post-card').first()
    if (!(await firstCard.isVisible({ timeout: 7000 }).catch(() => false))) {
      test.info().annotations.push({ type: 'warning', description: 'Không có bài cộng đồng để test actions.' })
      return
    }

    const shareButton = firstCard.getByRole('button', { name: /lưu liên kết|chia sẻ/i }).first()
    if (await shareButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expectToastOrDialog(
        page,
        async () => shareButton.click(),
        /đã lưu liên kết|sao chép|copy|liên kết|không thể lưu/i,
        'Nút lưu liên kết phải hiện toast/feedback',
      )
    }

    const likeButton = firstCard.getByRole('button', { name: /thích/i }).first()
    if (await likeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expectToastOrDialog(
        page,
        async () => likeButton.click(),
        /đăng nhập|cần đăng nhập|vui lòng/i,
        'Ẩn danh bấm thích phải có phản hồi yêu cầu đăng nhập',
      )
    }

    const saveButton = firstCard.getByRole('button', { name: /lưu bài/i }).first()
    if (await saveButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expectToastOrDialog(
        page,
        async () => saveButton.click(),
        /đăng nhập|cần đăng nhập|vui lòng/i,
        'Ẩn danh bấm lưu bài phải có phản hồi yêu cầu đăng nhập',
      )
    }

    const commentButton = firstCard.getByRole('button', { name: /bình luận/i }).first()
    if (await commentButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expectToastOrDialog(
        page,
        async () => commentButton.click(),
        /đăng nhập|cần đăng nhập|vui lòng/i,
        'Ẩn danh bấm bình luận phải có phản hồi yêu cầu đăng nhập',
      )
    }

    await assertNoCriticalBrowserIssues(issueBag, 'community anonymous actions')
  })
})
