# Cold Lake Search and Rescue Society Website

The public website for the **Cold Lake Search and Rescue Society**, a volunteer-run, non-profit organization dedicated to locating and assisting individuals missing in the wilderness areas surrounding the Lakeland region in Cold Lake, Alberta.

Built with [Eleventy](https://www.11ty.dev/) (11ty), a static site generator.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local development server (with live reload):

```bash
npm start
```

The site will be available at `http://localhost:8080`.

## Build

**Development** (no HTML minification):

```bash
npm run build
```

**Production** (with HTML minification):

```bash
npm run build:production
```

Output is written to the `_site/` directory.

## Project Structure

```
content/           Page content (Markdown) and static assets
  images/          Site images and logos
  theme/           CSS, JavaScript, and webfonts
_includes/         Nunjucks templates and partials
_data/             Site metadata (JSON)
eleventy.config.js         Eleventy configuration
eleventy.config.images.js  Custom image optimization plugin
```

### Content Pages

| Page       | File                  | Description                          |
|------------|-----------------------|--------------------------------------|
| Home       | `content/index.md`    | Landing page                         |
| About      | `content/about.md`    | Organization overview                |
| Join       | `content/join.md`     | Volunteer recruitment info           |
| Links      | `content/links.md`    | Related SAR organizations and resources |

Pages are authored in Markdown with Nunjucks front matter for layout selection.

## Key Dependencies

| Package | Purpose |
|---------|---------|
| [@11ty/eleventy](https://www.11ty.dev/) | Static site generator |
| [@11ty/eleventy-img](https://www.11ty.dev/docs/plugins/image/) | Responsive image optimization |
| [html-minifier-terser](https://github.com/terser/html-minifier-terser) | HTML minification for production builds |
| [lightbox2](https://lokeshdhakar.com/projects/lightbox2/) | Image gallery lightbox |

## Adding / Editing Content

1. Edit or create Markdown files in the `content/` directory.
2. Set the `layout` and `title` in the YAML front matter at the top of the file.
3. Run `npm start` to preview changes locally.

## License

ISC

Site design based on [HTML5 UP](https://html5up.net/) (CCA 3.0).
