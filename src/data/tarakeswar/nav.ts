import { ArticleIcon, CompassIcon, FoodIcon, TempleIcon, TrainIcon } from "../../components/icons";
import { PAGE_PATH } from "../seo";

/**
 * The section's tab bar, kept separate from core.ts (identity and facts):
 * core.ts is reachable from functions/_middleware.ts through
 * src/data/tarakeswar/jsonld.ts, and that tsconfig (tsconfig.functions.json)
 * has no `jsx` option set, so it cannot resolve a component import like the
 * icons here. Nothing outside the client-rendered layout needs a nav item's
 * icon, so this file is the one that imports them, and it is only ever
 * reached from src/components/tarakeswar/TarakeswarLayout.tsx.
 */
export interface TarakeswarNavItem {
  id: "hub" | "temple" | "food" | "reach" | "blog";
  label: string;
  short: string;
  path: string;
  icon: typeof TempleIcon;
}

export const TARAKESWAR_NAV: TarakeswarNavItem[] = [
  { id: "hub", label: "Overview", short: "Guide", path: PAGE_PATH.tarakeswar, icon: CompassIcon },
  { id: "temple", label: "Temple & Mela", short: "Temple", path: PAGE_PATH.tarakeswarTemple, icon: TempleIcon },
  { id: "food", label: "Eat & Stay", short: "Eat & Stay", path: PAGE_PATH.tarakeswarFood, icon: FoodIcon },
  { id: "reach", label: "How to Reach", short: "Reach", path: PAGE_PATH.tarakeswarReach, icon: TrainIcon },
  { id: "blog", label: "Blog", short: "Blog", path: PAGE_PATH.tarakeswarBlog, icon: ArticleIcon },
];
