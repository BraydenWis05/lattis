import Link from "next/link";
import { PhoneFrame, Hero, Sheet } from "@/components/PhoneFrame";
import { Status } from "@/components/Status";
import { cow14, people, ranches } from "@/lib/story";

export const metadata = { title: "Rancher app · Lattis" };

export default function PhoneToday() {
  const others = ranches.dale.head - 1;
  return (
    <PhoneFrame caption={`Rancher app, Today screen for ${people.absentee.full}`}>
      <Hero
        eyebrow="Drone check, today 11:40 AM"
        dim={`Morning, ${people.absentee.name}.`}
        bright="One needs a look."
        pill={`All ${others} others seen`}
      />
      <Sheet>
        <section className="stack gap-12">
          <p className="label">Needs you</p>
          <Link href="/phone/cow" className="card stack gap-4">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <p className="title">{cow14.label}</p>
              <Status value={cow14.status} />
            </div>
            <p className="small">{cow14.facts[0].text}</p>
            <p className="small">{cow14.where}</p>
          </Link>
        </section>

        <section className="stack gap-12">
          <p className="label">The rest of today</p>
          <div className="card stack gap-4">
            <p className="row">Next drone check at 4:00 PM</p>
            <p className="small">You get one buzz if anything changes.</p>
          </div>
          <div className="card stack gap-4">
            <p className="row">Nothing from {people.vet.name} today</p>
            <p className="small">Her last note was about the fall shots.</p>
          </div>
        </section>
      </Sheet>
    </PhoneFrame>
  );
}
