import React, { useState, useEffect, useRef } from "react";
import {
  Edit3, Save, X, Plus, Trash2, Calendar, History, Download,
  AlertCircle, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Presentation,
  Check, RotateCcw, EyeOff, ArrowRight, MessageSquare, Paperclip,
  Send, ChevronDown, ChevronUp, FileText, Star, Sun, Moon, Image as ImageIcon,
  Search, Flag, Menu
} from "lucide-react";

// ─────────────────────────────────────────────────────────
// GLOBAL STYLES + LIGHT/DARK TOKENS
// ─────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,700;1,400;1,500&display=swap');

/* ── DARK (default) ── OneFlow DS tokens */
:root {
  --bg:#0f131a; --surface:#181d26; --card:#181d26; --card2:#292d38;
  --border:#41464f; --purple:#7a12d4; --purple2:#9b37f2;
  --gold:#f0c66a; --gold2:#ffc05a; --text:#ffffff;
  --muted:#b3b8c1; --faint:#979ca5;
  --red:#ff8b8b; --amber:#f0a93a; --green:#5ad17d;
  --red-bg:rgba(255,139,139,0.16); --amb-bg:rgba(240,169,58,0.18); --grn-bg:rgba(90,209,125,0.16);
  --input-bg:rgba(255,255,255,0.05); --input-border:rgba(255,255,255,0.12);
  --scroll-thumb:rgba(122,18,212,0.35); --hover-row:rgba(122,18,212,0.08);
  --dur-fast:120ms; --dur-base:200ms; --dur-slow:320ms;
  --ease-std:cubic-bezier(0.2,0,0,1); --ease-in:cubic-bezier(0,0,0,1); --ease-out:cubic-bezier(0.4,0,1,1);
  /* OneFlow amber palette — proposed values, pending DS-governance approval (DESIGN_SYSTEM.md §2.2) */
  --mv-amber:#f0a93a; --mv-amber-bright:#ffc05a; --mv-amber-content:#f0c66a;
  --mv-amber-dark:#a8780b; --mv-amber-light:rgba(240,169,58,0.18);
  /* OneFlow brand palette aliases */
  --mv-brand:#7a12d4; --mv-brand-bright:#9b37f2; --mv-brand-content:#b489f5;
  --mv-brand-dark:#4f0c8a; --mv-brand-light:rgba(122,18,212,0.18); --mv-brand-border:rgba(122,18,212,0.35);
}
/* ── LIGHT ── OneFlow DS tokens */
[data-theme="light"] {
  --bg:#ffffff; --surface:#ffffff; --card:#ffffff; --card2:#f9f9f9;
  --border:#dfe1e5; --purple:#7a12d4; --purple2:#9b37f2;
  --gold:#8a5a00; --gold2:#e0b22d; --text:#0f131a;
  --muted:#595e67; --faint:#71767f;
  --red:#c13030; --amber:#d4a016; --green:#1a9950;
  --red-bg:#ffe9eb; --amb-bg:#fef3c7; --grn-bg:#e6f7ed;
  --input-bg:#f3f4f6; --input-border:#dfe1e5;
  --scroll-thumb:rgba(122,18,212,0.25); --hover-row:#f8efff;
  --mv-amber:#d4a016; --mv-amber-bright:#e0b22d; --mv-amber-content:#8a5a00;
  --mv-amber-dark:#5e3e00; --mv-amber-light:#fef3c7;
  --mv-brand:#7a12d4; --mv-brand-bright:#9b37f2; --mv-brand-content:#680fb4;
  --mv-brand-dark:#4f0c8a; --mv-brand-light:#f8efff; --mv-brand-border:#eed8fe;
}

* { box-sizing:border-box; margin:0; padding:0; }
html, body { overflow-x:hidden; max-width:100%; }
body { background:var(--bg); color:var(--text); font-family:'Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif; font-size:14px; line-height:1.5; }
.font-display { font-family:'Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif; font-weight:700; letter-spacing:-0.01em; }
.font-mono    { font-family:ui-monospace,'SF Mono','Roboto Mono',Menlo,Consolas,monospace; font-variant-numeric:tabular-nums; }
::-webkit-scrollbar { width:4px; height:4px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:var(--scroll-thumb); border-radius:2px; }

@keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
.fade-up { animation:fadeUp 0.3s ease both; }

input[type=text],input[type=date],textarea,select {
  background:var(--input-bg); border:1px solid var(--input-border); color:var(--text);
  border-radius:8px; padding:6px 10px; font-family:inherit; font-size:13px; outline:none; transition:border-color 0.18s;
}
input[type=text]:focus,input[type=date]:focus,textarea:focus,select:focus { border-color:var(--purple); background:rgba(122,18,212,0.07); }
input::placeholder,textarea::placeholder { color:var(--faint); }
select option { background:var(--card); color:var(--text); }
[data-theme="light"] select option { background:#fff; }

.ai-row:hover { background:var(--hover-row) !important; }
.progress-bar { height:4px; background:rgba(127,127,127,0.15); border-radius:2px; overflow:hidden; }
.progress-fill { height:100%; border-radius:2px; transition:width 0.5s ease; }

/* ── RESPONSIVE GRID CLASSES (inline gridTemplateColumns blocks @media overrides) ── */
.rg-5 { display:grid; grid-template-columns:repeat(5,1fr); }
.rg-4 { display:grid; grid-template-columns:repeat(4,1fr); }
.rg-3 { display:grid; grid-template-columns:repeat(3,1fr); }
.rg-2 { display:grid; grid-template-columns:1fr 1fr; }

@media (max-width:767px) {
  .rg-5,.rg-4 { grid-template-columns:1fr 1fr; }
  .rg-3,.rg-2 { grid-template-columns:1fr; }
  .mob-hide   { display:none !important; }
}

/* ── ONEFLOW DS — Focus rings (DS §10.1 keyboard navigability) ── */
*:focus { outline:none; }
*:focus-visible { outline:none; box-shadow:0 0 0 4px rgba(155,55,242,0.35); border-radius:8px; }

/* ── Reduced motion (DS §6.2 honor prefers-reduced-motion) ── */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; }
  .fade-up { animation:none; }
}

/* ── Screen-reader-only (for aria-live save status) ── */
.sr-only {
  position:absolute; width:1px; height:1px; padding:0; margin:-1px;
  overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;
}

/* ── Save toast (DS §6.3 single fade-in, no bounce) ── */
.save-toast {
  position:fixed; bottom:24px; right:24px; z-index:9;
  background:var(--grn-bg); color:var(--green);
  border:1px solid var(--grn-bg); border-radius:999px;
  padding:8px 16px; font-size:13px; font-weight:500;
  box-shadow:0 8px 28px rgba(0,0,0,0.18);
  animation:fadeUp 200ms ease both;
}
.save-toast--err { background:var(--red-bg); color:var(--red); border-color:var(--red-bg); }

/* ── Skeleton loaders (DS §7.10 — match final geometry, no spinners) ── */
.skel {
  background:linear-gradient(90deg, var(--card) 0%, var(--card2) 50%, var(--card) 100%);
  background-size:200% 100%; animation:shimmer 1.4s linear infinite;
  border-radius:6px; height:14px;
}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* ── Empty state (DS §7.9 recipe: art + title + subtitle + CTA) ── */
.empty-state { padding:48px 24px; text-align:center; }
.empty-state__art {
  width:72px; height:72px; margin:0 auto 16px;
  background:linear-gradient(135deg, var(--mv-brand-light), rgba(155,55,242,0.06));
  border-radius:18px; display:flex; align-items:center; justify-content:center;
  color:var(--purple2);
}
.empty-state__title { font-size:18px; font-weight:700; color:var(--text); letter-spacing:-0.01em; }
.empty-state__sub   { font-size:14px; color:var(--muted); margin-top:6px; max-width:340px; margin-left:auto; margin-right:auto; }
.empty-state__cta   { display:inline-block; margin-top:18px; padding:10px 20px; border-radius:999px; background:var(--purple); color:#fff; font-weight:500; font-size:14px; cursor:pointer; border:0; font-family:inherit; }
.empty-state__cta:hover { background:var(--mv-brand-bright); }

/* ── Sidebar nav active accent bar (DS §7.6 selected row pattern) ── */
.nav-pill { position:relative; }
.nav-pill::before {
  content:""; position:absolute; left:-1.5px; top:6px; bottom:6px; width:3px;
  background:var(--purple); border-radius:0 2px 2px 0; opacity:0;
  transition:opacity var(--dur-fast) var(--ease-std);
}
.nav-pill[data-active="true"]::before { opacity:1; }

/* ── Eyebrow text utility ── */
.eyebrow { font-size:11px; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:var(--muted); }
`;

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────
const fmtM   = (n) => { const v=parseFloat(n); if(isNaN(v)) return "—"; if(Math.abs(v)>=1e6) return `$${(v/1e6).toFixed(2)}M`; if(Math.abs(v)>=1e3) return `$${(v/1e3).toFixed(1)}K`; return `$${v.toFixed(0)}`; };
const fmtPct = (n,d=1) => { const v=parseFloat(n); return isNaN(v)?"—":`${v.toFixed(d)}%`; };
const fmtNum = (n) => { const v=parseFloat(n); return isNaN(v)?"—":v.toLocaleString("en-US",{maximumFractionDigits:1}); };
const delta  = (a,t) => { const av=parseFloat(a),tv=parseFloat(t); return (isNaN(av)||isNaN(tv)||tv===0)?null:((av-tv)/tv)*100; };
const status = (d) => d===null?"neutral":d>=-5?"good":"bad";
const localISO = (d=new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const todayISO = () => localISO();
const nextTuesdayISO = () => { const d=new Date(); const diff=(2-d.getDay()+7)%7||7; d.setDate(d.getDate()+diff); return localISO(d); };
const fmtDate  = (s) => { if(!s) return ""; const [y,m,dy]=s.split('-').map(Number); return new Date(y,m-1,dy).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}); };
const getISOWeek = (s) => { if(!s) return ""; const [y,mo,dy]=s.split('-').map(Number); const d=new Date(y,mo-1,dy); d.setHours(0,0,0,0); d.setDate(d.getDate()+3-(d.getDay()+6)%7); const w1=new Date(d.getFullYear(),0,4); return 1+Math.round(((d-w1)/86400000-3+(w1.getDay()+6)%7)/7); };
const uid = () => Math.random().toString(36).slice(2,9);

// ─────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────
// localStorage helpers — fast draft persistence (900ms debounce)
const lsGet = (k) => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):null; } catch { return null; } };
const lsSet = (k,v) => { try { localStorage.setItem(k,JSON.stringify(v)); } catch {} };
const lsDel = (k) => { try { localStorage.removeItem(k); } catch {} };

// API helpers — Airtable-backed persistence
const apiGet = async (path) => { try { const r=await fetch(path); return r.ok?r.json():null; } catch { return null; } };
const apiPost = async (path,body) => { try { const r=await fetch(path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}); return r.ok?r.json():null; } catch { return null; } };
const apiPut = async (path,body) => { try { const r=await fetch(path,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}); if(!r.ok) return null; return await r.json(); } catch { return null; } };
const apiDel = async (path) => { const r=await fetch(path,{method:"DELETE"}); if(!r.ok) throw new Error(await r.text()); return r; };

const emptyPageCfg = () => ({ header_image:null, header_text:"", page_notes:"", page_notes_2:"" });

// ─────────────────────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────────────────────
const mkSeed = () => ({
  id:uid(), meeting_date:todayISO(), meeting_label:`Week of ${fmtDate(todayISO())}`, status:"draft",
  meeting_notes:"",
  section_comments:{ company_health:[], bu_performance:[], membership:[], pathways:[], masteries:[], events:[], states:[], product:[], action_items:[], meeting_notes:[] },
  page_config:{ company_health:emptyPageCfg(), bu_performance:emptyPageCfg(), membership:emptyPageCfg(), pathways:emptyPageCfg(), masteries:emptyPageCfg(), events:emptyPageCfg(), states:emptyPageCfg(), product:emptyPageCfg(), action_items:emptyPageCfg(), meeting_notes:emptyPageCfg() },

  company_health:{
    mtd_sales_actual:4500000, mtd_sales_target:5300000, mtd_sales_yoy:-13, week_actual:970000, week_target:1100000,
    cash_balance:9800000, cash_runway_months:1.4, cash_last_week:10900000,
    aer_actual:58, aer_target:65, ad_spend:1300000, adspend_pct:33.3, adspend_num:1500000,
    must_solve:[
      {owner:"Rafay",   title:"Membership",  detail:"–$560K (–17%) · -ve Net-New MRR as churn exceeds acquisition"},
      {owner:"Eni",     title:"Events",      detail:"16% refund rate vs 8.8% LY · Projected net sales gap $506K"},
      {owner:"Jaideep", title:"Mastery",     detail:"Declining profitability · Agree speaker fees structure earlier"}
    ],
    forward_risks:[
      "Membership ARR: subscriber losses → ~$125K/month headwind into Q2 · ROAS recovery urgently needed",
      "Potential $3.5M additional cash risk if ROAS continues current trajectory"
    ],
    rf:{period:"3+9",sa:94,st:110,yoy:-13.3,gp:85.4,gt:88,ea:10.2,ep:12.0,et:13.4,oa:63.5,op:74.5,ot:72.7,ada:26.7,adp:31.4,adly:32,adlyp:35.6,hcp:22.8,hct:20,ga:18.4,ni:3.75,nip:4.4,nit:5.0,c:11.1,ct:16.5,cly:19.5}
  },

  bu_performance:[
    {bu:"Membership",fm_target:3300000,week_target:825000,week_actual:700000,target:3300000,actual:2800000,yoy:-27,ytd_ebitda:46,fy_ebitda:32,why:"VSL ROAS 55% (tgt 95%); Pathway ROAS 19.6% (tgt 60%), refund 11.6%",risk:"Risk: ROAS slides, MRR erosion ~$125K/mo · Mit: creative refresh + funnel retest"},
    {bu:"Academy",   fm_target:1600000,week_target:400000,week_actual:375000,target:1600000,actual:1500000,yoy:14, ytd_ebitda:30,fy_ebitda:44,why:"Clone AI launch only achieved $100K sales",risk:"Risk: Speaker fees structure profitability · Mit: Manifesting Mastery speaker fees decision"},
    {bu:"Events",    fm_target:312000, week_target:null,   week_actual:null,  target:312000, actual:219000, yoy:-58,ytd_ebitda:null,fy_ebitda:null,why:"Scaled from 60 first-class tickets to max 15",risk:"Risk: 16% MVU refund · Mit: push tickets + optimise cost + affiliate commission"},
    {bu:"States",    fm_target:29000,  week_target:null,   week_actual:null,  target:29000,  actual:27000,  yoy:261,ytd_ebitda:-78,fy_ebitda:-98,why:"Ads paused · Relotting in-progress ETA May-26",risk:"Risk: 1 year inventory expiry · Mit: new ad pages and assets"}
  ],
  bu_total:{target:5300000,actual:4500000,yoy:-13,ytd_ebitda:21,fy_ebitda:12},
  bu_insights:"",

  membership:{sales_actual:406939,sales_target:469168,new_subs:718,lost_subs:1036,roas_30d:60,cpl:11.69,cpl_prev:16.26,new_per_day:177,lost_per_day:259,refund_rate:13.7,refund_rate_ly:14.6,initiatives:["Offer testing $299 vs $199 (Manifesting + AI & Entrepreneurship)","Social Login on Landing Page","Concierge starts May 11 for Members","Pathways live on platform — more upsell/cross-sell","Manifesting Summit VIP upsell $39 vs $29","Build WhatsApp list and strategy"]},

  pathways:{rows:[{name:"Manifesting",ad_spend:null,revenue:null,roas_1d:null,roas_3d:null,roas_7d:null,roas_14d:null,roas_30d:null,cpl:null,aov:null},{name:"Entrepreneurship",ad_spend:null,revenue:null,roas_1d:null,roas_3d:null,roas_7d:null,roas_14d:null,roas_30d:null,cpl:null,aov:null},{name:"Speaking & Authorship",ad_spend:null,revenue:null,roas_1d:null,roas_3d:null,roas_7d:null,roas_14d:null,roas_30d:null,cpl:null,aov:null},{name:"Longevity",ad_spend:null,revenue:null,roas_1d:null,roas_3d:null,roas_7d:null,roas_14d:null,roas_30d:null,cpl:null,aov:null}],commentary:""},

  masteries:{sales_mtd:52520,cash_collected_mtd:60970,refund_rate:9.2,cash_forecast_mtd:3300000,
    products:[{name:"Mastery",sales:25850,cash:30180,refund_pct:0,pif_pct:100},{name:"Accelerator",sales:0,cash:0,refund_pct:0,pif_pct:0},{name:"Certification",sales:26680,cash:30790,refund_pct:18.2,pif_pct:72}],
    roas_7d:5,roas_30d:null,roas_90d:null,cpl:8.09,webinar_conv:null,aov:null,
    pipeline:["Manifesting Launch with 55K Leads","Aligning with Data team on Refund Change"],
    academy_summary:{total_sales:9160000,total_cash:8460000,total_refund:18,breakdown:[{name:"Mastery",sales:7000000,cash:5760000,refund:20.6},{name:"Accelerator",sales:690710,cash:690710,refund:8.2},{name:"Certification",sales:1530000,cash:1440000,refund:13.2}]},
    summit:{leads:55037,lp_cr:31,cpl:8.09,vip:1721,member_leads:13177,baseline:[{metric:"Sessions",current:182880,baseline:337264,diff:-45.78},{metric:"Sublist",current:55037,baseline:106500,diff:-48.32},{metric:"LP CR%",current:31,baseline:31.58,diff:-4.7},{metric:"Member",current:13177,baseline:22910,diff:-42.48},{metric:"Non-member",current:37185,baseline:135109,diff:-72.48}]}},

  events:{campaign_name:"MVU Estonia In-Person 2026",tickets_sold:923,tickets_target:1400,tickets_remaining:477,revenue_actual:1280000,revenue_target:2000000,refund_rate:16.52,refund_dollars:315672,gross_revenue:1910000,velocity_7d:33,velocity_per_day:4.7,velocity_required:6.2,yoy_paid_pct:52.31,yoy_paid_actual:923,yoy_paid_ly:606,yoy_revenue_pct:59.55,yoy_revenue_actual:1300000,yoy_revenue_ly:812000,ads_status:"PAUSED",ads_roas:19,valid_tickets:1090,paid_tickets:936,comped_tickets:154,webinar_closes:28,webinar_revenue:69000,refund_forecast_initial:21,refund_forecast_worst:30,refund_worst_dollars:573000,refund_worst_delta:257000,refund_2025_actual:18,speakers_confirmed:18,speakers_negotiating:["Natalie Ellis","Shay (Rising Woman)","Hal Elrod","Young Pueblo","Cynthia Thurlow"],venue_status:"No issues flagged"},

  states:{mtd_sales:null,mtd_target:null,bottles_sold:null,bottles_target:null,revenue_per_session:null,units_left:null,days_to_expiry:null,sell_through_required:null,sell_through_actual:null,write_off_projection:null,roas_7d:null,roas_30d:null,roas_90d:null,cac_payback:null,cpl:null,repeat_rate:null,time_to_2nd:null,aov:null,paid_pct:null,organic_pct:null,revenue_last_week:null,bottles_last_week:null,roas_last_week:null,roas_mtd:null,rev_org_session_last_week:null,notes:"Ads paused. Relotting in progress, ETA May 2026."},

  product:{platform_revenue_mtd:null,engagement:61.8,engagement_wow:0.1,engagement_wow_c:null,engagement_target_delta:-3.2,engagement_target_c:null,engagement_yoy:-1.2,engagement_yoy_c:null,activation:79.1,activation_wow:1.0,activation_wow_c:"red",activation_target_delta:-10.9,activation_target_c:null,activation_yoy:11.9,activation_yoy_c:null,
    revenue_refund_retention:[{metric:"Platform Revenue MTD",actual:null,mom:null,mom_c:null,vs_target:null,vs_target_c:null,yoy:null,yoy_c:null},{metric:"Y-MVM Refund*",actual:11.5,mom:-1.5,mom_c:"green",vs_target:1.5,vs_target_c:"red",yoy:-5.2,yoy_c:"green"},{metric:"Y-M13 retention*",actual:33.0,mom:-3.8,mom_c:null,vs_target:-5.0,vs_target_c:null,yoy:-3.7,yoy_c:null},{metric:"Y-M1 retention*",actual:90.1,mom:1.6,mom_c:null,vs_target:-1.9,vs_target_c:null,yoy:3.1,yoy_c:null},{metric:"M-M3 retention*",actual:32.0,mom:-4.7,mom_c:null,vs_target:-4.0,vs_target_c:null,yoy:-3.3,yoy_c:null}],
    checkout_engagement_transformation:[{metric:"US checkout",actual:46.3,wow:0.8,wow_c:null,vs_target:-3.8,vs_target_c:null,yoy:-0.1,yoy_c:"amber"},{metric:"RoW checkout",actual:27.5,wow:-0.6,wow_c:"amber",vs_target:-2.5,vs_target_c:null,yoy:1.9,yoy_c:null},{metric:"Day 0 login",actual:84.2,wow:-0.7,wow_c:"amber",vs_target:-10.8,vs_target_c:null,yoy:0.1,yoy_c:null},{metric:"Renewal ratio",actual:82.4,wow:0.7,wow_c:null,vs_target:-1.6,vs_target_c:null,yoy:-0.2,yoy_c:"amber"},{metric:"Transformation",actual:46.2,wow:0.0,wow_c:"green",vs_target:-3.8,vs_target_c:null,yoy:1.4,yoy_c:null},{metric:"MAU/MAS",actual:37.7,wow:-1.9,wow_c:null,vs_target:-2.0,vs_target_c:null,yoy:-9.0,yoy_c:null}],
    initiatives:[{name:"Pathways MVP on Platform",status:"green",note:"E2E testing starts May 6",timeline:"~15 May Live",obj:"Acquisition/Retention"},{name:"Masterclass on Platform",status:"green",note:"Social login, video on platform",timeline:"End May",obj:"Acquisition/Retention"},{name:"Shorts 2.0/Vertical Content",status:"green",note:"MVP live (3.5 → 4.6)",timeline:"Throughout May",obj:"Retention"},{name:"Eve Memory",status:"green",note:"Personalization + dynamic prompts",timeline:"Mid May",obj:"Retention"},{name:"New You/Profile Page",status:"amber",note:"Definition stage",timeline:"End May",obj:"Retention"},{name:"Journal",status:"black",note:"TBD — scoping",timeline:"May",obj:"Retention"},{name:"Checkout — PayPal BNPL",status:"green",note:"Manifesting Mastery, API upgrade, RoW adaptive pricing",timeline:"14 May",obj:"Acquisition"}]},

  action_items:{
    pm_flag_active:true,
    pm_flag_text:"Refund rate spike (10% → 18%) — Eni + Jaideep assigned to investigate. Root cause must be completed before EOD May 6. AI Mastery contract still unsigned — Jill cannot close P&L on a live product.",
    items:[
      {id:1,priority:"Critical",title:"Investigate refund rate spike (10% → 18%)",note:"Root cause must be identified by EOD May 6",owner:"Eni + Jaideep",supporting:"Jill",due:"May 6",okr:"Revenue Protection",status:"Open",flagged:true},
      {id:2,priority:"Critical",title:"Get AI Mastery contract signed (Annie / Chadi)",note:"Jill cannot close P&L until contract is executed",owner:"Jill",supporting:"Vishen",due:"May 6",okr:"Revenue Close",status:"Open",flagged:true},
      {id:3,priority:"Critical",title:"Lock launch calendar — Marisha final decision",note:"All downstream timelines blocked until this is locked",owner:"Marisha",supporting:"Ops Team",due:"May 5",okr:"Launch Execution",status:"Open",flagged:true},
      {id:4,priority:"Critical",title:"Confirm or cancel June Speaking Summit",note:"Financial projections cannot be finalized without locked dates",owner:"Marisha",supporting:"Finance",due:"May 7",okr:"Revenue Forecast",status:"Open",flagged:false},
      {id:5,priority:"Critical",title:"Approve budget scale-up for paid acquisition",note:"$10 CPL proven — Daniel + Rafay ready to scale",owner:"Exec Team",supporting:"Daniel, Rafay",due:"May 6",okr:"Lead Generation",status:"Open",flagged:false},
      {id:6,priority:"High",title:"Finalize June financial projections",note:"Blocked until Speaking Summit decision is made",owner:"Jill",supporting:"Finance Team",due:"May 8",okr:"Revenue Forecast",status:"Open",flagged:false},
      {id:7,priority:"High",title:"Build refund response strategy once root cause found",note:"Exec team must decide immediately after Eni/Jaideep report",owner:"Exec Team",supporting:"Eni, Jaideep",due:"May 7",okr:"Revenue Protection",status:"Open",flagged:false},
      {id:8,priority:"High",title:"Scale paid acquisition campaigns",note:"CPL at $10 — unit economics confirmed viable",owner:"Daniel",supporting:"Rafay",due:"May 9",okr:"Lead Generation",status:"Open",flagged:false},
      {id:9,priority:"High",title:"Complete author portal build (Phase 1)",note:"Jane + Kangyu using Claude Code for context",owner:"Jane, Kangyu",supporting:"Tech Lead",due:"May 15",okr:"Platform Readiness",status:"Open",flagged:false},
      {id:10,priority:"High",title:"Align on personalization infrastructure for summit",note:"VIP quiz flow + conversion optimization",owner:"Product Team",supporting:"Marisha",due:"May 12",okr:"Summit Experience",status:"Open",flagged:false},
      {id:11,priority:"High",title:"Revenue daily huddle — align weekly priorities",note:"Ensure all teams synced on top priorities",owner:"Rhythm",supporting:"All Leads",due:"May 6",okr:"Execution Cadence",status:"Open",flagged:false},
      {id:12,priority:"High",title:"Gather data Alex needs — coordinate with Ayesha + Jane",note:"Specific data level required by Alex",owner:"Rhythm",supporting:"Ayesha, Jane",due:"May 7",okr:"Data & Reporting",status:"Open",flagged:false},
      {id:13,priority:"High",title:"Separate account name from account number in CSV",note:"Rhythm Malhotra completed field separation",owner:"Rhythm",supporting:"—",due:"May 5",okr:"Data & Reporting",status:"Complete",flagged:false},
      {id:14,priority:"Medium",title:"Provide Christian with 2025 AI Summit historical data",note:"Jaideep to provide context on historical performance",owner:"Jaideep",supporting:"Christian",due:"May 8",okr:"Data & Reporting",status:"Open",flagged:false},
      {id:15,priority:"Medium",title:"Identify payroll + headcount expense drivers for cash dip",note:"Jill flagged these as sources of recent cash balance dip",owner:"Jill",supporting:"Finance",due:"May 9",okr:"Cash Management",status:"Open",flagged:false},
      {id:16,priority:"Medium",title:"Update revenue add table with latest figures",note:"Rhythm Malhotra added recent work to the table",owner:"Rhythm",supporting:"—",due:"May 6",okr:"Revenue Reporting",status:"Complete",flagged:false},
      {id:17,priority:"Medium",title:"Finalize Manifesting Buddy AI companion spec",note:"Quiz flow, personality customization, WhatsApp integration",owner:"Product Team",supporting:"Tech Lead",due:"May 14",okr:"Summit Experience",status:"Open",flagged:false},
      {id:18,priority:"Medium",title:"Set up OKR tracking for Q2 revenue goals",note:"Link all action items to OKRs",owner:"Rhythm",supporting:"All Leads",due:"May 10",okr:"Execution Cadence",status:"Open",flagged:false},
      {id:19,priority:"Medium",title:"Confirm Vishen document location",note:"Vishen inquired about document location — needs resolution",owner:"Ops Team",supporting:"Vishen",due:"May 7",okr:"Ops Clarity",status:"Open",flagged:false},
      {id:20,priority:"Medium",title:"Post-meeting: distribute action item register to all leads",note:"Share this tracker with all team leads after meeting",owner:"Rhythm",supporting:"—",due:"May 5",okr:"Execution Cadence",status:"Open",flagged:false}
    ],
    decisions:[
      {id:1,title:"Launch calendar — lock or revise?",body:"Marisha is final decision maker. Must be locked today to protect all downstream timelines."},
      {id:2,title:"June Speaking Summit — confirm or cancel?",body:"Still 'under proposal.' Financial projections cannot be finalized until dates are locked."},
      {id:3,title:"AI Mastery contract — escalate to Vishen?",body:"Annie / Chadi have not signed. Jill cannot close P&L. Escalation path needed now."},
      {id:4,title:"Budget reallocation — approve scale-up?",body:"$10 CPL proven. Daniel + Rafay ready to scale. Needs exec sign-off on budget increase."},
      {id:5,title:"Refund rate — response strategy?",body:"Eni + Jaideep investigating. Once root cause found, exec team must decide on response strategy immediately."}
    ],
    next_id:21
  }
});

// Blank seed for a new week — preserves structural arrays (BU names, metric names)
// but nulls all numbers and clears all narrative/text fields.
const mkBlankSeed = () => {
  const date=nextTuesdayISO();
  return {
    id:uid(), meeting_date:date, meeting_label:`Week of ${fmtDate(date)}`, status:"draft",
    meeting_notes:"",
    section_comments:{company_health:[],bu_performance:[],membership:[],pathways:[],masteries:[],events:[],states:[],product:[],action_items:[],meeting_notes:[]},
    page_config:{company_health:emptyPageCfg(),bu_performance:emptyPageCfg(),membership:emptyPageCfg(),pathways:emptyPageCfg(),masteries:emptyPageCfg(),events:emptyPageCfg(),states:emptyPageCfg(),product:emptyPageCfg(),action_items:emptyPageCfg(),meeting_notes:emptyPageCfg()},
    company_health:{
      mtd_sales_actual:null,mtd_sales_target:null,week_actual:null,week_target:null,
      cash_balance:null,cash_runway_months:null,cash_last_week:null,
      aer_actual:null,aer_target:null,ad_spend:null,adspend_pct:null,adspend_num:null,
      must_solve:[],forward_risks:[],
      rf:{sa:null,st:null,yoy:null,gp:null,ea:null,ep:null,et:null,oa:null,op:null,ot:null,ada:null,adp:null,adly:null,adlyp:null,hcp:null,hct:null,ga:null,ni:null,nip:null,c:null,ct:null,cly:null}
    },
    bu_performance:[
      {bu:"Membership",fm_target:null,week_target:null,week_actual:null,target:null,actual:null,yoy:null,ytd_ebitda:null,fy_ebitda:null,why:"",risk:""},
      {bu:"Academy",   fm_target:null,week_target:null,week_actual:null,target:null,actual:null,yoy:null,ytd_ebitda:null,fy_ebitda:null,why:"",risk:""},
      {bu:"Events",    fm_target:null,week_target:null,week_actual:null,target:null,actual:null,yoy:null,ytd_ebitda:null,fy_ebitda:null,why:"",risk:""},
      {bu:"States",    fm_target:null,week_target:null,week_actual:null,target:null,actual:null,yoy:null,ytd_ebitda:null,fy_ebitda:null,why:"",risk:""}
    ],
    bu_total:{target:null,actual:null,yoy:null,ytd_ebitda:null,fy_ebitda:null},
    bu_insights:"",
    membership:{sales_actual:null,sales_target:null,new_subs:null,lost_subs:null,roas_30d:null,cpl:null,cpl_prev:null,new_per_day:null,lost_per_day:null,refund_rate:null,refund_rate_ly:null,initiatives:[]},
    pathways:{rows:[
      {name:"Manifesting",ad_spend:null,revenue:null,roas_1d:null,roas_3d:null,roas_7d:null,roas_14d:null,roas_30d:null,cpl:null,aov:null},
      {name:"Entrepreneurship",ad_spend:null,revenue:null,roas_1d:null,roas_3d:null,roas_7d:null,roas_14d:null,roas_30d:null,cpl:null,aov:null},
      {name:"Speaking & Authorship",ad_spend:null,revenue:null,roas_1d:null,roas_3d:null,roas_7d:null,roas_14d:null,roas_30d:null,cpl:null,aov:null},
      {name:"Longevity",ad_spend:null,revenue:null,roas_1d:null,roas_3d:null,roas_7d:null,roas_14d:null,roas_30d:null,cpl:null,aov:null}
    ],commentary:""},
    masteries:{
      sales_mtd:null,cash_collected_mtd:null,refund_rate:null,cash_forecast_mtd:null,
      products:[
        {name:"Mastery",sales:null,cash:null,refund_pct:null,pif_pct:null},
        {name:"Accelerator",sales:null,cash:null,refund_pct:null,pif_pct:null},
        {name:"Certification",sales:null,cash:null,refund_pct:null,pif_pct:null}
      ],
      roas_7d:null,roas_30d:null,roas_90d:null,cpl:null,webinar_conv:null,aov:null,
      pipeline:[],
      academy_summary:{total_sales:null,total_cash:null,total_refund:null,breakdown:[
        {name:"Mastery",sales:null,cash:null,refund:null},
        {name:"Accelerator",sales:null,cash:null,refund:null},
        {name:"Certification",sales:null,cash:null,refund:null}
      ]},
      summit:{leads:null,lp_cr:null,cpl:null,vip:null,member_leads:null,baseline:[
        {metric:"Sessions",current:null,baseline:null,diff:null},
        {metric:"Sublist",current:null,baseline:null,diff:null},
        {metric:"LP CR%",current:null,baseline:null,diff:null},
        {metric:"Member",current:null,baseline:null,diff:null},
        {metric:"Non-member",current:null,baseline:null,diff:null}
      ]}
    },
    events:{campaign_name:"",tickets_sold:null,tickets_target:null,tickets_remaining:null,revenue_actual:null,revenue_target:null,refund_rate:null,refund_dollars:null,gross_revenue:null,velocity_7d:null,velocity_per_day:null,velocity_required:null,yoy_paid_pct:null,yoy_paid_actual:null,yoy_paid_ly:null,yoy_revenue_pct:null,yoy_revenue_actual:null,yoy_revenue_ly:null,ads_status:"",ads_roas:null,valid_tickets:null,paid_tickets:null,comped_tickets:null,webinar_closes:null,webinar_revenue:null,refund_forecast_initial:null,refund_forecast_worst:null,refund_worst_dollars:null,refund_worst_delta:null,refund_2025_actual:null,speakers_confirmed:null,speakers_negotiating:[],venue_status:""},
    states:{mtd_sales:null,mtd_target:null,bottles_sold:null,bottles_target:null,revenue_per_session:null,units_left:null,days_to_expiry:null,sell_through_required:null,sell_through_actual:null,write_off_projection:null,roas_7d:null,roas_30d:null,roas_90d:null,cac_payback:null,cpl:null,repeat_rate:null,time_to_2nd:null,aov:null,paid_pct:null,organic_pct:null,revenue_last_week:null,bottles_last_week:null,roas_last_week:null,roas_mtd:null,rev_org_session_last_week:null,notes:""},
    product:{
      platform_revenue_mtd:null,engagement:null,engagement_wow:null,engagement_wow_c:null,engagement_target_delta:null,engagement_target_c:null,engagement_yoy:null,engagement_yoy_c:null,activation:null,activation_wow:null,activation_wow_c:null,activation_target_delta:null,activation_target_c:null,activation_yoy:null,activation_yoy_c:null,
      revenue_refund_retention:[
        {metric:"Platform Revenue MTD",actual:null,mom:null,mom_c:null,vs_target:null,vs_target_c:null,yoy:null,yoy_c:null},
        {metric:"Y-MVM Refund*",actual:null,mom:null,mom_c:null,vs_target:null,vs_target_c:null,yoy:null,yoy_c:null},
        {metric:"Y-M13 retention*",actual:null,mom:null,mom_c:null,vs_target:null,vs_target_c:null,yoy:null,yoy_c:null},
        {metric:"Y-M1 retention*",actual:null,mom:null,mom_c:null,vs_target:null,vs_target_c:null,yoy:null,yoy_c:null},
        {metric:"M-M3 retention*",actual:null,mom:null,mom_c:null,vs_target:null,vs_target_c:null,yoy:null,yoy_c:null}
      ],
      checkout_engagement_transformation:[
        {metric:"US checkout",actual:null,wow:null,wow_c:null,vs_target:null,vs_target_c:null,yoy:null,yoy_c:null},
        {metric:"RoW checkout",actual:null,wow:null,wow_c:null,vs_target:null,vs_target_c:null,yoy:null,yoy_c:null},
        {metric:"Day 0 login",actual:null,wow:null,wow_c:null,vs_target:null,vs_target_c:null,yoy:null,yoy_c:null},
        {metric:"Renewal ratio",actual:null,wow:null,wow_c:null,vs_target:null,vs_target_c:null,yoy:null,yoy_c:null},
        {metric:"Transformation",actual:null,wow:null,wow_c:null,vs_target:null,vs_target_c:null,yoy:null,yoy_c:null},
        {metric:"MAU/MAS",actual:null,wow:null,wow_c:null,vs_target:null,vs_target_c:null,yoy:null,yoy_c:null}
      ],
      initiatives:[]
    },
    action_items:{pm_flag_active:false,pm_flag_text:"",items:[],decisions:[],next_id:1}
  };
};

// Seed a new draft from the previous week's finalized data.
// Carries over all metrics/narratives; resets identity, comments, config, and closed action items.
const mkSeededDraft = (prev, date) => {
  return {
    ...prev,
    id: uid(),
    meeting_date: date,
    meeting_label: `Week of ${fmtDate(date)}`,
    status: "draft",
    meeting_notes: "",
    section_comments: { company_health:[], bu_performance:[], membership:[], pathways:[], masteries:[], events:[], states:[], product:[], action_items:[], meeting_notes:[] },
    page_config: { company_health:emptyPageCfg(), bu_performance:emptyPageCfg(), membership:emptyPageCfg(), pathways:emptyPageCfg(), masteries:emptyPageCfg(), events:emptyPageCfg(), states:emptyPageCfg(), product:emptyPageCfg(), action_items:emptyPageCfg(), meeting_notes:emptyPageCfg() },
    action_items: { ...prev.action_items, items: [], decisions: [], next_id: 1 },
  };
};

// Deep-merge remote/local data with seed so nested arrays (must_solve, rows,
// products, items…) always exist even when Airtable fields are partially filled.
const hydrate = (remote) => {
  if (!remote) return mkSeed();
  const seed = mkSeed();
  const merged = { ...seed };
  for (const [k, v] of Object.entries(remote)) {
    if (v === null || v === undefined) continue;
    if (v && typeof v === 'object' && !Array.isArray(v) &&
        seed[k] && typeof seed[k] === 'object' && !Array.isArray(seed[k])) {
      // shallow merge but never overwrite a seed value with null/undefined from remote
      const sub = { ...seed[k] };
      for (const [sk, sv] of Object.entries(v)) {
        if (sv !== undefined) sub[sk] = sv;
      }
      merged[k] = sub;
    } else {
      merged[k] = v;
    }
  }
  // Map Airtable field names (date/label) to dashboard field names (meeting_date/meeting_label)
  if (remote.date) merged.meeting_date = remote.date;
  if (remote.label) merged.meeting_label = remote.label;
  return merged;
};

const mergeAirtableIds=(prevData,serverItems)=>{ if(!serverItems?.length) return prevData; const idMap=Object.fromEntries(serverItems.map(s=>[s.id,s._airtableId]).filter(([,v])=>v)); return {...prevData,action_items:{...prevData.action_items,items:(prevData.action_items?.items??[]).map(it=>idMap[it.id]?{...it,_airtableId:idMap[it.id]}:it)}}; };

// ─────────────────────────────────────────────────────────
// ATOMS
// ─────────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant="primary", size="md", className="" }) => {
  const v={primary:{background:"var(--purple)",color:"#fff",border:"none"},ghost:{background:"transparent",color:"var(--muted)",border:"1px solid var(--border)"},outline:{background:"transparent",color:"var(--text)",border:"1px solid var(--border)"},gold:{background:"var(--mv-amber-light)",color:"var(--mv-amber-content)",border:"1px solid var(--mv-amber-bright)",fontWeight:600},danger:{background:"var(--red-bg)",color:"var(--red)",border:"1px solid var(--red-bg)"}}[variant];
  // OneFlow DS §4.2: button default = pill radius (--mv-radius-full ≈ 128px). All sizes share pill radius.
  const sz={sm:{padding:"6px 14px",fontSize:"12px",borderRadius:"999px"},md:{padding:"9px 18px",fontSize:"13px",borderRadius:"999px"},lg:{padding:"12px 24px",fontSize:"14px",borderRadius:"999px"}}[size];
  return <button onClick={onClick} style={{display:"inline-flex",alignItems:"center",gap:"6px",cursor:"pointer",fontFamily:"inherit",fontWeight:500,transition:"all 0.15s",...v,...sz}} className={className}>{children}</button>;
};
const Pill = ({ label, variant="neutral" }) => {
  // OneFlow DS §2.5 canonical mapping — light bg + content text, full pill radius.
  const s={good:{bg:"var(--grn-bg)",color:"var(--green)",border:"1px solid var(--grn-bg)"},warn:{bg:"var(--red-bg)",color:"var(--red)",border:"1px solid var(--red-bg)"},bad:{bg:"var(--red-bg)",color:"var(--red)",border:"1px solid var(--red-bg)"},neutral:{bg:"rgba(127,127,127,0.1)",color:"var(--muted)",border:"1px solid var(--border)"},purple:{bg:"var(--mv-brand-light)",color:"var(--mv-brand-content)",border:"1px solid var(--mv-brand-border)"},gold:{bg:"var(--mv-amber-light)",color:"var(--mv-amber-content)",border:"1px solid var(--mv-amber-bright)"}}[variant]||{bg:"rgba(127,127,127,0.1)",color:"var(--muted)",border:"1px solid var(--border)"};
  return <span style={{display:"inline-flex",alignItems:"center",gap:"4px",fontSize:"11px",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",padding:"3px 10px",borderRadius:"999px",background:s.bg,color:s.color,border:s.border}}>{label}</span>;
};
const Dt = ({ delta:d, suffix="%" }) => {
  if(d===null||d===undefined||isNaN(d)) return <span style={{color:"var(--faint)"}}>—</span>;
  const up=d>0,flat=Math.abs(d)<0.05,col=flat?"var(--muted)":up?"var(--green)":"var(--red)";
  const Icon=flat?null:up?TrendingUp:TrendingDown;
  return <span style={{display:"inline-flex",alignItems:"center",gap:"3px",fontSize:"12px",fontWeight:500,color:col,fontFamily:"ui-monospace,'SF Mono','Roboto Mono',Menlo,Consolas,monospace"}}>{Icon&&<Icon size={11}/>}{up&&!flat?"+":""}{d.toFixed(1)}{suffix}</span>;
};
const DotBadge = ({ val, c }) => {
  if(val===null||val===undefined||isNaN(val)) return <span style={{color:"var(--faint)"}}>—</span>;
  const dotColor=c==="green"?"var(--green)":c==="red"||c==="amber"?"var(--red)":val>0?"var(--green)":val<0?"var(--red)":"var(--muted)";
  return <span style={{display:"inline-flex",alignItems:"center",gap:"3px",fontSize:"12px",fontFamily:"ui-monospace,'SF Mono','Roboto Mono',Menlo,Consolas,monospace",color:"var(--text)"}}>{val>0?"+":""}{val.toFixed(1)}pp <span style={{color:dotColor,fontSize:"10px"}}>●</span></span>;
};
const NI = ({ value, onChange, prefix="", suffix="" }) => {
  const [raw, setRaw] = useState(value != null ? String(value) : "");
  const committed = useRef(value);
  useEffect(() => {
    if (value !== committed.current) { committed.current = value; setRaw(value != null ? String(value) : ""); }
  }, [value]);
  return (
    <span style={{display:"inline-flex",alignItems:"center",gap:"4px"}}>
      {prefix&&<span style={{color:"var(--faint)",fontSize:"12px"}}>{prefix}</span>}
      <input type="text" value={raw} placeholder="—" onChange={e=>{ const v=e.target.value; setRaw(v); if(v===""||v==="-"){const out=v===""?null:v;committed.current=out;onChange(out);return;} if(v.endsWith(".")||v.endsWith("-")) return; const n=parseFloat(v); const out=isNaN(n)?v:n; committed.current=out; onChange(out); }} style={{width:"80px",border:"1px solid rgba(122,18,212,0.35)",background:"rgba(122,18,212,0.08)",color:"var(--text)",borderRadius:"6px",padding:"4px 8px",fontFamily:"ui-monospace,'SF Mono','Roboto Mono',Menlo,Consolas,monospace",fontSize:"13px"}} />
      {suffix&&<span style={{color:"var(--faint)",fontSize:"12px"}}>{suffix}</span>}
    </span>
  );
};
const TI = ({ value, onChange, placeholder="", multi=false, style={} }) =>
  multi?<textarea value={value??""} placeholder={placeholder} rows={2} onChange={e=>onChange(e.target.value)} style={{width:"100%",resize:"vertical",...style}}/>:<input type="text" value={value??""} placeholder={placeholder} onChange={e=>onChange(e.target.value)} style={{width:"100%",...style}}/>;
const Card = ({ children, style={} }) => <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"16px",overflow:"hidden",...style}}>{children}</div>;
const CardHead = ({ title, sub, action }) => (
  <div style={{padding:"14px 18px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
    <div>
      <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"2px"}}>{title}</div>
      {sub&&<div style={{fontSize:"12px",color:"var(--muted)"}}>{sub}</div>}
    </div>
    {action}
  </div>
);
const SHead = ({ owner, title, cadence, editing, onEdit, onSave, onCancel }) => (
  <div style={{marginBottom:"24px",paddingBottom:"20px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
    <div>
      <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"8px"}}>{cadence}</div>
      <h2 className="font-display" style={{fontSize:"30px",fontWeight:400,color:"var(--text)",lineHeight:1,marginBottom:"6px"}}>{title}</h2>
      <div style={{fontSize:"13px",color:"var(--muted)"}}>Owner · <span style={{color:"var(--purple2)",fontWeight:500}}>{owner}</span></div>
    </div>
    <div style={{display:"flex",gap:"8px"}}>
      {editing?<><Btn variant="ghost" size="sm" onClick={onCancel}><X size={13}/>Cancel</Btn><Btn variant="primary" size="sm" onClick={onSave}><Save size={13}/>Save section</Btn></>:<Btn variant="outline" size="sm" onClick={onEdit}><Edit3 size={13}/>Edit numbers</Btn>}
    </div>
  </div>
);
const Hero = ({ label, value, target, fmt="money", subtext, editing, onChange, onChangeTarget, yoy, onChangeYoy, glow=false, large=false }) => {
  const fmter=fmt==="money"?fmtM:fmt==="pct"?fmtPct:fmtNum;
  const d=target!==undefined?delta(value,target):null;
  const st=status(d);
  const valStr=fmter(value);
  const mainVal=large&&fmt==="money"&&valStr.match(/^(\$[\d.]+)(M|K)$/)
    ?<>{valStr.match(/^(\$[\d.]+)/)[0]}<span style={{fontSize:"18px",color:"var(--muted)",fontWeight:400,marginLeft:"2px"}}>{valStr.match(/(M|K)$/)?.[0]}</span></>
    :large&&fmt==="pct"&&valStr.match(/^([\d.]+)%$/)
    ?<>{valStr.match(/^[\d.]+/)[0]}<span style={{fontSize:"18px",color:"var(--muted)",fontWeight:400,marginLeft:"2px"}}>%</span></>
    :valStr;
  return (
    <div style={{background:"var(--card2)",border:"1px solid var(--border)",borderRadius:"16px",padding:large?"22px 24px":"18px 20px",...(glow&&st==="bad"?{boxShadow:"0 0 24px rgba(212,44,69,0.15)",borderColor:"rgba(212,44,69,0.22)"}:{})}}>
      <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"12px"}}>{label}</div>
      {editing?<div style={{display:"flex",flexDirection:"column",gap:"6px"}}><NI value={value} onChange={onChange} prefix={fmt==="money"?"$":""} suffix={fmt==="pct"?"%":""}/>{target!==undefined&&onChangeTarget&&<div style={{fontSize:"12px",color:"var(--muted)"}}>vs target: <NI value={target} onChange={onChangeTarget} prefix={fmt==="money"?"$":""} suffix={fmt==="pct"?"%":""}/></div>}{yoy!==undefined&&onChangeYoy&&<div style={{fontSize:"12px",color:"var(--muted)"}}>YoY %: <NI value={yoy} onChange={onChangeYoy} suffix="%"/></div>}</div>
      :<><div className="font-display" style={{fontSize:large?"40px":"34px",fontWeight:400,lineHeight:1,marginBottom:"8px",color:st==="bad"?"var(--red)":"var(--text)"}}>{mainVal}</div><div style={{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>{target&&<span className="font-mono" style={{fontSize:"12px",color:"var(--muted)"}}>vs {fmter(target)}</span>}{d!==null&&<Dt delta={d}/>}{yoy!==undefined&&<span className="font-mono" style={{fontSize:"12px",color:"var(--muted)"}}>YoY {parseFloat(yoy)>0?"+":""}{fmtPct(yoy)}</span>}{subtext&&<span style={{fontSize:"12px",color:"var(--muted)"}}>{subtext}</span>}</div></>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// SECTION EXTRAS — unified bottom card: image, header, notes
// ─────────────────────────────────────────────────────────
const compressImage = (dataUrl) => new Promise((res) => {
  const img=new window.Image(); img.onerror=()=>res(dataUrl);
  img.onload=()=>{ const MAX=1000,scale=Math.min(1,MAX/Math.max(img.width,img.height)); const c=document.createElement("canvas"); c.width=img.width*scale; c.height=img.height*scale; c.getContext("2d").drawImage(img,0,0,c.width,c.height); res(c.toDataURL("image/jpeg",0.75)); };
  img.src=dataUrl;
});

const SectionExtras = ({ cfg={}, onChange }) => {
  const [open, setOpen]=useState(!!(cfg.header_image||cfg.header_text||cfg.page_notes||cfg.page_notes_2));
  const [lightboxImg, setLightboxImg]=useState(null);
  const fileRef=useRef();
  const handleFile=async(e)=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=async(ev)=>{ onChange({...cfg,header_image:await compressImage(ev.target.result)}); setOpen(true); }; r.readAsDataURL(f); e.target.value=""; };
  const hasContent=!!(cfg.header_image||cfg.header_text||cfg.page_notes||cfg.page_notes_2);
  return (
    <div style={{marginTop:"28px",marginBottom:"4px"}}>
      {lightboxImg&&<div onClick={()=>setLightboxImg(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}}><img src={lightboxImg} alt="" style={{maxWidth:"90vw",maxHeight:"85vh",objectFit:"contain",borderRadius:"10px"}} onClick={e=>e.stopPropagation()}/><button onClick={()=>setLightboxImg(null)} aria-label="Close image preview" style={{position:"absolute",top:20,right:20,background:"var(--card2)",border:"1px solid var(--border)",color:"var(--text)",borderRadius:"50%",width:"32px",height:"32px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><X size={14}/></button></div>}
      <div style={{border:"1px solid var(--border)",borderRadius:"16px",overflow:"hidden",background:"var(--card)"}}>
        {/* Toggle bar */}
        <button onClick={()=>setOpen(!open)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 18px",background:"transparent",border:"none",cursor:"pointer",color:"var(--text)",fontFamily:"inherit"}}>
          <span style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <ImageIcon size={14} style={{color:"var(--purple2)",flexShrink:0}}/>
            <span style={{fontSize:"13px",fontWeight:500,color:"var(--muted)"}}>Section context — image, header &amp; notes</span>
            {hasContent&&<span style={{background:"var(--grn-bg)",color:"var(--green)",fontSize:"10px",fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",border:"1px solid rgba(46,204,113,0.2)",borderRadius:"20px",padding:"2px 8px"}}>Added</span>}
          </span>
          {open?<ChevronUp size={14} style={{color:"var(--faint)"}}/>:<ChevronDown size={14} style={{color:"var(--faint)"}}/>}
        </button>
        {/* Expanded body */}
        {open&&<div style={{padding:"0 18px 20px",borderTop:"1px solid var(--border)",display:"flex",flexDirection:"column",gap:"18px",paddingTop:"18px"}}>
          {/* Image */}
          <div>
            <div style={{fontSize:"10px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--gold)",marginBottom:"8px"}}>Screenshot / Chart / Reference image</div>
            <input type="file" ref={fileRef} accept="image/*" style={{display:"none"}} onChange={handleFile}/>
            {cfg.header_image ? (
              <div style={{position:"relative",borderRadius:"10px",overflow:"hidden",border:"1px solid var(--border)"}}>
                <img src={cfg.header_image} alt="" onClick={()=>setLightboxImg(cfg.header_image)} style={{width:"100%",maxHeight:"240px",objectFit:"cover",display:"block",cursor:"zoom-in"}}/>
                <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"10px 12px",display:"flex",gap:"8px",background:"linear-gradient(0deg,rgba(0,0,0,0.55),transparent)"}}>
                  <button onClick={()=>fileRef.current?.click()} style={{background:"rgba(255,255,255,0.18)",border:"1px solid rgba(255,255,255,0.3)",color:"#fff",borderRadius:"6px",padding:"4px 10px",fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Replace</button>
                  <button onClick={()=>onChange({...cfg,header_image:null})} style={{background:"rgba(212,44,69,0.4)",border:"1px solid rgba(212,44,69,0.4)",color:"#fff",borderRadius:"6px",padding:"4px 10px",fontSize:"11px",fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Remove</button>
                </div>
              </div>
            ) : (
              <div onClick={()=>fileRef.current?.click()} style={{border:"1.5px dashed var(--border)",borderRadius:"10px",padding:"28px 16px",textAlign:"center",cursor:"pointer",background:"var(--card2)",transition:"border-color 0.15s"}} onMouseEnter={e=>e.currentTarget.style.borderColor="var(--purple)"} onMouseLeave={e=>e.currentTarget.style.borderColor="var(--border)"}>
                <ImageIcon size={24} style={{color:"var(--faint)",marginBottom:"10px"}}/>
                <div style={{fontSize:"13px",color:"var(--muted)",fontWeight:500}}>Click to upload image</div>
                <div style={{fontSize:"11px",color:"var(--faint)",marginTop:"4px"}}>Screenshots, charts, or reference materials — JPG, PNG, GIF</div>
              </div>
            )}
          </div>
          {/* Custom header */}
          <div>
            <div style={{fontSize:"10px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--gold)",marginBottom:"8px"}}>Custom header</div>
            <input type="text" value={cfg.header_text||""} onChange={e=>onChange({...cfg,header_text:e.target.value})} placeholder="Override section title for this week…" style={{width:"100%",fontFamily:"'Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif",fontSize:"17px",fontWeight:700,letterSpacing:"-0.01em"}}/>
          </div>
          {/* Notes 1 */}
          <div>
            <div style={{fontSize:"10px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--gold)",marginBottom:"8px"}}>Pre-meeting briefing</div>
            <textarea value={cfg.page_notes||""} onChange={e=>onChange({...cfg,page_notes:e.target.value})} placeholder="Context, key observations, or preparation notes for this section…" rows={3} style={{width:"100%",resize:"vertical",lineHeight:1.7}}/>
          </div>
          {/* Notes 2 */}
          <div>
            <div style={{fontSize:"10px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--gold)",marginBottom:"8px"}}>Post-meeting / Key takeaways</div>
            <textarea value={cfg.page_notes_2||""} onChange={e=>onChange({...cfg,page_notes_2:e.target.value})} placeholder="Decisions made, follow-ups, key quotes, or anything that came up in discussion…" rows={3} style={{width:"100%",resize:"vertical",lineHeight:1.7}}/>
          </div>
        </div>}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// COMMENTS PANEL
// ─────────────────────────────────────────────────────────
const CommentsPanel = ({ comments=[], onChange, sectionLabel }) => {
  const [open,setOpen]=useState(false);
  const [author,setAuthor]=useState(""); const [text,setText]=useState(""); const [imgData,setImgData]=useState(null); const [imgName,setImgName]=useState(null); const [lightbox,setLightbox]=useState(null);
  const fileRef=useRef();
  const handleFile=async(e)=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=async(ev)=>{ setImgData(await compressImage(ev.target.result)); setImgName(f.name); }; r.readAsDataURL(f); e.target.value=""; };
  const post=()=>{ if(!text.trim()&&!imgData) return; onChange([{id:uid(),author:author.trim()||"Anonymous",text:text.trim(),image_data:imgData,image_name:imgName,created_at:new Date().toISOString()},...comments]); setText(""); setImgData(null); setImgName(null); };
  return (
    <div style={{marginTop:"24px"}}>
      {lightbox&&<div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}}><img src={lightbox} alt="" style={{maxWidth:"90vw",maxHeight:"85vh",objectFit:"contain",borderRadius:"10px"}}/><button onClick={()=>setLightbox(null)} aria-label="Close image preview" style={{position:"absolute",top:20,right:20,background:"var(--card2)",border:"1px solid var(--border)",color:"var(--text)",borderRadius:"50%",width:"34px",height:"34px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><X size={15}/></button></div>}
      <button onClick={()=>setOpen(!open)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(122,18,212,0.06)",border:"1px solid rgba(122,18,212,0.15)",borderRadius:"10px",padding:"11px 16px",cursor:"pointer",color:"var(--text)",fontFamily:"inherit"}}>
        <span style={{display:"flex",alignItems:"center",gap:"8px",fontSize:"13px",fontWeight:500}}><MessageSquare size={14} style={{color:"var(--purple2)"}}/>Comments & Notes{comments.length>0&&<span style={{background:"var(--purple)",color:"#fff",fontSize:"11px",fontWeight:700,borderRadius:"20px",padding:"1px 7px"}}>{comments.length}</span>}</span>
        {open?<ChevronUp size={14} style={{color:"var(--muted)"}}/>:<ChevronDown size={14} style={{color:"var(--muted)"}}/>}
      </button>
      {open&&<div style={{marginTop:"6px",background:"var(--card)",border:"1px solid var(--border)",borderRadius:"10px",overflow:"hidden"}}>
        <div style={{padding:"14px",borderBottom:"1px solid var(--border)"}}>
          <input type="text" value={author} onChange={e=>setAuthor(e.target.value)} placeholder="Your name" style={{width:"50%",marginBottom:"8px"}}/>
          <textarea value={text} onChange={e=>setText(e.target.value)} placeholder={`Note for ${sectionLabel}…`} rows={2} style={{width:"100%",resize:"vertical",marginBottom:"8px"}}/>
          {imgData&&<div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px",background:"rgba(255,255,255,0.04)",borderRadius:"8px",padding:"8px 12px"}}><img src={imgData} alt="" onClick={()=>setLightbox(imgData)} style={{height:"48px",borderRadius:"6px",cursor:"zoom-in",objectFit:"cover"}}/><span style={{fontSize:"12px",color:"var(--muted)",flex:1}}>{imgName}</span><button onClick={()=>{setImgData(null);setImgName(null);}} aria-label="Remove attachment" style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer"}}><X size={13}/></button></div>}
          <div style={{display:"flex",gap:"8px"}}><input type="file" ref={fileRef} accept="image/*" style={{display:"none"}} onChange={handleFile}/><Btn variant="ghost" size="sm" onClick={()=>fileRef.current?.click()}><Paperclip size={12}/>Attach image</Btn><Btn variant="primary" size="sm" onClick={post}><Send size={12}/>Post</Btn></div>
        </div>
        {comments.length===0?<div style={{padding:"20px",textAlign:"center",color:"var(--faint)",fontSize:"13px",fontStyle:"italic"}}>No notes yet.</div>
        :<div style={{maxHeight:"300px",overflowY:"auto"}}>{comments.map((c,i)=>(
          <div key={c.id} style={{padding:"12px 16px",borderBottom:i<comments.length-1?"1px solid var(--border)":"none",display:"flex",gap:"10px"}}>
            <div style={{width:"28px",height:"28px",borderRadius:"50%",background:"linear-gradient(135deg,var(--purple),var(--purple2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:700,color:"#fff",flexShrink:0}}>{(c.author||"A")[0].toUpperCase()}</div>
            <div style={{flex:1}}><div style={{display:"flex",alignItems:"baseline",gap:"10px",marginBottom:"4px"}}><span style={{fontSize:"13px",fontWeight:600,color:"var(--text)"}}>{c.author}</span><span style={{fontSize:"11px",color:"var(--faint)"}}>{new Date(c.created_at).toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}</span></div>{c.text&&<p style={{fontSize:"13px",color:"var(--muted)",lineHeight:1.6}}>{c.text}</p>}{c.image_data&&<img src={c.image_data} alt="" onClick={()=>setLightbox(c.image_data)} style={{marginTop:"8px",maxHeight:"120px",maxWidth:"260px",borderRadius:"8px",cursor:"zoom-in",objectFit:"cover",border:"1px solid var(--border)"}}/>}</div>
            <button onClick={()=>onChange(comments.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"var(--faint)",cursor:"pointer",paddingTop:"2px"}} aria-label="Remove item"><Trash2 size={12}/></button>
          </div>
        ))}</div>}
      </div>}
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// SECTION: COMPANY HEALTH
// ─────────────────────────────────────────────────────────
const CompanyHealth = ({ data, editing, onEdit, onSave, onCancel, onChange, onComment }) => {
  const ch=data.company_health; const set=(p,v)=>onChange(["company_health",...p],v);
  return <div className="fade-up">
    <SHead owner="Jill" title="Company Health" cadence="Weekly · Opens every meeting · Cash verdict in 5 KPIs" editing={editing} onEdit={onEdit} onSave={onSave} onCancel={onCancel}/>
    <div className="rg-2" style={{gap:"14px",marginBottom:"14px"}}>
      <Hero label="MTD Sales" value={ch.mtd_sales_actual} target={ch.mtd_sales_target} editing={editing} onChange={v=>set(["mtd_sales_actual"],v)} onChangeTarget={v=>set(["mtd_sales_target"],v)} yoy={ch.mtd_sales_yoy} onChangeYoy={v=>set(["mtd_sales_yoy"],v)} glow large/>
      <div style={{background:"var(--card2)",border:"1px solid var(--border)",borderRadius:"16px",padding:"22px 24px"}}>
        <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"12px"}}>Cash Balance</div>
        {editing?<div style={{display:"flex",flexDirection:"column",gap:"6px"}}><NI value={ch.cash_balance} onChange={v=>set(["cash_balance"],v)} prefix="$"/><div style={{fontSize:"12px",color:"var(--muted)"}}>Runway: <NI value={ch.cash_runway_months} onChange={v=>set(["cash_runway_months"],v)} suffix="mo"/></div><div style={{fontSize:"12px",color:"var(--muted)"}}>Last week: <NI value={ch.cash_last_week} onChange={v=>set(["cash_last_week"],v)} prefix="$"/></div></div>
        :<><div className="font-display" style={{fontSize:"40px",fontWeight:400,lineHeight:1,marginBottom:"8px"}}>{fmtM(ch.cash_balance).match(/^(\$[\d.]+)/)?.[0]||fmtM(ch.cash_balance)}<span style={{fontSize:"18px",color:"var(--muted)",fontWeight:400,marginLeft:"2px"}}>{fmtM(ch.cash_balance).match(/(M|K)$/)?.[0]||""}</span></div><div style={{fontSize:"12px",color:"var(--muted)"}}>{ch.cash_runway_months} months runway</div><div style={{fontSize:"12px",color:"var(--faint)"}}>vs {fmtM(ch.cash_last_week)} last week</div></>}
      </div>
    </div>
    <div className="rg-3" style={{gap:"14px",marginBottom:"20px"}}>
      <Hero label="Week vs Target" value={ch.week_actual} target={ch.week_target} editing={editing} onChange={v=>set(["week_actual"],v)} onChangeTarget={v=>set(["week_target"],v)} glow/>
      <Hero label="MTD Paid Revenue / Adspend" value={ch.aer_actual} target={ch.aer_target} fmt="pct" subtext={!editing?`Ad spend ${fmtM(ch.ad_spend)}`:null} editing={editing} onChange={v=>set(["aer_actual"],v)} onChangeTarget={v=>set(["aer_target"],v)}/>
      <div style={{background:"var(--card2)",border:"1px solid var(--border)",borderRadius:"16px",padding:"18px 20px"}}>
        <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"12px"}}>MTD Adspend / Sales</div>
        {editing?<NI value={ch.adspend_pct} onChange={v=>set(["adspend_pct"],v)} suffix="%"/>:<><div className="font-display" style={{fontSize:"34px",fontWeight:400,lineHeight:1,marginBottom:"8px"}}>{fmtPct(ch.adspend_pct)}</div><div className="font-mono" style={{fontSize:"12px",color:"var(--muted)"}}>{fmtM(ch.adspend_num)} / {fmtM(ch.mtd_sales_actual)}</div></>}
      </div>
    </div>
    <div className="rg-2" style={{gap:"16px",marginBottom:"16px"}}>
      <Card><CardHead title="3 Must-Solve Issues This Week" action={editing&&<Btn variant="ghost" size="sm" onClick={()=>set(["must_solve"],[...ch.must_solve,{owner:"",title:"New issue",detail:""}])}><Plus size={12}/>Add</Btn>}/>
        <div style={{padding:"16px",display:"flex",flexDirection:"column",gap:"14px"}}>
          {ch.must_solve.length===0&&!editing&&<p style={{fontSize:"13px",color:"var(--faint)",fontStyle:"italic"}}>No must-solve issues added yet. Click &quot;Edit numbers&quot; to add.</p>}
          {ch.must_solve.map((m,i)=><div key={i} style={{display:"flex",gap:"12px",alignItems:"flex-start"}}>
            <div style={{width:"3px",minHeight:"44px",background:"var(--red)",borderRadius:"2px",flexShrink:0,marginTop:"4px"}}/>
            {editing
              ?<div style={{flex:1,display:"flex",flexDirection:"column",gap:"6px"}}>
                <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
                  <TI value={m.title} onChange={v=>{const n=[...ch.must_solve];n[i]={...n[i],title:v};set(["must_solve"],n);}} placeholder="Issue title" style={{flex:1}}/>
                  <TI value={m.owner} onChange={v=>{const n=[...ch.must_solve];n[i]={...n[i],owner:v};set(["must_solve"],n);}} placeholder="Owner" style={{width:"90px"}}/>
                  <button onClick={()=>set(["must_solve"],ch.must_solve.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"var(--faint)",cursor:"pointer",padding:"4px"}} aria-label="Remove item"><Trash2 size={13}/></button>
                </div>
                <TI value={m.detail} onChange={v=>{const n=[...ch.must_solve];n[i]={...n[i],detail:v};set(["must_solve"],n);}} multi placeholder="Detail — impact, why it matters, current status…"/>
              </div>
              :<div style={{flex:1}}><div style={{display:"flex",alignItems:"baseline",gap:"10px",marginBottom:"3px"}}><span className="font-display" style={{fontSize:"17px",color:"var(--text)"}}>{m.title}</span><span style={{fontSize:"11px",color:"var(--purple2)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>→ {m.owner}</span></div><p style={{fontSize:"13px",color:"var(--muted)",lineHeight:1.6}}>{m.detail}</p></div>}
          </div>)}
        </div>
      </Card>
      <Card><CardHead title="Forward Cash Risk" action={editing&&<Btn variant="ghost" size="sm" onClick={()=>set(["forward_risks"],[...ch.forward_risks,"New risk — describe the scenario and financial exposure"])}><Plus size={12}/>Add</Btn>}/>
        <div style={{padding:"16px",display:"flex",flexDirection:"column",gap:"10px"}}>
          {ch.forward_risks.length===0&&!editing&&<p style={{fontSize:"13px",color:"var(--faint)",fontStyle:"italic"}}>No forward risks added yet. Click &quot;Edit numbers&quot; to add.</p>}
          {ch.forward_risks.map((r,i)=><div key={i} style={{display:"flex",gap:"10px",alignItems:"flex-start",background:"var(--red-bg)",border:"1px solid rgba(212,44,69,0.15)",borderRadius:"8px",padding:"12px 14px"}}>
            <AlertCircle size={14} style={{color:"var(--red)",flexShrink:0,marginTop:"2px"}}/>
            {editing
              ?<><TI value={r} onChange={v=>{const n=[...ch.forward_risks];n[i]=v;set(["forward_risks"],n);}} multi style={{flex:1}} placeholder="Describe the risk scenario and financial exposure…"/>
                <button onClick={()=>set(["forward_risks"],ch.forward_risks.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"var(--faint)",cursor:"pointer",padding:"4px",flexShrink:0}} aria-label="Remove item"><Trash2 size={13}/></button></>
              :<p style={{fontSize:"13px",color:"var(--muted)",lineHeight:1.6,flex:1}}>{r}</p>}
          </div>)}
        </div>
      </Card>
    </div>
    <Card><CardHead title={`Full Year Rolling Forecast (${ch.rf.period||"3+9"})`}/>
      {editing
        ?<div style={{padding:"16px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px",marginBottom:"14px"}}>
            <span style={{fontSize:"11px",color:"var(--muted)"}}>Period:</span>
            <TI value={ch.rf.period} onChange={v=>set(["rf","period"],v)} style={{width:"60px"}} placeholder="3+9"/>
          </div>
          <p style={{fontSize:"12px",color:"var(--muted)",marginBottom:"14px",fontStyle:"italic"}}>All figures in $M unless labelled. Fill in what you have — blanks show &quot;—&quot; in view mode.</p>
          <div className="rg-4" style={{gap:"12px"}}>
            {[{g:"Sales",f:[["sa","Forecast","$M"],["st","Target","$M"],["yoy","YoY","%"]]},{g:"Margins",f:[["gp","GP %","%"],["gt","GP % Tgt.","%"],["ea","EBITDA Act.","$M"],["ep","EBITDA %","%"],["et","EBITDA Tgt.","%"]]},{g:"Costs",f:[["oa","OPEX","$M"],["op","OPEX %","%"],["ot","OPEX Tgt.","%"],["ada","AdSpend","$M"],["adp","AdSpend %","%"],["adly","AdSpend LY","$M"],["adlyp","AdSpend LY %","%"],["hcp","HC %","%"],["hct","HC Tgt.","%"],["ga","G&A","$M"]]},{g:"Bottom Line",f:[["ni","Net Inc.","$M"],["nip","NI %","%"],["nit","NI Tgt. %","%"],["c","Cash","$M"],["ct","Cash Tgt.","$M"],["cly","Cash LY","$M"]]}].map(({g,f})=>(
              <div key={g} style={{background:"var(--card2)",border:"1px solid var(--border)",borderRadius:"8px",padding:"12px"}}>
                <div style={{fontSize:"10px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--gold)",marginBottom:"10px"}}>{g}</div>
                <div style={{display:"flex",flexDirection:"column",gap:"7px"}}>
                  {f.map(([k,label,unit])=>(
                    <div key={k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px"}}>
                      <span style={{fontSize:"11px",color:"var(--muted)",flexShrink:0}}>{label}</span>
                      <div style={{display:"flex",alignItems:"center",gap:"3px"}}><NI value={ch.rf[k]} onChange={v=>set(["rf",k],v)}/><span style={{fontSize:"10px",color:"var(--faint)"}}>{unit}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        :<div className="rg-4" style={{padding:"16px",gap:"16px"}}>
          {(()=>{const fmtRFm=n=>{const v=parseFloat(n);return isNaN(v)?"—":`$${v.toFixed(1)}M`;};const yoyStr=ch.rf.yoy!=null?(parseFloat(ch.rf.yoy)>0?"+":"")+fmtPct(ch.rf.yoy):"—";const gpSt=delta(ch.rf.gp,ch.rf.gt)>=0?"good":"bad";return[["Sales",fmtRFm(ch.rf.sa),`${fmtRFm(ch.rf.st)} target · YoY ${yoyStr}`,ch.rf.yoy<0?"bad":"good"],["GP Margin",fmtPct(ch.rf.gp),`tgt ${fmtPct(ch.rf.gt)}`,gpSt],["EBITDA",`${fmtRFm(ch.rf.ea)} (${fmtPct(ch.rf.ep)})`,`tgt ${fmtPct(ch.rf.et)}`,"bad"],["OPEX",`${fmtRFm(ch.rf.oa)} (${fmtPct(ch.rf.op)})`,`tgt ${fmtPct(ch.rf.ot)}`,"bad"],["Ad Spend",`${fmtRFm(ch.rf.ada)} (${fmtPct(ch.rf.adp)})`,`${fmtRFm(ch.rf.adly)} LY (${fmtPct(ch.rf.adlyp)})`,"good"],["Headcount",fmtPct(ch.rf.hcp),`tgt ${fmtPct(ch.rf.hct)}`,"bad"],["G&A",fmtRFm(ch.rf.ga),"","neutral"],["Net Income",`${fmtRFm(ch.rf.ni)} (${fmtPct(ch.rf.nip)})`,`tgt ${fmtPct(ch.rf.nit)}`,"neutral"],["Cash",fmtRFm(ch.rf.c),`${fmtRFm(ch.rf.ct)} tgt / ${fmtRFm(ch.rf.cly)} LY`,"bad"]];})().map(([l,v,sub,st],i)=>(
            <div key={i} style={{borderLeft:`2px solid ${st==="good"?"var(--green)":st==="bad"?"var(--red)":st==="warn"?"var(--amber)":"var(--border)"}`,paddingLeft:"12px"}}>
              <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--muted)",marginBottom:"4px"}}>{l}</div>
              <div className="font-mono" style={{fontSize:"14px",color:st==="bad"?"var(--red)":st==="good"?"var(--green)":"var(--text)"}}>{v} <span style={{color:st==="good"?"var(--green)":st==="bad"?"var(--red)":"transparent"}}>{st==="good"?"✓":st==="bad"?"✗":""}</span></div>
              {sub&&<div className="font-mono" style={{fontSize:"11px",color:"var(--faint)",marginTop:"2px"}}>{sub}</div>}
            </div>
          ))}
        </div>}
    </Card>
    <SectionExtras cfg={data.page_config?.company_health||{}} onChange={v=>onChange(["page_config","company_health"],v)}/>
    <CommentsPanel comments={data.section_comments?.company_health} onChange={onComment} sectionLabel="Company Health"/>
  </div>;
};

// ─────────────────────────────────────────────────────────
// SECTION: BU PERFORMANCE
// ─────────────────────────────────────────────────────────
const BUPerformance = ({ data, editing, onEdit, onSave, onCancel, onChange, onComment }) => {
  const rows=data.bu_performance, total=data.bu_total;
  const autoFmTarget   = rows.reduce((s,r)=>s+(parseFloat(r.fm_target)||0),0);
  const autoWeekTarget = rows.reduce((s,r)=>s+(parseFloat(r.week_target)||0),0);
  const autoWeekActual = rows.reduce((s,r)=>s+(parseFloat(r.week_actual)||0),0);
  const autoMtdTarget  = rows.reduce((s,r)=>s+(parseFloat(r.target)||0),0);
  const autoMtdActual  = rows.reduce((s,r)=>s+(parseFloat(r.actual)||0),0);
  const grpBorder = "2px solid rgba(122,18,212,0.25)";
  const headers = ["BU","FM Target","Wk Target","Wk Actual","$ Wk Δ","% Wk Δ","MTD Target","MTD Actual","$ MTD Δ","% MTD Δ","Status","YTD YoY","YTD EBITDA","FY EBITDA","Why / Risk + Mit"];
  const hLeft = new Set(["BU","Why / Risk + Mit"]);
  const hGroupStart = new Set(["Wk Target","MTD Target"]);
  return <div className="fade-up">
    <SHead owner="Jill" title="BU Performance Snapshot" cadence="Weekly · Full-month target + weekly actuals + MTD status" editing={editing} onEdit={onEdit} onSave={onSave} onCancel={onCancel}/>
    <Card><div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px"}}>
        <thead><tr style={{borderBottom:"1px solid var(--border)"}}>
          {headers.map(h=><th key={h} style={{padding:"12px 14px",textAlign:hLeft.has(h)?"left":"right",fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--muted)",whiteSpace:"nowrap",...(hGroupStart.has(h)?{borderLeft:grpBorder}:{})}}>
            {h==="Status"?<span style={{display:"inline-flex",alignItems:"center",gap:"3px"}}>Status<span title="Green = within −5% of MTD target · Red = worse than −5%" style={{cursor:"help",color:"var(--faint)",fontSize:"11px",fontWeight:400,textTransform:"none",letterSpacing:0}}>ⓘ</span></span>:h}
          </th>)}
        </tr></thead>
        <tbody>
          {rows.map((r,i)=>{
            const upd=(k,v)=>{const n=[...rows];n[i]={...n[i],[k]:v};onChange(["bu_performance"],n);};
            const wkDd=(parseFloat(r.week_actual)||0)-(parseFloat(r.week_target)||0);
            const mtdDd=(parseFloat(r.actual)||0)-(parseFloat(r.target)||0);
            const mtdD=delta(r.actual,r.target), mtdSt=status(mtdD);
            return (
            <tr key={i} className="ai-row" style={{borderBottom:"1px solid var(--border)"}}>
              <td style={{padding:"14px",fontFamily:"'Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif",fontSize:"17px",fontWeight:700,letterSpacing:"-0.01em"}}>{r.bu}</td>
              {/* FM Target */}
              <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{editing?<NI value={r.fm_target} onChange={v=>upd("fm_target",v)} prefix="$"/>:fmtM(r.fm_target)}</td>
              {/* Weekly group */}
              <td style={{padding:"14px",textAlign:"right",borderLeft:grpBorder}} className="font-mono">{editing?<NI value={r.week_target} onChange={v=>upd("week_target",v)} prefix="$"/>:fmtM(r.week_target)}</td>
              <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{editing?<NI value={r.week_actual} onChange={v=>upd("week_actual",v)} prefix="$"/>:fmtM(r.week_actual)}</td>
              <td style={{padding:"14px",textAlign:"right",color:wkDd<0?"var(--red)":"var(--green)"}} className="font-mono">{wkDd>=0?"+":"–"}{fmtM(Math.abs(wkDd))}</td>
              <td style={{padding:"14px",textAlign:"right"}}><Dt delta={delta(r.week_actual,r.week_target)}/></td>
              {/* MTD group */}
              <td style={{padding:"14px",textAlign:"right",borderLeft:grpBorder}} className="font-mono">{editing?<NI value={r.target} onChange={v=>upd("target",v)} prefix="$"/>:fmtM(r.target)}</td>
              <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{editing?<NI value={r.actual} onChange={v=>upd("actual",v)} prefix="$"/>:fmtM(r.actual)}</td>
              <td style={{padding:"14px",textAlign:"right",color:mtdDd<0?"var(--red)":"var(--green)"}} className="font-mono">{mtdDd>=0?"+":"–"}{fmtM(Math.abs(mtdDd))}</td>
              <td style={{padding:"14px",textAlign:"right"}}><Dt delta={mtdD}/></td>
              <td style={{padding:"14px",textAlign:"right"}}><Pill label={mtdSt==="good"?"Green":"Red"} variant={mtdSt}/></td>
              {/* YTD / EBITDA */}
              <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{editing?<NI value={r.yoy} onChange={v=>upd("yoy",v)} suffix="%"/>:fmtPct(r.yoy,0)}</td>
              <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{editing?<NI value={r.ytd_ebitda} onChange={v=>upd("ytd_ebitda",v)} suffix="%"/>:(r.ytd_ebitda===null?"n.a":fmtPct(r.ytd_ebitda,0))}</td>
              <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{editing?<NI value={r.fy_ebitda} onChange={v=>upd("fy_ebitda",v)} suffix="%"/>:(r.fy_ebitda===null?"n.a":fmtPct(r.fy_ebitda,0))}</td>
              <td style={{padding:"14px",maxWidth:"240px"}}>{editing?<div style={{display:"flex",flexDirection:"column",gap:"6px"}}><TI value={r.why} onChange={v=>upd("why",v)} multi/><TI value={r.risk} onChange={v=>upd("risk",v)} multi/></div>:<><div style={{fontSize:"13px",color:"var(--muted)",lineHeight:1.5}}>{r.why}</div><div style={{fontSize:"12px",color:"var(--faint)",marginTop:"4px"}}>{r.risk}</div></>}</td>
            </tr>
          );})}
          <tr style={{background:"rgba(122,18,212,0.08)"}}>
            <td style={{padding:"14px",fontFamily:"'Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif",fontSize:"17px",fontWeight:700,letterSpacing:"-0.01em",color:"var(--purple2)"}}>Total Company</td>
            <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{fmtM(autoFmTarget)}</td>
            <td style={{padding:"14px",textAlign:"right",borderLeft:grpBorder}} className="font-mono">{fmtM(autoWeekTarget)}</td>
            <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{fmtM(autoWeekActual)}</td>
            <td style={{padding:"14px",textAlign:"right",color:autoWeekActual<autoWeekTarget?"var(--red)":"var(--green)"}} className="font-mono">{autoWeekActual>=autoWeekTarget?"+":"–"}{fmtM(Math.abs(autoWeekActual-autoWeekTarget))}</td>
            <td style={{padding:"14px",textAlign:"right"}}><Dt delta={delta(autoWeekActual,autoWeekTarget)}/></td>
            <td style={{padding:"14px",textAlign:"right",borderLeft:grpBorder}} className="font-mono">{fmtM(autoMtdTarget)}</td>
            <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{fmtM(autoMtdActual)}</td>
            <td style={{padding:"14px",textAlign:"right",color:autoMtdActual<autoMtdTarget?"var(--red)":"var(--green)"}} className="font-mono">{autoMtdActual>=autoMtdTarget?"+":"–"}{fmtM(Math.abs(autoMtdActual-autoMtdTarget))}</td>
            <td style={{padding:"14px",textAlign:"right"}}><Dt delta={delta(autoMtdActual,autoMtdTarget)}/></td>
            <td style={{padding:"14px",textAlign:"right"}}><Pill label={status(delta(autoMtdActual,autoMtdTarget))==="good"?"Green":"Red"} variant={status(delta(autoMtdActual,autoMtdTarget))}/></td>
            <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{editing?<NI value={total.yoy} onChange={v=>onChange(["bu_total","yoy"],v)} suffix="%"/>:fmtPct(total.yoy,0)}</td>
            <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{editing?<NI value={total.ytd_ebitda} onChange={v=>onChange(["bu_total","ytd_ebitda"],v)} suffix="%"/>:fmtPct(total.ytd_ebitda,0)}</td>
            <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{editing?<NI value={total.fy_ebitda} onChange={v=>onChange(["bu_total","fy_ebitda"],v)} suffix="%"/>:fmtPct(total.fy_ebitda,0)}</td>
            <td style={{padding:"14px",fontSize:"10px",color:"var(--faint)",fontStyle:"italic"}}>All values auto-sum from BU rows</td>
          </tr>
        </tbody>
      </table>
    </div></Card>
    <Card style={{marginTop:"16px"}}>
      <CardHead title="Insights"/>
      <div style={{padding:"16px"}}>
        {editing
          ?<TI value={data.bu_insights} onChange={v=>onChange(["bu_insights"],v)} multi style={{width:"100%",minHeight:"120px"}} placeholder="Add context on the numbers — highlights, risks, or anything to call out before the meeting..."/>
          :data.bu_insights
            ?<p style={{fontSize:"13px",color:"var(--muted)",lineHeight:1.8,whiteSpace:"pre-line"}}>{data.bu_insights}</p>
            :<div style={{background:"var(--card2)",border:"1px dashed var(--border)",borderRadius:"8px",padding:"16px"}}><p style={{fontSize:"13px",color:"var(--faint)",fontStyle:"italic"}}>No insights added yet — click &quot;Edit numbers&quot; to add context and highlights.</p></div>
        }
      </div>
    </Card>
    <SectionExtras cfg={data.page_config?.bu_performance||{}} onChange={v=>onChange(["page_config","bu_performance"],v)}/>
    <CommentsPanel comments={data.section_comments?.bu_performance} onChange={onComment} sectionLabel="BU Performance"/>
  </div>;
};

// ─────────────────────────────────────────────────────────
// MEMBERSHIP, PATHWAYS, MASTERIES, EVENTS, STATES, PRODUCT
// (condensed — same logic as before + SectionExtras at bottom of each)
// ─────────────────────────────────────────────────────────
const Membership = ({ data, editing, onEdit, onSave, onCancel, onChange, onComment }) => {
  const m=data.membership; const set=(p,v)=>onChange(["membership",...p],v);
  const net=(m.new_subs||0)-(m.lost_subs||0);
  return <div className="fade-up">
    <SHead owner="Rafay" title="Membership" cadence="Weekly · Acquisition + funnel health for the subscription business" editing={editing} onEdit={onEdit} onSave={onSave} onCancel={onCancel}/>
    <div className="rg-3" style={{gap:"12px",marginBottom:"16px"}}>
      {[{l:"★ Sales",main:editing?<NI value={m.sales_actual} onChange={v=>set(["sales_actual"],v)} prefix="$"/>:<div className="font-display" style={{fontSize:"36px",lineHeight:1}}>{fmtM(m.sales_actual)}</div>,sub:editing?<div style={{fontSize:"12px",color:"var(--muted)"}}>target: <NI value={m.sales_target} onChange={v=>set(["sales_target"],v)} prefix="$"/></div>:<div style={{fontSize:"13px",color:"var(--muted)"}}>vs {fmtM(m.sales_target)} ({Math.round((m.sales_actual/m.sales_target)*100)}%)</div>},{l:"★ Net New Subscribers",main:editing?<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"6px"}}><div><div style={{fontSize:"11px",color:"var(--muted)",marginBottom:"3px"}}>+New</div><NI value={m.new_subs} onChange={v=>set(["new_subs"],v)}/></div><div><div style={{fontSize:"11px",color:"var(--muted)",marginBottom:"3px"}}>–Lost</div><NI value={m.lost_subs} onChange={v=>set(["lost_subs"],v)}/></div></div>:<div className="font-display" style={{fontSize:"36px",lineHeight:1,color:net<0?"var(--red)":"var(--green)"}}>{net>=0?"+":""}{net}</div>,sub:<div style={{fontSize:"13px",color:"var(--muted)"}}>+{fmtNum(m.new_subs)} new · –{fmtNum(m.lost_subs)} lost</div>},{l:"★ ROAS 30D",main:editing?<NI value={m.roas_30d} onChange={v=>set(["roas_30d"],v)} suffix="%"/>:<div className="font-display" style={{fontSize:"36px",lineHeight:1}}>{fmtPct(m.roas_30d,0)}</div>,sub:<div style={{fontSize:"13px",color:"var(--muted)"}}>Funnel acquisition health</div>}].map((h,i)=>(
        <div key={i} style={{background:"linear-gradient(145deg,var(--card2),rgba(122,18,212,0.08))",border:"1px solid rgba(122,18,212,0.15)",borderRadius:"16px",padding:"20px"}}>
          <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"12px"}}>{h.l}</div>
          <div style={{marginBottom:"8px"}}>{h.main}</div>{h.sub}
        </div>
      ))}
    </div>
    <div className="rg-3" style={{gap:"12px",marginBottom:"16px"}}>
      <Card><CardHead title="CPL"/><div style={{padding:"16px"}}>{editing?<div style={{display:"flex",flexDirection:"column",gap:"8px"}}><div>Current: <NI value={m.cpl} onChange={v=>set(["cpl"],v)} prefix="$"/></div><div>Last mo: <NI value={m.cpl_prev} onChange={v=>set(["cpl_prev"],v)} prefix="$"/></div></div>:<><div className="font-display" style={{fontSize:"24px",marginBottom:"6px"}}>${m.cpl}</div><div style={{fontSize:"12px",color:"var(--muted)"}}>vs ${m.cpl_prev} last month <Dt delta={m.cpl_prev?((m.cpl-m.cpl_prev)/m.cpl_prev)*100:null}/></div></>}</div></Card>
      <Card><CardHead title="Subscriber Growth Daily"/><div style={{padding:"16px"}}>{editing?<div style={{display:"flex",flexDirection:"column",gap:"8px"}}><div>+New/day: <NI value={m.new_per_day} onChange={v=>set(["new_per_day"],v)}/></div><div>–Lost/day: <NI value={m.lost_per_day} onChange={v=>set(["lost_per_day"],v)}/></div></div>:<div style={{display:"flex",alignItems:"baseline",gap:"12px"}}><div><span className="font-display" style={{fontSize:"24px",color:"var(--green)"}}>+{m.new_per_day}</span><span style={{fontSize:"12px",color:"var(--muted)",marginLeft:"4px"}}>new</span></div><span style={{color:"var(--faint)"}}>·</span><div><span className="font-display" style={{fontSize:"24px",color:"var(--red)"}}>–{m.lost_per_day}</span><span style={{fontSize:"12px",color:"var(--muted)",marginLeft:"4px"}}>lost</span></div></div>}</div></Card>
      <Card><CardHead title="Refund Rate"/><div style={{padding:"16px"}}>{editing?<div style={{display:"flex",flexDirection:"column",gap:"8px"}}><div>Current: <NI value={m.refund_rate} onChange={v=>set(["refund_rate"],v)} suffix="%"/></div><div>LY: <NI value={m.refund_rate_ly} onChange={v=>set(["refund_rate_ly"],v)} suffix="%"/></div></div>:<><div className="font-display" style={{fontSize:"24px",marginBottom:"6px"}}>{fmtPct(m.refund_rate)}</div><div style={{fontSize:"12px",color:"var(--muted)"}}>vs {fmtPct(m.refund_rate_ly)} LY <Dt delta={m.refund_rate-m.refund_rate_ly} suffix="pp"/></div></>}</div></Card>
    </div>
    <Card><CardHead title="Initiatives This Week" action={editing&&<Btn variant="ghost" size="sm" onClick={()=>set(["initiatives"],[...m.initiatives,""])}><Plus size={12}/>Add</Btn>}/>
      <div style={{padding:"16px",display:"flex",flexDirection:"column",gap:"8px"}}>
        {m.initiatives.length===0&&!editing&&<p style={{fontSize:"13px",color:"var(--faint)",fontStyle:"italic"}}>No initiatives added yet — click &quot;Edit numbers&quot; then &quot;Add&quot; to enter this week&apos;s initiatives.</p>}
        {m.initiatives.map((it,i)=>editing?<div key={i} style={{display:"flex",gap:"8px"}}><TI value={it} onChange={v=>{const n=[...m.initiatives];n[i]=v;set(["initiatives"],n);}} placeholder="Describe the initiative — e.g. 'Launch $199 offer test on Manifesting pathway'" style={{flex:1}}/><button onClick={()=>set(["initiatives"],m.initiatives.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"var(--faint)",cursor:"pointer"}} aria-label="Remove item"><Trash2 size={13}/></button></div>:<div key={i} style={{display:"flex",gap:"10px",alignItems:"flex-start"}}><ChevronRight size={13} style={{color:"var(--gold)",flexShrink:0,marginTop:"3px"}}/><span style={{fontSize:"13px",color:"var(--muted)"}}>{it}</span></div>)}
      </div>
    </Card>
    <SectionExtras cfg={data.page_config?.membership||{}} onChange={v=>onChange(["page_config","membership"],v)}/>
    <CommentsPanel comments={data.section_comments?.membership} onChange={onComment} sectionLabel="Membership"/>
  </div>;
};

const Pathways = ({ data, editing, onEdit, onSave, onCancel, onChange, onComment }) => {
  const p=data.pathways; const set=(k,v)=>onChange(["pathways",k],v);
  return <div className="fade-up">
    <SHead owner="Dan" title="Pathways" cadence="Weekly · Sub-slot under Membership · Per-pathway funnel breakdown" editing={editing} onEdit={onEdit} onSave={onSave} onCancel={onCancel}/>
    <Card style={{marginBottom:"16px"}}><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px"}}>
      <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Pathway","Ad Spend MTD","Revenue MTD","ROAS 1D","ROAS 3D","ROAS 7D","ROAS 14D","ROAS 30D","CPL","AOV"].map(h=><th key={h} style={{padding:"12px 14px",textAlign:h==="Pathway"?"left":"right",fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--muted)"}}>{h}</th>)}</tr></thead>
      <tbody>{p.rows.map((r,i)=><tr key={i} style={{borderBottom:"1px solid var(--border)"}} className="ai-row">
        <td style={{padding:"14px",fontFamily:"'Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif",fontSize:"16px",fontWeight:700,letterSpacing:"-0.01em"}}>{r.name}</td>
        {["ad_spend","revenue","roas_1d","roas_3d","roas_7d","roas_14d","roas_30d","cpl","aov"].map(k=><td key={k} style={{padding:"14px",textAlign:"right"}} className="font-mono">{editing?<NI value={r[k]} onChange={v=>{const n=[...p.rows];n[i]={...n[i],[k]:v};set("rows",n);}} prefix={["ad_spend","revenue","cpl","aov"].includes(k)?"$":""} suffix={["roas_1d","roas_3d","roas_7d","roas_14d","roas_30d"].includes(k)?"%":""}/>:(r[k]===null?<span style={{color:"var(--faint)"}}>—</span>:(k.includes("roas")?fmtPct(r[k],0):fmtM(r[k])))}</td>)}
      </tr>)}</tbody>
    </table></div></Card>
    <Card><CardHead title="Commentary"/>
      <div style={{padding:"16px"}}>
        {editing
          ?<TI value={p.commentary} onChange={v=>set("commentary",v)} multi style={{width:"100%",minHeight:"100px"}} placeholder="Format: WINNING — [pathway name]: [what's working and why] | BLEEDING — [pathway name]: [what's off and the issue] | BUDGET SHIFTS — [any reallocation this week] | CREATIVE — [new angles being tested]"/>
          :<>
            {p.commentary
              ?<p style={{fontSize:"13px",color:"var(--muted)",lineHeight:1.8,whiteSpace:"pre-line"}}>{p.commentary}</p>
              :<div style={{background:"var(--card2)",border:"1px dashed var(--border)",borderRadius:"8px",padding:"16px"}}>
                <p style={{fontSize:"13px",color:"var(--faint)",fontStyle:"italic",marginBottom:"10px"}}>No commentary added. Click &quot;Edit numbers&quot; to fill in. Suggested format:</p>
                <p style={{fontSize:"12px",color:"var(--faint)",lineHeight:1.8}}>WINNING — [Pathway]: [What&apos;s working and why]<br/>BLEEDING — [Pathway]: [What&apos;s off]<br/>BUDGET SHIFTS — [Reallocations this week]<br/>CREATIVE — [New angles being tested]</p>
              </div>}
          </>}
      </div>
    </Card>
    <SectionExtras cfg={data.page_config?.pathways||{}} onChange={v=>onChange(["page_config","pathways"],v)}/>
    <CommentsPanel comments={data.section_comments?.pathways} onChange={onComment} sectionLabel="Pathways"/>
  </div>;
};

const Masteries = ({ data, editing, onEdit, onSave, onCancel, onChange, onComment }) => {
  const m=data.masteries; const set=(p,v)=>onChange(["masteries",...p],v);
  return <div className="fade-up">
    <SHead owner="Jaideep" title="Masteries & Certifications" cadence="Weekly · Launch-driven, high-ticket · Cash collection is the catch" editing={editing} onEdit={onEdit} onSave={onSave} onCancel={onCancel}/>
    <div className="rg-4" style={{gap:"12px",marginBottom:"16px"}}>
      {[["★ Sales MTD","sales_mtd","money"],["★ Cash Collected MTD","cash_collected_mtd","money"],["★ Refund Rate","refund_rate","pct"],["★ Cash Forecast MTD","cash_forecast_mtd","money"]].map(([lbl,k,fmt])=>(
        <div key={k} style={{background:"linear-gradient(145deg,var(--card2),rgba(122,18,212,0.08))",border:"1px solid rgba(122,18,212,0.15)",borderRadius:"16px",padding:"18px"}}>
          <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"12px"}}>{lbl}</div>
          {editing?<NI value={m[k]} onChange={v=>set([k],v)} prefix={fmt==="money"?"$":""} suffix={fmt==="pct"?"%":""}/>:<div className="font-display" style={{fontSize:"28px",lineHeight:1}}>{fmt==="money"?fmtM(m[k]):fmtPct(m[k])}</div>}
        </div>
      ))}
    </div>
    <Card style={{marginBottom:"16px"}}><CardHead title="Product Breakdown"/><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px"}}>
      <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Product","Sales","Cash Collected","Refund %","PIF %"].map(h=><th key={h} style={{padding:"12px 14px",textAlign:h==="Product"?"left":"right",fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--muted)"}}>{h}</th>)}</tr></thead>
      <tbody>{m.products.map((r,i)=><tr key={i} style={{borderBottom:"1px solid var(--border)"}} className="ai-row">
        <td style={{padding:"14px",fontFamily:"'Plus Jakarta Sans',ui-sans-serif,system-ui,sans-serif",fontSize:"16px",fontWeight:700,letterSpacing:"-0.01em"}}>{r.name}</td>
        <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{editing?<NI value={r.sales} onChange={v=>{const n=[...m.products];n[i]={...n[i],sales:v};set(["products"],n);}} prefix="$"/>:fmtM(r.sales)}</td>
        <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{editing?<NI value={r.cash} onChange={v=>{const n=[...m.products];n[i]={...n[i],cash:v};set(["products"],n);}} prefix="$"/>:fmtM(r.cash)}</td>
        <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{editing?<NI value={r.refund_pct} onChange={v=>{const n=[...m.products];n[i]={...n[i],refund_pct:v};set(["products"],n);}} suffix="%"/>:fmtPct(r.refund_pct)}</td>
        <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{editing?<NI value={r.pif_pct} onChange={v=>{const n=[...m.products];n[i]={...n[i],pif_pct:v};set(["products"],n);}} suffix="%"/>:fmtPct(r.pif_pct,0)}</td>
      </tr>)}</tbody>
    </table></div></Card>
    <SectionExtras cfg={data.page_config?.masteries||{}} onChange={v=>onChange(["page_config","masteries"],v)}/>
    <CommentsPanel comments={data.section_comments?.masteries} onChange={onComment} sectionLabel="Masteries"/>
  </div>;
};

const Events = ({ data, editing, onEdit, onSave, onCancel, onChange, onComment }) => {
  const e=data.events; const set=(p,v)=>onChange(["events",...p],v);
  const tPct=e.tickets_target?(e.tickets_sold/e.tickets_target)*100:0, rPct=e.revenue_target?(e.revenue_actual/e.revenue_target)*100:0;
  return <div className="fade-up">
    <SHead owner="Eni" title="Events" cadence="Weekly · Campaign-cycle business · Pacing toward fixed deadline" editing={editing} onEdit={onEdit} onSave={onSave} onCancel={onCancel}/>
    <div style={{background:"linear-gradient(145deg,var(--card2),rgba(122,18,212,0.06))",border:"1px solid rgba(122,18,212,0.15)",borderRadius:"16px",padding:"24px",marginBottom:"16px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"20px"}}>
        <div><div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"8px"}}>Active Campaign</div><h3 className="font-display" style={{fontSize:"22px",color:"var(--text)"}}>{editing?<TI value={e.campaign_name} onChange={v=>set(["campaign_name"],v)} style={{fontSize:"18px",width:"340px"}}/>:e.campaign_name}</h3></div>
        <Pill label={`ADS ${e.ads_status} · ROAS ${e.ads_roas}%`} variant={e.ads_status==="PAUSED"?"warn":"good"}/>
      </div>
      <div className="rg-4" style={{gap:"20px"}}>
        <div><div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--muted)",marginBottom:"10px"}}>Tickets Sold</div>{editing?<div style={{display:"flex",gap:"6px"}}><NI value={e.tickets_sold} onChange={v=>set(["tickets_sold"],v)}/><span style={{color:"var(--faint)"}}>/</span><NI value={e.tickets_target} onChange={v=>set(["tickets_target"],v)}/></div>:<><div className="font-display" style={{fontSize:"30px",lineHeight:1,marginBottom:"6px"}}>{fmtNum(e.tickets_sold)} <span style={{color:"var(--faint)",fontSize:"16px"}}>/ {fmtNum(e.tickets_target)}</span></div><div className="font-mono" style={{fontSize:"12px",color:"var(--muted)",marginBottom:"8px"}}>{tPct.toFixed(1)}% · {e.tickets_remaining} remaining</div><div className="progress-bar"><div className="progress-fill" style={{width:`${Math.min(100,tPct)}%`,background:"linear-gradient(90deg,var(--purple),var(--purple2))"}}/></div></>}</div>
        <div><div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--muted)",marginBottom:"10px"}}>Net Revenue</div>{editing?<div style={{display:"flex",gap:"6px"}}><NI value={e.revenue_actual} onChange={v=>set(["revenue_actual"],v)} prefix="$"/><span style={{color:"var(--faint)"}}>/</span><NI value={e.revenue_target} onChange={v=>set(["revenue_target"],v)} prefix="$"/></div>:<><div className="font-display" style={{fontSize:"30px",lineHeight:1,marginBottom:"6px"}}>{fmtM(e.revenue_actual)}</div><div className="font-mono" style={{fontSize:"12px",color:"var(--muted)",marginBottom:"8px"}}>{rPct.toFixed(1)}% of {fmtM(e.revenue_target)}</div><div className="progress-bar"><div className="progress-fill" style={{width:`${Math.min(100,rPct)}%`,background:"linear-gradient(90deg,var(--green),rgba(46,204,113,0.5))"}}/></div></>}</div>
        <div><div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--muted)",marginBottom:"10px"}}>Refund Rate (Running)</div>{editing?<NI value={e.refund_rate} onChange={v=>set(["refund_rate"],v)} suffix="%"/>:<><div className="font-display" style={{fontSize:"30px",lineHeight:1,color:"var(--red)",marginBottom:"6px"}}>{fmtPct(e.refund_rate)}</div><div className="font-mono" style={{fontSize:"12px",color:"var(--muted)"}}>{fmtM(e.refund_dollars)} of {fmtM(e.gross_revenue)} gross</div></>}</div>
        <div><div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--muted)",marginBottom:"10px"}}>Sales Velocity 7D</div>{editing?<div style={{display:"flex",flexDirection:"column",gap:"6px"}}><NI value={e.velocity_7d} onChange={v=>set(["velocity_7d"],v)} suffix="tix"/><div style={{fontSize:"12px",color:"var(--muted)"}}>per day: <NI value={e.velocity_per_day} onChange={v=>set(["velocity_per_day"],v)}/></div></div>:<><div className="font-display" style={{fontSize:"30px",lineHeight:1,marginBottom:"6px"}}>{e.velocity_7d}</div><div className="font-mono" style={{fontSize:"12px",color:e.velocity_per_day<e.velocity_required?"var(--red)":"var(--green)"}}>~{e.velocity_per_day}/day · need {e.velocity_required}/day</div></>}</div>
      </div>
    </div>
    <div className="rg-2" style={{gap:"16px"}}>
      <Card><CardHead title="Refund Forecast"/><div style={{padding:"16px"}}>
        <div className="rg-3" style={{gap:"12px",marginBottom:"14px"}}>{[["2025 Actual",`${e.refund_2025_actual}%`,"neutral"],["Current Running",fmtPct(e.refund_rate),"warn"],["Initial Forecast",`${e.refund_forecast_initial}%`,"neutral"]].map(([l,v,st])=><div key={l}><div style={{fontSize:"10px",fontWeight:700,textTransform:"uppercase",color:"var(--muted)",marginBottom:"4px"}}>{l}</div><div className="font-mono" style={{fontSize:"18px",color:"var(--text)"}}>{v}</div></div>)}</div>
        <div style={{background:"var(--red-bg)",border:"1px solid rgba(212,44,69,0.2)",borderRadius:"8px",padding:"12px"}}><div style={{fontSize:"13px",fontWeight:600,color:"var(--red)",marginBottom:"4px"}}>Worst-case: up to {e.refund_forecast_worst}%</div><div style={{fontSize:"12px",color:"var(--muted)",lineHeight:1.6}}>Jet fuel crisis. At 30%: ~{fmtM(e.refund_worst_dollars)} (+{fmtM(e.refund_worst_delta)} vs today)</div></div>
      </div></Card>
      <Card><CardHead title="Speakers · Venue"/><div style={{padding:"16px"}}>
        <div className="rg-2" style={{gap:"16px",marginBottom:"14px"}}>
          <div><div style={{fontSize:"10px",fontWeight:700,textTransform:"uppercase",color:"var(--muted)",marginBottom:"4px"}}>Confirmed</div><div className="font-display" style={{fontSize:"30px"}}>{editing?<NI value={e.speakers_confirmed} onChange={v=>set(["speakers_confirmed"],v)}/>:e.speakers_confirmed}</div><div style={{fontSize:"12px",color:"var(--muted)"}}>teachers</div></div>
          <div><div style={{fontSize:"10px",fontWeight:700,textTransform:"uppercase",color:"var(--muted)",marginBottom:"6px"}}>In Negotiation ({e.speakers_negotiating.length})</div><div style={{display:"flex",flexDirection:"column",gap:"3px"}}>{e.speakers_negotiating.map((s,i)=><span key={i} style={{fontSize:"12px",color:"var(--muted)"}}>· {s}</span>)}</div></div>
        </div>
        <div style={{fontSize:"12px",color:"var(--muted)",paddingTop:"10px",borderTop:"1px solid var(--border)"}}><span style={{fontWeight:600,color:"var(--faint)",textTransform:"uppercase",letterSpacing:"0.06em",fontSize:"10px"}}>Venue · </span>{e.venue_status}</div>
      </div></Card>
    </div>
    <SectionExtras cfg={data.page_config?.events||{}} onChange={v=>onChange(["page_config","events"],v)}/>
    <CommentsPanel comments={data.section_comments?.events} onChange={onComment} sectionLabel="Events"/>
  </div>;
};

const States = ({ data, editing, onEdit, onSave, onCancel, onChange, onComment }) => {
  const s=data.states; const set=(p,v)=>onChange(["states",...p],v);
  const mainRows=[
    {label:"Revenue",      lw:"revenue_last_week",          mtd:"mtd_sales",          prefix:"$", suffix:""},
    {label:"Bottles Sold", lw:"bottles_last_week",          mtd:"bottles_sold",        prefix:"",  suffix:""},
    {label:"ROAS",         lw:"roas_last_week",             mtd:"roas_mtd",            prefix:"",  suffix:"x"},
    {label:"Rev/Org Session", lw:"rev_org_session_last_week", mtd:"revenue_per_session", prefix:"$", suffix:""},
  ];
  const fmt=(v,prefix,suffix)=>v===null?<span style={{color:"var(--faint)"}}>—</span>:`${prefix}${v}${suffix}`;
  const isBlank=mainRows.every(r=>s[r.lw]===null&&s[r.mtd]===null)&&s.units_left===null;
  const thSt={padding:"10px 14px",textAlign:"left",fontSize:"12px",fontWeight:600,color:"var(--muted)",borderBottom:"1px solid var(--border)"};
  const tdLbl={padding:"10px 14px",borderBottom:"1px solid var(--border)",borderRight:"1px solid var(--border)",fontSize:"13px"};
  const tdVal={padding:"10px 14px",borderBottom:"1px solid var(--border)",fontFamily:"ui-monospace,'SF Mono',Menlo,Consolas,monospace",fontSize:"13px"};
  return <div className="fade-up">
    <SHead owner="Moniek" title="States" cadence="Weekly · Physical product · Inventory + expiry is the binding constraint" editing={editing} onEdit={onEdit} onSave={onSave} onCancel={onCancel}/>
    {isBlank&&!editing&&<div style={{background:"var(--red-bg)",border:"1px solid rgba(212,44,69,0.2)",borderRadius:"10px",padding:"12px 16px",marginBottom:"16px",fontSize:"13px",color:"var(--red)",display:"flex",alignItems:"center",gap:"10px"}}><AlertCircle size={14}/>Numbers not yet entered for this week.</div>}
    <Card><CardHead title="States Report"/><div style={{padding:"16px"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px"}}>
        <thead><tr>
          <th style={{...thSt,width:"40%",borderRight:"1px solid var(--border)"}}></th>
          <th style={{...thSt,borderRight:"1px solid var(--border)"}}>Last week</th>
          <th style={thSt}>MTD</th>
        </tr></thead>
        <tbody>
          {mainRows.map(r=><tr key={r.label}>
            <td style={tdLbl}>{r.label}</td>
            <td style={{...tdVal,borderRight:"1px solid var(--border)"}}>{editing?<NI value={s[r.lw]} onChange={v=>set([r.lw],v)} prefix={r.prefix} suffix={r.suffix}/>:fmt(s[r.lw],r.prefix,r.suffix)}</td>
            <td style={tdVal}>{editing?<NI value={s[r.mtd]} onChange={v=>set([r.mtd],v)} prefix={r.prefix} suffix={r.suffix}/>:fmt(s[r.mtd],r.prefix,r.suffix)}</td>
          </tr>)}
        </tbody>
      </table>
      <table style={{borderCollapse:"collapse",fontSize:"13px",marginTop:"16px"}}>
        <tbody><tr>
          <td style={{...tdLbl,minWidth:"220px"}}>Inventory Left (Bottles)</td>
          <td style={{...tdVal,minWidth:"160px"}}>{editing?<NI value={s.units_left} onChange={v=>set(["units_left"],v)}/>:fmt(s.units_left,"","")}</td>
        </tr></tbody>
      </table>
    </div></Card>
    <Card style={{marginTop:"16px"}}><div style={{padding:"16px",background:"rgba(0,160,160,0.06)",borderRadius:"8px"}}>
      {editing
        ?<TI value={s.notes} onChange={v=>set(["notes"],v)} multi style={{width:"100%"}}/>
        :<ul style={{margin:0,paddingLeft:"20px"}}>{s.notes?s.notes.split("\n").filter(Boolean).map((line,i)=><li key={i} style={{fontSize:"13px",color:"var(--muted)",lineHeight:1.7}}>{line}</li>):<li style={{fontSize:"13px",color:"var(--faint)"}}>Commentary</li>}</ul>
      }
    </div></Card>
    <SectionExtras cfg={data.page_config?.states||{}} onChange={v=>onChange(["page_config","states"],v)}/>
    <CommentsPanel comments={data.section_comments?.states} onChange={onComment} sectionLabel="States"/>
  </div>;
};

const Product = ({ data, editing, onEdit, onSave, onCancel, onChange, onComment }) => {
  const p=data.product; const set=(k,v)=>onChange(["product",k],v);
  const sColors={green:"var(--green)",amber:"var(--red)",red:"var(--red)",black:"var(--faint)"};
  const sLabels={green:"On Track",amber:"At Risk",red:"Off Track",black:"TBD"};
  const colPicker=(val,onChangeFn)=><select value={val==="amber"?"red":val??"auto"} onChange={e=>onChangeFn(e.target.value==="auto"?null:e.target.value)} style={{width:"52px",fontSize:"10px",padding:"2px",background:"var(--input-bg)",color:"var(--text)",border:"1px solid var(--input-border)",borderRadius:"4px"}}><option value="auto">auto</option><option value="green">🟢</option><option value="red">🔴</option></select>;
  const thStyle={padding:"6px 6px",textAlign:"right",fontSize:"10px",fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",color:"var(--muted)"};
  const thStyleL={...thStyle,textAlign:"left",padding:"6px 8px"};
  return <div className="fade-up">
    <SHead owner="Dario" title="Product" cadence="Weekly · Platform metrics + roadmap aligned with marketing" editing={editing} onEdit={onEdit} onSave={onSave} onCancel={onCancel}/>
    {/* HERO METRICS banner */}
    <div style={{background:"rgba(122,18,212,0.1)",border:"1px solid rgba(122,18,212,0.25)",borderRadius:"16px",padding:"20px 24px",marginBottom:"16px"}}>
      <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--purple2)",marginBottom:"16px"}}>★ Hero Metrics</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:"24px",alignItems:"start"}}>
        <div>
          <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"10px"}}>★ Platform Revenue MTD</div>
          <div className="font-display" style={{fontSize:"28px",lineHeight:1,marginBottom:"6px"}}>{editing?<NI value={p.platform_revenue_mtd} onChange={v=>set("platform_revenue_mtd",v)} prefix="$"/>:(p.platform_revenue_mtd===null?<span style={{color:"var(--faint)"}}>TBC</span>:fmtM(p.platform_revenue_mtd))}</div>
        </div>
        <div>
          <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"10px"}}>★ Engagement</div>
          <div className="font-display" style={{fontSize:"28px",lineHeight:1,marginBottom:"6px"}}>{editing?<NI value={p.engagement} onChange={v=>set("engagement",v)} suffix="%"/>:fmtPct(p.engagement)}</div>
          {editing
            ?<div style={{display:"flex",flexDirection:"column",gap:"5px"}}>
              <div style={{display:"flex",gap:"4px",alignItems:"center",fontSize:"11px",color:"var(--muted)"}}><span style={{width:"44px"}}>WoW:</span><NI value={p.engagement_wow} onChange={v=>set("engagement_wow",v)}/>{colPicker(p.engagement_wow_c,v=>set("engagement_wow_c",v))}</div>
              <div style={{display:"flex",gap:"4px",alignItems:"center",fontSize:"11px",color:"var(--muted)"}}><span style={{width:"44px"}}>vs Q2:</span><NI value={p.engagement_target_delta} onChange={v=>set("engagement_target_delta",v)}/>{colPicker(p.engagement_target_c,v=>set("engagement_target_c",v))}</div>
              <div style={{display:"flex",gap:"4px",alignItems:"center",fontSize:"11px",color:"var(--muted)"}}><span style={{width:"44px"}}>YoY:</span><NI value={p.engagement_yoy} onChange={v=>set("engagement_yoy",v)}/>{colPicker(p.engagement_yoy_c,v=>set("engagement_yoy_c",v))}</div>
            </div>
            :<div style={{fontSize:"12px",color:"var(--muted)",display:"flex",flexWrap:"wrap",alignItems:"center",gap:"5px"}}>
              <DotBadge val={p.engagement_wow} c={p.engagement_wow_c}/><span style={{color:"var(--faint)"}}>WoW</span>
              <span style={{color:"var(--faint)"}}>/</span>
              <DotBadge val={p.engagement_target_delta} c={p.engagement_target_c}/><span style={{color:"var(--faint)"}}>vs. Q2 target</span>
              <span style={{color:"var(--faint)"}}>/</span>
              <DotBadge val={p.engagement_yoy} c={p.engagement_yoy_c}/><span style={{color:"var(--faint)"}}>YoY</span>
            </div>
          }
        </div>
        <div>
          <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"10px"}}>★ Activation</div>
          <div className="font-display" style={{fontSize:"28px",lineHeight:1,marginBottom:"6px"}}>{editing?<NI value={p.activation} onChange={v=>set("activation",v)} suffix="%"/>:fmtPct(p.activation)}</div>
          {editing
            ?<div style={{display:"flex",flexDirection:"column",gap:"5px"}}>
              <div style={{display:"flex",gap:"4px",alignItems:"center",fontSize:"11px",color:"var(--muted)"}}><span style={{width:"44px"}}>WoW:</span><NI value={p.activation_wow} onChange={v=>set("activation_wow",v)}/>{colPicker(p.activation_wow_c,v=>set("activation_wow_c",v))}</div>
              <div style={{display:"flex",gap:"4px",alignItems:"center",fontSize:"11px",color:"var(--muted)"}}><span style={{width:"44px"}}>vs Q2:</span><NI value={p.activation_target_delta} onChange={v=>set("activation_target_delta",v)}/>{colPicker(p.activation_target_c,v=>set("activation_target_c",v))}</div>
              <div style={{display:"flex",gap:"4px",alignItems:"center",fontSize:"11px",color:"var(--muted)"}}><span style={{width:"44px"}}>YoY:</span><NI value={p.activation_yoy} onChange={v=>set("activation_yoy",v)}/>{colPicker(p.activation_yoy_c,v=>set("activation_yoy_c",v))}</div>
            </div>
            :<div style={{fontSize:"12px",color:"var(--muted)",display:"flex",flexWrap:"wrap",alignItems:"center",gap:"5px"}}>
              <DotBadge val={p.activation_wow} c={p.activation_wow_c}/><span style={{color:"var(--faint)"}}>WoW</span>
              <span style={{color:"var(--faint)"}}>/</span>
              <DotBadge val={p.activation_target_delta} c={p.activation_target_c}/><span style={{color:"var(--faint)"}}>vs. Q2 target</span>
              <span style={{color:"var(--faint)"}}>/</span>
              <DotBadge val={p.activation_yoy} c={p.activation_yoy_c}/><span style={{color:"var(--faint)"}}>YoY</span>
            </div>
          }
        </div>
      </div>
    </div>
    {/* Two-column metric tables */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px",marginBottom:"16px"}}>
      {/* Left: Revenue – Refund – Retention */}
      <Card>
        <CardHead title="Revenue · Refund · Retention"/>
        <div style={{padding:"12px",maxHeight:"380px",overflowY:"auto"}}>
          <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:"12px"}}>
            <thead><tr style={{borderBottom:"2px solid var(--border)"}}>
              <th style={thStyleL}>Metric</th>
              <th style={thStyle}>Actual</th>
              <th style={thStyle}>MoM</th>
              <th style={thStyle}>vs. Q2</th>
              <th style={thStyle}>YoY</th>
            </tr></thead>
            <tbody>{(p.revenue_refund_retention||[]).map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid var(--border)"}} className="ai-row">
                <td style={{padding:"7px 8px",color:"var(--muted)",fontSize:"12px"}}>{r.metric}</td>
                <td style={{padding:"7px 6px",textAlign:"right",fontFamily:"ui-monospace,'SF Mono','Roboto Mono',Menlo,Consolas,monospace"}}>
                  {(()=>{const isMoney=r.metric.includes("Revenue");return editing?<NI value={r.actual} onChange={v=>{const n=[...p.revenue_refund_retention];n[i]={...n[i],actual:v};set("revenue_refund_retention",n);}} prefix={isMoney?"$":""} suffix={isMoney?"":"%"}/>:(r.actual===null?<span style={{color:"var(--faint)"}}>TBD</span>:isMoney?fmtM(r.actual):fmtPct(r.actual));})()}
                </td>
                <td style={{padding:"7px 6px",textAlign:"right"}}>
                  {editing?<div style={{display:"flex",gap:"2px",alignItems:"center",justifyContent:"flex-end"}}><NI value={r.mom} onChange={v=>{const n=[...p.revenue_refund_retention];n[i]={...n[i],mom:v};set("revenue_refund_retention",n);}}/>{colPicker(r.mom_c,v=>{const n=[...p.revenue_refund_retention];n[i]={...n[i],mom_c:v};set("revenue_refund_retention",n);})}</div>:<DotBadge val={r.mom} c={r.mom_c}/>}
                </td>
                <td style={{padding:"7px 6px",textAlign:"right"}}>
                  {editing?<div style={{display:"flex",gap:"2px",alignItems:"center",justifyContent:"flex-end"}}><NI value={r.vs_target} onChange={v=>{const n=[...p.revenue_refund_retention];n[i]={...n[i],vs_target:v};set("revenue_refund_retention",n);}}/>{colPicker(r.vs_target_c,v=>{const n=[...p.revenue_refund_retention];n[i]={...n[i],vs_target_c:v};set("revenue_refund_retention",n);})}</div>:<DotBadge val={r.vs_target} c={r.vs_target_c}/>}
                </td>
                <td style={{padding:"7px 6px",textAlign:"right"}}>
                  {editing?<div style={{display:"flex",gap:"2px",alignItems:"center",justifyContent:"flex-end"}}><NI value={r.yoy} onChange={v=>{const n=[...p.revenue_refund_retention];n[i]={...n[i],yoy:v};set("revenue_refund_retention",n);}}/>{colPicker(r.yoy_c,v=>{const n=[...p.revenue_refund_retention];n[i]={...n[i],yoy_c:v};set("revenue_refund_retention",n);})}</div>:<DotBadge val={r.yoy} c={r.yoy_c}/>}
                </td>
              </tr>
            ))}</tbody>
          </table>
          </div>
          <p style={{fontSize:"11px",color:"var(--muted)",fontStyle:"italic",padding:"8px 0 0"}}>* Retention and refund data to be updated after day 21</p>
        </div>
      </Card>
      {/* Right: Checkout – Engagement – Transformation */}
      <Card>
        <CardHead title="Checkout · Engagement · Transformation"/>
        <div style={{padding:"12px",maxHeight:"380px",overflowY:"auto"}}>
          <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:"12px"}}>
            <thead><tr style={{borderBottom:"2px solid var(--border)"}}>
              <th style={thStyleL}>Metric</th>
              <th style={thStyle}>Actual</th>
              <th style={thStyle}>WoW</th>
              <th style={thStyle}>vs. Q2</th>
              <th style={thStyle}>YoY</th>
            </tr></thead>
            <tbody>{(p.checkout_engagement_transformation||[]).map((r,i)=>(
              <tr key={i} style={{borderBottom:"1px solid var(--border)"}} className="ai-row">
                <td style={{padding:"7px 8px",color:"var(--muted)",fontSize:"12px"}}>{r.metric}</td>
                <td style={{padding:"7px 6px",textAlign:"right",fontFamily:"ui-monospace,'SF Mono','Roboto Mono',Menlo,Consolas,monospace"}}>
                  {editing?<NI value={r.actual} onChange={v=>{const n=[...p.checkout_engagement_transformation];n[i]={...n[i],actual:v};set("checkout_engagement_transformation",n);}} suffix="%"/>:(r.actual===null?<span style={{color:"var(--faint)"}}>TBD</span>:fmtPct(r.actual))}
                </td>
                <td style={{padding:"7px 6px",textAlign:"right"}}>
                  {editing?<div style={{display:"flex",gap:"2px",alignItems:"center",justifyContent:"flex-end"}}><NI value={r.wow} onChange={v=>{const n=[...p.checkout_engagement_transformation];n[i]={...n[i],wow:v};set("checkout_engagement_transformation",n);}}/>{colPicker(r.wow_c,v=>{const n=[...p.checkout_engagement_transformation];n[i]={...n[i],wow_c:v};set("checkout_engagement_transformation",n);})}</div>:<DotBadge val={r.wow} c={r.wow_c}/>}
                </td>
                <td style={{padding:"7px 6px",textAlign:"right"}}>
                  {editing?<div style={{display:"flex",gap:"2px",alignItems:"center",justifyContent:"flex-end"}}><NI value={r.vs_target} onChange={v=>{const n=[...p.checkout_engagement_transformation];n[i]={...n[i],vs_target:v};set("checkout_engagement_transformation",n);}}/>{colPicker(r.vs_target_c,v=>{const n=[...p.checkout_engagement_transformation];n[i]={...n[i],vs_target_c:v};set("checkout_engagement_transformation",n);})}</div>:<DotBadge val={r.vs_target} c={r.vs_target_c}/>}
                </td>
                <td style={{padding:"7px 6px",textAlign:"right"}}>
                  {editing?<div style={{display:"flex",gap:"2px",alignItems:"center",justifyContent:"flex-end"}}><NI value={r.yoy} onChange={v=>{const n=[...p.checkout_engagement_transformation];n[i]={...n[i],yoy:v};set("checkout_engagement_transformation",n);}}/>{colPicker(r.yoy_c,v=>{const n=[...p.checkout_engagement_transformation];n[i]={...n[i],yoy_c:v};set("checkout_engagement_transformation",n);})}</div>:<DotBadge val={r.yoy} c={r.yoy_c}/>}
                </td>
              </tr>
            ))}</tbody>
          </table>
          </div>
        </div>
      </Card>
    </div>
    {/* Initiatives table */}
    <Card><CardHead title="Key Product Initiatives" action={editing&&<Btn variant="ghost" size="sm" onClick={()=>set("initiatives",[...p.initiatives,{name:"",status:"red",note:"",timeline:"",obj:""}])}><Plus size={12}/>Add</Btn>}/>
      <div style={{overflowX:"auto",overflowY:"auto",maxHeight:"480px"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px"}}>
        <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["#","Initiative","Status","Note","Timeline","Objective"].map(h=><th key={h} style={{padding:"12px 14px",textAlign:h==="#"||h==="Initiative"||h==="Note"?"left":"center",fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--muted)"}}>{h}</th>)}</tr></thead>
        <tbody>{p.initiatives.map((it,i)=><tr key={i} style={{borderBottom:"1px solid var(--border)"}} className="ai-row">
          <td style={{padding:"14px",color:"var(--faint)",fontSize:"12px",fontFamily:"monospace",width:"28px"}}>{i+1}</td>
          <td style={{padding:"14px",fontWeight:500}}>{editing?<TI value={it.name} onChange={v=>{const n=[...p.initiatives];n[i]={...n[i],name:v};set("initiatives",n);}}/>:it.name}</td>
          <td style={{padding:"14px",textAlign:"center"}}>{editing?<select value={it.status} onChange={e=>{const n=[...p.initiatives];n[i]={...n[i],status:e.target.value};set("initiatives",n);}} style={{width:"120px"}}><option value="green">🟢 On Track</option><option value="red">🔴 At Risk / Off Track</option><option value="black">⚫ TBD</option></select>:<span style={{color:sColors[it.status],fontSize:"13px",fontWeight:600}}>{sLabels[it.status]}</span>}</td>
          <td style={{padding:"14px",color:"var(--muted)",fontSize:"12px"}}>{editing?<TI value={it.note} onChange={v=>{const n=[...p.initiatives];n[i]={...n[i],note:v};set("initiatives",n);}}/>:it.note}</td>
          <td style={{padding:"14px",textAlign:"center",fontFamily:"monospace",fontSize:"12px",color:"var(--muted)"}}>{editing?<TI value={it.timeline} onChange={v=>{const n=[...p.initiatives];n[i]={...n[i],timeline:v};set("initiatives",n);}} style={{width:"100px"}}/>:it.timeline}</td>
          <td style={{padding:"14px",textAlign:"center",fontSize:"12px"}}><Pill label={it.obj} variant="purple"/></td>
        </tr>)}</tbody>
      </table></div>
    </Card>
    <SectionExtras cfg={data.page_config?.product||{}} onChange={v=>onChange(["page_config","product"],v)}/>
    <CommentsPanel comments={data.section_comments?.product} onChange={onComment} sectionLabel="Product"/>
  </div>;
};

// ─────────────────────────────────────────────────────────
// SECTION: ACTION ITEMS
// ─────────────────────────────────────────────────────────
const OKR_OPTIONS=["Revenue Protection","Revenue Close","Launch Execution","Revenue Forecast","Lead Generation","Platform Readiness","Summit Experience","Execution Cadence","Data & Reporting","Cash Management","Revenue Reporting","Ops Clarity"];
const STATUS_OPTIONS=["Open","In Progress","Complete","Blocked"];
const PRIORITY_OPTIONS=["Critical","High","Medium"];

const statusStyle=(s)=>s==="Open"?{bg:"var(--red-bg)",color:"var(--red)"}:s==="In Progress"?{bg:"rgba(127,127,127,0.1)",color:"var(--muted)"}:s==="Complete"?{bg:"var(--grn-bg)",color:"var(--green)"}:s==="Blocked"?{bg:"rgba(122,18,212,0.12)",color:"var(--purple2)"}:{bg:"rgba(127,127,127,0.1)",color:"var(--muted)"};
const prioStyle=(p)=>p==="Critical"?{bg:"var(--red-bg)",color:"var(--red)"}:{bg:"rgba(127,127,127,0.08)",color:"var(--muted)"};

// ─────────────────────────────────────────────────────────
// TRANSCRIPT → AI PARSER PANEL
// ─────────────────────────────────────────────────────────
const TranscriptPanel = ({ onImport }) => {
  const [open,setOpen]=useState(false);
  const [transcript,setTranscript]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const [preview,setPreview]=useState(null);
  const [filename,setFilename]=useState(null);
  const [pendingFile,setPendingFile]=useState(null);
  const fileInputRef=useRef(null);

  const onFile=async(e)=>{
    const f=e.target.files?.[0];
    e.target.value="";
    if(!f) return;
    if(f.size>10*1024*1024){ setError("File too large (max 10MB)"); return; }
    setError(null);
    setPreview(null);
    const isDocx=/\.docx$/i.test(f.name);
    if(isDocx){
      // Binary — server extracts the text. Don't try to read into the textarea.
      setPendingFile(f);
      setTranscript("");
      setFilename(f.name);
    } else {
      try {
        const text=await f.text();
        setPendingFile(null);
        setTranscript(text);
        setFilename(f.name);
      } catch(err){ setError("Could not read file: "+err.message); }
    }
  };

  const parse=async()=>{
    if(!pendingFile && !transcript.trim()) return;
    setLoading(true); setError(null); setPreview(null);
    try {
      let res;
      if(pendingFile){
        const fd=new FormData();
        fd.append("file",pendingFile);
        res=await fetch("/api/parse-transcript",{method:"POST",body:fd});
      } else {
        res=await fetch("/api/parse-transcript",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({transcript})});
      }
      const json=await res.json();
      if(!res.ok) throw new Error(json.error||"Parse failed");
      setPreview(json);
    } catch(e){ setError(e.message); }
    finally { setLoading(false); }
  };

  const confirmImport=()=>{
    if(!preview) return;
    onImport(preview.items||[],preview.decisions||[]);
    setPreview(null); setTranscript(""); setFilename(null); setPendingFile(null); setOpen(false);
  };

  return (
    <div style={{margin:"28px 0 4px",border:"1px solid var(--border)",borderRadius:"16px",overflow:"hidden",background:"var(--card)"}}>
      <button onClick={()=>setOpen(!open)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 18px",background:"transparent",border:"none",cursor:"pointer",color:"var(--text)",fontFamily:"inherit"}}>
        <span style={{display:"flex",alignItems:"center",gap:"10px"}}>
          <MessageSquare size={14} style={{color:"var(--purple2)",flexShrink:0}}/>
          <span style={{fontSize:"13px",fontWeight:500,color:"var(--muted)"}}>Paste meeting transcript → AI extracts action items</span>
          {preview&&<span style={{background:"var(--grn-bg)",color:"var(--green)",fontSize:"10px",fontWeight:700,letterSpacing:"0.06em",textTransform:"uppercase",border:"1px solid rgba(46,204,113,0.2)",borderRadius:"20px",padding:"2px 8px"}}>Ready to import</span>}
        </span>
        {open?<ChevronUp size={14} style={{color:"var(--faint)"}}/>:<ChevronDown size={14} style={{color:"var(--faint)"}}/>}
      </button>
      {open&&<div style={{padding:"18px",borderTop:"1px solid var(--border)",display:"flex",flexDirection:"column",gap:"14px"}}>
        <div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"8px",gap:"10px",flexWrap:"wrap"}}>
            <div style={{fontSize:"10px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--gold)"}}>Paste or upload transcript</div>
            <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
              {filename&&<span style={{fontSize:"11px",color:"var(--muted)",display:"flex",alignItems:"center",gap:"4px"}}><FileText size={11}/>{filename}</span>}
              <input ref={fileInputRef} type="file" accept=".txt,.vtt,.srt,.md,.docx,text/plain,text/vtt,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={onFile} style={{display:"none"}}/>
              <Btn variant="ghost" onClick={()=>fileInputRef.current?.click()}><Paperclip size={13}/>Upload file</Btn>
            </div>
          </div>
          <p style={{fontSize:"12px",color:"var(--muted)",marginBottom:"8px",lineHeight:1.6}}>Paste the raw meeting transcript below, or upload a .txt / .vtt / .srt / .docx file. The AI will extract action items (owner, priority, due date, OKR) and decisions required — then you can review before importing.</p>
          <textarea value={transcript} onChange={e=>{setTranscript(e.target.value);setFilename(null);setPendingFile(null);}} placeholder={pendingFile?`Will analyze uploaded file: ${pendingFile.name}`:"Paste the full meeting transcript here…"} rows={8} disabled={!!pendingFile} style={{width:"100%",resize:"vertical",lineHeight:1.7,fontSize:"13px",opacity:pendingFile?0.6:1}}/>
        </div>
        {error&&<div style={{background:"var(--red-bg)",border:"1px solid rgba(212,44,69,0.2)",borderRadius:"8px",padding:"10px 14px",fontSize:"13px",color:"var(--red)"}}>{error}</div>}
        {!preview&&<Btn variant="primary" onClick={parse} disabled={loading||(!transcript.trim()&&!pendingFile)}>{loading?<><RotateCcw size={13} style={{animation:"spin 1s linear infinite"}}/>Analyzing…</>:<><Send size={13}/>Analyze with AI</>}</Btn>}
        {preview&&<>
          <div>
            <div style={{fontSize:"10px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--gold)",marginBottom:"10px"}}>Preview — {preview.items?.length||0} action items · {preview.decisions?.length||0} decisions</div>
            <div style={{display:"flex",flexDirection:"column",gap:"6px",maxHeight:"240px",overflowY:"auto"}}>
              {preview.items?.map((it,i)=><div key={i} style={{background:"var(--card2)",border:"1px solid var(--border)",borderRadius:"8px",padding:"10px 14px",fontSize:"12px"}}>
                <div style={{display:"flex",gap:"8px",alignItems:"baseline",marginBottom:"3px"}}>
                  <span style={{fontWeight:700,color:"var(--text)"}}>{it.title}</span>
                  <span style={{color:"var(--muted)"}}>→ {it.owner}</span>
                  <span style={{color:"var(--faint)"}}>due {it.due}</span>
                  <span style={{marginLeft:"auto",fontWeight:700,color:it.priority==="Critical"?"var(--red)":it.priority==="High"?"var(--amber)":"var(--muted)"}}>{it.priority}</span>
                </div>
                {it.note&&<div style={{fontSize:"11px",color:"var(--faint)"}}>{it.note}</div>}
              </div>)}
            </div>
          </div>
          <div style={{display:"flex",gap:"8px"}}>
            <Btn variant="gold" onClick={confirmImport}><Check size={13}/>Import {preview.items?.length} items into register</Btn>
            <Btn variant="ghost" onClick={()=>setPreview(null)}><RotateCcw size={13}/>Re-analyze</Btn>
          </div>
        </>}
        <p style={{fontSize:"11px",color:"var(--faint)"}}>Powered by Claude Sonnet 4.6. Items are appended — existing register is not overwritten.</p>
      </div>}
    </div>
  );
};

const parseDueToISO=(due)=>{
  if(!due||due==="TBD"||due==="—")return"";
  const months={Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12};
  const m=due.match(/^(\w{3})\s+(\d{1,2})(?:,?\s*(\d{4}))?$/);
  if(m){const mo=months[m[1]];if(mo){const yr=m[3]?parseInt(m[3]):2026;return`${yr}-${String(mo).padStart(2,"0")}-${String(parseInt(m[2])).padStart(2,"0")}`;}}
  return due;
};
const formatISOToDue=(iso)=>{
  if(!iso)return"TBD";
  const d=new Date(iso+"T00:00:00");
  if(isNaN(d.getTime()))return iso;
  return d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
};

const ItemRow=({ it, editing, updateItem, confirmDel, setConfirmDel, deleteItem })=>{
  const ss=statusStyle(it.status); const ps=prioStyle(it.priority);
  return <tr className="ai-row" style={{borderBottom:"1px solid var(--border)",borderLeft:it.flagged?"3px solid var(--red)":"3px solid transparent"}}>
    <td style={{padding:"12px 14px",minWidth:"220px"}}>
      {editing
        ? <><div><input value={it.title} onChange={e=>updateItem(it.id,"title",e.target.value)} style={{fontWeight:600,fontSize:"13px",width:"100%",background:"transparent",border:"none",borderBottom:"1px solid transparent",borderRadius:"0",padding:"0 0 2px",color:"var(--text)"}} onFocus={e=>e.target.style.borderBottomColor="var(--purple)"} onBlur={e=>e.target.style.borderBottomColor="transparent"}/></div><div><input value={it.note} onChange={e=>updateItem(it.id,"note",e.target.value)} style={{fontSize:"11.5px",color:"var(--muted)",width:"100%",background:"transparent",border:"none",borderBottom:"1px solid transparent",borderRadius:"0",padding:"0 0 1px"}} onFocus={e=>e.target.style.borderBottomColor="var(--purple)"} onBlur={e=>e.target.style.borderBottomColor="transparent"}/></div></>
        : <><div style={{fontWeight:600,fontSize:"13px",color:"var(--text)",marginBottom:"2px"}}>{it.title}</div><div style={{fontSize:"11.5px",color:"var(--muted)",lineHeight:1.4}}>{it.note}</div></>}
    </td>
    <td style={{padding:"12px 10px",fontSize:"13px"}}>
      {editing ? <input value={it.owner} onChange={e=>updateItem(it.id,"owner",e.target.value)} style={{fontSize:"13px",width:"100%",background:"transparent",border:"none",padding:"0",color:"var(--text)"}}/> : <span style={{color:"var(--text)"}}>{it.owner}</span>}
    </td>
    <td style={{padding:"12px 10px"}}>
      {editing ? <input type="date" value={parseDueToISO(it.due)} onChange={e=>updateItem(it.id,"due",e.target.value?formatISOToDue(e.target.value):"TBD")} style={{fontSize:"12px",fontWeight:600,background:"transparent",border:"1px solid var(--border)",borderRadius:"4px",padding:"2px 4px",color:"var(--text)",colorScheme:"dark",cursor:"pointer"}}/> : <span className="font-mono" style={{fontSize:"12px",fontWeight:600,color:"var(--text)"}}>{it.due}</span>}
    </td>
    <td style={{padding:"12px 10px"}}>
      <select value={it.priority} onChange={e=>updateItem(it.id,"priority",e.target.value)} style={{background:ps.bg,color:ps.color,border:"none",borderRadius:"20px",padding:"3px 8px",fontSize:"11px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{PRIORITY_OPTIONS.map(o=><option key={o}>{o}</option>)}</select>
    </td>
    <td style={{padding:"12px 10px"}}>
      <select value={it.status} onChange={e=>updateItem(it.id,"status",e.target.value)} style={{background:ss.bg,color:ss.color,border:"none",borderRadius:"20px",padding:"3px 8px",fontSize:"11px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{STATUS_OPTIONS.map(o=><option key={o}>{o}</option>)}</select>
    </td>
    <td style={{padding:"12px 8px",width:"40px"}}>
      {editing&&(confirmDel===it.id
        ? <div style={{display:"flex",gap:"4px",alignItems:"center"}}><span style={{fontSize:"11px",color:"var(--red)",fontWeight:700,whiteSpace:"nowrap"}}>Sure?</span><button onClick={()=>deleteItem(it.id)} style={{background:"var(--red)",color:"#fff",border:"none",borderRadius:"4px",padding:"2px 7px",fontSize:"11px",fontWeight:700,cursor:"pointer"}}>Yes</button><button onClick={()=>setConfirmDel(null)} style={{background:"var(--border)",color:"var(--muted)",border:"none",borderRadius:"4px",padding:"2px 7px",fontSize:"11px",cursor:"pointer"}}>No</button></div>
        : <button onClick={()=>setConfirmDel(it.id)} style={{background:"none",border:"none",color:"var(--faint)",cursor:"pointer",padding:"4px",borderRadius:"4px",display:"flex",alignItems:"center"}} aria-label="Remove item"><Trash2 size={13}/></button>)}
    </td>
  </tr>;
};

const ActionItems = ({ data, editing, onEdit, onSave, onCancel, onChange, onComment, onImport }) => {
  const ai=data.action_items ?? {items:[],decisions:[],next_id:1,pm_flag_active:false,pm_flag_text:""};
  const [filter,setFilter]=useState("All");
  const [search,setSearch]=useState("");
  const [confirmDel,setConfirmDel]=useState(null);

  const setAI=(key,val)=>onChange(["action_items",key],val);
  const updateItem=(id,k,v)=>setAI("items",ai.items.map(it=>it.id===id?{...it,[k]:v}:it));
  const deleteItem=(id)=>{ setAI("items",ai.items.filter(it=>it.id!==id)); setConfirmDel(null); };
  const addItem=(priority)=>{ const nextId=(ai.next_id||100); setAI("items",[...ai.items,{id:nextId,priority,title:"New action item",note:"Add details here",owner:"—",supporting:"—",due:"TBD",okr:"Execution Cadence",status:"Open",flagged:false}]); onChange(["action_items","next_id"],nextId+1); };

  const filtered=ai.items.filter(it=>{
    const matchSearch=!search||it.title.toLowerCase().includes(search.toLowerCase())||it.owner.toLowerCase().includes(search.toLowerCase());
    const matchFilter=filter==="All"||(PRIORITY_OPTIONS.includes(filter)?it.priority===filter:it.status===filter);
    return matchSearch&&(filter==="All"||matchFilter);
  });

  const grouped=(prio)=>filtered.filter(it=>it.priority===prio);
  const stats=[{n:ai.items.length,l:"Total Items",c:"var(--purple)"},{n:ai.items.filter(it=>it.priority==="Critical"&&it.status!=="Complete").length,l:"Critical Open",c:"var(--red)"},{n:ai.items.filter(it=>it.status==="Open").length,l:"Open",c:"var(--red)"},{n:ai.items.filter(it=>it.status==="In Progress").length,l:"In Progress",c:"var(--muted)"},{n:ai.items.filter(it=>it.status==="Complete").length,l:"Complete",c:"var(--green)"}];
  const dColors=["var(--green)","var(--purple)","var(--red)","var(--green)","var(--red)"];

  return <div className="fade-up">
    <SHead owner="All" title="Action Item Register" cadence="Weekly · All BUs · Editable tracker" editing={editing} onEdit={onEdit} onSave={onSave} onCancel={onCancel}/>

    {/* PM Flag */}
    {ai.pm_flag_active&&<div style={{background:"var(--red-bg)",border:"1px solid rgba(212,44,69,0.2)",borderRadius:"10px",padding:"14px 18px",marginBottom:"20px",display:"flex",gap:"12px",alignItems:"flex-start"}}>
      <Flag size={15} style={{color:"var(--red)",flexShrink:0,marginTop:"2px"}}/>
      <div style={{flex:1}}><div style={{fontSize:"12px",fontWeight:700,color:"var(--red)",marginBottom:"4px",textTransform:"uppercase",letterSpacing:"0.06em"}}>PM Flag — Immediate Attention Required</div>
        {editing ? <input value={ai.pm_flag_text} onChange={e=>setAI("pm_flag_text",e.target.value)} style={{fontSize:"13px",color:"var(--muted)",background:"transparent",border:"none",padding:"0",width:"100%",lineHeight:1.6}}/> : <p style={{fontSize:"13px",color:"var(--muted)",lineHeight:1.6}}>{ai.pm_flag_text}</p>}
      </div>
      {editing&&<button onClick={()=>setAI("pm_flag_active",false)} aria-label="Dismiss flag" style={{background:"none",border:"none",color:"var(--faint)",cursor:"pointer"}}><X size={14}/></button>}
    </div>}
    {!ai.pm_flag_active&&editing&&<Btn variant="ghost" size="sm" style={{marginBottom:"16px"}} onClick={()=>setAI("pm_flag_active",true)}><Flag size={13}/>Add PM flag</Btn>}

    {/* ── DECISIONS REQUIRED — moved above the tables ── */}
    <div style={{marginBottom:"24px"}}>
      <div style={{display:"flex",alignItems:"baseline",gap:"12px",marginBottom:"12px"}}>
        <div>
          <div style={{fontSize:"10px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--muted)",marginBottom:"4px"}}>Decisions</div>
          <div style={{fontSize:"17px",fontWeight:600,color:"var(--text)"}}>🔷 Decisions Required</div>
        </div>
        <p style={{fontSize:"12px",color:"var(--muted)"}}>Blocked pending exec decisions — each day of delay = revenue at risk.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:"12px"}}>
        {(ai.decisions ?? []).map((d,i)=>(
          <div key={d.id} style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"10px",padding:"16px",borderTop:`3px solid ${dColors[i%dColors.length]}`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"6px"}}>
              <div style={{fontSize:"10px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--muted)"}}>Decision {String(i+1).padStart(2,"0")}</div>
              {editing&&<button onClick={()=>setAI("decisions",ai.decisions.filter((_,j)=>j!==i))} style={{background:"transparent",border:"none",padding:"2px",cursor:"pointer",color:"var(--faint)",display:"flex",alignItems:"center"}} title="Delete decision"><Trash2 size={13}/></button>}
            </div>
            {editing
              ? <><input value={d.title} onChange={e=>{const n=[...ai.decisions];n[i]={...n[i],title:e.target.value};setAI("decisions",n);}} style={{background:"transparent",border:"none",padding:"0 0 4px",borderBottom:`1px solid ${dColors[i%dColors.length]}`,color:dColors[i%dColors.length],fontWeight:700,fontSize:"14px",width:"100%",marginBottom:"8px"}}/><textarea value={d.body} onChange={e=>{const n=[...ai.decisions];n[i]={...n[i],body:e.target.value};setAI("decisions",n);}} rows={2} style={{fontSize:"12px",color:"var(--muted)",lineHeight:1.6,width:"100%",resize:"vertical",background:"transparent",border:"none",padding:"0"}}/></>
              : <><div style={{fontSize:"14px",fontWeight:700,color:dColors[i%dColors.length],marginBottom:"8px"}}>{d.title}</div><p style={{fontSize:"12px",color:"var(--muted)",lineHeight:1.6}}>{d.body}</p></>}
          </div>
        ))}
        {editing&&<button onClick={()=>setAI("decisions",[...(ai.decisions??[]),{id:uid(),title:"New decision needed",body:"Describe the decision and why it's blocked…"}])} style={{background:"transparent",border:"1.5px dashed var(--border)",borderRadius:"10px",padding:"16px",color:"var(--faint)",fontSize:"13px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}><Plus size={14}/>Add decision</button>}
        {(ai.decisions??[]).length===0&&!editing&&<p style={{fontSize:"13px",color:"var(--faint)",padding:"4px 0",fontStyle:"italic"}}>No decisions required</p>}
      </div>
    </div>

    {/* Stats row */}
    <div className="rg-5" style={{gap:"10px",marginBottom:"20px"}}>
      {stats.map((s,i)=><div key={i} style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"10px",padding:"12px 16px",borderTop:`3px solid ${s.c}`}}>
        <div className="font-display" style={{fontSize:"26px",color:s.c,lineHeight:1,marginBottom:"4px"}}>{s.n}</div>
        <div style={{fontSize:"10px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--muted)"}}>{s.l}</div>
      </div>)}
    </div>

    {/* Filter + Search */}
    <div style={{display:"flex",gap:"8px",flexWrap:"wrap",alignItems:"center",marginBottom:"20px"}}>
      {["All","Critical","High","Medium","Open","In Progress","Complete","Blocked"].map(f=><button key={f} onClick={()=>setFilter(f)} style={{padding:"5px 12px",borderRadius:"20px",border:`1.5px solid ${filter===f?"var(--purple)":"var(--border)"}`,background:filter===f?"var(--purple)":"transparent",fontSize:"11px",fontWeight:600,color:filter===f?"#fff":"var(--muted)",cursor:"pointer",fontFamily:"inherit",transition:"all 0.15s"}}>{f}</button>)}
      <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:"8px",background:"var(--card)",border:"1px solid var(--border)",borderRadius:"8px",padding:"6px 12px"}}>
        <Search size={13} style={{color:"var(--faint)"}}/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search items or owner…" style={{background:"transparent",border:"none",borderRadius:"0",padding:"0",width:"180px",fontSize:"13px"}}/>
      </div>
    </div>

    {/* Priority tables */}
    {[{prio:"Critical",emoji:"🔴",label:"Critical Path Items"},{prio:"High",emoji:"🟠",label:"High Priority Items"},{prio:"Medium",emoji:"🟡",label:"Medium Priority Items"}].map(({prio,emoji,label})=>{
      const rows=grouped(prio);
      const show=filter==="All"||filter===prio||["Open","In Progress","Complete","Blocked"].includes(filter);
      return show?<div key={prio} style={{marginBottom:"24px"}}>
        <div style={{fontSize:"10px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--muted)",marginBottom:"4px"}}>Priority {prio==="Critical"?"01":prio==="High"?"02":"03"}</div>
        <div style={{fontSize:"16px",fontWeight:600,color:prio==="Critical"?"var(--red)":prio==="High"?"var(--amber)":"var(--text)",marginBottom:"12px"}}>{emoji} {label}</div>
        {rows.length>0
          ? <Card><div style={{overflowX:"auto",overflowY:"auto",maxHeight:"560px"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px"}}>
              <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Action Item","Owner","Due","Priority","Status",""].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--muted)",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
              <tbody>{rows.map(it=><ItemRow key={it.id} it={it} editing={editing} updateItem={updateItem} confirmDel={confirmDel} setConfirmDel={setConfirmDel} deleteItem={deleteItem}/>)}</tbody>
            </table></div></Card>
          : <div style={{fontSize:"13px",color:"var(--faint)",fontStyle:"italic",padding:"12px 0"}}>No {prio.toLowerCase()} items match the current filter.</div>}
        {editing&&<button onClick={()=>addItem(prio)} style={{marginTop:"8px",padding:"6px 14px",background:"transparent",border:`1.5px dashed ${prio==="Critical"?"var(--red)":prio==="High"?"var(--amber)":"var(--border)"}`,borderRadius:"7px",color:prio==="Critical"?"var(--red)":prio==="High"?"var(--amber)":"var(--muted)",fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:"6px"}}><Plus size={12}/>Add {prio} item</button>}
      </div>:null;
    })}

    {/* TRANSCRIPT → AI PARSER */}
    <TranscriptPanel onImport={onImport}/>

    <SectionExtras cfg={data.page_config?.action_items||{}} onChange={v=>onChange(["page_config","action_items"],v)}/>
    <CommentsPanel comments={data.section_comments?.action_items} onChange={onComment} sectionLabel="Action Items"/>
  </div>;
};

// ─────────────────────────────────────────────────────────
// SECTION: MEETING NOTES
// ─────────────────────────────────────────────────────────
const MeetingNotesSection = ({ data, onChange }) => (
  <div className="fade-up">
    <div style={{marginBottom:"24px",paddingBottom:"20px",borderBottom:"1px solid var(--border)"}}>
      <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"8px"}}>Session record · All BUs</div>
      <h2 className="font-display" style={{fontSize:"30px",fontWeight:400,color:"var(--text)",lineHeight:1}}>Meeting Notes</h2>
    </div>
    <Card><CardHead title="Decisions · Action Items · Open Questions · Key Takeaways"/>
      <div style={{padding:"20px"}}>
        <textarea value={data.meeting_notes||""} onChange={e=>onChange(["meeting_notes"],e.target.value)} placeholder="Record key decisions, action items, open questions, or observations from today's meeting…" rows={16} style={{width:"100%",resize:"vertical",lineHeight:"1.8",fontSize:"14px"}}/>
      </div>
    </Card>
    <SectionExtras cfg={data.page_config?.meeting_notes||{}} onChange={v=>onChange(["page_config","meeting_notes"],v)}/>
    <CommentsPanel comments={data.section_comments?.meeting_notes||[]} onChange={c=>{const n={...data.section_comments,meeting_notes:c};onChange(["section_comments"],n);}} sectionLabel="Meeting Notes"/>
  </div>
);

// ─────────────────────────────────────────────────────────
// SECTIONS REGISTRY  (Refunds & Cost removed)
// ─────────────────────────────────────────────────────────
const avatarBg = (name) => { const c=["#7B5FF5","#E8B84B","#2ECC71","#FF4D6A","#FF9B3C","#4ECDC4","#9B7FFF","#1A9950"]; return c[(name.charCodeAt(0)||0)%c.length]; };
const SECTIONS=[
  {id:"company_health", label:"Company Health", owner:"Jill",    num:"01", Component:CompanyHealth},
  {id:"bu_performance", label:"BU Performance", owner:"Jill",    num:"02", Component:BUPerformance},
  {id:"membership",     label:"Membership",     owner:"Rafay",   num:"03", Component:Membership},
  {id:"pathways",       label:"Pathways",        owner:"Dan",     num:"04", Component:Pathways},
  {id:"masteries",      label:"Masteries",       owner:"Jaideep", num:"05", Component:Masteries},
  {id:"events",         label:"Events",          owner:"Eni",     num:"06", Component:Events},
  {id:"states",         label:"States",          owner:"Moniek",  num:"07", Component:States},
  {id:"product",        label:"Product",         owner:"Dario",   num:"08", Component:Product},
  {id:"action_items",   label:"Action Items",    owner:"All",     num:"✦",  Component:ActionItems},
  {id:"meeting_notes",  label:"Meeting Notes",   owner:"All",     num:"★",  Component:MeetingNotesSection}
];

// ─────────────────────────────────────────────────────────
// HISTORY PANEL
// ─────────────────────────────────────────────────────────
const HistoryPanel=({ meetings, onLoad, onClose, onDelete, onUpdateDate })=>{
  const [editingDate,setEditingDate]=useState(null);
  const [tempDate,setTempDate]=useState("");
  const startDateEdit=(m)=>{setEditingDate(m.id);setTempDate(m.date);};
  const saveDateEdit=()=>{onUpdateDate(editingDate,tempDate);setEditingDate(null);};
  return (
  <div onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="history-panel-title" onKeyDown={e=>{if(e.key==="Escape")onClose();}} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:"32px"}}>
    <div onClick={e=>e.stopPropagation()} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"16px",maxWidth:"600px",width:"100%",maxHeight:"75vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"20px 24px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div><h2 id="history-panel-title" className="font-display" style={{fontSize:"22px",color:"var(--text)"}}>Meeting Archive</h2><p style={{fontSize:"12px",color:"var(--muted)",marginTop:"2px"}}>{meetings.length} saved meeting{meetings.length!==1?"s":""}</p></div>
        <Btn variant="ghost" size="sm" onClick={onClose}><X size={15}/></Btn>
      </div>
      <div style={{overflowY:"auto",padding:"16px"}}>
        {meetings.length===0?<p style={{color:"var(--faint)",fontStyle:"italic",textAlign:"center",padding:"32px",fontSize:"14px"}}>No saved meetings yet.</p>
        :meetings.map(m=><div key={m.id} style={{border:"1px solid var(--border)",borderRadius:"10px",padding:"16px",marginBottom:"8px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--card)"}}>
          <div>
            <div className="font-display" style={{fontSize:"17px",marginBottom:"3px"}}>{m.label||fmtDate(m.date)}</div>
            <div style={{fontSize:"12px",color:"var(--faint)",display:"flex",alignItems:"center",gap:"6px"}}>
              {editingDate===m.id
                ?<><input type="date" value={tempDate} onChange={e=>setTempDate(e.target.value)} style={{background:"var(--input-bg)",border:"1px solid var(--input-border)",color:"var(--text)",padding:"2px 6px",borderRadius:"6px",fontSize:"12px"}}/><button onClick={saveDateEdit} style={{background:"var(--green)",color:"#fff",border:"none",borderRadius:"4px",padding:"2px 7px",fontSize:"11px",cursor:"pointer",fontWeight:600}}>Save</button><button onClick={()=>setEditingDate(null)} style={{background:"var(--border)",color:"var(--muted)",border:"none",borderRadius:"4px",padding:"2px 7px",fontSize:"11px",cursor:"pointer"}}>Cancel</button></>
                :<><span>{fmtDate(m.date)}</span><span>·</span><span>{new Date(m.savedAt).toLocaleString()}</span><button onClick={()=>startDateEdit(m)} title="Edit date" style={{background:"transparent",border:"none",color:"var(--faint)",cursor:"pointer",padding:"0 2px",display:"inline-flex",alignItems:"center"}}><Edit3 size={10}/></button></>
              }
            </div>
          </div>
          <div style={{display:"flex",gap:"8px"}}><Btn variant="outline" size="sm" onClick={()=>onLoad(m.id)}>Open</Btn><Btn variant="danger" size="sm" onClick={()=>onDelete(m.id)}><Trash2 size={12}/></Btn></div>
        </div>)}
      </div>
    </div>
  </div>
  );
};

// ─────────────────────────────────────────────────────────
// DATE SELECT SCREEN
// ─────────────────────────────────────────────────────────
const DateSelectScreen = ({ meetings, onSelect, onCreate }) => {
  const [showNew, setShowNew]=useState(false);
  const [newDate, setNewDate]=useState(nextTuesdayISO());
  const today=localISO();

  // Classify meetings
  const currentDraft=meetings.find(m=>m.status==="Draft"&&(!m.date||m.date>=today));
  const pastMeetings=[...meetings]
    .filter(m=>!(m.status==="Draft"&&(!m.date||m.date>=today)))
    .filter(m=>!currentDraft||m.id!==currentDraft.id)
    .filter(m=>!currentDraft||!m.date||m.date!==currentDraft.date)
    .sort((a,b)=>b.date>a.date?-1:1);

  const mkWeekday=d=>{if(!d) return ""; const [y,mo,dy]=d.split('-').map(Number); return new Date(y,mo-1,dy).toLocaleDateString("en-US",{weekday:"long"});};

  return (
    <div className="fade-up" role="dialog" aria-modal="true" aria-labelledby="date-select-title" style={{position:"fixed",inset:0,zIndex:9999,background:"var(--bg)",overflowY:"auto",pointerEvents:"all"}}>
      <div style={{maxWidth:"640px",width:"100%",margin:"0 auto",padding:"48px 32px 80px"}}>

        {/* Hero */}
        <div style={{textAlign:"center",marginBottom:"40px"}}>
          <div style={{width:"58px",height:"58px",borderRadius:"16px",background:"linear-gradient(135deg,var(--purple),var(--purple2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"26px",fontWeight:700,color:"#fff",margin:"0 auto 18px",boxShadow:"0 8px 28px rgba(122,18,212,0.4)"}}>M</div>
          <div className="eyebrow" style={{marginBottom:"10px"}}>Mindvalley · Revenue Task Force</div>
          <h1 id="date-select-title" className="font-display" style={{fontSize:"38px",color:"var(--text)",lineHeight:1.05}}>Revenue Meeting</h1>
          <p style={{fontSize:"14px",color:"var(--muted)",marginTop:"10px"}}>Select a meeting week to open</p>
        </div>

        {/* Current draft — or empty state */}
        {currentDraft
          ?<div onClick={()=>onSelect(currentDraft)} style={{border:"1.5px solid rgba(122,18,212,0.45)",borderRadius:"16px",padding:"20px 24px",marginBottom:"10px",cursor:"pointer",background:"linear-gradient(135deg,rgba(122,18,212,0.1),rgba(122,18,212,0.04))",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all 0.15s",boxShadow:"0 0 30px rgba(122,18,212,0.08)"}}>
              <div>
                <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"5px"}}>Current Draft</div>
                <div className="font-display" style={{fontSize:"24px",color:"var(--text)"}}>{fmtDate(currentDraft.date)||"This week"}</div>
                <div style={{fontSize:"12px",color:"var(--muted)",marginTop:"3px"}}>{mkWeekday(currentDraft.date)} · Week {getISOWeek(currentDraft.date)||"—"} · Continue editing</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:"10px",flexShrink:0}}>
                <Pill label="Draft" variant="warn"/>
                <ArrowRight size={16} style={{color:"var(--purple2)"}}/>
              </div>
            </div>
          :<div style={{border:"1px dashed var(--border)",borderRadius:"16px",padding:"22px 24px",marginBottom:"10px",textAlign:"center"}}>
            <div style={{fontSize:"13px",color:"var(--muted)",marginBottom:"12px"}}>No active draft for this week</div>
            <Btn variant="primary" onClick={()=>setShowNew(true)}>+ Create This Week&apos;s Meeting</Btn>
          </div>
        }

        {/* New meeting toggle */}
        <div style={{marginBottom:"22px"}}>
          {!showNew
            ?<button onClick={()=>setShowNew(true)} style={{display:"flex",alignItems:"center",gap:"7px",background:"none",border:"1px solid var(--border)",borderRadius:"8px",padding:"8px 14px",color:"var(--muted)",cursor:"pointer",fontSize:"13px",fontFamily:"inherit",width:"100%",justifyContent:"center",transition:"all 0.12s"}}><Plus size={13}/>New Meeting for a Different Date</button>
            :<div style={{border:"1px solid var(--border-strong,rgba(255,255,255,0.13))",borderRadius:"16px",padding:"18px 22px",background:"var(--card2)"}}>
                <div style={{fontSize:"12px",fontWeight:700,color:"var(--muted)",marginBottom:"12px",textTransform:"uppercase",letterSpacing:"0.07em"}}>Create New Meeting</div>
                <div style={{display:"flex",alignItems:"center",gap:"10px",flexWrap:"wrap"}}>
                  <input type="date" value={newDate} onChange={e=>setNewDate(e.target.value)} min={today} style={{flex:"1 1 160px"}}/>
                  <Btn variant="primary" onClick={()=>{if(newDate){onCreate(newDate);setShowNew(false);}}}>Create Draft</Btn>
                  <Btn variant="ghost" onClick={()=>setShowNew(false)}>Cancel</Btn>
                </div>
              </div>
          }
        </div>

        {/* Past meetings */}
        {pastMeetings.length>0&&<>
          <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--faint)",marginBottom:"10px"}}>Past Meetings</div>
          <div className="rg-2" style={{gap:"10px"}}>
            {pastMeetings.map(m=>(
              <div key={m.id} onClick={()=>onSelect(m)} style={{border:"1px solid var(--border)",borderRadius:"16px",padding:"15px 18px",cursor:"pointer",background:"var(--card)",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"all 0.15s"}}>
                <div>
                  <div className="font-display" style={{fontSize:"18px",color:"var(--text)"}}>{fmtDate(m.date)||m.label||"Untitled meeting"}</div>
                  {m.date&&<div style={{fontSize:"11px",color:"var(--faint)",marginTop:"2px"}}>{mkWeekday(m.date)} · Week {getISOWeek(m.date)}</div>}
                </div>
                <div style={{display:"flex",alignItems:"center",gap:"8px",flexShrink:0}}>
                  <Pill label={m.status==="Draft"?"Draft":"Finalized"} variant={m.status==="Draft"?"warn":"good"}/>
                  <ArrowRight size={15} style={{color:"var(--muted)"}}/>
                </div>
              </div>
            ))}
          </div>
        </>}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────
export default function App() {
  const [data,setData]=useState(mkSeed());
  const [active,setActive]=useState("company_health");
  const [editingSec,setEditingSec]=useState(null);
  const [draftBak,setDraftBak]=useState(null);
  const [meetings,setMeetings]=useState([]);
  const [showHistory,setShowHistory]=useState(false);
  const [showDateSelect,setShowDateSelect]=useState(false);
  const [presentMode,setPresentMode]=useState(false);
  const [ready,setReady]=useState(false);
  const [flash,setFlash]=useState(false);
  const [theme,setTheme]=useState("light");
  const [draftRecordId,setDraftRecordId]=useState(null);
  const [viewingId,setViewingId]=useState(null); // null=draft, recordId=viewing past meeting
  const [isMobile,setIsMobile]=useState(()=>typeof window!=='undefined'&&window.matchMedia('(max-width:767px)').matches);
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const timer=useRef(null);
  const apiTimer=useRef(null);
  const dataRef=useRef(null); // always holds latest data — avoids stale closure in poll
  const localDirty=useRef(false); // true when local changes haven't been flushed to Airtable yet
  const prevItemsRef=useRef([]); // last server-confirmed action items — used to detect deletions
  const creating=useRef(false); // guard against concurrent createNewDraft calls
  const suppressNextSave=useRef(false); // suppress one auto-save cycle after _airtableId merge

  // Detect mobile viewport
  useEffect(()=>{
    const mq=window.matchMedia('(max-width:767px)');
    const h=e=>setIsMobile(e.matches);
    mq.addEventListener('change',h);
    return ()=>mq.removeEventListener('change',h);
  },[]);

  // Init: load all meetings, find current draft, hydrate full data
  useEffect(()=>{(async()=>{
    const today=localISO();
    // Single call returns all meetings (Draft + Finalized) with status
    const allMeetings=await apiGet('/api/meetings');
    if(Array.isArray(allMeetings)) setMeetings(allMeetings);

    // Current draft = Draft record whose meeting date >= today (take the earliest upcoming)
    const draftSummary=Array.isArray(allMeetings)
      ?allMeetings.filter(m=>m.status==='Draft').sort((a,b)=>a.date<b.date?1:-1)[0]
      :null;

    if(draftSummary){
      const remote=await apiGet(`/api/meetings/${draftSummary.id}`);
      if(remote&&!remote.error){
        // If localStorage has unsaved changes (dirty flag), prefer it over Airtable
        // so a reload within the 15s Airtable debounce window doesn't lose edits.
        const local=lsGet('mv2:draft');
        const dirty=lsGet('mv2:dirty');
        if(dirty&&local){ setData(hydrate(local)); prevItemsRef.current=local.action_items?.items??[]; } else { setData(hydrate(remote)); lsSet('mv2:draft',remote); prevItemsRef.current=remote.action_items?.items??[]; }
        setDraftRecordId(draftSummary.id);
      }
    } else {
      // Fall back to localStorage cache (handles offline or when no Airtable draft)
      const local=lsGet('mv2:draft');
      if(local) setData(hydrate(local));
    }

    setReady(true);
    setShowDateSelect(true);
  })();},[]);

  // Keep dataRef in sync so the polling closure always sees current data
  useEffect(()=>{ dataRef.current=data; },[data]);

  const showFlash=()=>{ setFlash(true); setTimeout(()=>setFlash(false),1800); };
  const updateData=(path,value)=>setData(prev=>{ const next=JSON.parse(JSON.stringify(prev)); let c=next; for(let i=0;i<path.length-1;i++) c=c[path[i]]; c[path[path.length-1]]=value; return next; });
  const startEdit=(id)=>{ setDraftBak(JSON.parse(JSON.stringify(data))); setEditingSec(id); };
  const saveEdit=()=>{ clearTimeout(timer.current); clearTimeout(apiTimer.current); lsSet('mv2:draft',data); lsSet('mv2:dirty',true); if(draftRecordId){ const prevSnap=prevItemsRef.current; const curSnap=[...(data.action_items?.items??[])]; apiPut(`/api/meetings/${draftRecordId}`,{data,previousItems:prevSnap}).then(result=>{ if(result){ prevItemsRef.current=curSnap; localDirty.current=false; lsDel('mv2:dirty'); if(result.items){ suppressNextSave.current=true; setData(prev=>mergeAirtableIds(prev,result.items)); } } }); } setEditingSec(null); setDraftBak(null); showFlash(); };

  // Atomic import-from-transcript: append AI-extracted items + decisions and
  // immediately persist to localStorage + Airtable. Bypasses the 15s autosave
  // debounce so the import survives a browser refresh.
  const importTranscriptItems=(items,decisions)=>{
    setData(prev=>{
      const next=JSON.parse(JSON.stringify(prev));
      const ai=next.action_items;
      let nextId=ai.next_id||100;
      if(items?.length){
        ai.items=[...ai.items,...items.map(it=>({...it,id:nextId++}))];
        ai.next_id=nextId;
      }
      if(decisions?.length){
        const seenIds=new Set(ai.decisions.map(d=>d.id));
        ai.decisions=[...ai.decisions,...decisions.map(d=>(!d.id||seenIds.has(d.id))?{...d,id:uid()}:d)];
      }
      lsSet('mv2:draft',next);
      if(draftRecordId&&viewingId===null){
        clearTimeout(timer.current);
        clearTimeout(apiTimer.current);
        const curSnap=[...(next.action_items?.items??[])]; apiPut(`/api/meetings/${draftRecordId}`,{data:next,previousItems:prevItemsRef.current}).then(result=>{ if(result){ prevItemsRef.current=curSnap; localDirty.current=false; lsDel('mv2:dirty'); if(result.items){ suppressNextSave.current=true; setData(prev=>mergeAirtableIds(prev,result.items)); } } });
      }
      return next;
    });
    showFlash();
  };
  const cancelEdit=()=>{ if(draftBak) setData(draftBak); setEditingSec(null); setDraftBak(null); };
  const handleComment=(sectionId,comments)=>updateData(["section_comments",sectionId],comments);

  // Draft auto-save: localStorage at 900ms, Airtable at 15s (skip when viewing past)
  useEffect(()=>{
    if(!ready||viewingId!==null) return;
    if(suppressNextSave.current){ suppressNextSave.current=false; return; }
    localDirty.current=true; // mark unsaved local changes so poll won't overwrite them
    clearTimeout(timer.current);
    timer.current=setTimeout(()=>{
      lsSet('mv2:draft',data);
      lsSet('mv2:dirty',true);
      clearTimeout(apiTimer.current);
      apiTimer.current=setTimeout(async()=>{
        if(draftRecordId){
          const prevSnap=prevItemsRef.current; const curSnap=[...(data.action_items?.items??[])];
          const result=await apiPut(`/api/meetings/${draftRecordId}`,{data,previousItems:prevSnap});
          if(result){ prevItemsRef.current=curSnap; localDirty.current=false; lsDel('mv2:dirty'); if(result.items){ suppressNextSave.current=true; setData(prev=>mergeAirtableIds(prev,result.items)); } } // only clear when Airtable confirmed
        }
      },5000);
    },900);
  },[data,ready,viewingId,draftRecordId]);

  // 5-second poll for collaborative updates (skip when viewing past)
  useEffect(()=>{
    if(!ready||!draftRecordId||viewingId!==null) return;
    const interval=setInterval(async()=>{
      if(editingSec!==null||localDirty.current) return; // skip if user has unpushed changes
      const remote=await apiGet(`/api/meetings/${draftRecordId}`);
      if(remote&&!remote.error&&JSON.stringify(remote)!==JSON.stringify(dataRef.current)){
        setData(hydrate(remote));
        showFlash();
      }
    },5000);
    return ()=>clearInterval(interval);
  },[ready,draftRecordId,editingSec,viewingId]);

  // Flush unsaved changes to Airtable when the page is hidden or closed
  useEffect(()=>{
    if(!ready||!draftRecordId) return;
    const flush=()=>{
      if(!localDirty.current) return;
      const d=dataRef.current;
      if(!d) return;
      fetch(`/api/meetings/${draftRecordId}`,{
        method:"PUT",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({data:d,previousItems:prevItemsRef.current}),
        keepalive:true,
      }).then(r=>{ if(r.ok){ localDirty.current=false; lsDel('mv2:dirty'); } }).catch(()=>{});
    };
    const onVisibility=()=>{ if(document.visibilityState==="hidden") flush(); };
    document.addEventListener("visibilitychange",onVisibility);
    window.addEventListener("beforeunload",flush);
    return ()=>{ document.removeEventListener("visibilitychange",onVisibility); window.removeEventListener("beforeunload",flush); };
  },[ready,draftRecordId]);

  const saveMeeting=async()=>{
    if(!draftRecordId) return;
    if(!confirm("This will finalize this meeting and move it to Past Meetings. Are you sure?")) return;
    await apiPut(`/api/meetings/${draftRecordId}`,{data:{...data,status:"finalized"},status:"Finalized"});
    lsDel('mv2:draft');
    const allMeetings=await apiGet('/api/meetings');
    if(Array.isArray(allMeetings)) setMeetings(allMeetings);
    // After finalizing, go back to the landing page so user can create a new draft
    setViewingId(draftRecordId);
    setDraftRecordId(null);
    setShowDateSelect(true);
    showFlash();
  };
  const loadMeeting=async(id)=>{ const m=await apiGet(`/api/meetings/${id}`); if(m&&!m.error){setData(hydrate(m));setViewingId(id);setShowHistory(false);setActive("company_health");} };
  const deleteMeeting=async(id)=>{ try { await apiDel(`/api/meetings/${id}`); const allMeetings=await apiGet('/api/meetings'); if(Array.isArray(allMeetings)) setMeetings(allMeetings); } catch(e){ alert(`Failed to delete meeting: ${e.message}`); } };
  const updateMeetingDate=async(id,newDate)=>{ const m=await apiGet(`/api/meetings/${id}`); if(m&&!m.error) await apiPut(`/api/meetings/${id}`,{data:{...m,meeting_date:newDate,meeting_label:`Week of ${fmtDate(newDate)}`},date:newDate}); const allMeetings=await apiGet('/api/meetings'); if(Array.isArray(allMeetings)) setMeetings(allMeetings); };
  const exportData=()=>{ const b=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}); const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download=`mv_performance_${data.meeting_date}.json`; a.click(); URL.revokeObjectURL(u); };
  const resetDraft=async()=>{ if(!confirm("Reset the current draft to a blank week?")) return; const f=mkBlankSeed(); if(draftRecordId) apiPut(`/api/meetings/${draftRecordId}`,{data:f}); lsDel('mv2:draft'); lsDel('mv2:dirty'); setData(f); };

  // Date change: update both date + label, auto-save handles the Airtable write
  const handleDateChange=(newDate)=>{
    if(viewingId) return;
    setData(prev=>({...prev,meeting_date:newDate,meeting_label:`Week of ${fmtDate(newDate)}`}));
  };

  // Return to the current draft from a past meeting view
  const returnToDraft=async()=>{
    if(draftRecordId){
      const remote=await apiGet(`/api/meetings/${draftRecordId}`);
      if(remote&&!remote.error) setData(hydrate(remote));
    }
    setViewingId(null);
    setActive("company_health");
  };

  // Create a draft for a specific date, pre-seeded from the latest finalized meeting.
  // Server-side upsert ensures only one Airtable record per date — if one already exists
  // for the chosen date, its ID is returned and its existing data is loaded (not overwritten).
  const createNewDraft=async(date)=>{
    if(creating.current) return;
    creating.current=true;
    try {
      const latestFinalized=[...meetings].filter(m=>m.status==="Finalized").sort((a,b)=>b.date>a.date?1:-1)[0];
      let seed;
      if(latestFinalized){
        const prev=await apiGet(`/api/meetings/${latestFinalized.id}`);
        seed=(prev&&!prev.error)?mkSeededDraft(hydrate(prev),date):{...mkBlankSeed(),meeting_date:date,meeting_label:`Week of ${fmtDate(date)}`};
      } else {
        seed={...mkBlankSeed(),meeting_date:date,meeting_label:`Week of ${fmtDate(date)}`};
      }
      const res=await apiPost('/api/meetings',{data:seed,status:'Draft'});
      if(res?.recordId){
        let loadData=seed;
        if(!res.isNew){
          // Record already existed for this date — load its stored data instead of seeding over it
          const existing=await apiGet(`/api/meetings/${res.recordId}`);
          if(existing&&!existing.error){
            loadData=hydrate(existing);
            loadData.meeting_label=`Week of ${fmtDate(date)}`;
            loadData.meeting_date=date;
          }
        }
        setDraftRecordId(res.recordId);
        setData(loadData);
        setViewingId(null);
        prevItemsRef.current=loadData.action_items?.items??[];
        lsSet('mv2:draft',{...loadData,_recordId:res.recordId});
        setMeetings(prev=>prev.some(m=>m.id===res.recordId)?prev:[{id:res.recordId,date,label:loadData.meeting_label||`Week of ${fmtDate(date)}`,status:'Draft'},...prev]);
        setShowDateSelect(false);
      }
    } finally {
      creating.current=false;
    }
  };

  // Landing page: select any meeting to open
  const selectMeeting=async(meeting)=>{
    const today=localISO();
    const isCurrentDraft=meeting.status==='Draft'&&(!meeting.date||meeting.date>=today);
    const m=await apiGet(`/api/meetings/${meeting.id}`);
    if(m&&!m.error){
      setData(hydrate(m));
      if(isCurrentDraft){
        setViewingId(null);
        setDraftRecordId(meeting.id);
      } else {
        setViewingId(meeting.id);
      }
      setActive("company_health");
    }
    setShowDateSelect(false);
  };

  // Week navigator: sorted finalized list + current draft at end
  const today=localISO();
  const sortedMeetings=[...meetings].filter(m=>m.status!=='Draft'||(m.date&&m.date<today)).sort((a,b)=>a.date<b.date?-1:1);
  const navPos=viewingId?sortedMeetings.findIndex(m=>m.id===viewingId):sortedMeetings.length;
  const hasPrev=navPos>0;
  const hasNext=navPos<sortedMeetings.length; // draft is always last
  const goToPrev=()=>{ if(hasPrev) loadMeeting(sortedMeetings[navPos-1].id); };
  const goToNext=()=>{
    if(!hasNext) return;
    if(navPos===sortedMeetings.length-1) returnToDraft();
    else loadMeeting(sortedMeetings[navPos+1].id);
  };

  const Sec=SECTIONS.find(s=>s.id===active)?.Component;

  return (
    <div data-theme={theme} style={{minHeight:"100vh",background:"var(--bg)",color:"var(--text)",display:"flex",flexDirection:"column"}}>
      <style>{STYLES}</style>

      {/* DATE SELECT SPLASH */}
      {showDateSelect&&ready&&(
        <DateSelectScreen
          meetings={meetings}
          onSelect={selectMeeting}
          onCreate={createNewDraft}
        />
      )}

      {/* LOADING SPLASH */}
      {!ready&&(
        <div style={{position:"fixed",inset:0,zIndex:100,background:"var(--bg)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"16px"}}>
          <div style={{width:"48px",height:"48px",borderRadius:"12px",background:"linear-gradient(135deg,var(--purple),var(--purple2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"22px",fontWeight:700,color:"#fff"}}>M</div>
          <div style={{fontSize:"13px",color:"var(--muted)"}}>Loading meeting data…</div>
        </div>
      )}

      {/* TOP BAR */}
      <header style={{background:"var(--surface)",borderBottom:"1px solid var(--border)",padding:isMobile?"0 14px":"0 24px",height:"64px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:40,backdropFilter:"blur(8px)"}}>
        <div style={{display:"flex",alignItems:"center",gap:isMobile?"10px":"20px"}}>
          <button onClick={()=>setShowDateSelect(true)} title="Home" style={{display:"flex",alignItems:"center",gap:"10px",background:"transparent",border:"none",cursor:"pointer",padding:0}}>
            <div style={{width:"28px",height:"28px",borderRadius:"8px",background:"linear-gradient(135deg,var(--purple),var(--purple2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"13px",fontWeight:700,color:"#fff"}}>M</div>
            {!isMobile&&<div style={{textAlign:"left"}}>
              <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--gold)",lineHeight:1}}>Mindvalley · Revenue Task Force</div>
              <div className="font-display" style={{fontSize:"16px",color:"var(--text)",lineHeight:1.2,marginTop:"2px"}}>Revenue Meeting</div>
            </div>}
          </button>
          {!isMobile&&<div style={{width:"1px",height:"28px",background:"var(--border)"}}/>}
          <div style={{display:"flex",alignItems:"center",gap:"6px"}}>
            {!isMobile&&<button onClick={goToPrev} disabled={!hasPrev} title="Previous meeting" style={{background:"transparent",border:"1px solid var(--border)",color:hasPrev?"var(--text)":"var(--faint)",borderRadius:"6px",width:"28px",height:"28px",display:"flex",alignItems:"center",justifyContent:"center",cursor:hasPrev?"pointer":"default"}}><ChevronLeft size={13}/></button>}
            {viewingId
              ? <button onClick={()=>setShowDateSelect(true)} title="Change week" style={{background:"transparent",border:"1px solid var(--border)",color:"var(--text)",padding:"4px 10px",borderRadius:"8px",fontSize:"13px",cursor:"pointer",display:"flex",alignItems:"center",gap:"6px",fontFamily:"inherit"}}><Calendar size={13} style={{color:"var(--purple2)"}}/>{isMobile?(data.meeting_date||"Week"):(fmtDate(data.meeting_date)||"Select week")}</button>
              : <input type="date" value={data.meeting_date||""} onChange={e=>handleDateChange(e.target.value)} style={{background:"transparent",border:"1px solid var(--border)",color:"var(--text)",padding:"4px 10px",borderRadius:"8px",fontSize:"13px",cursor:"text",fontFamily:"inherit"}}/>
            }
            {!isMobile&&<button onClick={goToNext} disabled={!hasNext} title="Next meeting" style={{background:"transparent",border:"1px solid var(--border)",color:hasNext?"var(--text)":"var(--faint)",borderRadius:"6px",width:"28px",height:"28px",display:"flex",alignItems:"center",justifyContent:"center",cursor:hasNext?"pointer":"default"}}><ChevronRight size={13}/></button>}
            <Pill label={viewingId?"Past":(data.status==="finalized"?"Finalized":"Draft")} variant={viewingId?"neutral":(data.status==="finalized"?"good":"warn")}/>
            {!isMobile&&viewingId&&<Btn variant="outline" size="sm" onClick={returnToDraft}>← Draft</Btn>}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <span role="status" aria-live="polite" className="sr-only">{flash?"Saved":""}</span>
          {!isMobile&&flash&&<span aria-hidden="true" style={{fontSize:"12px",color:"var(--green)",fontWeight:600,display:"flex",alignItems:"center",gap:"4px"}}><Check size={12}/>Saved</span>}
          {!isMobile&&<button onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} title="Toggle light/dark" style={{background:"var(--card)",border:"1px solid var(--border)",color:"var(--text)",borderRadius:"8px",width:"34px",height:"34px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>{theme==="dark"?<Sun size={15}/>:<Moon size={15}/>}</button>}
          {!isMobile&&<Btn variant="ghost" size="sm" onClick={()=>setPresentMode(!presentMode)}>{presentMode?<EyeOff size={13}/>:<Presentation size={13}/>}{presentMode?"Exit":"Present"}</Btn>}
          {!isMobile&&<Btn variant="ghost" size="sm" onClick={()=>setShowHistory(true)}><History size={13}/>History ({meetings.length})</Btn>}
          {!isMobile&&<Btn variant="ghost" size="sm" onClick={exportData}><Download size={13}/>Export</Btn>}
          {!isMobile&&<Btn variant="danger" size="sm" onClick={resetDraft}><Trash2 size={13}/>Delete Draft</Btn>}
          {isMobile&&<button onClick={()=>setSidebarOpen(o=>!o)} style={{background:"var(--card)",border:"1px solid var(--border)",color:"var(--text)",borderRadius:"8px",width:"36px",height:"36px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Menu size={17}/></button>}
        </div>
      </header>

      {/* MOBILE SIDEBAR DRAWER */}
      {isMobile&&sidebarOpen&&(
        <div onClick={()=>setSidebarOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:200,display:"flex"}}>
          <aside onClick={e=>e.stopPropagation()} style={{width:"280px",background:"var(--surface)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",height:"100%",overflowY:"auto"}}>
            <div style={{padding:"14px 16px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:"13px",fontWeight:700,color:"var(--text)"}}>Sections</span>
              <button onClick={()=>setSidebarOpen(false)} aria-label="Close menu" style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",display:"flex",alignItems:"center"}}><X size={18}/></button>
            </div>
            {viewingId&&<div style={{padding:"10px 14px",borderBottom:"1px solid var(--border)"}}><Btn variant="outline" size="sm" onClick={()=>{returnToDraft();setSidebarOpen(false);}}>← Back to Draft</Btn></div>}
            <nav aria-label="Sections" style={{padding:"12px 10px",flex:1}}>
              {SECTIONS.map(s=>{
                const isActive=active===s.id;
                const cCount=s.id==="meeting_notes"?(data.section_comments?.meeting_notes?.length||0):(data.section_comments?.[s.id]?.length||0);
                return <button key={s.id} className="nav-pill" data-active={isActive} aria-current={isActive?"page":undefined} onClick={()=>{setActive(s.id);setSidebarOpen(false);}} style={{width:"100%",display:"flex",alignItems:"center",gap:"10px",padding:"10px 10px 10px 14px",borderRadius:"8px",textAlign:"left",cursor:"pointer",background:isActive?"var(--mv-brand-light)":"transparent",border:isActive?"1.5px solid var(--mv-brand-border)":"1.5px solid transparent",marginBottom:"2px",color:"var(--text)",fontFamily:"inherit",transition:"all 0.12s"}}>
                  <div style={{width:"22px",height:"22px",borderRadius:"50%",background:isActive?"var(--mv-amber-light)":"var(--card2)",border:`1px solid ${isActive?"var(--mv-amber-bright)":"var(--border)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",fontWeight:700,fontFamily:"ui-monospace,'SF Mono','Roboto Mono',Menlo,Consolas,monospace",color:isActive?"var(--gold)":"var(--faint)",flexShrink:0}}>{s.num}</div>
                  <div style={{flex:1}}><div style={{fontSize:"13px",fontWeight:500,color:isActive?"var(--text)":"var(--muted)",lineHeight:1}}>{s.label}</div><div style={{fontSize:"10px",color:isActive?"var(--purple2)":"var(--faint)",marginTop:"2px"}}>{s.owner}</div></div>
                  {cCount>0&&<span style={{background:"rgba(122,18,212,0.2)",color:"var(--purple2)",fontSize:"10px",fontWeight:700,borderRadius:"10px",padding:"1px 6px"}}>{cCount}</span>}
                  <div style={{width:"18px",height:"18px",borderRadius:"50%",background:avatarBg(s.owner),display:"flex",alignItems:"center",justifyContent:"center",fontSize:"9px",fontWeight:700,color:"#fff",flexShrink:0}}>{s.owner.charAt(0)}</div>
                </button>;
              })}
            </nav>
            <div style={{padding:"12px 14px",borderTop:"1px solid var(--border)",display:"flex",flexDirection:"column",gap:"6px"}}>
              <button onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} style={{display:"flex",alignItems:"center",gap:"10px",background:"none",border:"1px solid var(--border)",borderRadius:"8px",padding:"10px 12px",color:"var(--text)",cursor:"pointer",fontFamily:"inherit",fontSize:"13px"}}>{theme==="dark"?<Sun size={15}/>:<Moon size={15}/>}<span>Toggle {theme==="dark"?"Light":"Dark"} mode</span></button>
              <button onClick={()=>{setShowHistory(true);setSidebarOpen(false);}} style={{display:"flex",alignItems:"center",gap:"10px",background:"none",border:"1px solid var(--border)",borderRadius:"8px",padding:"10px 12px",color:"var(--text)",cursor:"pointer",fontFamily:"inherit",fontSize:"13px"}}><History size={15}/><span>History ({meetings.length})</span></button>
              <button onClick={()=>{exportData();setSidebarOpen(false);}} style={{display:"flex",alignItems:"center",gap:"10px",background:"none",border:"1px solid var(--border)",borderRadius:"8px",padding:"10px 12px",color:"var(--text)",cursor:"pointer",fontFamily:"inherit",fontSize:"13px"}}><Download size={15}/><span>Export JSON</span></button>
              <button onClick={()=>{setPresentMode(!presentMode);setSidebarOpen(false);}} style={{display:"flex",alignItems:"center",gap:"10px",background:"none",border:"1px solid var(--border)",borderRadius:"8px",padding:"10px 12px",color:"var(--text)",cursor:"pointer",fontFamily:"inherit",fontSize:"13px"}}><Presentation size={15}/><span>Present mode</span></button>
              <button onClick={()=>{setSidebarOpen(false);saveMeeting();}} style={{display:"flex",alignItems:"center",gap:"10px",background:"var(--gold)",border:"none",borderRadius:"8px",padding:"10px 12px",color:"#07050F",cursor:"pointer",fontFamily:"inherit",fontSize:"13px",fontWeight:600}}><Save size={15}/><span>Archive Meeting</span></button>
              <button onClick={()=>{setSidebarOpen(false);resetDraft();}} style={{display:"flex",alignItems:"center",gap:"10px",background:"var(--red-bg)",border:"1px solid rgba(255,77,106,0.2)",borderRadius:"8px",padding:"10px 12px",color:"var(--red)",cursor:"pointer",fontFamily:"inherit",fontSize:"13px"}}><Trash2 size={15}/><span>Delete Draft</span></button>
            </div>
          </aside>
        </div>
      )}

      <div style={{display:"flex",flex:1}}>
        {/* SIDEBAR — desktop only */}
        {!presentMode&&!isMobile&&(
          <aside style={{width:"216px",background:"var(--surface)",borderRight:"1px solid var(--border)",minHeight:"calc(100vh - 64px)",position:"sticky",top:"64px",alignSelf:"flex-start",display:"flex",flexDirection:"column"}}>
            <div style={{position:"absolute",left:0,top:0,bottom:0,width:"3px",background:"var(--purple)",borderRadius:"0 2px 2px 0"}}/>
            <nav aria-label="Sections" style={{padding:"14px 12px",flex:1}}>
              <div style={{fontSize:"9px",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--faint)",padding:"0 6px 10px",display:"flex",alignItems:"center",gap:"6px"}}><Star size={9} style={{color:"var(--gold)"}}/>Sections</div>
              {SECTIONS.map(s=>{
                const isActive=active===s.id;
                const cCount=s.id==="meeting_notes"?(data.section_comments?.meeting_notes?.length||0):(data.section_comments?.[s.id]?.length||0);
                return <button key={s.id} className="nav-pill" data-active={isActive} aria-current={isActive?"page":undefined} onClick={()=>setActive(s.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:"10px",padding:"8px 10px 8px 14px",borderRadius:"8px",textAlign:"left",cursor:"pointer",background:isActive?"var(--mv-brand-light)":"transparent",border:isActive?"1.5px solid var(--mv-brand-border)":"1.5px solid transparent",marginBottom:"2px",color:"var(--text)",fontFamily:"inherit",transition:"all 0.12s"}}>
                  <div style={{width:"22px",height:"22px",borderRadius:"50%",background:isActive?"var(--mv-amber-light)":"var(--card2)",border:`1px solid ${isActive?"var(--mv-amber-bright)":"var(--border)"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:"10px",fontWeight:700,fontFamily:"ui-monospace,'SF Mono','Roboto Mono',Menlo,Consolas,monospace",color:isActive?"var(--gold)":"var(--faint)",flexShrink:0,transition:"all 0.12s"}}>{s.num}</div>
                  <div style={{flex:1}}><div style={{fontSize:"13px",fontWeight:500,color:isActive?"var(--text)":"var(--muted)",lineHeight:1}}>{s.label}</div><div style={{fontSize:"10px",color:isActive?"var(--purple2)":"var(--faint)",marginTop:"2px"}}>{s.owner}</div></div>
                  {cCount>0&&<span style={{background:"rgba(122,18,212,0.2)",color:"var(--purple2)",fontSize:"10px",fontWeight:700,borderRadius:"10px",padding:"1px 6px"}}>{cCount}</span>}
                  <div style={{width:"18px",height:"18px",borderRadius:"50%",background:avatarBg(s.owner),display:"flex",alignItems:"center",justifyContent:"center",fontSize:"9px",fontWeight:700,color:"#fff",flexShrink:0}}>{s.owner.charAt(0)}</div>
                </button>;
              })}
            </nav>
            <div style={{padding:"12px 16px",borderTop:"1px solid var(--border)"}}>
              <Btn variant="gold" size="sm" onClick={saveMeeting}><Save size={13}/>Archive Meeting</Btn>
              {flash&&<div style={{marginTop:"8px",fontSize:"11px",color:"var(--green)",fontWeight:600,display:"flex",alignItems:"center",gap:"4px"}}><Check size={11}/>Archived</div>}
              <div style={{marginTop:"10px",fontSize:"11px",color:"var(--faint)",lineHeight:1.7}}>
                <div style={{fontWeight:700,color:"var(--muted)",marginBottom:"4px",textTransform:"uppercase",fontSize:"9px",letterSpacing:"0.1em"}}>How it works</div>
                Click <span style={{color:"var(--purple2)"}}>Edit numbers</span> on your section. Upload images, add headers, post notes. <span style={{color:"var(--gold)"}}>Archive Meeting</span> saves the week.
              </div>
            </div>
          </aside>
        )}

        {/* MAIN */}
        <main style={{flex:1,padding:isMobile?"16px":"32px",maxWidth:presentMode?"100%":"1260px"}}>
          {presentMode&&<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"24px",paddingBottom:"20px",borderBottom:"1px solid var(--border)"}}>
            <div><div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"6px"}}>Presenting · {data.meeting_label}</div><h1 className="font-display" style={{fontSize:"38px",color:"var(--text)"}}>{SECTIONS.find(s=>s.id===active)?.label}</h1></div>
            <div style={{display:"flex",gap:"4px"}}>{SECTIONS.map(s=><button key={s.id} onClick={()=>setActive(s.id)} style={{height:"8px",width:active===s.id?"24px":"8px",borderRadius:"4px",background:active===s.id?"var(--gold)":"rgba(127,127,127,0.2)",border:"none",cursor:"pointer",transition:"all 0.2s"}}/>)}</div>
          </div>}

          {Sec&&<Sec data={data}
            editing={editingSec===active&&!presentMode&&active!=="meeting_notes"}
            onEdit={()=>startEdit(active)} onSave={saveEdit} onCancel={cancelEdit} onChange={updateData}
            onImport={importTranscriptItems}
            onComment={(c)=>{ if(active==="meeting_notes"){ updateData(["section_comments","meeting_notes"],c); } else { handleComment(active,c); } }}
          />}

          {presentMode&&<div style={{display:"flex",justifyContent:"space-between",marginTop:"32px"}}>
            <Btn variant="ghost" onClick={()=>{ const i=SECTIONS.findIndex(s=>s.id===active); if(i>0) setActive(SECTIONS[i-1].id); }}>← Previous</Btn>
            <Btn variant="primary" onClick={()=>{ const i=SECTIONS.findIndex(s=>s.id===active); if(i<SECTIONS.length-1) setActive(SECTIONS[i+1].id); }}>Next →</Btn>
          </div>}
        </main>
      </div>

      {showHistory&&<HistoryPanel meetings={meetings} onLoad={loadMeeting} onClose={()=>setShowHistory(false)} onDelete={deleteMeeting} onUpdateDate={updateMeetingDate}/>}
    </div>
  );
}
