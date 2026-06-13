import { useState, useCallback, useEffect } from 'react'
import {
  adminDeviceStats,
  savingTipsHighlight,
} from '../../data/adminDevices'
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
    showToast(`Đã ${newStatus ? 'hiện' : 'ẩn'} thiết bị.`)
    
    await updateDevice(id, { is_visible: newStatus })
  }

  const handleDrawerToggleStatus = async (id) => {
    const device = devices.find((d) => d.id === id)
    if (!device) return
    const newStatus = !device.is_visible
    
    setDevices(prev => prev.map(d => d.id === id ? { ...d, is_visible: newStatus } : d))
    setDrawerMode(null)
    setEditDeviceId(null)
    showToast(`Đã ${newStatus ? 'hiện' : 'ẩn'} thiết bị.`)
    
    await updateDevice(id, { is_visible: newStatus })
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
    setDevices((prev) =>
      prev.map((d) =>
        selectedIds.includes(d.id) ? { ...d, is_visible: false } : d,
      ),
    )
    showToast('Đã ẩn các thiết bị đã chọn.')
    const ids = [...selectedIds]
    setSelectedIds([])
    await bulkUpdateDeviceVisibility(ids, false)
  }

  const handleBulkShow = async () => {
    setDevices((prev) =>
      prev.map((d) =>
        selectedIds.includes(d.id) ? { ...d, is_visible: true } : d,
      ),
    )
    showToast('Đã hiện lại các thiết bị đã chọn.')
    const ids = [...selectedIds]
    setSelectedIds([])
    await bulkUpdateDeviceVisibility(ids, true)
  }

  const handleBulkDelete = async () => {
    setDevices((prev) => prev.filter((d) => !selectedIds.includes(d.id)))
    showToast('Đã xóa các thiết bị đã chọn.')
    const ids = [...selectedIds]
    setSelectedIds([])
    await bulkDeleteDevices(ids)
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

      <AdminDeviceStats stats={adminDeviceStats} />

      <AdminDeviceFilter
        search={search}
        onSearchChange={setSearch}
        group={group}
        onGroupChange={setGroup}
        level={level}
        onLevelChange={setLevel}
        status={status}
        onStatusChange={setStatus}
        onFilter={() => alert('Bộ lọc đã được tự động áp dụng.')}
        onReset={handleReset}
      />

      <AdminDeviceBulkAction
        selectedCount={selectedIds.length}
        onBulkHide={handleBulkHide}
        onBulkShow={handleBulkShow}
        onBulkDelete={handleBulkDelete}
      />

      {isLoading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Đang tải dữ liệu thiết bị...
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

      <AdminDeviceTipsCard tips={savingTipsHighlight} />

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
