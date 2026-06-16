import '../../styles/development-notice.css';

const BUG_REPORT_FORM_URL = "https://forms.gle/2rHxK4ebqQu7HgqM8";

const ReportIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

function FloatingBugReport() {
  return (
    <a
      href={BUG_REPORT_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="development-report-button development-notice-mini-btn"
      style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999, textDecoration: 'none' }}
      aria-label="Báo lỗi website"
      title="Báo lỗi website"
    >
      <ReportIcon />
      Báo lỗi
    </a>
  );
}

export default FloatingBugReport;
