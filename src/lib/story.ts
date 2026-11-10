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
