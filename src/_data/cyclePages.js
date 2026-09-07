import { readFileSync } from "node:fs";

const readJson = name => JSON.parse(
  readFileSync(new URL(`./${name}`, import.meta.url), "utf8")
);

const cycles = readJson("cycles.json");
const articles = readJson("articles.json");
const voices = readJson("voices.json");
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

const newestDate = values => values
  .filter(Boolean)
  .sort((a, b) => new Date(b) - new Date(a))[0] || "";

const unique = values => [...new Set(values.filter(Boolean))];

export default cycles
  .filter(cycle => cycle.status !== "hidden")
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
  .map(cycle => {
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
          description: article.description || "",
          excerpt: article.excerpt || "",
          author: voice.name,
          authorSlug: voice.slug,
          readingTime: article.readingTime,
          genre: article.genre,
          status: article.status,
          isPublished,
          featuredInCycle: Boolean(article.featuredInCycle),
          href: isPublished ? `/${cycle.slug}/${article.slug}/` : "#",
          published: article.published,
          modified: article.modified,
          dateLabel: formatDate(article.published),
          subjects: article.subjects || []
        };
      });

    const publishedPieces = pieces.filter(piece => piece.isPublished);
    const allUntil = cycle.rail?.allUntil ?? 10;
    const selectionSize = cycle.rail?.selectionSize ?? 6;

    let railPieces = pieces;
    let railIsCurated = false;

    if (pieces.length > allUntil) {
      railIsCurated = true;
      const featured = pieces.filter(piece => piece.featuredInCycle);
      const remaining = pieces
        .filter(piece => !piece.featuredInCycle)
        .sort((a, b) => {
          const dateA = a.modified || a.published || "0000-01-01";
          const dateB = b.modified || b.published || "0000-01-01";
          return new Date(dateB) - new Date(dateA) || a.order - b.order;
        });
      railPieces = [...featured, ...remaining].slice(0, selectionSize);
    }

    const dateModified = newestDate(
      publishedPieces.flatMap(piece => [piece.modified, piece.published])
    ) || cycle.dateStart;

    const keywords = unique([
      ...(cycle.subjects || []),
      ...publishedPieces.flatMap(piece => piece.subjects || [])
    ]);

    return {
      cycle,
      pieces,
      publishedPieces,
      railPieces,
      railIsCurated,
      pieceCount: pieces.length,
      publishedCount: publishedPieces.length,
      voiceCount: unique(pieces.map(piece => piece.authorSlug)).length,
      hasOtherCycles: cycles.some(item => item.slug !== cycle.slug && item.status !== "hidden"),
      dateModified,
      keywords
    };
  });
