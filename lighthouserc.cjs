module.exports = {
  ci: {
    collect: {
      url: [
        process.env.QA_BASE_URL || process.env.BASE_URL || 'https://exanh.online/',
        `${process.env.QA_BASE_URL || process.env.BASE_URL || 'https://exanh.online'}/meo-tiet-kiem`,
        `${process.env.QA_BASE_URL || process.env.BASE_URL || 'https://exanh.online'}/cong-dong`,
        `${process.env.QA_BASE_URL || process.env.BASE_URL || 'https://exanh.online'}/kiem-tra-tien-dien`,
      ],
      numberOfRuns: 1,
      settings: {
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.7 }],
        'categories:accessibility': ['warn', { minScore: 0.85 }],
        'categories:best-practices': ['warn', { minScore: 0.85 }],
        'categories:seo': ['warn', { minScore: 0.85 }],
      },
    },
    upload: {
      target: 'filesystem',
      outputDir: './lhci-report',
    },
  },
}
