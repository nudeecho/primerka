'use strict';
/* Копия библиотеки одним zip-файлом (без сжатия) и её проверка при открытии. */
const Backup = (() => {
  const T = new Uint32Array(256).map((_, n) => { for (let k = 0; k < 8; k++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1; return n; });
  async function crc(blob, tick) {
    let c = 0xffffffff;
    const step = 4 << 20;
    for (let o = 0; o < blob.size; o += step) {
      const a = new Uint8Array(await blob.slice(o, o + step).arrayBuffer());
      for (let i = 0; i < a.length; i++) c = T[(c ^ a[i]) & 255] ^ (c >>> 8);
      tick?.(a.length);
    }
    return (c ^ 0xffffffff) >>> 0;
  }
  const head = (n, f) => { const b = new DataView(new ArrayBuffer(n)); f(b); return b.buffer; };
  async function make(onProgress) {
    const s = await Store.state();
    const keep = { format: 'primerka', version: 1, state: { items: s.items, trash: s.trash, profile: s.profile } };
    const want = [];
    [...s.items, ...s.trash].forEach(i => i.media.forEach(m => Store.names(m).forEach(n => want.push(`${m.id}/${n}`))));
    if (s.profile.avatar) want.push(s.profile.avatar + '/photo');
    s.profile.highlights.forEach(h => want.push(h.id + '/photo'));
    const list = [['state.json', new Blob([JSON.stringify(keep)])], ...want.filter(k => Store.blob(k)).map(k => ['media/' + k, Store.blob(k)])];
    const total = list.reduce((n, x) => n + x[1].size, 0);
    if (total > 3.5e9) throw new Error('Копия больше 3,5 ГБ. Удалите часть видео и очистите корзину');
    const parts = [], dir = [];
    let off = 0, done = 0, dsize = 0;
    for (const [name, blob] of list) {
      const nm = new TextEncoder().encode(name), sum = await crc(blob, n => { done += n; onProgress?.(done / total); });
      const common = (b, o) => { b.setUint16(o, 20, true); b.setUint16(o + 2, 0x800, true); b.setUint32(o + 6, 0x21 << 16, true); b.setUint32(o + 10, sum, true); b.setUint32(o + 14, blob.size, true); b.setUint32(o + 18, blob.size, true); b.setUint16(o + 22, nm.length, true); };
      parts.push(head(30, b => { b.setUint32(0, 0x04034b50, true); common(b, 4); }), nm, blob);
      dir.push(head(46, b => { b.setUint32(0, 0x02014b50, true); b.setUint16(4, 20, true); common(b, 6); b.setUint32(42, off, true); }), nm);
      off += 30 + nm.length + blob.size; dsize += 46 + nm.length;
    }
    const end = head(22, b => { b.setUint32(0, 0x06054b50, true); b.setUint16(8, list.length, true); b.setUint16(10, list.length, true); b.setUint32(12, dsize, true); b.setUint32(16, off, true); });
    const d = new Date(), p = n => String(n).padStart(2, '0');
    return new File([...parts, ...dir, end], `primerka-${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}.zip`, { type: 'application/zip' });
  }

  const bad = () => { throw new Error('Файл повреждён или это не копия «Примерки»'); };
  const view = async (f, a, b) => new DataView(await f.slice(a, b).arrayBuffer());
  async function entries(file) {
    const n = Math.min(file.size, 65557), v = await view(file, file.size - n, file.size);
    let e = n - 22; while (e >= 0 && v.getUint32(e, true) !== 0x06054b50) e--;
    if (e < 0) bad();
    const count = v.getUint16(e + 10, true), dsize = v.getUint32(e + 12, true), doff = v.getUint32(e + 16, true);
    if (doff + dsize > file.size || dsize > 64e6) bad();
    const d = await view(file, doff, doff + dsize), out = new Map();
    let o = 0;
    for (let i = 0; i < count; i++) {
      if (o + 46 > dsize || d.getUint32(o, true) !== 0x02014b50 || d.getUint16(o + 10, true) !== 0) bad();
      const sum = d.getUint32(o + 16, true), size = d.getUint32(o + 24, true), nl = d.getUint16(o + 28, true), xl = d.getUint16(o + 30, true), cl = d.getUint16(o + 32, true), at = d.getUint32(o + 42, true);
      if (o + 46 + nl > dsize) bad();
      const name = new TextDecoder().decode(new Uint8Array(d.buffer, o + 46, nl));
      if (at + 30 > doff) bad();
      const l = await view(file, at, at + 30);
      if (l.getUint32(0, true) !== 0x04034b50) bad();
      const s = at + 30 + l.getUint16(26, true) + l.getUint16(28, true);
      if (s + size > doff || out.has(name)) bad();
      out.set(name, { blob: file.slice(s, s + size), sum, size });
      o += 46 + nl + xl + cl;
    }
    return out;
  }
  const ID = /^[0-9a-f]{16}$/, str = (v, n) => typeof v === 'string' ? v.slice(0, n) : '', num = v => Number.isFinite(v) && v >= 0 ? v : 0;
  // Открытие: всё проверяется до записи, чужие поля отбрасываются
  async function read(file, replace, onProgress) {
    const z = await entries(file), sj = z.get('state.json');
    if (!sj || sj.size > 20e6) bad();
    let raw; try { raw = JSON.parse(await sj.blob.text()); } catch (e) { bad(); }
    if (raw?.format !== 'primerka' || raw.version !== 1 || !raw.state) bad();
    const files = [], used = new Set(), total = [...z.values()].reduce((n, x) => n + x.size, 0);
    let done = 0;
    const take = async (oldId, name, newId, type) => {
      const x = z.get(`media/${oldId}/${name}`); if (!x) bad();
      if (await crc(x.blob, n => { done += n; onProgress?.(done / total); }) !== x.sum) bad();
      files.push({ key: `${newId}/${name}`, blob: new Blob([x.blob], { type }) });
    };
    if (await crc(sj.blob) !== sj.sum) bad();
    const media = async m => {
      if (!m || !ID.test(m.id) || used.has(m.id) || !['photo', 'video'].includes(m.type)) bad();
      used.add(m.id);
      const id = replace ? m.id : Store.newId(), o = { id, type: m.type, name: str(m.name, 200), status: 'ready', v: 1, w: num(m.w) || 1, h: num(m.h) || 1 };
      if (m.type === 'video') {
        o.mime = /^video\/[\w.+-]+$/.test(m.mime) ? m.mime : 'video/mp4'; o.dur = num(m.dur); o.cover_t = num(m.cover_t); if (typeof m.audio === 'boolean') o.audio = m.audio;
        await take(m.id, 'video', id, o.mime); await take(m.id, 'cover', id, 'image/jpeg');
      } else { await take(m.id, 'photo', id, 'image/jpeg'); await take(m.id, 'thumb', id, 'image/jpeg'); }
      return o;
    };
    const item = async i => {
      if (!i || !Array.isArray(i.media) || !i.media.length || i.media.length > 20) bad();
      const o = { id: Store.newId(), media: [], caption: str(i.caption, 2200), created: num(i.created), ratio: ['1:1', '4:5', '3:4'].includes(i.ratio) ? i.ratio : '', pinned: i.pinned === true };
      if (i.deleted) o.deleted = num(i.deleted);
      Store.FIELDS.forEach(k => { if (i[k]) o[k] = str(i[k], 80); });
      for (const m of i.media) o.media.push(await media(m));
      return o;
    };
    const s = raw.state, out = { items: [], trash: [], profile: {} };
    if (!Array.isArray(s.items) || !Array.isArray(s.trash || [])) bad();
    for (const i of s.items) out.items.push(await item(i));
    for (const i of s.trash || []) out.trash.push(await item(i));
    if (replace) {
      const p = s.profile || {};
      ['username', 'name', 'bio', 'posts', 'followers', 'following', 'link', 'note'].forEach(k => { if (k in p) out.profile[k] = str(p[k], 300); });
      out.profile.avatar = ''; out.profile.highlights = [];
      if (p.avatar) { if (!ID.test(p.avatar) || used.has(p.avatar)) bad(); used.add(p.avatar); out.profile.avatar = p.avatar; await take(p.avatar, 'photo', p.avatar, 'image/jpeg'); }
      for (const h of Array.isArray(p.highlights) ? p.highlights : []) { if (!ID.test(h?.id) || used.has(h.id)) bad(); used.add(h.id); out.profile.highlights.push({ id: h.id, title: str(h.title, 60) }); await take(h.id, 'photo', h.id, 'image/jpeg'); }
    }
    let pins = 0; out.items.forEach(i => { if (i.pinned && ++pins > 3) i.pinned = false; });
    return { state: out, files, replace };
  }
  return { make, read };
})();
