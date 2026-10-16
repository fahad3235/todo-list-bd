/* todo-list-bd - UI wiring. Pure ASCII: Bengali strings are \uXXXX escapes. */
'use strict';

var I18N = {
  en: {
    appTitle: 'To-Do List BD', tagline: 'Simple offline task list for everyday life.',
    addTask: 'Add task', title: 'Title', titlePh: 'e.g. Buy notebooks',
    note: 'Note (optional)', notePh: 'Details, links, reminders...',
    priority: 'Priority', category: 'Category', categoryPh: 'e.g. Study, Home',
    dueDate: 'Due date', save: 'Save task', cancelEdit: 'Cancel edit',
    high: 'High', medium: 'Medium', low: 'Low',
    all: 'All', pending: 'Pending', done: 'Done', overdue: 'Overdue', dueToday: 'Due today',
    searchPh: 'Search tasks...', sortBy: 'Sort by', sortDue: 'Due date', sortPriority: 'Priority', sortCreated: 'Newest',
    total: 'Total', completed: 'Completed', pendingStat: 'Pending', overdueStat: 'Overdue', dueTodayStat: 'Due today',
    noTasks: 'No tasks yet. Add your first task above.',
    noMatch: 'No tasks match the current filters.',
    edit: 'Edit', del: 'Delete', markDone: 'Mark done', markUndone: 'Mark not done',
    export: 'Export JSON', import: 'Import JSON', erase: 'Erase all data',
    eraseConfirm: 'Type DELETE to erase all tasks:',
    eraseDone: 'All tasks erased.', importOk: 'Import successful.',
    importBad: 'Import rejected: invalid file. Your data is unchanged.',
    noDue: 'No due date', dueLabel: 'Due', doneOn: 'Done',
    langBtn: '\u09ac\u09be\u0982\u09b2\u09be', footer: 'Offline personal tool. Your tasks stay in this browser (localStorage). No account, no server.',
    confirmDelete: 'Delete this task?', editMode: 'Editing task - change the fields and press Save.',
    err_title_required: 'Title is required.', err_title_too_long: 'Title must be 100 characters or fewer.',
    err_note_too_long: 'Note must be 500 characters or fewer.',
    err_category_too_long: 'Category must be 30 characters or fewer.',
    err_due_invalid: 'Due date is not a valid date.', err_priority_invalid: 'Priority is invalid.',
    emptyCat: 'No category'
  },
  bn: {
    appTitle: '\u099f\u09c1-\u09a1\u09c1 \u09b2\u09bf\u09b8\u09cd\u099f \u09ac\u09bf\u09a1\u09bf', tagline: '\u09a6\u09cd\u09af\u09ac\u09b9\u09be\u09b0\u09bf\u0995 \u0995\u09be\u099c\u09c7\u09b0 \u099c\u09a8\u09cd\u09af \u09b8\u09b9\u099c \u0985\u09ab\u09b2\u09be\u0987\u09a8 \u0995\u09be\u099c\u09c7\u09b0 \u09a4\u09be\u09b2\u09bf\u0995\u09be\u0964',
    addTask: '\u0995\u09be\u099c \u09af\u09cb\u0997 \u0995\u09b0\u09c1\u09a8', title: '\u09b6\u09bf\u09b0\u09cb\u09a8\u09be\u09ae', titlePh: '\u09af\u09c7\u09ae\u09a8: \u0996\u09be\u09a4\u09be \u0995\u09bf\u09a8\u09c1\u09a8',
    note: '\u09a8\u09cb\u099f (\u0987\u099a\u09cd\u099b\u09be\u09ae\u09a4)', notePh: '\u09ac\u09bf\u09b8\u09cd\u09a4\u09be\u09b0\u09bf\u09a4, \u09b2\u09bf\u0999\u09cd\u0995, \u09b8\u09cd\u09ae\u09b0\u09a3\u09bf\u0995\u09be...',
    priority: '\u0985\u0997\u09cd\u09b0\u09be\u09a7\u09bf\u0995\u09be\u09b0', category: '\u09ac\u09bf\u09ad\u09be\u0997', categoryPh: '\u09af\u09c7\u09ae\u09a8: \u09aa\u09a2\u09bc\u09be\u09b6\u09cb\u09a8\u09be, \u09ac\u09be\u09a1\u09bc\u09bf',
    dueDate: '\u09b6\u09c7\u09b7 \u09a4\u09be\u09b0\u09bf\u0996', save: '\u0995\u09be\u099c \u09b8\u0982\u09b0\u0995\u09cd\u09b7\u09a3 \u0995\u09b0\u09c1\u09a8', cancelEdit: '\u09b8\u09ae\u09cd\u09aa\u09be\u09a6\u09a8\u09be \u09ac\u09be\u09a4\u09bf\u09b2',
    high: '\u0989\u099a\u09cd\u099a', medium: '\u09ae\u09be\u099d\u09be\u09b0\u09bf', low: '\u09a8\u09bf\u09ae\u09cd\u09a8',
    all: '\u09b8\u09ac', pending: '\u09ac\u09be\u0995\u09bf', done: '\u09b8\u09ae\u09cd\u09aa\u09a8\u09cd\u09a8', overdue: '\u09ae\u09c7\u09df\u09be\u09a6\u09cb\u09a4\u09cd\u09a4\u09c0\u09b0\u09cd\u09a3', dueToday: '\u0986\u099c\u0987 \u09b6\u09c7\u09b7',
    searchPh: '\u0995\u09be\u099c \u0996\u09c1\u0981\u099c\u09c1\u09a8...', sortBy: '\u09b8\u09be\u099c\u09be\u09a8', sortDue: '\u09b6\u09c7\u09b7 \u09a4\u09be\u09b0\u09bf\u0996', sortPriority: '\u0985\u0997\u09cd\u09b0\u09be\u09a7\u09bf\u0995\u09be\u09b0', sortCreated: '\u09b8\u09ac\u099a\u09c7\u09df\u09c7 \u09a8\u09a4\u09c1\u09a8',
    total: '\u09ae\u09cb\u099f', completed: '\u09b8\u09ae\u09cd\u09aa\u09a8\u09cd\u09a8', pendingStat: '\u09ac\u09be\u0995\u09bf', overdueStat: '\u09ae\u09c7\u09df\u09be\u09a6\u09cb\u09a4\u09cd\u09a4\u09c0\u09b0\u09cd\u09a3', dueTodayStat: '\u0986\u099c\u0987 \u09b6\u09c7\u09b7',
    noTasks: '\u098f\u0996\u09a8\u09cb \u0995\u09cb\u09a8\u09cb \u0995\u09be\u099c \u09a8\u09c7\u0987\u0964 \u0989\u09aa\u09b0\u09c7 \u0986\u09aa\u09a8\u09be\u09b0 \u09aa\u09cd\u09b0\u09a5\u09ae \u0995\u09be\u099c \u09af\u09cb\u0997 \u0995\u09b0\u09c1\u09a8\u0964',
    noMatch: '\u09ac\u09b0\u09cd\u09a4\u09ae\u09be\u09a8 \u09ab\u09bf\u09b2\u09cd\u099f\u09be\u09b0\u09c7 \u0995\u09cb\u09a8\u09cb \u0995\u09be\u099c \u09ae\u09bf\u09b2\u099b\u09c7 \u09a8\u09be\u0964',
    edit: '\u09b8\u09ae\u09cd\u09aa\u09be\u09a6\u09a8\u09be', del: '\u09ae\u09c1\u099b\u09c1\u09a8', markDone: '\u09b8\u09ae\u09cd\u09aa\u09a8\u09cd\u09a8 \u0995\u09b0\u09c1\u09a8', markUndone: '\u09b8\u09ae\u09cd\u09aa\u09a8\u09cd\u09a8 \u09a8\u09df \u0995\u09b0\u09c1\u09a8',
    export: '\u098f\u0995\u09cd\u09b8\u09aa\u09cb\u09b0\u09cd\u099f JSON', import: '\u0987\u09ae\u09aa\u09cb\u09b0\u09cd\u099f JSON', erase: '\u09b8\u09ac \u09a1\u09c7\u099f\u09be \u09ae\u09c1\u099b\u09c1\u09a8',
    eraseConfirm: 'DELETE \u09b2\u09bf\u0996\u09c7 \u09b8\u09ac \u0995\u09be\u099c \u09ae\u09c1\u099b\u09c1\u09a8:',
    eraseDone: '\u09b8\u09ac \u0995\u09be\u099c \u09ae\u09c1\u099b\u09c7 \u09ab\u09c7\u09b2\u09be \u09b9\u09df\u09c7\u099b\u09c7\u0964', importOk: '\u0987\u09ae\u09aa\u09cb\u09b0\u09cd\u099f \u09b8\u09ab\u09b2 \u09b9\u09df\u09c7\u099b\u09c7\u0964',
    importBad: '\u0987\u09ae\u09aa\u09cb\u09b0\u09cd\u099f \u09ac\u09be\u09a4\u09bf\u09b2: \u0985\u09ac\u09c8\u09a7 \u09ab\u09be\u0987\u09b2\u0964 \u0986\u09aa\u09a8\u09be\u09b0 \u09a1\u09c7\u099f\u09be \u0985\u09aa\u09b0\u09bf\u09ac\u09b0\u09cd\u09a4\u09bf\u09a4 \u0986\u099b\u09c7\u0964',
    noDue: '\u09b6\u09c7\u09b7 \u09a4\u09be\u09b0\u09bf\u0996 \u09a8\u09c7\u0987', dueLabel: '\u09b6\u09c7\u09b7', doneOn: '\u09b8\u09ae\u09cd\u09aa\u09a8\u09cd\u09a8',
    langBtn: 'English', footer: '\u0985\u09ab\u09b2\u09be\u0987\u09a8 \u09ac\u09cd\u09af\u0995\u09cd\u09a4\u09bf\u0997\u09a4 \u099f\u09c1\u09b2\u0964 \u0986\u09aa\u09a8\u09be\u09b0 \u0995\u09be\u099c \u098f\u0987 \u09ac\u09cd\u09b0\u09be\u0989\u099c\u09be\u09b0\u09c7\u0987 (localStorage) \u09a5\u09be\u0995\u09c7\u0964 \u0995\u09cb\u09a8\u09cb \u0985\u09cd\u09af\u09be\u0995\u09be\u0989\u09a8\u09cd\u099f \u09ac\u09be \u09b8\u09be\u09b0\u09cd\u09ad\u09be\u09b0 \u09a8\u09c7\u0987\u0964',
    confirmDelete: '\u098f\u0987 \u0995\u09be\u099c\u099f\u09bf \u09ae\u09c1\u099b\u09ac\u09c7\u09a8?', editMode: '\u0995\u09be\u099c \u09b8\u09ae\u09cd\u09aa\u09be\u09a6\u09a8\u09be \u099a\u09b2\u099b\u09c7 - \u0998\u09b0 \u09aa\u09b0\u09bf\u09ac\u09b0\u09cd\u09a4\u09a8 \u0995\u09b0\u09c7 \u09b8\u0982\u09b0\u0995\u09cd\u09b7\u09a3 \u099a\u09be\u09aa\u09c1\u09a8\u0964',
    err_title_required: '\u09b6\u09bf\u09b0\u09cb\u09a8\u09be\u09ae \u0986\u09ac\u09b6\u09cd\u09af\u0995\u0964', err_title_too_long: '\u09b6\u09bf\u09b0\u09cb\u09a8\u09be\u09ae 100 \u0985\u0995\u09cd\u09b7\u09b0\u09c7\u09b0 \u09ae\u09a7\u09cd\u09af\u09c7 \u09b9\u09a4\u09c7 \u09b9\u09ac\u09c7\u0964',
    err_note_too_long: '\u09a8\u09cb\u099f 500 \u0985\u0995\u09cd\u09b7\u09b0\u09c7\u09b0 \u09ae\u09a7\u09cd\u09af\u09c7 \u09b9\u09a4\u09c7 \u09b9\u09ac\u09c7\u0964',
    err_category_too_long: '\u09ac\u09bf\u09ad\u09be\u0997 30 \u0985\u0995\u09cd\u09b7\u09b0\u09c7\u09b0 \u09ae\u09a7\u09cd\u09af\u09c7 \u09b9\u09a4\u09c7 \u09b9\u09ac\u09c7\u0964',
    err_due_invalid: '\u09b6\u09c7\u09b7 \u09a4\u09be\u09b0\u09bf\u0996 \u09b8\u09a0\u09bf\u0995 \u09a8\u09df\u0964', err_priority_invalid: '\u0985\u0997\u09cd\u09b0\u09be\u09a7\u09bf\u0995\u09be\u09b0 \u09b8\u09a0\u09bf\u0995 \u09a8\u09df\u0964',
    emptyCat: '\u09ac\u09bf\u09ad\u09be\u0997 \u09a8\u09c7\u0987'
  }
};

var STORE_KEY = 'todo-list-bd:v1';
var LANG_KEY = 'todo-list-bd:lang';

var state = { tasks: [], lang: 'en', status: 'all', priority: 'all', category: 'all', query: '', sort: 'due', editingId: null };

function getToday() {
  var m = /[?&]asof=([^&]+)/.exec(location.search);
  if (m) {
    var L = window.TodoLogic || {};
    if (L.isValidDateStr && L.isValidDateStr(decodeURIComponent(m[1]))) return decodeURIComponent(m[1]);
  }
  return (window.TodoLogic || {}).todayStr ? window.TodoLogic.todayStr() : new Date().toISOString().slice(0, 10);
}
var TODAY = getToday();

function t(key) { return (I18N[state.lang] || I18N.en)[key] || key; }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function fmtDate(d) { return state.lang === 'bn' ? window.TodoLogic.toBnDigits(d) : d; }
function fmtNum(n) { return window.TodoLogic.formatNum(n, state.lang); }

function load() {
  try {
    var raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      var data = JSON.parse(raw);
      var res = window.TodoLogic.validateImport(data);
      if (res.ok) state.tasks = res.tasks;
    }
    var lang = localStorage.getItem(LANG_KEY);
    if (lang === 'bn' || lang === 'en') state.lang = lang;
  } catch (e) { /* corrupted storage: start empty */ }
}
function save() {
  localStorage.setItem(STORE_KEY, JSON.stringify({ app: 'todo-list-bd', version: 1, tasks: state.tasks }));
}

function applyLang() {
  document.documentElement.lang = state.lang === 'bn' ? 'bn' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
    el.setAttribute('placeholder', t(el.getAttribute('data-i18n-ph')));
  });
  document.getElementById('langBtn').textContent = t('langBtn');
  renderCategoryOptions();
  render();
}

function renderCategoryOptions() {
  var sel = document.getElementById('filterCategory');
  var cats = window.TodoLogic.categories(state.tasks);
  var cur = state.category;
  sel.innerHTML = '<option value="all">' + esc(t('all')) + '</option>' +
    cats.map(function (c) { return '<option value="' + esc(c) + '"' + (c === cur ? ' selected' : '') + '>' + esc(c) + '</option>'; }).join('');
}

function render() {
  var L = window.TodoLogic;
  var s = L.stats(state.tasks, TODAY);
  document.getElementById('statTotal').textContent = fmtNum(s.total);
  document.getElementById('statDone').textContent = fmtNum(s.done);
  document.getElementById('statPending').textContent = fmtNum(s.pending);
  document.getElementById('statOverdue').textContent = fmtNum(s.overdue);
  document.getElementById('statDueToday').textContent = fmtNum(s.dueToday);
  document.getElementById('statPct').textContent = fmtNum(s.completionPct) + '%';

  var filtered = L.filterTasks(state.tasks, { status: state.status, priority: state.priority, category: state.category, query: state.query, today: TODAY });
  var sorted = L.sortTasks(filtered, state.sort);
  var list = document.getElementById('taskList');
  var empty = document.getElementById('emptyState');
  if (sorted.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
    empty.textContent = state.tasks.length === 0 ? t('noTasks') : t('noMatch');
    return;
  }
  empty.style.display = 'none';
  list.innerHTML = sorted.map(function (task) {
    var st = L.taskStatus(task, TODAY);
    var badge = st === 'done' ? 'done' : st === 'overdue' ? 'overdue' : st === 'due-today' ? 'due-today' : 'pending';
    var meta = [];
    if (task.category) meta.push('<span class="cat">' + esc(task.category) + '</span>');
    if (task.dueDate) meta.push('<span>' + esc(t('dueLabel')) + ': ' + fmtDate(task.dueDate) + '</span>');
    else meta.push('<span>' + esc(t('noDue')) + '</span>');
    if (task.done && task.doneDate) meta.push('<span>' + esc(t('doneOn')) + ': ' + fmtDate(task.doneDate) + '</span>');
    return '<li class="task ' + badge + (task.done ? ' is-done' : '') + '" data-id="' + esc(task.id) + '">' +
      '<button class="check" data-act="toggle" title="' + esc(task.done ? t('markUndone') : t('markDone')) + '" aria-label="' + esc(task.done ? t('markUndone') : t('markDone')) + '">' + (task.done ? '&#10003;' : '') + '</button>' +
      '<div class="task-main"><div class="task-title">' + esc(task.title) +
      ' <span class="prio prio-' + esc(task.priority) + '">' + esc(t(task.priority)) + '</span>' +
      ' <span class="badge badge-' + badge + '">' + esc(t(badge === 'due-today' ? 'dueToday' : badge)) + '</span></div>' +
      (task.note ? '<div class="task-note">' + esc(task.note) + '</div>' : '') +
      '<div class="task-meta">' + meta.join('') + '</div></div>' +
      '<div class="task-actions"><button data-act="edit">' + esc(t('edit')) + '</button>' +
      '<button data-act="del" class="danger">' + esc(t('del')) + '</button></div></li>';
  }).join('');

  list.querySelectorAll('li.task').forEach(function (li) {
    li.addEventListener('click', function (ev) {
      var btn = ev.target.closest('[data-act]');
      if (!btn) return;
      var id = li.getAttribute('data-id');
      var act = btn.getAttribute('data-act');
      if (act === 'toggle') {
        var idx = state.tasks.findIndex(function (x) { return x.id === id; });
        if (idx >= 0) { state.tasks[idx] = L.toggleDone(state.tasks[idx], TODAY); save(); renderCategoryOptions(); render(); }
      } else if (act === 'del') {
        if (confirm(t('confirmDelete'))) {
          state.tasks = state.tasks.filter(function (x) { return x.id !== id; });
          save(); renderCategoryOptions(); render();
        }
      } else if (act === 'edit') {
        var task = state.tasks.find(function (x) { return x.id === id; });
        if (task) startEdit(task);
      }
    });
  });
}

function startEdit(task) {
  state.editingId = task.id;
  document.getElementById('titleInput').value = task.title;
  document.getElementById('noteInput').value = task.note || '';
  document.getElementById('priorityInput').value = task.priority;
  document.getElementById('categoryInput').value = task.category || '';
  document.getElementById('dueInput').value = task.dueDate || '';
  document.getElementById('editBanner').style.display = 'block';
  document.getElementById('editBanner').textContent = t('editMode');
  document.getElementById('cancelEditBtn').style.display = 'inline-block';
  document.getElementById('titleInput').focus();
}
function cancelEdit() {
  state.editingId = null;
  document.getElementById('taskForm').reset();
  document.getElementById('editBanner').style.display = 'none';
  document.getElementById('cancelEditBtn').style.display = 'none';
  document.getElementById('formError').textContent = '';
}

function showErrors(errors) {
  document.getElementById('formError').textContent = errors.map(function (e) { return t('err_' + e); }).join(' ');
}

function init() {
  load();
  document.getElementById('langBtn').addEventListener('click', function () {
    state.lang = state.lang === 'en' ? 'bn' : 'en';
    localStorage.setItem(LANG_KEY, state.lang);
    applyLang();
  });
  document.getElementById('taskForm').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var input = {
      title: document.getElementById('titleInput').value,
      note: document.getElementById('noteInput').value,
      priority: document.getElementById('priorityInput').value,
      category: document.getElementById('categoryInput').value,
      dueDate: document.getElementById('dueInput').value
    };
    var errors = window.TodoLogic.validateTaskInput(input);
    if (errors.length) { showErrors(errors); return; }
    if (state.editingId) {
      var idx = state.tasks.findIndex(function (x) { return x.id === state.editingId; });
      if (idx >= 0) state.tasks[idx] = window.TodoLogic.normalizeTask(input, state.tasks[idx]);
    } else {
      state.tasks.push(window.TodoLogic.normalizeTask(input, null));
    }
    save(); cancelEdit(); renderCategoryOptions(); render();
  });
  document.getElementById('cancelEditBtn').addEventListener('click', cancelEdit);
  document.querySelectorAll('[data-status-chip]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      state.status = chip.getAttribute('data-status-chip');
      document.querySelectorAll('[data-status-chip]').forEach(function (c) { c.classList.toggle('active', c === chip); });
      render();
    });
  });
  document.getElementById('filterPriority').addEventListener('change', function (e) { state.priority = e.target.value; render(); });
  document.getElementById('filterCategory').addEventListener('change', function (e) { state.category = e.target.value; render(); });
  document.getElementById('sortSelect').addEventListener('change', function (e) { state.sort = e.target.value; render(); });
  document.getElementById('searchInput').addEventListener('input', function (e) { state.query = e.target.value; render(); });
  document.getElementById('exportBtn').addEventListener('click', function () {
    var blob = new Blob([JSON.stringify({ app: 'todo-list-bd', version: 1, tasks: state.tasks }, null, 2)], { type: 'application/json' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'todo-list-bd-export.json';
    a.click();
    URL.revokeObjectURL(a.href);
  });
  document.getElementById('importBtn').addEventListener('click', function () { document.getElementById('importFile').click(); });
  document.getElementById('importFile').addEventListener('change', function (e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      var msg = document.getElementById('dataMsg');
      try {
        var res = window.TodoLogic.validateImport(JSON.parse(reader.result));
        if (res.ok) { state.tasks = res.tasks; save(); renderCategoryOptions(); render(); msg.textContent = t('importOk'); msg.className = 'msg ok'; }
        else { msg.textContent = t('importBad'); msg.className = 'msg err'; }
      } catch (err) { msg.textContent = t('importBad'); msg.className = 'msg err'; }
    };
    reader.readAsText(file);
    e.target.value = '';
  });
  document.getElementById('eraseBtn').addEventListener('click', function () {
    var ans = prompt(t('eraseConfirm'));
    var msg = document.getElementById('dataMsg');
    if (ans === 'DELETE') {
      state.tasks = []; save(); renderCategoryOptions(); render();
      msg.textContent = t('eraseDone'); msg.className = 'msg ok';
    }
  });
  applyLang();
}

document.addEventListener('DOMContentLoaded', init);
