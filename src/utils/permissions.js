export function isAdmin(profile) {
  return profile?.role === 'admin';
}

export function isStaff(profile) {
  return ['admin', 'moderator'].includes(profile?.role);
}

export function assertAdmin(profile) {
  if (!isAdmin(profile)) {
    throw new Error('Bạn không có quyền quản trị.');
  }
}

export function assertStaff(profile) {
  if (!isStaff(profile)) {
    throw new Error('Bạn không có quyền thực hiện thao tác này.');
  }
}
