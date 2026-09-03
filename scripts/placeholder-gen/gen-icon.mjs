import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..', '..');
const svg = readFileSync(join(root, 'assets/img/icons/favicon.svg'), 'utf8');

const EXEC = process.env.PW_CHROMIUM || '/opt/pw-browsers/chromium';
const browser = await chromium.launch({ headless: true, executablePath: EXEC });
const page = await browser.newPage({ viewport: { width: 180, height: 180 } });
await page.setContent(`<html><body style="margin:0">${svg}</body></html>`);
await page.locator('svg').evaluate((el) => { el.style.width = '180px'; el.style.height = '180px'; });
await page.screenshot({ path: join(root, 'assets/img/icons/apple-touch-icon.png') });
await browser.close();
console.log('icon ok');
