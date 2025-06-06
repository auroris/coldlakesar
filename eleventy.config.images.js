import { fileURLToPath } from 'url';
import path from 'path';
import fs from "fs";
import eleventyImage from "@11ty/eleventy-img";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function fileExists(filePath) {
    try {
        fs.accessSync(filePath, fs.constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

function tryExtensions(basePath, extensions) {
    for (const ext of extensions) {
        const fullPath = `${basePath}.${ext}`;
        if (fileExists(fullPath)) return fullPath;
    }
    return null;
}

function resolveImagePath(src, extensions) {
    const baseSrc = src.replace(/\.[^/.]+$/, ""); // strip extension
    const searchRoots = [
        path.join(__dirname, "content", "images"),
        path.join(__dirname) // project root fallback
    ];

    for (const root of searchRoots) {
        const directPath = path.join(root, src);
        if (fileExists(directPath)) {
            //console.log(`[resolveImagePath] Found exact file: ${directPath}`);
            return directPath;
        }

        const extended = tryExtensions(path.join(root, baseSrc), extensions);
        if (extended) {
            console.log(`[resolveImagePath] Found with extension: ${extended}`);
            return extended;
        }
    }

    console.error(`[resolveImagePath] Image not found: "${src}". Tried in /content/images and project root.`);
    return null;
}

function parseCropFocus(focusStr) {
    if (!focusStr) return "center";
    if (typeof focusStr !== "string") return focusStr;

    const normalized = focusStr.trim().toLowerCase();
    const keywords = new Set([
        "center", "centre", "top", "right top", "right", "right bottom", "left top", "left", "left bottom",
        "north", "northeast", "east", "southeast", "south", "southwest", "west", "northwest",
        "entropy", "attention"
    ]);
    if (keywords.has(normalized)) return normalized;

    if (normalized.startsWith("{")) {
        try {
            const fixed = focusStr.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*)(\s*:)/g, '$1"$2"$3');
            return JSON.parse(fixed);
        } catch {
            return "center";
        }
    }

    if (/[:,]/.test(normalized) && !normalized.includes("{")) {
        const obj = {};
        try {
            normalized.split(",").forEach(pair => {
                const [key, value] = pair.split(":").map(s => s.trim());
                if (key && value !== undefined) {
                    obj[key] = isNaN(Number(value)) ? value : Number(value);
                }
            });
            return obj;
        } catch {
            return "center";
        }
    }

    return "center";
}

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
export default function(eleventyConfig) {
    eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
    eleventyConfig.addNunjucksAsyncShortcode("linkedImage", (...args) =>
        imageShortcode(...args.slice(0, 4), true, ...args.slice(4))
    );

    async function imageShortcode(
        src, alt = "",
        widths = "300",
        sizes = "300px",
        linkOriginal = false,
        cropWidth,
        cropHeight,
        cropFocus = "entropy"
    ) {
        const extensions = ["jpg", "jpeg", "png", "gif", "webp"];
        const formats = ["jpeg", "auto"];
        if (typeof widths === "string") widths = widths.split(",").map(s => s.trim());

        const file = resolveImagePath(src, extensions);
        if (!file) {
            console.warn(`[imageShortcode] File not found for src="${src}". Skipping.`);
            return `<img alt="${alt}" src="" loading="lazy" decoding="async" />`;
        }

        const crop = cropWidth && cropHeight;
        const imageOptions = {
            widths,
            formats,
            outputDir: path.join(eleventyConfig.dir.output, "img"),
            filenameFormat(id, src, width, format) {
                const name = path.basename(src, path.extname(src));
                return `img--${name}${crop ? `-w${cropWidth}-h${cropHeight}-cropped` : `-w${width}`}.${format}`;
            }
        };

        if (crop) {
            imageOptions.transform = (sharp) =>
                sharp.resize({
                    width: cropWidth,
                    height: cropHeight,
                    fit: "cover",
                    position: parseCropFocus(cropFocus)
                });
        }

        const metadata = await eleventyImage(file, imageOptions);

        const imageAttributes = {
            alt,
            sizes,
            loading: "lazy",
            decoding: "async",
        };

        let imageHtml;
        if (crop) {
            const format = formats.find(fmt => metadata[fmt]) || Object.keys(metadata)[0];
            const imageData = metadata[format][metadata[format].length - 1]; // Get the largest version
            imageHtml = `<img src="${imageData.url}" width="${cropWidth}" height="${cropHeight}" alt="${alt}" loading="lazy" decoding="async" style="aspect-ratio:${cropWidth}/${cropHeight};" srcset="${metadata[format].map(e => `${e.url} ${e.width}w`).join(", ")}" sizes="${sizes || `${cropWidth}px`}" />`;
        } else {
            imageHtml = eleventyImage.generateHTML(metadata, imageAttributes);
        }

        const originalUrl = src.startsWith("/") ? src : `/${src}`;

        console.log(linkOriginal ? `<a href="${originalUrl}">${imageHtml}</a>` : imageHtml);
        return linkOriginal ? `<a href="${originalUrl}">${imageHtml}</a>` : imageHtml;
    }
}
