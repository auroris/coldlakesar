/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function(eleventyConfig) {
  // Passthrough static assets
  eleventyConfig
  .addPassthroughCopy("content/theme/")
  .addPassthroughCopy("content/images/")
  .addPassthroughCopy("content/favicon.ico");
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  eleventyConfig.setNunjucksEnvironmentOptions({
    trimBlocks: true,
    lstripBlocks: true
  });

  eleventyConfig.addWatchTarget("content/**/*.{jpg,jpeg,png,gif,css}");

  return {
    templateFormats: ["md", "njk", "html", "liquid"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "content",
      includes: "../_includes",
      data: "../_data",
      output: "_site"
    },
    pathPrefix: "/"
  };
}
