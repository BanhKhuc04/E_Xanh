import { Globe, ShieldCheck } from 'lucide-react'
import { PROFILE_VISIBILITY_OPTIONS } from './constants'
import ToggleRow from './ToggleRow'

export default function PrivacySettingsSection({
  privacyForm,
  setPrivacyForm,
  handleSavePrivacy,
  savingPrivacy,
}) {
  return (
    <div className="settings-stack">
      <section className="settings-section-card">
        <div className="settings-section-card__header">
          <div>
            <span className="settings-section-card__eyebrow">Ai có thể xem hồ sơ</span>
            <h2>Điều khiển mức độ hiển thị trang cá nhân</h2>
          </div>
          <ShieldCheck size={22} />
        </div>

        <div className="settings-radio-group">
          {PROFILE_VISIBILITY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`settings-radio-card${privacyForm.profile_visibility === option.value ? ' is-active' : ''}`}
              onClick={() => setPrivacyForm((current) => ({
                ...current,
                profile_visibility: option.value,
              }))}
            >
              <strong>{option.label}</strong>
              <span>{option.description}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="settings-section-card">
        <div className="settings-section-card__header">
          <div>
            <span className="settings-section-card__eyebrow">Hiển thị công khai</span>
            <h2>Chọn nội dung an toàn sẽ hiện trên hồ sơ</h2>
          </div>
          <Globe size={22} />
        </div>

        <div className="settings-switch-list">
          <ToggleRow
            label="Hiển thị liên kết Facebook"
            description="Chỉ hiện link Facebook trên hồ sơ công khai khi bạn bật mục này."
            checked={privacyForm.show_facebook}
            onChange={() => setPrivacyForm((current) => ({
              ...current,
              show_facebook: !current.show_facebook,
            }))}
          />
          <ToggleRow
            label="Hiển thị bài viết công khai"
            description="Ẩn toàn bộ danh sách bài viết khỏi trang hồ sơ công khai nếu bạn muốn."
            checked={privacyForm.show_public_posts}
            onChange={() => setPrivacyForm((current) => ({
              ...current,
              show_public_posts: !current.show_public_posts,
            }))}
          />
          <ToggleRow
            label="Cho phép công cụ tìm kiếm lập chỉ mục"
            description="Nếu tắt, hồ sơ công khai sẽ trả về thẻ noindex để giảm khả năng bị lập chỉ mục."
            checked={privacyForm.allow_search_index}
            onChange={() => setPrivacyForm((current) => ({
              ...current,
              allow_search_index: !current.allow_search_index,
            }))}
          />
        </div>

        <div className="settings-form__actions">
          <button type="button" className="btn btn--primary" onClick={handleSavePrivacy} disabled={savingPrivacy}>
            {savingPrivacy ? 'Đang lưu...' : 'Lưu quyền riêng tư'}
          </button>
        </div>
      </section>
    </div>
  )
}
