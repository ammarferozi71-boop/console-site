'use client';
import {useState} from 'react';
import {comparePlans,validRecord,type ToolRecord} from '@/lib/decision-tools.mjs';
export default function PlanComparison({records}:{records:ToolRecord[]}){
  const available=records.filter(r=>r.kind==='subscription'&&validRecord(r));
  const markets=Array.from(new Set(available.filter(r=>r.region&&r.currency).map(r=>`${r.region}|${r.currency}`)));
  const [market,setMarket]=useState(markets[0]||'');const [region,currency]=market.split('|');const rows=comparePlans(available,region,currency);
  if(!rows.length)return <div className="rounded-xl border bg-card p-6"><h2 className="text-xl font-semibold">Current plan records are not available</h2><p className="mt-3 text-muted-foreground">Prices vary by country and billing period. We need current provider listings before showing a comparison. No catalog membership or savings are assumed.</p></div>;
  const money=(value:number|null)=>value===null?'Not available':new Intl.NumberFormat('en-US',{style:'currency',currency}).format(value);
  return <div className="space-y-6"><label>Market<select className="mt-2 block w-full rounded border bg-background p-3" value={market} onChange={e=>setMarket(e.target.value)}>{markets.map(m=><option key={m} value={m}>{m.replace('|',' · ')}</option>)}</select></label><div className="overflow-x-auto"><table className="w-full border-collapse text-left"><caption className="mb-3 text-left text-muted-foreground">Annual equivalent divides the listed annual price by twelve. It is not a monthly billing option.</caption><thead><tr>{['Plan','Monthly billing','Annual billing','Annual equivalent / month','Source'].map(h=><th className="border p-3" key={h}>{h}</th>)}</tr></thead><tbody>{rows.map(r=><tr key={r.name}><th className="border p-3">{r.name}</th><td className="border p-3">{money(r.monthly)}</td><td className="border p-3">{money(r.annual)}</td><td className="border p-3">{money(r.effectiveMonthly)}</td><td className="border p-3"><a className="underline" href={r.source} target="_blank" rel="noopener noreferrer">Provider listing</a><p className="text-xs">Checked {r.observed}</p></td></tr>)}</tbody></table></div></div>;
}
