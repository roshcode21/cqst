import { spawn } from 'node:child_process';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { setTimeout as sleep } from 'node:timers/promises';

const chromePath = process.env.CHROME_BIN || process.env.CHROME_PATH || '/usr/bin/google-chrome';
const output = process.env.PARITY_DIR || 'parity';
const v21Base = process.env.V21_URL || 'http://127.0.0.1:4173/';
const v20Base = process.env.V20_URL || 'https://roshcode21.github.io/cqst/v20/?v=20-2';
const debugPort = 9222;
const profileDir = `/tmp/cqst-parity-chrome-${process.pid}`;

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

const chrome = spawn(chromePath, [
  '--headless=new',
  '--no-sandbox',
  '--disable-dev-shm-usage',
  '--disable-gpu',
  '--hide-scrollbars',
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${profileDir}`,
  'about:blank'
], { stdio: ['ignore', 'ignore', 'pipe'] });

let chromeError = '';
chrome.stderr.on('data', chunk => { chromeError += chunk.toString(); });

async function waitForTarget() {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json/list`);
      if (response.ok) {
        const targets = await response.json();
        const page = targets.find(target => target.type === 'page');
        if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
      }
    } catch (_) {}
    await sleep(125);
  }
  throw new Error(`Chrome DevTools no inició. ${chromeError.slice(-1200)}`);
}

class CDP {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
  }

  async open() {
    if (this.socket.readyState === WebSocket.OPEN) return;
    await new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });
    this.socket.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
        return;
      }
      const waiters = this.listeners.get(message.method);
      if (!waiters?.length) return;
      this.listeners.set(message.method, []);
      waiters.forEach(resolve => resolve(message.params));
    });
  }

  send(method, params = {}) {
    const id = this.nextId++;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  once(method) {
    return new Promise(resolve => {
      const waiters = this.listeners.get(method) || [];
      waiters.push(resolve);
      this.listeners.set(method, waiters);
    });
  }

  close() {
    this.socket.close();
  }
}

const socketUrl = await waitForTarget();
const cdp = new CDP(socketUrl);
await cdp.open();
await cdp.send('Page.enable');
await cdp.send('Runtime.enable');
await cdp.send('Network.enable');
await cdp.send('Network.setBlockedURLs', { urls: ['*://cloud.umami.is/*'] });
await cdp.send('Emulation.setEmulatedMedia', {
  features: [{ name: 'prefers-reduced-motion', value: 'reduce' }]
});

async function settlePage() {
  await cdp.send('Runtime.evaluate', {
    expression: `(() => Promise.all([
      document.fonts?.ready || Promise.resolve(),
      Promise.all([...document.images].map(img => img.complete ? Promise.resolve() : new Promise(resolve => {
        img.addEventListener('load', resolve, {once:true});
        img.addEventListener('error', resolve, {once:true});
      })))
    ]).then(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))))()`,
    awaitPromise: true,
    returnByValue: true
  });
  await sleep(120);
}

async function capture(version, base, width, height, scene) {
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
    screenWidth: width,
    screenHeight: height
  });

  const loaded = cdp.once('Page.loadEventFired');
  await cdp.send('Page.navigate', { url: base });
  await Promise.race([loaded, sleep(15000)]);
  await settlePage();

  await cdp.send('Runtime.evaluate', {
    expression: `(() => {
      const target = document.getElementById(${JSON.stringify(scene)});
      if (!target) return false;
      target.scrollIntoView({block:'start', inline:'nearest', behavior:'instant'});
      return true;
    })()`,
    returnByValue: true
  });
  await sleep(220);

  const { data } = await cdp.send('Page.captureScreenshot', {
    format: 'png',
    fromSurface: true,
    captureBeyondViewport: false
  });
  await writeFile(`${output}/${version}-${width}x${height}-${scene}.png`, Buffer.from(data, 'base64'));
}

try {
  for (const [width, height] of viewports) {
    for (const scene of scenes) {
      await capture('v21', v21Base, width, height, scene);
      await capture('v20', v20Base, width, height, scene);
    }
  }
} finally {
  cdp.close();
  chrome.kill('SIGTERM');
  await rm(profileDir, { recursive: true, force: true }).catch(() => {});
}
