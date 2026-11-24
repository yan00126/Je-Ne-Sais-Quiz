// End-to-end check of shadowing by level in the web build, with a fake French voice.
//   EXPO_OFFLINE=1 npx expo export -p web --output-dir /tmp/web
//   node scripts/e2e/serve.cjs /tmp/web &            (serves it on :8081 with the headers SQLite needs)
//   node scripts/e2e/shadowing.cjs Bonbon|Cahier|Métro [out-dir]
// It takes screenshots of each step, plays a whole A1 series and prints the rates and pauses heard:
// every sentence must be said slow then at normal speed, with a pause after each.
const { chromium } = require('playwright');
const theme = process.argv[2] || 'Bonbon';
const dir = process.argv[3] || 'screenshots';
const out = (n) => `${dir}/${theme.toLowerCase()}-${n}.png`;
const until = async (p, text, ms) => { const end = Date.now() + ms; while (Date.now() < end) { if (await p.getByText(text).count()) return; await p.waitForTimeout(200); } throw new Error('timeout waiting ' + text); };
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 1500 }, deviceScaleFactor: 2 });
  p.on('pageerror', e => console.log('PAGEERR', e.message.slice(0,200)));
  // A fake French voice: says each text in letters/14/rate seconds, and logs what it said.
  await p.addInitScript(() => {
    window.__speech = [];
    window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; this.rate = 1; this.pitch = 1; this.volume = 1; this.lang = ''; this.voice = null; } addEventListener(n, f) { this['on' + n] = f; } removeEventListener() {} };
    let cur = null;
    const synth = {
      speaking: false, pending: false, paused: false,
      getVoices: () => [{ name: 'Amélie', lang: 'fr-CA', voiceURI: 'amelie', localService: true, default: true }],
      speak(u) { const ms = Math.round(400 + u.text.replace(/[^\p{L}\p{N}]/gu, '').length / 14 / (u.rate || 1) * 1000);
        window.__speech.push({ text: u.text, rate: u.rate, t: Date.now(), ms });
        u.onstart && u.onstart(new Event('start'));
        cur = setTimeout(() => { cur = null; u.onend && u.onend(new Event('end')); }, ms); },
      cancel() { if (cur) { clearTimeout(cur); cur = null; window.__speech.push({ cancel: true, t: Date.now() }); } },
      pause() {}, resume() {}, addEventListener() {}, removeEventListener() {},
    };
    Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
  });
  await p.goto('http://localhost:8081/style', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1500);
  await p.getByText(theme, { exact: true }).first().click();
  await p.waitForTimeout(500);
  await p.goto('http://localhost:8081/practice/shadowing', { waitUntil: 'networkidle' });
  await p.waitForTimeout(2000);
  await p.getByText('Intermédiaire', { exact: true }).click();
  // Pause and text options are in a sheet opened from the bar above « Commencer ».
  await p.getByLabel('Options de la série').click();
  await p.waitForTimeout(400);
  await p.getByText('Moyenne', { exact: true }).click();
  await p.getByText('Après', { exact: true }).click();
  await p.getByText('OK', { exact: true }).click();
  await p.waitForTimeout(300);
  await p.screenshot({ path: out('1-setup'), fullPage: true });
  await p.getByText(/^Commencer/).click();
  await p.waitForTimeout(600);
  await p.screenshot({ path: out('2-slow-masked') });
  await until(p, 'À vous ! Répétez', 20000);
  await p.getByText('Voir la traduction').click();
  await p.waitForTimeout(1500);
  await p.screenshot({ path: out('3-gap') });
  await until(p, 'Écoutez · vitesse normale', 30000);
  await p.waitForTimeout(500);
  await p.screenshot({ path: out('4-normal') });
  await p.getByLabel('Pause', { exact: true }).click();
  await p.waitForTimeout(300);
  await p.screenshot({ path: out('5-paused') });
  const b1 = await p.evaluate(() => window.__speech);
  await p.getByText('Arrêter la série').click();
  await p.waitForTimeout(500);
  // A whole series, start to finish, at A1 with short pauses and the text always visible.
  await p.getByText('Débutant', { exact: true }).click();
  await p.getByLabel('Options de la série').click();
  await p.waitForTimeout(400);
  await p.getByText('Courte', { exact: true }).click();
  await p.getByText('Visible', { exact: true }).click();
  await p.getByText('OK', { exact: true }).click();
  await p.evaluate(() => { window.__speech = []; });
  await p.getByText(/^Commencer/).click();
  await until(p, /^Bravo/, 240000);
  await p.waitForTimeout(500);
  await p.screenshot({ path: out('6-finished'), fullPage: true });
  await p.getByText('Changer de niveau').click();
  await p.waitForTimeout(400);
  await p.getByText('Dialogues', { exact: true }).click();
  await p.waitForTimeout(800);
  await p.screenshot({ path: out('7-dialogues') });
  const a1 = await p.evaluate(() => window.__speech.filter((x) => !x.cancel));
  const report = { b1rates: b1.filter(x=>!x.cancel).map(x => x.rate), a1count: a1.length, a1rates: [...new Set(a1.map(x => x.rate))],
    pairs: a1.every((x, i) => i % 2 === 0 ? x.rate === 0.6 && a1[i+1]?.text === x.text : x.rate === 0.8),
    gaps: a1.slice(1).map((x, i) => x.t - (a1[i].t + a1[i].ms)) };
  console.log(theme, JSON.stringify(report));
  const ok = report.pairs && report.a1count === 16 && report.gaps.every((g) => g >= 2400);
  console.log(ok ? 'PASS' : 'FAIL');
  if (!ok) process.exitCode = 1;
  await b.close();
})().catch(e => { console.log(theme, 'FAIL', e.message.slice(0, 300)); process.exit(1); });
