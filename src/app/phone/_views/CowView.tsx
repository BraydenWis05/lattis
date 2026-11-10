"use client";

import { PhoneFrame, Hero, Sheet } from "@/components/PhoneFrame";
import { Fact } from "@/components/Status";
import { useOption } from "@/components/options/OptionsProvider";
import { cow14, daleNeedsYou, people } from "@/lib/story";

export function CowView() {
  const call = useOption("phone", "call");
  const detail = useOption("phone", "detail");
  const longNames = useOption("phone", "names") === "Long";
  const signal = useOption("phone", "signal");
  const name = longNames ? daleNeedsYou[0].long : cow14.label;
  const facts = detail === "Less" ? cow14.facts.slice(0, 1) : cow14.facts;

  return (
    <PhoneFrame caption="Rancher app, what the drone saw and your call" back={{ href: "/phone", label: "Today" }}>
      <Hero eyebrow={cow14.seen} dim={`${name}.`} bright={cow14.headline} />
      <Sheet>
        <section className="stack gap-12">
          <p className="small">
            <span className="needs-you">{cow14.status}</span>, not an emergency.
          </p>
          <div className="card stack gap-8">
            {facts.map((f) => (
              <Fact key={f.text} text={f.text} strong={f.key} />
            ))}
          </div>
          {detail !== "Less" && <p className="small">{cow14.cantTell}</p>}
          {detail === "All" && <p className="small">{cow14.where}. Seen by the drone at 11:40 AM.</p>}
        </section>

        <section className="stack gap-12">
          <p className="label">Your call, {people.absentee.name}</p>
          {call === "A" &&
            cow14.choices.map((c) => (
              <button key={c.title} className="card stack gap-4" style={{ border: 0, textAlign: "left", color: "inherit" }}>
                <span className="row">{c.title}</span>
                <span className="small">{c.note}</span>
              </button>
            ))}
          {call === "B" && (
            <div className="stack gap-8">
              <button className="btn btn-primary btn-block">{cow14.choices[0].title}</button>
              <button className="btn btn-secondary btn-block">{cow14.choices[1].title}</button>
              <button className="btn btn-text btn-block">{cow14.choices[2].title}</button>
            </div>
          )}
          {signal === "Off" && (
            <p className="small">No signal here. Whatever you pick is saved and sends once you have signal.</p>
          )}
        </section>
      </Sheet>
    </PhoneFrame>
  );
}
