"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { asset } from "@/lib/asset";
import { Scene, type SceneKind } from "./Scene";
import { href, type Slug } from "./routes";
import s from "./app.module.css";

const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(" ");

/* ---------- Icons ---------- */

/** Material Symbols (rounded) from public/icons, tinted with currentColor. */
export function MIcon({ name, size = 18 }: { name: string; size?: number }) {
  const url = `url(${asset(`/icons/${name}.svg`)})`;
  return (
    <span
      aria-hidden
      style={{
        display: "inline-block",
        width: size,
        height: size,
        flexShrink: 0,
        backgroundColor: "currentColor",
        WebkitMask: `${url} center / contain no-repeat`,
        mask: `${url} center / contain no-repeat`,
      }}
    />
  );
}

/** Nav icons from Figma (Icon / Nav / *): 24px outline, 2px rounded stroke. */
function NavIcon({ tab }: { tab: Tab }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      {tab === "Today" && <path {...p} d="M4 10.5 12 4l8 6.5V20h-5v-5.5H9V20H4z" />}
      {tab === "Herd" && (
        <g {...p}>
          <path d="M7 8.5c-2 0-3.5-1-4-3 1.8-.4 3.3 0 4.3 1.3M17 8.5c2 0 3.5-1 4-3-1.8-.4-3.3 0-4.3 1.3" />
          <path d="M7.3 7h9.4c.6 0 1 .5 1 1v5.5a5.7 5.7 0 0 1-11.4 0V8c0-.5.4-1 1-1z" />
          <path d="M9.5 15.5h5" />
          <circle cx="9.6" cy="11" r=".4" fill="currentColor" />
          <circle cx="14.4" cy="11" r=".4" fill="currentColor" />
        </g>
      )}
      {tab === "Vet" && (
        <g {...p}>
          <path d="M6 3.5v4.5a4 4 0 0 0 8 0V3.5" />
          <path d="M10 12v2.5a4.5 4.5 0 0 0 9 0V13" />
          <circle cx="19" cy="11" r="2" />
        </g>
      )}
      {tab === "Map" && (
        <g {...p}>
          <path d="M9 5 4 7v13l5-2 6 2 5-2V5l-5 2z" />
          <path d="M9 5v13M15 7v13" />
        </g>
      )}
    </svg>
  );
}

/* ---------- Frame pieces ---------- */

export function Screen({ children, nav, actions, dark }: { children: ReactNode; nav?: Tab; actions?: ReactNode; dark?: boolean }) {
  return (
    <div className={s.screen}>
      <div className={s.scroll}>
        <div className={cx(s.content, actions ? s.contentActions : undefined)}>{children}</div>
      </div>
      {nav && <Nav active={nav} />}
      {actions && <div className={s.actions}>{actions}</div>}
      <div className={cx(s.home, dark && s.homeLight)} />
    </div>
  );
}

export function StatusBar({ time, light }: { time: string; light?: boolean }) {
  return (
    <div className={cx(s.status, light ? s.statusLight : s.statusDark)}>
      <span className={s.statusTime}>{time}</span>
      <span className={s.statusLevels}>
        <svg width="19" height="14" viewBox="0 0 19 14" aria-hidden>
          <path fill="currentColor" d="M9.5 2.5c2.9 0 5.5 1.1 7.5 3l1.5-1.6A12.8 12.8 0 0 0 9.5.3C6 .3 2.9 1.7.5 3.9L2 5.5a10.6 10.6 0 0 1 7.5-3zm0 4.3c1.7 0 3.3.6 4.5 1.7l1.5-1.6a8.6 8.6 0 0 0-12 0L5 8.5a6.4 6.4 0 0 1 4.5-1.7zm0 4.2c.6 0 1.2.2 1.6.6L9.5 13.3 7.9 11.6c.4-.4 1-.6 1.6-.6z" />
        </svg>
        <svg width="29" height="14" viewBox="0 0 29 14" aria-hidden>
          <rect x="0.5" y="0.5" width="24.5" height="13" rx="4" fill="none" stroke="currentColor" opacity="0.4" />
          <rect x="2.3" y="2.3" width="21" height="9.4" rx="2.4" fill="currentColor" />
          <path d="M26.5 4.8v4.4c.9-.3 1.5-1.2 1.5-2.2s-.6-1.9-1.5-2.2z" fill="currentColor" opacity="0.45" />
        </svg>
      </span>
    </div>
  );
}

export function Header({ date, line1, line2, tone = "calm", sub, small }: { date: string; line1: string; line2: string; tone?: "calm" | "needs"; sub?: string; small?: boolean }) {
  return (
    <header className={s.header}>
      <p className={s.date}>{date}</p>
      <h1 className={cx(s.greeting, small && s.greetingSmall)}>
        <span>{line1}</span>
        <span className={tone === "needs" ? s.needs : s.calm}>{line2}</span>
      </h1>
      {sub && <p className={s.sub}>{sub}</p>}
    </header>
  );
}

/** Tab row with counts. Tapping a tab selects it. */
export function Tabs({ tabs }: { tabs: [string, number | string][] }) {
  const [on, setOn] = useState(0);
  return (
    <div className={s.tabsWrap}>
      <div className={s.tabs} role="tablist">
        {tabs.map(([label, count], i) => (
          <button key={label} role="tab" aria-selected={i === on} className={cx(s.tab, i === on && s.tabOn)} onClick={() => setOn(i)}>
            {label}
            <span className={s.tabCount}>{count}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function Section({ children }: { children: ReactNode }) {
  return <section className={s.section}>{children}</section>;
}

export function Photo({ scene, caption, live, src }: { scene: SceneKind; caption: string; live?: boolean; src?: string }) {
  return (
    <div className={s.photo}>
      {src ? <img src={asset(src)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Scene kind={scene} />}
      <span className={s.caption}>
        {live && <span className={s.live} />}
        {caption}
      </span>
    </div>
  );
}

/** Cow id in mono, then the status word. Orange only when it needs you. */
export function Meta({ cow, status, needs }: { cow: string; status: string; needs?: boolean }) {
  return (
    <div className={s.meta}>
      <span className={s.metaCow}>{cow}</span>
      <span className={cx(s.metaStatus, needs && s.metaNeeds)}>{status}</span>
    </div>
  );
}

export function Title({ children }: { children: ReactNode }) {
  return <h2 className={s.title}>{children}</h2>;
}

export function Body({ children, ink }: { children: ReactNode; ink?: boolean }) {
  return <p className={cx(s.body, ink && s.bodyInk)}>{children}</p>;
}

/** The one dark action on the screen. */
export function Button({ to, children, block, onClick }: { to?: Slug; children: ReactNode; block?: boolean; onClick?: () => void }) {
  const cls = cx(s.btn, block && s.btnBlock);
  return to ? (
    <Link href={href(to)} className={cls}>
      {children}
    </Link>
  ) : (
    <button className={cls} onClick={onClick}>
      {children}
    </button>
  );
}

export function TextLink({ to, children }: { to?: Slug; children: ReactNode }) {
  return to ? (
    <Link href={href(to)} className={s.textLink}>
      {children}
    </Link>
  ) : (
    <button className={s.textLink}>{children}</button>
  );
}

export function Links({ children }: { children: ReactNode }) {
  return <div className={s.links}>{children}</div>;
}

export function Facts({ items }: { items: [string, string][] }) {
  return (
    <div className={s.facts}>
      {items.map(([src, text]) => (
        <div key={src} className={s.fact}>
          <p className={s.factSource}>{src}</p>
          <p className={s.factText}>{text}</p>
        </div>
      ))}
    </div>
  );
}

export function Card({ title, to, children }: { title: string; to?: Slug; children: ReactNode }) {
  const inner = (
    <>
      <p className={s.cardTitle}>{title}</p>
      {children}
    </>
  );
  return to ? (
    <Link href={href(to)} className={s.card}>
      {inner}
    </Link>
  ) : (
    <div className={s.card}>{inner}</div>
  );
}

export function Big({ children, size }: { children: ReactNode; size?: 30 }) {
  return <p className={cx(s.big, size === 30 && s.big30)}>{children}</p>;
}

export function Note({ children, size }: { children: ReactNode; size?: 13 }) {
  return <p className={size === 13 ? s.cardNote13 : s.cardNote}>{children}</p>;
}

/** Labor clock track: share of the 60 minutes used, and the two ends. */
export function Clock({ used, from, to, toLabel, toNeeds }: { used: number; from: string; to: string; toLabel: string; toNeeds?: boolean }) {
  return (
    <div className={s.track}>
      <div className={s.bar}>
        <div className={s.barFill} style={{ width: `${Math.max(0, Math.min(1, used)) * 100}%` }} />
      </div>
      <div className={s.ends}>
        <div className={s.end}>
          <span className={s.endTime}>{from}</span>
          <span className={s.endLabel}>Feet seen</span>
        </div>
        <div className={cx(s.end, s.endRight)}>
          <span className={s.endTime}>{to}</span>
          <span className={cx(s.endLabel, toNeeds && s.metaNeeds)}>{toLabel}</span>
        </div>
      </div>
    </div>
  );
}

export function Step({ time, label, done, timeWidth = 80 }: { time: string; label: string; done?: boolean; timeWidth?: number }) {
  return (
    <div className={cx(s.step, !done && s.stepPending)}>
      <span className={s.stepTime} style={{ width: timeWidth }}>
        {time}
      </span>
      <span className={s.stepLabel}>{label}</span>
      {done && (
        <span className={s.check}>
          <MIcon name="check_circle" />
        </span>
      )}
    </div>
  );
}

/** A row of choice pills; tapping one picks it. */
export function Choices({ label, options }: { label: string; options: string[] }) {
  const [on, setOn] = useState<string | null>(null);
  return (
    <div className={s.choiceGroup}>
      <p className={s.choiceLabel}>{label}</p>
      <div className={s.choices} role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button key={o} role="radio" aria-checked={on === o} className={cx(s.choice, on === o && s.choiceOn)} onClick={() => setOn(on === o ? null : o)}>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export function FrameStrip({ label, times, note }: { label: string; times: string[]; note: string }) {
  return (
    <div className={s.frames}>
      <p className={s.choiceLabel}>{label}</p>
      <div className={s.strip}>
        {times.map((t) => (
          <div key={t} className={s.frame}>
            <Scene kind="laborIR" />
            <span className={s.frameTime}>{t}</span>
          </div>
        ))}
      </div>
      <p className={cx(s.body, s.bodyInk)}>{note}</p>
    </div>
  );
}

export function SwitchRow({ title, on: onText, off: offText }: { title: string; on: string; off: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className={s.switchRow}>
      <div className={s.switchText}>
        <span className={s.switchTitle}>{title}</span>
        <span className={s.switchSub}>{on ? onText : offText}</span>
      </div>
      <button role="switch" aria-checked={on} aria-label={title} className={cx(s.switch, on && s.switchOn)} onClick={() => setOn(!on)} />
    </div>
  );
}

/* ---------- List rows ---------- */

export type Row = { cow: string; status: string; title: string; sub: string; when: string; thumb?: "photo" | "calendar" | "water" | "pin"; to?: Slug; needs?: boolean };

function Thumb({ kind = "photo" }: { kind?: Row["thumb"] }) {
  if (kind === "photo")
    return (
      <div className={s.thumb}>
        <Scene kind="herdDay" />
      </div>
    );
  const icon = { calendar: "calendar_today", water: "water_drop", pin: "location_on" }[kind] ?? "calendar_today";
  return (
    <div className={cx(s.thumb, s.thumbIcon, kind === "water" && s.thumbBlue)}>
      <MIcon name={icon} size={20} />
    </div>
  );
}

export function List({ rows }: { rows: Row[] }) {
  return (
    <div className={s.list}>
      {rows.map((r) => {
        const inner = (
          <>
            <Thumb kind={r.thumb} />
            <div className={s.rowText}>
              <div className={s.rowMeta}>
                <span className={s.metaCow}>{r.cow}</span>
                <span className={cx(s.metaStatus, r.needs && s.metaNeeds)}>{r.status}</span>
              </div>
              <p className={s.rowTitle}>{r.title}</p>
              <p className={s.rowSub}>{r.sub}</p>
            </div>
            <div className={s.rowWhen}>
              <span className={s.rowWhenText}>{r.when}</span>
              <MIcon name="chevron_right" />
            </div>
          </>
        );
        return r.to ? (
          <Link key={r.cow + r.title} href={href(r.to)} className={s.listRow}>
            {inner}
          </Link>
        ) : (
          <div key={r.cow + r.title} className={s.listRow}>
            {inner}
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Floating nav + mic ---------- */

export type Tab = "Today" | "Herd" | "Vet" | "Map";
const TABS: [Tab, Slug][] = [
  ["Today", "today"],
  ["Herd", "herd"],
  ["Vet", "vet"],
  ["Map", "map"],
];

function Nav({ active }: { active: Tab }) {
  return (
    <>
      <div className={s.navBackdrop} />
      <nav className={s.nav} aria-label="Tabs">
        {TABS.map(([tab, slug]) => (
          <Link key={tab} href={href(slug)} className={cx(s.navItem, tab === active && s.navOn)} aria-current={tab === active ? "page" : undefined} aria-label={tab}>
            <NavIcon tab={tab} />
            {tab === active && <span className={s.navLabel}>{tab}</span>}
          </Link>
        ))}
      </nav>
      <button className={s.mic} aria-label="Talk to Lattis">
        <MIcon name="mic" size={28} />
      </button>
    </>
  );
}

export function Actions({ children, inline }: { children: ReactNode; inline?: boolean }) {
  return <div className={inline ? cx(s.actions, s.actionsInline) : undefined}>{children}</div>;
}
