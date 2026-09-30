export default {
  eleventyComputed: {
    title: data => data.articlePage?.article?.title || "",
    seoTitle: data => data.articlePage ? `${data.articlePage.article.title} — ${data.articlePage.cycle.title} | ${data.site.name}` : data.site.name,
    description: data => data.articlePage?.article?.description || data.site.description,
    canonical: data => data.articlePage?.canonical || data.site.url,
    shareImage: data => data.articlePage?.article?.shareImage || data.articlePage?.cycle?.shareImage || "/assets/brand/icon-512.png",
    shareImageAlt: data => data.articlePage ? `${data.articlePage.article.title}, pieza del ciclo ${data.articlePage.cycle.title}` : data.site.name,
    ogType: () => "article",
    ogTitle: data => data.articlePage?.article?.title || data.site.name,
    ogDescription: data => data.articlePage?.article?.description || data.site.description,
    themeColor: () => "#f4f2ec",
    stylesheet: () => "/assets/css/production/article-final.css",
    script: () => "/assets/js/production/article.js",
    bodyClass: data => data.articlePage ? `article-page article-page--${data.articlePage.cycle.visualTheme || data.articlePage.cycle.slug}` : "article-page"
  }
};