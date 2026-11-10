"use client";

import { Screen } from "@/figma/Render";
import { assets, hrefFor, type ScreenData } from "@/figma/data";
import styles from "./phone.module.css";

// iPhone 17: 1206 x 2622 pixels at 3x = 402 x 874 points
export const PHONE = { width: 402, height: 874 };

export function PhoneDevice({ screen }: { screen: ScreenData }) {
  return (
    <main className={styles.stage}>
      <div className={styles.device}>
        <Screen tree={screen.tree} assets={assets} hrefFor={hrefFor} width={PHONE.width} height={PHONE.height} />
      </div>
      <p className={styles.caption}>{screen.name}</p>
    </main>
  );
}
