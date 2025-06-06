import imagePlugin from "./eleventy.config.images.js";
import htmlmin from "html-minifier-terser";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function(eleventyConfig) {
  // Passthrough static assets
  eleventyConfig
  .addPassthroughCopy("content/theme/")
  .addPassthroughCopy("content/images/")
  .addPassthroughCopy("content/favicon.ico");
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
  eleventyConfig.addWatchTarget("content/**/*.{jpg,jpeg,png,gif,css}");

  // Plugins
  eleventyConfig.addPlugin(imagePlugin);

  eleventyConfig.setNunjucksEnvironmentOptions({
    trimBlocks: true,
    lstripBlocks: true
  });

  const htmlMinifier = process.env.HTML_MINIFIER === "true";
  if (htmlMinifier) {
    eleventyConfig.addTransform("htmlmin", async function(content, outputPath) {
      if (outputPath && outputPath.endsWith(".html")) {
        return await htmlmin.minify(content, {
          collapseWhitespace: true,
          removeComments: true,
          minifyCSS: true,
          minifyJS: true,
          useShortDoctype: true
        });
      }
      return content;
    });
  }

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
