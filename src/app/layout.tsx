import type { Metadata, Viewport } from "next";
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz@9..144&family=Roboto+Flex:opsz,wght@8..144,400;8..144,600&family=Roboto+Mono:wght@500;600&family=Roboto:wght@500;600&display=swap"
        />
      </head>
      <body>
        <OptionsProvider>
          {children}
          <OptionsPanel />
        </OptionsProvider>
      </body>
    </html>
  );
}
