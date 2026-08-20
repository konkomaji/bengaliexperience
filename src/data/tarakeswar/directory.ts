/**
 * Eat, stay and essentials: real, checkable listings only.
 *
 * Every entry here was found on a source that is not this site: an official
 * bank or pharmacy-chain page, a listing on Zomato or Justdial, a hospital
 * directory, an official West Bengal Tourism page. No name in this file was
 * invented to fill out a category. Where a whole category (tea stalls, most
 * sweet shops) has no real online listing, that is said plainly in the
 * `note` field instead of being padded with made-up entries, because a
 * wrong local recommendation is worse than an honest gap.
 *
 * `verified` is a soft label, not a legal claim: it means the name and rough
 * location were corroborated on at least one real, independent source at
 * the time this was written, not that someone has walked in and eaten there.
 * Confirm anything time-critical, opening hours especially, before relying
 * on it.
 */

export type DirectoryCategory =
  | "eat"
  | "sweets"
  | "stay"
  | "pharmacy"
  | "hospital"
  | "bank";

export interface DirectoryEntry {
  name: string;
  category: DirectoryCategory;
  /** rough location: a road, a landmark, "near X" */
  area: string;
  note?: string;
}

/**
 * A Google Maps search deep link for one entry: tapping the card takes a
 * visitor straight to that place on Maps, ratings and reviews and all,
 * rather than to a review written here pretending to be one. `api=1` is
 * Google's documented URL scheme (maps.google.com/search) rather than a
 * scraped or guessed link shape.
 */
export function directoryMapsUrl(entry: DirectoryEntry): string {
  const query = `${entry.name}, ${entry.area}, Tarakeswar, West Bengal`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export const DIRECTORY_ENTRIES: DirectoryEntry[] = [
  // ── Eat ──────────────────────────────────────────────────────────────
  {
    name: "Amantran (A2)",
    category: "eat",
    area: "Vivekananda Palli, opposite the bus stand gate",
    note: "The most reviewed sit-down restaurant in town, a safe first stop for a proper meal.",
  },
  { name: "Tarakeswar Coffee House", category: "eat", area: "Tarakeswar Locality" },
  { name: "Jam Jam Cafe and Restaurant", category: "eat", area: "Tarakeswar Locality" },
  { name: "Dawat", category: "eat", area: "Tarakeswar Locality" },
  { name: "Happy Hour", category: "eat", area: "Stall 14, Tarakeswar Heights, near the bus stand" },

  // ── Sweets ───────────────────────────────────────────────────────────
  {
    name: "Mio Amore",
    category: "sweets",
    area: "Tarakeswar town",
    note: "A bakery chain outlet; useful for a quick cake or snack, not a stand-in for the local mishti shops.",
  },

  // ── Stay ─────────────────────────────────────────────────────────────
  {
    name: "Nataraj Tourism Property",
    category: "stay",
    area: "Guest House Road",
    note: "The former West Bengal Tourism (WBTDC) lodge, run by the state tourism department. Book through the official WBTDCL site and confirm it is currently open before you travel.",
  },
  {
    name: "Tarakeswar Municipality Guest House",
    category: "stay",
    area: "Guest House Road, Bhanjipur",
    note: "AC and non-AC rooms, with a restaurant on site.",
  },
  {
    name: "Tarapada Bhavan",
    category: "stay",
    area: "About 1 km from the bus stand",
    note: "AC and non-AC twin rooms, with meals available.",
  },
  {
    name: "Sri Chaitanya Saraswat Math",
    category: "stay",
    area: "Bhanjipura School Road, Village Bhanjipur",
    note: "A Gaudiya Vaishnava ashram roughly 2 km from the bus stand, with pilgrim rooms rather than hotel-style ones.",
  },

  // ── Pharmacy ─────────────────────────────────────────────────────────
  { name: "Apollo Pharmacy, Chaulpatty", category: "pharmacy", area: "Chaulpatty" },
  { name: "Apollo Pharmacy, Post Office Road", category: "pharmacy", area: "Post Office Road, near Union Bank of India" },
  { name: "DAS Medical Stores", category: "pharmacy", area: "Tarakeswar town" },
  { name: "New Tarakeswar Pharmacy", category: "pharmacy", area: "Tarakeswar, Hooghly" },

  // ── Hospital / clinic ────────────────────────────────────────────────
  {
    name: "Tarakeswar Rural Hospital",
    category: "hospital",
    area: "Loknath Temple Road",
    note: "Government hospital; the first stop for anything urgent.",
  },
  {
    name: "Care & Cure Nursing Home",
    category: "hospital",
    area: "Padmapukur, Station Road",
    note: "Open 24 hours.",
  },
  { name: "Arogya Nursing Home", category: "hospital", area: "Champadanga" },
  {
    name: "Tarakeswar Apollo Multispeciality Hospital",
    category: "hospital",
    area: "Tarakeswar",
    note: "The largest private hospital in town, covering orthopaedics, gynaecology, general surgery and critical care.",
  },

  // ── Bank / ATM ───────────────────────────────────────────────────────
  { name: "State Bank of India, Tarakeswar Branch", category: "bank", area: "Choul Patty" },
  { name: "Axis Bank, Tarakeswar", category: "bank", area: "Rane Apartment, Joykrishna Bazar" },
  { name: "Bandhan Bank, Tarakeswar Branch", category: "bank", area: "Joy Krishna Bazar" },
  { name: "HDFC Bank, Tarakeswar Branch", category: "bank", area: "Tarakeswar" },
  { name: "Bank of Baroda, Tarakeswar Branch", category: "bank", area: "70 Chaul Patty, Mandir Road" },
  { name: "Bank of India, Tarakeswar Branch", category: "bank", area: "Tarakeswar" },
];

/**
 * Categories where a real search turned up nothing worth publishing: no
 * point pretending otherwise. Shown as an honest note on the page instead
 * of a padded-out list.
 */
export const DIRECTORY_GAPS: { category: string; note: string }[] = [
  {
    category: "Tea stalls",
    note: "Tarakeswar runs on roadside tea stalls the way most Bengal pilgrim towns do, and almost none of them have any online listing to point to. The reliable ones cluster around the station approach and the temple's main gate; ask any local for \"bhalo cha\" (good tea) nearby rather than looking for a name.",
  },
  {
    category: "Sweet shops",
    note: "Directory listings suggest a few dozen sweet shops in town, mishti doi, sandesh and rosogolla being the usual order, but most trade under names too local to verify from outside. This list will grow as specific shops are confirmed.",
  },
];
