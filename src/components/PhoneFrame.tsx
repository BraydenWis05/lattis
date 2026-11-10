import Link from "next/link";
import styles from "./phone.module.css";
import { Icon } from "./Icon";

/** Shows a phone screen at 390 x 844, framed, centered on the page. */
export function PhoneFrame({
  children,
  caption,
  nav = "Today",
  back,
}: {
  children: React.ReactNode;
  caption?: string;
  nav?: "Today" | "Herd" | "Vet" | "Map" | null;
  back?: { href: string; label: string };
}) {
  return (
    <div className={styles.stage}>
      <div className={styles.device}>
        <div className={styles.screen}>
          <div className={styles.statusBar}>
            <span>9:41</span>
            <span aria-hidden>●●● ▮</span>
          </div>
          {back && (
            <Link href={back.href} className={styles.back}>
              ← {back.label}
            </Link>
          )}
          <div className={styles.scroll}>{children}</div>
          {nav && <FloatingNav active={nav} />}
        </div>
      </div>
      {caption && <p className="small">{caption}</p>}
    </div>
  );
}

const tabs = [
  { name: "Today", href: "/phone", icon: "today" },
  { name: "Herd", href: "/phone", icon: "herd" },
  { name: "Vet", href: "/phone", icon: "vet" },
  { name: "Map", href: "/phone", icon: "map" },
] as const;

function FloatingNav({ active }: { active: string }) {
  return (
    <nav className={styles.navWrap} aria-label="Main">
      <div className={styles.nav}>
        {tabs.map((t) => (
          <Link
            key={t.name}
            href={t.href}
            className={`${styles.tab} ${t.name === active ? styles.tabActive : ""}`}
            aria-current={t.name === active ? "page" : undefined}
          >
            <Icon name={t.icon} />
            {t.name === active && <span>{t.name}</span>}
            {t.name !== active && <span className={styles.srOnly}>{t.name}</span>}
          </Link>
        ))}
      </div>
      <button className={styles.mic} aria-label="Talk to Lattis">
        <Icon name="mic" size={24} />
      </button>
    </nav>
  );
}

/** The photo-led top of a phone screen: eyebrow, two-line greeting, pill. */
export function Hero({
  eyebrow,
  dim,
  bright,
  pill,
  tone = "pasture",
}: {
  eyebrow: string;
  dim: string;
  bright: string;
  pill?: string;
  tone?: "pasture" | "map";
}) {
  return (
    <header className={`${styles.hero} ${tone === "map" ? styles.heroMap : ""}`}>
      <p className={styles.heroEyebrow}>{eyebrow}</p>
      <h1 className={styles.greeting}>
        <span className={styles.dim}>{dim}</span>
        <br />
        {bright}
      </h1>
      {pill && <span className={styles.pill}>{pill}</span>}
    </header>
  );
}

export function Sheet({ children }: { children: React.ReactNode }) {
  return <div className={styles.sheet}>{children}</div>;
}
