'use strict';
const $ = s => document.querySelector(s);
const el = (tag, props = {}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') n.className = v;
    else if (k === 'style') n.style.cssText = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else if (k in n && k !== 'list') n[k] = v;
    else n.setAttribute(k, v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) n.append(c);
  return n;
};
const P = {
  plus: 'M12 4v16M4 12h16', cam: 'M8 6l1.500-2.500h5L16 6h2a3 3 0 013 3v9a3 3 0 01-3 3H6a3 3 0 01-3-3V9a3 3 0 013-3zM12 17a4 4 0 100-8 4 4 0 000 8z', link: 'M10 14a4 4 0 005.700 0l3.600-3.600a4 4 0 00-5.700-5.700L12 6.300M14 10a4 4 0 00-5.700 0l-3.600 3.600a4 4 0 005.700 5.700l1.600-1.600', close: 'M5 5l14 14M19 5L5 19', menu: 'M4 7h16M4 12h16M4 17h16', back: 'M15 4l-8 8 8 8', dots: 'M5 12h.01M12 12h.01M19 12h.01',
  grid: '#M4.1 1.5h3.1a.9.9 0 01.9.9v4.0a.9.9 0 01-.9.9h-3.1a.9.9 0 01-.9-.9v-4.0a.9.9 0 01.9-.9zM10.1 1.5h3.1a.9.9 0 01.9.9v4.0a.9.9 0 01-.9.9h-3.1a.9.9 0 01-.9-.9v-4.0a.9.9 0 01.9-.9zM16.1 1.5h3.1a.9.9 0 01.9.9v4.0a.9.9 0 01-.9.9h-3.1a.9.9 0 01-.9-.9v-4.0a.9.9 0 01.9-.9zM4.1 8.9h3.1a.9.9 0 01.9.9v4.0a.9.9 0 01-.9.9h-3.1a.9.9 0 01-.9-.9v-4.0a.9.9 0 01.9-.9zM10.1 8.9h3.1a.9.9 0 01.9.9v4.0a.9.9 0 01-.9.9h-3.1a.9.9 0 01-.9-.9v-4.0a.9.9 0 01.9-.9zM16.1 8.9h3.1a.9.9 0 01.9.9v4.0a.9.9 0 01-.9.9h-3.1a.9.9 0 01-.9-.9v-4.0a.9.9 0 01.9-.9zM4.1 16.3h3.1a.9.9 0 01.9.9v4.0a.9.9 0 01-.9.9h-3.1a.9.9 0 01-.9-.9v-4.0a.9.9 0 01.9-.9zM10.1 16.3h3.1a.9.9 0 01.9.9v4.0a.9.9 0 01-.9.9h-3.1a.9.9 0 01-.9-.9v-4.0a.9.9 0 01.9-.9zM16.1 16.3h3.1a.9.9 0 01.9.9v4.0a.9.9 0 01-.9.9h-3.1a.9.9 0 01-.9-.9v-4.0a.9.9 0 01.9-.9z',
  reel: 'M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4zM10 8.8v6.400l5.400-3.200z',
  reelf: '#M6 2h12a4 4 0 014 4v12a4 4 0 01-4 4H6a4 4 0 01-4-4V6a4 4 0 014-4zM9.500 8v8a.8.8 0 001.200.7l6.600-4a.8.8 0 000-1.400l-6.600-4A.8.8 0 009.500 8z',
  repost: 'M5 14V9a4 4 0 014-4h8M14 2l3 3-3 3M19 10v5a4 4 0 01-4 4H7M10 22l-3-3 3-3',
  eye: 'M2 13c3-7.500 17-7.500 20 0M12 16.500a1.500 1.500 0 100-3 1.500 1.500 0 000 3z',
  pin: '#M14.500 2.500l7 7-2 .8-1 .2-4 4 .2 4.500-1.500 1.500-4.300-4.300L3 22l-1-1 5.800-6L3.500 10.800 5 9.300l4.500.2 4-4 .2-1z',
  stackf: '#M6 2h9a4 4 0 014 4v9a4 4 0 01-4 4H6a4 4 0 01-4-4V6a4 4 0 014-4zM20.500 6.500H22V17a5 5 0 01-5 5H7v-1.500h9.500a4 4 0 004-4z',
  tag: 'M7 5h2l3-3 3 3h2a4 4 0 014 4v8a4 4 0 01-4 4H7a4 4 0 01-4-4V9a4 4 0 014-4zM12 14a2.600 2.600 0 100-5.200 2.600 2.600 0 000 5.200zM6.500 20c1-4.500 10-4.500 11 0',
  heart: 'M12 20S4 15 4 9.2A4.2 4.2 0 0112 7a4.2 4.2 0 018 2.2C20 15 12 20 12 20z', chat: 'M20 12a8 8 0 10-3.2 6.4L20 20l-.8-3.6A8 8 0 0020 12z',
  send: 'M4.500 4h15a1.500 1.500 0 011.300 2.200l-7.500 13.500a1.500 1.500 0 01-2.700-.2L9.500 12 3.400 6.500A1.500 1.500 0 014.500 4zM9.500 12L16 8', save: 'M6 3h12v18l-6-5-6 5z', home: 'M4 10.500L10.600 4a2 2 0 012.800 0L20 10.500V19a2 2 0 01-2 2h-3v-4.500a3 3 0 00-6 0V21H6a2 2 0 01-2-2z', find: 'M11 18a7 7 0 100-14 7 7 0 000 14zM16 16l5 5',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c1-6 15-6 16 0', on: 'M4 9v6h4l5 4V5L8 9zM16 9c1.5 1.5 1.5 4.500 0 6M18.500 6.500c3 3 3 8 0 11',
  off: 'M4 9v6h4l5 4V5L8 9zM17 9l5 6M22 9l-5 6',
};
const icon = (name, size = 24, w = 1.8) => {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  for (const [k, v] of Object.entries({ viewBox: '0 0 24 24', width: size, height: size, fill: 'none', stroke: 'currentColor', 'stroke-width': name === 'dots' ? 3 : w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' })) s.setAttribute(k, v);
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  let d = P[name];
  if (d[0] === '#') { d = d.slice(1); s.setAttribute('fill', 'currentColor'); s.setAttribute('fill-rule', 'evenodd'); s.setAttribute('stroke', 'none'); }
  p.setAttribute('d', d); s.append(p);
  return s;
};
const btn = (label, ic, fn, size) => el('button', { type: 'button', 'aria-label': label, title: label, onclick: fn }, icon(ic, size));

let S = { rev: 0, items: [], trash: [], profile: {} }, tab = 'all', busy = false, soundOn = false, uploads = [];
const url = (m, f) => Store.url(m.id, f);
const pic = m => url(m, m.type === 'video' ? 'cover' : 'thumb');
const full = m => url(m, m.type === 'video' ? 'cover' : 'photo');
const isReel = i => i.media.length === 1 && i.media[0].type === 'video';
const ready = i => i.media.every(m => m.status === 'ready');
const itemById = id => S.items.find(i => i.id === id);

let toastT;
function toast(t) { const n = $('#toast'); n.textContent = t; n.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => n.classList.remove('on'), 4000); }

async function api(path, body) {
  return path === 'state' ? Store.state() : Store.actions[path](body);
}
async function act(path, body) {
  try { S = await api(path, body); render(); return true; } catch (e) { toast(e.message); return false; }
}
async function changed() { S = await api('state'); if (!busy) render(); }

// ---------- профиль ----------
function avatar(cls = '') {
  const a = S.profile.avatar;
  const n = el('div', { class: 'ava ' + cls });
  if (a) n.style.backgroundImage = `url(${Store.url(a, 'photo')})`; else n.append(icon('user', cls ? 18 : 40));
  return n;
}
function render() {
  const root = $('#profile'), top = root.scrollTop, p = S.profile;
  const bar = el('div', { class: 'bar' }, btn('Новая публикация', 'plus', () => start(), 26), el('div', { class: 't' }, p.username, icon('back', 13, 2.4)), btn('Меню', 'menu', menu, 26));
  const count = p.posts || String(S.items.length);
  const stat = (n, l) => el('div', {}, el('b', {}, n), el('span', {}, l));
  const tabs = el('div', { class: 'tabs' }, [['all', 'grid', 'Публикации'], ['reels', 'reel', 'Видео'], ['repost', 'repost', 'Репосты'], ['tag', 'tag', 'Отметки']].map(([k, ic, l]) => {
    const b = btn(l, ic, () => { tab = k; render(); }); if (tab === k) b.classList.add('on'); return b;
  }));
  root.replaceChildren(el('div', { class: 'strip' }), bar,
    el('div', { class: 'head' }, el('div', { class: 'avw' }, avatar(), p.note && el('div', { class: 'note' }, p.note), el('span', { class: 'pl' }, icon('plus', 14, 3))), el('div', {}, p.name && el('div', { class: 'n' }, p.name),
      el('div', { class: 'stats' }, stat(count, 'публикации'), stat(p.followers, 'подписчики'), stat(p.following, 'подписки')))),
    p.bio ? el('div', { class: 'bio' }, p.bio) : '', p.link ? el('div', { class: 'lnk' }, icon('link', 18, 2), p.link) : '',
    el('div', { class: 'ban' }, icon('plus', 12, 2.4), 'Добавьте баннеры'),
    el('div', { class: 'pro' }, el('div', {}, el('b', {}, 'Профессиональная панель'), el('span', {}, 'Доступны новые инструменты.')), el('i')),
    el('div', { class: 'acts' }, el('button', { type: 'button', onclick: editProfile }, 'Редактировать профиль'), el('button', { type: 'button', onclick: () => toast('Эта кнопка здесь только для вида') }, 'Поделиться профилем')),
    highlights(),
    tabs, gridView());
  root.scrollTop = top;
  $('#tabbar').lastElementChild.replaceChildren(avatar('s'));
}
function highlights() {
  const add = el('button', { type: 'button', class: 'add', onclick: () => { $('#hlfile').value = ''; $('#hlfile').click(); } }, el('i', {}, icon('plus', 26, 1.6)), el('span', {}, 'Добавить'));
  return el('div', { class: 'hl' }, add, (S.profile.highlights || []).map(h => el('button', { type: 'button', onclick: () => editHighlight(h) }, el('i', {}, el('img', { src: Store.url(h.id, 'photo'), alt: '' })), el('span', {}, h.title))));
}
function editHighlight(h) {
  const t = el('input', { value: h.title, maxLength: 60, 'aria-label': 'Название' });
  const s = sheet('Актуальное', t, el('button', { type: 'button', class: 'go', onclick: async () => { if (await act('highlight_edit', { id: h.id, title: t.value })) close(s); } }, 'Сохранить'),
    li('Убрать', async () => { if (await act('highlight_edit', { id: h.id, delete: true })) close(s); }, true));
}
function gridView() {
  const list = tab === 'all' ? S.items : tab === 'reels' ? S.items.filter(i => i.media.some(m => m.type === 'video')) : [];
  const blank = tab === 'tag' || tab === 'repost';
  if (!list.length && !(uploads.length && tab === 'all')) return el('div', { class: 'empty' }, el('b', {}, tab === 'tag' ? 'Отметок нет' : tab === 'repost' ? 'Репостов нет' : 'Пока пусто'),
    blank ? '' : 'Добавьте фото или видео, и они появятся в сетке.', blank ? '' : el('div', {}, el('button', { type: 'button', onclick: () => start() }, 'Новая публикация')));
  const g = el('div', { class: 'grid' });
  if (tab === 'all') for (const u of uploads) { u.node = el('div', { class: 'st' }, u.text); g.append(el('div', { class: 'tile' }, u.node)); }
  for (const i of list) g.append(tile(i));
  return g;
}
function tile(i) {
  const m = i.media[0], t = el('button', { type: 'button', class: 'tile', 'aria-label': i.caption.slice(0, 60) || (isReel(i) ? 'Видео' : 'Фото') });
  t.dataset.id = i.id;
  const bad = i.media.find(x => x.status === 'error');
  if (m.status === 'ready') t.append(el('img', { src: pic(m), alt: '', draggable: false }));
  if (bad) t.append(el('div', { class: 'st' }, 'Не удалось обработать'));
  else if (!ready(i)) t.append(el('div', { class: 'st' }, 'Обрабатывается…'));
  const mark = i.pinned && tab === 'all' ? 'pin' : i.media.length > 1 ? 'stackf' : m.type === 'video' ? 'reelf' : '';
  if (mark) t.append(el('span', { class: 'ic' }, icon(mark, 18)));
  if (i.views) t.append(el('span', { class: 'vw' }, icon('eye', 13, 2.6), i.views));
  t.addEventListener('click', () => {
    if (t.dragged) { t.dragged = false; return; }
    if (bad) return itemMenu(i.id);
    if (!ready(i)) return toast('Файл ещё обрабатывается');
    isReel(i) ? openReels(i.id) : openFeed(i.id);
  });
  if (tab === 'all') dragTile(t);
  return t;
}
// Перестановка: мышью сразу, пальцем после долгого нажатия
function dragSort(t, { item, scroller, horiz, done }) {
  let timer, ghost, sx, sy, ox, oy, pid, wasBusy;
  const block = e => e.preventDefault();
  const begin = () => {
    const r = t.getBoundingClientRect();
    wasBusy = busy; busy = true; ox = sx - r.left; oy = sy - r.top;
    ghost = t.cloneNode(true); ghost.classList.add('ghost'); ghost.style.cssText = `width:${r.width}px;height:${r.height}px;left:${r.left}px;top:${r.top}px`;
    document.body.append(ghost); t.classList.add('held'); t.dragged = true;
    document.addEventListener('touchmove', block, { passive: false });
    try { t.setPointerCapture(pid); } catch (e) { /* не критично */ }
  };
  const move = e => {
    if (e.pointerId !== pid) return;
    const far = Math.hypot(e.clientX - sx, e.clientY - sy);
    if (!ghost) {
      if (e.pointerType === 'mouse' && far > 7) begin();
      else { if (far > 9) end(e, true); return; }
    }
    ghost.style.left = e.clientX - ox + 'px'; ghost.style.top = e.clientY - oy + 'px';
    const over = document.elementFromPoint(e.clientX, e.clientY)?.closest(item);
    if (over && over !== t && over.parentNode === t.parentNode) {
      const all = [...t.parentNode.children];
      all.indexOf(over) > all.indexOf(t) ? over.after(t) : over.before(t);
    }
    const b = scroller().getBoundingClientRect();
    if (horiz) { if (e.clientX < b.left + 40) scroller().scrollLeft -= 10; else if (e.clientX > b.right - 40) scroller().scrollLeft += 10; }
    else if (e.clientY < b.top + 70) scroller().scrollTop -= 10; else if (e.clientY > b.bottom - 70) scroller().scrollTop += 10;
  };
  const end = (e, skip) => {
    if (e.pointerId !== pid) return;
    clearTimeout(timer); pid = undefined;
    document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', end); document.removeEventListener('pointercancel', end);
    document.removeEventListener('touchmove', block);
    if (!ghost) return;
    ghost.remove(); ghost = null; t.classList.remove('held'); busy = wasBusy;
    setTimeout(() => { t.dragged = false; }, 60);
    if (skip !== true) done(t.parentNode);
  };
  t.addEventListener('contextmenu', e => e.preventDefault());
  t.addEventListener('pointerdown', e => {
    if (e.button || pid !== undefined || e.target.closest('.x')) return;
    sx = e.clientX; sy = e.clientY; pid = e.pointerId;
    if (e.pointerType !== 'mouse') timer = setTimeout(() => { navigator.vibrate?.(15); begin(); }, 350);
    document.addEventListener('pointermove', move); document.addEventListener('pointerup', end); document.addEventListener('pointercancel', end);
  });
}
const dragTile = t => dragSort(t, { item: '.tile[data-id]', scroller: () => $('#profile'), done: p => act('order', { ids: [...p.querySelectorAll('[data-id]')].map(x => x.dataset.id) }) });

// ---------- загрузка ----------
function pick() { $('#file').value = ''; $('#file').click(); }
let composer = null;
function start(files = []) { closeAll(); tab = 'all'; openComposer(null, files); }
function addFiles(files) {
  const list = [...files].filter(f => f.size);
  if (!list.length) return;
  if (composer) return composer.add(list);
  start(list);
}
async function sendFile(f, onProgress, draft) {
  const id = await Store.upload(f, draft); onProgress(1); return id;
}
const ratioOf = (r, w, h) => r ? r.split(':')[0] / r.split(':')[1] : Math.min(1.91, Math.max(0.75, w && h ? w / h : 0.8));

// Отправка: карусель одной публикацией или каждый файл отдельно
async function publish(entries, o) {
  const files = entries.filter(e => e.f), u = { text: 'Сохраняю…' };
  if (files.length && !o.id) { uploads.unshift(u); }
  render();
  const total = files.reduce((n, e) => n + e.f.size, 0) || 1;
  let sent = 0;
  const show = t => { u.text = t; if (u.node) u.node.textContent = t; };
  for (const e of o.separate ? [...files].reverse() : files) {
    try { e.id = await sendFile(e.f, p => show(Math.round((sent + p * e.f.size) / total * 100) + '%'), !o.separate); }
    catch (x) { toast(`${e.f.name}: ${x.message}`); }
    sent += e.f.size;
  }
  uploads = uploads.filter(x => x !== u);
  const ids = entries.map(e => e.m ? e.m.id : e.id).filter(Boolean);
  if (o.separate || !ids.length) { try { S = await api('state'); } catch (x) { toast(x.message); } if (!busy) render(); return; }
  try { S = await api('compose', { id: o.id, media: ids, caption: o.caption, ratio: o.ratio }); } catch (x) { toast(x.message); }
  if (!busy) render();
}

// Экран «Новая публикация»
function openComposer(item, files = []) {
  let list = item ? item.media.map(m => ({ m })) : [], ratio = item?.ratio || '', separate = false, cur = 0, done = false;
  const stage = el('div', { class: 'stage' }), chips = el('div', { class: 'chips' }), mode = el('div', { class: 'chips' }), strip = el('div', { class: 'strip2' });
  const hint = el('div', { class: 'hint' }), gal = el('div', { class: 'gal' });
  const cap = el('textarea', { rows: 4, maxLength: 2200, value: item?.caption || '', placeholder: 'Добавьте подпись…', 'aria-label': 'Подпись' });
  const go = el('button', { type: 'button', class: 'go', onclick: () => {
    if (done || !list.length) return;
    done = true;
    const entries = list, opt = { id: item?.id, caption: cap.value || (item ? '' : list.find(e => e.cap)?.cap || ''), ratio, separate: separate && list.length > 1 };
    close(node); publish(entries, opt);
  } }, item ? 'Сохранить' : 'Поделиться');
  const cp = el('div', { class: 'cp' }, cap);
  const node = el('div', { class: 'over comp' }, el('div', { class: 'bar' }, el('button', { type: 'button', onclick: () => close(node) }, 'Отмена'), el('div', { class: 't' }, item ? 'Изменить' : 'Новая публикация'), go),
    el('div', { class: 'screen' }, stage, mode, strip, hint, chips, cp, gal));
  const isVideo = e => e.m ? e.m.type === 'video' : e.f.type.startsWith('video/') || /\.(mov|mp4|m4v|webm)$/i.test(e.f.name);
  const view = e => {
    const src = e.m ? null : (e.url ||= URL.createObjectURL(e.f));
    const fail = n => n.replaceWith(el('div', { class: 'nopic' }, e.m ? 'Обрабатывается…' : `${e.f.name}: этот браузер не показывает такой формат`));
    if (!e.m && isVideo(e)) {
      const v = el('video', { src: src + '#t=0.1', muted: true, playsInline: true, preload: 'metadata' });
      v.setAttribute('playsinline', '');
      v.addEventListener('loadedmetadata', () => { if (!e.w) { e.w = v.videoWidth; e.h = v.videoHeight; fit(); } });
      v.addEventListener('error', () => { if (v.isConnected && v.getAttribute('src')) fail(v); }); return v;
    }
    const n = el('img', { src: e.m ? full(e.m) : src, alt: '', draggable: false });
    n.addEventListener('load', () => { if (!e.w) { e.w = n.naturalWidth; e.h = n.naturalHeight; fit(); } });
    n.addEventListener('error', () => fail(n)); return n;
  };
  let frame, slides, cnt;
  const fit = () => {
    if (!frame || !list.length) return;
    const e = list[0], r = list.length === 1 && isVideo(e) ? 9 / 16 : ratioOf(ratio, e.w || e.m?.w, e.h || e.m?.h);
    frame.style.aspectRatio = r; frame.classList.toggle('wide', r > 390 / 400);
  };
  const mark = () => { if (cnt) cnt.textContent = `${cur + 1}/${list.length}`; [...strip.querySelectorAll('.th[data-n]')].forEach((t, k) => t.classList.toggle('on', k === cur)); };
  const jump = k => { cur = k; slides.scrollTo({ left: k * slides.clientWidth }); mark(); };
  const draw = () => {
    cur = Math.min(cur, Math.max(0, list.length - 1));
    const many = list.length > 1;
    gallery();
    go.disabled = !list.length;
    cp.hidden = !list.length;
    if (!list.length) {
      frame = null; [mode, strip, chips].forEach(x => x.replaceChildren()); hint.textContent = '';
      return stage.replaceChildren(el('div', { class: 'first' }, el('button', { type: 'button', onclick: pick }, 'Выбрать фото и видео'), el('span', {}, 'Отметьте сразу несколько, и получится карусель. До 20 файлов.')));
    }
    slides = el('div', { class: 'slides' }, list.map(e => el('div', { class: 'slide' }, view(e))));
    cnt = many ? el('span', { class: 'cnt' }) : null;
    frame = el('div', { class: 'frame' }, slides, cnt);
    slides.addEventListener('scroll', () => { const k = Math.round(slides.scrollLeft / (slides.clientWidth || 1)); if (k !== cur && k < list.length) { cur = k; mark(); } });
    stage.replaceChildren(frame);
    strip.replaceChildren(...list.map((e, k) => {
      const x = el('button', { type: 'button', class: 'x', 'aria-label': 'Убрать', onclick: ev => { ev.stopPropagation(); list.splice(list.indexOf(e), 1); draw(); } }, icon('close', 16, 3));
      const t = el('div', { class: 'th', role: 'button', tabIndex: 0, onclick: () => { if (!t.dragged) jump(list.indexOf(e)); } }, view(e), many ? el('b', {}, String(k + 1)) : '', x);
      t.dataset.n = k; t.entry = e;
      dragSort(t, { item: '.th[data-n]', scroller: () => strip, horiz: true, done: p => { const first = list[cur]; list = [...p.querySelectorAll('.th[data-n]')].map(n => n.entry); cur = Math.max(0, list.indexOf(first)); draw(); } });
      return t;
    }), el('button', { type: 'button', class: 'th add', 'aria-label': 'Добавить ещё', onclick: pick }, icon('plus', 24)));
    const chip = (box, opts, val, set) => box.replaceChildren(...opts.map(([v, l]) => { const b = el('button', { type: 'button', onclick: () => { set(v); draw(); } }, l); if (v === val) b.classList.add('on'); return b; }));
    if (many && !item) chip(mode, [[false, 'Карусель'], [true, 'Отдельными постами']], separate, v => { separate = v; }); else mode.replaceChildren();
    const solo = separate && many;
    if (list.length && !solo && !(list.length === 1 && isVideo(list[0]))) chip(chips, [['', 'Оригинал'], ['1:1', '1:1'], ['4:5', '4:5'], ['3:4', '3:4']], ratio, v => { ratio = v; }); else chips.replaceChildren();
    cp.hidden = !!solo;
    hint.textContent = many ? 'Чтобы поменять порядок, перетащите миниатюру (на телефоне сначала подержите).' : '';
    fit(); jump(cur);
  };
  const gallery = () => {
    const own = S.items.filter(i => i.id !== item?.id && i.media.length === 1 && ready(i));
    if (!own.length) return gal.replaceChildren();
    gal.replaceChildren(el('h4', {}, 'Уже загруженное'), el('p', {}, 'Нажимайте по порядку. Выбранное переедет из сетки в эту публикацию.'), el('div', { class: 'galg' }, own.map(i => {
      const m = i.media[0], n = list.findIndex(e => e.m?.id === m.id);
      const t = el('button', { type: 'button', 'aria-pressed': String(n >= 0), 'aria-label': n >= 0 ? `Выбрано, номер ${n + 1}` : 'Выбрать', onclick: () => {
        if (n >= 0) list.splice(n, 1);
        else {
          if (list.length >= 20) return toast('В одной публикации может быть до 20 файлов');
          list.push({ m, cap: i.caption }); cur = list.length - 1;
        }
        const sc = gal.parentNode, y = gal.getBoundingClientRect().top;
        draw();
        sc.scrollTop += gal.getBoundingClientRect().top - y;
      } }, el('img', { src: pic(m), alt: '' }), m.type === 'video' ? el('span', { class: 'ic' }, icon('reelf', 14)) : '', el('b', { class: n >= 0 ? 'on' : '' }, n >= 0 ? String(n + 1) : ''));
      return t;
    })));
  };
  const add = fs => {
    const room = 20 - list.length;
    if (fs.length > room) toast('В одной публикации может быть до 20 файлов');
    list = list.concat(fs.slice(0, Math.max(0, room)).map(f => ({ f }))); draw();
  };
  open(node, () => { composer = null; list.forEach(e => { if (e.url) URL.revokeObjectURL(e.url); }); });
  composer = { add };
  add(files);
}

// ---------- окна ----------
function open(node, onClose) {
  node.onclosefn = onClose; $('#overlays').append(node); busy = true; return node;
}
function close(node) {
  node.onclosefn?.(); node.querySelectorAll('video').forEach(stop); node.remove();
  busy = $('#overlays').childElementCount > 0; if (!busy) render();
}
function closeAll() { [...$('#overlays').children].reverse().forEach(close); }
function stop(v) { v.pause(); v.removeAttribute('src'); v.load(); }
function sheet(title, ...kids) {
  const v = el('div', { class: 'veil', role: 'dialog', 'aria-label': title });
  v.append(el('div', { class: 'sheet' }, el('h3', {}, title), ...kids));
  v.addEventListener('click', e => { if (e.target === v) close(v); });
  return open(v);
}
const li = (t, fn, red) => el('button', { type: 'button', class: 'li' + (red ? ' red' : ''), onclick: fn }, t);
addEventListener('keydown', e => { if (e.key === 'Escape') { const o = $('#overlays').lastElementChild; if (o) close(o); } });

const size = n => n >= 1e9 ? (n / 1e9).toFixed(1) + ' ГБ' : n >= 1e6 ? Math.round(n / 1e6) + ' МБ' : Math.round(n / 1e3) + ' КБ';
async function menu() {
  const used = await Store.usage();
  const s = sheet('Меню', li('Новая публикация или карусель', () => { close(s); start(); }),
    li('Редактировать профиль', () => { close(s); editProfile(); }),
    li('Сохранить копию в iCloud', () => { close(s); saveBackup(); }),
    li('Открыть копию из iCloud', () => { close(s); $('#backupfile').value = ''; $('#backupfile').click(); }),
    li(`Корзина (${S.trash.length})`, () => { close(s); trashView(); }),
    el('div', { class: 'about' }, `Занято ${size(used)}. Всё хранится только на этом устройстве. «Примерка» — личный инструмент, не связан с Instagram.`));
}
async function saveBackup() {
  const t = el('div', { class: 'about' }, 'Собираю файл…');
  const s = sheet('Копия библиотеки', t);
  try {
    const f = await Backup.make(p => { t.textContent = `Собираю файл… ${Math.round(p * 100)}%`; });
    if (!s.isConnected) return;
    const share = navigator.canShare?.({ files: [f] }), u = URL.createObjectURL(f);
    t.textContent = `${f.name}, ${size(f.size)}. ` + (share ? 'Нажмите «Поделиться», затем «Сохранить в Файлы» и выберите iCloud Drive.' : 'Сохраните файл в папку iCloud Drive.');
    const down = el('a', { class: share ? 'li' : 'go', href: u, download: f.name }, 'Скачать файл');
    t.after(share ? el('button', { type: 'button', class: 'go', onclick: async () => { try { await navigator.share({ files: [f] }); close(s); } catch (e) { if (e.name !== 'AbortError') toast('Не получилось поделиться. Попробуйте «Скачать файл»'); } } }, 'Поделиться') : '', down);
    s.onclosefn = () => setTimeout(() => URL.revokeObjectURL(u), 60000);
  } catch (e) { t.textContent = e.message; }
}
function openBackup(file) {
  const t = el('div', { class: 'about' }, `${file.name}, ${size(file.size)}`);
  const run = async replace => {
    btns.forEach(b => b.remove());
    try {
      const d = await Backup.read(file, replace, p => { t.textContent = `Проверяю файл… ${Math.round(p * 100)}%`; });
      t.textContent = 'Записываю…';
      S = await api('import', d); closeAll(); render(); toast('Копия открыта');
    } catch (e) { t.textContent = e.message || 'Не получилось открыть файл'; }
  };
  const btns = [el('button', { type: 'button', class: 'go', onclick: () => run(false) }, 'Добавить к тому, что есть'),
    li('Заменить всё', () => {
      t.textContent = 'Всё, что сейчас на этом устройстве, включая корзину, будет удалено. Отменить нельзя.';
      const yes = el('button', { type: 'button', class: 'go red', onclick: () => run(true) }, 'Да, заменить всё');
      btns[1].replaceWith(yes); btns[1] = yes;
    }, true)];
  if (!S.items.length && !S.trash.length) btns.splice(0, 2, el('button', { type: 'button', class: 'go', onclick: () => run(true) }, 'Открыть'));
  sheet('Открыть копию', t, ...btns);
}
function trashView() {
  const list = el('div', { class: 'trash' }, S.trash.map(x => el('div', {}, el('img', { src: pic(x.media[0]), alt: '' }), el('span', {}, x.media.length > 1 ? `Карусель, ${x.media.length}` : x.media[0].type === 'video' ? 'Видео' : 'Фото'),
    el('button', { type: 'button', class: 'pill', onclick: async () => { if (await act('restore', { id: x.id })) { close(s); if (S.trash.length) trashView(); } } }, 'Вернуть'))));
  const s = sheet('Корзина', S.trash.length ? list : el('div', { class: 'about' }, 'Корзина пуста'), S.trash.length && li('Очистить корзину', () => {
    const c = sheet('Удалить навсегда?', el('div', { class: 'about' }, `Публикаций: ${S.trash.length}. Вернуть их будет нельзя.`),
      el('button', { type: 'button', class: 'go red', onclick: async () => { if (await act('empty_trash')) closeAll(); } }, 'Удалить навсегда'), li('Отмена', () => close(c)));
  }, true));
}
function editProfile() {
  const p = S.profile, f = {};
  const field = (k, l, tag = 'input') => el('label', {}, l, f[k] = el(tag, { value: p[k] || '' }));
  const s = sheet('Профиль', li('Сменить фото профиля', () => { $('#avatarfile').value = ''; $('#avatarfile').click(); }),
    field('username', 'Имя пользователя'), field('name', 'Имя'), field('bio', 'О себе', 'textarea'), field('link', 'Ссылка'), field('note', 'Заметка над фото (можно пусто)'), field('posts', 'Публикации (пусто: считать самому)'),
    field('followers', 'Подписчики'), field('following', 'Подписки'),
    el('button', { type: 'button', class: 'go', onclick: async () => { if (await act('profile', Object.fromEntries(Object.entries(f).map(([k, n]) => [k, n.value])))) close(s); } }, 'Сохранить'));
}
function itemMenu(id) {
  const i = itemById(id); if (!i) return;
  const vids = i.media.filter(m => m.type === 'video' && m.status === 'ready');
  const s = sheet('Публикация', ready(i) && li(i.media.length > 1 ? 'Изменить карусель' : 'Добавить фото или формат', () => { closeAll(); openComposer(itemById(id)); }),
    li('Подпись и цифры', () => { close(s); editCaption(id); }),
    li(i.pinned ? 'Открепить' : 'Закрепить в профиле', async () => { if (await act('pin', { id })) closeAll(); }),
    vids.length === 1 && li('Выбрать обложку', () => { close(s); editCover(vids[0]); }),
    i.media.length > 1 && li('Разобрать карусель', async () => { if (await act('split', { id })) closeAll(); }),
    li('Удалить', () => { close(s); confirmDelete(id); }, true));
}
function confirmDelete(id) {
  const s = sheet('Удалить публикацию?', el('div', { class: 'about' }, 'Она переедет в корзину. Вернуть можно в меню.'),
    el('button', { type: 'button', class: 'go red', onclick: async () => { if (await act('delete', { id })) closeAll(); } }, 'Удалить'), li('Отмена', () => close(s)));
}
function editCaption(id) {
  const i = itemById(id), t = el('textarea', { value: i.caption, rows: 4, maxLength: 2200 }), f = {};
  const field = (k, l, ph = '') => el('label', {}, l, f[k] = el('input', { value: i[k] || '', maxLength: 80, placeholder: ph }));
  const s = sheet('Публикация', el('label', {}, 'Подпись', t), field('place', 'Место'), field('views', 'Просмотры на плитке', '6,817 или 12.9 тыс.'), field('likes', 'Лайки'), field('comments', 'Комментарии'),
    isReel(i) && field('reposts', 'Репосты'), isReel(i) && field('shares', 'Отправки'),
    el('button', { type: 'button', class: 'go', onclick: async () => { if (await act('update', { id, caption: t.value, ...Object.fromEntries(Object.entries(f).map(([k, n]) => [k, n.value])) })) { close(s); refreshOverlay(id); } } }, 'Сохранить'));
}
function editCover(m) {
  const v = el('video', { src: url(m, 'video'), muted: true, playsInline: true, preload: 'auto' });
  v.setAttribute('playsinline', '');
  const r = el('input', { type: 'range', min: 0, max: m.dur, step: 0.05, value: m.cover_t || 0, 'aria-label': 'Кадр обложки' });
  v.addEventListener('loadedmetadata', () => { v.currentTime = +r.value || 0.01; });
  r.addEventListener('input', () => { v.currentTime = +r.value; });
  const s = sheet('Обложка', v, r, el('button', { type: 'button', class: 'go', onclick: async e => { e.target.disabled = true; if (await act('cover', { media: m.id, t: +r.value })) closeAll(); else e.target.disabled = false; } }, 'Поставить этот кадр'));
}
let current = null;
function refreshOverlay(id) {
  if (!current) return;
  const { node, again } = current;
  close(node); if (itemById(id)) again(id);
}

// ---------- лента ----------
function setSound(v, on) { v.muted = !on; }
function tryPlay(v, wantSound, onBlocked) {
  setSound(v, wantSound);
  const p = v.play();
  if (p) p.catch(e => {
    if (e.name !== 'NotAllowedError' || v.muted) return;
    setSound(v, false); onBlocked?.(); v.play().catch(() => {});
  });
}
function mkVideo(m) {
  const v = el('video', { poster: url(m, 'cover'), loop: true, playsInline: true, preload: 'metadata' });
  v.setAttribute('playsinline', '');
  v.attach = () => { if (!v.getAttribute('src')) v.src = url(m, 'video'); };
  v.detach = () => { if (v.getAttribute('src')) stop(v); };
  return v;
}
function openFeed(id) {
  const list = S.items.filter(ready), scr = el('div', { class: 'screen' });
  const node = el('div', { class: 'over' }, el('div', { class: 'bar fb' }, btn('Назад', 'back', () => close(node)), el('div', { class: 't' }, 'Публикации', el('small', {}, S.profile.username)), el('span')), scr);
  const vids = [], syncIcons = () => vids.forEach(x => x.b.replaceChildren(icon(soundOn ? 'on' : 'off', 16)));
  const io = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) { v.attach(); tryPlay(v, soundOn, () => { soundOn = false; syncIcons(); }); } else v.pause();
  }), { root: scr, threshold: 0.6 });
  const near = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? e.target.attach() : e.target.detach()), { root: scr, rootMargin: '80% 0px' });
  const nodes = {};
  for (const i of list) {
    const m0 = i.media[0], ratio = ratioOf(i.ratio, m0.w, m0.h);
    const slides = el('div', { class: 'slides' }, i.media.map(m => {
      const s = el('div', { class: 'slide' });
      if (m.type === 'video') {
        const v = mkVideo(m), b = el('button', { type: 'button', class: 'snd', 'aria-label': 'Звук' }, icon('off', 16));
        const flip = () => { soundOn = !soundOn; vids.forEach(x => setSound(x.v, soundOn)); syncIcons(); if (v.paused) { v.attach(); tryPlay(v, soundOn); } };
        v.addEventListener('click', flip); b.addEventListener('click', flip);
        vids.push({ v, b }); near.observe(v); io.observe(v); s.append(v, b);
      } else s.append(el('img', { src: full(m), alt: '', loading: 'lazy' }));
      return s;
    }));
    const frame = el('div', { class: 'frame', style: `aspect-ratio:${ratio}` }, slides);
    let dots = '';
    if (i.media.length > 1) {
      const n = i.media.length, cnt = el('span', { class: 'cnt' }, `1/${n}`);
      dots = el('div', { class: 'dots' }, i.media.map((_, k) => el('i', { class: k ? '' : 'on' })));
      const go = d => slides.scrollBy({ left: d * slides.clientWidth, behavior: 'smooth' });
      const l = btn('Предыдущий', 'back', () => go(-1), 16), r = btn('Следующий', 'back', () => go(1), 16);
      l.className = 'arr l'; r.className = 'arr r'; l.hidden = true;
      slides.addEventListener('scroll', () => {
        const k = Math.round(slides.scrollLeft / slides.clientWidth);
        cnt.textContent = `${k + 1}/${n}`; [...dots.children].forEach((d, x) => { d.className = x === k ? 'on' : ''; }); l.hidden = k === 0; r.hidden = k === n - 1;
      });
      frame.append(cnt, l, r);
    }
    const long = i.caption.length > 125 || i.caption.split('\n').length > 2;
    const cap = el('div', { class: 'cap' }, el('b', {}, S.profile.username + ' '), long ? i.caption.split('\n').slice(0, 2).join('\n').slice(0, 125) + '… ' : i.caption);
    if (long) cap.append(el('button', { type: 'button', class: 'more', onclick: () => cap.replaceChildren(el('b', {}, S.profile.username + ' '), i.caption) }, 'ещё'));
    nodes[i.id] = el('article', { class: 'post' }, el('div', { class: 'ph' }, avatar('s'), el('div', {}, el('b', {}, S.profile.username), i.place ? el('small', {}, i.place) : ''), btn('Действия', 'dots', () => itemMenu(i.id))), frame, dots,
      el('div', { class: 'row' }, el('span', {}, icon('heart', 25), i.likes || ''), el('span', {}, icon('chat', 25), i.comments || ''), icon('send', 25), el('span', { class: 'sp' }), icon('save', 25)), i.caption ? cap : '',
      el('time', {}, new Date(i.created * 1000).toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' })));
    scr.append(nodes[i.id]);
  }
  open(node, () => { io.disconnect(); near.disconnect(); if (current?.node === node) current = null; });
  current = { node, again: openFeed };
  const t = nodes[id]; if (t) scr.scrollTop = t.offsetTop - scr.offsetTop;
}

// ---------- видео на весь экран ----------
function openReels(id) {
  const list = S.items.filter(i => isReel(i) && ready(i)), scr = el('div', { class: 'screen reels' });
  const node = el('div', { class: 'over', style: 'background:#000' }, el('div', { class: 'rtop' }, btn('Назад', 'back', () => close(node)), icon('cam', 28)), scr, el('div', { class: 'rbot', 'aria-hidden': 'true' }, el('div', {}, 'Добавьте комментарий...')));
  const map = {};
  let active = null, sound = true;
  const start = r => {
    if (active === r) return;
    if (active) { active.v.pause(); active.need.hidden = true; }
    active = r;
    const all = [...scr.children], at = all.indexOf(r);
    all.forEach((x, k) => Math.abs(k - at) <= 1 ? x.v.attach() : x.v.detach());
    r.v.currentTime = 0;
    tryPlay(r.v, sound, () => { r.need.hidden = false; });
  };
  for (const i of list) {
    const m = i.media[0], v = mkVideo(m), bar = el('i'), flash = el('div', { class: 'flash' });
    const need = el('button', { type: 'button', class: 'need', hidden: true, onclick: () => { sound = true; setSound(v, true); need.hidden = true; v.play().catch(() => {}); } }, 'Включить звук');
    v.addEventListener('timeupdate', () => { bar.style.width = (v.currentTime / (v.duration || 1) * 100) + '%'; });
    v.addEventListener('click', () => {
      sound = v.muted; setSound(v, sound); need.hidden = true; if (v.paused) v.play().catch(() => {});
      flash.replaceChildren(icon(sound ? 'on' : 'off', 34)); flash.classList.add('on'); setTimeout(() => flash.classList.remove('on'), 600);
      if (sound && m.audio === false) toast('В этом видео нет звука');
    });
    const c = el('div', { class: 'c', onclick: () => c.classList.toggle('open') }, i.caption);
    const r = el('section', { class: 'reel' + (m.w / m.h < 0.65 ? ' tall' : '') }, v, el('div', { class: 'shade' }),
      el('div', { class: 'info' }, el('div', { class: 'u' }, avatar('s'), S.profile.username), i.caption ? c : ''),
      el('div', { class: 'rail' }, el('div', {}, icon('heart', 28), i.likes || ''), el('div', {}, icon('chat', 28), i.comments || ''), el('div', {}, icon('repost', 28), i.reposts || ''), el('div', {}, icon('send', 28), i.shares || ''), btn('Действия', 'dots', () => itemMenu(i.id), 24), el('div', { class: 'snip ava' })),
      flash, need, el('div', { class: 'prog' }, bar));
    if (S.profile.avatar) r.querySelector('.snip').style.backgroundImage = `url(${Store.url(S.profile.avatar, 'photo')})`;
    Object.assign(r, { v, need }); map[i.id] = r; scr.append(r);
  }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) start(e.target); }), { root: scr, threshold: 0.6 });
  open(node, () => { io.disconnect(); if (current?.node === node) current = null; });
  current = { node, again: openReels };
  if (map[id]) { scr.scrollTop = map[id].offsetTop - scr.offsetTop; start(map[id]); }
  Object.values(map).forEach(r => io.observe(r));
}

// ---------- запуск ----------
['home', 'reel', 'send', 'find', 'user'].forEach(n => $('#tabbar').append(el('span', {}, icon(n, 28))));
$('#hlfile').addEventListener('change', async e => {
  const f = e.target.files[0]; if (!f) return;
  if (await act('highlight', { file: f, title: 'Новое' })) editHighlight(S.profile.highlights.at(-1));
});
$('#backupfile').addEventListener('change', e => { if (e.target.files[0]) openBackup(e.target.files[0]); });
const clock = () => { $('#status b').textContent = new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }); };
clock(); setInterval(clock, 10000);
P.sig = '#M2 15h3v5H2zM7.500 12h3v8h-3zM13 8h3v12h-3zM18.500 4h3v16h-3z'; P.bat = 'M4 7h14a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V9a2 2 0 012-2zM22.500 11v2M5 10v4M8 10v4M11 10v4';
P.wifi = 'M2 9c6-5 14-5 20 0M5.500 13c4-3.500 9-3.500 13 0M9 16.500c2-1.500 4-1.500 6 0M12 20h.01';
$('#status span').append(icon('sig', 18), icon('wifi', 19, 2.4), icon('bat', 25));
$('#drop').addEventListener('click', pick);
$('#file').addEventListener('change', e => addFiles(e.target.files));
$('#avatarfile').addEventListener('change', async e => {
  const f = e.target.files[0]; if (!f) return;
  if (await act('avatar', { file: f })) toast('Фото профиля обновлено');
});
let depth = 0;
const hasFiles = e => [...(e.dataTransfer?.types || [])].includes('Files');
addEventListener('dragenter', e => { if (hasFiles(e)) { depth++; document.body.classList.add('dragging'); } });
addEventListener('dragleave', e => { if (hasFiles(e) && --depth <= 0) { depth = 0; document.body.classList.remove('dragging'); } });
addEventListener('dragover', e => { if (hasFiles(e)) e.preventDefault(); });
addEventListener('drop', e => { if (!hasFiles(e)) return; e.preventDefault(); depth = 0; document.body.classList.remove('dragging'); addFiles(e.dataTransfer.files); });
// После долгой паузы браузер может забыть ссылки на файлы, поэтому читаем их заново
let hiddenAt = 0;
document.addEventListener('visibilitychange', async () => {
  if (document.hidden) { hiddenAt = Date.now(); return; }
  if (hiddenAt && Date.now() - hiddenAt > 600000 && !busy) { await Store.reload(); changed(); }
});
async function worker() {
  if (!('serviceWorker' in navigator)) return;
  const r = await navigator.serviceWorker.register('sw.js');
  const offer = w => {
    if (!w || !navigator.serviceWorker.controller || $('#update')) return;
    $('#phone').append(el('button', { type: 'button', id: 'update', onclick: () => { w.postMessage('update'); } }, 'Есть обновление. Нажмите, чтобы применить'));
  };
  if (r.waiting) offer(r.waiting);
  r.addEventListener('updatefound', () => { const w = r.installing; w.addEventListener('statechange', () => { if (w.state === 'installed') offer(w); }); });
  const had = !!navigator.serviceWorker.controller; let once = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (had && !once) { once = true; location.reload(); } });
}
(async () => {
  if (window.top !== window.self) return;
  try { await Store.init(changed); S = await api('state'); } catch (e) {
    $('#profile').replaceChildren(el('div', { class: 'empty' }, el('b', {}, 'Не удалось открыть хранилище'), 'Закройте частный режим браузера и откройте страницу снова.')); return;
  }
  render(); worker().catch(() => {});
})();
