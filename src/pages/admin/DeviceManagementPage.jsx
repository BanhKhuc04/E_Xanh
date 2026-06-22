import { useState, useCallback, useEffect } from 'react'
import { 
  getAllDevicesAdmin, 
  createDevice, 
  updateDevice, 
  bulkUpdateDeviceVisibility, 
  bulkDeleteDevices 
} from '../../services/deviceService'
import AdminDeviceStats from '../../components/admin/devices/AdminDeviceStats'
import AdminDeviceFilter from '../../components/admin/devices/AdminDeviceFilter'
import AdminDeviceBulkAction from '../../components/admin/devices/AdminDeviceBulkAction'
import AdminDeviceList from '../../components/admin/devices/AdminDeviceList'
import AdminDeviceFormDrawer from '../../components/admin/devices/AdminDeviceFormDrawer'
import AdminDeviceTipsCard from '../../components/admin/devices/AdminDeviceTipsCard'
import '../../styles/admin-devices.css'

const levelLabelToKey = {
  'Thấp': 'low',
  'Trung bình': 'medium',
  'Cao': 'high',
}

const statusLabelToKey = {
  'Đang dùng': 'active',
  'Đã ẩn': 'hidden',
}

function DeviceManagementPage() {
  const [devices, setDevices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [group, setGroup] = useState('Tất cả')
  const [level, setLevel] = useState('Tất cả')
  const [status, setStatus] = useState('Tất cả')
  const [selectedIds, setSelectedIds] = useState([])
  const [drawerMode, setDrawerMode] = useState(null) // null | 'add' | 'edit'
  const [editDeviceId, setEditDeviceId] = useState(null)
  const [toast, setToast] = useState('')

  const showToast = useCallback((message) => {
    setToast(message)
    setTimeout(() => setToast(''), 2500)
  }, [])

  const loadDevices = useCallback(async () => {
    const { data, error } = await getAllDevicesAdmin()
    if (!error && data) {
      setDevices(data)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDevices()
  }, [loadDevices])

  const computedStats = [
    {
      label: 'Tổng thiết bị',
      value: devices.length,
      icon: 'total',
      accent: 'success',
    },
    {
      label: 'Thiết bị đang dùng',
      value: devices.filter((device) => device.is_visible).length,
      icon: 'active',
      accent: 'highlight',
    },
    {
      label: 'Tiêu thụ cao',
      value: devices.filter((device) => Number(device.default_power) > 800).length,
      icon: 'high',
      accent: 'warning',
    },
    {
      label: 'Có mẹo tiết kiệm',
      value: devices.filter((device) => String(device.tips || '').trim()).length,
      icon: 'tips',
      accent: 'muted',
    },
  ]

  const topTips = devices
    .map((device) => device.tips)
    .filter(Boolean)
    .slice(0, 4)

  const filteredDevices = devices.filter((device) => {
    const matchSearch =
      search === '' ||
      device.name.toLowerCase().includes(search.toLowerCase())

    const matchGroup =
      group === 'Tất cả' || device.category === group

    let deviceLevelKey = 'low'
    if (device.default_power > 800) deviceLevelKey = 'high'
    else if (device.default_power > 100) deviceLevelKey = 'medium'

    const matchLevel =
      level === 'Tất cả' || deviceLevelKey === levelLabelToKey[level]

    let deviceStatusKey = device.is_visible ? 'active' : 'hidden'
    const matchStatus =
      status === 'Tất cả' || deviceStatusKey === statusLabelToKey[status]

    return matchSearch && matchGroup && matchLevel && matchStatus
  })

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }

  const handleSelectAll = () => {
    const allFilteredIds = filteredDevices.map((d) => d.id)
    const allSelected = allFilteredIds.every((id) => selectedIds.includes(id))
    if (allSelected) {
      setSelectedIds((prev) =>
        prev.filter((id) => !allFilteredIds.includes(id)),
      )
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...allFilteredIds])])
    }
  }

  const handleQuickToggleStatus = async (id) => {
    const device = devices.find((d) => d.id === id)
    if (!device) return
    const newStatus = !device.is_visible
    
    // Optimistic update
    setDevices(prev => prev.map(d => d.id === id ? { ...d, is_visible: newStatus } : d))
    
    const { error } = await updateDevice(id, { is_visible: newStatus })
    if (error) {
      // Revert if error
      setDevices(prev => prev.map(d => d.id === id ? { ...d, is_visible: !newStatus } : d))
      showToast('Lỗi cập nhật thiết bị.')
      return
    }
    showToast(`Đã ${newStatus ? 'hiện' : 'ẩn'} thiết bị.`)
  }

  const handleDrawerToggleStatus = async (id) => {
    const device = devices.find((d) => d.id === id)
    if (!device) return
    const newStatus = !device.is_visible
    
    setDevices(prev => prev.map(d => d.id === id ? { ...d, is_visible: newStatus } : d))
    setDrawerMode(null)
    setEditDeviceId(null)
    
    const { error } = await updateDevice(id, { is_visible: newStatus })
    if (error) {
      setDevices(prev => prev.map(d => d.id === id ? { ...d, is_visible: !newStatus } : d))
      showToast('Lỗi cập nhật thiết bị.')
      return
    }
    showToast(`Đã ${newStatus ? 'hiện' : 'ẩn'} thiết bị.`)
  }

  const handleSave = async (formData) => {
    if (drawerMode === 'edit' && editDeviceId) {
      const { error } = await updateDevice(editDeviceId, formData)
      if (!error) {
        setDevices((prev) =>
          prev.map((d) =>
            d.id === editDeviceId ? { ...d, ...formData } : d,
          ),
        )
        showToast('Đã cập nhật thiết bị.')
      } else {
        showToast('Lỗi cập nhật thiết bị.')
      }
    } else {
      const { data, error } = await createDevice(formData)
      if (!error && data) {
        setDevices((prev) => [data, ...prev])
        showToast('Đã thêm thiết bị mới.')
      } else {
        showToast('Lỗi thêm thiết bị mới.')
      }
    }
    setDrawerMode(null)
    setEditDeviceId(null)
  }

  const handleBulkHide = async () => {
    const ids = [...selectedIds]
    setDevices((prev) =>
      prev.map((d) =>
        ids.includes(d.id) ? { ...d, is_visible: false } : d,
      ),
    )
    setSelectedIds([])
    
    const { error } = await bulkUpdateDeviceVisibility(ids, false)
    if (error) {
      setDevices((prev) =>
        prev.map((d) =>
          ids.includes(d.id) ? { ...d, is_visible: true } : d,
        ),
      )
      showToast('Lỗi ẩn thiết bị.')
      return
    }
    showToast('Đã ẩn các thiết bị đã chọn.')
  }

  const handleBulkShow = async () => {
    const ids = [...selectedIds]
    setDevices((prev) =>
      prev.map((d) =>
        ids.includes(d.id) ? { ...d, is_visible: true } : d,
      ),
    )
    setSelectedIds([])
    
    const { error } = await bulkUpdateDeviceVisibility(ids, true)
    if (error) {
      setDevices((prev) =>
        prev.map((d) =>
          ids.includes(d.id) ? { ...d, is_visible: false } : d,
        ),
      )
      showToast('Lỗi hiện thiết bị.')
      return
    }
    showToast('Đã hiện lại các thiết bị đã chọn.')
  }

  const handleBulkDelete = async () => {
    const ids = [...selectedIds]
    const { error } = await bulkDeleteDevices(ids)
    if (error) {
      showToast('Lỗi xóa thiết bị.')
      return
    }
    setDevices((prev) => prev.filter((d) => !ids.includes(d.id)))
    setSelectedIds([])
    showToast('Đã xóa các thiết bị đã chọn.')
  }

  const handleReset = () => {
    setSearch('')
    setGroup('Tất cả')
    setLevel('Tất cả')
    setStatus('Tất cả')
    setSelectedIds([])
  }

  const openAddDrawer = () => {
    setDrawerMode('add')
    setEditDeviceId(null)
  }

  const openEditDrawer = (id) => {
    setDrawerMode('edit')
    setEditDeviceId(id)
  }

  const closeDrawer = () => {
    setDrawerMode(null)
    setEditDeviceId(null)
  }

  const drawerDevice =
    drawerMode === 'edit'
      ? devices.find((d) => d.id === editDeviceId) ?? null
      : null

  return (
    <div className="ad-page page">
      <section className="ad-page__hero">
        <span className="page-badge page-badge--soft">
          Quản lý hệ thống
        </span>
        <div className="ad-page__hero-copy">
          <h2>Quản lý thiết bị điện</h2>
          <p>
            Cập nhật thiết bị, công suất và gợi ý tiết kiệm dùng trong công cụ
            kiểm tra tiền điện.
          </p>
        </div>
      </section>

      <AdminDeviceStats stats={computedStats} />

      <AdminDeviceFilter
        search={search}
        onSearchChange={setSearch}
        group={group}
        onGroupChange={setGroup}
        level={level}
        onLevelChange={setLevel}
        status={status}
        onStatusChange={setStatus}
        onFilter={() => showToast('Bộ lọc đã được áp dụng tự động.', 'warning')}
        onReset={handleReset}
      />

      <AdminDeviceBulkAction
        selectedCount={selectedIds.length}
        onBulkHide={handleBulkHide}
        onBulkShow={handleBulkShow}
        onBulkDelete={handleBulkDelete}
      />

      {isLoading ? (
        <div style={{ marginTop: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px', marginBottom: '24px' }}>
            <div style={{ height: '90px', background: 'rgba(255,255,255,0.7)', borderRadius: '18px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
            <div style={{ height: '90px', background: 'rgba(255,255,255,0.7)', borderRadius: '18px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
            <div style={{ height: '90px', background: 'rgba(255,255,255,0.7)', borderRadius: '18px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
            <div style={{ height: '90px', background: 'rgba(255,255,255,0.7)', borderRadius: '18px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
          </div>
          <div style={{ height: '60px', background: 'rgba(255,255,255,0.7)', borderRadius: '18px', marginBottom: '18px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ height: '60px', background: 'rgba(255,255,255,0.7)', borderRadius: '12px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
            <div style={{ height: '60px', background: 'rgba(255,255,255,0.7)', borderRadius: '12px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
            <div style={{ height: '60px', background: 'rgba(255,255,255,0.7)', borderRadius: '12px', animation: 'pulse 1.5s infinite ease-in-out' }}></div>
          </div>
        </div>
      ) : (
        <AdminDeviceList
          devices={filteredDevices}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onSelectAll={handleSelectAll}
          onEdit={openEditDrawer}
          onQuickToggleStatus={handleQuickToggleStatus}
          onAddDevice={openAddDrawer}
        />
      )}

      <AdminDeviceTipsCard tips={topTips.length ? topTips : ['Chưa có mẹo tiết kiệm nào trong dữ liệu thiết bị hiện tại.']} />

      {drawerMode && (
        <AdminDeviceFormDrawer
          key={editDeviceId ?? 'new'}
          device={drawerDevice}
          onClose={closeDrawer}
          onSave={handleSave}
          onToggleStatus={handleDrawerToggleStatus}
        />
      )}

      {toast && (
        <div className="ad-toast" role="alert" aria-live="assertive">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 12.5 10 15l7-7M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
          </svg>
          {toast}
        </div>
      )}
    </div>
  )
}

export default DeviceManagementPage
