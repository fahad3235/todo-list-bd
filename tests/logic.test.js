/* todo-list-bd - node unit tests. Run: node tests/logic.test.js */
'use strict';
const L = require('../js/logic.js');
let passed = 0, failed = 0;
function check(name, cond, extra) {
  if (cond) { passed++; console.log('PASS ' + name); }
  else { failed++; console.log('FAIL ' + name + (extra ? ' :: ' + extra : '')); }
}
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// validation
check('empty title rejected', L.validateTaskInput({ title: '  ' }).includes('title_required'));
check('101-char title rejected', L.validateTaskInput({ title: 'x'.repeat(101) }).includes('title_too_long'));
check('100-char title ok', L.validateTaskInput({ title: 'x'.repeat(100) }).length === 0);
check('501-char note rejected', L.validateTaskInput({ title: 'a', note: 'x'.repeat(501) }).includes('note_too_long'));
check('bad priority rejected', L.validateTaskInput({ title: 'a', priority: 'urgent' }).includes('priority_invalid'));
check('bad due date rejected', L.validateTaskInput({ title: 'a', dueDate: '2026-02-30' }).includes('due_invalid'));
check('leap due date ok', L.validateTaskInput({ title: 'a', dueDate: '2028-02-29' }).length === 0);
check('31-char category rejected', L.validateTaskInput({ title: 'a', category: 'x'.repeat(31) }).includes('category_too_long'));

// status
const TODAY = '2026-10-16';
const tDone = { done: true, dueDate: '2026-10-01' };
const tOver = { done: false, dueDate: '2026-10-15' };
const tToday = { done: false, dueDate: '2026-10-16' };
const tFuture = { done: false, dueDate: '2026-10-20' };
const tNoDue = { done: false, dueDate: '' };
check('status done', L.taskStatus(tDone, TODAY) === 'done');
check('status overdue', L.taskStatus(tOver, TODAY) === 'overdue');
check('status due-today', L.taskStatus(tToday, TODAY) === 'due-today');
check('status pending future', L.taskStatus(tFuture, TODAY) === 'pending');
check('status pending no-due', L.taskStatus(tNoDue, TODAY) === 'pending');
check('done task never overdue', L.taskStatus({ done: true, dueDate: '2020-01-01' }, TODAY) === 'done');

// toggle
const toggled = L.toggleDone(tFuture, TODAY);
check('toggle sets done + doneDate', toggled.done === true && toggled.doneDate === TODAY);
check('toggle back clears', L.toggleDone(toggled, TODAY).done === false && L.toggleDone(toggled, TODAY).doneDate === '');

// filter
const tasks = [
  { id: '1', title: 'Buy milk', note: '', priority: 'high', category: 'Home', dueDate: '2026-10-15', done: false, doneDate: '', createdAt: '2026-10-10T00:00:00.000Z' },
  { id: '2', title: 'Read chapter', note: 'DS notes', priority: 'low', category: 'Study', dueDate: '2026-10-16', done: false, doneDate: '', createdAt: '2026-10-11T00:00:00.000Z' },
  { id: '3', title: 'Submit lab', note: '', priority: 'medium', category: 'Study', dueDate: '2026-10-20', done: true, doneDate: '2026-10-16', createdAt: '2026-10-12T00:00:00.000Z' },
  { id: '4', title: 'Call mama', note: '', priority: 'high', category: '', dueDate: '', done: false, doneDate: '', createdAt: '2026-10-13T00:00:00.000Z' }
];
check('filter overdue', L.filterTasks(tasks, { status: 'overdue', today: TODAY }).map(x => x.id).join() === '1');
check('filter due-today', L.filterTasks(tasks, { status: 'due-today', today: TODAY }).map(x => x.id).join() === '2');
check('filter done', L.filterTasks(tasks, { status: 'done', today: TODAY }).map(x => x.id).join() === '3');
check('filter priority high', L.filterTasks(tasks, { priority: 'high', today: TODAY }).map(x => x.id).join() === '1,4');
check('filter category Study', L.filterTasks(tasks, { category: 'Study', today: TODAY }).map(x => x.id).join() === '2,3');
check('search bangla-safe', L.filterTasks(tasks, { query: 'MILK', today: TODAY }).map(x => x.id).join() === '1');
check('search in note', L.filterTasks(tasks, { query: 'ds notes', today: TODAY }).map(x => x.id).join() === '2');

// sort
check('sort due: overdue, today, future, no-due', L.sortTasks(tasks, 'due').map(x => x.id).join() === '1,2,3,4');
check('sort priority: high, high, medium, low', L.sortTasks(tasks, 'priority').map(x => x.id).join() === '1,4,3,2');
check('sort created', L.sortTasks(tasks, 'created').map(x => x.id).join() === '1,2,3,4');

// stats
const s = L.stats(tasks, TODAY);
check('stats total 4', s.total === 4);
check('stats done 1', s.done === 1);
check('stats pending 3', s.pending === 3);
check('stats overdue 1', s.overdue === 1);
check('stats dueToday 1', s.dueToday === 1);
check('stats doneToday 1', s.doneToday === 1);
check('stats pct 25', s.completionPct === 25);
check('stats empty 0%', L.stats([], TODAY).completionPct === 0);

// categories
check('categories sorted unique', eq(L.categories(tasks), ['Home', 'Study']));

// import validation
const good = { app: 'todo-list-bd', version: 1, tasks: tasks };
check('import good ok', L.validateImport(good).ok === true);
check('import wrong app', L.validateImport({ app: 'other', version: 1, tasks: [] }).ok === false);
check('import wrong version', L.validateImport({ app: 'todo-list-bd', version: 2, tasks: [] }).ok === false);
check('import tasks not array', L.validateImport({ app: 'todo-list-bd', version: 1, tasks: {} }).ok === false);
check('import dup id', L.validateImport({ app: 'todo-list-bd', version: 1, tasks: [tasks[0], tasks[0]] }).error === 'duplicate_id');
check('import bad task title', L.validateImport({ app: 'todo-list-bd', version: 1, tasks: [{ ...tasks[0], title: '' }] }).ok === false);
check('import bad done type', L.validateImport({ app: 'todo-list-bd', version: 1, tasks: [{ ...tasks[0], done: 'yes' }] }).ok === false);
check('import bad doneDate', L.validateImport({ app: 'todo-list-bd', version: 1, tasks: [{ ...tasks[0], doneDate: '2026-13-01' }] }).ok === false);

// digits
check('bn digits', L.toBnDigits('2026-10-16') === '\u09e8\u09e6\u09e8\u09ec-\u09e7\u09e6-\u09e7\u09ec');
check('formatNum en', L.formatNum(25, 'en') === '25');
check('formatNum bn', L.formatNum(25, 'bn') === '\u09e8\u09eb');

console.log('\n' + passed + ' passed, ' + failed + ' failed');
process.exit(failed ? 1 : 0);
