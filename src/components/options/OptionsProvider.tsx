"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { options, type SectionId } from "@/lib/options";

type Values = Record<string, string>; // "phone.layout" -> "B"

const Ctx = createContext<{
  values: Values;
  set: (section: SectionId, key: string, value: string) => void;
  reset: (section: SectionId) => void;
} | null>(null);

const id = (s: string, k: string) => `${s}.${k}`;

function defaultOf(section: SectionId, key: string) {
  return options[section].find((o) => o.key === key)?.default ?? "";
}

/** Holds the chosen options and keeps them in the page link, so a link reproduces the view. */
export function OptionsProvider({ children }: { children: React.ReactNode }) {
  const [values, setValues] = useState<Values>({});
  const pathname = usePathname();

  // Read choices from the link on first load.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const v: Values = {};
    params.forEach((value, k) => {
      if (k.includes(".")) v[k] = value;
    });
    setValues(v);
  }, []);

  // Write choices back to the link, including after moving between screens.
  useEffect(() => {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(values)) {
      const [s, key] = k.split(".") as [SectionId, string];
      if (options[s] && v !== defaultOf(s, key)) params.set(k, v);
    }
    const q = params.toString();
    window.history.replaceState(null, "", q ? `${pathname}?${q}` : pathname);
  }, [values, pathname]);

  const set = useCallback((section: SectionId, key: string, value: string) => {
    setValues((v) => ({ ...v, [id(section, key)]: value }));
  }, []);

  const reset = useCallback((section: SectionId) => {
    setValues((v) => Object.fromEntries(Object.entries(v).filter(([k]) => !k.startsWith(`${section}.`))));
  }, []);

  return <Ctx.Provider value={{ values, set, reset }}>{children}</Ctx.Provider>;
}

export function useOptions() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useOptions must be used inside OptionsProvider");
  return c;
}

/** Read one option in a page: `const layout = useOption("phone", "layout")`. */
export function useOption(section: SectionId, key: string) {
  const { values } = useOptions();
  return values[id(section, key)] ?? defaultOf(section, key);
}
