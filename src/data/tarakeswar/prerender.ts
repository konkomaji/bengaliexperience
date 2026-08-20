import { escape, questions } from "../../lib/prerender";
import { PAGE_PATH, type PageId } from "../seo";
import { DIRECTORY_ENTRIES, DIRECTORY_GAPS, type DirectoryCategory } from "./directory";
import { BLOG_POSTS, type BlogPost } from "./blog";
import { TARAKESWAR } from "./core";

/**
 * Crawlable body for the four static Tarakeswar pages and the blog index,
 * called from src/lib/prerender.ts's renderStaticBody switch. Individual
 * blog posts are not a PageId (see src/data/seo.ts), so they go through
 * renderTarakeswarBlogPostBody below instead, called directly by
 * functions/_middleware.ts when the request path matches a post slug.
 */
export function renderTarakeswarBody(pageId: PageId): string[] {
  switch (pageId) {
    case "tarakeswar":
      return hubBody();
    case "tarakeswarTemple":
      return templeBody();
    case "tarakeswarFood":
      return foodBody();
    case "tarakeswarReach":
      return reachBody();
    case "tarakeswarBlog":
      return blogIndexBody();
    default:
      return [];
  }
}

const CATEGORY_LABEL: Record<DirectoryCategory, string> = {
  eat: "Eat",
  sweets: "Sweets",
  stay: "Stay",
  pharmacy: "Pharmacy",
  hospital: "Hospital / clinic",
  bank: "Bank / ATM",
};

function hubBody(): string[] {
  return [
    `<p>${escape(`Also spelled ${TARAKESWAR.spellings.join(", ")}, all the same place.`)}</p>`,
    `<h2>In this guide</h2>`,
    `<ul>` +
      [
        [PAGE_PATH.tarakeswarTemple, "Taraknath Mandir: temple history, timings and the mela calendar"],
        [PAGE_PATH.tarakeswarFood, "Where to eat and stay, and where the essentials are"],
        [PAGE_PATH.tarakeswarReach, "How to reach Tarakeswar by train, road and bus"],
        [PAGE_PATH.tarakeswarBlog, "The blog: eleven guides on specific questions"],
      ]
        .map(([href, label]) => `<li><a href="${href}">${escape(label)}</a></li>`)
        .join("") +
      `</ul>`,
    `<p><a href="${PAGE_PATH.home}">${escape(`More from Bengali Experience`)}</a></p>`,
  ];
}

function templeBody(): string[] {
  return [
    `<h2>History</h2>`,
    `<p>${escape(
      "Old accounts of who built the temple do not fully agree. One names Raja Bharamalla Rao as the builder in 1729. Another describes a devotee, Vishnu Das, who is said to have found the shivalinga after a cow was seen pouring milk over a buried stone, followed by a dream telling him to build a temple there. Both are told locally; neither is confirmed by a primary source found in research for this page.",
    )}</p>`,
    `<h2>Architecture</h2>`,
    `<p>${escape(
      "The temple is built in Bengal's atchala style, a tiered, sloping roof, with a natmandir, a prayer hall, in front, and smaller shrines to Kali and Lakshmi-Narayan within the same complex. Dudhpukur, the pond north of the temple, is where pilgrims traditionally bathe or pray before darshan.",
    )}</p>`,
    `<h2>Timings</h2>`,
    `<p>${escape(
      "Commonly reported as roughly 5 to 5:30 in the morning until 1 to 1:30 in the afternoon, reopening from about 4 until 7 to 8:30 in the evening, with longer hours on Shivratri, Gajan and the Mondays of Shravan. No official source publishes fixed timings.",
    )}</p>`,
    `<h2>The mela calendar</h2>`,
    `<p>${escape(
      "Maha Shivratri, in the Bengali month of Phalgun (February or March), is one busy night. The Shravani Mela, through the whole month of Shravan (roughly mid July to mid August), is the much larger month-long pilgrimage, when Bol Bom pilgrims walk in carrying Ganga water. Gajan runs up to five days, ending on Chaitra Sankranti in mid April. These are three different events, often mixed up online.",
    )}</p>`,
  ];
}

function foodBody(): string[] {
  const groups = Object.entries(CATEGORY_LABEL) as [DirectoryCategory, string][];
  const lists = groups
    .map(([cat, label]) => {
      const rows = DIRECTORY_ENTRIES.filter((e) => e.category === cat)
        .map((e) => `<li>${escape(e.name)}, ${escape(e.area)}</li>`)
        .join("");
      return rows ? `<h3>${escape(label)}</h3><ul>${rows}</ul>` : "";
    })
    .join("");

  const gaps = DIRECTORY_GAPS.map((g) => `<p>${escape(`${g.category}: ${g.note}`)}</p>`).join("");

  return [`<h2>Directory</h2>`, lists, gaps];
}

function reachBody(): string[] {
  return [
    `<h2>By train</h2>`,
    `<p>${escape(
      "Direct EMU locals run from Howrah to Tarakeswar station all day, about 1.5 hours, roughly 35 to 38 trains daily.",
    )}</p>`,
    `<h2>By road</h2>`,
    `<p>${escape(
      "Most map tools show 55 to 65 km from central Kolkata, mainly via State Highway 2 or State Highway 15, a drive of roughly 1 to 2 hours depending on traffic.",
    )}</p>`,
    `<h2>By bus</h2>`,
    `<p>${escape(
      "SBSTC and private buses run from Esplanade, Babughat, Arambagh and Serampore, taking about 2.5 to 3.5 hours.",
    )}</p>`,
    `<h2>Getting around</h2>`,
    `<p>${escape("Toto (e-rickshaw) covers the roughly 1 km from the station to the temple in about 10 minutes.")}</p>`,
  ];
}

function blogIndexBody(): string[] {
  const items = BLOG_POSTS.map(
    (p) => `<li><a href="${PAGE_PATH.tarakeswarBlog}/${p.slug}">${escape(p.title)}</a>. ${escape(p.excerpt)}</li>`,
  ).join("");
  return [`<h2>All posts</h2><ul>${items}</ul>`];
}

/** One blog post, rendered the same shape as every other page: heading,
 *  direct answer, then the sections and questions in document order. */
export function renderTarakeswarBlogPostBody(post: BlogPost): string {
  const sections = post.sections
    .map((s) => `<h2>${escape(s.heading)}</h2>${s.paragraphs.map((p) => `<p>${escape(p)}</p>`).join("")}`)
    .join("");

  return [
    `<div id="prerender">`,
    `<h1>${escape(post.h1)}</h1>`,
    `<p>${escape(post.intro)}</p>`,
    sections,
    `<h2>Questions</h2>${questions(post.faq)}`,
    `<p><a href="${PAGE_PATH.tarakeswarBlog}">More from the Tarakeswar blog</a> &middot; <a href="${PAGE_PATH.tarakeswar}">Tarakeswar guide</a></p>`,
    `</div>`,
  ].join("");
}
