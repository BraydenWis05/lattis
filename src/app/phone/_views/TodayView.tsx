"use client";

import Link from "next/link";
import { PhoneFrame, Hero, Sheet } from "@/components/PhoneFrame";
import { Status } from "@/components/Status";
import { useOption } from "@/components/options/OptionsProvider";
import { daleNeedsYou, people, ranches, statusOrder, type HerdCow } from "@/lib/story";

const words = ["None", "One", "Two", "Three", "Four", "Five", "Six"];

export function TodayView() {
  const layout = useOption("phone", "layout");
  const count = Number(useOption("phone", "count"));
  const detail = useOption("phone", "detail");
  const longNames = useOption("phone", "names") === "Long";
  const drone = useOption("phone", "drone");
  const signal = useOption("phone", "signal");

  const herd = ranches.dale.head;
  const cows = daleNeedsYou.slice(0, count).sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);
  const urgent = cows.find((c) => c.status === "Urgent");
  const name = (c: HerdCow) => (longNames ? c.long : c.label);

  const bright =
    count === 0
      ? `All ${herd} are OK.`
      : urgent
        ? `${urgent.label} needs you now.` // short number only: greetings stay on two lines
        : count === 1
          ? "One needs a look."
          : `${words[count]} need a look.`;

  const eyebrow =
    drone === "Flying"
      ? "Drone checking now"
      : drone === "Missed"
        ? "Last full check, today 7:40 AM"
        : "Drone check, today 11:40 AM";

  const pill =
    drone === "Flying"
      ? `Checking now, 12 of ${herd} seen so far`
      : drone === "Missed"
        ? "The 11:40 AM check didn’t finish. Next try 1:00 PM"
        : count === 0
          ? `All ${herd} seen`
          : `All ${herd - count} others seen`;

  return (
    <PhoneFrame caption={`Rancher app, Today screen for ${people.absentee.full}`}>
      <Hero
        eyebrow={eyebrow}
        dim={`Morning, ${people.absentee.name}.`}
        bright={bright}
        pill={signal === "Off" ? `No signal. Showing what we had at 11:40 AM` : pill}
      />
      <Sheet>
        {count > 0 && (
          <section className="stack gap-12">
            <p className="label">Needs you</p>
            {layout === "A" && cows.map((c) => <CowCard key={c.id} cow={c} name={name(c)} detail={detail} />)}
            {layout === "B" && <CowList cows={cows} name={name} detail={detail} />}
            {layout === "C" && (
              <>
                <BigCow cow={cows[0]} name={name(cows[0])} detail={detail} />
                {cows.length > 1 && <CowList cows={cows.slice(1)} name={name} detail={detail} />}
              </>
            )}
          </section>
        )}

        {count === 0 && (
          <section className="card stack gap-4">
            <p className="row">
              Every cow was seen at {drone === "Missed" ? "7:40 AM" : "11:40 AM"}
            </p>
            <p className="small">We’ll buzz you if that changes.</p>
          </section>
        )}

        {detail !== "Less" && (
          <section className="stack gap-12">
            <p className="label">The rest of today</p>
            <div className="card stack gap-4">
              <p className="row">
                {drone === "Missed" ? "Next try at 1:00 PM" : "Next drone check at 4:00 PM"}
              </p>
              <p className="small">You get one buzz if anything changes.</p>
            </div>
            {detail === "All" && (
              <div className="card stack gap-4">
                <p className="row">Nothing from {people.vet.name} today</p>
                <p className="small">Her last note was about the fall shots.</p>
              </div>
            )}
          </section>
        )}
      </Sheet>
    </PhoneFrame>
  );
}

function Lines({ cow, detail }: { cow: HerdCow; detail: string }) {
  if (detail === "Less") return null;
  return (
    <>
      <p className="small">{cow.fact}</p>
      {detail === "All" && (
        <p className="small">
          {cow.where}, seen {cow.seen}
        </p>
      )}
    </>
  );
}

function Head({ name, cow, big }: { name: string; cow: HerdCow; big?: boolean }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
      <p className={big ? "title" : "row"} style={{ minWidth: 0 }}>
        {name}
      </p>
      <span style={{ flexShrink: 0 }}>
        <Status value={cow.status} />
      </span>
    </div>
  );
}

function CowCard({ cow, name, detail }: { cow: HerdCow; name: string; detail: string }) {
  return (
    <Link href="/phone/cow" className="card stack gap-4">
      <Head name={name} cow={cow} big />
      <Lines cow={cow} detail={detail} />
    </Link>
  );
}

function CowList({ cows, name, detail }: { cows: HerdCow[]; name: (c: HerdCow) => string; detail: string }) {
  return (
    <div className="card stack gap-16" style={{ gap: 16 }}>
      {cows.map((c) => (
        <Link key={c.id} href="/phone/cow" className="stack gap-4">
          <Head name={name(c)} cow={c} />
          <Lines cow={c} detail={detail} />
        </Link>
      ))}
    </div>
  );
}

function BigCow({ cow, name, detail }: { cow: HerdCow; name: string; detail: string }) {
  return (
    <Link href="/phone/cow" className="card stack gap-12" style={{ padding: 12 }}>
      <div
        role="img"
        aria-label={`Drone photo of ${cow.label}`}
        style={{ height: 160, borderRadius: 12, background: '#6b7a4f url("/photos/pasture.jpg") center / cover' }}
      />
      <div className="stack gap-4" style={{ padding: "0 8px 8px" }}>
        <Head name={name} cow={cow} big />
        <Lines cow={cow} detail={detail === "Less" ? "Some" : detail} />
      </div>
    </Link>
  );
}
