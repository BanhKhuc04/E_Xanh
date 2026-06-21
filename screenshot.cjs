const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const env = envFile.split('\n').reduce((acc, line) => {
  const [k, ...v] = line.split('=');
  if (k && v.length) acc[k.trim()] = v.join('=').trim().replace(/['"]/g, '');
  return acc;
}, {});

const outDir = 'C:\\Users\\khucv\\.gemini\\antigravity-ide\\brain\\bcad0735-5228-4117-9068-fd3c7f53e49a\\screenshots';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const routes = [
  '/', 
  '/meo-tiet-kiem', 
  '/meo-tiet-kiem/huong-dan-ve-sinh-dieu-hoa', 
  '/cong-dong', 
  '/dang-bai', 
  '/tai-khoan', 
  '/tai-khoan/cai-dat', 
  '/kiem-tra-tien-dien', 
  '/lich-su-kiem-tra', 
  '/bai-da-luu', 
  '/lien-he', 
  '/ve-chung-toi',
  '/admin',
  '/admin/quan-ly-bai-viet',
  '/admin/quan-ly-binh-luan',
  '/admin/quan-ly-nguoi-dung',
  '/admin/quan-ly-thiet-bi',
  '/admin/thong-ke',
  '/admin/thong-bao-he-thong',
  '/admin/cai-dat',
  '/admin/cai-dat-giao-dien'
];

(async () => {
  console.log('Authenticating...');
  const { data, error } = await supabase.auth.signInWithPassword({
    email: env.SEED_USER_EMAIL,
    password: env.SEED_USER_PASSWORD,
  });

  if (error) {
    console.error('Login failed:', error);
    process.exit(1);
  }

  const session = data.session;
  console.log('Logged in as', session.user.email);

  console.log('Launching browser...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Set session in local storage
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await page.evaluate((sessionInfo) => {
    const key = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (key) {
      localStorage.setItem(key, JSON.stringify(sessionInfo));
    } else {
      // try to guess the key
      const projectId = new URL(sessionInfo.supabaseUrl || 'https://mryhdocmbxnxmokpsxzl.supabase.co').hostname.split('.')[0];
      localStorage.setItem(`sb-${projectId}-auth-token`, JSON.stringify(sessionInfo));
    }
  }, session);

  for (const route of routes) {
    console.log('Screenshotting', route);
    const url = `http://localhost:5173${route}`;
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // desktop
    await page.setViewport({ width: 1280, height: 800 });
    const dtPath = path.join(outDir, `${route.replace(/[\/\:]/g, '_') || 'home'}_desktop.png`);
    await page.screenshot({ path: dtPath, fullPage: true });

    // mobile
    await page.setViewport({ width: 375, height: 667 });
    const mbPath = path.join(outDir, `${route.replace(/[\/\:]/g, '_') || 'home'}_mobile.png`);
    await page.screenshot({ path: mbPath, fullPage: true });
  }

  // Auth pages (need to be logged out)
  console.log('Logging out for auth pages...');
  await page.evaluate(() => { localStorage.clear(); });
  
  for (const route of ['/dang-nhap', '/dang-ky']) {
    console.log('Screenshotting', route);
    const url = `http://localhost:5173${route}`;
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    // desktop
    await page.setViewport({ width: 1280, height: 800 });
    await page.screenshot({ path: path.join(outDir, `${route.replace(/[\/\:]/g, '_')}_desktop.png`), fullPage: true });

    // mobile
    await page.setViewport({ width: 375, height: 667 });
    await page.screenshot({ path: path.join(outDir, `${route.replace(/[\/\:]/g, '_')}_mobile.png`), fullPage: true });
  }

  // Interactive ones: Report Modal and Toast. 
  // Let's do it on /cong-dong and /kiem-tra-tien-dien
  console.log('Screenshotting interactions...');
  // 1. Toast
  await page.goto('http://localhost:5173/kiem-tra-tien-dien', { waitUntil: 'networkidle2' });
  await page.setViewport({ width: 1280, height: 800 });
  await page.click('.btn.btn--primary.electricity-tool-layout__primary');
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(outDir, `_kiem-tra-tien-dien_error_toast_desktop.png`), fullPage: true });

  await browser.close();
  console.log('Done!');
})();
