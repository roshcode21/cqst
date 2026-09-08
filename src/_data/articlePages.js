import { existsSync, readFileSync } from "node:fs";

const readJson = name => JSON.parse(
  readFileSync(new URL(`./${name}`, import.meta.url), "utf8")
);

const articles = readJson("articles.json");
const cycles = readJson("cycles.json");
const voices = readJson("voices.json");

const cycleBySlug = new Map(cycles.map(cycle => [cycle.slug, cycle]));
const voiceBySlug = new Map(voices.map(voice => [voice.slug, voice]));

const formatDate = value => {
  if (!value) return "";
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${value}T12:00:00Z`));
};

const initials = name => name
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map(part => part[0])
  .join("")
  .toUpperCase();

const readArticleBody = article => {
  if (!article.contentFile) return "";
  const path = new URL(`../_content/articles/${article.contentFile}`, import.meta.url);
  if (!existsSync(path)) throw new Error(`Falta el contenido de ${article.slug}: ${article.contentFile}`);
  return readFileSync(path, "utf8").trim();
};

const byOrder = (a, b) => (a.order ?? 999) - (b.order ?? 999);

const published = articles
  .filter(article => article.status === "published")
  .sort((a, b) => {
    if (a.cycle === b.cycle) return byOrder(a, b);
    return new Date(a.published || 0) - new Date(b.published || 0);
  });

export default published.map(article => {
  const cycle = cycleBySlug.get(article.cycle);
  const author = voiceBySlug.get(article.author);

  if (!cycle) throw new Error(`Ciclo desconocido en ${article.slug}: ${article.cycle}`);
  if (!author) throw new Error(`Voz desconocida en ${article.slug}: ${article.author}`);

  const href = `/${cycle.slug}/${article.slug}/`;
  const publishedCycleArticles = published.filter(item => item.cycle === article.cycle).sort(byOrder);
  const publishedPosition = publishedCycleArticles.findIndex(item => item.slug === article.slug);
  const previous = publishedPosition > 0 ? publishedCycleArticles[publishedPosition - 1] : null;
  const next = publishedPosition >= 0 && publishedPosition < publishedCycleArticles.length - 1
    ? publishedCycleArticles[publishedPosition + 1]
    : null;

  const allCycleArticles = articles
    .filter(item => item.cycle === article.cycle)
    .sort(byOrder);
  const allPosition = allCycleArticles.findIndex(item => item.slug === article.slug);

  const toEntry = item => {
    if (!item) return null;
    const itemAuthor = voiceBySlug.get(item.author);
    const isPublished = item.status === "published";
    const displayTitle = item.title || `Pieza de ${itemAuthor?.name || "esta voz"}`;
    return {
      slug: item.slug,
      title: displayTitle,
      author: itemAuthor?.name || "",
      readingTime: item.readingTime || null,
      excerpt: item.excerpt || item.deck || "",
      href: isPublished ? `/${cycle.slug}/${item.slug}/` : "#",
      previewOnly: !isPublished,
      isCurrent: item.slug === article.slug
    };
  };

  const cycleEntries = allCycleArticles.map(toEntry);
  const continuationSource = allCycleArticles[allPosition + 1]
    || allCycleArticles.find(item => item.slug !== article.slug)
    || null;

  return {
    article,
    cycle,
    author: {
      ...author,
      initials: initials(author.name),
      profileHref: "#",
      imageHref: `/assets/voices/${author.slug}.jpg`
    },
    bodyHtml: readArticleBody(article),
    href,
    canonical: `https://cadaquiensutema.com${href}`,
    dateLabel: formatDate(article.published),
    modifiedLabel: formatDate(article.modified),
    timeRequired: article.readingTime ? `PT${article.readingTime}M` : "",
    previous: toEntry(previous),
    next: toEntry(next),
    cycleEntries,
    continuation: toEntry(continuationSource),
    related: publishedCycleArticles
      .filter(item => item.slug !== article.slug)
      .slice(0, 3)
      .map(toEntry)
  };
});
