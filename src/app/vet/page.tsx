import Link from "next/link";

export const metadata = { title: "Vet website · Lattis" };

/** Empty on purpose. Finley's section: build it here. */
export default function Page() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px" }} className="stack gap-12">
      <Link href="/" className="small">
        ← All sections
      </Link>
      <h1 className="title">Vet website</h1>
      <p className="muted">Nothing here yet.</p>
    </main>
  );
}
