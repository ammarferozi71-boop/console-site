// SaveSlot subscription comparison logic. Pure functions, unit tested.
// Row: { id, service, tier, region, price, currency, period: 'month'|'quarter'|'year', perks: [string], status, as_of, fact_ids }

const MONTHS = { month: 1, quarter: 3, year: 12 };

/** Price per month for a row, rounded to cents. */
export function monthlyEquivalent(row) {
  const m = MONTHS[row.period];
  if (!m) throw new Error(`row ${row.id}: unknown period '${row.period}'`);
  if (typeof row.price !== 'number') throw new Error(`row ${row.id}: no price`);
  return Math.round((row.price / m) * 100) / 100;
}

/** Regions present in the data, sorted. */
export function regions(rows) {
  return [...new Set(rows.map((r) => r.region))].sort();
}

/**
 * Compare plans in one region. Prices are never mixed across currencies or regions.
 * opts: { services?: string[], mustHave?: string[] (perk names, case-insensitive) }
 * Returns plans sorted by monthly equivalent, each with its cheapest billing period marked.
 */
export function comparePlans(rows, region, opts = {}) {
  const wanted = (opts.mustHave || []).map((p) => p.toLowerCase());
  const filtered = rows.filter((r) => r.region === region
    && (!opts.services || opts.services.includes(r.service))
    && wanted.every((w) => (r.perks || []).some((p) => p.toLowerCase().includes(w))));
  const currencies = new Set(filtered.map((r) => r.currency));
  if (currencies.size > 1) throw new Error(`region ${region} mixes currencies: ${[...currencies].join(', ')}`);

  const byPlan = new Map();
  for (const r of filtered) {
    const key = `${r.service}|${r.tier}`;
    if (!byPlan.has(key)) byPlan.set(key, { service: r.service, tier: r.tier, currency: r.currency, options: [] });
    byPlan.get(key).options.push({ ...r, monthly: monthlyEquivalent(r) });
  }
  const plans = [...byPlan.values()].map((p) => {
    p.options.sort((a, b) => a.monthly - b.monthly);
    return { ...p, best: p.options[0], perks: p.options[0].perks || [] };
  });
  plans.sort((a, b) => a.best.monthly - b.best.monthly);
  return plans;
}

/** Yearly saving of paying yearly instead of monthly for the same plan, or null if either is missing. */
export function yearlySaving(rows, service, tier, region) {
  const m = rows.find((r) => r.service === service && r.tier === tier && r.region === region && r.period === 'month');
  const y = rows.find((r) => r.service === service && r.tier === tier && r.region === region && r.period === 'year');
  if (!m || !y || m.currency !== y.currency) return null;
  return Math.round((m.price * 12 - y.price) * 100) / 100;
}
