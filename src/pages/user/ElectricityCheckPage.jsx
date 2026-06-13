import { useEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import DeviceInputForm from '../../components/electricity/DeviceInputForm'
import DeviceUsageList from '../../components/electricity/DeviceUsageList'
import ElectricityBreakdown from '../../components/electricity/ElectricityBreakdown'
import ElectricityResultCard from '../../components/electricity/ElectricityResultCard'
import RecentElectricityHistory from '../../components/electricity/RecentElectricityHistory'
import SavingSuggestions from '../../components/electricity/SavingSuggestions'
import {
  calculateDeviceKwh,
  deviceOptions,
  electricityHistory,
  electricitySampleDevices,
  formatKwh,
  getDefaultPowerByName,
  getDeviceTone,
  heroHighlights,
  savingSuggestions,
} from '../../data/electricity'
import {
  clearScrollToResultFlag,
  clearRecalculateDevices,
  getScrollToResultFlag,
  getRecalculateDevices,
  saveElectricityHistory,
} from '../../utils/electricityStorage'
import '../../styles/electricity-check.css'

function buildDevice(device) {
  const kwh = calculateDeviceKwh(device)

  return {
    ...device,
    kwh,
  }
}

function createInitialForm() {
  return {
    name: 'Điều hòa 9000BTU',
    power: getDefaultPowerByName('Điều hòa 9000BTU'),
    hoursPerDay: '',
    daysPerMonth: '',
  }
}

function buildDeviceFromHistory(item) {
  const deviceName = item.deviceName ?? item.name ?? 'Thiết bị khác'

  return buildDevice({
    id: `${deviceName}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: deviceName,
    power: Number(item.power),
    hoursPerDay: Number(item.hoursPerDay),
    daysPerMonth: Number(item.daysPerMonth),
    tone: getDeviceTone(deviceName),
  })
}

function getInitialElectricityState() {
  const recalculateDevices = getRecalculateDevices()
  const shouldScrollToResult = getScrollToResultFlag()

  if (recalculateDevices.length > 0) {
    clearRecalculateDevices()

    return {
      devices: recalculateDevices.map(buildDeviceFromHistory),
      notice: 'Đã nạp lại dữ liệu từ lịch sử kiểm tra.',
      shouldScrollToResult,
    }
  }

  return {
    devices: electricitySampleDevices.map(buildDevice),
    notice: '',
    shouldScrollToResult: false,
  }
}

function ElectricityCheckPage() {
  const resultRef = useRef(null)
  const [{ devices: initialDevices, notice: initialNotice, shouldScrollToResult }] = useState(() =>
    getInitialElectricityState(),
  )
  const [devices, setDevices] = useState(initialDevices)
  const [form, setForm] = useState(createInitialForm())
  const [feedbackMessage, setFeedbackMessage] = useState(initialNotice)
  const [isSavingHistory, setIsSavingHistory] = useState(false)

  const [dbDeviceOptions, setDbDeviceOptions] = useState(deviceOptions)

  useEffect(() => {
    async function loadDevices() {
      const { getVisibleDevices } = await import('../../services/electricityService')
      const { data } = await getVisibleDevices()
      if (data && data.length > 0) {
        const options = data.map((d) => ({
          label: d.name,
          value: d.name,
          defaultPower: d.default_power,
          tone: d.icon === 'snowflake' ? 'teal' : d.icon === 'laptop' ? 'lime' : 'green',
        }))
        // Ensure "Khác" is always at the bottom
        options.push({ label: 'Khác', value: 'Khác', defaultPower: '', tone: 'gray' })
        setDbDeviceOptions(options)
      }
    }
    loadDevices()
  }, [])

  useEffect(() => {
    if (!feedbackMessage) {
      return undefined
    }

    const timeoutId = window.setTimeout(() => {
      setFeedbackMessage('')
    }, 2500)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [feedbackMessage])

  useEffect(() => {
    if (!shouldScrollToResult) {
      return undefined
    }

    const frameId = window.requestAnimationFrame(() => {
      resultRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
      clearScrollToResultFlag()
    })

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [shouldScrollToResult])

  const summary = useMemo(() => {
    const totalKwh = devices.reduce((sum, item) => sum + item.kwh, 0)
    const estimatedCost = totalKwh * 2400
    const topDevice = devices.reduce(
      (currentTop, item) => (item.kwh > (currentTop?.kwh ?? 0) ? item : currentTop),
      null,
    )

    const breakdown = devices.map((item) => ({
      ...item,
      percent: totalKwh > 0 ? Math.round((item.kwh / totalKwh) * 1000) / 10 : 0,
    }))

    return {
      totalKwh,
      estimatedCost,
      topDevice,
      breakdown: breakdown.map((item) => ({
        ...item,
        percent: Math.round(item.percent),
      })),
      savingRange: totalKwh > 0 ? '15–20%' : '0%',
    }
  }, [devices])

  function handleFormChange(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  function handleSelectDevice(name) {
    const defaultPower = dbDeviceOptions.find(d => d.value === name)?.defaultPower ?? ''
    setForm((current) => ({
      ...current,
      name,
      power: defaultPower,
    }))
  }

  function handleAddDevice(event) {
    event.preventDefault()

    if (!form.name || !form.power || !form.hoursPerDay || !form.daysPerMonth) {
      setFeedbackMessage('Vui lòng nhập đầy đủ thông tin thiết bị.')
      return
    }

    const power = Number(form.power)
    const hours = Number(form.hoursPerDay)
    const days = Number(form.daysPerMonth)

    if (isNaN(power) || power <= 0) {
      setFeedbackMessage('Công suất phải là số lớn hơn 0.')
      return
    }

    if (isNaN(hours) || hours <= 0 || hours > 24) {
      setFeedbackMessage('Số giờ dùng mỗi ngày phải lớn hơn 0 và tối đa 24.')
      return
    }

    if (isNaN(days) || days <= 0 || days > 31) {
      setFeedbackMessage('Số ngày dùng mỗi tháng phải lớn hơn 0 và tối đa 31.')
      return
    }

    const tone = dbDeviceOptions.find(d => d.value === form.name)?.tone ?? 'green'

    const nextDevice = buildDevice({
      id: `${form.name}-${Date.now()}`,
      name: form.name,
      power,
      hoursPerDay: hours,
      daysPerMonth: days,
      tone,
    })

    setDevices((current) => [...current, nextDevice])
    setForm(createInitialForm())
    setFeedbackMessage('')
  }

  function handleRemoveDevice(id) {
    setDevices((current) => current.filter((item) => item.id !== id))
  }

  function handleReset() {
    setDevices(electricitySampleDevices.map(buildDevice))
    setForm(createInitialForm())
    setFeedbackMessage('')
  }

  function handleScrollToResult() {
    document.getElementById('ket-qua-dien')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  async function handleSaveHistory() {
    if (devices.length === 0 || isSavingHistory) {
      return
    }

    setIsSavingHistory(true)
    const { getCurrentSession } = await import('../../services/authService')
    const session = await getCurrentSession()

    if (session?.user) {
      const { saveElectricityCheck } = await import('../../services/electricityService')
      const { error } = await saveElectricityCheck({ summary, devices })
      if (error) {
        setFeedbackMessage('Lỗi lưu lịch sử: ' + error.message)
      } else {
        setFeedbackMessage('Đã lưu lịch sử kiểm tra lên hệ thống')
      }
    } else {
      const historyPayload = {
        id: `history-${Date.now()}`,
        checkedAt: new Date().toISOString().slice(0, 10),
        deviceCount: devices.length,
        totalKwh: Number(summary.totalKwh.toFixed(1)),
        estimatedCost: Math.round(summary.estimatedCost),
        highestDevice: summary.topDevice?.name ?? '',
        savingPercent: summary.savingRange,
        items: devices.map((device) => ({
          deviceName: device.name,
          power: device.power,
          hoursPerDay: device.hoursPerDay,
          daysPerMonth: device.daysPerMonth,
          kwh: Number(device.kwh.toFixed(1)),
        })),
      }

      saveElectricityHistory(historyPayload)
      setFeedbackMessage('Đã lưu lịch sử kiểm tra cục bộ (hãy đăng nhập để đồng bộ)')
    }
    setIsSavingHistory(false)
  }

  const { pathname } = useLocation()
  const canonicalUrl = `https://e-xanh.vercel.app${pathname}`
  const OG_IMAGE = 'https://e-xanh.vercel.app/og-image.png'

  return (
    <div className="electricity-page">
      <Helmet>
        <title>Kiểm tra tiền điện — E-XANH</title>
        <meta name="description" content="Công cụ tính toán và dự báo tiền điện hàng tháng miễn phí. Nhập các thiết bị điện trong nhà để biết ngay số điện tiêu thụ và gợi ý tiết kiệm." />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Kiểm tra tiền điện — E-XANH" />
        <meta property="og:description" content="Công cụ tính toán tiền điện miễn phí. Biết ngay bạn đang dùng bao nhiêu kWh mỗi tháng và cách giảm hóa đơn điện." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <section className="electricity-hero">
        <div className="electricity-hero__content">
          <span className="electricity-hero__badge">{heroHighlights.badge}</span>
          <h1>{heroHighlights.title}</h1>
          <p>{heroHighlights.description}</p>
          <div className="electricity-hero__actions">
            <a className="btn btn--primary" href="#cong-cu-dien">
              Bắt đầu tính
            </a>
            <a className="btn electricity-hero__secondary" href="#cach-tinh">
              Xem cách hoạt động
            </a>
          </div>
        </div>

        <div className="electricity-hero__visual">
          <img src={heroHighlights.image} alt="Minh họa bảng điều khiển điện năng E-XANH" />
          <div className="electricity-floating electricity-floating--cost">
            <span>Dự kiến</span>
            <strong>520.000đ/tháng</strong>
          </div>
          <div className="electricity-floating electricity-floating--top">
            <span>Tốn nhất</span>
            <strong>Điều hòa</strong>
          </div>
          <div className="electricity-floating electricity-floating--save">
            <span>Tiết kiệm gợi ý</span>
            <strong>15%</strong>
          </div>
        </div>
      </section>

      <section id="cong-cu-dien" className="electricity-tool-layout">
        <div className="electricity-tool-layout__left">
          <DeviceInputForm
            form={form}
            deviceOptions={dbDeviceOptions}
            onChange={handleFormChange}
            onSelectDevice={handleSelectDevice}
            onSubmit={handleAddDevice}
          />

          <DeviceUsageList devices={devices} onRemove={handleRemoveDevice} />

          <div className="electricity-tool-layout__buttons">
            <button
              type="button"
              className="btn btn--primary electricity-tool-layout__primary"
              onClick={handleScrollToResult}
            >
              Tính tiền điện
            </button>
            <button type="button" className="btn electricity-tool-layout__reset" onClick={handleReset}>
              Làm mới
            </button>
          </div>

          <div className="electricity-tool-layout__save">
            <button
              type="button"
              className="btn electricity-tool-layout__save-button"
              onClick={handleSaveHistory}
              disabled={devices.length === 0 || isSavingHistory}
            >
              {isSavingHistory ? 'Đang lưu...' : 'Lưu lịch sử'}
            </button>
            {feedbackMessage ? (
              <span className="electricity-tool-layout__save-message">{feedbackMessage}</span>
            ) : null}
          </div>
        </div>

        <div ref={resultRef} className="electricity-tool-layout__right">
          <ElectricityResultCard summary={summary} />
          <ElectricityBreakdown items={summary.breakdown} />
        </div>
      </section>

      <SavingSuggestions suggestions={savingSuggestions} />
      <RecentElectricityHistory history={electricityHistory} />

      <section id="cach-tinh" className="electricity-formula">
        <div className="electricity-formula__header">
          <h2>E-XANH tính như thế nào?</h2>
          <p>Số điện tiêu thụ = Công suất thiết bị × Thời gian sử dụng / 1000</p>
        </div>

        <div className="electricity-formula__box">
          <div className="electricity-formula__equation">
            <span>Số điện tiêu thụ (kWh)</span>
            <strong>Công suất (W) × Thời gian (h)</strong>
            <b>1000</b>
          </div>
          <div className="electricity-formula__example">
            <p>
              Điều hòa 850W dùng 8 giờ/ngày trong 30 ngày sẽ tiêu thụ khoảng{' '}
              <strong>{formatKwh(calculateDeviceKwh(electricitySampleDevices[0]))}</strong>.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ElectricityCheckPage
