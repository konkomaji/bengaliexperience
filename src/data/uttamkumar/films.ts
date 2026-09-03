import { ARCHIVE_FILM_BY_SLUG, ARCHIVE_FILMS, type ArchiveFilm } from "./films.generated";

/**
 * Editorial layer over the generated filmography: the roughly one-in-four
 * films documented well enough, across independent sources, to justify a
 * real page rather than a bare row. This is the Atlas's own stated rule
 * applied to a person instead of a multiverse — "a page per row is how
 * programmatic SEO turns into index bloat" — so a film with no verifiable
 * synopsis gets listed on /uttamkumar/films with its year and role and
 * nothing invented, rather than a thin page with a made-up plot.
 *
 * Every key here must exist in ARCHIVE_FILMS; the check below throws at
 * import time if one doesn't; a slug renamed upstream (say, Wikipedia's own
 * table changes) breaks the build loudly rather than silently 404ing a
 * detail page in production.
 */
export interface FilmDetail {
  slug: string;
  director?: string;
  coStars?: string[];
  synopsis: string;
  /** award, box-office or landmark note beyond the archive's own "Notes" cell */
  significance?: string;
  era: "the-struggle" | "breakthrough" | "the-sixties" | "peak-seventies" | "final-years" | "posthumous";
  /** the small set critics/retrospectives return to most — see /uttamkumar/films#acclaimed */
  acclaimed?: boolean;
  /** co-starred Suchitra Sen — see /uttamkumar/suchitra, which filters on this */
  withSuchitra?: boolean;
}

export const FILM_DETAILS: FilmDetail[] = [
  {
    slug: "basu-paribar-1952",
    director: "Nirmal Dey",
    coStars: ["Supriya Devi"],
    synopsis:
      "A joint Bengali family drama. Uttam Kumar's first real hit — the year's highest-grossing Bengali release — and the film that let him resign his clerk's job at Calcutta Port Trust to act full time.",
    era: "the-struggle",
  },
  {
    slug: "sharey-chuattor-1953",
    withSuchitra: true,
    director: "Nirmal Dey",
    coStars: ["Suchitra Sen", "Bhanu Banerjee"],
    synopsis:
      "A boarding-house multistarrer comedy. His first film with Suchitra Sen, and a 63-week run that made it the year's highest-grossing Bengali film — still ranked among Bengali cinema's great comedies.",
    era: "the-struggle",
  },
  {
    slug: "agni-pariksha-1954",
    withSuchitra: true,
    acclaimed: true,
    director: "Agradoot",
    coStars: ["Suchitra Sen"],
    synopsis:
      "A musical romance, released on his 27th birthday, that fixed the Uttam-Suchitra pairing as a genre of its own and made him a romantic lead rather than a jobbing actor.",
    significance: "The film that ended the \"Flop Master General\" years for good.",
    era: "the-struggle",
  },
  {
    slug: "shap-mochan-1955",
    withSuchitra: true,
    director: "Sudhir Mukherjee",
    coStars: ["Suchitra Sen"],
    synopsis:
      "A musical blockbuster built around Hemanta Mukherjee's playback for Uttam Kumar — the start of a voice-and-face partnership Bengali audiences would treat as one performer for two decades.",
    era: "breakthrough",
  },
  {
    slug: "sabar-uparey-1955",
    director: "Agradoot",
    synopsis:
      "A crime drama adapted from A. J. Cronin's Beyond This Place, with Uttam Kumar as a son investigating his father's wrongful conviction — an early sign of range beyond the romantic lead.",
    era: "breakthrough",
  },
  {
    slug: "sagarika-1956",
    withSuchitra: true,
    director: "Agragami",
    coStars: ["Suchitra Sen"],
    synopsis: "A medical-student romance with Suchitra Sen; one of the pairing's outright blockbusters.",
    era: "breakthrough",
  },
  {
    slug: "saheb-bibi-golam-1956",
    director: "Kartick Chattopadhyay",
    synopsis:
      "A social drama on the decline of Bengal's zamindari feudal order, from Bimal Mitra's novel. Successful enough that it shaped the later Hindi remake Sahib Bibi Aur Ghulam (1962).",
    era: "breakthrough",
  },
  {
    slug: "harano-sur-1957",
    withSuchitra: true,
    acclaimed: true,
    director: "Ajoy Kar",
    coStars: ["Suchitra Sen"],
    synopsis:
      "An amnesia melodrama, inspired by Random Harvest (1942) — his first credit as producer, under his and Ajoy Kar's new Alochhaya Productions.",
    significance: "Certificate of Merit, Third Best Feature Film in Bengali, 5th National Film Awards (as producer).",
    era: "breakthrough",
  },
  {
    slug: "chandranath-1957",
    director: "Ajoy Kar",
    synopsis: "A Sarat Chandra Chattopadhyay adaptation — the first Indian film ever released at Calcutta's Metro Cinema.",
    era: "breakthrough",
  },
  {
    slug: "pathey-holo-deri-1957",
    director: "Ardhendu Bhushan Mukhopadhyay",
    synopsis: "A romantic drama, and the first Bengali film shot in Gevacolor.",
    era: "breakthrough",
  },
  {
    slug: "tasher-ghar-1957",
    director: "Bijoy Bose",
    synopsis: "A noir thriller, and his first film in a dual role — a device he'd return to across the 1960s and 70s.",
    era: "breakthrough",
  },
  {
    slug: "rajlakshmi-o-srikanta-1958",
    director: "Haridas Bhattacharya",
    synopsis: "A Sarat Chandra adaptation, among the year's top-grossing Bengali releases.",
    era: "breakthrough",
  },
  {
    slug: "indrani-1958",
    withSuchitra: true,
    coStars: ["Suchitra Sen"],
    synopsis: "A romantic drama with Suchitra Sen; one of 1958's biggest hits.",
    era: "breakthrough",
  },
  {
    slug: "khokababur-pratyabartan-1960",
    acclaimed: true,
    director: "Tapan Sinha",
    synopsis:
      "Adapted from Tagore, with Uttam Kumar as an ageing family servant — a supporting, unglamorous role far from the romantic lead, singled out as one of Bengali cinema's most affecting performances.",
    era: "the-sixties",
  },
  {
    slug: "kuhak-1960",
    synopsis:
      "A noir reworking of The Night of the Hunter (1955); a box-office failure on release that has since gained a cult following.",
    era: "the-sixties",
  },
  {
    slug: "jhinder-bondi-1961",
    acclaimed: true,
    director: "Tapan Sinha",
    coStars: ["Soumitra Chatterjee"],
    synopsis:
      "A swashbuckling reworking of Anthony Hope's The Prisoner of Zenda, with Uttam Kumar in a triple role. His first major screen pairing with Soumitra Chatterjee — the two actors Bengali cinema would spend the rest of the century comparing.",
    significance: "Ranked 16th on IMDb's list of the 100 Greatest Indian Films.",
    era: "the-sixties",
  },
  {
    slug: "saptapadi-1961",
    withSuchitra: true,
    acclaimed: true,
    director: "Ajoy Kar",
    coStars: ["Suchitra Sen"],
    synopsis:
      "An epic wartime romance across religious lines, with Suchitra Sen — the pairing's best-remembered film, and the source of its most quoted scene, the two of them riding a bicycle together.",
    significance: "Nominated for the Grand Prix at the Moscow International Film Festival. BFJA Award for Best Actor.",
    era: "the-sixties",
  },
  {
    slug: "deya-neya-1963",
    synopsis: "His 100th film, a triple-role blockbuster in which his character is also, notably, an established singer.",
    era: "the-sixties",
  },
  {
    slug: "jatugriha-1964",
    acclaimed: true,
    director: "Tapan Sinha",
    synopsis:
      "A quiet drama of a marriage's slow collapse — his fourth film with Tapan Sinha, since described as \"a forgotten modern classic.\"",
    significance: "Third Best Feature Film in Bengali, National Film Awards (as producer).",
    era: "the-sixties",
  },
  {
    slug: "nayak-1966",
    acclaimed: true,
    director: "Satyajit Ray",
    synopsis:
      "Ray wrote the script with Uttam Kumar specifically in mind: a film star's train journey and the doubts he confesses to a stranger along the way — as close as Ray's cinema comes to a star vehicle, and reportedly a film Elizabeth Taylor wanted to work with him on.",
    significance: "UNICRIT Award, Berlin International Film Festival. His third BFJA Best Actor Award. Ranked among Film Companion's 25 greatest Indian screen performances.",
    era: "the-sixties",
  },
  {
    slug: "grihadaha-1967",
    withSuchitra: true,
    synopsis: "A Sarat Chandra adaptation, with Suchitra Sen among the cast.",
    significance: "BFJA Award for Best Actor.",
    era: "the-sixties",
  },
  {
    slug: "chiriyakhana-1967",
    acclaimed: true,
    director: "Satyajit Ray",
    synopsis:
      "Ray's second and last film with him, casting Uttam Kumar as detective Byomkesh Bakshi in a murder-mystery Ray himself later dismissed as his weakest work — the film has since gained its own following regardless.",
    significance: "National Film Award for Best Actor, jointly with Antony Firingee — the very first year the award existed.",
    era: "the-sixties",
  },
  {
    slug: "antony-firingee-1967",
    acclaimed: true,
    synopsis:
      "A biographical film on Hensman Anthony, the real 19th-century Portuguese-Bengali kobiyal (folk poet) known as Antony Firingee, who composed and performed in Bengali kobigaan verse duels.",
    significance: "National Film Award for Best Actor, jointly with Chiriyakhana — the award's first year.",
    era: "the-sixties",
  },
  {
    slug: "chowringhee-1968",
    acclaimed: true,
    synopsis:
      "Adapted from Sankar's 1962 novel of the same name, set inside a grand Calcutta hotel — widely cited as the film that most completely captures his screen charisma, among Film Companion's ten best Uttam Kumar performances.",
    era: "the-sixties",
  },
  {
    slug: "nishi-padma-1970",
    synopsis: "The year's highest-grossing Bengali release; Film Companion called it \"the definitive Uttam Kumar performance after Nayak.\"",
    era: "peak-seventies",
  },
  {
    slug: "stree-1972",
    acclaimed: true,
    synopsis: "A rare negative role, as a degenerate landlord — a deliberate turn away from the romantic-hero image he was best known for.",
    significance: "BFJA Award for Best Actor.",
    era: "peak-seventies",
  },
  {
    slug: "mem-saheb-1972",
    coStars: ["Aparna Sen"],
    synopsis: "A political romance in which he plays a journalist, opposite Aparna Sen.",
    era: "peak-seventies",
  },
  {
    slug: "bon-palashir-padabali-1973",
    acclaimed: true,
    coStars: ["Supriya Devi", "Madhabi Mukherjee"],
    synopsis:
      "An action drama from Ramapada Chowdhury's novel, which Uttam Kumar directed himself and later called his \"dream project\" — the year's highest-grossing Bengali film.",
    era: "peak-seventies",
  },
  {
    slug: "kayahiner-kahini-1973",
    synopsis: "A psychological horror film with Uttam Kumar in a dual role; a modest release on its own release that has since gained cult status.",
    era: "peak-seventies",
  },
  {
    slug: "amanush-1974",
    acclaimed: true,
    coStars: ["Sharmila Tagore"],
    synopsis:
      "Shot simultaneously in Bengali and Hindi, released for Durga Puja 1974 in Bengali and in Hindi the following March. His most commercially successful film ever — a 96-plus-week run, repeatedly re-released — remembered as much for his screen chemistry with Kishore Kumar's playback voice as for the story itself.",
    significance: "His first Filmfare Award for Best Actor; seventh BFJA Award.",
    era: "peak-seventies",
  },
  {
    slug: "mouchak-1975",
    synopsis: "A comedy, superhit on release, whose soundtrack became one of the decade's best-selling Bengali film albums.",
    era: "peak-seventies",
  },
  {
    slug: "agnishwar-1975",
    acclaimed: true,
    synopsis: "A satire with Uttam Kumar as an egotistical doctor — widely counted among the milestone performances of his filmography.",
    era: "peak-seventies",
  },
  {
    slug: "sanyasi-raja-1975",
    acclaimed: true,
    synopsis:
      "Inspired by the real Bhawal case (1936–1946), in which a man claiming to be a dead zamindar's returned heir divided a princely estate and the courts for a decade. The year's highest-grossing Bengali film, with dialogue that passed into everyday pop-culture reference.",
    era: "peak-seventies",
  },
  {
    slug: "bagh-bondi-khela-1975",
    synopsis: "A political thriller with Uttam Kumar as a corrupt politician — a major commercial success in a year where all six of his releases hit.",
    era: "peak-seventies",
  },
  {
    slug: "banhishikha-1976",
    synopsis: "An action thriller with Uttam Kumar as a crime boss.",
    significance: "BFJA Award for Best Actor — an eighth win, a record for the award at the time.",
    era: "peak-seventies",
  },
  {
    slug: "ananda-ashram-1977",
    synopsis:
      "A remake of the 1941 film Daktar, restoring his romantic-hero image after a run of underperforming action vehicles — a 26-plus-week hit in Bengali, though its simultaneous Hindi version failed.",
    era: "final-years",
  },
  {
    slug: "kitaab-1977",
    director: "Gulzar",
    synopsis: "A Hindi film with Vidya Sinha and Shreeram Lagoo; well reviewed, modest at the box office.",
    era: "final-years",
  },
  {
    slug: "dhanraj-tamang-1978",
    synopsis: "A superhit that closed out the decade on a high note.",
    significance: "Filmfare Award East for Best Actor.",
    era: "final-years",
  },
  {
    slug: "dui-prithibi-1980",
    synopsis: "Released in his lifetime, after a run of weaker box-office years, and one of his last well-received performances.",
    era: "final-years",
  },
  {
    slug: "plot-no-5-1981",
    synopsis: "A Hindi film, one of his last completed roles, released after his death.",
    era: "posthumous",
  },
  {
    slug: "ogo-bodhu-shundori-1981",
    synopsis:
      "The comedy he was still shooting when he fell ill on set; completed and released after his death, and one of the biggest posthumous box-office successes of his career, running 26 weeks.",
    era: "posthumous",
  },
  {
    slug: "kalankini-kankabati-1981",
    synopsis: "A film he directed himself, released after his death.",
    era: "posthumous",
  },
  {
    slug: "oti-uttam-2024",
    director: "Srijit Mukherji",
    synopsis:
      "Not archive footage stitched into a documentary but a constructed new performance: VFX composited from 54 of his old films to put him, freshly, into a new story — his first \"new\" screen appearance in 37 years, and a box-office hit on release.",
    significance: "Counted by the archive's own note as his 212th film.",
    era: "posthumous",
  },
];

export const FILM_DETAIL_BY_SLUG: Record<string, FilmDetail> = Object.fromEntries(
  FILM_DETAILS.map((f) => [f.slug, f]),
);

const missing = FILM_DETAILS.filter((f) => !ARCHIVE_FILM_BY_SLUG[f.slug]);
if (missing.length) {
  throw new Error(
    `src/data/uttamkumar/films.ts references slugs films.generated.ts doesn't have: ${missing.map((f) => f.slug).join(", ")}`,
  );
}

export interface Film extends ArchiveFilm {
  detail?: FilmDetail;
}

/** every film, generated fact plus editorial detail where it exists */
export const FILMS: Film[] = ARCHIVE_FILMS.map((f) => ({ ...f, detail: FILM_DETAIL_BY_SLUG[f.slug] }));

/** only the ones with a real page behind them */
export const LANDMARK_FILMS: Film[] = FILMS.filter((f) => f.detail);

export const ERA_LABEL: Record<FilmDetail["era"], string> = {
  "the-struggle": "1948–1954 — the flop years, then the breakthrough",
  breakthrough: "1955–1959 — superstardom takes hold",
  "the-sixties": "1960–1969 — the peak decade, and the two Ray films",
  "peak-seventies": "1970–1976 — six-for-six years, and the biggest hit of his career",
  "final-years": "1977–1980 — the last films made in his lifetime",
  posthumous: "1981–2024 — released after his death",
};
