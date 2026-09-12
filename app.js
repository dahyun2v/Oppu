import { CATALOG, THEMES, emptyState, dateKey, seasonStart, validateBackup, periodStats } from './data.js';

const STORAGE_KEY = 'oppu-data-v1';
const app = document.querySelector('#app');
const today = new Date();
let month = new Date(today.getFullYear(), today.getMonth(), 1);
let statsAnchor = new Date(month);
let tab = 'calendar';
let statsMode = 'month';
let filter = 'all';
let undo = null;
let state = load();

function load() {
  try { const value = JSON.parse(localStorage.getItem(STORAGE_KEY)); return validateBackup(value) ? value : emptyState(); }
  catch { return emptyState(); }
}
function persist() { state.updatedAt = new Date().toISOString(); localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function perfume(id) { return CATALOG.find(p => p.id === id) || { id, name: '알 수 없는 향수', brand: '', theme: 'musk' }; }
function themeOf(id) { return state.themes[id] || perfume(id).theme; }
function esc(s = '') { const span = document.createElement('span'); span.textContent = s; return span.innerHTML; }
function icon(name) { return `<svg aria-hidden="true" viewBox="0 0 24 24"><use href="icons/sprite.svg#${name}"></use></svg>`; }

function calendar() {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const count = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Array(first.getDay()).fill('<span class="blank"></span>');
  for (let day = 1; day <= count; day++) {
    const date = new Date(month.getFullYear(), month.getMonth(), day), key = dateKey(date), entry = state.records[key];
    cells.push(`<button class="day ${key === dateKey(today) ? 'today' : ''}" data-day="${key}" aria-label="${day}일${entry ? ', 기록 있음' : ''}"><span class="number">${day}</span><span class="day-items">${(entry?.items || []).slice(0, 3).map(i => `<span class="chip t-${themeOf(i.id)}">${esc(perfume(i.id).name)}${i.count > 1 ? ` · ${i.count}` : ''}</span>`).join('')}</span></button>`);
  }
  return `<section><div class="month-head"><div><p>${month.getFullYear()}</p><h2>${month.getMonth() + 1}월</h2></div><div><button class="small" data-today>오늘</button><button class="icon" data-month="-1" aria-label="이전 달">${icon('left')}</button><button class="icon" data-month="1" aria-label="다음 달">${icon('right')}</button></div></div><div class="calendar"><span class="sun">일</span>${['월','화','수','목','금','토'].map(x=>`<span>${x}</span>`).join('')}${cells.join('')}</div><div class="legend">${Object.entries(THEMES).map(([k,v])=>`<span><i class="t-${k}"></i>${v}</span>`).join('')}</div><p class="help">날짜를 눌러 오늘의 향을 남겨보세요.</p></section>`;
}

function shelf() {
  const items = state.shelf.map(perfume).filter(p => filter === 'all' || themeOf(p.id) === filter);
  return `<section><div class="heading"><h2>향수장 <small>${state.shelf.length}</small></h2><button data-add>${icon('plus')} 추가</button></div><div class="filters"><button data-filter="all" aria-pressed="${filter==='all'}">전체</button>${Object.entries(THEMES).map(([k,v])=>`<button data-filter="${k}" aria-pressed="${filter===k}">${v}</button>`).join('')}</div>${items.length ? items.map(p=>`<button class="shelf-row" data-detail="${p.id}"><span class="bottle t-${themeOf(p.id)}">${icon('bottle')}</span><span><b>${p.name}</b><small>${p.brand}</small></span><em class="t-${themeOf(p.id)}">${THEMES[themeOf(p.id)]}</em></button>`).join('') : `<div class="empty"><p>향수장을 채워볼까요?</p><button data-add>향수 찾아 담기</button></div>`}<div class="backup"><h3>내 데이터</h3><p>기록은 이 기기에만 저장돼요. 휴대폰을 바꾸기 전에 백업해 주세요.</p><div><button data-export>${icon('download')} JSON 내보내기</button><label class="button">${icon('upload')} 가져오기<input type="file" data-import accept="application/json"></label></div></div></section>`;
}

function stats() {
  const start = statsMode === 'month' ? new Date(statsAnchor.getFullYear(), statsAnchor.getMonth(), 1) : seasonStart(statsAnchor);
  const months = statsMode === 'month' ? 1 : 3, result = periodStats(state, start, months);
  const end = new Date(start.getFullYear(), start.getMonth() + months, 0);
  const seasons = {2:'봄',5:'여름',8:'가을',11:'겨울'};
  const title = statsMode === 'month' ? `${start.getFullYear()}년 ${start.getMonth()+1}월` : `${start.getFullYear()}년 ${seasons[start.getMonth()]}`;
  const ranks = Object.entries(result.counts).sort((a,b)=>b[1]-a[1]);
  return `<section><div class="heading"><h2>통계</h2></div><div class="segments"><button data-mode="month" aria-pressed="${statsMode==='month'}">월별</button><button data-mode="season" aria-pressed="${statsMode==='season'}">계절별</button></div><div class="period"><button class="icon" data-period="-1">${icon('left')}</button><div><h3>${title}</h3>${months===3?`<small>${start.getFullYear()}.${start.getMonth()+1} — ${end.getFullYear()}.${end.getMonth()+1}</small>`:''}</div><button class="icon" data-period="1">${icon('right')}</button></div>${result.uses ? `<p class="total"><b>${result.days}일</b> 동안 <b>${result.uses}회</b></p><h3 class="section-title">많이 뿌린 향수</h3>${ranks.map(([id,n],i)=>`<div class="rank"><span>${i+1}</span><div>${perfume(id).name}<i><b class="t-${themeOf(id)}" style="width:${n/ranks[0][1]*100}%"></b></i></div><strong>${n}회</strong></div>`).join('')}<h3 class="section-title border">향 테마 비중</h3><div class="theme-stats">${Object.entries(result.themes).sort((a,b)=>b[1]-a[1]).map(([t,n])=>`<span><i class="t-${t}"></i>${THEMES[t]} <b>${Math.round(n/result.uses*100)}%</b></span>`).join('')}</div>` : `<div class="empty"><p>이 기간에는 기록이 없어요.</p><button data-calendar>달력에서 기록하기</button></div>`}</section>`;
}

function render() {
  app.innerHTML = `<main class="phone"><header><div><h1>오뿌<i></i></h1><p>오늘의 향을 기억하는 방법</p></div><span class="local">내 기기에 저장</span></header><div class="content">${tab==='calendar'?calendar():tab==='shelf'?shelf():stats()}</div><nav>${[['calendar','calendar','달력'],['shelf','bottle','향수장'],['stats','chart','통계']].map(([id,ic,label])=>`<button data-tab="${id}" aria-current="${tab===id?'page':'false'}">${icon(ic)}${label}</button>`).join('')}</nav></main><div id="modal"></div><div id="toast" role="status"></div>`;
}

function showDialog(html) { document.querySelector('#modal').innerHTML = `<div class="shade" data-close></div><dialog open aria-modal="true">${html}</dialog>`; document.querySelector('dialog input:not([type=checkbox]), dialog button')?.focus(); }
function closeDialog() { document.querySelector('#modal').innerHTML = ''; }
function choices(selected = new Map(), day = null) {
  return `<div class="search"><input data-search placeholder="브랜드 또는 향수 검색" aria-label="향수 검색"></div><div class="choices">${CATALOG.map(p=>`<label data-choice-text="${p.name} ${p.brand}"><span class="stripe t-${themeOf(p.id)}"></span><span><b>${p.name}</b><small>${p.brand} · ${THEMES[themeOf(p.id)]}</small></span><input type="checkbox" data-pick="${p.id}" ${selected.has(p.id)?'checked':''}></label>`).join('')}</div>${day?`<details><summary>메모 · 사용 횟수</summary><textarea data-memo maxlength="240" placeholder="오늘의 향을 간단히 적어보세요">${esc(day.memo)}</textarea><div class="counts"></div></details>`:''}`;
}
function openDay(key) {
  const old = state.records[key] || {items:[],memo:''}, selected = new Map(old.items.map(i=>[i.id,i.count]));
  showDialog(`<form data-day-form="${key}"><div class="dialog-head"><div><small>이날의 향수</small><h2>${Number(key.slice(5,7))}월 ${Number(key.slice(8))}일</h2></div><button type="button" class="icon" data-close aria-label="닫기">${icon('close')}</button></div>${choices(selected,old)}<footer><button type="button" class="danger" data-delete ${old.items.length?'':'hidden'}>기록 지우기</button><button class="primary">저장하기</button></footer></form>`);
  const modal = document.querySelector('dialog'); modal._selected = selected; updateCounts();
}
function updateCounts() {
  const dialog = document.querySelector('dialog'), box = dialog?.querySelector('.counts'); if (!box) return;
  box.innerHTML = [...dialog._selected].map(([id,n])=>`<div><span>${perfume(id).name}</span><span><button type="button" data-count="${id}" data-delta="-1" ${n===1?'disabled':''}>−</button><output>${n}회</output><button type="button" data-count="${id}" data-delta="1">+</button></span></div>`).join('');
}
function openAdd() { showDialog(`<form data-add-form><div class="dialog-head"><div><small>향수장</small><h2>향수 찾아 담기</h2></div><button type="button" class="icon" data-close>${icon('close')}</button></div>${choices(new Map())}<footer><button class="primary">선택한 향수 담기</button></footer></form>`); document.querySelector('dialog')._selected = new Map(); }
function openDetail(id) { const p=perfume(id); showDialog(`<form data-detail-form="${id}"><div class="dialog-head"><div><small>향수 정보</small><h2>${p.name}</h2><p>${p.brand}</p></div><button type="button" class="icon" data-close>${icon('close')}</button></div><label class="field">대표 테마<select data-theme>${Object.entries(THEMES).map(([k,v])=>`<option value="${k}" ${themeOf(id)===k?'selected':''}>${v}</option>`).join('')}</select></label><p class="note">달력 색상과 통계에 함께 반영돼요.</p><footer><button type="button" class="danger" data-remove>향수장에서 빼기</button><button class="primary">변경 저장</button></footer></form>`); }
function toast(message, action) { const el=document.querySelector('#toast'); undo=action; el.innerHTML=`<span>${message}</span>${action?'<button data-undo>되돌리기</button>':''}`; el.className='show'; setTimeout(()=>el?.classList.remove('show'),4000); }

app.addEventListener('click', e => {
  const b=e.target.closest('button'); if(!b) return;
  if(b.dataset.tab){tab=b.dataset.tab;render();} else if(b.dataset.day)openDay(b.dataset.day);
  else if('today' in b.dataset){month=new Date(today.getFullYear(),today.getMonth(),1);render();}
  else if(b.dataset.month){month=new Date(month.getFullYear(),month.getMonth()+Number(b.dataset.month),1);render();}
  else if('add' in b.dataset)openAdd(); else if(b.dataset.detail)openDetail(b.dataset.detail);
  else if(b.dataset.filter){filter=b.dataset.filter;render();} else if(b.dataset.mode){statsMode=b.dataset.mode;render();}
  else if(b.dataset.period){statsAnchor=new Date(statsAnchor.getFullYear(),statsAnchor.getMonth()+Number(b.dataset.period)*(statsMode==='month'?1:3),1);render();}
  else if('calendar' in b.dataset){tab='calendar';render();} else if('export' in b.dataset){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));a.download=`oppu-backup-${dateKey(today)}.json`;a.click();URL.revokeObjectURL(a.href);}
});
app.addEventListener('change', async e=>{ if(e.target.matches('[data-import]')){try{const parsed=JSON.parse(await e.target.files[0].text());if(!validateBackup(parsed))throw Error();if(!confirm('현재 기록을 백업 파일의 내용으로 바꿀까요?'))return;state=parsed;persist();render();toast('백업을 가져왔어요.');}catch{alert('오뿌 백업 파일 형식이 아니에요.');}} });
document.addEventListener('click',e=>{const b=e.target.closest('button,[data-close]');if(!b)return;if('close' in b.dataset)closeDialog();else if(b.dataset.count){const d=document.querySelector('dialog'),id=b.dataset.count;d._selected.set(id,Math.max(1,d._selected.get(id)+Number(b.dataset.delta)));updateCounts();}else if('delete' in b.dataset){const form=b.closest('form'),key=form.dataset.dayForm,previous=structuredClone(state);delete state.records[key];persist();closeDialog();render();toast('기록을 지웠어요.',()=>{state=previous;persist();render();});}else if('remove' in b.dataset){const id=b.closest('form').dataset.detailForm,previous=[...state.shelf];state.shelf=state.shelf.filter(x=>x!==id);persist();closeDialog();render();toast('향수장에서 뺐어요. 지난 기록은 남아 있어요.',()=>{state.shelf=previous;persist();render();});}else if('undo' in b.dataset&&undo){undo();undo=null;}});
document.addEventListener('change',e=>{if(e.target.matches('[data-pick]')){const d=e.target.closest('dialog'),id=e.target.dataset.pick;e.target.checked?d._selected.set(id,1):d._selected.delete(id);updateCounts();}});
document.addEventListener('input',e=>{if(e.target.matches('[data-search]')){const q=e.target.value.trim().toLowerCase();e.target.closest('dialog').querySelectorAll('[data-choice-text]').forEach(x=>x.hidden=!x.dataset.choiceText.toLowerCase().includes(q));}});
document.addEventListener('submit',e=>{e.preventDefault();const form=e.target;if(form.dataset.dayForm){const selected=form.closest('dialog')._selected;if(!selected.size){alert('향수를 하나 이상 골라 주세요.');return;}const previous=structuredClone(state);state.records[form.dataset.dayForm]={items:[...selected].map(([id,count])=>({id,count})),memo:form.querySelector('[data-memo]').value.trim()};selected.forEach((_,id)=>{if(!state.shelf.includes(id))state.shelf.push(id);});persist();closeDialog();render();toast('향수를 기록했어요.',()=>{state=previous;persist();render();});}else if('addForm' in form.dataset){const selected=form.closest('dialog')._selected;if(!selected.size){alert('향수를 하나 이상 골라 주세요.');return;}selected.forEach((_,id)=>{if(!state.shelf.includes(id))state.shelf.push(id);});persist();closeDialog();render();toast('향수장에 담았어요.');}else if(form.dataset.detailForm){state.themes[form.dataset.detailForm]=form.querySelector('[data-theme]').value;persist();closeDialog();render();toast('대표 테마를 바꿨어요.');}});

render();
if ('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js'));
