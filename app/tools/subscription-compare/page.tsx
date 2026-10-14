import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import data from '@/content/tools/subscriptions.json';
import { isPublishable } from '@/lib/tools/validate.mjs';
import type { Dataset } from '@/lib/tools/types';
import { SubscriptionCompare, type SubRow } from '@/components/tools/SubscriptionCompare';
import { ToolSources } from '@/components/tools/ToolSources';
import { SITE_NAME, SITE_URL_RESOLVED } from '@/lib/site';

export const revalidate = 3600;

const ds = data as unknown as Dataset<SubRow>;
const URL_PATH = '/tools/subscription-compare';

export function generateMetadata(): Metadata {
  if (!isPublishable(ds)) return { title: 'Not found', robots: { index: false, follow: false } };
  return {
    title: 'Game Pass vs PS Plus vs Switch Online: Price Per Month Compared',
    description: 'Compare console subscription tiers by real monthly cost in your region, with what each tier includes and the official price source for every figure.',
    alternates: { canonical: SITE_URL_RESOLVED + URL_PATH },
  };
}

export default function SubscriptionComparePage() {
  if (!isPublishable(ds)) notFound();
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'WebApplication', name: `${SITE_NAME} subscription comparison`,
    url: SITE_URL_RESOLVED + URL_PATH, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link href="/" className="text-sm text-primary">Home</Link>
      <h1 className="mt-5 text-4xl font-semibold tracking-tight">Console subscription comparison</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Every tier of Game Pass, PlayStation Plus and Nintendo Switch Online, compared by what it really costs per
        month in your region. Prices link to the platform&apos;s own page and show the date we checked them.
      </p>
      <SubscriptionCompare rows={ds.rows} />
      <ToolSources facts={ds.facts} generatedAt={ds.generated_at} />
    </article>
  );
}
