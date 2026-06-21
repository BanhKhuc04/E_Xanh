import { Link, useLocation } from 'react-router-dom'
import SEO from '../../components/SEO'
import '../../styles/static-pages.css'

const termsSections = [
  {
    title: 'Chấp nhận điều khoản',
    content:
      'Bằng việc truy cập, đăng ký tài khoản và sử dụng nền tảng E-XANH, bạn đồng ý tuân thủ các điều khoản sử dụng được công bố trên trang này.',
  },
  {
    title: 'Tài khoản người dùng',
    content:
      'Bạn cần cung cấp thông tin cơ bản chính xác khi đăng ký và có trách nhiệm bảo mật tài khoản, mật khẩu cũng như mọi hoạt động diễn ra dưới tên đăng nhập của mình.',
  },
  {
    title: 'Nội dung do người dùng đăng',
    content:
      'Bạn chịu trách nhiệm với bài viết, bình luận và nội dung mình chia sẻ. E-XANH có quyền từ chối hoặc gỡ bỏ nội dung vi phạm quy tắc cộng đồng.',
  },
  {
    title: 'Quy tắc cộng đồng',
    content:
      'Mọi thành viên cần tôn trọng nhau, không spam, không phát tán thông tin sai lệch và không sử dụng nền tảng cho mục đích quảng cáo gây hiểu nhầm.',
  },
  {
    title: 'Dữ liệu và quyền riêng tư',
    content:
      'Chúng tôi chỉ sử dụng dữ liệu cần thiết để duy trì trải nghiệm cá nhân hóa cơ bản, bao gồm bài đã lưu và lịch sử kiểm tra điện của bạn.',
  },
  {
    title: 'Giới hạn trách nhiệm',
    content:
      'E-XANH cung cấp thông tin tham khảo và công cụ hỗ trợ. Kết quả tính toán chi phí điện không thay thế hóa đơn chính thức từ nhà cung cấp điện.',
  },
  {
    title: 'Thay đổi điều khoản',
    content:
      'Các điều khoản có thể được cập nhật theo thời gian. Việc tiếp tục sử dụng nền tảng sau khi cập nhật được hiểu là bạn chấp nhận phiên bản mới.',
  },
  {
    title: 'Liên hệ hỗ trợ',
    content:
      'Nếu có câu hỏi liên quan đến điều khoản sử dụng, bạn có thể liên hệ với E-XANH qua email hỗ trợ hoặc trang Liên hệ để được giải đáp.',
  },
]

function TermsPage() {
  const { pathname } = useLocation()
  const canonicalUrl = `https://e-xanh.vercel.app${pathname}`

  return (
    <>
      <SEO title="Điều khoản sử dụng" description="Các điều khoản, quy định và chính sách khi sử dụng nền tảng E-XANH." url={canonicalUrl} />

      <div className="static-page">
        <div className="static-page__breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span>{'>'}</span>
        <span>Điều khoản</span>
      </div>

      <section className="static-page__hero static-page__hero--terms">
        <div className="static-page__hero-content">
          <h1>Điều khoản sử dụng E-XANH</h1>
          <p>
            Vui lòng đọc kỹ các điều khoản trước khi sử dụng nền tảng E-XANH để đảm bảo trải nghiệm an toàn, văn minh và hữu ích.
          </p>
        </div>
      </section>

      <div className="static-page__terms-layout">
        <aside className="static-page__terms-menu">
          <h2>Mục lục điều khoản</h2>
          <ol>
            {termsSections.map((section, index) => (
              <li key={section.title}>
                <a href={`#term-${index + 1}`}>
                  {index + 1}. {section.title}
                </a>
              </li>
            ))}
          </ol>
        </aside>

        <section className="static-page__terms-content">
          {termsSections.map((section, index) => (
            <article key={section.title} id={`term-${index + 1}`} className="static-page__terms-item">
              <div className="static-page__terms-heading">
                <span>{index + 1}</span>
                <h3>{section.title}</h3>
              </div>
              <p>{section.content}</p>
            </article>
          ))}

          <div className="static-page__terms-note">Cập nhật lần cuối: 12/06/2024</div>
        </section>
      </div>
    </div>
    </>
  )
}

export default TermsPage
