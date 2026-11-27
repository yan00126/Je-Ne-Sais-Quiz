// Fold check: the main button of each key screen must be on the first screen, without scrolling,
// and stay visible when the iOS keyboard is open. Runs on the web build, in all three themes,
// at iPhone SE (375×667) and iPhone 15 (390×844) sizes.
//   EXPO_OFFLINE=1 npx expo export -p web --output-dir dist
//   node scripts/e2e/serve.cjs dist &        (serves it on :8081)
//   node scripts/e2e/fold.cjs [out-dir]      (exits 1 if a button is hidden; screenshots go to out-dir, SCALE=2 for sharp ones)
//
// The usable height leaves out the status bar and the home indicator, which the web build does not draw.
// The keyboard is simulated by making the window shorter by its height: on iOS the screens shrink the same
// way (KeyboardAvoidingView), so whatever is pinned above it must still show. This cannot test the iOS-only parts
// (KeyboardAvoidingView offsets, scrolling a field into view, a sheet over the keyboard): check those on a phone.
const { chromium } = require('playwright');
const fs = require('fs');

const BASE = process.env.BASE_URL || 'http://localhost:8081';
const OUT = process.argv[2] || 'fold-screenshots';
const THEMES = ['Bonbon', 'Cahier', 'Métro'];
const SIZES = [
  { id: 'se', name: 'iPhone SE', width: 375, height: 667 - 20, keyboard: 260 - 0 },
  { id: 'iphone15', name: 'iPhone 15', width: 390, height: 844 - 47 - 34, keyboard: 336 - 34 },
];

// steps: { text | re | label, exact?, wait? } to tap (label = accessibility label), { fill } to type in the first text field.
// expect: what must be fully visible: buttons by text (string = exact, RegExp) or { label }, fields by { placeholder }.
const SCENARIOS = [
  { id: 'today', route: '/', expect: [/^(C’est parti !|On continue !|Tout est fait, bravo !|Continuer →|Tout est fait !|Monter : .*|Voir les exercices)$/] },
  { id: 'vocab', route: '/cards', expect: ['Afficher la réponse'] },
  { id: 'vocab-revealed', route: '/cards', steps: [{ text: 'Afficher la réponse', exact: true }], expect: ['Bien', 'Facile'] },
  // Word-order question on a long phrase: all tiles, and the buttons, on the first screen with half the words placed.
  { id: 'vocab-build', route: '/cards?exercise=build&card=v2381', steps: [{ label: 'il' }, { label: 'est' }], expect: ['Vérifier', 'Je ne sais pas', { label: 'important' }, { label: 'que' }] },
  { id: 'vocab-build-answered', route: '/cards?exercise=build&card=v087', steps: [{ label: 'd’une' }, { label: 'part' }, { label: 'd’autre' }, { label: 'part' }, { text: 'Vérifier', exact: true, wait: 900 }], expect: ['Continuer'] },
  { id: 'listening-answered', route: '/practice/listening', steps: [{ text: 'Documents', exact: true }, { text: 'A', exact: true, wait: 1200 }], expect: [/^(Question suivante|Voir le résultat)$/] },
  { id: 'reading-result', route: '/practice/reading', steps: [{ text: 'A', exact: true, wait: 1000 }, { text: 'Question suivante', exact: true }, { text: 'A', exact: true, wait: 1000 }, { text: 'Voir le résultat', exact: true, wait: 1200 }], expect: [/^Résultat : /, 'Document suivant'] },
  { id: 'reading-answered', route: '/practice/reading', steps: [{ text: 'A', exact: true, wait: 1200 }], expect: [/^(Question suivante|Voir le résultat)$/] },
  { id: 'numbers-keyboard', route: '/practice/listening', keyboard: true, steps: [{ text: 'Nombres', exact: true, wait: 2500 }, { fill: '3' }], expect: [{ placeholder: 'Votre réponse' }, 'Vérifier', 'Je ne sais pas'] },
  { id: 'writing', route: '/practice/writing', expect: [/^Commencer \(/] },
  { id: 'writing-keyboard', route: '/practice/writing', keyboard: true, steps: [{ re: '^Commencer \\(' }, { fill: 'Salut Marc, je fais une fête samedi.' }], expect: ['Terminer et enregistrer'] },
  { id: 'writing-change-task', route: '/practice/writing', keyboard: true, steps: [{ re: '^Commencer \\(' }, { fill: 'Salut Marc.' }, { text: 'Tâche 2', exact: true, wait: 900 }], expect: ['Garder mon texte', 'Changer de tâche'] },
  { id: 'speaking', route: '/practice/speaking', steps: [{ text: 'Tâche 3', exact: true }], expect: ['● Enregistrer'] },
  { id: 'shadowing-setup', route: '/practice/shadowing', steps: [{ text: 'Par niveau', exact: true }], expect: [/^Commencer · /] },
  { id: 'shadowing-playing', route: '/practice/shadowing', steps: [{ text: 'Par niveau', exact: true }, { re: '^Commencer · ', wait: 1500 }], expect: [{ label: 'Pause' }, { label: 'Suivante' }, { label: 'Arrêter la série' }] },
  { id: 'shadowing-playing-b2', route: '/practice/shadowing', steps: [{ text: 'Par niveau', exact: true }, { text: 'Avancé', exact: true }, { re: '^Commencer · ', wait: 1500 }, { text: 'Voir la traduction', exact: true }], expect: [{ label: 'Pause' }, { label: 'Suivante' }, { label: 'Arrêter la série' }] },
  { id: 'shadowing-options', route: '/practice/shadowing', steps: [{ text: 'Par niveau', exact: true }, { label: 'Options de la série', wait: 900 }], expect: ['Longue', 'Masqué', 'OK'] },
  { id: 'dialogue-hints', route: '/practice/dialogue', steps: [{ re: 'Indice$' }, { re: 'Indice$' }], expect: ['● Répondre', /Indice$/] },
  { id: 'progress', route: '/progress', expect: [{ label: 'Réglages' }, /^(01 )?Mes erreurs/] },
  { id: 'progress-settings', route: '/progress', steps: [{ label: 'Réglages', wait: 900 }], expect: ['Style de l’appli', 'Voix française'] },
];

// Same fake voice as shadowing.cjs: the screens wait for speech to end.
const fakeSpeech = () => {
  const synth = {
    speaking: false, pending: false, paused: false,
    getVoices: () => [{ name: 'Amélie', lang: 'fr-CA', voiceURI: 'amelie', localService: true, default: true }],
    speak(u) { setTimeout(() => u.onend && u.onend(new Event('end')), 300); },
    cancel() {}, pause() {}, resume() {}, addEventListener() {}, removeEventListener() {},
  };
  Object.defineProperty(window, 'speechSynthesis', { value: synth, configurable: true });
  window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } addEventListener(n, f) { this['on' + n] = f; } removeEventListener() {} };
};

function locate(page, want) {
  if (want instanceof RegExp) return page.getByText(want);
  if (want.placeholder) return page.getByPlaceholder(want.placeholder, { exact: true });
  if (typeof want === 'object') return page.getByLabel(want.label, { exact: true });
  return page.getByText(want, { exact: true });
}

// Visible = entirely inside the window and the topmost thing at its centre and near its top and bottom edges
// (not even partly under a bar or the keyboard).
async function visibility(locator) {
  const count = await locator.count();
  if (!count) return 'missing';
  for (let i = 0; i < count; i++) {
    const r = await locator.nth(i).evaluate((el) => {
      const b = el.closest('[role=button],[role=tab],button') || el;
      const box = b.getBoundingClientRect();
      if (!box.width || !box.height) return 'empty';
      if (box.top < 0 || box.bottom > innerHeight + 1) return `outside (top ${Math.round(box.top)}, bottom ${Math.round(box.bottom)}, window ${innerHeight})`;
      const x = box.left + box.width / 2;
      const ys = [box.top + box.height / 2, box.top + Math.min(4, box.height / 2), box.bottom - Math.min(4, box.height / 2)];
      return ys.every((y) => { const hit = document.elementFromPoint(x, y); return hit && (b.contains(hit) || hit.contains(b)); }) ? 'ok' : 'covered';
    });
    if (r === 'ok') return r;
    if (i === count - 1) return r;
  }
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const failures = [];
  for (const theme of THEMES) {
    for (const size of SIZES) {
      const context = await browser.newContext({ viewport: { width: size.width, height: size.height }, deviceScaleFactor: Number(process.env.SCALE) || 1 });
      await context.addInitScript(fakeSpeech);
      const page = await context.newPage();
      page.on('pageerror', (e) => console.log('page error:', e.message.slice(0, 200)));
      await page.goto(`${BASE}/style`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1200);
      await page.getByText(theme, { exact: true }).first().click();
      await page.waitForTimeout(400);
      for (const sc of SCENARIOS) {
        const name = `${sc.id}-${theme.toLowerCase().normalize('NFD').replace(/[^a-z]/g, '')}-${size.id}`;
        try {
          await page.setViewportSize({ width: size.width, height: size.height });
          await page.goto(BASE + sc.route, { waitUntil: 'networkidle' });
          await page.waitForTimeout(1500);
          for (const st of sc.steps || []) {
            if (st.fill !== undefined) await page.locator('textarea,input').first().fill(st.fill);
            else {
              const target = st.label
                ? page.getByLabel(st.label, { exact: true })
                : st.re
                  ? page.getByText(new RegExp(st.re))
                  : page.getByText(st.text, { exact: !!st.exact });
              await target.first().click({ timeout: 5000 });
            }
            await page.waitForTimeout(st.wait || 600);
          }
          if (sc.keyboard) {
            await page.setViewportSize({ width: size.width, height: size.height - size.keyboard });
            await page.waitForTimeout(500);
          }
          await page.screenshot({ path: `${OUT}/${name}.png` });
          for (const want of sc.expect) {
            const v = await visibility(locate(page, want));
            if (v !== 'ok') failures.push(`${name}: « ${want.label || want.placeholder || want} » ${v}`);
          }
        } catch (e) {
          failures.push(`${name}: ${e.message.split('\n')[0]}`);
          await page.screenshot({ path: `${OUT}/${name}.png` }).catch(() => {});
        }
      }
      await context.close();
    }
  }
  await browser.close();
  const total = THEMES.length * SIZES.length * SCENARIOS.length;
  if (failures.length) {
    console.log(`Fold check: ${failures.length} problem(s) in ${total} screens.\n` + failures.map((f) => '  ✗ ' + f).join('\n'));
    process.exit(1);
  }
  console.log(`Fold check: all ${total} screens show their main buttons without scrolling.`);
})();
