import { ArticleIcon, CompassIcon, MicIcon, ReelIcon, SearchIcon } from "../../components/icons";
import { PAGE_PATH } from "../seo";

/**
 * The section's tab bar. Kept separate from catalogue.ts the way
 * tarakeswar/nav.ts is kept separate from core.ts: icons are React
 * components and this file is only ever reached from the client-rendered
 * layout, never from the edge renderer.
 */
export interface KabirSumanNavItem {
  id: "hub" | "life" | "works" | "words" | "sources";
  label: string;
  path: string;
  icon: typeof CompassIcon;
}

export const KABIRSUMAN_NAV: KabirSumanNavItem[] = [
  { id: "hub", label: "Overview", path: PAGE_PATH.kabirsuman, icon: CompassIcon },
  { id: "life", label: "A Life", path: PAGE_PATH.kabirsumanLife, icon: MicIcon },
  { id: "works", label: "The Discography", path: PAGE_PATH.kabirsumanWorks, icon: ReelIcon },
  { id: "words", label: "The Words He Used", path: PAGE_PATH.kabirsumanWords, icon: SearchIcon },
  { id: "sources", label: "Sources", path: PAGE_PATH.kabirsumanSources, icon: ArticleIcon },
];
