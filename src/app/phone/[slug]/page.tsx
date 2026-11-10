import { notFound } from "next/navigation";
import { PhoneDevice } from "../PhoneDevice";
import { ROUTES, routeFor } from "../app/routes";

export const dynamicParams = false;

export function generateStaticParams() {
  return ROUTES.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `${routeFor(slug)?.name ?? "Screen"} · Rancher app · Lattis` };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const route = routeFor(slug);
  if (!route) notFound();
  return <PhoneDevice slug={route.slug} />;
}
