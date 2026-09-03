export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });

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
