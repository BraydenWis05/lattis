"use client";

import { PhoneDevice } from "./PhoneDevice";
import { useOption } from "@/components/options/OptionsProvider";
import type { Slug } from "./app/routes";

// Which screen the app opens on, from the options panel
const START: Record<string, Slug> = {
  "1:45 AM": "lock-1-45",
  "3:19 AM": "lock-3-19",
  "5:30 AM": "morning-report",
  Today: "today",
};

export function StartScreen() {
  const start = useOption("phone", "start");
  return <PhoneDevice slug={START[start] ?? "lock-1-45"} />;
}
