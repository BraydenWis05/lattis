/**
 * People and names shared across sections.
 * Source of truth: the SPEC page in Figma (User Interface file, node 357:2806).
 * Open questions that change these names: NA-002 (who uses which app), Q-013 (ranch and cow names).
 */
export const people = {
  absentee: { name: "Dale", full: "Dale Harmon" },
  rancher: { name: "Wade", full: "Wade Kessler" },
  vet: { name: "Dr. Ruiz", full: "Dr. Elena Ruiz", clinic: "Valley Large Animal" },
} as const;

/** The cows and the drone in the calving-season story (Final App Flow page). */
export const herd = {
  heifer: "088",   // first-calf heifer, calves overnight
  limping: "091",  // limp on the left hind, with the vet
  dueSoon: ["104", "117"],
  head: 240,
  dueThisMonth: 12,
  drone: "Drone 1",
} as const;

/** One night in calving season, Friday, November 6. */
export const night = {
  day: "Friday, November 6",
  watchStart: "1:45",
  droneLook: "1:52 AM",
  nextLook: "2:10 AM",
  feetSeen: "2:19",
  examineBy: "3:19",
  calfSeen: "2:58",
  standing: "3:40 AM",
  nursing: "4:55 AM",
  report: "5:30",
} as const;
