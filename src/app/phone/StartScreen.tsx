"use client";

import { PhoneDevice } from "./PhoneDevice";
import { screens } from "@/figma/data";
import { useOption } from "@/components/options/OptionsProvider";

// Which Figma frame the app opens on, from the options panel
const START: Record<string, string> = {
  "Away|Normal": "343:2372",
  "In the field|Normal": "359:2557",
  "Away|Drone flying": "404:2040",
  "Away|Pass didn’t finish": "404:2135",
  "In the field|Tom, read-only": "404:2232",
  "Away|Busy week": "404:2322",
};

export function StartScreen() {
  const where = useOption("phone", "where");
  const state = useOption("phone", "state");
  const id =
    START[`${where}|${state}`] ??
    Object.entries(START).find(([k]) => k.endsWith(`|${state}`))?.[1] ??
    START[`${where}|Normal`];
  const screen = screens[id] ?? screens["343:2372"] ?? Object.values(screens)[0];
  return <PhoneDevice screen={screen} />;
}
