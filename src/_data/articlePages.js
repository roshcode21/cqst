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

const published = articles
  .filter(article => article.status === "published")
  .sort((a, b) => {
    if (a.cycle === b.cycle) return (a.order ?? 999) - (b.order ?? 999);
    return new Date(a.published || 0) - new Date(b.published || 0);
  });

export default published.map(article => {
  const cycle = cycleBySlug.get(article.cycle);
  const author = voiceBySlug.get(article.author);

  if (!cycle) throw new Error(`Ciclo desconocido en ${article.slug}: ${article.cycle}`);
  if (!author) throw new Error(`Voz desconocida en ${article.slug}: ${article.author}`);

  const cycleArticles = published.filter(item => item.cycle === article.cycle);
  const position = cycleArticles.findIndex(item => item.slug === article.slug);
  const previous = position > 0 ? cycleArticles[position - 1] : null;
  const next = position >= 0 && position < cycleArticles.length - 1 ? cycleArticles[position + 1] : null;
  const href = `/${cycle.slug}/${article.slug}/`;

  const toNavItem = item => {
    if (!item) return null;
    const itemAuthor = voiceBySlug.get(item.author);
    return {
      title: item.title,
      author: itemAuthor?.name || "",
      href: `/${cycle.slug}/${item.slug}/`
    };
  };

  return {
    article,
    cycle,
    author: {
      ...author,
      initials: initials(author.name),
      profileHref: `/voces/${author.slug}/`
    },
    bodyHtml: readArticleBody(article),
    href,
    canonical: `https://cadaquiensutema.com${href}`,
    dateLabel: formatDate(article.published),
    modifiedLabel: formatDate(article.modified),
    timeRequired: article.readingTime ? `PT${article.readingTime}M` : "",
    previous: toNavItem(previous),
    next: toNavItem(next),
    related: cycleArticles
      .filter(item => item.slug !== article.slug)
      .slice(0, 3)
      .map(toNavItem)
  };
});
