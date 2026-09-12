import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyState, seasonStart, validateBackup, periodStats } from '../data.js';

test('winter includes December through the following February', () => {
  assert.deepEqual([seasonStart(new Date(2027,1,10)).getFullYear(),seasonStart(new Date(2027,1,10)).getMonth()],[2026,11]);
});
test('statistics separate recorded days and total uses', () => {
  const state=emptyState(); state.records['2026-09-10']={memo:'',items:[{id:'blanche',count:2},{id:'chance',count:1}]};
  const result=periodStats(state,new Date(2026,8,1),1); assert.equal(result.days,1); assert.equal(result.uses,3);
});
test('backup validation rejects malformed counts and versions', () => {
  const good=emptyState(); good.records['2026-09-10']={memo:'',items:[{id:'blanche',count:1}]}; assert.equal(validateBackup(good),true);
  assert.equal(validateBackup({...good,version:2}),false); good.records['2026-09-10'].items[0].count=0; assert.equal(validateBackup(good),false);
});
