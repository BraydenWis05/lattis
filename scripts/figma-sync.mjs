#!/usr/bin/env node
/**
 * Pulls the phone screens straight from the Figma file, so the site matches Figma exactly.
 *
 * - Starts from the tab pages and follows every prototype link (click, back, after delay).
 * - Saves each frame's layers (auto layout, spacing, fills, text styles, links) to
 *   src/figma/screens.json, in the compact format src/figma/Render.tsx draws.
 * - Downloads the photos and icon/vector art the frames use into public/figma/.
 *
 * Needs FIGMA_TOKEN (a read-only personal access token). In GitHub this is the repo secret
 * FIGMA_TOKEN. Run locally with: FIGMA_TOKEN=... node scripts/figma-sync.mjs
 */
import { mkdir, writeFile, copyFile, access } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const FILE_KEY = "3o12PsA7e3ORLlmHzaYjNm";
// Where the prototype starts: the Final App Flow page. The night in calving season, from the
// 1:45 AM lock screen, and the four tab pages. Every prototype link from these is followed.
const START = [
  "649:136", "638:18", "638:109", "638:150", "638:242", "649:226", "638:349",
  "659:144", "659:215", "659:286", "659:357",
];
// Frames that sit loose on a page (not in a section) are grouped by these names instead
const GROUP = (name, page) =>
  page === "Final App Flow" ? (/^Tab /.test(name) ? "Tab pages" : "A night in calving season") : page;
const MAX_SCREENS = 150;

const token = process.env.FIGMA_TOKEN;
if (!token) {
  console.log("figma-sync: no FIGMA_TOKEN, keeping the screens already in src/figma.");
  process.exit(0);
}

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const out = (...p) => path.join(root, ...p);

async function api(p) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await fetch(`https://api.figma.com${p}`, { headers: { "X-Figma-Token": token } });
    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)));
      continue;
    }
    if (!res.ok) throw new Error(`Figma API ${res.status} on ${p}: ${await res.text()}`);
    return res.json();
  }
  throw new Error(`Figma API kept rate limiting ${p}`);
}

async function download(url, file) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download ${res.status}: ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(file, buf);
  return { buf, type: res.headers.get("content-type") || "" };
}

// ---------- Convert Figma REST nodes to the compact format ----------

const WEIGHT = { 100: 100, 200: 200, 300: 300, 400: 400, 500: 500, 600: 600, 700: 700, 800: 800, 900: 900 };
const CON_H = { LEFT: "MIN", RIGHT: "MAX", CENTER: "CENTER", LEFT_RIGHT: "STRETCH", SCALE: "SCALE" };
const CON_V = { TOP: "MIN", BOTTOM: "MAX", CENTER: "CENTER", TOP_BOTTOM: "STRETCH", SCALE: "SCALE" };
const r4 = (v) => Math.round(v * 10000) / 10000;
const r1 = (v) => Math.round(v * 10) / 10;
const rgba = (c, a = 1) => (c ? [r4(c.r), r4(c.g), r4(c.b), r4((c.a ?? 1) * a)] : null);

const images = new Set(); // image refs used
const svgNodes = new Map(); // node id -> true (exported as SVG)
const iconNames = new Set(); // Material Symbols ligatures used in text

function paint(p) {
  if (p.visible === false) return null;
  const o = { t: p.type, o: p.opacity ?? 1 };
  if (p.type === "SOLID") o.c = rgba(p.color);
  else if (p.type.startsWith("GRADIENT")) {
    o.st = p.gradientStops.map((s) => [r4(s.position), rgba(s.color)]);
    o.hp = (p.gradientHandlePositions || []).map((h) => [r4(h.x), r4(h.y)]);
  } else if (p.type === "IMAGE") {
    o.h = p.imageRef;
    o.sm = p.scaleMode === "STRETCH" ? "CROP" : p.scaleMode;
    if (p.imageTransform) o.tf = p.imageTransform.map((row) => row.map(r4));
    if (p.scalingFactor) o.sf = p.scalingFactor;
    if (p.imageRef) images.add(p.imageRef);
  } else return null;
  return o;
}

const isIcon = (n) =>
  ["VECTOR", "BOOLEAN_OPERATION", "STAR", "LINE", "POLYGON", "ELLIPSE_ICON"].includes(n.type) ||
  (["INSTANCE", "FRAME", "COMPONENT", "GROUP"].includes(n.type) && /^(Icon|Logo)/.test(n.name || "")) ||
  (n.type === "GROUP" && (n.children || []).every((c) => ["VECTOR", "BOOLEAN_OPERATION"].includes(c.type)));

function textSegments(n) {
  const base = n.style || {};
  const chars = n.characters || "";
  const overrides = n.characterStyleOverrides || [];
  const table = n.styleOverrideTable || {};
  const segs = [];
  const styleAt = (i) => {
    const id = overrides[i] || 0;
    const s = id ? { ...base, ...table[id] } : base;
    const fills = (id && table[id] && table[id].fills) || n.fills || [];
    return { s, fills, id };
  };
  let start = 0;
  for (let i = 1; i <= chars.length; i++) {
    if (i === chars.length || (overrides[i] || 0) !== (overrides[start] || 0)) {
      const { s, fills } = styleAt(start);
      const sz = s.fontSize;
      let lh = "normal";
      if (s.lineHeightUnit === "PIXELS" || (s.lineHeightPx && s.lineHeightUnit !== "INTRINSIC_%")) lh = r1(s.lineHeightPx);
      const ff = s.fontFamily || "Roboto";
      if (/Material Symbols/.test(ff)) iconNames.add(chars.slice(start, i).trim());
      segs.push({
        a: start,
        b: i,
        ff,
        fw: WEIGHT[s.fontWeight] || 400,
        it: s.italic ? 1 : 0,
        sz,
        lh,
        ls: s.letterSpacing ? r1(s.letterSpacing) : 0,
        f: fills.map(paint).filter(Boolean),
      });
      start = i;
    }
  }
  return segs;
}

function convert(n, parentBox) {
  if (n.visible === false) return null;
  const box = n.absoluteBoundingBox || { x: 0, y: 0, width: 0, height: 0 };
  const o = {
    t: n.type,
    n: n.name,
    id: n.id,
    x: r1(parentBox ? box.x - parentBox.x : 0),
    y: r1(parentBox ? box.y - parentBox.y : 0),
    w: r1(box.width),
    h: r1(box.height),
  };
  if (n.layoutPositioning === "ABSOLUTE") o.abs = 1;
  if (n.layoutSizingHorizontal) o.sh = n.layoutSizingHorizontal;
  if (n.layoutSizingVertical) o.sv = n.layoutSizingVertical;
  if (!o.sh && n.layoutGrow === 1) o.sgrow = 1;
  if (!o.sh && n.layoutAlign === "STRETCH") o.sstretch = 1;
  if (n.constraints) o.cn = [CON_H[n.constraints.horizontal] || "MIN", CON_V[n.constraints.vertical] || "MIN"];
  if (n.opacity !== undefined && n.opacity < 1) o.op = r4(n.opacity);
  if (n.fills && n.type !== "TEXT") {
    const f = n.fills.map(paint).filter(Boolean);
    if (f.length) o.f = f;
  }
  if (n.strokes && n.strokes.length) {
    const s = n.strokes.map(paint).filter(Boolean);
    if (s.length) {
      o.s = s;
      o.sw = n.strokeWeight ?? 1;
      o.sa = n.strokeAlign || "INSIDE";
    }
  }
  if (n.effects && n.effects.length) {
    const e = n.effects
      .filter((e) => e.visible !== false)
      .map((e) => ({ t: e.type, c: e.color ? rgba(e.color) : null, x: e.offset?.x || 0, y: e.offset?.y || 0, r: e.radius || 0, s: e.spread || 0 }));
    if (e.length) o.fx = e;
  }
  if (n.rectangleCornerRadii) o.r = n.rectangleCornerRadii;
  else if (n.cornerRadius) o.r = n.cornerRadius;
  if (n.clipsContent) o.clip = 1;
  if (n.layoutMode && n.layoutMode !== "NONE") {
    o.lm = n.layoutMode[0];
    o.gap = n.itemSpacing || 0;
    o.p = [n.paddingTop || 0, n.paddingRight || 0, n.paddingBottom || 0, n.paddingLeft || 0];
    o.pa = n.primaryAxisAlignItems || "MIN";
    o.ca = n.counterAxisAlignItems || "MIN";
    if (n.layoutWrap === "WRAP") o.wrap = 1;
  }
  const rx = [];
  for (const it of n.interactions || []) {
    for (const a of it.actions || []) {
      if (!a) continue;
      rx.push({ tr: it.trigger?.type, to: it.trigger?.timeout, ty: a.type, nav: a.navigation, d: a.destinationId });
    }
  }
  if (!rx.length && n.transitionNodeID) rx.push({ tr: "ON_CLICK", ty: "NODE", nav: "NAVIGATE", d: n.transitionNodeID });
  if (rx.length) o.rx = rx;

  if (n.type === "TEXT") {
    o.ch = n.characters;
    o.ta = n.style?.textAlignHorizontal || "LEFT";
    o.tav = n.style?.textAlignVertical || "TOP";
    o.ar = n.style?.textAutoResize || "NONE";
    o.seg = textSegments(n);
    return o;
  }
  if (isIcon(n)) {
    o.svg = n.id;
    svgNodes.set(n.id, true);
    return o;
  }
  if (n.numberOfFixedChildren) o.fixed = n.numberOfFixedChildren;
  if (n.overflowDirection && n.overflowDirection !== "NONE") o.ov = n.overflowDirection;
  if (n.children) o.k = n.children.map((c) => convert(c, box)).filter(Boolean);
  return o;
}

// ---------- Walk the prototype ----------

function collectLinks(n, set) {
  for (const it of n.interactions || []) for (const a of it.actions || []) if (a?.destinationId) set.add(a.destinationId);
  if (n.transitionNodeID) set.add(n.transitionNodeID);
  for (const c of n.children || []) collectLinks(c, set);
}

const slugify = (s) =>
  s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "screen";

const screens = {};
const sectionOf = {};
let queue = [...START];
const seen = new Set();

// Section names, so the screen list can be grouped
const top = await api(`/v1/files/${FILE_KEY}?depth=2`);
const sectionChildren = {};
for (const pg of top.document.children)
  for (const s of pg.children || []) {
    if (s.type === "SECTION") sectionOf[s.id] = s.name;
    else if (s.type === "FRAME") sectionChildren[s.id] = GROUP(s.name, pg.name);
  }
{
  const ids = Object.keys(sectionOf);
  for (let i = 0; i < ids.length; i += 20) {
    const res = await api(`/v1/files/${FILE_KEY}/nodes?ids=${ids.slice(i, i + 20).join(",")}&depth=1`);
    for (const [id, v] of Object.entries(res.nodes)) for (const c of v?.document?.children || []) sectionChildren[c.id] = sectionOf[id];
  }
}

while (queue.length && Object.keys(screens).length < MAX_SCREENS) {
  const batch = [...new Set(queue.filter((id) => !seen.has(id)))].slice(0, 12);
  queue = queue.filter((id) => !batch.includes(id));
  if (!batch.length) break;
  batch.forEach((id) => seen.add(id));
  const res = await api(`/v1/files/${FILE_KEY}/nodes?ids=${batch.join(",")}`);
  for (const [id, v] of Object.entries(res.nodes)) {
    const doc = v?.document;
    if (!doc || doc.type !== "FRAME") continue; // component variants (pressed states) are handled in CSS
    const links = new Set();
    collectLinks(doc, links);
    for (const d of links) if (!seen.has(d)) queue.push(d);
    screens[id] = { name: doc.name, section: sectionChildren[id] || "", tree: convert(doc, null) };
    console.log(`  ${doc.name}`);
  }
}

// Unique slugs
const used = new Set();
for (const s of Object.values(screens)) {
  let slug = slugify(s.name);
  while (used.has(slug)) slug += "-2";
  used.add(slug);
  s.slug = slug;
}

// ---------- Assets ----------

await mkdir(out("public/figma/img"), { recursive: true });
await mkdir(out("public/figma/svg"), { recursive: true });
await mkdir(out("public/icons"), { recursive: true });
await mkdir(out("src/figma"), { recursive: true });

const imageFiles = {};
if (images.size) {
  const fills = await api(`/v1/files/${FILE_KEY}/images`);
  for (const ref of images) {
    const url = fills.meta?.images?.[ref];
    if (!url) continue;
    const tmp = out("public/figma/img", ref);
    const { type } = await download(url, tmp);
    const ext = type.includes("png") ? "png" : type.includes("gif") ? "gif" : type.includes("webp") ? "webp" : "jpg";
    await copyFile(tmp, `${tmp}.${ext}`);
    imageFiles[ref] = `/figma/img/${ref}.${ext}`;
  }
}

const svgFiles = {};
const svgIds = [...svgNodes.keys()];
for (let i = 0; i < svgIds.length; i += 80) {
  const ids = svgIds.slice(i, i + 80);
  const res = await api(`/v1/images/${FILE_KEY}?ids=${encodeURIComponent(ids.join(","))}&format=svg&svg_include_id=false&svg_simplify_stroke=true`);
  await Promise.all(
    ids.map(async (id) => {
      const url = res.images?.[id];
      if (!url) return;
      const r = await fetch(url);
      if (!r.ok) return;
      const text = await r.text();
      const hash = createHash("sha1").update(text).digest("hex").slice(0, 12);
      await writeFile(out("public/figma/svg", `${hash}.svg`), text);
      svgFiles[id] = `/figma/svg/${hash}.svg`;
    }),
  );
}

// Material Symbols used as text in Figma -> SVG files
for (const name of iconNames) {
  if (!name) continue;
  for (const style of ["rounded", "outlined"]) {
    const src = out("node_modules/@material-symbols/svg-400", style, `${name}.svg`);
    try {
      await access(src);
      await copyFile(src, out("public/icons", `${name}.svg`));
      break;
    } catch {}
  }
}

await writeFile(
  out("src/figma/screens.json"),
  JSON.stringify({ synced: new Date().toISOString(), start: START, screens, images: imageFiles, svgs: svgFiles }),
);
console.log(`figma-sync: ${Object.keys(screens).length} screens, ${Object.keys(imageFiles).length} photos, ${Object.keys(svgFiles).length} vector images.`);
