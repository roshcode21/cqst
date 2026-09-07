export default function (eleventyConfig) {
  /* Production assets are shared by the current site and the Eleventy build. */
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });

  /*
   * Strangler migration: keep legacy public routes alive until their Eleventy
   * replacement lands. Empezar itself is now generated from src/, while its
   * published article remains passthrough until the article template migrates.
   */
  [
    "cqst",
    "empezar/la-fecha-la-ponemos-despues",
    "privacidad",
    "temas",
    "voces",
    "feed.xml",
    "robots.txt",
    "sitemap.xml",
    "site.webmanifest"
  ].forEach(path => eleventyConfig.addPassthroughCopy(path));

  eleventyConfig.addFilter("isoDate", value => {
    if (!value) return "";
    return new Date(value).toISOString();
  });

  eleventyConfig.addFilter("json", value => JSON.stringify(value));

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["njk", "md", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk"
  };
}
