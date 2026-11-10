"use client";

import Link from "next/link";
import { MIcon } from "./ui";
import { href, type Slug } from "./routes";
import { night } from "@/lib/story";
import s from "./lock.module.css";

/** The Lattis mark: a small lattice, drawn in code. */
export function LatticeMark({ size = 22 }: { size?: number }) {
  const lines = [-6, 0, 6];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <g transform="rotate(45 12 12)" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none">
        {lines.map((d) => (
          <path key={`v${d}`} d={`M${12 + d} 3.5V20.5`} />
        ))}
        {lines.map((d) => (
          <path key={`h${d}`} d={`M3.5 ${12 + d}H20.5`} />
        ))}
      </g>
    </svg>
  );
}

/** Night pasture wallpaper, drawn in code: dusk sky, peaks, the fence line. */
function Wallpaper() {
  return (
    <svg className={s.wall} viewBox="0 0 402 874" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="lock-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#141b2b" />
          <stop offset="0.45" stopColor="#3a4660" />
          <stop offset="0.62" stopColor="#7c7f8e" />
        </linearGradient>
        <linearGradient id="lock-grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3d4a32" />
          <stop offset="1" stopColor="#1e2619" />
        </linearGradient>
      </defs>
      <rect width="402" height="874" fill="url(#lock-sky)" />
      <circle cx="342" cy="244" r="14" fill="#f1efe6" opacity="0.8" />
      <path d="M0 520 60 430 104 470 160 380 214 450 262 400 318 460 360 420 402 470V600H0Z" fill="#4c5670" />
      <path d="M150 392 160 380 172 398 164 396ZM250 410 262 400 272 414Z" fill="#dfe3ea" opacity="0.7" />
      <path d="M0 560C80 540 160 548 240 538S360 546 402 540V874H0Z" fill="url(#lock-grass)" />
      <g fill="#2a2018">
        <path d="M86 600c0-8 8-12 20-12h30c8 0 12-4 18-6 4-1 8 1 8 5s-3 6-6 7l-2 8c0 6-4 8-8 8v14h-5l-1-12h-26l-2 12h-5l-1-13c-8 0-12 5-14 13h-5l1-14c-3-3-4-6-4-10z" />
        <path d="M232 612c0-6 6-9 15-9h22c6 0 9-3 13-4 3-1 6 1 6 4s-2 4-4 5l-2 6c0 4-3 6-6 6v10h-4l-1-9h-19l-1 9h-4l-1-10c-6 0-9 4-10 10h-4l1-10c-2-2-3-5-3-8z" />
      </g>
      <g stroke="#3b2d22" strokeWidth="7" strokeLinecap="round">
        <path d="M0 700 402 668" />
        <path d="M0 742 402 716" />
      </g>
      <g fill="#2f241b">
        {[30, 150, 270, 380].map((x, i) => (
          <rect key={x} x={x} y={650 - i * 8} width="14" height="130" rx="3" />
        ))}
      </g>
      <rect width="402" height="874" fill="#000" opacity="0.18" />
    </svg>
  );
}

export type LockNote = { tag?: string; title: string; when: string; body: string; bar?: number; to?: Slug };

export function LockScreen({ time, notes }: { time: string; notes: LockNote[] }) {
  return (
    <div className={s.lock}>
      <Wallpaper />
      <div className={s.levels} aria-hidden>
        <svg width="18" height="12" viewBox="0 0 18 12">
          <g fill="#fff">
            <rect x="0" y="8" width="3" height="4" rx="1" />
            <rect x="5" y="5.5" width="3" height="6.5" rx="1" />
            <rect x="10" y="3" width="3" height="9" rx="1" />
            <rect x="15" y="0" width="3" height="12" rx="1" />
          </g>
        </svg>
        <svg width="17" height="12" viewBox="0 0 19 14">
          <path fill="#fff" d="M9.5 2.5c2.9 0 5.5 1.1 7.5 3l1.5-1.6A12.8 12.8 0 0 0 9.5.3C6 .3 2.9 1.7.5 3.9L2 5.5a10.6 10.6 0 0 1 7.5-3zm0 4.3c1.7 0 3.3.6 4.5 1.7l1.5-1.6a8.6 8.6 0 0 0-12 0L5 8.5a6.4 6.4 0 0 1 4.5-1.7zm0 4.2c.6 0 1.2.2 1.6.6L9.5 13.3 7.9 11.6c.4-.4 1-.6 1.6-.6z" />
        </svg>
        <svg width="27" height="13" viewBox="0 0 29 14">
          <rect x="0.5" y="0.5" width="24.5" height="13" rx="4" fill="none" stroke="#fff" opacity="0.4" />
          <rect x="2.3" y="2.3" width="21" height="9.4" rx="2.4" fill="#fff" />
        </svg>
      </div>
      <div className={s.swipe} />
      <p className={s.date}>{night.day}</p>
      <p className={s.clock}>{time}</p>
      <div className={s.center}>
        <div className={s.centerHead}>
          <span className={s.centerTitle}>Notification Center</span>
          <button className={s.clear} aria-label="Clear">
            <MIcon name="close" size={16} />
          </button>
        </div>
        {notes.map((n) => {
          const inner = (
            <>
              <span className={s.icon}>
                <LatticeMark />
              </span>
              <span className={s.text}>
                {n.tag && <span className={s.tag}>{n.tag}</span>}
                <span className={s.top}>
                  <span className={s.title}>{n.title}</span>
                  <span className={s.when}>{n.when}</span>
                </span>
                <span className={s.body}>{n.body}</span>
                {n.bar !== undefined && (
                  <span className={s.bar}>
                    <span className={s.barFill} style={{ display: "block", width: `${n.bar * 100}%` }} />
                  </span>
                )}
              </span>
            </>
          );
          return n.to ? (
            <Link key={n.title} href={href(n.to)} className={s.card}>
              {inner}
            </Link>
          ) : (
            <div key={n.title} className={s.card}>
              {inner}
            </div>
          );
        })}
      </div>
      <div className={s.controls}>
        <button className={s.control} aria-label="Flashlight">
          <MIcon name="flashlight_on" size={22} />
        </button>
        <button className={s.control} aria-label="Camera">
          <MIcon name="photo_camera" size={22} />
        </button>
      </div>
      <div className={s.home} />
    </div>
  );
}
