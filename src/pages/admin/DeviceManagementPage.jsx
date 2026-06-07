import { useState, useCallback } from 'react'
import {
  adminDevices as initialDevices,
  adminDeviceStats,
  deviceStatusMap,
  savingTipsHighlight,
} from '../../data/adminDevices'
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

let nextId = 100

function DeviceManagementPage() {
  const [devices, setDevices] = useState(initialDevices)
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

  const filteredDevices = devices.filter((device) => {
    const matchSearch =
      search === '' ||
      device.name.toLowerCase().includes(search.toLowerCase())

    const matchGroup =
      group === 'Tất cả' || device.group === group

    const matchLevel =
      level === 'Tất cả' || device.level === levelLabelToKey[level]

    const matchStatus =
      status === 'Tất cả' || device.status === statusLabelToKey[status]

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

  const handleChangeStatus = (id, newStatus) => {
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d)),
    )
    showToast(
      `Đã cập nhật thiết bị: ${deviceStatusMap[newStatus]?.label ?? newStatus}.`,
    )
  }

  const handleQuickToggleStatus = (id) => {
    const device = devices.find((d) => d.id === id)
    if (!device) return
    const newStatus = device.status === 'hidden' ? 'active' : 'hidden'
    handleChangeStatus(id, newStatus)
  }

  const handleDrawerToggleStatus = (id) => {
    const device = devices.find((d) => d.id === id)
    if (!device) return
    const newStatus = device.status === 'hidden' ? 'active' : 'hidden'
    setDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: newStatus } : d)),
    )
    setDrawerMode(null)
    setEditDeviceId(null)
    showToast(
      `Đã cập nhật thiết bị: ${deviceStatusMap[newStatus]?.label ?? newStatus}.`,
    )
  }

  const handleSave = (formData) => {
    if (drawerMode === 'edit' && editDeviceId) {
      setDevices((prev) =>
        prev.map((d) =>
          d.id === editDeviceId ? { ...d, ...formData } : d,
        ),
      )
      showToast('Đã cập nhật thiết bị.')
    } else {
      nextId += 1
      const newDevice = {
        id: `dev-new-${nextId}`,
        ...formData,
      }
      setDevices((prev) => [newDevice, ...prev])
      showToast('Đã thêm thiết bị mới.')
    }
    setDrawerMode(null)
    setEditDeviceId(null)
  }

  const handleBulkHide = () => {
    setDevices((prev) =>
      prev.map((d) =>
        selectedIds.includes(d.id) ? { ...d, status: 'hidden' } : d,
      ),
    )
    setSelectedIds([])
    showToast('Đã ẩn các thiết bị đã chọn.')
  }

  const handleBulkShow = () => {
    setDevices((prev) =>
      prev.map((d) =>
        selectedIds.includes(d.id) ? { ...d, status: 'active' } : d,
      ),
    )
    setSelectedIds([])
    showToast('Đã hiện lại các thiết bị đã chọn.')
  }

  const handleBulkDelete = () => {
    setDevices((prev) => prev.filter((d) => !selectedIds.includes(d.id)))
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
        onFilter={() => {}}
        onReset={handleReset}
      />

      <AdminDeviceBulkAction
        selectedCount={selectedIds.length}
        onBulkHide={handleBulkHide}
        onBulkShow={handleBulkShow}
        onBulkDelete={handleBulkDelete}
      />

      <AdminDeviceList
        devices={filteredDevices}
        selectedIds={selectedIds}
        onToggleSelect={handleToggleSelect}
        onSelectAll={handleSelectAll}
        onEdit={openEditDrawer}
        onQuickToggleStatus={handleQuickToggleStatus}
        onAddDevice={openAddDrawer}
      />

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
