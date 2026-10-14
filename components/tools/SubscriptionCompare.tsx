'use client';

import { useMemo, useState } from 'react';
import { comparePlans, regions as listRegions } from '@/lib/tools/subs.mjs';
import type { BaseRow } from '@/lib/tools/types';

export interface SubRow extends BaseRow {
  service: string; tier: string; region: string;
  price: number; currency: string; period: 'month' | 'quarter' | 'year'; perks: string[];
}
type Plan = { service: string; tier: string; currency: string; perks: string[]; best: SubRow & { monthly: number }; options: (SubRow & { monthly: number })[] };

const money = (n: number, c: string) => new Intl.NumberFormat('en', { style: 'currency', currency: c }).format(n);
const PERIOD: Record<string, string> = { month: 'monthly', quarter: 'every 3 months', year: 'yearly' };

export function SubscriptionCompare({ rows }: { rows: SubRow[] }) {
  const regions = listRegions(rows) as string[];
  const [region, setRegion] = useState(regions.includes('US') ? 'US' : regions[0]);
  const [perk, setPerk] = useState('');
  const plans = useMemo(
    () => comparePlans(rows, region, perk ? { mustHave: [perk] } : {}) as Plan[],
    [rows, region, perk],
  );
  const perks = useMemo(() => [...new Set(rows.filter((r) => r.region === region).flatMap((r) => r.perks))].sort(), [rows, region]);

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-4">
        <label className="text-sm font-medium">Region
          <select className="ml-2 rounded-md border bg-background px-3 py-2 text-sm" value={region} onChange={(e) => setRegion(e.target.value)}>
            {regions.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">Must include
          <select className="ml-2 rounded-md border bg-background px-3 py-2 text-sm" value={perk} onChange={(e) => setPerk(e.target.value)}>
            <option value="">Anything</option>
            {perks.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </label>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="py-2 pr-4 font-medium">Plan</th>
              <th className="py-2 pr-4 font-medium">Per month</th>
              <th className="py-2 pr-4 font-medium">Cheapest way to pay</th>
              <th className="py-2 pr-4 font-medium">Includes</th>
              <th className="py-2 font-medium">Source</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((p) => (
              <tr key={`${p.service}-${p.tier}`} className="border-b align-top">
                <td className="py-3 pr-4 font-medium">{p.service} {p.tier}</td>
                <td className="py-3 pr-4">{money(p.best.monthly, p.currency)}</td>
                <td className="py-3 pr-4">{money(p.best.price, p.currency)} {PERIOD[p.best.period]}<span className="block text-xs text-muted-foreground">as of {p.best.as_of}</span></td>
                <td className="py-3 pr-4">{p.perks.join(', ')}</td>
                <td className="py-3 text-xs">{p.best.fact_ids.map((id) => <a key={id} href={`#source-${id}`} className="mr-1 underline-offset-2 hover:underline">[{id}]</a>)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {plans.length === 0 && <p className="mt-4 text-muted-foreground">No plan in this region includes that.</p>}
      </div>
    </div>
  );
}
