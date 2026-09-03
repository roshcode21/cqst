import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';

const chromePath = process.env.CHROME_BIN || process.env.CHROME_PATH || '/usr/bin/google-chrome';
const output = process.env.PARITY_DIR || 'parity';
const v21Base = process.env.V21_URL || 'http://127.0.0.1:4173/';
const v20Base = process.env.V20_URL || 'https://roshcode21.github.io/cqst/v20/?v=20-2';

const viewports = [
  [390, 844],
  [430, 932],
  [768, 1024],
  [1024, 768],
  [1366, 900],
  [1920, 1080]
];
const scenes = ['portada', 'leer', 'etcetera', 'cqst', 'participar'];

await mkdir(output, { recursive: true });

const browser = await chromium.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
});

async function capture(version, base, width, height, scene) {
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: 'reduce',
    colorScheme: 'light'
  });
  const page = await context.newPage();

  await page.route('**/cloud.umami.is/**', route => route.abort()).catch(() => {});
  await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });

  const target = page.locator(`#${scene}`);
  if (await target.count()) {
    await target.evaluate(element => element.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'instant' }));
    await page.waitForTimeout(180);
  }

  await page.screenshot({
    path: `${output}/${version}-${width}x${height}-${scene}.png`,
    animations: 'disabled',
    caret: 'hide',
    fullPage: false
  });

  await context.close();
}

try {
  for (const [width, height] of viewports) {
    for (const scene of scenes) {
      await capture('v21', v21Base, width, height, scene);
      await capture('v20', v20Base, width, height, scene);
    }
  }
} finally {
  await browser.close();
}
