# Blog architecture

This project uses a **hybrid** blog pipeline: Markdown/MDX in `src/content/blog/` by default, with an optional **Strapi** source when `STRAPI_URL` is set (`src/lib/strapi.ts`).

## Main feed vs news archive

- **Main listing** (`/blog`, `/blog/page/*`, `/blog/tag/*`, RSS): uses `getPostsForMainFeed()` from `src/lib/blog.ts`. Posts tagged **`news`** (case-insensitive) with a `publishedDate` **older than three rolling months** are **excluded** so they do not compete with evergreen content.
- **Archive** (`/blog/archive`): shows only those excluded **old news** posts (`getArchivedNewsPosts()` / same rules inverted).

Constants: `NEWS_TAG`, `NEWS_ARCHIVE_MONTHS`, `BLOG_POSTS_PER_PAGE` live in `src/lib/blog.ts`—change them in one place.

## Pagination

- Homepage-style grid on `/blog` shows the first `BLOG_POSTS_PER_PAGE` posts (currently 9).
- **Page 2+** lives at `/blog/page/2`, … and uses the **same** filtered list and page size so counts stay consistent.

## Strapi vs local MDX

- Local files: rendered with `render()` from `astro:content` (MDX components supported).
- Strapi entries: marked with `__fromStrapi: true`. HTML `body` is output via `set:html` and is treated as **trusted CMS output** (sanitize at the CMS or add a server-side sanitizer if untrusted users can author HTML).

Drafts: Strapi articles with `draft: true` are not returned.

## Newsletter (blog index)

The form reads **`PUBLIC_NEWSLETTER_SUBMIT_URL`** (public env). If it is **empty**, submit runs in **demo mode** (success after a short delay, no network). If set, the client `POST`s JSON `{ "email": string }` to that URL—your endpoint must accept CORS from your site or use a same-origin proxy.

This static Astro build does **not** ship a built-in `/api/subscribe` route; use an external provider (Buttondown, ConvertKit, your API, etc.) or add a server adapter and an Astro endpoint.

## Related files

| Area        | Files |
|------------|--------|
| Rules      | `src/lib/blog.ts` |
| Fetch      | `src/lib/strapi.ts` |
| Routes     | `src/pages/blog/*` |
| Schemas    | `src/content.config.ts` |
| RSS        | `src/pages/rss.xml.ts` |
