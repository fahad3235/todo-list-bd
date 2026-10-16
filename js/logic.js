/* todo-list-bd - pure task logic. No DOM, no I/O. Pure ASCII: Bengali is
   emitted by the caller via toBnDigits(), never stored as raw text here. */
'use strict';

var APP_ID = 'todo-list-bd';
var APP_VERSION = 1;
var PRIORITIES = ['high', 'medium', 'low'];
var PRIORITY_RANK = { high: 0, medium: 1, low: 2 };
var BN_DIGITS = ['\u09e6', '\u09e7', '\u09e8', '\u09e9', '\u09ea', '\u09eb', '\u09ec', '\u09ed', '\u09ee', '\u09ef'];

function isValidDateStr(s) {
  if (typeof s !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  var d = new Date(s + 'T00:00:00Z');
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}

function todayStr(asof) {
  if (asof && isValidDateStr(asof)) return asof;
  var d = new Date();
  var y = d.getFullYear(), m = d.getMonth() + 1, day = d.getDate();
  return y + '-' + (m < 10 ? '0' : '') + m + '-' + (day < 10 ? '0' : '') + day;
}

/* Validate raw form input. Returns an array of error keys (empty = valid). */
function validateTaskInput(input) {
  var errors = [];
  var title = (input && typeof input.title === 'string') ? input.title.trim() : '';
  if (!title) errors.push('title_required');
  else if (title.length > 100) errors.push('title_too_long');
  if (input && input.note != null && String(input.note).length > 500) errors.push('note_too_long');
  if (input && input.priority != null && PRIORITIES.indexOf(input.priority) === -1) errors.push('priority_invalid');
  var cat = (input && typeof input.category === 'string') ? input.category.trim() : '';
  if (cat.length > 30) errors.push('category_too_long');
  if (input && input.dueDate != null && input.dueDate !== '' && !isValidDateStr(input.dueDate)) errors.push('due_invalid');
  return errors;
}

function normalizeTask(input, existing) {
  var t = existing ? Object.assign({}, existing) : {};
  t.id = existing ? existing.id : ('t' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
  t.title = input.title.trim();
  t.note = (input.note || '').trim();
  t.priority = PRIORITIES.indexOf(input.priority) === -1 ? 'medium' : input.priority;
  t.category = (input.category || '').trim();
  t.dueDate = input.dueDate || '';
  if (existing) {
    t.done = !!existing.done;
    t.doneDate = existing.doneDate || '';
    t.createdAt = existing.createdAt;
  } else {
    t.done = false;
    t.doneDate = '';
    t.createdAt = new Date().toISOString();
  }
  return t;
}

function taskStatus(task, today) {
  if (task.done) return 'done';
  if (task.dueDate && task.dueDate < today) return 'overdue';
  if (task.dueDate && task.dueDate === today) return 'due-today';
  return 'pending';
}

function toggleDone(task, today) {
  var t = Object.assign({}, task);
  t.done = !t.done;
  t.doneDate = t.done ? today : '';
  return t;
}

function filterTasks(tasks, opts) {
  var o = opts || {};
  var today = o.today || todayStr();
  var q = (o.query || '').trim().toLowerCase();
  return tasks.filter(function (t) {
    if (o.status && o.status !== 'all') {
      if (taskStatus(t, today) !== o.status) return false;
    }
    if (o.priority && o.priority !== 'all' && t.priority !== o.priority) return false;
    if (o.category && o.category !== 'all' && t.category !== o.category) return false;
    if (q) {
      var hay = (t.title + ' ' + t.note + ' ' + t.category).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  });
}

function sortTasks(tasks, key) {
  var arr = tasks.slice();
  function dueCmp(a, b) {
    if (a.dueDate && b.dueDate) return a.dueDate < b.dueDate ? -1 : (a.dueDate > b.dueDate ? 1 : 0);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return 0;
  }
  if (key === 'priority') {
    arr.sort(function (a, b) {
      var r = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
      return r !== 0 ? r : (dueCmp(a, b) || (a.createdAt < b.createdAt ? -1 : 1));
    });
  } else if (key === 'created') {
    arr.sort(function (a, b) { return a.createdAt < b.createdAt ? -1 : 1; });
  } else { /* due (default) */
    arr.sort(function (a, b) { return dueCmp(a, b) || (a.createdAt < b.createdAt ? -1 : 1); });
  }
  return arr;
}

function stats(tasks, today) {
  var s = { total: tasks.length, done: 0, pending: 0, overdue: 0, dueToday: 0, doneToday: 0, completionPct: 0 };
  tasks.forEach(function (t) {
    var st = taskStatus(t, today);
    if (st === 'done') { s.done++; if (t.doneDate === today) s.doneToday++; }
    else if (st === 'overdue') s.overdue++;
    else if (st === 'due-today') s.dueToday++;
    if (!t.done) s.pending++;
  });
  s.completionPct = s.total === 0 ? 0 : Math.round((s.done / s.total) * 100);
  return s;
}

function categories(tasks) {
  var seen = {};
  var out = [];
  tasks.forEach(function (t) {
    if (t.category && !seen[t.category]) { seen[t.category] = true; out.push(t.category); }
  });
  out.sort();
  return out;
}

/* Strict import validation. Returns {ok:true, tasks} or {ok:false, error}. */
function validateImport(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { ok: false, error: 'not_an_object' };
  if (data.app !== APP_ID) return { ok: false, error: 'wrong_app' };
  if (data.version !== APP_VERSION) return { ok: false, error: 'wrong_version' };
  if (!Array.isArray(data.tasks)) return { ok: false, error: 'tasks_not_array' };
  var ids = {};
  var tasks = [];
  for (var i = 0; i < data.tasks.length; i++) {
    var t = data.tasks[i];
    if (!t || typeof t !== 'object') return { ok: false, error: 'task_not_object' };
    if (typeof t.id !== 'string' || !t.id) return { ok: false, error: 'task_id' };
    if (ids[t.id]) return { ok: false, error: 'duplicate_id' };
    ids[t.id] = true;
    if (validateTaskInput(t).length) return { ok: false, error: 'task_invalid' };
    if (typeof t.done !== 'boolean') return { ok: false, error: 'task_done' };
    if (t.doneDate != null && t.doneDate !== '' && !isValidDateStr(t.doneDate)) return { ok: false, error: 'task_done_date' };
    if (typeof t.createdAt !== 'string' || !t.createdAt) return { ok: false, error: 'task_created' };
    tasks.push({
      id: t.id, title: t.title.trim(), note: (t.note || '').trim(),
      priority: t.priority, category: (t.category || '').trim(),
      dueDate: t.dueDate || '', done: t.done, doneDate: t.doneDate || '', createdAt: t.createdAt
    });
  }
  return { ok: true, tasks: tasks };
}

function toBnDigits(str) {
  return String(str).replace(/[0-9]/g, function (d) { return BN_DIGITS[+d]; });
}

function formatNum(n, lang) {
  var s = String(n);
  return lang === 'bn' ? toBnDigits(s) : s;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { APP_ID: APP_ID, APP_VERSION: APP_VERSION, PRIORITIES: PRIORITIES,
    isValidDateStr: isValidDateStr, todayStr: todayStr, validateTaskInput: validateTaskInput,
    normalizeTask: normalizeTask, taskStatus: taskStatus, toggleDone: toggleDone,
    filterTasks: filterTasks, sortTasks: sortTasks, stats: stats, categories: categories,
    validateImport: validateImport, toBnDigits: toBnDigits, formatNum: formatNum };
} else if (typeof window !== 'undefined') {
  window.TodoLogic = { APP_ID: APP_ID, APP_VERSION: APP_VERSION, PRIORITIES: PRIORITIES,
    isValidDateStr: isValidDateStr, todayStr: todayStr, validateTaskInput: validateTaskInput,
    normalizeTask: normalizeTask, taskStatus: taskStatus, toggleDone: toggleDone,
    filterTasks: filterTasks, sortTasks: sortTasks, stats: stats, categories: categories,
    validateImport: validateImport, toBnDigits: toBnDigits, formatNum: formatNum };
}
