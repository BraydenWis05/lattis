import data from "./screens.json";
import type { Assets, FNode } from "./Render";

export type ScreenData = { name: string; section: string; slug: string; tree: FNode };

export const screens = data.screens as unknown as Record<string, ScreenData>;
export const assets: Assets = { images: data.images as Record<string, string>, svgs: data.svgs as Record<string, string> };
export const synced = data.synced as string;

export const bySlug = (slug: string) => Object.values(screens).find((s) => s.slug === slug);

/** Link target for a Figma frame id, or null when that frame isn't part of the app. */
export const hrefFor = (id: string) => (screens[id] ? `/phone/${screens[id].slug}` : null);

/** Every screen, grouped by its Figma section, for the screen list in the options panel. */
export const screenList = Object.entries(screens).map(([id, s]) => ({ id, name: s.name, section: s.section, slug: s.slug }));
