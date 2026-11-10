/** Path to a file in /public that also works on GitHub Pages (under /lattis). */
export const asset = (path: string) => `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
