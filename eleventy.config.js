export default function (eleventyConfig) {
  /* Production assets are already shared by the lab and the new build. */
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });

  /*
   * Strangler migration: keep current public routes alive while each page is
   * rebuilt under src/. Remove a passthrough entry the moment its Eleventy
   * replacement lands. This prevents the home refactor from breaking existing
   * URLs during the editorial-system migration.
   */
  [
    "cqst",
    "empezar",
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
