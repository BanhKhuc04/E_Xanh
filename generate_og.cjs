const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 }); // High res

  const logoBase64 = fs.readFileSync('public/favicon.png').toString('base64');
  const logoDataUri = `data:image/png;base64,${logoBase64}`;

  const html = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          margin: 0;
          padding: 0;
          width: 1200px;
          height: 630px;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
        }
        .logo {
          width: 550px;
          height: 550px;
          object-fit: contain;
          border-radius: 96px;
          box-shadow: 0 40px 80px rgba(22, 163, 74, 0.15);
        }
      </style>
    </head>
    <body>
      <img class="logo" src="${logoDataUri}" />
    </body>
    </html>
  `;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: 'public/og-logo.png' });
  await browser.close();
})();
