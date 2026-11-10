"use client";

import { useEffect, useState } from "react";
import { Screen } from "@/figma/Render";
import { assets, hrefFor, type ScreenData } from "@/figma/data";
import styles from "./phone.module.css";

// iPhone 17: 1206 x 2622 pixels at 3x = 402 x 874 points
export const PHONE = { width: 402, height: 874 };
const BEZEL = 12;
const DEVICE = { width: PHONE.width + BEZEL * 2, height: PHONE.height + BEZEL * 2 };
// Room kept for the caption and the space around the phone
const CHROME = 88;

/** Shrinks the whole phone to fit the window's height, so the page never scrolls. */
function useFit() {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const fit = () => {
      const byHeight = (window.innerHeight - CHROME) / DEVICE.height;
      const byWidth = (window.innerWidth - 32) / DEVICE.width;
      setScale(Math.max(0.4, Math.min(1, byHeight, byWidth)));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return scale;
}

export function PhoneDevice({ screen }: { screen: ScreenData }) {
  const scale = useFit();
  return (
    <main className={styles.stage}>
      <div className={styles.fit} style={{ width: DEVICE.width * scale, height: DEVICE.height * scale }}>
        <div className={styles.device} style={{ transform: `scale(${scale})` }}>
          <Screen tree={screen.tree} assets={assets} hrefFor={hrefFor} width={PHONE.width} height={PHONE.height} />
        </div>
      </div>
      <p className={styles.caption}>{screen.name}</p>
    </main>
  );
}
