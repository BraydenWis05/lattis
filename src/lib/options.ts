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
      key: "where",
      label: "Where the rancher is",
      group: "Versions",
      choices: ["Away", "In the field"],
      default: "Away",
    },
    {
      key: "state",
      label: "What's happening",
      group: "Data",
      choices: ["Normal", "Drone flying", "Pass didn’t finish", "Tom, read-only", "Busy week"],
      default: "Normal",
    },
  ],
  ranch: [],
  vet: [],
};
