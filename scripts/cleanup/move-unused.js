import fs from 'fs';
import path from 'path';

const filesToMove = [
  "src/assets/branding/logo.png",
  "src/assets/react.svg",
  "src/assets/vite.svg",
  "src/components/account/AccountSettingsCard.jsx",
  "src/components/account/ChangePasswordModal.jsx",
  "src/components/account/EditProfileModal.jsx",
  "src/components/account/RecentElectricityHistoryCard.jsx",
  "src/components/admin/statistics/AdminActiveUsers.jsx",
  "src/data/adminSettings.js",
  "src/data/community.js",
  "src/lib/testSupabaseConnection.js",
  "src/services/adminStatsService.js",
  "src/utils/authStorage.js"
];

const archiveRoot = path.join(process.cwd(), '_archive/cleanup-2026-06');

filesToMove.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    const archivePath = path.join(archiveRoot, file);
    const archiveDir = path.dirname(archivePath);
    if (!fs.existsSync(archiveDir)) {
      fs.mkdirSync(archiveDir, { recursive: true });
    }
    fs.renameSync(fullPath, archivePath);
    console.log(`Moved ${file}`);
  }
});
