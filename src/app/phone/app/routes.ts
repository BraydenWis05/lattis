/** Every coded screen in the rancher app, in the order of the Final App Flow page in Figma. */
export const ROUTES = [
  { slug: "lock-1-45", name: "1:45 AM, quiet (lock screen)", group: "A night in calving season" },
  { slug: "watch-list", name: "On the watch list", group: "A night in calving season" },
  { slug: "labor-clock", name: "Labor clock", group: "A night in calving season" },
  { slug: "calf-on-the-ground", name: "2:58 AM, calf on the ground", group: "A night in calving season" },
  { slug: "lock-3-19", name: "3:19 AM, needs you now (lock screen)", group: "A night in calving season" },
  { slug: "needs-you-now", name: "3:19 AM, needs you now", group: "A night in calving season" },
  { slug: "morning-report", name: "5:30 AM, morning report", group: "A night in calving season" },
  { slug: "today", name: "Today", group: "Tab pages" },
  { slug: "herd", name: "Herd", group: "Tab pages" },
  { slug: "vet", name: "Vet", group: "Tab pages" },
  { slug: "map", name: "Map", group: "Tab pages" },
] as const;

export type Slug = (typeof ROUTES)[number]["slug"];
export const href = (slug: Slug) => `/phone/${slug}`;
export const routeFor = (slug: string) => ROUTES.find((r) => r.slug === slug);
