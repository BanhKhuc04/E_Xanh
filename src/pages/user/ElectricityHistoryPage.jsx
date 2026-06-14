import { useMemo, useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  electricityHistory,
  formatCurrency,
  formatHistoryDate,
  formatKwh,
} from '../../data/electricity'
import {
  deleteElectricityHistory,
  getElectricityHistories,
  clearElectricityHistories,
  setScrollToResultFlag,
  setRecalculateDevices,
} from '../../utils/electricityStorage'
import heroImage from '../../assets/hero.png'
import '../../styles/electricity-history.css'

const defaultFilters = {
  searchValue: '',
  timeFilter: 'Tất cả thời gian',
  costFilter: 'Tất cả mức chi phí',
}

function getDisplayHistories() {
  const histories = getElectricityHistories()
  return histories.length > 0 ? histories : []
}

function isWithinDays(dateString, days) {
  if (!dateString) {
    return false
  }

  const checkedDate = new Date(dateString)

  if (Number.isNaN(checkedDate.getTime())) {
    return false
  }

  const today = new Date()
  const diffTime = today.getTime() - checkedDate.getTime()
  const diffDays = diffTime / (1000 * 60 * 60 * 24)

  return diffDays <= days
}

function ElectricityHistoryPage() {
  const navigate = useNavigate()
  const [histories, setHistories] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState(defaultFilters)
  const [appliedFilters, setAppliedFilters] = useState(defaultFilters)
  const [selectedHistory, setSelectedHistory] = useState(null)

  const { pathname } = useLocation()
  const canonicalUrl = `https://e-xanh.vercel.app${pathname}`

  useEffect(() => {
    async function fetchHistories() {
      const { getCurrentSession } = await import('../../services/authService')
      const session = await getCurrentSession()
      
      if (session?.user) {
        setHistories(getElectricityHistories(session.user.id))
      } else {
        setHistories(getElectricityHistories('guest'))
      }
      setLoading(false)
    }

    fetchHistories()
  }, [])

  const visibleHistories = useMemo(() => {
    return histories.filter((history) => {
      const keyword = appliedFilters.searchValue.trim().toLowerCase()
      const dateStr = history.checkedAt ?? history.date
      const matchesSearch =
        keyword.length === 0 ||
        (dateStr && formatHistoryDate(dateStr).toLowerCase().includes(keyword)) ||
        (history.highestDevice && history.highestDevice.toLowerCase().includes(keyword))

      const matchesTime =
        appliedFilters.timeFilter === 'Tất cả thời gian' ||
        (appliedFilters.timeFilter === '7 ngày gần đây' &&
          isWithinDays(dateStr, 7)) ||
        (appliedFilters.timeFilter === '30 ngày gần đây' &&
          isWithinDays(dateStr, 30))

      const matchesCost =
        appliedFilters.costFilter === 'Tất cả mức chi phí' ||
        (appliedFilters.costFilter === 'Dưới 400.000đ' && history.estimatedCost < 400000) ||
        (appliedFilters.costFilter === '400.000đ – 600.000đ' &&
          history.estimatedCost >= 400000 &&
          history.estimatedCost <= 600000) ||
        (appliedFilters.costFilter === 'Trên 600.000đ' && history.estimatedCost > 600000)

      return matchesSearch && matchesTime && matchesCost
    })
  }, [appliedFilters, histories])

  const stats = useMemo(() => {
    const latest = visibleHistories[0]
    const highestCost = visibleHistories.reduce(
      (current, item) =>
        item.estimatedCost > (current?.estimatedCost ?? 0) ? item : current,
      null,
    )
    const topDevice = visibleHistories.reduce((acc, item) => {
      if (!item.highestDevice) {
        return acc
      }

      acc[item.highestDevice] = (acc[item.highestDevice] ?? 0) + 1
      return acc
    }, {})

    const mostFrequentTopDevice =
      Object.entries(topDevice).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'Chưa có'

    return {
      count: visibleHistories.length,
      latestKwh: latest ? formatKwh(latest.totalKwh) : '0 kWh',
      highestCost: highestCost ? formatCurrency(highestCost.estimatedCost) : '0đ',
      highestDevice: mostFrequentTopDevice,
    }
  }, [visibleHistories])

  async function handleDelete(id) {
    const { getCurrentSession } = await import('../../services/authService')
    const session = await getCurrentSession()
    
    if (session?.user) {
      const next = deleteElectricityHistory(id, session.user.id)
      setHistories(next)
    } else {
      const next = deleteElectricityHistory(id, 'guest')
      setHistories(next)
    }

    if (selectedHistory?.id === id) {
      setSelectedHistory(null)
    }
  }

  async function handleDeleteAll() {
    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử kiểm tra điện không? Thao tác này không thể hoàn tác.')) {
      const { getCurrentSession } = await import('../../services/authService')
      const session = await getCurrentSession()
      
      if (session?.user) {
        setHistories(clearElectricityHistories(session.user.id))
      } else {
        setHistories(clearElectricityHistories('guest'))
      }
      setSelectedHistory(null)
    }
  }

  function handleResetFilters() {
    setFilters(defaultFilters)
    setAppliedFilters(defaultFilters)
  }

  function handleRecalculate(history) {
    const itemsToReuse = history.items.map((item) => ({
      deviceName: item.deviceName,
      power: item.power,
      hoursPerDay: item.hoursPerDay,
      daysPerMonth: item.daysPerMonth,
    }))

    setRecalculateDevices(itemsToReuse)
    setScrollToResultFlag()
    navigate('/kiem-tra-tien-dien')
  }

  if (loading) {
    return (
      <div className="electricity-history-page">
        <div style={{ padding: '60px', textAlign: 'center', color: '#666' }}>
          Đang tải dữ liệu lịch sử...
        </div>
      </div>
    )
  }

  const fallbackSummary = electricityHistory.slice(0, 3)

  return (
    <>
      <Helmet>
        <title>Lịch sử kiểm tra tiền điện - E-XANH</title>
        <meta name="description" content="Xem lại các lần kiểm tra tiền điện, so sánh mức tiêu thụ và theo dõi chi phí hằng tháng của bạn." />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="electricity-history-page">
      <div className="electricity-history-page__breadcrumb">
        <Link to="/">Trang chủ</Link>
        <span>{'>'}</span>
        <span>Lịch sử kiểm tra</span>
      </div>

      <section className="electricity-history-hero">
        <div className="electricity-history-hero__content">
          <h1>Lịch sử kiểm tra tiền điện</h1>
          <p>
            Xem lại các lần kiểm tra tiền điện, so sánh mức tiêu thụ và theo dõi chi phí hằng tháng của bạn.
          </p>
          <Link className="btn btn--primary" to="/kiem-tra-tien-dien">
            Kiểm tra mới
          </Link>
        </div>

        <div className="electricity-history-hero__visual">
          <img
            src={heroImage}
            alt="Minh họa lịch sử kiểm tra điện năng"
          />
        </div>
      </section>

      <section className="electricity-history-stats">
        <article className="electricity-history-stats__card">
          <span>Số lần kiểm tra</span>
          <strong>{stats.count}</strong>
        </article>
        <article className="electricity-history-stats__card">
          <span>Tổng điện năng gần nhất</span>
          <strong>{stats.latestKwh}</strong>
        </article>
        <article className="electricity-history-stats__card">
          <span>Chi phí cao nhất</span>
          <strong>{stats.highestCost}</strong>
        </article>
        <article className="electricity-history-stats__card">
          <span>Thiết bị tốn điện nhiều nhất</span>
          <strong>{stats.highestDevice}</strong>
        </article>
      </section>

      <section className="electricity-history-filters">
        <input
          type="search"
          value={filters.searchValue}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              searchValue: event.target.value,
            }))
          }
          placeholder="Tìm lịch sử..."
        />

        <select
          value={filters.timeFilter}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              timeFilter: event.target.value,
            }))
          }
        >
          <option>Tất cả thời gian</option>
          <option>7 ngày gần đây</option>
          <option>30 ngày gần đây</option>
        </select>

        <select
          value={filters.costFilter}
          onChange={(event) =>
            setFilters((current) => ({
              ...current,
              costFilter: event.target.value,
            }))
          }
        >
          <option>Tất cả mức chi phí</option>
          <option>Dưới 400.000đ</option>
          <option>400.000đ – 600.000đ</option>
          <option>Trên 600.000đ</option>
        </select>

        <button
          type="button"
          className="btn btn--primary"
          onClick={() => setAppliedFilters(filters)}
        >
          Lọc lịch sử
        </button>

        <button type="button" className="btn electricity-history-filters__reset" onClick={handleResetFilters}>
          Làm mới
        </button>
      </section>

      {histories.length > 0 && (
        <div style={{ padding: '0 5%', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '0.85rem', color: '#666', margin: 0 }}>
            Lịch sử kiểm tra điện được lưu trên trình duyệt này. Bạn có thể xoá bất cứ lúc nào.
          </p>
          <button type="button" onClick={handleDeleteAll} style={{ background: 'none', border: 'none', color: '#e53935', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}>
            Xóa toàn bộ lịch sử
          </button>
        </div>
      )}

      {histories.length === 0 ? (
        <section className="electricity-history-empty">
          <span className="electricity-history-empty__icon">⚡</span>
          <h2>Bạn chưa có lịch sử kiểm tra tiền điện.</h2>
          <p>
            Hãy sử dụng công cụ kiểm tra tiền điện để lưu lại kết quả và theo dõi chi phí hằng tháng.
          </p>
          <Link className="btn btn--primary" to="/kiem-tra-tien-dien">
            Kiểm tra tiền điện ngay
          </Link>

          <div className="electricity-history-empty__fallback">
            <h3>Dữ liệu mẫu tham khảo</h3>
            {fallbackSummary.map((item) => (
              <div key={item.id} className="electricity-history-empty__fallback-item">
                <span>{item.date}</span>
                <strong>{formatCurrency(item.estimatedCost)}</strong>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="electricity-history-layout">
          <section className="electricity-history-list">
            {visibleHistories.length > 0 ? (
              visibleHistories.map((history) => (
                <article key={history.id} className="electricity-history-card">
                  <div className="electricity-history-card__top">
                    <div>
                      <h2>{formatHistoryDate(history.checkedAt ?? history.date)}</h2>
                      <p>{history.deviceCount} thiết bị được kiểm tra</p>
                    </div>
                    <div className="electricity-history-card__cost">
                      <strong>{formatCurrency(history.estimatedCost)}</strong>
                      <span>{formatKwh(history.totalKwh)}</span>
                    </div>
                  </div>

                  <div className="electricity-history-card__summary">
                    <span>Thiết bị tốn nhất: {history.highestDevice}</span>
                    <span>Tiềm năng tiết kiệm: {history.savingPercent}</span>
                  </div>

                  <div className="electricity-history-card__actions">
                    <button type="button" onClick={() => setSelectedHistory(history)}>
                      Xem chi tiết
                    </button>
                    <button
                      type="button"
                      title="Nạp lại thiết bị để tính lại"
                      onClick={() => handleRecalculate(history)}
                    >
                      Tính lại
                    </button>
                    <button
                      type="button"
                      className="electricity-history-card__delete"
                      onClick={() => handleDelete(history.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="electricity-history-list__empty">
                <h2>Không có lịch sử phù hợp</h2>
                <p>Hãy thử đổi bộ lọc hoặc làm mới để xem lại toàn bộ lịch sử đã lưu.</p>
              </div>
            )}
          </section>

          <aside className="electricity-history-side">
            <section className="electricity-history-side__card">
              <h2>Thiết bị tốn điện nhất</h2>
              <div className="electricity-history-side__rankings">
                {visibleHistories.slice(0, 3).map((item, index) => (
                  <div key={item.id} className="electricity-history-side__ranking">
                    <span>{index + 1}</span>
                    <div>
                      <strong>{item.highestDevice}</strong>
                      <div className="electricity-history-side__bar">
                        <span style={{ width: `${Math.max(35, 100 - index * 25)}%` }}></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="electricity-history-side__card electricity-history-side__card--tips">
              <h2>Gợi ý tiết kiệm</h2>
              <ul>
                <li>Đặt điều hòa 26–28°C và kết hợp quạt.</li>
                <li>Rút sạc laptop khi đã đầy pin.</li>
                <li>Tắt các thiết bị ở chế độ chờ (standby).</li>
              </ul>
              <Link className="btn btn--primary" to="/meo-tiet-kiem">
                Xem mẹo tiết kiệm
              </Link>
            </section>
          </aside>
        </div>
      )}

      {selectedHistory ? (
        <div className="electricity-history-modal">
          <div className="electricity-history-modal__backdrop" onClick={() => setSelectedHistory(null)}></div>
          <div className="electricity-history-modal__panel">
            <div className="electricity-history-modal__header">
              <h2>Chi tiết kiểm tra</h2>
              <button type="button" onClick={() => setSelectedHistory(null)}>
                Đóng
              </button>
            </div>

            <div className="electricity-history-modal__summary">
              <div>
                <span>Ngày kiểm tra</span>
                <strong>{formatHistoryDate(selectedHistory.checkedAt ?? selectedHistory.date)}</strong>
              </div>
              <div>
                <span>Tổng thiết bị</span>
                <strong>{selectedHistory.deviceCount}</strong>
              </div>
              <div>
                <span>Tổng điện năng</span>
                <strong>{formatKwh(selectedHistory.totalKwh)}</strong>
              </div>
              <div>
                <span>Chi phí dự kiến</span>
                <strong>{formatCurrency(selectedHistory.estimatedCost)}</strong>
              </div>
              <div>
                <span>Thiết bị tốn nhất</span>
                <strong>{selectedHistory.highestDevice}</strong>
              </div>
            </div>

            <div className="electricity-history-modal__items">
              {selectedHistory.items.map((item) => (
                <article key={`${selectedHistory.id}-${item.deviceName}`} className="electricity-history-modal__item">
                  <h3>{item.deviceName}</h3>
                  <p>
                    {item.power}W • {item.hoursPerDay}h/ngày • {item.daysPerMonth} ngày/tháng
                  </p>
                  <strong>{formatKwh(item.kwh)}</strong>
                </article>
              ))}
            </div>

            <div className="electricity-history-modal__tips">
              <h3>Gợi ý tiết kiệm</h3>
              <p>
                Hãy ưu tiên giảm thời gian sử dụng của thiết bị tốn điện nhất và áp dụng
                các mẹo tiết kiệm ở trang công cụ để tối ưu chi phí tháng tới.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
    </>
  )
}

export default ElectricityHistoryPage
