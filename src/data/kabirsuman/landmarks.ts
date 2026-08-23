/**
 * The 25 songs a reader coming to Kabir Suman for the first time should
 * meet first — verified against English and Bengali Wikipedia's track
 * lists, the archive's own listings, and Scroll.in's account of Tomake
 * Chai, rather than picked by ear.
 *
 * `songSlug` links to the full lyric page only where the archive actually
 * holds that song's lyric text under a matching title; several landmark
 * songs — বসে আঁকো's own title track, একেকটা দিন, কবিয়াল, রিজওয়ানুরের গান,
 * এ তুমি কেমন তুমি — are documented as existing (album, year, context) but
 * the archive does not carry their lyric text, so `songSlug` is left null
 * rather than guessed. A null entry still renders, without a link to a
 * lyric page that does not exist.
 */

export interface Landmark {
  bn: string;
  roman: string;
  /** display only — not a join key, since a couple of these (তুমি আসবেই,
   *  the earlier খোদার কসম জান) are filed by the archive without an album
   *  tag even though the year is independently documented */
  year: number;
  albumLabel: string;
  songSlug: string | null;
  note: string;
}

export const LANDMARKS: Landmark[] = [
  {
    bn: "তোমাকে চাই",
    roman: "Tomake Chai",
    year: 1992,
    albumLabel: "Tomake Chai",
    songSlug: "tomake-chai",
    note:
      "The title track and opening song of the 1992 debut: a declaration of wanting, addressed across times of day and season, that widens by its own structure from a lover to the whole city of Calcutta. The single track most often cited as the hinge point of 1990s Bengali song.",
  },
  {
    bn: "পেটকাটি চাঁদিয়াল",
    roman: "Petkati Chandiyal",
    year: 1992,
    albumLabel: "Tomake Chai",
    songSlug: "petokati-chandiyal",
    note:
      "Named for two kite designs flown over Kolkata rooftops. Built around an underage rickshaw-puller's longing for freedom, using the kite as the image of what is out of reach — one of the earliest songs in the mainstream Bengali repertoire to put child labour at the centre of a hit record.",
  },
  {
    bn: "হাল ছেড়ো না বন্ধু",
    roman: "Hal Chhero Na Bondhu",
    year: 1992,
    albumLabel: "Tomake Chai",
    songSlug: null,
    note:
      "An exhortation not to give up, framed around persistence against ageing. It has had a long afterlife as a solidarity song at gatherings across West Bengal and Bangladesh, though this site has found no dated, sourced account of a specific movement using it — that association is widely repeated and should be read as reputation rather than documented fact until a source turns up.",
  },
  {
    bn: "চেনা দুঃখ চেনা সুখ",
    roman: "Chena Dukkho Chena Sukh",
    year: 1992,
    albumLabel: "Tomake Chai",
    songSlug: "chena-dukh-chena-sukh",
    note:
      "\"Familiar sorrow, familiar joy\" — built on the ordinariness of recurring emotional weather rather than a dramatic event, representative of the album's central move: treating unremarkable middle-class interior life as fit subject for a commercial record.",
  },
  {
    bn: "আমাদের জন্য",
    roman: "Amader Jonyo",
    year: 1992,
    albumLabel: "Tomake Chai",
    songSlug: "amader-jonj",
    note:
      "The album's closing track, a celebration of Calcutta's chaotic vitality; its placement at the end reframes the whole record as addressed to a collective \"us\" rather than to one beloved.",
  },
  {
    bn: "মন খারাপ করা বিকেল",
    roman: "Mon Kharap Kora Bikel",
    year: 1992,
    albumLabel: "Tomake Chai",
    songSlug: "mon-kharap-kora",
    note:
      "A song about the specific melancholy of a late afternoon, with no narrative cause behind it. Its place on a debut commercial album is part of why the record was heard as a break from the event- and romance-driven conventions of prevailing adhunik gaan.",
  },
  {
    bn: "দশ ফুট বাই দশ ফুট",
    roman: "Dosh Foot Bai Dosh Foot",
    year: 1992,
    albumLabel: "Tomake Chai",
    songSlug: "dosh-phut-bai-dosh-phut",
    note:
      "Named for a room's dimensions. Depicts claustrophobic poverty in cramped housing by simply reporting a number rather than reaching for a metaphor.",
  },
  {
    bn: "বসে আঁকো",
    roman: "Bose Anko",
    year: 1993,
    albumLabel: "Bose Anko",
    songSlug: null,
    note:
      "Title track of the second album, named for the sit-and-draw competitions of Bengali childhood, continuing the debut's method of building songs from small civic and domestic scenes.",
  },
  {
    bn: "একেকটা দিন",
    roman: "Ek Ekta Din",
    year: 1993,
    albumLabel: "Bose Anko",
    songSlug: null,
    note: "On days that differ from one another — mood and duration again treated as subject in their own right.",
  },
  {
    bn: "জাগে জাগে রাত",
    roman: "Jage Jage Raat",
    year: 1993,
    albumLabel: "Ichchhe Holo",
    songSlug: "jage-jage-rat",
    note: "A night-wakefulness song, sitting within Suman's recurring register of insomnia and the city after hours.",
  },
  {
    bn: "মগজে কারফিউ",
    roman: "Mogoje Curfew",
    year: 1993,
    albumLabel: "Ichchhe Holo",
    songSlug: "mogoje-karophiu",
    note:
      "\"Curfew in the brain\" — imports the vocabulary of state emergency into the description of a mental state, one of the clearest early examples of Suman borrowing political nouns for interior conditions, which is much of why the songs read as political even when they are not about a specific event.",
  },
  {
    bn: "গানওলা",
    roman: "Gaanola",
    year: 1994,
    albumLabel: "Gaanola",
    songSlug: "ganola",
    note:
      "Title track of the fourth album (released internationally as Suman the One Man Band). Addressed to a street song-seller, its refrain — \"ও গানওলা, আর একটা গান গাও\" — gave Suman the public persona he is still described by: an itinerant vendor of songs.",
  },
  {
    bn: "প্রথম সবকিছু",
    roman: "Prothom Sobkichhu",
    year: 1994,
    albumLabel: "Gaanola",
    songSlug: "prothom-sobokichhu",
    note:
      "A first-person inventory of formative experiences located in Kolkata, whose line \"এই শহর জানে আমার প্রথম সবকিছু\" (this city knows all my first things) is quoted far more often than the song's actual title.",
  },
  {
    bn: "ঘুমোও বাউন্ডুলে",
    roman: "Ghumoo Baundule",
    year: 1995,
    albumLabel: "Ghumoo Baundule",
    songSlug: "ghumoo-baundule",
    note: "A lullaby addressed to a drifter rather than a child, title track of the 1995 album.",
  },
  {
    bn: "চাইছি তোমার বন্ধুতা",
    roman: "Chaichhi Tomar Bondhuta",
    year: 1996,
    albumLabel: "Chaichhi Tomar Bondhuta",
    songSlug: "chaichhi-tomar-bondhuta",
    note: "\"I want your friendship\" — proposes friendship rather than romance as the relation being asked for, an unusual frame for a Bengali title track.",
  },
  {
    bn: "একুশে ফেব্রুয়ারী",
    roman: "Ekushe February",
    year: 1996,
    albumLabel: "Chaichhi Tomar Bondhuta",
    songSlug: null,
    note:
      "On 21 February 1952, the Bengali Language Movement killings in Dhaka. A West Bengal artist writing Bangladesh's national commemoration into a Kolkata commercial album is a deliberate cross-border gesture, and a significant part of why Suman's audience in Bangladesh is as large as it is.",
  },
  {
    bn: "আমার মতন কালো",
    roman: "Amar Moton Kalo",
    year: 1996,
    albumLabel: "Chaichhi Tomar Bondhuta",
    songSlug: "amar-moton-kalo",
    note:
      "On dark skin and colourism, treating complexion prejudice directly in a popular song decades before it became a mainstream Indian advertising and media controversy.",
  },
  {
    bn: "জাতিস্মর",
    roman: "Jatishwar",
    year: 1997,
    albumLabel: "Jatishwar (1997)",
    songSlug: "jatismor",
    note:
      "Title track of the 1997 album, on the figure of one who remembers past lives — a different work from the unrelated 2014 Jaatishwar film score, with which it is constantly conflated.",
  },
  {
    bn: "নিষিদ্ধ ইস্তেহার",
    roman: "Nishiddho Istehar",
    year: 1998,
    albumLabel: "Nishiddho Istehar",
    songSlug: null,
    note:
      "\"Forbidden manifesto\" — title track of the 1998 album that marks Suman's turn toward explicitly oppositional material.",
  },
  {
    bn: "কবিয়াল",
    roman: "Kobiyal",
    year: 1998,
    albumLabel: "Nishiddho Istehar",
    songSlug: null,
    note:
      "Invokes the kobiyal, the traditional Bengali extempore duelling bard (Bhola Moira, Antony Firingee). The self-identification Suman is most associated with — critics and Suman himself use নাগরিক কবিয়াল, \"urban bard\" — and he later titled a 2000 album after it.",
  },
  {
    bn: "সাবাস পুলিশ",
    roman: "Sabash Police",
    year: 2007,
    albumLabel: "Nandigram",
    songSlug: "sabas-pulish",
    note:
      "A bitterly sarcastic \"well done, police\", written out of the 2007 police firing on protesters at Nandigram — an entire album built around one land agitation, released within months of the events.",
  },
  {
    bn: "রিজওয়ানুরের গান",
    roman: "Rizwanurer Gaan",
    year: 2008,
    albumLabel: "Rizwanur Britto",
    songSlug: null,
    note:
      "On the death of Rizwanur Rahman, a young Kolkata man who died in September 2007 weeks after a marriage that crossed class and religious lines. An entire album devoted to one named victim is unusual for a commercial Bengali record.",
  },
  {
    bn: "এ তুমি কেমন তুমি",
    roman: "E Tumi Kemon Tumi",
    year: 2014,
    albumLabel: "Jaatishwar (2014 film score)",
    songSlug: null,
    note:
      "From the 2014 Jaatishwar film score, sung by Rupankar Bagchi, who won the National Film Award for Best Male Playback Singer for it — the same film for which Suman himself won Best Music Direction.",
  },
  {
    bn: "খোদার কসম জান",
    roman: "Khodar Kosom Jaan",
    year: 2014,
    albumLabel: "Jaatishwar (2014 film score)",
    songSlug: "khodar-kosom-jan-2014",
    note:
      "From the Jaatishwar film score, sung by Suman himself, reconstructing the world of 19th-century kabigan and the figure of Antony Firingee.",
  },
  {
    bn: "তুমি আসবেই",
    roman: "Tumi Ashbei",
    year: 1997,
    albumLabel: "Jatishwar (1997)",
    songSlug: "tumi-asobei",
    note:
      "\"You will come, I know\" — often miscited under the non-existent title তুমি আসবে বলে; this is the real title, from the 1997 Jatishwar album.",
  },
];
