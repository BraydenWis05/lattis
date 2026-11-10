/**
 * Everything the options panel (bottom left) can change, per section.
 *
 * To add an option to your section:
 *   1. Add it to your section's list below.
 *   2. In your page, read it with `useOption("phone", "layout")`.
 *
 * `choices` are what the toggle shows. `meaning` (optional) explains a letter
 * choice in the panel, so "B" reads as "B: list".
 */

export type Option = {
  key: string;
  label: string;
  group: "Versions" | "Data";
  choices: string[];
  meaning?: Record<string, string>;
  default: string;
};

export type SectionId = "phone" | "ranch" | "vet";

export const sections: { id: SectionId; name: string; href: string }[] = [
  { id: "phone", name: "App", href: "/phone" },
  { id: "ranch", name: "Software", href: "/ranch" },
  { id: "vet", name: "Vet", href: "/vet" },
];

export const options: Record<SectionId, Option[]> = {
  phone: [
    {
      key: "start",
      label: "Where the app opens",
      group: "Versions",
      choices: ["1:45 AM", "3:19 AM", "5:30 AM", "Today"],
      meaning: {
        "1:45 AM": "lock screen, a quiet watch",
        "3:19 AM": "lock screen, the one alert",
        "5:30 AM": "the morning report",
        Today: "the Today tab, 9:10 AM",
      },
      default: "1:45 AM",
    },
  ],
  ranch: [],
  vet: [],
};
