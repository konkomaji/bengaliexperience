import type { Song } from "./songs.types";

/**
 * The playlist. Bangla bangers, retro through 2020s, in rough chronological
 * order so the queue reads as a trip through the decades.
 *
 * Every youtubeId here was checked against YouTube's oEmbed endpoint and
 * returned HTTP 200 — meaning the video exists AND permits embedding. That
 * distinction matters: a video can be perfectly live and still refuse to
 * embed (oEmbed 401), in which case this player would silently play nothing.
 * Roughly a dozen otherwise-fine tracks were dropped for exactly that.
 *
 * Before adding anything here:
 *   curl -s -o /dev/null -w "%{http_code}" \
 *     "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=ID&format=json"
 * 200 = good · 401 = embedding blocked · 404 = gone.
 *
 * Years on a few older non-film tracks are best-estimate album dates; the era
 * buckets are right even where the exact year is approximate.
 */
const RAW: Omit<Song, "id">[] = [
  // ---------------- retro ----------------
  { title: "আমায় প্রশ্ন করে নীল ধ্রুবতারা", titleRomanized: "Amay Prashna Kare Neel Dhrubatara", artist: "Hemanta Mukherjee", youtubeId: "Quw_xNFSfik", publisher: "Saregama Bengali", year: 1955, era: "retro", mood: "melancholy" },
  { title: "এই রাত তোমার আমার", titleRomanized: "Ei Raat Tomar Amar", artist: "Hemanta Mukherjee", youtubeId: "87jtbauufgc", publisher: "Angel Bengali Songs", year: 1959, era: "retro", mood: "romantic" },
  { title: "আমি যে জলসাঘরে", titleRomanized: "Ami Je Jalsaghare", artist: "Manna Dey", youtubeId: "nge2hWSQyEc", publisher: "Angel Bengali Songs", year: 1967, era: "retro", mood: "melancholy" },
  { title: "কফি হাউসের সেই আড্ডাটা", titleRomanized: "Coffee Houser Sei Addata", artist: "Manna Dey", youtubeId: "kvadzdVaTtg", publisher: "Saregama Bengali", year: 1983, era: "retro", mood: "adda" },
  { title: "আজ এই দিনটাকে", titleRomanized: "Aaj Ei Dintake", artist: "Kishore Kumar", youtubeId: "nryrK9xjgU8", publisher: "Saregama Bengali", year: 1985, era: "retro", mood: "nostalgic" },
  { title: "চিরদিনই তুমি যে আমার", titleRomanized: "Chirodini Tumi Je Aamar", artist: "Kishore Kumar", youtubeId: "AJTkBqJXAv4", publisher: "Ishtar Regional", year: 1987, era: "retro", mood: "romantic" },

  // ---------------- 90s ----------------
  { title: "তোমাকে চাই", titleRomanized: "Tomake Chai", artist: "Kabir Suman", youtubeId: "Hk3MaWhFg4A", publisher: "Saregama Bengali", year: 1992, era: "90s", mood: "romantic" },
  { title: "পেটকাটি চাঁদিয়াল", titleRomanized: "Petkati Chandial", artist: "Kabir Suman", youtubeId: "_vP7lB2rOSA", publisher: "Saregama Bengali", year: 1992, era: "90s", mood: "nostalgic" },
  { title: "নীলাঞ্জনা", titleRomanized: "Nilanjana", artist: "Nachiketa Chakraborty", youtubeId: "RZt8UzEZ1a4", publisher: "Saregama Bengali", year: 1993, era: "90s", mood: "romantic" },
  { title: "এই বেশ ভালো আছি", titleRomanized: "Ei Besh Bhalo Achhi", artist: "Nachiketa Chakraborty", youtubeId: "LY_asykxNZw", publisher: "Saregama Bengali", year: 1994, era: "90s", mood: "melancholy" },
  { title: "বেলা বোস", titleRomanized: "Bela Bose (2441139)", artist: "Anjan Dutt", youtubeId: "0iUmptTmJ2k", publisher: "Saregama Bengali", year: 1994, era: "90s", mood: "nostalgic" },
  { title: "পৃথিবীটা নাকি ছোট হতে হতে", titleRomanized: "Prithibita Naki Choto Hote Hote", artist: "Mohiner Ghoraguli", youtubeId: "mRqd3TUxXNU", publisher: "Mohiner Ghoraguli", year: 1995, era: "90s", mood: "nostalgic" },
  { title: "তুমি আছো এত কাছে তাই", titleRomanized: "Tumi Achho Eto Kachhe Tai", artist: "Kumar Sanu", youtubeId: "noGHRgAxtSM", publisher: "Saregama Bengali", year: 1996, era: "90s", mood: "romantic" },
  { title: "রঞ্জনা আমি আর আসবো না", titleRomanized: "Ranjana Ami Aar Aasbo Na", artist: "Anjan Dutt", youtubeId: "tbi2eYL89Uk", publisher: "Saregama Bengali", year: 1997, era: "90s", mood: "nostalgic" },

  // ---------------- 2000s ----------------
  { title: "বারান্দায় রোদ্দুর", titleRomanized: "Barandaye Roddur", artist: "Bhoomi", youtubeId: "E70oxtms_qg", publisher: "Times Music Bangla", year: 2000, era: "2000s", mood: "upbeat" },
  { title: "হলুদ পাখি", titleRomanized: "Halud Pakhi", artist: "Cactus", youtubeId: "fpMH2DW_lmM", publisher: "Saregama Bengali", year: 2000, era: "2000s", mood: "nostalgic" },
  { title: "দেখেছি তোমাকে ফুলেরই আসরে", titleRomanized: "Dekhechi Tomake Fuleri Ashore", artist: "Kumar Sanu", youtubeId: "nRk9nowJNNg", publisher: "Bengali Folk Mp3", year: 2001, era: "2000s", mood: "romantic" },
  { title: "বিষাক্ত মানুষ", titleRomanized: "Bishakto Manush", artist: "Rupam Islam, Fossils", youtubeId: "EBZ6coM4Xu0", publisher: "Fossils", year: 2002, era: "2000s", mood: "melancholy" },
  { title: "জুজু", titleRomanized: "JuJu", artist: "Chandrabindoo", youtubeId: "cxjx3OqFsYI", publisher: "Bengali Music Directory", year: 2003, era: "2000s", mood: "adda" },
  { title: "এ মনের চাওয়া", titleRomanized: "E Moner Chaoya", artist: "Kumar Sanu, Shaan", youtubeId: "DlddJxcnRUg", publisher: "Angel Bengali Songs", year: 2004, era: "2000s", mood: "romantic" },
  { title: "কত কাছে তোমাকে চাই", titleRomanized: "Kato Kache Tomake Chai", artist: "Kumar Sanu, Arundhuti Homechowdhury", youtubeId: "yBicVKmnNpg", publisher: "Sony Music Bangla", year: 2005, era: "2000s", mood: "romantic" },
  { title: "এভাবেও ফিরে আসা যায়", titleRomanized: "E Bhabeo Phire Asha Jaye", artist: "Chandrabindoo", youtubeId: "tz7KMTn_DtQ", publisher: "Asha Audio", year: 2005, era: "2000s", mood: "nostalgic" },
  { title: "মন মানে না", titleRomanized: "Mon Mane Na", artist: "Zubeen Garg, June Banerjee", youtubeId: "V32Xi0hq2P8", publisher: "Surinder Films", year: 2008, era: "2000s", mood: "romantic" },
  { title: "চোখের জলে", titleRomanized: "Chokher Jole", artist: "Zubeen Garg", youtubeId: "AeOZB95DOhA", publisher: "SVF", year: 2009, era: "2000s", mood: "melancholy" },
  { title: "যাও পাখি বলো", titleRomanized: "Jao Pakhi Bolo", artist: "Shreya Ghoshal", youtubeId: "i2ebU9paYu8", publisher: "Antaheen", year: 2009, era: "2000s", mood: "melancholy" },
  { title: "মন জানে", titleRomanized: "Mon Jane", artist: "Shaan", youtubeId: "tfZtsob_dwk", publisher: "SVF Music", year: 2009, era: "2000s", mood: "romantic" },

  // ---------------- 2010s ----------------
  { title: "আমাকে আমার মত থাকতে দাও", titleRomanized: "Amake Amar Moto Thakte Dao", artist: "Anupam Roy", youtubeId: "vYsfSlEBh5Y", publisher: "SVF", year: 2010, era: "2010s", mood: "melancholy" },
  { title: "বাড়িয়ে দাও তোমার হাত", titleRomanized: "Bariye Dao Tomar Haat", artist: "Anupam Roy", youtubeId: "KSSX0xBjtw8", publisher: "SVF", year: 2011, era: "2010s", mood: "nostalgic" },
  { title: "বোঝেনা সে বোঝেনা", titleRomanized: "Bojhena Shey Bojhena", artist: "Arijit Singh", youtubeId: "p_VSmhusTlM", publisher: "SVF", year: 2012, era: "2010s", mood: "melancholy" },
  { title: "চুপি চুপি", titleRomanized: "Chupi Chupi", artist: "Shreya Ghoshal, Mohit Chauhan", youtubeId: "8zWEopg_I7I", publisher: "SVF", year: 2012, era: "2010s", mood: "romantic" },
  { title: "না রে না", titleRomanized: "Na Re Na", artist: "Arijit Singh", youtubeId: "azLiK9wdxl8", publisher: "SVF", year: 2012, era: "2010s", mood: "upbeat" },
  { title: "মন মাঝি রে", titleRomanized: "Mon Majhi Re", artist: "Arijit Singh", youtubeId: "-fRoAkmuLNs", publisher: "T-Series Bangla", year: 2013, era: "2010s", mood: "road" },
  { title: "দে সিগন্যাল", titleRomanized: "De Signal", artist: "Zubeen Garg", youtubeId: "vQQAv_rst7c", publisher: "T-Series Bangla", year: 2013, era: "2010s", mood: "upbeat" },
  { title: "তোমাকে চাই", titleRomanized: "Tomake Chai (Gangster)", artist: "Arijit Singh", youtubeId: "1f18irP--O8", publisher: "SVF", year: 2016, era: "2010s", mood: "romantic" },
  { title: "তুমি যাকে ভালোবাসো", titleRomanized: "Tumi Jake Bhalobasho (Male)", artist: "Anupam Roy", youtubeId: "KNJxsR4qA4E", publisher: "Amara Muzik Bengali", year: 2016, era: "2010s", mood: "romantic" },
  { title: "তুমি যাকে ভালোবাসো", titleRomanized: "Tumi Jake Bhalobasho (Female)", artist: "Iman Chakraborty", youtubeId: "LkUqqoKB4rM", publisher: "Amara Muzik Bengali", year: 2016, era: "2010s", mood: "melancholy" },
  { title: "হারাবো তোকে", titleRomanized: "Harabo Toke", artist: "Shaan", youtubeId: "0LAp-RvjCs0", publisher: "Jaaz Multimedia", year: 2016, era: "2010s", mood: "romantic" },
  { title: "গানের জন্ম", titleRomanized: "Gaaner Jonmo", artist: "Rupam Islam", youtubeId: "krTB4Mf7RI8", publisher: "Rupam & Fossils", year: 2018, era: "2010s", mood: "melancholy" },
  { title: "প্রতিশ্রুতি", titleRomanized: "Protisruti", artist: "Somlata Acharyya Chowdhury", youtubeId: "QZu15oDw_jU", publisher: "Somlata And The Aces", year: 2019, era: "2010s", mood: "romantic" },
  { title: "খাঁচার পাখি", titleRomanized: "Khachar Pakhi", artist: "Nikhita Gandhi", youtubeId: "4gX3GyfLdxc", publisher: "Times Music Bangla", year: 2019, era: "2010s", mood: "romantic" },

  // ---------------- 2020s ----------------
  { title: "আমি আছি", titleRomanized: "Ami Achi", artist: "Nikhita Gandhi, Timir Biswas", youtubeId: "OGYpmgPJgSw", publisher: "Sony Music Bengali", year: 2020, era: "2020s", mood: "romantic" },
  { title: "অদ্ভুত মুগ্ধতা", titleRomanized: "Adbhut Mugdhota", artist: "Anupam Roy", youtubeId: "Fhjl7eBZZ2M", publisher: "SVF", year: 2020, era: "2020s", mood: "romantic" },
  { title: "বেহায়া", titleRomanized: "Behaya", artist: "Lagnajita Chakraborty", youtubeId: "n8lq7tF40jk", publisher: "SVF Music", year: 2021, era: "2020s", mood: "romantic" },
  { title: "মন ডুবে যাই", titleRomanized: "Mon Dubey Jaai", artist: "Shaan", youtubeId: "BdaxMKPHRvU", publisher: "Singer Shaan", year: 2021, era: "2020s", mood: "melancholy" },
  { title: "কতটা রাত", titleRomanized: "Kotota Raat", artist: "Lagnajita Chakraborty", youtubeId: "Q6041IgWBT8", publisher: "Saregama Bengali", year: 2022, era: "2020s", mood: "melancholy" },
];

export const SONGS: Song[] = RAW.map((s, i) => ({ id: `${i + 1}-${s.youtubeId}`, ...s }));
