import { ArticleIcon, CalendarIcon, CompassIcon, HeartIcon, ReelIcon, StampIcon, StarIcon } from "../../components/icons";
import { PAGE_PATH } from "../seo";

export interface UttamKumarNavItem {
  id: "hub" | "life" | "films" | "suchitra" | "awards" | "books" | "centenary" | "words" | "sources";
  label: string;
  path: string;
  icon: typeof CompassIcon;
}

export const UTTAMKUMAR_NAV: UttamKumarNavItem[] = [
  { id: "hub", label: "Overview", path: PAGE_PATH.uttamkumar, icon: CompassIcon },
  { id: "life", label: "A Life", path: PAGE_PATH.uttamkumarLife, icon: StarIcon },
  { id: "films", label: "Filmography", path: PAGE_PATH.uttamkumarFilms, icon: ReelIcon },
  { id: "suchitra", label: "Uttam & Suchitra", path: PAGE_PATH.uttamkumarSuchitra, icon: HeartIcon },
  { id: "awards", label: "Awards", path: PAGE_PATH.uttamkumarAwards, icon: StampIcon },
  { id: "books", label: "The Reading Room", path: PAGE_PATH.uttamkumarBooks, icon: ArticleIcon },
  { id: "centenary", label: "Centenary 2026", path: PAGE_PATH.uttamkumarCentenary, icon: CalendarIcon },
  { id: "words", label: "Voices", path: PAGE_PATH.uttamkumarWords, icon: ArticleIcon },
  { id: "sources", label: "Sources", path: PAGE_PATH.uttamkumarSources, icon: ArticleIcon },
];
