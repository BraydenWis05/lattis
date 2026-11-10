"use client";

/**
 * The rancher app's screens, coded from the Final App Flow page in Figma.
 * One night in calving season (lock screens through the 5:30 AM report) and the four tab pages.
 * Names, cows and times come from src/lib/story.ts.
 */
import type { ReactNode } from "react";
import { herd, night, people } from "@/lib/story";
import { LockScreen } from "./Lock";
import type { Slug } from "./routes";
import {
  Body, Big, Button, Card, Choices, Clock, Facts, FrameStrip, Header, Links, List, Meta, Note,
  Photo, Screen, Section, StatusBar, Step, SwitchRow, Tabs, TextLink, Title, Actions,
} from "./ui";

const cow = `Cow ${herd.heifer}`;
const vet = people.vet.name;
const stamp = (t: string) => `${night.day}, ${t}`;
const feedTabs = (all: number, now: number, look: number, info: number): [string, number][] => [
  ["All", all],
  ["Needs you now", now],
  ["Needs a look", look],
  ["For your info", info],
];

/* ---------- The night ---------- */

function Lock145() {
  return (
    <LockScreen
      time={night.watchStart}
      notes={[
        {
          title: `Watching cow ${herd.heifer}`,
          when: "1:44 AM",
          body: `${herd.drone} is checking on its own. Next look about ${night.nextLook}. It only buzzes if she needs you.`,
          to: "watch-list",
        },
      ]}
    />
  );
}

function WatchList() {
  return (
    <Screen nav="Today">
      <StatusBar time="1:58" />
      <Header date={stamp("1:58 AM")} line1={`${cow} is on watch.`} line2="Nothing to do yet." sub={`${herd.drone} looked at ${night.droneLook}, from 30 m back`} />
      <Tabs tabs={feedTabs(1, 0, 1, 0)} />
      <Section>
        <Photo scene="herdNight" caption={`${herd.drone}, zoom and infrared, ${night.droneLook}`} />
        <Meta cow={cow} status="Needs a look" />
        <Title>Lying down, alone. No labor signs yet.</Title>
        <Button to="labor-clock">See the last look</Button>
        <Facts
          items={[
            ["From the ear tag", "Off alone by the creek since 1:40 AM. Lying down and up 4 times in the last hour."],
            ["From the preg check", "Due Monday. First calf."],
            [`From ${herd.drone} at ${night.droneLook}`, "Alone, lying down, no labor signs yet."],
          ]}
        />
      </Section>
      <SwitchRow title="Tell me when labor starts" off="Off. Lattis wakes you only if something goes wrong." on="On. Lattis buzzes once when labor starts." />
    </Screen>
  );
}

function LaborClock() {
  return (
    <Screen
      actions={
        <>
          <Button to="map" block>
            Go now
          </Button>
          <Links>
            <TextLink to="calf-on-the-ground">Recheck in 15</TextLink>
            <TextLink to="vet">Call {vet}</TextLink>
          </Links>
        </>
      }
    >
      <StatusBar time="2:20" />
      <Header date={stamp("2:20 AM")} line1={`${cow} is in labor.`} line2={`Feet seen at ${night.feetSeen} AM.`} tone="needs" sub="Needs a look, no buzz sent" />
      <Section>
        <Photo scene="laborIR" caption={`${herd.drone}, zoom and infrared, ${night.feetSeen} AM`} live />
        <Meta cow={cow} status="In labor" needs />
        <Body>Feet showing, likely front feet. Check the frame.</Body>
        <Card title="Labor clock, heifer" to="lock-3-19">
          <Big>1 min in</Big>
          <Clock used={1 / 60} from={night.feetSeen} to={night.examineBy} toLabel="Examine by" />
          <Note>Heifers: examine if there’s no progress in 60 min (OSU).</Note>
        </Card>
        <Body>{herd.drone} rechecks every 15 min from 30 m back. We’ll only call you if labor stalls or something looks wrong.</Body>
      </Section>
    </Screen>
  );
}

function CalfOnTheGround() {
  return (
    <Screen nav="Today">
      <StatusBar time="2:58" />
      <Header date={stamp("2:58 AM")} line1={`${cow} calved.`} line2={`Calf seen at ${night.calfSeen} AM.`} sub="For your info, no wake-up" />
      <Tabs tabs={feedTabs(1, 0, 0, 1)} />
      <Section>
        <Photo scene="calfIR" caption={`${herd.drone}, zoom and infrared, ${night.calfSeen} AM`} live />
        <Meta cow={cow} status="For your info" />
        <Title>Cow standing, calf lying down</Title>
        <Body>Labor took 39 min from feet seen at {night.feetSeen}. Heifer limit: 60 min.</Body>
        <Card title={`Newborn clock, from ${night.calfSeen} AM`}>
          <div>
            <Step time={night.calfSeen} label="Calf seen" done timeWidth={130} />
            <Step time="By about 4:30" label="Standing" timeWidth={130} />
            <Step time="By about 5 to 7 AM" label="Nursing" timeWidth={130} />
          </div>
          <Note size={13}>We’ll call you if not.</Note>
        </Card>
      </Section>
      <Actions inline>
        <Button to="morning-report" block>
          See the last look
        </Button>
        <Links>
          <TextLink to="map">Watch live</TextLink>
        </Links>
      </Actions>
    </Screen>
  );
}

function Lock319() {
  return (
    <LockScreen
      time={night.examineBy}
      notes={[
        {
          tag: "Time Sensitive",
          title: `Cow ${herd.heifer} needs you now`,
          when: "now",
          body: `No progress in 60 min. ${herd.drone} is holding 30 m back, light pointed away.`,
          to: "needs-you-now",
        },
        { title: "Labor clock at 60 min", when: `${night.feetSeen} AM`, body: "No progress since feet were seen.", bar: 1, to: "needs-you-now" },
      ]}
    />
  );
}

function NeedsYouNow() {
  return (
    <Screen
      actions={
        <>
          <Button to="map" block>
            Go now
          </Button>
          <Links>
            <TextLink to="vet">Call {vet}</TextLink>
            <TextLink to="vet">Send the clips to {vet}</TextLink>
          </Links>
        </>
      }
    >
      <StatusBar time="3:19" />
      <Header small date={stamp("3:19 AM")} line1={`${cow} needs you.`} line2={`No progress since ${night.feetSeen}.`} tone="needs" sub="Labor clock at its limit" />
      <Section>
        <Meta cow={cow} status="Needs you now" needs />
        <Card title="Labor clock, heifer">
          <Big size={30}>60 min, no progress</Big>
          <Clock used={1} from={night.feetSeen} to={`${night.examineBy}, now`} toLabel="Examine now" toNeeds />
          <Note>Heifers: examine if there’s no progress in 60 min (OSU).</Note>
        </Card>
        <FrameStrip label={`Every 15 min, ${herd.drone}, zoom and infrared`} times={["2:19", "2:34", "2:49", "3:04"]} note="Feet at every check, no further progress." />
        <Body>{herd.drone} is holding 30 m back with its light pointed away. Your route is on the map.</Body>
      </Section>
    </Screen>
  );
}

function MorningReport() {
  return (
    <Screen nav="Today">
      <StatusBar time={night.report} />
      <Header date={stamp(`${night.report} AM`)} line1="One calf overnight." line2="No wake-ups." sub={`Your night report, from ${herd.drone} and the ear tags`} />
      <Section>
        <Card title="Coverage">
          <Body ink>Checked 6 of 6 times. The {night.nextLook} look was shortened by wind.</Body>
        </Card>
        <Card title={`${cow}, first calf`}>
          <div>
            <Step time={`${night.calfSeen} AM`} label="Calf seen" done />
            <Step time={night.standing} label="Standing" done />
            <Step time={night.nursing} label="Nursing, dawn check" done />
          </div>
        </Card>
        <Card title="Finish the calving record">
          <Note size={13}>Two taps. It saves itself. From last night: born {night.calfSeen} AM (first seen), dam {herd.heifer}, east creek pasture.</Note>
          <Choices label="Calf sex" options={["Heifer", "Bull"]} />
          <Choices label="Calving ease" options={["1 Unassisted", "2 Easy pull", "3 Hard pull"]} />
          <Note size={13}>Notes (optional)</Note>
        </Card>
      </Section>
    </Screen>
  );
}

/* ---------- Tab pages ---------- */

function Today() {
  return (
    <Screen nav="Today">
      <StatusBar time="9:10" />
      <Header date={stamp("9:10 AM")} line1={`Morning, ${people.absentee.name}.`} line2="One cow needs a look." tone="needs" sub={`${people.rancher.name} is out by the creek. ${herd.drone} flies again at 10 AM.`} />
      <Tabs tabs={feedTabs(3, 0, 1, 2)} />
      <Section>
        <Photo scene="pasture" caption={`${herd.drone}, 4:40 AM`} />
        <Meta cow={cow} status="FYI" />
        <Title>Heifer calf, up and nursing.</Title>
        <Button to="calf-on-the-ground">See her calf</Button>
        <List
          rows={[
            { cow: `Cow ${herd.limping}`, status: "Needs a look", title: "Limping on the left hind", sub: `Seen by ${herd.drone} at 8:52 AM. Still eating.`, when: "8:52 AM", to: "herd" },
            { cow: "North tank", status: "FYI", title: "Water is down to a third", sub: "Fills again on the noon pump cycle.", when: "7:30 AM", thumb: "water", to: "map" },
          ]}
        />
      </Section>
    </Screen>
  );
}

function Herd() {
  return (
    <Screen nav="Herd">
      <StatusBar time="9:12" />
      <Header date={stamp("9:12 AM")} line1={`${herd.head} head.`} line2="All accounted for." sub={`Counted by ${herd.drone} at 8:30 AM. ${herd.dueThisMonth} still due this month.`} />
      <Tabs tabs={[["All", herd.head], ["Due soon", herd.dueThisMonth], ["Watching", 1], ["New calves", 1]]} />
      <Section>
        <List
          rows={[
            { cow, status: "FYI", title: `Calved at ${night.calfSeen} AM`, sub: "Heifer calf, up and nursing by 4:40 AM.", when: "Today", to: "calf-on-the-ground" },
            { cow: `Cow ${herd.limping}`, status: "Needs a look", title: "Limping on the left hind", sub: `With ${vet} since 8:58 AM.`, when: "Today", to: "vet" },
            { cow: `Cow ${herd.dueSoon[0]}`, status: "FYI", title: "Due in 3 days", sub: "Second calf. Calved easy last year.", when: "Mon" },
            { cow: `Cow ${herd.dueSoon[1]}`, status: "FYI", title: "Due Tuesday", sub: "First calf. On the watch list from Sunday.", when: "Tue" },
          ]}
        />
      </Section>
    </Screen>
  );
}

function Vet() {
  return (
    <Screen nav="Vet">
      <StatusBar time="9:14" />
      <Header date={stamp("9:14 AM")} line1={`${vet} has`} line2="one open case." sub={`${people.vet.clinic}. Usually replies within the hour.`} />
      <Tabs tabs={[["Open", 1], ["Sent", 3], ["Visits", 1]]} />
      <Section>
        <List
          rows={[
            { cow: `Cow ${herd.limping}`, status: "Waiting", title: "Limp, left hind", sub: "Sent 8:58 AM with 2 photos and a gait video.", when: "8:58 AM", to: "herd" },
            { cow, status: "Read", title: "Calving report", sub: `Sent ${night.report} AM. ${vet} read it at 6:02 AM.`, when: `${night.report} AM`, to: "morning-report" },
            { cow: "Whole herd", status: "Booked", title: "Spring preg check", sub: `${vet} comes out Thursday, March 12.`, when: "Mar 12", thumb: "calendar" },
          ]}
        />
        <Button>Message {vet}</Button>
      </Section>
    </Screen>
  );
}

function Map() {
  return (
    <Screen nav="Map">
      <StatusBar time="9:16" />
      <Header date={stamp("9:16 AM")} line1="Most of the herd" line2="is in the north pasture." sub={`${herd.drone} is charging at the barn. 84 percent.`} />
      <Tabs tabs={[["Pastures", 4], ["Drone", 1], ["Water", 3]]} />
      <Section>
        <Photo scene="pasture" caption={`${herd.drone} map, 9:05 AM`} />
        <List
          rows={[
            { cow: "North pasture", status: "FYI", title: "182 head", sub: "Grazing the east slope. Tank at a third.", when: "9:05 AM", thumb: "pin" },
            { cow: "Creek bottom", status: "Needs a look", title: `46 head, with cow ${herd.limping}`, sub: "She is near the gate, moving slow.", when: "9:05 AM", thumb: "pin", to: "herd" },
            { cow: "Calving lot", status: "FYI", title: "12 head", sub: `Cow ${herd.heifer} and her calf are by the shed.`, when: "9:05 AM", thumb: "pin", to: "calf-on-the-ground" },
          ]}
        />
      </Section>
    </Screen>
  );
}

export const SCREENS: Record<Slug, () => ReactNode> = {
  "lock-1-45": Lock145,
  "watch-list": WatchList,
  "labor-clock": LaborClock,
  "calf-on-the-ground": CalfOnTheGround,
  "lock-3-19": Lock319,
  "needs-you-now": NeedsYouNow,
  "morning-report": MorningReport,
  today: Today,
  herd: Herd,
  vet: Vet,
  map: Map,
};
