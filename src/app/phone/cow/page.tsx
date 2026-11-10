import { PhoneFrame, Hero, Sheet } from "@/components/PhoneFrame";
import { Fact } from "@/components/Status";
import { cow14, people } from "@/lib/story";

export const metadata = { title: `${cow14.label} · Rancher app · Lattis` };

export default function CowScreen() {
  return (
    <PhoneFrame
      caption="Rancher app, what the drone saw and your call"
      back={{ href: "/phone", label: "Today" }}
    >
      <Hero eyebrow={cow14.seen} dim={`${cow14.label}.`} bright={cow14.headline} />
      <Sheet>
        <section className="stack gap-12">
          <p className="small">
            <span className="needs-you">{cow14.status}</span>, not an emergency.
          </p>
          <div className="card stack gap-8">
            {cow14.facts.map((f) => (
              <Fact key={f.text} text={f.text} strong={f.key} />
            ))}
          </div>
          <p className="small">{cow14.cantTell}</p>
        </section>

        <section className="stack gap-12">
          <p className="label">Your call, {people.absentee.name}</p>
          {cow14.choices.map((c) => (
            <button
              key={c.title}
              className="card stack gap-4"
              style={{ border: 0, textAlign: "left", color: "inherit" }}
            >
              <span className="row">{c.title}</span>
              <span className="small">{c.note}</span>
            </button>
          ))}
        </section>
      </Sheet>
    </PhoneFrame>
  );
}
