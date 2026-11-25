'use strict';
/* Хранилище на устройстве: IndexedDB вместо сервера. Наружу ничего не отправляется. */
const Store = (() => {
  const DB = 'primerka-v1', FIELDS = ['views', 'likes', 'comments', 'reposts', 'shares', 'place'];
  const PROFILE = { username: 'my_profile', name: '', bio: '', posts: '', followers: '0', following: '0', avatar: '', highlights: [], link: '', note: '' };
  const blobs = new Map(), urls = new Map();
  const fail = t => { throw new Error(t); };
  const newId = () => [...crypto.getRandomValues(new Uint8Array(8))].map(b => b.toString(16).padStart(2, '0')).join('');
  const now = () => Math.floor(Date.now() / 1000);
  const channel = 'BroadcastChannel' in window ? new BroadcastChannel(DB) : null;
  let db;

  const req = r => new Promise((ok, no) => { r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); });
  function openDb() {
    return new Promise((ok, no) => {
      const r = indexedDB.open(DB, 1);
      r.onupgradeneeded = () => { r.result.createObjectStore('kv'); r.result.createObjectStore('files'); };
      r.onsuccess = () => { r.result.onversionchange = () => r.result.close(); ok(r.result); };
      r.onerror = () => no(r.error);
    });
  }
  const human = e => e?.name === 'QuotaExceededError' ? new Error('На устройстве не хватает места для этого файла') : e;
  const normal = s => ({ rev: 1, items: [], drafts: [], trash: [], ...s, profile: { ...PROFILE, highlights: [], ...s?.profile } });

  // Чтение и запись состояния в одной транзакции, чтобы две вкладки не затёрли друг друга
  function mutate(fn) {
    return new Promise((ok, no) => {
      const tx = db.transaction(['kv', 'files'], 'readwrite'), kv = tx.objectStore('kv'), files = tx.objectStore('files');
      const put = [], del = [];
      let state, err;
      const r = kv.get('state');
      r.onsuccess = () => {
        try {
          state = normal(r.result);
          fn(state, { put: (k, b) => { put.push([k, b]); files.put(b, k); }, del: k => { del.push(k); files.delete(k); } });
          state.items = state.items.filter(i => i.media.length);
          state.items.sort((a, b) => !!b.pinned - !!a.pinned);
          state.rev++;
          kv.put(state, 'state');
        } catch (e) { err = e; tx.abort(); }
      };
      tx.oncomplete = () => {
        del.forEach(drop); put.forEach(([k, b]) => { drop(k); blobs.set(k, b); });
        channel?.postMessage('changed'); ok(state);
      };
      tx.onabort = () => no(human(err || tx.error || new Error('Не удалось сохранить')));
    });
  }
  const drop = k => { if (urls.has(k)) URL.revokeObjectURL(urls.get(k)); urls.delete(k); blobs.delete(k); };
  const state = async () => normal(await req(db.transaction('kv').objectStore('kv').get('state')));
  async function loadBlobs() {
    const st = db.transaction('files').objectStore('files');
    const [keys, vals] = await Promise.all([req(st.getAllKeys()), req(st.getAll())]);
    [...urls.values()].forEach(u => URL.revokeObjectURL(u)); urls.clear(); blobs.clear();
    keys.forEach((k, i) => blobs.set(k, vals[i]));
  }
  function url(id, name) {
    const k = id + '/' + name;
    if (!urls.has(k) && blobs.has(k)) urls.set(k, URL.createObjectURL(blobs.get(k)));
    return urls.get(k) || '';
  }

  // ---------- обработка файлов ----------
  const wait = (n, ev, ms) => new Promise((ok, no) => {
    const t = setTimeout(() => done(new Error('Файл не открылся вовремя')), ms);
    const done = e => { clearTimeout(t); n.removeEventListener(ev, good); n.removeEventListener('error', bad); e ? no(e) : ok(); };
    const good = () => done(), bad = () => done(new Error('Этот браузер не открывает такой файл. На Mac попробуйте Safari'));
    n.addEventListener(ev, good); n.addEventListener('error', bad);
  });
  function shrink(src, w, h, limit, q) {
    const k = Math.min(1, limit / Math.max(w, h)), c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w * k)); c.height = Math.max(1, Math.round(h * k));
    let x; try { x = c.getContext('2d', { colorSpace: 'display-p3' }); } catch (e) { x = c.getContext('2d'); }
    x.imageSmoothingQuality = 'high'; x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height);
    x.drawImage(src, 0, 0, c.width, c.height);
    return new Promise((ok, no) => c.toBlob(b => { const r = { blob: b, w: c.width, h: c.height }; c.width = c.height = 0; b ? ok(r) : no(new Error('Не удалось обработать фото')); }, 'image/jpeg', q));
  }
  async function photo(file, limit = 2160) {
    const u = URL.createObjectURL(file), n = new Image();
    try {
      const p = wait(n, 'load', 30000); n.src = u; await p;
      if (!n.naturalWidth) fail('Не удалось прочитать изображение');
      const full = await shrink(n, n.naturalWidth, n.naturalHeight, limit, 0.9);
      const thumb = await shrink(n, n.naturalWidth, n.naturalHeight, 1200, 0.85);
      return { full, thumb };
    } finally { n.removeAttribute('src'); URL.revokeObjectURL(u); }
  }
  async function frame(blob, t, probe) {
    const u = URL.createObjectURL(blob), v = document.createElement('video');
    v.muted = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.preload = 'auto';
    v.style.cssText = 'position:fixed;left:0;top:0;width:2px;height:2px;opacity:.01;pointer-events:none;z-index:-1';
    document.body.append(v);
    try {
      let p = wait(v, 'loadedmetadata', 30000); v.src = u; v.load(); await p;
      if (!v.videoWidth) fail('В файле нет видео');
      const dur = Number.isFinite(v.duration) ? v.duration : 0;
      // iPhone отдаёт кадр только после короткого запуска
      try { await Promise.race([v.play(), new Promise(r => setTimeout(r, 1500))]); } catch (e) { /* не критично */ }
      v.pause();
      const at = Math.min(Math.max(0.01, t), Math.max(0.01, dur - 0.1));
      if (Math.abs(v.currentTime - at) > 0.005) { p = wait(v, 'seeked', 15000); v.currentTime = at; await p; }
      if (v.readyState < 2) await wait(v, 'loadeddata', 15000);
      await new Promise(r => v.requestVideoFrameCallback ? (v.requestVideoFrameCallback(r), setTimeout(r, 250)) : setTimeout(r, 150));
      const c = await shrink(v, v.videoWidth, v.videoHeight, 1920, 0.88);
      const audio = v.audioTracks ? v.audioTracks.length > 0 : undefined;
      return { cover: c.blob, w: v.videoWidth, h: v.videoHeight, dur: Math.round(dur * 1000) / 1000, audio };
    } finally { v.pause(); v.removeAttribute('src'); v.load(); v.remove(); URL.revokeObjectURL(u); }
  }
  async function sniff(f) {
    const h = new Uint8Array(await f.slice(0, 16).arrayBuffer()), s = String.fromCharCode(...h);
    if (h[0] === 0xff && h[1] === 0xd8 || s.startsWith('\x89PNG') || s.startsWith('RIFF') && s.slice(8, 12) === 'WEBP') return 'photo';
    if (s.slice(4, 8) === 'ftyp') return /^(hei|hev|mif|msf|avi)/.test(s.slice(8, 12)) ? 'photo' : 'video';
    if (['moov', 'mdat', 'wide', 'free', 'skip'].includes(s.slice(4, 8)) || h[0] === 0x1a && h[1] === 0x45) return 'video';
    return fail('Этот тип файла не поддерживается');
  }
  async function room(n) {
    const e = await navigator.storage?.estimate?.().catch(() => null);
    if (e?.quota && e.quota - e.usage < n * 1.1) fail('На устройстве не хватает места для этого файла');
  }
  async function upload(file, draft) {
    const type = await sniff(file), id = newId(), m = { id, type, name: String(file.name || '').slice(0, 200), status: 'ready', v: 1, at: now() };
    const parts = [];
    if (type === 'photo') {
      const p = await photo(file);
      Object.assign(m, { w: p.full.w, h: p.full.h });
      parts.push(['photo', p.full.blob], ['thumb', p.thumb.blob]);
    } else {
      await room(file.size);
      const mime = /^video\/[\w.+-]+$/.test(file.type) ? file.type : 'video/mp4', blob = new Blob([file], { type: mime });
      const f = await frame(blob, 0, true);
      Object.assign(m, { w: f.w, h: f.h, dur: f.dur, mime, cover_t: 0 }); if (f.audio !== undefined) m.audio = f.audio;
      parts.push(['video', blob], ['cover', f.cover]);
    }
    await mutate((s, f) => {
      parts.forEach(([n, b]) => f.put(`${id}/${n}`, b));
      if (draft) s.drafts.push(m); else s.items.unshift({ id: newId(), media: [m], caption: '', created: now() });
    });
    return id;
  }
  const single = async file => { if (await sniff(file) !== 'photo') fail('Здесь нужно фото'); return (await photo(file, 800)).full.blob; };
  const names = m => m.type === 'video' ? ['video', 'cover'] : ['photo', 'thumb'];
  const erase = (f, media) => media.forEach(m => names(m).forEach(n => f.del(`${m.id}/${n}`)));
  const bin = (s, media, item) => { if (media.length) s.trash.unshift({ id: newId(), media, caption: item.caption || '', created: item.created, deleted: now() }); };
  const need = (s, id) => s.items.find(i => i.id === id) || fail('Публикация не найдена');
  const str = (v, n) => String(v ?? '').slice(0, n);

  const actions = {
    update: d => mutate(s => { const i = need(s, d.id); if ('caption' in d) i.caption = str(d.caption, 2200); FIELDS.forEach(k => { if (k in d) i[k] = str(d[k], 80); }); }),
    order: d => mutate(s => { const pos = new Map(d.ids.map((x, n) => [x, n])); s.items.sort((a, b) => (pos.get(a.id) ?? -1) - (pos.get(b.id) ?? -1)); }),
    pin: d => mutate(s => { const i = need(s, d.id); if (!i.pinned && s.items.filter(x => x.pinned).length >= 3) fail('Закрепить можно не больше трёх публикаций'); i.pinned = !i.pinned; }),
    delete: d => mutate(s => { const i = need(s, d.id); s.items.splice(s.items.indexOf(i), 1); bin(s, i.media, i); }),
    split: d => mutate(s => { const i = need(s, d.id), n = s.items.indexOf(i); s.items.splice(n, 1, ...i.media.map((m, k) => ({ id: newId(), media: [m], created: i.created, caption: k ? '' : i.caption }))); }),
    profile: d => mutate(s => { ['username', 'name', 'bio', 'posts', 'followers', 'following', 'link', 'note'].forEach(k => { if (k in d) s.profile[k] = str(d[k], 300); }); }),
    compose: d => mutate(s => {
      const ids = d.media;
      if (!ids.length || ids.length > 20 || new Set(ids).size !== ids.length) fail('В публикации должно быть от 1 до 20 файлов');
      let item = d.id ? need(s, d.id) : null;
      const old = item ? item.media : [], pool = new Map([...old, ...s.drafts, ...s.items.filter(i => i !== item).flatMap(i => i.media)].map(m => [m.id, m]));
      if (ids.some(x => !pool.has(x))) fail('Файл не найден, попробуйте добавить его ещё раз');
      if (!item) { item = { id: newId(), created: now() }; s.items.unshift(item); }
      item.media = ids.map(x => pool.get(x)); item.caption = str(d.caption, 2200); item.ratio = ['1:1', '4:5', '3:4'].includes(d.ratio) ? d.ratio : '';
      s.items.forEach(i => { if (i !== item) i.media = i.media.filter(m => !ids.includes(m.id)); });
      s.drafts = s.drafts.filter(m => !ids.includes(m.id));
      old.filter(m => !ids.includes(m.id)).forEach(m => bin(s, [m], { created: item.created }));
    }),
    cover: async d => {
      const s = await state(), m = s.items.flatMap(i => i.media).find(x => x.id === d.media && x.type === 'video') || fail('Видео не найдено');
      const f = await frame(blobs.get(m.id + '/video'), d.t);
      return mutate((st, fs) => { const x = st.items.flatMap(i => i.media).find(y => y.id === m.id) || fail('Видео не найдено'); x.cover_t = d.t; x.v++; fs.put(m.id + '/cover', f.cover); });
    },
    avatar: async d => { const b = await single(d.file), id = newId(); return mutate((s, f) => { if (s.profile.avatar) f.del(s.profile.avatar + '/photo'); s.profile.avatar = id; f.put(id + '/photo', b); }); },
    highlight: async d => { const b = await single(d.file), id = newId(); return mutate((s, f) => { s.profile.highlights.push({ id, title: str(d.title, 60) }); f.put(id + '/photo', b); }); },
    highlight_edit: d => mutate((s, f) => {
      const hs = s.profile.highlights, h = hs.find(x => x.id === d.id) || fail('Не найдено');
      if (d.delete) { hs.splice(hs.indexOf(h), 1); f.del(h.id + '/photo'); } else h.title = str(d.title, 60);
    }),
    restore: d => mutate(s => { const t = s.trash.find(x => x.id === d.id) || fail('Не найдено'); s.trash.splice(s.trash.indexOf(t), 1); delete t.deleted; s.items.unshift(t); }),
    empty_trash: () => mutate((s, f) => { s.trash.forEach(t => erase(f, t.media)); s.trash = []; }),
    // список {key, blob}: запись копии одной транзакцией
    import: d => mutate((s, f) => {
      if (d.replace) { [...blobs.keys()].forEach(k => f.del(k)); Object.assign(s, normal(d.state), { rev: s.rev, drafts: [] }); }
      else { s.items.unshift(...d.state.items.map(i => ({ ...i, pinned: false }))); s.trash.push(...d.state.trash); }
      d.files.forEach(x => f.put(x.key, x.blob));
    }),
  };

  async function init(onChange) {
    db = await openDb();
    await loadBlobs();
    const s = await state(), old = s.drafts.filter(m => now() - (m.at || 0) > 3600);
    if (old.length) await mutate((st, f) => { const ids = old.map(m => m.id); erase(f, st.drafts.filter(m => ids.includes(m.id))); st.drafts = st.drafts.filter(m => !ids.includes(m.id)); });
    if (channel) channel.onmessage = async () => { await loadBlobs(); onChange(); };
    navigator.storage?.persist?.().catch(() => {});
  }
  const usage = async () => [...blobs.values()].reduce((n, b) => n + b.size, 0);
  return { init, state, url, upload, actions, usage, reload: loadBlobs, blob: k => blobs.get(k), keys: () => [...blobs.keys()], newId, names, FIELDS, normal };
})();
