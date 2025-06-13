import imagePlugin from "./eleventy.config.images.js";
import htmlmin from "html-minifier-terser";

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function(eleventyConfig) {
  // Passthrough static assets
  eleventyConfig
  .addPassthroughCopy("content/theme/")
  .addPassthroughCopy("content/images/")
  .addPassthroughCopy({"content/images/logos/favicon.ico": "favicon.ico"});
  eleventyConfig.setServerPassthroughCopyBehavior("passthrough");
  eleventyConfig.addWatchTarget("content/**/*.{jpg,jpeg,png,gif,css,svg}");

  // Lightbox 2 ( https://github.com/lokesh/lightbox2 )
  eleventyConfig.addPassthroughCopy({
    "node_modules/lightbox2/dist/js/lightbox.min.js": "lightbox2/js/lightbox.min.js",
    "node_modules/lightbox2/dist/css/lightbox.min.css": "lightbox2/css/lightbox.min.css",
    "node_modules/lightbox2/dist/images": "lightbox2/images"
  });

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
