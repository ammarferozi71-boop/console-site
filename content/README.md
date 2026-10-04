# SaveSlot content

All site content lives in `launch.json`: categories (one per platform, plus Releases), topics, the publication byline and articles.

## Add or update an article

Write a Markdown draft with `# TITLE`, `# SLUG`, `# META TITLE`, `# META DESCRIPTION`, `# ARTICLE BODY` and `# EXTERNAL SOURCES USED` sections, then run:

    node scripts/import-article.mjs draft.md --category <playstation|xbox|nintendo|handhelds|releases> --tags a,b --hero <image path> --hero-alt "..."

## Images

- Original graphics: `public/images/articles/<name>.webp` (1600x900) with a card version saved as `<name>-thumb.webp`.
- Official game artwork: add the game to `content/game-images.json` with its Steam app ID, then use `/images/games/<slug>.jpg` as the article's hero. The artwork is downloaded when the site is built. `/api/image-status` shows what the last build downloaded.

## Site settings

The site name, tagline and description are in `lib/site.ts`. Section colours are in `lib/types.ts` (`PLATFORM_COLORS`). Set `NEXT_PUBLIC_SITE_URL` to the site's real address and `NEXT_PUBLIC_CONTACT_EMAIL` to enable the Contact page.
