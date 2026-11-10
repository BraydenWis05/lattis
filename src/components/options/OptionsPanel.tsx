"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { options, sections, type Option, type SectionId } from "@/lib/options";
import { useOption, useOptions } from "./OptionsProvider";
import { Icon } from "@/components/Icon";
import { ROUTES } from "@/app/phone/app/routes";
import styles from "./options.module.css";

/** The round button at the bottom left, and the panel it opens. Shown on every page. */
export function OptionsPanel() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const current: SectionId =
    sections.find((s) => pathname.startsWith(s.href))?.id ?? "phone";
  const [tab, setTab] = useState<SectionId>(current);
  const { reset } = useOptions();

  useEffect(() => setTab(current), [current]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const list = options[tab];
  const groups = (["Versions", "Data"] as const).filter((g) => list.some((o) => o.group === g));
  const tabHref = sections.find((s) => s.id === tab)!.href;
  const onThisSection = pathname.startsWith(tabHref);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* clipboard blocked: nothing to do */
    }
  }

  return (
    <>
      {open && (
        <div className={styles.panel} role="dialog" aria-label="Options">
          <div className={styles.tabs} role="tablist">
            {sections.map((s) => (
              <Link
                key={s.id}
                href={s.href}
                role="tab"
                aria-selected={tab === s.id}
                className={`${styles.tab} ${tab === s.id ? styles.tabOn : ""}`}
                onClick={() => setTab(s.id)}
              >
                {s.name}
              </Link>
            ))}
          </div>

          {list.length === 0 && (
            <p className={styles.empty}>
              No options yet. Add them in <code>src/lib/options.ts</code>.
            </p>
          )}

          {groups.map((g) => (
            <section key={g} className={styles.group}>
              <p className={styles.groupTitle}>{g === "Versions" ? "Section options" : "Data"}</p>
              <div className={styles.rows}>
                {list
                  .filter((o) => o.group === g)
                  .map((o) => (
                    <Row key={o.key} section={tab} option={o} />
                  ))}
              </div>
            </section>
          ))}

          {tab === "phone" && <ScreenJump />}

          {list.length > 0 && (
            <div className={styles.footer}>
              <button className={styles.footerBtn} onClick={() => reset(tab)}>
                Reset
              </button>
              <button className={styles.footerBtn} onClick={copyLink}>
                {copied ? "Link copied" : "Copy link to this view"}
              </button>
            </div>
          )}
          {!onThisSection && list.length > 0 && (
            <p className={styles.empty}>Open this section to see the changes.</p>
          )}
        </div>
      )}

      <button
        className={`${styles.fab} ${open ? styles.fabOn : ""}`}
        aria-label={open ? "Close options" : "Open options"}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Icon name="sliders" />
      </button>
    </>
  );
}

/** Every phone screen from Figma, grouped by section, to jump straight to one. */
function ScreenJump() {
  const router = useRouter();
  const pathname = usePathname();
  const groups = new Map<string, (typeof ROUTES)[number][]>();
  for (const s of ROUTES) groups.set(s.group, [...(groups.get(s.group) || []), s]);
  return (
    <section className={styles.group}>
      <p className={styles.groupTitle}>Go to a screen ({ROUTES.length})</p>
      <div className={styles.screenList}>
        {[...groups.entries()].map(([section, items]) => (
          <div key={section} className={styles.screenGroup}>
            <p className={styles.meaning}>{section}</p>
            {items.map((s) => {
              const here = pathname.replace(/\/$/, "") === `/phone/${s.slug}`;
              return (
                <button
                  key={s.slug}
                  className={`${styles.screenItem} ${here ? styles.screenItemOn : ""}`}
                  onClick={() => router.push(`/phone/${s.slug}`)}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

function Row({ section, option }: { section: SectionId; option: Option }) {
  const { set } = useOptions();
  const router = useRouter();
  const pathname = usePathname();
  const value = useOption(section, option.key);
  const meaning = option.meaning?.[value];
  const long = option.choices.join("").length > 16;
  const choose = (c: string) => {
    set(section, option.key, c);
    // Phone options pick the screen the app opens on, so show it
    if (section === "phone" && pathname.replace(/\/$/, "") !== "/phone") router.push("/phone");
  };
  return (
    <div className={`${styles.row} ${long ? styles.rowStacked : ""}`}>
      <div className={styles.rowLabel}>
        <span>{option.label}</span>
        {meaning && <span className={styles.meaning}>{value}: {meaning}</span>}
      </div>
      <div className={`${styles.segment} ${long ? styles.segmentWrap : ""}`} role="radiogroup" aria-label={option.label}>
        {option.choices.map((c) => (
          <button
            key={c}
            role="radio"
            aria-checked={value === c}
            className={`${styles.seg} ${value === c ? styles.segOn : ""}`}
            onClick={() => choose(c)}
            title={option.meaning?.[c]}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}
