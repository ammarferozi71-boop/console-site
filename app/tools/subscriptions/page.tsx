import { SITE_URL_RESOLVED } from '@/lib/site';
import type {Metadata} from 'next';
import data from '@/content/decision-tool-data.json';
import PlanComparison from './PlanComparison';
export const metadata:Metadata={title:'Subscription plan comparison',description:'Compare sourced subscription billing prices in the same region and currency.',alternates:{canonical:`${SITE_URL_RESOLVED}/tools/subscriptions`},robots:{index:false,follow:true,googleBot:{index:false,follow:true}}};
export default function Page(){return <main className="mx-auto max-w-5xl space-y-6 px-4 py-12"><p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">SaveSlot tools</p><h1 className="text-4xl font-bold">Compare the cost of your next plan</h1><p className="text-muted-foreground">{data.scope}</p><PlanComparison records={data.records}/></main>;}
