import Link from 'next/link';
import type { Metadata } from 'next';
import { SITE_NAME, SITE_URL_RESOLVED } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description: `${SITE_NAME} covers console and handheld gaming: what is releasing, what is exclusive and which hardware to choose.`,
  alternates: { canonical: SITE_URL_RESOLVED + '/about' },
};

const heading = 'text-2xl font-semibold';
const paragraph = 'mt-3 leading-relaxed text-muted-foreground';

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link href="/" className="text-sm text-primary">Home</Link>
      <h1 className="mt-5 text-4xl font-semibold tracking-tight">About {SITE_NAME}</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        {SITE_NAME} is organised by what you play on. Pick PlayStation, Xbox, Nintendo or handhelds and
        see what is releasing, what is exclusive and which hardware is worth buying.
      </p>

      <section className="mt-8">
        <h2 className={heading}>What we cover</h2>
        <p className={paragraph}>
          Monthly release calendars by console, exclusives and delayed versions, subscription tiers
          such as Game Pass, and plain comparisons between consoles and handhelds.
        </p>
      </section>

      <section className="mt-8">
        <h2 className={heading}>Where the information comes from</h2>
        <p className={paragraph}>
          Coverage is built from publisher and platform holder announcements and official store pages,
          with sources linked at the end of each article. When we rely on another publication&apos;s
          report, we say so, and we mark details that are reported but not confirmed.
        </p>
      </section>

      <section className="mt-8">
        <h2 className={heading}>What we do not do</h2>
        <p className={paragraph}>
          We do not publish review scores or performance claims from our own testing. Comparison pages
          explain the published differences between products; they are not hands-on reviews. We are
          not affiliated with Sony, Microsoft, Nintendo or Valve.
        </p>
      </section>

      <nav className="mt-10 flex flex-wrap gap-5 text-primary">
        <Link href="/editorial-standards">Editorial standards</Link>
        <Link href="/privacy">Privacy policy</Link>
      </nav>
    </article>
  );
}
