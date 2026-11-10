import Link from "next/link";
import styles from "./home.module.css";
import { people } from "@/lib/story";

const sections = [
  {
    href: "/phone",
    title: "Rancher app",
    who: `${people.absentee.name} and ${people.rancher.name}, on the phone`,
    what: "The buzz, what the drone saw, finding her, and sending her to the vet.",
    owner: "Brayden",
  },
  {
    href: "/ranch",
    title: "Rancher software",
    who: "Not started",
    what: "",
    owner: "Chris",
  },
  {
    href: "/vet",
    title: "Vet website",
    who: "Not started",
    what: "",
    owner: "Finley",
  },
];

export default function Home() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className="label">Lattis prototype</p>
        <h1 className={styles.hero}>
          From the drone
          <br />
          to your own vet.
        </h1>
        <p className="muted">Three parts of one system. Pick one to preview it.</p>
      </header>

      <div className={styles.grid}>
        {sections.map((s) => (
          <Link key={s.href} href={s.href} className={`card ${styles.section}`}>
            <h2 className={styles.sectionTitle}>{s.title}</h2>
            <p className="row">{s.who}</p>
            {s.what && <p className="small">{s.what}</p>}
            <p className={`small ${styles.owner}`}>Led by {s.owner}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
