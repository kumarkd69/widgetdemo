// Shared settings for the local scan pipeline.
// Edit these before running if you need to tune scope/behavior.
module.exports = {
  BASE_URL: 'https://www.theoriginaltour.com',
  SITEMAP_URL: 'https://www.theoriginaltour.com/sitemap.xml',

  // Crawl behavior
  MAX_PAGES: parseInt(process.env.A11Y_MAX_PAGES || '0', 10), // 0 = no limit
  CRAWL_DEPTH: parseInt(process.env.A11Y_CRAWL_DEPTH || '3', 10),
  CRAWL_CONCURRENCY: 4,

  // Scan behavior
  SCAN_CONCURRENCY: 3,
  VIEWPORTS: [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'mobile', width: 390, height: 844 }
  ],
  NAV_TIMEOUT_MS: 30000,
  MAX_TAB_STOPS: 60, // safety cap per page when walking focus order

  // Paths (relative to local-scan/)
  SITE_MAP_FILE: 'config/site_map.json',
  RAW_DIR: 'data/raw',
  SCREENSHOT_DIR: 'data/screenshots',
  CONTRAST_FILE: 'data/contrast_findings.json',
  OUTPUT_XLSX: 'output/TOT_WCAG21AA_Audit.xlsx',

  // Skip URLs matching these patterns (auth-gated areas, non-HTML assets)
  SKIP_PATTERNS: [
    /\/(login|signin|sign-in|account|my-account)(\/|$)/i,
    /\.(pdf|jpg|jpeg|png|svg|gif|zip|xml|json|css|js)$/i,
    /\/(wp-admin|wp-json)/i
  ]
};
