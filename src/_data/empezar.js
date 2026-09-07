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

const statusLabel = status => ({
  published: copy.publishedLabel,
  scheduled: copy.scheduledLabel,
  draft: copy.draftLabel
}[status] || status);

const pieces = articles
  .filter(article => article.cycle === cycle.slug)
  .map((article, index) => {
    const voice = voiceBySlug.get(article.author);
    if (!voice) throw new Error(`Voz desconocida en ${article.slug}: ${article.author}`);

    return {
      order: index + 1,
      slug: article.slug,
      title: article.title || copy.untitledLabel,
      description: article.description,
      excerpt: article.excerpt || "",
      author: voice.name,
      authorSlug: voice.slug,
      readingTime: article.readingTime,
      genre: article.genre,
      status: article.status,
      statusLabel: statusLabel(article.status),
      href: article.status === "published" ? `/${cycle.slug}/${article.slug}/` : null,
      published: article.published,
      subjects: article.subjects || []
    };
  });

const publishedPieces = pieces.filter(piece => piece.href);

export default {
  cycle,
  copy,
  pieces,
  publishedPieces,
  voiceCount: cycle.expectedVoices || pieces.length,
  publishedCount: publishedPieces.length,
  year: new Date(`${cycle.dateStart}T12:00:00Z`).getUTCFullYear()
};
