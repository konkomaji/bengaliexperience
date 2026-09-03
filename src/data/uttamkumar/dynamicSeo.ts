import type { Film } from "./films";

/** Title/description for one film's dynamic page — the same role
 *  kabirsuman/dynamicSeo.ts plays for albums and songs. */
export function filmTitle(f: Film): string {
  return `${f.title} (${f.year}) — Uttam Kumar`;
}

export function filmDescription(f: Film): string {
  if (f.detail) return f.detail.synopsis;
  const role = f.role ? ` as ${f.role}` : "";
  return `${f.title} (${f.year}), one of Uttam Kumar's credited films${role}.${f.note ? ` ${f.note}.` : ""}`;
}
