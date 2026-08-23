/**
 * Work the archive at sumanami.co.uk does not carry, because the archive
 * stops updating around the mid-2010s and these are all later than that
 * (or, in one case, a compilation the archive never catalogued at all).
 * None of these has a lyric page — no lyric text exists in the archive to
 * source one from — so unlike ALBUMS these are not full pages, just a
 * credit: title, year, label, what kind of work it is, and where the
 * facts come from. See public/kabirsuman/sources.json for citations.
 *
 * Kept deliberately thin rather than absent: the discipline this whole
 * section runs on is stating what is sourced and flagging what isn't, not
 * silently dropping anything a reader might reasonably expect to find.
 */

export interface LaterCredit {
  bn: string;
  roman: string;
  englishTitle?: string;
  year: number;
  yearUncertain?: boolean;
  type: "film" | "live" | "compilation";
  label: string;
  role: string;
  note: string;
}

export const LATER_CREDITS: LaterCredit[] = [
  {
    bn: "থেমে যেতে যেতে",
    roman: "Theme Jete Jete",
    year: 2024,
    type: "film",
    label: "Saregama",
    role: "Composer",
    note: "From Srijit Mukherji's Tekka — the same 2024 film credited on this site's life page. One track.",
  },
  {
    bn: "আঁধার থেকে ভোর",
    roman: "Adhar Theke Bhor",
    year: 2025,
    type: "film",
    label: "Tips Music, under exclusive licence to Warner Music",
    role: "Composer",
    note: "From the film Ami Jokhon Hema Malini. One track.",
  },
  {
    bn: "লাইভ ফ্রম হিন্দুস্থান",
    roman: "Live From Hindusthan",
    year: 2021,
    type: "live",
    label: "INRECO",
    role: "Performer",
    note: "A short live release, two tracks (সারাদিন বৃষ্টি, কিছু দিন).",
  },
  {
    bn: "সূর্যকন্যা",
    roman: "Surjakanya",
    year: 1998,
    type: "film",
    label: "Saregama",
    role: "One of several singers/composers",
    note: "A multi-artist film soundtrack (the 1998 film Suryakanya) rather than a solo Suman record — likely why the archive, which only files his own albums, does not carry it.",
  },
  {
    bn: "মহাসংগ্রাম",
    roman: "Mahasanghram",
    year: 2001,
    yearUncertain: true,
    type: "film",
    label: "Echo Entertainment",
    role: "Writer, composer and singer",
    note: "Sources disagree on the release year: written and recorded around 1994 (with Indrani Sen) but the film's actual release is placed anywhere from 2001 to 2006 across the sources checked, and this site has not found one that settles it.",
  },
  {
    bn: "সেদিন চৈত্রমাস",
    roman: "Sedin Chaitramash",
    year: 1997,
    yearUncertain: true,
    type: "compilation",
    label: "Saregama",
    role: "Writer, composer and singer",
    note: "A four-track release known only from label metadata — none of its four titles match any song in this site's catalogue, so it may be a genuinely separate small release or a mistitled fragment of an album already listed. Left as its own line rather than guessed into either.",
  },
];
