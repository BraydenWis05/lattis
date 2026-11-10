import { notFound } from "next/navigation";
import { PhoneDevice } from "../PhoneDevice";
import { bySlug, screens } from "@/figma/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.values(screens).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `${bySlug(slug)?.name ?? "Screen"} · Rancher app · Lattis` };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const screen = bySlug(slug);
  if (!screen) notFound();
  return <PhoneDevice screen={screen} />;
}
