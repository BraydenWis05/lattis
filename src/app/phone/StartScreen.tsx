"use client";

import { PhoneDevice } from "./PhoneDevice";
import { screens } from "@/figma/data";
import { useOption } from "@/components/options/OptionsProvider";

// Which Figma frame (Final App Flow page) the app opens on, from the options panel
const START: Record<string, string> = {
  "1:45 AM": "649:136",
  "3:19 AM": "649:226",
  "5:30 AM": "638:242",
  Today: "659:144",
};

export function StartScreen() {
  const start = useOption("phone", "start");
  const screen = screens[START[start]] ?? screens[START["1:45 AM"]] ?? Object.values(screens)[0];
  return <PhoneDevice screen={screen} />;
}
