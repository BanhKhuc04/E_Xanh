const { chromium } = require('playwright');
const { exec } = require('child_process');

(async () => {
  console.log('Starting dev server...');
  const server = exec('npm run dev');
  
  await new Promise(r => setTimeout(r, 4000)); // wait for server to start

  console.log('Launching browser...');
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('console', msg => console.log('BROWSER:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err));

  // Clear local storage by adding init script
  await page.addInitScript(() => {
    window.localStorage.clear();
  });

  console.log('Navigating to localhost:5173...');
  await page.goto('http://localhost:5173');
  
  console.log('Waiting for toast...');
  try {
    await page.waitForSelector('.version-notice-toast', { timeout: 10000 });
    console.log('Toast FOUND!');
    
    // Check position
    const box = await page.locator('.version-notice-toast').boundingBox();
    console.log('Toast position:', box);

    // Check color
    const color = await page.evaluate(() => {
      const el = document.querySelector('.version-notice-toast__inner');
      return window.getComputedStyle(el, '::before').backgroundColor;
    });
    console.log('Toast ::before color:', color);

  } catch (err) {
    console.error('Toast NOT FOUND:', err.message);
    
    // Wait a bit more and dump the body
    await page.waitForTimeout(2000);
    const body = await page.evaluate(() => document.body.innerHTML);
    if (body.includes('🚀')) {
      console.log('Wait, the rocket icon is in the DOM!');
    }
  }

  await browser.close();
  server.kill();
  process.exit(0);
})();
