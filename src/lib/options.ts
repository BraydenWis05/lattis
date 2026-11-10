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
      key: "layout",
      label: "Today layout",
      group: "Versions",
      choices: ["A", "B", "C"],
      meaning: { A: "cards", B: "one list", C: "most urgent first, big" },
      default: "A",
    },
    {
      key: "call",
      label: "Your call, choices",
      group: "Versions",
      choices: ["A", "B"],
      meaning: { A: "cards with a note", B: "buttons" },
      default: "A",
    },
    {
      key: "count",
      label: "Cows that need you",
      group: "Data",
      choices: ["0", "1", "3", "6"],
      default: "1",
    },
    {
      key: "detail",
      label: "How much each card shows",
      group: "Data",
      choices: ["Less", "Some", "All"],
      default: "Some",
    },
    {
      key: "names",
      label: "Cow names",
      group: "Data",
      choices: ["Short", "Long"],
      default: "Short",
    },
    {
      key: "drone",
      label: "Drone check",
      group: "Data",
      choices: ["Done", "Flying", "Missed"],
      default: "Done",
    },
    {
      key: "signal",
      label: "Signal",
      group: "Data",
      choices: ["On", "Off"],
      default: "On",
    },
  ],
  ranch: [],
  vet: [],
};
