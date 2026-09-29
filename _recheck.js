/* Final re-check: root dashboard counts vs runtime + practice page structure. */
const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const PORT = 9333;
const ROOT = process.cwd();

const get = p => new Promise((res, rej) => {
  http.get({ host: '127.0.0.1', port: PORT, path: p }, r => {
    let b = ''; r.on('data', d => (b += d)); r.on('end', () => res(JSON.parse(b)));
  }).on('error', rej);
});
const wait = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  fs.mkdirSync('_profile', { recursive: true });
  const proc = spawn(EDGE, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=' + PORT, '--user-data-dir=' + ROOT + '\\_profile',
    '--window-size=1440,1000', 'about:blank'
  ], { stdio: 'ignore' });

  let targets = null;
  for (let i = 0; i < 60; i++) {
    await wait(500);
    try { targets = await get('/json/list'); break; } catch (e) { /* retry */ }
  }
  if (!targets) { console.log('CDP unavailable'); proc.kill(); return; }

  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const send = (method, params = {}) => new Promise(res => {
    const mid = ++id; pending.set(mid, res);
    ws.send(JSON.stringify({ id: mid, method, params }));
  });
  ws.onmessage = ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); }
  };
  await new Promise(r => (ws.onopen = r));
  await send('Runtime.enable');
  await send('Page.enable');

  const evalIn = async expr => {
    const r = await send('Runtime.evaluate', {
      expression: '(async () => {' + expr + '})()', awaitPromise: true, returnByValue: true
    });
    if (r.exceptionDetails) return { error: JSON.stringify(r.exceptionDetails).slice(0, 300) };
    return r.result.value;
  };
  const open = async file => {
    await send('Page.navigate', { url: 'file:///' + (ROOT + '\\' + file).replace(/\\/g, '/') });
    await wait(2500);
  };

  console.log('=== root dashboard @1440 ===');
  await open('index.html');
  console.log(JSON.stringify(await evalIn(`
    const cards=[...document.querySelectorAll('[data-card]')];
    return {
      cardCount: cards.length,
      categories: cards.map(c=>c.dataset.category||'roadmap'),
      liveCards: cards.filter(c=>c.dataset.href).length,
      roadmapCards: cards.filter(c=>!c.dataset.href).length,
      resultCount: document.getElementById('resultCount').textContent,
      heroStats: [...document.querySelectorAll('p.text-2xl')].map(p=>p.textContent),
      practiceCard: cards.some(c=>c.dataset.href==='practice-worksheet/index.html'),
      docScrollWidth: document.documentElement.scrollWidth, inner: innerWidth
    };
  `), null, 1));

  console.log('=== practice page @1440 ===');
  await open('practice-worksheet\\index.html');
  console.log(JSON.stringify(await evalIn(`
    const sheets=[...document.querySelectorAll('.a4-page')];
    return {
      sheets: sheets.length,
      items: document.querySelectorAll('.item').length,
      perSheet: sheets.map(s=>s.querySelectorAll('.item').length),
      sheetW: Math.round(sheets[0].getBoundingClientRect().width),
      sheetH: Math.round(sheets[0].getBoundingClientRect().height),
      mmW: sheets[0].getBoundingClientRect().width/(96/25.4),
      connectors: document.querySelectorAll('.connectors line').length,
      docScrollWidth: document.documentElement.scrollWidth, inner: innerWidth,
      back: document.querySelector('.btn-back').getAttribute('href'),
      brand: document.querySelector('.brand').getAttribute('href')
    };
  `), null, 1));

  console.log('=== practice page @390 ===');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 800, deviceScaleFactor: 1, mobile: true });
  await wait(900);
  console.log(JSON.stringify(await evalIn(`
    const pk=document.getElementById('packet');
    return { docScrollWidth: document.documentElement.scrollWidth, inner: innerWidth,
             packetScrollable: pk.scrollWidth > pk.clientWidth,
             sheets: document.querySelectorAll('.a4-page').length };
  `), null, 1));

  ws.close();
  proc.kill();
  process.exit(0);
})();
