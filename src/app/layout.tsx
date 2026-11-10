import type { Metadata, Viewport } from "next";
import "@fontsource-variable/roboto-flex/full.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/600.css";
import "@fontsource/roboto-mono/500.css";
import "@fontsource-variable/fraunces/full.css";
import "./globals.css";
import { OptionsProvider } from "@/components/options/OptionsProvider";
import { OptionsPanel } from "@/components/options/OptionsPanel";

export const metadata: Metadata = {
  title: "Lattis",
  description: "Cattle health, from the drone to your own vet.",
};

export const viewport: Viewport = { themeColor: "#faf9f5" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OptionsProvider>
          {children}
          <OptionsPanel />
        </OptionsProvider>
      </body>
    </html>
  );
}
