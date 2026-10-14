import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  use: {
    baseURL: 'http://127.0.0.1:8080',
    viewport: { width: 1440, height: 1000 },
    launchOptions: { executablePath: '/usr/bin/chromium', args: ['--no-sandbox', '--enable-unsafe-swiftshader'] },
  },
  webServer: {
    command: '/workspace/bin/php -S 0.0.0.0:8080 -t .',
    url: 'http://127.0.0.1:8080/index.php',
    reuseExistingServer: true,
    timeout: 30000,
  },
});
