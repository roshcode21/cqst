import { readFileSync } from "node:fs";

const readJson = name => JSON.parse(
  readFileSync(new URL(`./${name}`, import.meta.url), "utf8")
);

const copy = readJson("homeCopy.json");
const cycles = readJson("cycles.json");
const articles = readJson("articles.json");
const voices = readJson("voices.json");

const voiceBySlug = new Map(voices.map(voice => [voice.slug, voice]));
const articleBySlug = new Map(articles.map(article => [article.slug, article]));
const cycleBySlug = new Map(cycles.map(cycle => [cycle.slug, cycle]));

const currentCycle = cycles.find(cycle => cycle.status === "current");
if (!currentCycle) throw new Error("CQST necesita exactamente un ciclo actual para construir el home.");

const cycleArticles = articles.filter(article => article.cycle === currentCycle.slug);

const toStory = article => {
  const voice = voiceBySlug.get(article.author);
  if (!voice) throw new Error(`Voz desconocida en artículo ${article.slug}: ${article.author}`);

  return {
    slug: article.slug,
    title: article.title || "[tu título aquí]",
    author: voice.name,
    time: article.readingTime ? `${article.readingTime} min` : "",
    href: article.status === "published" ? `/${currentCycle.slug}/${article.slug}/` : null,
    status: article.status
  };
};

const stories = cycleArticles.map(toStory);

const featuredCards = copy.etcetera.featured.map(feature => {
  const article = articleBySlug.get(feature.article);
  if (!article) throw new Error(`Etcétera referencia un artículo inexistente: ${feature.article}`);

  const cycle = cycleBySlug.get(article.cycle);
  const voice = voiceBySlug.get(article.author);
  if (!cycle || !voice) throw new Error(`Datos incompletos para artículo destacado: ${article.slug}`);

  const pieces = [];
  if (article.readingTime) pieces.push(`${article.readingTime} min`);
  pieces.push(cycle.title);

  return {
    slug: article.slug,
    title: article.title || "[tu título aquí]",
    author: voice.name,
    meta: pieces.join(" · "),
    href: article.status === "published" ? `/${cycle.slug}/${article.slug}/` : null,
    image: feature.image,
    alt: feature.alt,
    status: article.status
  };
});

export default {
  hero: copy.hero,
  currentCycle: {
    slug: currentCycle.slug,
    title: currentCycle.title,
    deck: currentCycle.deck,
    voiceCount: currentCycle.expectedVoices || stories.length,
    stories
  },
  reader: {
    title: copy.reader.title,
    tagline: copy.reader.tagline,
    labCycles: [
      {
        slug: currentCycle.slug,
        title: currentCycle.title,
        count: currentCycle.expectedVoices || stories.length,
        status: "current",
        labOnly: false
      },
      ...copy.reader.prototypeCycles.map(cycle => ({ ...cycle, status: "prototype" }))
    ]
  },
  etcetera: {
    title: copy.etcetera.title,
    tagline: copy.etcetera.tagline,
    coda: copy.etcetera.coda,
    cta: copy.etcetera.cta,
    cards: featuredCards
  },
  about: copy.about,
  participate: copy.participate
};
