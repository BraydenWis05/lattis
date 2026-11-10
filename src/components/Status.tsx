import type { Status as StatusWord } from "@/lib/story";

/** Urgency shows as a word, never a badge, banner or colored border. */
export function Status({ value }: { value: StatusWord }) {
  const needsYou = value === "Urgent" || value === "Needs a look";
  return <span className={`small ${needsYou ? "needs-you" : "muted"}`}>{value}</span>;
}

/** Plain text with the key phrase in full ink, the rest muted. */
export function Fact({ text, strong }: { text: string; strong: string }) {
  const i = text.indexOf(strong);
  if (i < 0) return <p className="muted">{text}</p>;
  return (
    <p className="muted">
      {text.slice(0, i)}
      <span style={{ color: "var(--primary)" }}>{strong}</span>
      {text.slice(i + strong.length)}
    </p>
  );
}
