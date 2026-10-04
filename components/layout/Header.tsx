'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';
import { useSearch } from '@/components/search/SearchProvider';
import { SITE_NAME } from '@/lib/site';
import { PLATFORM_COLORS } from '@/lib/types';

const NAV_ITEMS = [
  { label: 'PlayStation', href: '/playstation', slug: 'playstation' },
  { label: 'Xbox', href: '/xbox', slug: 'xbox' },
  { label: 'Nintendo', href: '/nintendo', slug: 'nintendo' },
  { label: 'Handhelds', href: '/handhelds', slug: 'handhelds' },
  { label: 'Releases', href: '/releases', slug: 'releases' },
];

function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
      <rect x="2" y="2" width="13" height="13" rx="4" fill={PLATFORM_COLORS.playstation} />
      <rect x="17" y="2" width="13" height="13" rx="4" fill={PLATFORM_COLORS.xbox} />
      <rect x="2" y="17" width="13" height="13" rx="4" fill={PLATFORM_COLORS.nintendo} />
      <rect x="17" y="17" width="13" height="13" rx="4" fill={PLATFORM_COLORS.handhelds} />
    </svg>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openSearch } = useSearch();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${SITE_NAME} home`}>
          <Logo />
          <span className="text-2xl font-extrabold tracking-tight">{SITE_NAME}</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} className="group flex items-center gap-2 text-sm font-semibold">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: PLATFORM_COLORS[item.slug] }}
                aria-hidden="true"
              />
              <span className="underline-offset-4 group-hover:underline">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button
            onClick={openSearch}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="absolute right-0 top-0 h-full w-72 max-w-full bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-lg font-extrabold">{SITE_NAME}</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-secondary"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-6 flex flex-col gap-2" aria-label="Mobile navigation">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-4 py-3 text-base font-semibold text-white"
                  style={{ backgroundColor: PLATFORM_COLORS[item.slug] }}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
