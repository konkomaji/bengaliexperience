/**
 * A concordance of the lyrics: every content word, and every song it appears in.
 *
 * This is the one thing here that exists nowhere else. There are Kabir Suman
 * lyric sites, and there are Kabir Suman discographies, but nothing that lets
 * you ask which songs contain মিছিল, or watch গান turn up in 115 of the 317
 * songs he wrote — a songwriter whose most common noun is "song". The archive
 * hands over 40,000-odd words of Bengali; turning that into an index is a
 * hundred lines of work and it answers questions no discography can.
 *
 * Two decisions carry it:
 *
 * **Stopwords are listed, not inferred.** Frequency alone cannot separate a
 * function word from a theme, and Suman's most-repeated content words (গান,
 * মানুষ, শহর) sit right among the pronouns. So the list below is written out
 * — pronouns, postpositions, copulas, the ordinary connective tissue of
 * Bengali — and everything else is treated as meaning. It is deliberately
 * conservative: a word left in is a slightly noisy index, a word wrongly cut
 * is a theme that silently vanishes.
 *
 * **No stemming.** Bengali inflects heavily and আমার / আমি / আমাকে are three
 * entries here rather than one lemma. Stemming Bengali properly needs a
 * morphological analyser; doing it with suffix-stripping heuristics would
 * merge words that are not the same word and quietly corrupt the counts. An
 * honest index of surface forms beats a confident index of wrong lemmas, and
 * the search UI can bridge the gap by matching prefixes.
 */

/**
 * Bengali function words: pronouns, determiners, postpositions, copulas,
 * conjunctions, particles, and the handful of extremely common verbs that
 * carry no theme on their own. Kept explicit so anyone can argue with it.
 */
export const STOPWORDS = new Set([
  // pronouns and their case forms
  "আমি", "আমার", "আমাকে", "আমায়", "আমরা", "আমাদের", "আমাদেরকে",
  "তুমি", "তোমার", "তোমাকে", "তোমায়", "তোমরা", "তোমাদের",
  "তুই", "তোর", "তোকে", "তোরা", "তোদের",
  "সে", "তার", "তাকে", "তায়", "তারা", "তাদের", "তাহার", "তিনি", "তাঁর", "তাঁকে", "তাঁরা", "তাঁদের",
  "ও", "ওর", "ওকে", "ওরা", "ওদের", "এ", "এর", "একে", "এরা", "এদের",
  "যে", "যার", "যাকে", "যারা", "যাদের", "যা", "যাহা",
  "কে", "কার", "কাকে", "কারা", "কি", "কী", "কিসে", "কেন", "কোথায়", "কখন", "কেমন", "কোন", "কোনো", "কোনও",
  "নিজে", "নিজের", "নিজেই",
  // determiners, quantifiers, deixis
  "এই", "সেই", "ওই", "ঐ", "এক", "একটা", "একটি", "একই", "সব", "সবাই", "সবই", "সমস্ত", "প্রতি",
  "কিছু", "কেউ", "কোনোদিন", "অনেক", "বেশ", "খুব", "আরও", "আরো", "ততো", "তত", "যত", "কত", "এত", "এতো",
  "দু", "দুই", "দুটো", "দুটি", "তিন", "আর",
  // postpositions and relators
  "থেকে", "হতে", "দিয়ে", "নিয়ে", "করে", "জন্য", "জন্যে", "কাছে", "মধ্যে", "ভিতর", "ভেতর", "উপর", "ওপর",
  "নিচে", "পরে", "আগে", "সঙ্গে", "সাথে", "মতো", "মত", "মতন", "চেয়ে", "ছাড়া", "ছাড়াই", "বিনা",
  "পর্যন্ত", "দিকে", "ধরে", "হয়ে", "বলে", "মাঝে", "প্রতিটি",
  // copulas, auxiliaries and the commonest verbs
  "আছে", "আছি", "আছো", "আছেন", "ছিল", "ছিলে", "ছিলাম", "ছিলেন", "নেই", "নই", "নয়", "না", "নাই",
  "হয়", "হবে", "হল", "হলো", "হয়েছে", "হচ্ছে", "হোক", "হই", "হও", "হয়ে",
  "করি", "করো", "করা", "করব", "করবে", "করছি", "করেছে", "কর",
  "যায়", "যাবে", "যাই", "গেল", "গেছে", "যাও", "যাচ্ছে", "চলে", "আসে", "এসে", "এল", "এসেছে",
  "দাও", "দিল", "দেয়", "দিতে", "নাও", "নিল", "পাই", "পায়", "পেয়ে",
  "থাকে", "থাকি", "রাখো", "বল", "বলো", "বলি",
  // conjunctions, particles, interjections
  "এবং", "ও", "কিন্তু", "তবে", "তবু", "তাই", "যদি", "যেন", "যেমন", "তেমন", "অথবা", "কিংবা", "নাকি",
  "তো", "তোহ", "ই", "ও", "হ্যাঁ", "হ্যা", "শুধু", "মাত্র", "একদম", "বরং", "যদিও", "কারণ", "কেননা",
  "আবার", "তখন", "এখন", "যখন", "সেখানে", "এখানে", "ওখানে", "কোথাও", "সব্বাই",
  "রে", "গো", "হে", "ওগো", "আহা", "আরে", "না না",
]);

/** split a Bengali line into word forms, discarding punctuation and Latin text */
export function words(line) {
  return line
    .split(/[^ঀ-৿]+/)
    .map((w) => w.replace(/^[ঁ-ঃ়]+|[়]+$/g, ""))
    .filter((w) => w.length >= 2);
}

const isContentWord = (w) => !STOPWORDS.has(w) && w.length >= 2;

/**
 * Build the index.
 *
 * @param songs  [{ slug, year, stanzas: string[][] }]
 * @param minSongs  a word must appear in at least this many songs to be
 *   indexed. Two is the floor worth shipping: a word used in exactly one song
 *   is a fact about that song, already visible on its own page, and 8,000 of
 *   them would be most of the file.
 */
export function buildConcordance(songs, { minSongs = 2 } = {}) {
  /** word -> Map<songSlug, count within that song> */
  const index = new Map();
  /** word -> Map<decade, count> */
  const byDecade = new Map();
  let tokens = 0;

  for (const song of songs) {
    const decade = song.year ? Math.floor(song.year / 10) * 10 : null;
    for (const stanza of song.stanzas) {
      for (const line of stanza) {
        for (const w of words(line)) {
          tokens++;
          if (!isContentWord(w)) continue;

          if (!index.has(w)) index.set(w, new Map());
          const inSong = index.get(w);
          inSong.set(song.slug, (inSong.get(song.slug) ?? 0) + 1);

          if (decade) {
            if (!byDecade.has(w)) byDecade.set(w, new Map());
            const d = byDecade.get(w);
            d.set(decade, (d.get(decade) ?? 0) + 1);
          }
        }
      }
    }
  }

  const entries = [];
  for (const [word, inSongs] of index) {
    if (inSongs.size < minSongs) continue;
    let total = 0;
    for (const n of inSongs.values()) total += n;
    entries.push({
      w: word,
      n: total,
      s: [...inSongs.keys()].sort(),
      d: Object.fromEntries(byDecade.get(word) ?? []),
    });
  }

  entries.sort((a, b) => b.n - a.n || a.w.localeCompare(b.w, "bn"));

  return {
    entries,
    stats: {
      tokens,
      uniqueForms: index.size,
      indexed: entries.length,
      songs: songs.length,
    },
  };
}
