/* todo-list-bd - headless-Chrome smoke test via raw CDP.
   Run: node tests/smoke.js [desktop|mobile]
   Uses /opt/meta-chromium/chrome + Node global WebSocket. No deps. */
'use strict';
const { spawn, execSync } = require('child_process');
const path = require('path');

const MODE = process.argv[2] || 'desktop';
const WIDTH = MODE === 'mobile' ? 390 : 1280;
const PORT = MODE === 'mobile' ? 9226 : 9225;
const DIR = path.resolve(__dirname, '..');
const URL = 'file://' + DIR + '/index.html?asof=2026-10-16';

let passed = 0, failed = 0;
function check(name, cond, extra) {
  if (cond) { passed++; console.log('PASS ' + name); }
  else { failed++; console.log('FAIL ' + name + (extra ? ' :: ' + extra : '')); }
}
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

class CDP {
  constructor(wsUrl) { this.ws = new WebSocket(wsUrl); this.id = 0; this.pending = new Map(); this.events = []; }
  async open() {
    await new Promise((res, rej) => { this.ws.onopen = res; this.ws.onerror = rej; });
    this.ws.onmessage = (m) => {
      const d = JSON.parse(m.data);
      if (d.id && this.pending.has(d.id)) {
        const { resolve, reject } = this.pending.get(d.id);
        this.pending.delete(d.id);
        d.error ? reject(new Error(JSON.stringify(d.error))) : resolve(d.result);
      } else this.events.push(d);
    };
  }
  send(method, params) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params: params || {} }));
    });
  }
  async evalExpr(expr) {
    const r = await this.send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error('eval exception: ' + JSON.stringify(r.exceptionDetails));
    return r.result.value;
  }
  close() { try { this.ws.close(); } catch (e) {} }
}

(async () => {
  const userDir = '/tmp/tdl-chrome-' + MODE;
  execSync('rm -rf ' + userDir);
  const chrome = spawn('/opt/meta-chromium/chrome', [
    '--headless=new', '--no-sandbox', '--disable-gpu', '--no-proxy-server',
    '--window-size=' + WIDTH + ',900',
    '--remote-debugging-port=' + PORT, '--user-data-dir=' + userDir, 'about:blank'
  ], { stdio: 'ignore' });
  let cdp = null;
  try {
    let targets = null;
    for (let i = 0; i < 50 && !targets; i++) {
      await sleep(200);
      try {
        const res = await fetch('http://127.0.0.1:' + PORT + '/json/list');
        const list = await res.json();
        targets = list.filter(t => t.type === 'page');
      } catch (e) { /* not up yet */ }
    }
    if (!targets || !targets.length) throw new Error('no page target');
    cdp = new CDP(targets[0].webSocketDebuggerUrl);
    await cdp.open();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.send('Log.enable');
    await cdp.send('Network.enable');
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: WIDTH, height: 900, deviceScaleFactor: 1, mobile: MODE === 'mobile' });
    await cdp.send('Page.navigate', { url: URL });
    await sleep(1500);

    const errors = cdp.events.filter(e =>
      (e.method === 'Log.entryAdded' && e.params && e.params.entry && e.params.entry.level === 'error') ||
      e.method === 'Runtime.exceptionThrown');
    check('0 console/page errors', errors.length === 0, JSON.stringify(errors.slice(0, 2)));

    // 1. Initial render: empty state, stats 0
    let v = await cdp.evalExpr(`({h1: document.querySelector('h1').textContent, total: document.getElementById('statTotal').textContent, empty: document.getElementById('emptyState').textContent})`);
    check('title renders', v.h1 === 'To-Do List BD', v.h1);
    check('initial total 0', v.total === '0', v.total);
    check('empty state visible', v.empty.indexOf('No tasks yet') === 0, v.empty);

    // helper: add a task via the form
    async function addTask(title, priority, category, due) {
      return cdp.evalExpr(`(function(){
        document.getElementById('titleInput').value = ${JSON.stringify(title)};
        document.getElementById('priorityInput').value = ${JSON.stringify(priority)};
        document.getElementById('categoryInput').value = ${JSON.stringify(category)};
        document.getElementById('dueInput').value = ${JSON.stringify(due)};
        document.getElementById('taskForm').dispatchEvent(new Event('submit', {bubbles:true, cancelable:true}));
        return document.querySelectorAll('#taskList li.task').length;
      })()`);
    }

    // 2. Add a task due today
    let n = await addTask('Buy notebooks', 'high', 'Study', '2026-10-16');
    check('add task -> 1 row', n === 1, String(n));
    v = await cdp.evalExpr(`({total: document.getElementById('statTotal').textContent, dueToday: document.getElementById('statDueToday').textContent, row: document.querySelector('#taskList li.task').textContent})`);
    check('total 1 after add', v.total === '1', v.total);
    check('due-today 1', v.dueToday === '1', v.dueToday);
    check('row shows title + High', v.row.indexOf('Buy notebooks') >= 0 && v.row.indexOf('High') >= 0, v.row);

    // 3. Validation: empty title rejected
    await cdp.evalExpr(`(function(){
      document.getElementById('titleInput').value = '   ';
      document.getElementById('taskForm').dispatchEvent(new Event('submit', {bubbles:true, cancelable:true}));
      return document.getElementById('formError').textContent;
    })()`);
    v = await cdp.evalExpr(`({err: document.getElementById('formError').textContent, rows: document.querySelectorAll('#taskList li.task').length})`);
    check('empty title inline error', v.err.indexOf('Title is required') >= 0, v.err);
    check('no row added on invalid', v.rows === 1, String(v.rows));

    // 4. Add overdue task + no-due task
    await addTask('Pay mess bill', 'medium', 'Home', '2026-10-15');
    await addTask('Read book', 'low', '', '');
    v = await cdp.evalExpr(`({total: document.getElementById('statTotal').textContent, overdue: document.getElementById('statOverdue').textContent, pct: document.getElementById('statPct').textContent})`);
    check('total 3', v.total === '3', v.total);
    check('overdue 1', v.overdue === '1', v.overdue);
    check('completion 0%', v.pct === '0%', v.pct);

    // 5. Overdue filter shows exactly the overdue task
    await cdp.evalExpr(`document.querySelector('[data-status-chip="overdue"]').click()`);
    await sleep(100);
    v = await cdp.evalExpr(`document.querySelector('#taskList li.task').textContent`);
    check('overdue filter shows mess bill', v.indexOf('Pay mess bill') >= 0, v);
    check('overdue filter hides others', v.indexOf('Buy notebooks') === -1, v);

    // 6. Mark done via checkbox -> stats + completion
    await cdp.evalExpr(`document.querySelector('[data-status-chip="all"]').click()`);
    await sleep(100);
    await cdp.evalExpr(`(function(){
      var rows = document.querySelectorAll('#taskList li.task');
      for (var i = 0; i < rows.length; i++) if (rows[i].textContent.indexOf('Buy notebooks') >= 0) rows[i].querySelector('[data-act="toggle"]').click();
    })()`);
    await sleep(100);
    v = await cdp.evalExpr(`({done: document.getElementById('statDone').textContent, pct: document.getElementById('statPct').textContent, row: document.querySelector('#taskList li.task').textContent})`);
    check('done 1 after toggle', v.done === '1', v.done);
    check('completion 33%', v.pct === '33%', v.pct);

    // 7. Search filter
    await cdp.evalExpr(`(function(){ var s = document.getElementById('searchInput'); s.value = 'mess'; s.dispatchEvent(new Event('input', {bubbles:true})); })()`);
    await sleep(100);
    v = await cdp.evalExpr(`({rows: document.querySelectorAll('#taskList li.task').length, text: document.querySelector('#taskList li.task').textContent})`);
    check('search narrows to 1', v.rows === 1 && v.text.indexOf('Pay mess bill') >= 0, JSON.stringify(v));
    await cdp.evalExpr(`(function(){ var s = document.getElementById('searchInput'); s.value = ''; s.dispatchEvent(new Event('input', {bubbles:true})); })()`);
    await sleep(100);

    // 8. Edit: change title of "Read book"
    await cdp.evalExpr(`(function(){
      var rows = document.querySelectorAll('#taskList li.task');
      for (var i = 0; i < rows.length; i++) if (rows[i].textContent.indexOf('Read book') >= 0) rows[i].querySelector('[data-act="edit"]').click();
      document.getElementById('titleInput').value = 'Read novel';
      document.getElementById('taskForm').dispatchEvent(new Event('submit', {bubbles:true, cancelable:true}));
    })()`);
    await sleep(100);
    v = await cdp.evalExpr(`document.getElementById('taskList').textContent`);
    check('edit renames task', v.indexOf('Read novel') >= 0 && v.indexOf('Read book') === -1, v);

    // 9. BN toggle renders Bengali digits
    await cdp.evalExpr(`document.getElementById('langBtn').click()`);
    await sleep(150);
    v = await cdp.evalExpr(`({h1: document.querySelector('h1').textContent, total: document.getElementById('statTotal').textContent})`);
    check('BN title renders', v.h1.indexOf('\u099f\u09c1') >= 0, v.h1);
    check('BN digits total 3', v.total === '\u09e9', v.total);
    // back to EN
    await cdp.evalExpr(`document.getElementById('langBtn').click()`);
    await sleep(150);

    // 10. Export -> erase -> import round-trip via localStorage seed
    const exported = await cdp.evalExpr(`localStorage.getItem('todo-list-bd:v1')`);
    check('export state stored', !!exported && exported.indexOf('Read novel') >= 0, String(exported).slice(0, 60));
    await cdp.evalExpr(`(function(){ localStorage.setItem('todo-list-bd:test-saved', localStorage.getItem('todo-list-bd:v1')); localStorage.removeItem('todo-list-bd:v1'); location.reload(); })()`);
    await sleep(1200);
    v = await cdp.evalExpr(`document.getElementById('statTotal').textContent`);
    check('wipe -> total 0', v === '0', v);
    const restored = await cdp.evalExpr(`(function(){
      var res = window.TodoLogic.validateImport(JSON.parse(localStorage.getItem('todo-list-bd:test-saved')));
      if (res.ok) { localStorage.setItem('todo-list-bd:v1', localStorage.getItem('todo-list-bd:test-saved')); localStorage.removeItem('todo-list-bd:test-saved'); location.reload(); return 'ok'; }
      return 'bad';
    })()`);
    await sleep(1200);
    v = await cdp.evalExpr(`document.getElementById('statTotal').textContent`);
    check('import round-trip restores 3', restored === 'ok' && v === '3', restored + '/' + v);

    // 11. Malformed import rejected with data intact
    const badRes = await cdp.evalExpr(`window.TodoLogic.validateImport({app:'todo-list-bd',version:1,tasks:[{id:'x',title:'',priority:'high',done:false,createdAt:'x'}]}).ok`);
    check('malformed import rejected', badRes === false);
    v = await cdp.evalExpr(`document.getElementById('statTotal').textContent`);
    check('data intact after bad import', v === '3', v);

    // 12. 390px overflow (mobile only)
    if (MODE === 'mobile') {
      const overflow = await cdp.evalExpr(`document.documentElement.scrollWidth <= 390`);
      check('390px no horizontal overflow', overflow === true, 'scrollWidth=' + await cdp.evalExpr(`document.documentElement.scrollWidth`));
    }

    // 13. Zero network requests (ignore the initial file:// document load)
    const reqs = cdp.events.filter(e => e.method === 'Network.requestWillBeSent' && e.params && e.params.request && !e.params.request.url.startsWith('file://') && !e.params.request.url.startsWith('data:'));
    check('zero network requests', reqs.length === 0, JSON.stringify(reqs.slice(0, 1)));
  } catch (e) {
    failed++;
    console.log('FAIL harness :: ' + (e && e.stack || e));
  } finally {
    if (cdp) cdp.close();
    chrome.kill();
  }
  console.log('\n' + passed + ' passed, ' + failed + ' failed (' + MODE + ')');
  process.exit(failed ? 1 : 0);
})();
