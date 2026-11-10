/**
 * The sample story every section shares, so the phone, the ranch software
 * and the vet website always show the same cows, people and times.
 * Right now only the phone uses it. Add your section's data here.
 *
 * Source of truth: the SPEC page in Figma (User Interface file, node 357:2806).
 * Open questions that change these names:
 *   - NA-002: who uses which app, and whether Wade's partner is Carrie or Jenny.
 *   - Q-013: ranch name (Kessler or Hall) and cow (214 or 309).
 * Change a name here once and every section picks it up.
 */

export type Status = "Urgent" | "Needs a look" | "FYI";

export const people = {
  absentee: { name: "Dale", full: "Dale Harmon", role: "Absentee rancher" },
  rancher: { name: "Wade", full: "Wade Kessler", role: "Rancher, in the field" },
  vet: {
    name: "Dr. Ruiz",
    full: "Dr. Elena Ruiz",
    clinic: "Valley Large Animal",
    initials: "ER",
  },
} as const;

export const ranches = {
  dale: { name: "Dale's place", head: 30, acres: 300 },
} as const;

/** Dale's cow, used in the phone app. */
export const cow14 = {
  id: "14",
  label: "#14",
  breed: "Hereford",
  age: "6 years old",
  status: "Needs a look" as Status,
  headline: "Away since Tuesday.",
  seen: "Drone photo, today 11:40 AM",
  where: "West side, in the cedar",
  facts: [
    { text: "Away from the herd 2 days, since Tuesday.", key: "2 days" },
    { text: "Walking slower than the others.", key: "slower" },
    { text: "Her calf is staying with the herd.", key: "staying with the herd" },
  ],
  cantTell: "The drone can’t take her temperature or see her feet.",
  choices: [
    { title: "Drive out and check on her", note: "About an hour. We’ll show you where she is." },
    { title: "Wait for the 4:00 PM drone check", note: "We’ll tell you either way." },
    { title: "Ask Dr. Ruiz now", note: "She sees the drone photo after you say OK." },
  ],
};

/**
 * Dale's herd, for the options panel's "Cows that need you" toggle.
 * The order here is the order they get added (1 shows #14, 3 adds #7 and #22).
 * `long` is a realistic long name, to check that names wrap instead of cutting off.
 */
export type HerdCow = {
  id: string;
  label: string;
  long: string;
  status: Status;
  fact: string;
  where: string;
  seen: string;
};

export const daleNeedsYou: HerdCow[] = [
  { id: "14", label: "#14", long: "#14, Big Red’s daughter", status: "Needs a look", fact: "Away from the herd 2 days, since Tuesday.", where: "West side, in the cedar", seen: "11:40 AM" },
  { id: "7", label: "#7", long: "#7, the brindle cow from the Halvorsen sale", status: "Urgent", fact: "Lying down since 10:50 AM and hasn’t got up.", where: "North water lot", seen: "11:38 AM" },
  { id: "22", label: "#22", long: "#22, Clementine, first-calf heifer", status: "Needs a look", fact: "Off alone and due Thursday.", where: "East side, by the creek", seen: "11:41 AM" },
  { id: "3", label: "#3", long: "#3, Grandma’s old Angus cross", status: "FYI", fact: "A little thinner than last month.", where: "Front pasture", seen: "11:36 AM" },
  { id: "19", label: "#19", long: "#19, the bald-faced cow with one horn", status: "FYI", fact: "More flies on her face than the others.", where: "West side", seen: "11:39 AM" },
  { id: "26", label: "#26", long: "#26, Dolly, the bottle calf from 2021", status: "Needs a look", fact: "Slower than the herd this morning.", where: "Front pasture, by the gate", seen: "11:37 AM" },
];

export const statusOrder: Record<Status, number> = { Urgent: 0, "Needs a look": 1, FYI: 2 };
