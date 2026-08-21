/**
 * The words. Every question below was taken from what people actually ask —
 * People Also Ask boxes, forum threads and the explainer pieces that rank for
 * these queries — rather than invented to fill a FAQPage block.
 *
 * Two rules run through all of it.
 *
 * First, an answer is written to survive being quoted with nothing around it.
 * Answer engines show one paragraph with no page attached, so the answer opens
 * with a self-contained declarative sentence and puts the detail after, never
 * the other way round.
 *
 * Second, nothing here claims more certainty than the dataset has. The Atlas's
 * one real advantage over every list article in this space is that it marks
 * which in-universe dates Marvel actually confirmed and which are research
 * consensus. That advantage evaporates the moment a page rounds an estimate up
 * into a fact, so the hedges in these strings are load-bearing.
 */
import { D } from "./data.mjs";

const N = {
  titles: D.entries.length,
  films: D.entries.filter((e) => e.type === "film").length,
  series: D.entries.filter((e) => e.type === "series").length,
  mcuFilms: D.entries.filter((e) => e.universe === "mcu" && e.type === "film").length,
  comics: D.comics.length,
  realities: D.universes.length,
  edges: D.edges.length,
  official: D.entries.filter((e) => e.dateCertainty === "official").length,
  inferred: D.entries.filter((e) => e.dateCertainty === "inferred").length,
};

export const COUNTS = N;

/**
 * The chronological extremes, read from the data rather than written down.
 *
 * These were hardcoded first, and were wrong within a day: the answer "the
 * first Marvel story chronologically is Captain America: The First Avenger" is
 * the received one, and it stopped being true when Eyes of Wakanda was added,
 * which opens in 1260 BC. Anything the dataset can answer is answered from the
 * dataset, so a title added next year corrects the prose instead of quietly
 * contradicting it.
 */
const mcuByChrono = D.entries
  .filter((e) => e.universe === "mcu")
  .sort((a, b) => (a.chrono ?? 9999) - (b.chrono ?? 9999));

export const FIRST_CHRONO = mcuByChrono[0];
export const FIRST_CHRONO_FILM = mcuByChrono.find((e) => e.type === "film");
export const LAST_CHRONO = mcuByChrono[mcuByChrono.length - 1];

export const FIRST_CHRONO_ANSWER = `The earliest MCU story is ${FIRST_CHRONO.title}, set in ${FIRST_CHRONO.inuniv}. The earliest MCU film is ${FIRST_CHRONO_FILM.title}, most of which takes place in ${FIRST_CHRONO_FILM.inuniv} — decades before any other film, though it was not the first released. The two answers differ because the series reach much further back than the films do, which is why "the first Marvel movie chronologically" and "where the timeline starts" are not the same question.`;

/** Answers that more than one page needs, written once. */
export const HOW_MANY = `There is no single number, because "Marvel movie" means two different things. Marvel Studios has released ${N.mcuFilms} MCU films. Counting every Marvel adaptation ever released for screen — the Fox X-Men films, the Sony Spider-Man films, Blade, the Punisher films, the 1970s television movies and the animated series alongside them — this Atlas tracks ${N.titles} titles in total, of which ${N.films} are films and ${N.series} are series.`;

export const WHY_TWO_ORDERS = `Release order is the order the films and series came out, and it is the order the stories were built to be watched in: every reveal lands when it was written to land. Chronological order is the order events happen inside the story, which reads more like a history and spoils several reveals that only work because you did not know them yet. Release order is the better first watch; chronological order is the better second one.`;

export const CERTAINTY_NOTE = `Marvel rarely puts a year on screen. Where Marvel's own published chronology confirms one, this Atlas marks the date confirmed. Where it does not, the date is marked estimated and is the consensus of press and research rather than canon. ${N.official} titles carry confirmed in-universe dates and ${N.inferred} are marked as estimates.`;

export const EARTH_ANSWER = `Earth-616 is the designation for the main continuity of the Marvel comics. The Marvel Cinematic Universe was designated Earth-199999 by the Marvel Database, and that is the number this Atlas uses for it — but the MCU called itself "Earth-616" out loud in Doctor Strange in the Multiverse of Madness, which is why both numbers get used for the same reality and why the question keeps being asked. Both are recorded here rather than one being quietly picked.`;

export const HOME_FAQ = [
  { q: "What order should I watch the Marvel movies in?", a: WHY_TWO_ORDERS },
  { q: "How many Marvel movies are there?", a: HOW_MANY },
  {
    q: "What is the Marvel Multiverse Atlas?",
    a: `The Marvel Multiverse Atlas is a free reference for every Marvel film, series, television movie, special presentation, one-shot and short released for screen — ${N.titles} titles in all — plotted five ways: by release date, by when each story happens inside the Marvel Universe, by the ${N.edges} verified connections that cross between realities, by the ${N.comics} landmark comics the screen adapted, and against a live clock running inside the Marvel Universe itself. There is no account, no payment and nothing to install, and the whole dataset is downloadable as JSON and CSV.`,
  },
  {
    q: "Why is the MCU timeline so confusing?",
    a: `Because Marvel mostly does not date its own stories. Only a minority of MCU titles have ever had a year stated on screen or in Marvel's published chronology; the rest are placed by inference from what characters say and what has already happened. Different outlets infer differently, so their timelines disagree. This Atlas handles that by marking each date as confirmed or estimated instead of presenting all of them as equally certain.`,
  },
  {
    q: "Is the MCU Earth-616 or Earth-199999?",
    a: EARTH_ANSWER,
  },
  {
    q: "What is the Sacred Timeline?",
    a: `The Sacred Timeline is the single branch of the multiverse the Time Variance Authority preserved by pruning every other one, named in Loki. In practice it is the name for the main MCU continuity — everything from Iron Man through the current slate, plus the Disney+ series, the Netflix Defenders shows and Marvel Television's ABC and Hulu slate, all of which have been folded into it.`,
  },
  {
    q: "Are the Marvel One-Shots canon?",
    a: `Yes. The Marvel One-Shots are short films Marvel Studios released alongside its home-media releases between 2011 and 2014, and their events are treated as part of the MCU: Agent Carter led directly to the Agent Carter series, and All Hail the King brought back Trevor Slattery, who later returned in Shang-Chi. This Atlas carries all nine one-shots and shorts.`,
  },
  {
    q: "Is it free, and do I need an account?",
    a: `It is free, with no account, no signup and nothing to install. The full dataset can be downloaded as JSON or CSV from the Archive, and the sources behind every fact are credited in full.`,
  },
];

export const WATCH_ORDER_FAQ = [
  { q: "Should I watch Marvel movies in release order or chronological order?", a: WHY_TWO_ORDERS },
  { q: "How many Marvel movies are there?", a: HOW_MANY },
  {
    q: "What Marvel movie should I start with?",
    a: `Start with Iron Man (2008) if you are watching in release order — it is where the MCU begins, and everything after it was written assuming you saw it. If you are watching chronologically, start with ${FIRST_CHRONO_FILM.title}, set in ${FIRST_CHRONO_FILM.inuniv}, which is the earliest of the films.`,
  },
  { q: "What is the first Marvel movie chronologically?", a: FIRST_CHRONO_ANSWER },
  { q: "Do I need to watch the Marvel One-Shots?", a: `No, nothing later depends on having seen them, but two pay off directly: Agent Carter sets up the Agent Carter series, and All Hail the King explains Trevor Slattery, who returns years later in Shang-Chi. They are ten to fifteen minutes each.` },
  { q: "Why do some dates say estimated?", a: CERTAINTY_NOTE },
];

export const REALITY_FAQ = [
  { q: "Is the MCU Earth-616 or Earth-199999?", a: EARTH_ANSWER },
  {
    q: "What does Earth-616 mean?",
    a: `Earth-616 is the number given to the main Marvel comics continuity — the reality most Marvel comics have been set in since the 1960s. The number itself came from a British Marvel comic in the 1980s rather than from the main line, and was only adopted as the standard designation afterwards.`,
  },
  {
    q: "What is the Marvel multiverse?",
    a: `The Marvel multiverse is the set of parallel realities that exist alongside each other in Marvel's fiction, each given its own Earth number. On screen it is what lets Spider-Man: No Way Home, the Spider-Verse films and Doctor Strange in the Multiverse of Madness pull characters out of one continuity into another. This Atlas tracks ${N.realities} of those realities and ${N.edges} verified crossings between them.`,
  },
  {
    q: "How many realities are there in the Marvel multiverse?",
    a: `In the comics, effectively unlimited. On screen the number is finite and countable: ${N.realities} distinct Earth designations appear across every Marvel film and series released so far, and they are all listed here. ${D.entries.filter((e) => e.universe === "unclassified").length} further titles have never been given a designation and are recorded as unclassified rather than assigned a made-up number.`,
  },
];

export const COMICS_FAQ = [
  {
    q: "What comic is a Marvel movie based on?",
    a: `Most Marvel films adapt a specific comic run rather than a general character history — Avengers: Infinity War and Endgame draw on Jim Starlin's The Infinity Gauntlet (1991), Captain America: Civil War on Mark Millar's Civil War (2006), and Thor: Ragnarok on Planet Hulk (2006). This Atlas maps ${D.comics.filter((c) => (c.adapts || "").trim()).length} landmark comics to the films and series that adapted them.`,
  },
  {
    q: "Is this every Marvel comic?",
    a: `No, and it does not claim to be. Marvel has printed tens of thousands of issues and no complete offline dataset of them exists. This is the source-material spine: ${N.comics} landmark issues from 1939 to 2020 — the first appearances that created the characters and the storylines the screen has actually adapted — labelled as a curated selection rather than a catalogue.`,
  },
  {
    q: "Where can I read these comics?",
    a: `Almost all of them are on Marvel Unlimited, Marvel's own subscription archive, and the major storylines are in print as collected editions. Every comic listed here links out to where it can be read; nothing is hosted or reproduced on this site beyond cover art credited to Comic Vine.`,
  },
];

/** Per-title questions, filled per page. Only questions the page can really
 *  answer from the data are emitted — see buildTitleFaq in prepare-atlas.mjs. */
export const TITLE_Q = {
  comic: (t) => `What comic is ${t} based on?`,
  timeline: (t) => `Where does ${t} fit in the Marvel timeline?`,
  year: (t) => `What year does ${t} take place in?`,
  watch: (t) => `Where can I watch ${t}?`,
  runtime: (t) => `How long is ${t}?`,
  box: (t) => `How much did ${t} make at the box office?`,
  canon: (t) => `Is ${t} canon to the MCU?`,
};
