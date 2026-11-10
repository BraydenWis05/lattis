"use client";

/**
 * Draws a Figma frame from its layers (src/figma/screens.json), one to one:
 * auto layout becomes flexbox with the same gaps, padding and alignment; fills, strokes,
 * corner radii, shadows and text styles are copied as they are. Prototype links become
 * real taps: navigate, back and after-delay, the same as in Figma's prototype.
 */
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { asset } from "@/lib/asset";
import styles from "./render.module.css";

export type Paint = {
  t: string;
  o: number;
  c?: number[];
  st?: [number, number[]][];
  hp?: [number, number][];
  h?: string;
  sm?: string;
  tf?: number[][];
  sf?: number;
};
export type Seg = { a: number; b: number; ff: string; fw: number; it: number; sz: number; lh: number | "normal"; ls: number; f: Paint[] };
export type Reaction = { tr?: string; to?: number; ty?: string; nav?: string; d?: string };
export type FNode = {
  t: string;
  n: string;
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  abs?: 1;
  sh?: "FIXED" | "HUG" | "FILL";
  sv?: "FIXED" | "HUG" | "FILL";
  sgrow?: 1;
  sstretch?: 1;
  cn?: [string, string];
  op?: number;
  f?: Paint[];
  s?: Paint[];
  sw?: number;
  sa?: string;
  fx?: { t: string; c: number[] | null; x: number; y: number; r: number; s: number }[];
  r?: number | number[];
  clip?: 1;
  lm?: "H" | "V";
  gap?: number;
  p?: number[];
  pa?: string;
  ca?: string;
  wrap?: 1;
  rx?: Reaction[];
  ch?: string;
  ta?: string;
  tav?: string;
  ar?: string;
  seg?: Seg[];
  svg?: string;
  fixed?: number;
  ov?: string;
  k?: FNode[];
};

export type Assets = { images: Record<string, string>; svgs: Record<string, string> };
type Ctx = {
  assets: Assets;
  hrefFor: (id: string) => string | null;
  go: (href: string) => void;
  back: () => void;
};

const css = (c: number[] | null | undefined, extra = 1) =>
  c ? `rgba(${Math.round(c[0] * 255)}, ${Math.round(c[1] * 255)}, ${Math.round(c[2] * 255)}, ${+(c[3] * extra).toFixed(3)})` : "transparent";

const FONT: Record<string, string> = {
  "Roboto Flex": '"Roboto Flex Variable", "Roboto Flex", system-ui, sans-serif',
  Roboto: '"Roboto", system-ui, sans-serif',
  "Roboto Mono": '"Roboto Mono", ui-monospace, monospace',
};
const fontStack = (ff: string) => FONT[ff] || `"${ff}", "Roboto", system-ui, sans-serif`;

/** Figma gradient handles -> CSS linear-gradient angle and stops. */
function gradient(p: Paint, w: number, h: number) {
  const stops = (p.st || []).map(([pos, c]) => `${css(c, p.o)} ${+(pos * 100).toFixed(2)}%`).join(", ");
  if (p.t === "GRADIENT_RADIAL") return `radial-gradient(closest-side, ${stops})`;
  const [a, b] = p.hp && p.hp.length >= 2 ? p.hp : [[0.5, 0], [0.5, 1]];
  const dx = (b[0] - a[0]) * w;
  const dy = (b[1] - a[1]) * h;
  const angle = (Math.atan2(dx, -dy) * 180) / Math.PI;
  // CSS gradient line length for this angle, so stop positions land where Figma puts them
  const rad = (angle * Math.PI) / 180;
  const cssLen = Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad));
  const figLen = Math.hypot(dx, dy) || 1;
  // Start point of the Figma line projected onto the CSS line
  const cx = w / 2;
  const cy = h / 2;
  const ux = Math.sin(rad);
  const uy = -Math.cos(rad);
  const startOffset = (a[0] * w - cx) * ux + (a[1] * h - cy) * uy + cssLen / 2;
  const mapped = (p.st || [])
    .map(([pos, c]) => `${css(c, p.o)} ${+(((startOffset + pos * figLen) / cssLen) * 100).toFixed(2)}%`)
    .join(", ");
  return `linear-gradient(${+angle.toFixed(2)}deg, ${mapped})`;
}

function backgrounds(fills: Paint[] | undefined, n: FNode, assets: Assets) {
  if (!fills || !fills.length) return {};
  const layers: string[] = [];
  const sizes: string[] = [];
  const positions: string[] = [];
  const repeats: string[] = [];
  // Figma lists fills bottom to top; CSS lists backgrounds top to bottom.
  for (const p of [...fills].reverse()) {
    if (p.t === "SOLID") {
      const c = css(p.c, p.o);
      layers.push(`linear-gradient(${c}, ${c})`);
      sizes.push("auto");
      positions.push("0 0");
      repeats.push("no-repeat");
    } else if (p.t.startsWith("GRADIENT")) {
      layers.push(gradient(p, n.w, n.h));
      sizes.push("auto");
      positions.push("0 0");
      repeats.push("no-repeat");
    } else if (p.t === "IMAGE") {
      const src = p.h && assets.images[p.h];
      if (!src) {
        layers.push("linear-gradient(#5e6a48, #5e6a48)"); // photo not synced yet
        sizes.push("auto");
        positions.push("0 0");
        repeats.push("no-repeat");
        continue;
      }
      layers.push(`url("${asset(src)}")`);
      if (p.sm === "FIT") {
        sizes.push("contain");
        positions.push("center");
        repeats.push("no-repeat");
      } else if (p.sm === "TILE") {
        sizes.push(`${(p.sf || 1) * 100}%`);
        positions.push("0 0");
        repeats.push("repeat");
      } else if (p.sm === "CROP" && p.tf) {
        const [[a, , tx], [, d, ty]] = p.tf;
        sizes.push(`${+((1 / a) * 100).toFixed(3)}% ${+((1 / d) * 100).toFixed(3)}%`);
        positions.push(`${+((-tx / a) * n.w).toFixed(2)}px ${+((-ty / d) * n.h).toFixed(2)}px`);
        repeats.push("no-repeat");
      } else {
        sizes.push("cover");
        positions.push("center");
        repeats.push("no-repeat");
      }
    }
  }
  return {
    backgroundImage: layers.join(", "),
    backgroundSize: sizes.join(", "),
    backgroundPosition: positions.join(", "),
    backgroundRepeat: repeats.join(", "),
  } as CSSProperties;
}

function shadows(n: FNode) {
  const list: string[] = [];
  const filters: string[] = [];
  let backdrop: string | undefined;
  const stroke = n.s?.find((p) => p.t === "SOLID");
  if (stroke && n.sw) {
    const c = css(stroke.c, stroke.o);
    if (n.sa === "OUTSIDE") list.push(`0 0 0 ${n.sw}px ${c}`);
    else if (n.sa === "CENTER") list.push(`0 0 0 ${n.sw / 2}px ${c}`, `inset 0 0 0 ${n.sw / 2}px ${c}`);
    else list.push(`inset 0 0 0 ${n.sw}px ${c}`);
  }
  for (const e of n.fx || []) {
    if (e.t === "DROP_SHADOW") list.push(`${e.x}px ${e.y}px ${e.r}px ${e.s}px ${css(e.c)}`);
    else if (e.t === "INNER_SHADOW") list.push(`inset ${e.x}px ${e.y}px ${e.r}px ${e.s}px ${css(e.c)}`);
    else if (e.t === "LAYER_BLUR") filters.push(`blur(${e.r / 2}px)`);
    else if (e.t === "BACKGROUND_BLUR") backdrop = `blur(${e.r / 2}px)`;
    // iOS Liquid Glass from the Apple kit: closest CSS is a frosted backdrop
    else if (e.t === "GLASS" && !backdrop) backdrop = "blur(14px) saturate(1.6)";
  }
  const s: CSSProperties = {};
  if (list.length) s.boxShadow = list.join(", ");
  if (filters.length) s.filter = filters.join(" ");
  if (backdrop) {
    s.backdropFilter = backdrop;
    (s as Record<string, string>).WebkitBackdropFilter = backdrop;
  }
  return s;
}

const JUSTIFY: Record<string, string> = { MIN: "flex-start", CENTER: "center", MAX: "flex-end", SPACE_BETWEEN: "space-between" };
const ALIGN: Record<string, string> = { MIN: "flex-start", CENTER: "center", MAX: "flex-end", BASELINE: "baseline" };

type Parent = { lm?: "H" | "V"; w: number; h: number; gap: number; first: boolean };

/** Where and how big a node is, inside its parent. */
function placement(n: FNode, parent: Parent | null): CSSProperties {
  const s: CSSProperties = {};
  if (!parent) return s;
  const inFlow = parent.lm && !n.abs;
  if (inFlow) {
    const horizontal = parent.lm === "H";
    const sizing = (axis: "h" | "v") => {
      const v = axis === "h" ? n.sh : n.sv;
      if (v) return v;
      if (axis === (horizontal ? "h" : "v") && n.sgrow) return "FILL";
      if (axis !== (horizontal ? "h" : "v") && n.sstretch) return "FILL";
      return "FIXED";
    };
    const primary = sizing(horizontal ? "h" : "v");
    const counter = sizing(horizontal ? "v" : "h");
    const pSize = horizontal ? n.w : n.h;
    const cSize = horizontal ? n.h : n.w;
    const pProp = horizontal ? "width" : "height";
    const cProp = horizontal ? "height" : "width";
    if (primary === "FILL") {
      s.flex = "1 1 0";
      s[horizontal ? "minWidth" : "minHeight"] = 0;
    } else {
      s.flexShrink = 0;
      if (primary === "FIXED") s[pProp] = pSize;
    }
    if (counter === "FILL") s.alignSelf = "stretch";
    else if (counter === "FIXED") s[cProp] = cSize;
    if (parent.gap < 0 && !parent.first) s[horizontal ? "marginLeft" : "marginTop"] = parent.gap;
    return s;
  }
  // Absolutely placed: follow the Figma constraints
  s.position = "absolute";
  const [ch, cv] = n.cn || ["MIN", "MIN"];
  const axis = (con: string, pos: number, size: number, pSize: number, start: "left" | "top", end: "right" | "bottom", dim: "width" | "height") => {
    if (con === "MAX") {
      s[end] = +(pSize - pos - size).toFixed(2);
      s[dim] = size;
    } else if (con === "STRETCH") {
      s[start] = pos;
      s[end] = +(pSize - pos - size).toFixed(2);
    } else if (con === "CENTER") {
      s[start] = `calc(50% + ${+(pos + size / 2 - pSize / 2).toFixed(2)}px - ${size / 2}px)`;
      s[dim] = size;
    } else if (con === "SCALE") {
      s[start] = `${+((pos / pSize) * 100).toFixed(3)}%`;
      s[dim] = `${+((size / pSize) * 100).toFixed(3)}%`;
    } else {
      s[start] = pos;
      s[dim] = size;
    }
  };
  axis(ch, n.x, n.w, parent.w, "left", "right", "width");
  axis(cv, n.y, n.h, parent.h, "top", "bottom", "height");
  // Text that hugs its content keeps its natural width
  if (n.t === "TEXT" && n.ar === "WIDTH_AND_HEIGHT") {
    delete s.width;
    if (ch !== "MAX") delete s.right;
  }
  if (n.t === "TEXT" && (n.ar === "WIDTH_AND_HEIGHT" || n.ar === "HEIGHT")) delete s.height;
  return s;
}

function boxStyle(n: FNode, assets: Assets): CSSProperties {
  const s: CSSProperties = { ...backgrounds(n.f, n, assets), ...shadows(n) };
  if (n.r !== undefined) s.borderRadius = Array.isArray(n.r) ? n.r.map((v) => `${v}px`).join(" ") : n.r;
  if (n.clip) s.overflow = "hidden";
  if (n.op !== undefined) s.opacity = n.op;
  if (n.lm) {
    s.display = "flex";
    s.flexDirection = n.lm === "H" ? "row" : "column";
    if (n.gap && n.gap > 0 && n.pa !== "SPACE_BETWEEN") s.gap = n.gap;
    if (n.p) s.padding = n.p.map((v) => `${v}px`).join(" ");
    s.justifyContent = JUSTIFY[n.pa || "MIN"];
    s.alignItems = ALIGN[n.ca || "MIN"];
    if (n.wrap) s.flexWrap = "wrap";
  }
  return s;
}

function Icon({ name, size, color }: { name: string; size: number; color: string }) {
  return (
    <span
      aria-hidden
      className={styles.sym}
      style={{ width: size, height: size, color, ["--icon" as string]: `url("${asset(`/icons/${name}.svg`)}")` }}
    />
  );
}

function Text({ n }: { n: FNode }) {
  const chars = n.ch || "";
  const segs = n.seg || [];
  const first = segs[0];
  const allIcon = segs.length > 0 && segs.every((s) => /Material Symbols/.test(s.ff));
  const s: CSSProperties = {
    whiteSpace: n.ar === "WIDTH_AND_HEIGHT" ? "pre" : "pre-wrap",
    overflowWrap: "break-word",
    textAlign: n.ta === "RIGHT" ? "right" : n.ta === "CENTER" ? "center" : n.ta === "JUSTIFIED" ? "justify" : "left",
  };
  if (first) {
    s.fontFamily = fontStack(first.ff);
    s.fontWeight = first.fw;
    s.fontSize = first.sz;
    s.lineHeight = first.lh === "normal" ? "normal" : `${first.lh}px`;
  }
  if (n.ar === "NONE" && n.tav && n.tav !== "TOP") {
    s.display = "flex";
    s.flexDirection = "column";
    s.justifyContent = n.tav === "CENTER" ? "center" : "flex-end";
  }
  if (allIcon && first) {
    const solid = first.f.find((p) => p.t === "SOLID");
    return (
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%" }}>
        <Icon name={chars.trim()} size={first.sz} color={css(solid?.c, solid?.o)} />
      </span>
    );
  }
  const inner: ReactNode[] = segs.map((g, i) => {
    const solid = g.f.find((p) => p.t === "SOLID");
    const piece = chars.slice(g.a, g.b);
    if (/Material Symbols/.test(g.ff))
      return <Icon key={i} name={piece.trim()} size={g.sz} color={css(solid?.c, solid?.o)} />;
    return (
      <span
        key={i}
        style={{
          fontFamily: fontStack(g.ff),
          fontWeight: g.fw,
          fontStyle: g.it ? "italic" : undefined,
          fontSize: g.sz,
          lineHeight: g.lh === "normal" ? "normal" : `${g.lh}px`,
          letterSpacing: g.ls || undefined,
          color: css(solid?.c, solid?.o),
        }}
      >
        {piece.replace(/\u2028/g, "\n")}
      </span>
    );
  });
  return <span style={{ ...s, display: s.display || "block" }}>{inner}</span>;
}

function useTap(n: FNode, ctx: Ctx) {
  const tap = n.rx?.find((r) => (r.tr === "ON_CLICK" || r.tr === "ON_TAP") && (r.d || r.ty === "BACK" || r.nav === "BACK"));
  const pressable = n.rx?.some((r) => r.tr === "ON_PRESS");
  if (!tap) return { pressable, onClick: undefined, href: null as string | null };
  if (tap.ty === "BACK" || tap.nav === "BACK") return { pressable: true, onClick: () => ctx.back(), href: null };
  const href = tap.d ? ctx.hrefFor(tap.d) : null;
  if (!href) return { pressable, onClick: undefined, href: null };
  return { pressable: true, onClick: () => ctx.go(href), href };
}

export function Node({ n, parent, ctx }: { n: FNode; parent: Parent | null; ctx: Ctx }) {
  // Vector art is drawn by its own SVG, so it gets no background of its own
  const style: CSSProperties = n.svg
    ? { ...placement(n, parent), ...(n.op !== undefined ? { opacity: n.op } : {}) }
    : { ...placement(n, parent), ...boxStyle(n, ctx.assets) };
  if (style.position !== "absolute") style.position = "relative";
  const { onClick, pressable } = useTap(n, ctx);
  const cls = [styles.node, onClick ? styles.tap : "", pressable ? styles.press : ""].join(" ");
  const title = onClick ? n.n : undefined;

  if (n.t === "TEXT") {
    return (
      <div className={cls} style={style} data-figma={n.id} onClick={onClick} role={onClick ? "button" : undefined} aria-label={title}>
        <Text n={n} />
      </div>
    );
  }
  if (n.svg) {
    const src = ctx.assets.svgs[n.svg];
    return (
      <div className={cls} style={style} data-figma={n.id} onClick={onClick} role={onClick ? "button" : undefined} aria-label={title}>
        {src && <img src={asset(src)} alt="" width={n.w} height={n.h} style={{ display: "block", width: n.w, height: n.h }} />}
      </div>
    );
  }
  const kids = n.k || [];
  const me: Parent = { lm: n.lm, w: n.w, h: n.h, gap: n.gap || 0, first: true };
  let flowIndex = 0;
  return (
    <div className={cls} style={style} data-figma={n.id} onClick={onClick} role={onClick ? "button" : undefined} aria-label={title}>
      {kids.map((c) => {
        const inFlow = n.lm && !c.abs;
        const p = { ...me, first: inFlow ? flowIndex++ === 0 : true };
        return <Node key={c.id} n={c} parent={p} ctx={ctx} />;
      })}
    </div>
  );
}

/**
 * A whole screen. The frame fills the phone; its scrolling content scrolls, and its fixed
 * layers (nav, mic, status bar) stay put, like Figma's "fixed" layers.
 */
export function Screen({
  tree,
  assets,
  hrefFor,
  width,
  height,
}: {
  tree: FNode;
  assets: Assets;
  hrefFor: (id: string) => string | null;
  width: number;
  height: number;
}) {
  const router = useRouter();
  const ctx: Ctx = {
    assets,
    hrefFor,
    go: (href) => router.push(href),
    back: () => (window.history.length > 1 ? router.back() : router.push("/phone")),
  };
  const scrollRef = useRef<HTMLDivElement>(null);

  // After-delay links on the frame itself (for example "Saved" moving on by itself)
  useEffect(() => {
    const timed = tree.rx?.find((r) => r.tr === "AFTER_TIMEOUT" && r.d);
    if (!timed?.d) return;
    const href = hrefFor(timed.d);
    if (!href) return;
    const t = setTimeout(() => router.push(href), (timed.to || 0.8) * 1000);
    return () => clearTimeout(t);
  }, [tree, hrefFor, router]);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [tree.id]);

  const kids = tree.k || [];
  const fixedCount = tree.fixed || 0;
  // Figma's fixed layers are the top-most ones: the last children in the list
  const scrolling = kids.slice(0, kids.length - fixedCount);
  const fixed = kids.slice(kids.length - fixedCount);
  // Positions are measured in the Figma frame; constraints (left, right, bottom) carry them
  // onto the phone, the same way Figma does when a frame is resized.
  const frame: Parent = { lm: tree.lm, w: tree.w, h: tree.h, gap: tree.gap || 0, first: true };
  const fixedParent: Parent = { w: tree.w, h: tree.h, gap: 0, first: true };
  const base = boxStyle({ ...tree, w: width, h: height, r: undefined, clip: undefined }, assets);
  let flowIndex = 0;

  return (
    <div className={styles.screen} style={{ width, height, ...backgrounds(tree.f, { ...tree, w: width, h: height }, assets) }}>
      <div ref={scrollRef} className={styles.scroll}>
        <div
          className={styles.node}
          style={{ ...base, position: "relative", width, minHeight: height, backgroundImage: undefined }}
          data-figma={tree.id}
        >
          {scrolling.map((c) => {
            const inFlow = tree.lm && !c.abs;
            const p = { ...frame, first: inFlow ? flowIndex++ === 0 : true };
            // Layers pinned to the bottom of a frame that scrolls stay pinned to the phone's bottom
            return <Node key={c.id} n={c} parent={p} ctx={ctx} />;
          })}
        </div>
      </div>
      {fixed.map((c) => (
        <Node key={c.id} n={{ ...c, abs: 1 }} parent={fixedParent} ctx={ctx} />
      ))}
    </div>
  );
}
