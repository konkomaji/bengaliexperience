/**
 * Bengali → Roman transliteration, tuned for song and album titles.
 *
 * Not ISO 15919. The target is the spelling a Bengali reader would actually
 * type into a search box — "Tomake Chai", not "Tōmākē Cā'i" — because the
 * Roman line on every song exists to be recognised and searched, not to be
 * philologically reversible. Two rules do most of the work:
 *
 *   1. **Inherent vowel.** Every consonant carries an unwritten vowel unless a
 *      matra, a hasanta, a following vowel letter or the end of the word takes
 *      it away. Getting this wrong in either direction is the single biggest
 *      source of output that looks nothing like the name people know.
 *   2. **Written "o".** That inherent vowel is romanised "o" (Tomake, not
 *      Tômake): popular romanisation settled there and so did search.
 *
 * What it does NOT attempt is Bengali schwa deletion, which needs a lexicon —
 * পেটকাটি is Petkati to a reader and Petokati to this function. So the long
 * tail of ~300 songs is romanised here and every album title and landmark song
 * carries a hand-written Roman name in src/data/kabirsuman/ that overrides it.
 * Machine-fill the tail, hand-set the ones anybody will actually search for.
 *
 * Every Bengali character below is written as an escape on purpose. Three of
 * them — ড় ঢ় য় — are Unicode *composition exclusions*, so NFC will not fold
 * base+nukta into the single codepoint and text arrives from the web in both
 * forms. A literal in the source silently matches only one of them, which is a
 * bug that shows up as raw Bengali letters in the middle of a Roman word.
 */

// The three nukta letters, and the pairs that must fold into them.
const RRA = "ড়"; // ড়
const RHA = "ঢ়"; // ঢ়
const YYA = "য়"; // য়
const NUKTA = "়";
const DDA = "ড"; // ড
const DDHA = "ঢ"; // ঢ
const YA = "য"; // য

/** consonants → their Roman base, without the inherent vowel */
const CONSONANT = {
  "ক": "k", "খ": "kh", "গ": "g", "ঘ": "gh", "ঙ": "ng",
  "চ": "ch", "ছ": "chh", "জ": "j", "ঝ": "jh", "ঞ": "n",
  "ট": "t", "ঠ": "th", [DDA]: "d", [DDHA]: "dh", "ণ": "n",
  "ত": "t", "থ": "th", "দ": "d", "ধ": "dh", "ন": "n",
  "প": "p", "ফ": "ph", "ব": "b", "ভ": "bh", "ম": "m",
  [YA]: "j", "র": "r", "ল": "l",
  "শ": "sh", "ষ": "sh", "স": "s", "হ": "h",
  [RRA]: "r", [RHA]: "rh", [YYA]: "y",
  "ৎ": "t", // ৎ khanda ta
};

/** independent vowels (word-initial, or standing alone) */
const VOWEL = {
  "অ": "o", "আ": "a", "ই": "i", "ঈ": "i",
  "উ": "u", "ঊ": "u", "ঋ": "ri",
  "এ": "e", "ঐ": "oi", "ও": "o", "ঔ": "ou",
};

/** dependent vowel signs (matra), attached to the preceding consonant */
const AA = "া";
const E = "ে";
const AU_LENGTH = "ৗ";
const MATRA = {
  [AA]: "a",
  "ি": "i", "ী": "i",
  "ু": "u", "ূ": "u", "ৃ": "ri",
  [E]: "e", "ৈ": "oi",
  "ো": "o", "ৌ": "ou",
};

const VIRAMA = "্";
const ANUSVARA = "ং";
const CANDRA = "ঁ";
const VISARGA = "ঃ";

const DIGIT = {
  "০": "0", "১": "1", "২": "2", "৩": "3", "৪": "4",
  "৫": "5", "৬": "6", "৭": "7", "৮": "8", "৯": "9",
};

const isConsonant = (ch) => Object.hasOwn(CONSONANT, ch);
const isVowelLetter = (ch) => Object.hasOwn(VOWEL, ch);

/**
 * Fold every decomposed form to the single codepoint the tables are keyed on.
 * Exported because it is not only a transliteration concern: any code that
 * compares a Bengali literal in this repo against Bengali text fetched from
 * the web has to fold both sides first, or the comparison fails on characters
 * that look identical on screen.
 *
 * Folds:
 * the three nukta letters, plus ো and ৌ, which also arrive split into ে + া
 * and ে + ৗ depending on the keyboard that typed them.
 */
export function normalise(s) {
  return s
    .replace(new RegExp(DDA + NUKTA, "g"), RRA)
    .replace(new RegExp(DDHA + NUKTA, "g"), RHA)
    .replace(new RegExp(YA + NUKTA, "g"), YYA)
    .replace(new RegExp(E + AA, "g"), "ো")
    .replace(new RegExp(E + AU_LENGTH, "g"), "ৌ");
}

/**
 * One orthographic word. Consonants accumulate their inherent vowel unless the
 * next character cancels it: a matra replaces it, a virama deletes it, a vowel
 * letter supplies its own, and the end of the word deletes it — except after a
 * single consonant, where dropping it would leave a bare "k" for ক.
 */
function romaniseWord(word) {
  const out = [];
  let consonantCount = 0;

  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    const next = word[i + 1];

    if (Object.hasOwn(DIGIT, ch)) { out.push(DIGIT[ch]); continue; }
    if (isVowelLetter(ch)) { out.push(VOWEL[ch]); continue; }

    if (isConsonant(ch)) {
      consonantCount++;
      out.push(CONSONANT[ch]);

      if (next === VIRAMA) { i++; continue; } // conjunct: no vowel here
      if (Object.hasOwn(MATRA, next)) { out.push(MATRA[next]); i++; continue; }
      if (next === ANUSVARA) { out.push("ong"); i++; continue; }

      // A following vowel letter supplies the syllable's vowel itself, so the
      // inherent one would double it: গানওলা is Ganola, never Ganoola.
      if (isVowelLetter(next)) continue;

      const atEnd = i === word.length - 1;
      if (!atEnd || consonantCount === 1) out.push("o");
      continue;
    }

    if (ch === ANUSVARA) { out.push("ng"); continue; }
    // Candrabindu nasalises the syllable it sits on: চাঁদ is chand, not chad.
    if (ch === CANDRA) { out.push("n"); continue; }
    if (ch === VISARGA || ch === VIRAMA || ch === NUKTA) continue;

    out.push(ch); // punctuation, spaces, Latin text
  }

  return out.join("");
}

/** Title Case, leaving already-Latin words alone */
const titleCase = (s) => s.replace(/(^|[\s(\-—/])([a-z])/g, (_, p, c) => p + c.toUpperCase());

const BENGALI_BLOCK = /[ঀ-৿]/;

/**
 * Transliterate a Bengali string. Words are split first because the
 * inherent-vowel rule is word-final, not string-final.
 */
export function toRoman(bengali, { titleCase: tc = true } = {}) {
  const romanised = normalise(bengali)
    .split(/(\s+|[।,;:!?'"()\-—/])/)
    .map((part) => (BENGALI_BLOCK.test(part) ? romaniseWord(part) : part))
    .join("")
    .replace(/।/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return tc ? titleCase(romanised) : romanised;
}

/** URL slug from a Bengali string: romanised, lowercased, hyphenated. */
export function toSlug(bengali) {
  return toRoman(bengali, { titleCase: false })
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}
