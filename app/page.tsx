import Link from 'next/link';
import Image from 'next/image';
import { getLatestArticles, getFeaturedArticles, getCategories } from '@/lib/queries';
import { getArticleUrl, thumbFor, SITE_URL_RESOLVED, SITE_NAME } from '@/lib/site';
import { PLATFORM_COLORS } from '@/lib/types';
import type { ArticleWithRelations } from '@/lib/types';

export const revalidate = 300;

const PLATFORM_BLURBS: Record<string, string> = {
  playstation: 'PS5, PS5 Pro and what is exclusive',
  xbox: 'Series X|S and Game Pass tiers',
  nintendo: 'Switch 2 and what changed',
  handhelds: 'Steam Deck and handheld PCs',
};

const colorFor = (article: ArticleWithRelations) =>
  PLATFORM_COLORS[article.category?.slug || 'releases'] || PLATFORM_COLORS.releases;

function StoryCard({ article }: { article: ArticleWithRelations }) {
  return (
    <Link
      href={getArticleUrl(article)}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
    >
      <span className="h-2 w-full" style={{ backgroundColor: colorFor(article) }} aria-hidden="true" />
      {article.hero_image && (
        <Image
          src={thumbFor(article.hero_image)}
          alt=""
          width={600}
          height={338}
          className="aspect-video w-full object-cover"
        />
      )}
      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm font-semibold" style={{ color: colorFor(article) }}>
          {article.category?.name}
        </p>
        <h3 className="mt-1.5 text-lg font-bold leading-snug underline-offset-4 group-hover:underline">
          {article.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{article.excerpt}</p>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const [articles, featured, categories] = await Promise.all([
    getLatestArticles(40),
    getFeaturedArticles(1),
    getCategories(),
  ]);
  const lead = featured[0] || articles[0] || null;
  const rest = articles.filter((a) => a.id !== lead?.id);
  const platforms = categories.filter((c) => c.slug in PLATFORM_BLURBS);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL_RESOLVED,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-14">
        <h1 className="max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
          What are you playing on?
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Pick your console to see what is releasing, what is exclusive and which hardware is worth buying.
        </p>

        <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {platforms.map((platform) => (
            <li key={platform.id}>
              <Link
                href={`/${platform.slug}`}
                className="flex h-full min-h-[8.5rem] flex-col justify-end rounded-3xl p-5 text-white transition-transform hover:-translate-y-1"
                style={{ backgroundColor: PLATFORM_COLORS[platform.slug] }}
              >
                <span className="text-2xl font-extrabold tracking-tight">{platform.name}</span>
                <span className="mt-1 text-sm font-medium leading-snug">{PLATFORM_BLURBS[platform.slug]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {lead && (
        <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
          <h2 className="text-2xl font-extrabold tracking-tight">This month on consoles</h2>
          <Link
            href={getArticleUrl(lead)}
            className="group mt-5 grid overflow-hidden rounded-3xl border border-border bg-card md:grid-cols-[1.3fr_1fr]"
          >
            {lead.hero_image && (
              <Image
                src={lead.hero_image}
                alt={lead.hero_image_alt || ''}
                width={1600}
                height={900}
                priority
                className="h-full w-full object-cover"
              />
            )}
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <h3 className="text-2xl font-extrabold leading-tight tracking-tight underline-offset-4 group-hover:underline sm:text-3xl">
                {lead.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{lead.excerpt}</p>
              <p className="mt-5 inline-flex w-fit rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                See the calendar
              </p>
            </div>
          </Link>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <h2 className="text-2xl font-extrabold tracking-tight">Latest</h2>
        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <StoryCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </>
  );
}
