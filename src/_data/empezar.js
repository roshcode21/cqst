import { readFileSync } from "node:fs";

const readJson = name => JSON.parse(
  readFileSync(new URL(`./${name}`, import.meta.url), "utf8")
);

const cycles = readJson("cycles.json");
const articles = readJson("articles.json");
const voices = readJson("voices.json");
const cycleCopy = readJson("cycleCopy.json");

const cycle = cycles.find(item => item.slug === "empezar");
if (!cycle) throw new Error("No existe el ciclo Empezar en cycles.json.");

const copy = cycleCopy[cycle.slug];
if (!copy) throw new Error(`Falta copy editorial para el ciclo ${cycle.slug}.`);

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

const pieces = articles
  .filter(article => article.cycle === cycle.slug)
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
  .map((article, index) => {
    const voice = voiceBySlug.get(article.author);
    if (!voice) throw new Error(`Voz desconocida en ${article.slug}: ${article.author}`);

    const isPublished = article.status === "published";
    const title = article.title || `Pieza de ${voice.name}`;

    return {
      order: article.order ?? index + 1,
      slug: article.slug,
      title,
      description: article.description,
      excerpt: article.excerpt || "",
      author: voice.name,
      authorSlug: voice.slug,
      readingTime: article.readingTime,
      genre: article.genre,
      status: article.status,
      isPublished,
      href: isPublished ? `/${cycle.slug}/${article.slug}/` : "#",
      published: article.published,
      dateLabel: formatDate(article.published),
      subjects: article.subjects || []
    };
  });

const publishedPieces = pieces.filter(piece => piece.isPublished);
const uniqueVoices = new Set(pieces.map(piece => piece.authorSlug));
const otherCycles = cycles.filter(item => item.slug !== cycle.slug);
const publishedDates = publishedPieces.map(piece => piece.published).filter(Boolean).sort();
const dateModified = publishedDates.at(-1) || cycle.dateStart || "";
const keywords = [...new Set([...(cycle.subjects || []), ...publishedPieces.flatMap(piece => piece.subjects || [])])];

export default {
  cycle,
  copy,
  pieces,
  publishedPieces,
  pieceCount: pieces.length,
  voiceCount: uniqueVoices.size,
  dateModified,
  keywords,
  hasOtherCycles: otherCycles.length > 0
};
