import React, { useState, useEffect, useRef } from "react";
import {
  Edit3, Save, X, Plus, Trash2, Calendar, History, Download,
  AlertCircle, TrendingUp, TrendingDown, ChevronLeft, ChevronRight, Presentation,
  Check, RotateCcw, Eye, EyeOff, ArrowRight, MessageSquare, Paperclip,
  Send, ChevronDown, ChevronUp, FileText, Star, Sun, Moon, Image,
  Search, Flag, CircleCheck, Clock, Circle, Ban, Menu
} from "lucide-react";

// ─────────────────────────────────────────────────────────
// GLOBAL STYLES + LIGHT/DARK TOKENS
// ─────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,ital,wght@9..144,0,300;9..144,0,400;9..144,0,500;9..144,1,300;9..144,1,400&family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

/* ── DARK (default) ── */
:root {
  --bg:#07050F; --surface:#0F0C1D; --card:#171230; --card2:#1F1940;
  --border:rgba(255,255,255,0.08); --purple:#7B5FF5; --purple2:#9B7FFF;
  --gold:#E8B84B; --gold2:#F5D060; --text:#F0EDFC;
  --muted:rgba(240,237,252,0.52); --faint:rgba(240,237,252,0.18);
  --red:#FF4D6A; --amber:#FF9B3C; --green:#2ECC71;
  --red-bg:rgba(255,77,106,0.12); --amb-bg:rgba(255,155,60,0.12); --grn-bg:rgba(46,204,113,0.12);
  --input-bg:rgba(255,255,255,0.05); --input-border:rgba(255,255,255,0.12);
  --scroll-thumb:rgba(123,95,245,0.3); --hover-row:rgba(123,95,245,0.05);
}
/* ── LIGHT ── */
[data-theme="light"] {
  --bg:#F5F3FF; --surface:#FFFFFF; --card:#FFFFFF; --card2:#EDE9FB;
  --border:rgba(26,18,64,0.1); --purple:#6B45F0; --purple2:#7B55F5;
  --gold:#B8820A; --gold2:#D4A020; --text:#1C1535;
  --muted:rgba(28,21,53,0.62); --faint:rgba(28,21,53,0.3);
  --red:#D42C45; --amber:#C47800; --green:#1A9950;
  --red-bg:rgba(212,44,69,0.08); --amb-bg:rgba(196,120,0,0.08); --grn-bg:rgba(26,153,80,0.08);
  --input-bg:rgba(26,18,64,0.04); --input-border:rgba(26,18,64,0.15);
  --scroll-thumb:rgba(107,69,240,0.25); --hover-row:rgba(107,69,240,0.04);
}

* { box-sizing:border-box; margin:0; padding:0; }
body { background:var(--bg); color:var(--text); font-family:'Sora',system-ui,sans-serif; font-size:14px; line-height:1.5; }
.font-display { font-family:'Fraunces',Georgia,serif; font-optical-sizing:auto; }
.font-mono    { font-family:'JetBrains Mono',monospace; font-variant-numeric:tabular-nums; }
::-webkit-scrollbar { width:4px; height:4px; }
::-webkit-scrollbar-track { background:transparent; }
::-webkit-scrollbar-thumb { background:var(--scroll-thumb); border-radius:2px; }

@keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
.fade-up { animation:fadeUp 0.3s ease both; }

input[type=text],input[type=date],textarea,select {
  background:var(--input-bg); border:1px solid var(--input-border); color:var(--text);
  border-radius:8px; padding:6px 10px; font-family:inherit; font-size:13px; outline:none; transition:border-color 0.18s;
}
input[type=text]:focus,input[type=date]:focus,textarea:focus,select:focus { border-color:var(--purple); background:rgba(123,95,245,0.07); }
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
`;

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────
const fmtM   = (n) => { const v=parseFloat(n); if(isNaN(v)) return "—"; if(Math.abs(v)>=1e6) return `$${(v/1e6).toFixed(2)}M`; if(Math.abs(v)>=1e3) return `$${(v/1e3).toFixed(1)}K`; return `$${v.toFixed(0)}`; };
const fmtPct = (n,d=1) => { const v=parseFloat(n); return isNaN(v)?"—":`${v.toFixed(d)}%`; };
const fmtNum = (n) => { const v=parseFloat(n); return isNaN(v)?"—":v.toLocaleString("en-US",{maximumFractionDigits:1}); };
const delta  = (a,t) => { const av=parseFloat(a),tv=parseFloat(t); return (isNaN(av)||isNaN(tv)||tv===0)?null:((av-tv)/tv)*100; };
const status = (d) => d===null?"neutral":d>=-5?"good":d>=-15?"warn":"bad";
const localISO = (d=new Date()) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const todayISO = () => localISO();
const nextTuesdayISO = () => { const d=new Date(); const diff=(2-d.getDay()+7)%7||7; d.setDate(d.getDate()+diff); return localISO(d); };
const fmtDate  = (s) => { if(!s) return ""; const [y,m,dy]=s.split('-').map(Number); return new Date(y,m-1,dy).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"}); };
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
const apiPut = async (path,body) => { try { await fetch(path,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)}); } catch {} };
const apiDel = async (path) => { try { await fetch(path,{method:"DELETE"}); } catch {} };

const emptyPageCfg = () => ({ header_image:null, header_text:"", page_notes:"", page_notes_2:"" });

// ─────────────────────────────────────────────────────────
// SEED DATA
// ─────────────────────────────────────────────────────────
const mkSeed = () => ({
  id:uid(), meeting_date:todayISO(), meeting_label:"Week of May 6, 2026", status:"draft",
  meeting_notes:"",
  section_comments:{ company_health:[], bu_performance:[], membership:[], pathways:[], masteries:[], events:[], states:[], product:[], action_items:[], meeting_notes:[] },
  page_config:{ company_health:emptyPageCfg(), bu_performance:emptyPageCfg(), membership:emptyPageCfg(), pathways:emptyPageCfg(), masteries:emptyPageCfg(), events:emptyPageCfg(), states:emptyPageCfg(), product:emptyPageCfg(), action_items:emptyPageCfg(), meeting_notes:emptyPageCfg() },

  company_health:{
    mtd_sales_actual:4500000, mtd_sales_target:5300000, week_actual:970000, week_target:1100000,
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
    rf:{sa:94,st:110,yoy:-13.3,gp:85.4,ea:10.2,ep:12.0,et:13.4,oa:63.5,op:74.5,ot:72.7,ada:26.7,adp:31.4,adly:32,adlyp:35.6,hcp:22.8,hct:20,ga:18.4,ni:3.75,nip:4.4,c:11.1,ct:16.5,cly:19.5}
  },

  bu_performance:[
    {bu:"Membership",target:3300000,actual:2800000,yoy:-27,ytd_ebitda:46,fy_ebitda:32,why:"VSL ROAS 55% (tgt 95%); Pathway ROAS 19.6% (tgt 60%), refund 11.6%",risk:"Risk: ROAS slides, MRR erosion ~$125K/mo · Mit: creative refresh + funnel retest"},
    {bu:"Academy",   target:1600000,actual:1500000,yoy:14, ytd_ebitda:30,fy_ebitda:44,why:"Clone AI launch only achieved $100K sales",risk:"Risk: Speaker fees structure profitability · Mit: Manifesting Mastery speaker fees decision"},
    {bu:"Events",    target:312000, actual:219000, yoy:-58,ytd_ebitda:null,fy_ebitda:null,why:"Scaled from 60 first-class tickets to max 15",risk:"Risk: 16% MVU refund · Mit: push tickets + optimise cost + affiliate commission"},
    {bu:"States",    target:29000,  actual:27000,  yoy:261,ytd_ebitda:-78,fy_ebitda:-98,why:"Ads paused · Relotting in-progress ETA May-26",risk:"Risk: 1 year inventory expiry · Mit: new ad pages and assets"}
  ],
  bu_total:{target:5300000,actual:4500000,yoy:-13,ytd_ebitda:21,fy_ebitda:12},

  membership:{sales_actual:406939,sales_target:469168,new_subs:718,lost_subs:1036,roas_30d:60,cpl:11.69,cpl_prev:16.26,new_per_day:177,lost_per_day:259,refund_rate:13.7,refund_rate_ly:14.6,initiatives:["Offer testing $299 vs $199 (Manifesting + AI & Entrepreneurship)","Social Login on Landing Page","Concierge starts May 11 for Members","Pathways live on platform — more upsell/cross-sell","Manifesting Summit VIP upsell $39 vs $29","Build WhatsApp list and strategy"]},

  pathways:{rows:[{name:"Manifesting",ad_spend:null,revenue:null,roas_7d:null,roas_30d:null,roas_90d:null,cpl:null,aov:null},{name:"Entrepreneurship",ad_spend:null,revenue:null,roas_7d:null,roas_30d:null,roas_90d:null,cpl:null,aov:null},{name:"Speaking & Authorship",ad_spend:null,revenue:null,roas_7d:null,roas_30d:null,roas_90d:null,cpl:null,aov:null},{name:"Longevity",ad_spend:null,revenue:null,roas_7d:null,roas_30d:null,roas_90d:null,cpl:null,aov:null}],commentary:""},

  masteries:{sales_mtd:52520,cash_collected_mtd:60970,refund_rate:9.2,cash_forecast_mtd:3300000,
    products:[{name:"Mastery",sales:25850,cash:30180,refund_pct:0,pif_pct:100},{name:"Accelerator",sales:0,cash:0,refund_pct:0,pif_pct:0},{name:"Certification",sales:26680,cash:30790,refund_pct:18.2,pif_pct:72}],
    roas_7d:5,roas_30d:null,roas_90d:null,cpl:8.09,webinar_conv:null,aov:null,
    pipeline:["Manifesting Launch with 55K Leads","Aligning with Data team on Refund Change"],
    academy_summary:{total_sales:9160000,total_cash:8460000,total_refund:18,breakdown:[{name:"Mastery",sales:7000000,cash:5760000,refund:20.6},{name:"Accelerator",sales:690710,cash:690710,refund:8.2},{name:"Certification",sales:1530000,cash:1440000,refund:13.2}]},
    summit:{leads:55037,lp_cr:31,cpl:8.09,vip:1721,member_leads:13177,baseline:[{metric:"Sessions",current:182880,baseline:337264,diff:-45.78},{metric:"Sublist",current:55037,baseline:106500,diff:-48.32},{metric:"LP CR%",current:31,baseline:31.58,diff:-4.7},{metric:"Member",current:13177,baseline:22910,diff:-42.48},{metric:"Non-member",current:37185,baseline:135109,diff:-72.48}]}},

  events:{campaign_name:"MVU Estonia In-Person 2026",tickets_sold:923,tickets_target:1400,tickets_remaining:477,revenue_actual:1280000,revenue_target:2000000,refund_rate:16.52,refund_dollars:315672,gross_revenue:1910000,velocity_7d:33,velocity_per_day:4.7,velocity_required:6.2,yoy_paid_pct:52.31,yoy_paid_actual:923,yoy_paid_ly:606,yoy_revenue_pct:59.55,yoy_revenue_actual:1300000,yoy_revenue_ly:812000,ads_status:"PAUSED",ads_roas:19,valid_tickets:1090,paid_tickets:936,comped_tickets:154,webinar_closes:28,webinar_revenue:69000,refund_forecast_initial:21,refund_forecast_worst:30,refund_worst_dollars:573000,refund_worst_delta:257000,refund_2025_actual:18,speakers_confirmed:18,speakers_negotiating:["Natalie Ellis","Shay (Rising Woman)","Hal Elrod","Young Pueblo","Cynthia Thurlow"],venue_status:"No issues flagged"},

  states:{mtd_sales:null,mtd_target:null,bottles_sold:null,bottles_target:null,revenue_per_session:null,units_left:null,days_to_expiry:null,sell_through_required:null,sell_through_actual:null,write_off_projection:null,roas_7d:null,roas_30d:null,roas_90d:null,cac_payback:null,cpl:null,repeat_rate:null,time_to_2nd:null,aov:null,paid_pct:null,organic_pct:null,notes:"Ads paused. Relotting in progress, ETA May 2026."},

  product:{platform_revenue_mtd:null,engagement:61.8,engagement_wow:0.1,engagement_target_delta:-3.2,activation:79.1,activation_wow:1.0,activation_target_delta:-10.9,
    revenue_refund_retention:[{metric:"Platform Revenue MTD",actual:null,mom:null,vs_target:null},{metric:"Y-MVM Refund",actual:9.41,mom:-0.7,vs_target:1.5},{metric:"Y-M13 retention",actual:31.6,mom:-3.7,vs_target:-6.4},{metric:"Y-M1 retention",actual:88.5,mom:0.1,vs_target:-1.5},{metric:"M-M3 retention",actual:36.7,mom:1.5,vs_target:-1.3}],
    acquisition_checkout:[{metric:"US checkout",actual:46.3,wow:0.8,vs_target:-3.8},{metric:"RoW checkout",actual:27.5,wow:-0.6,vs_target:-7.5},{metric:"Day 0 login",actual:84.2,wow:-0.7,vs_target:-10.8},{metric:"Renewal ratio",actual:82.4,wow:0.7,vs_target:-1.6}],
    engagement_transformation:[{metric:"Engagement",actual:61.8,wow:0.1,vs_target:-3.2},{metric:"Activation",actual:79.1,wow:1.0,vs_target:-10.9},{metric:"Transformation",actual:46.2,wow:0.0,vs_target:-3.8},{metric:"MAU/MAS",actual:37.7,wow:-0.3,vs_target:-2.3},{metric:"CS Ticket/MAS",actual:0.9,wow:-0.5,vs_target:-0.1}],
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
      {bu:"Membership",target:null,actual:null,yoy:null,ytd_ebitda:null,fy_ebitda:null,why:"",risk:""},
      {bu:"Academy",   target:null,actual:null,yoy:null,ytd_ebitda:null,fy_ebitda:null,why:"",risk:""},
      {bu:"Events",    target:null,actual:null,yoy:null,ytd_ebitda:null,fy_ebitda:null,why:"",risk:""},
      {bu:"States",    target:null,actual:null,yoy:null,ytd_ebitda:null,fy_ebitda:null,why:"",risk:""}
    ],
    bu_total:{target:null,actual:null,yoy:null,ytd_ebitda:null,fy_ebitda:null},
    membership:{sales_actual:null,sales_target:null,new_subs:null,lost_subs:null,roas_30d:null,cpl:null,cpl_prev:null,new_per_day:null,lost_per_day:null,refund_rate:null,refund_rate_ly:null,initiatives:[]},
    pathways:{rows:[
      {name:"Manifesting",ad_spend:null,revenue:null,roas_7d:null,roas_30d:null,roas_90d:null,cpl:null,aov:null},
      {name:"Entrepreneurship",ad_spend:null,revenue:null,roas_7d:null,roas_30d:null,roas_90d:null,cpl:null,aov:null},
      {name:"Speaking & Authorship",ad_spend:null,revenue:null,roas_7d:null,roas_30d:null,roas_90d:null,cpl:null,aov:null},
      {name:"Longevity",ad_spend:null,revenue:null,roas_7d:null,roas_30d:null,roas_90d:null,cpl:null,aov:null}
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
    states:{mtd_sales:null,mtd_target:null,bottles_sold:null,bottles_target:null,revenue_per_session:null,units_left:null,days_to_expiry:null,sell_through_required:null,sell_through_actual:null,write_off_projection:null,roas_7d:null,roas_30d:null,roas_90d:null,cac_payback:null,cpl:null,repeat_rate:null,time_to_2nd:null,aov:null,paid_pct:null,organic_pct:null,notes:""},
    product:{
      platform_revenue_mtd:null,engagement:null,engagement_wow:null,engagement_target_delta:null,activation:null,activation_wow:null,activation_target_delta:null,
      revenue_refund_retention:[
        {metric:"Platform Revenue MTD",actual:null,mom:null,vs_target:null},
        {metric:"Y-MVM Refund",actual:null,mom:null,vs_target:null},
        {metric:"Y-M13 retention",actual:null,mom:null,vs_target:null},
        {metric:"Y-M1 retention",actual:null,mom:null,vs_target:null},
        {metric:"M-M3 retention",actual:null,mom:null,vs_target:null}
      ],
      acquisition_checkout:[
        {metric:"US checkout",actual:null,wow:null,vs_target:null},
        {metric:"RoW checkout",actual:null,wow:null,vs_target:null},
        {metric:"Day 0 login",actual:null,wow:null,vs_target:null},
        {metric:"Renewal ratio",actual:null,wow:null,vs_target:null}
      ],
      engagement_transformation:[
        {metric:"Engagement",actual:null,wow:null,vs_target:null},
        {metric:"Activation",actual:null,wow:null,vs_target:null},
        {metric:"Transformation",actual:null,wow:null,vs_target:null},
        {metric:"MAU/MAS",actual:null,wow:null,vs_target:null},
        {metric:"CS Ticket/MAS",actual:null,wow:null,vs_target:null}
      ],
      initiatives:[]
    },
    action_items:{pm_flag_active:false,pm_flag_text:"",items:[],decisions:[],next_id:1}
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
        if (sv !== null && sv !== undefined) sub[sk] = sv;
      }
      merged[k] = sub;
    } else {
      merged[k] = v;
    }
  }
  return merged;
};

// ─────────────────────────────────────────────────────────
// ATOMS
// ─────────────────────────────────────────────────────────
const Btn = ({ children, onClick, variant="primary", size="md", className="" }) => {
  const v={primary:{background:"var(--purple)",color:"#fff",border:"none"},ghost:{background:"transparent",color:"var(--muted)",border:"1px solid var(--border)"},outline:{background:"transparent",color:"var(--text)",border:"1px solid var(--border)"},gold:{background:"var(--gold)",color:"#07050F",border:"none",fontWeight:600},danger:{background:"var(--red-bg)",color:"var(--red)",border:"1px solid rgba(212,44,69,0.2)"}}[variant];
  const sz={sm:{padding:"5px 10px",fontSize:"12px",borderRadius:"6px"},md:{padding:"8px 14px",fontSize:"13px",borderRadius:"8px"},lg:{padding:"10px 20px",fontSize:"14px",borderRadius:"10px"}}[size];
  return <button onClick={onClick} style={{display:"inline-flex",alignItems:"center",gap:"6px",cursor:"pointer",fontFamily:"inherit",fontWeight:500,transition:"all 0.15s",...v,...sz}} className={className}>{children}</button>;
};
const Pill = ({ label, variant="neutral" }) => {
  const s={good:{bg:"var(--grn-bg)",color:"var(--green)",border:"1px solid rgba(46,204,113,0.2)"},warn:{bg:"var(--amb-bg)",color:"var(--amber)",border:"1px solid rgba(255,155,60,0.2)"},bad:{bg:"var(--red-bg)",color:"var(--red)",border:"1px solid rgba(255,77,106,0.2)"},neutral:{bg:"rgba(127,127,127,0.1)",color:"var(--muted)",border:"1px solid var(--border)"},purple:{bg:"rgba(123,95,245,0.12)",color:"var(--purple2)",border:"1px solid rgba(123,95,245,0.2)"},gold:{bg:"rgba(232,184,75,0.1)",color:"var(--gold)",border:"1px solid rgba(232,184,75,0.2)"}}[variant]||{bg:"rgba(127,127,127,0.1)",color:"var(--muted)",border:"1px solid var(--border)"};
  return <span style={{display:"inline-flex",alignItems:"center",gap:"4px",fontSize:"11px",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.06em",padding:"3px 8px",borderRadius:"20px",background:s.bg,color:s.color,border:s.border}}>{label}</span>;
};
const Dt = ({ delta:d, suffix="%" }) => {
  if(d===null||d===undefined||isNaN(d)) return <span style={{color:"var(--faint)"}}>—</span>;
  const up=d>0,flat=Math.abs(d)<0.05,col=flat?"var(--muted)":up?"var(--green)":"var(--red)";
  const Icon=flat?null:up?TrendingUp:TrendingDown;
  return <span style={{display:"inline-flex",alignItems:"center",gap:"3px",fontSize:"12px",fontWeight:500,color:col,fontFamily:"'JetBrains Mono',monospace"}}>{Icon&&<Icon size={11}/>}{up&&!flat?"+":""}{d.toFixed(1)}{suffix}</span>;
};
const NI = ({ value, onChange, prefix="", suffix="" }) => (
  <span style={{display:"inline-flex",alignItems:"center",gap:"4px"}}>
    {prefix&&<span style={{color:"var(--faint)",fontSize:"12px"}}>{prefix}</span>}
    <input type="text" value={value??""} placeholder="—" onChange={e=>{ const v=e.target.value; if(v===""||v==="-"){onChange(v===""?null:v);return;} const n=parseFloat(v); onChange(isNaN(n)?v:n); }} style={{width:"80px",border:"1px solid rgba(123,95,245,0.35)",background:"rgba(123,95,245,0.08)",color:"var(--text)",borderRadius:"6px",padding:"4px 8px",fontFamily:"'JetBrains Mono',monospace",fontSize:"13px"}} />
    {suffix&&<span style={{color:"var(--faint)",fontSize:"12px"}}>{suffix}</span>}
  </span>
);
const TI = ({ value, onChange, placeholder="", multi=false, style={} }) =>
  multi?<textarea value={value??""} placeholder={placeholder} rows={2} onChange={e=>onChange(e.target.value)} style={{width:"100%",resize:"vertical",...style}}/>:<input type="text" value={value??""} placeholder={placeholder} onChange={e=>onChange(e.target.value)} style={{width:"100%",...style}}/>;
const Card = ({ children, style={} }) => <div style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"12px",overflow:"hidden",...style}}>{children}</div>;
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
const Hero = ({ label, value, target, fmt="money", subtext, editing, onChange, onChangeTarget, glow=false }) => {
  const fmter=fmt==="money"?fmtM:fmt==="pct"?fmtPct:fmtNum;
  const d=target!==undefined?delta(value,target):null;
  const st=status(d);
  return (
    <div style={{background:"var(--card2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"18px 20px",...(glow&&st==="bad"?{boxShadow:"0 0 20px rgba(212,44,69,0.15)",borderColor:"rgba(212,44,69,0.2)"}:{})}}>
      <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"12px"}}>{label}</div>
      {editing?<div style={{display:"flex",flexDirection:"column",gap:"6px"}}><NI value={value} onChange={onChange} prefix={fmt==="money"?"$":""} suffix={fmt==="pct"?"%":""}/>{target!==undefined&&onChangeTarget&&<div style={{fontSize:"12px",color:"var(--muted)"}}>vs target: <NI value={target} onChange={onChangeTarget} prefix={fmt==="money"?"$":""} suffix={fmt==="pct"?"%":""}/></div>}</div>
      :<><div className="font-display" style={{fontSize:"34px",fontWeight:400,lineHeight:1,marginBottom:"8px",color:st==="bad"?"var(--red)":st==="warn"?"var(--amber)":"var(--text)"}}>{fmter(value)}</div><div style={{display:"flex",alignItems:"center",gap:"8px",flexWrap:"wrap"}}>{target&&<span className="font-mono" style={{fontSize:"12px",color:"var(--muted)"}}>vs {fmter(target)}</span>}{d!==null&&<Dt delta={d}/>}{subtext&&<span style={{fontSize:"12px",color:"var(--muted)"}}>{subtext}</span>}</div></>}
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
      {lightboxImg&&<div onClick={()=>setLightboxImg(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}}><img src={lightboxImg} style={{maxWidth:"90vw",maxHeight:"85vh",objectFit:"contain",borderRadius:"10px"}} onClick={e=>e.stopPropagation()}/><button onClick={()=>setLightboxImg(null)} style={{position:"absolute",top:20,right:20,background:"var(--card2)",border:"1px solid var(--border)",color:"var(--text)",borderRadius:"50%",width:"32px",height:"32px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><X size={14}/></button></div>}
      <div style={{border:"1px solid var(--border)",borderRadius:"12px",overflow:"hidden",background:"var(--card)"}}>
        {/* Toggle bar */}
        <button onClick={()=>setOpen(!open)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 18px",background:"transparent",border:"none",cursor:"pointer",color:"var(--text)",fontFamily:"inherit"}}>
          <span style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <Image size={14} style={{color:"var(--purple2)",flexShrink:0}}/>
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
                <Image size={24} style={{color:"var(--faint)",marginBottom:"10px"}}/>
                <div style={{fontSize:"13px",color:"var(--muted)",fontWeight:500}}>Click to upload image</div>
                <div style={{fontSize:"11px",color:"var(--faint)",marginTop:"4px"}}>Screenshots, charts, or reference materials — JPG, PNG, GIF</div>
              </div>
            )}
          </div>
          {/* Custom header */}
          <div>
            <div style={{fontSize:"10px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--gold)",marginBottom:"8px"}}>Custom header</div>
            <input type="text" value={cfg.header_text||""} onChange={e=>onChange({...cfg,header_text:e.target.value})} placeholder="Override section title for this week…" style={{width:"100%",fontFamily:"'Fraunces',serif",fontSize:"17px"}}/>
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
      {lightbox&&<div onClick={()=>setLightbox(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"}}><img src={lightbox} style={{maxWidth:"90vw",maxHeight:"85vh",objectFit:"contain",borderRadius:"10px"}}/><button onClick={()=>setLightbox(null)} style={{position:"absolute",top:20,right:20,background:"var(--card2)",border:"1px solid var(--border)",color:"var(--text)",borderRadius:"50%",width:"34px",height:"34px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><X size={15}/></button></div>}
      <button onClick={()=>setOpen(!open)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",background:"rgba(123,95,245,0.06)",border:"1px solid rgba(123,95,245,0.15)",borderRadius:"10px",padding:"11px 16px",cursor:"pointer",color:"var(--text)",fontFamily:"inherit"}}>
        <span style={{display:"flex",alignItems:"center",gap:"8px",fontSize:"13px",fontWeight:500}}><MessageSquare size={14} style={{color:"var(--purple2)"}}/>Comments & Notes{comments.length>0&&<span style={{background:"var(--purple)",color:"#fff",fontSize:"11px",fontWeight:700,borderRadius:"20px",padding:"1px 7px"}}>{comments.length}</span>}</span>
        {open?<ChevronUp size={14} style={{color:"var(--muted)"}}/>:<ChevronDown size={14} style={{color:"var(--muted)"}}/>}
      </button>
      {open&&<div style={{marginTop:"6px",background:"var(--card)",border:"1px solid var(--border)",borderRadius:"10px",overflow:"hidden"}}>
        <div style={{padding:"14px",borderBottom:"1px solid var(--border)"}}>
          <input type="text" value={author} onChange={e=>setAuthor(e.target.value)} placeholder="Your name" style={{width:"50%",marginBottom:"8px"}}/>
          <textarea value={text} onChange={e=>setText(e.target.value)} placeholder={`Note for ${sectionLabel}…`} rows={2} style={{width:"100%",resize:"vertical",marginBottom:"8px"}}/>
          {imgData&&<div style={{display:"flex",alignItems:"center",gap:"10px",marginBottom:"8px",background:"rgba(255,255,255,0.04)",borderRadius:"8px",padding:"8px 12px"}}><img src={imgData} onClick={()=>setLightbox(imgData)} style={{height:"48px",borderRadius:"6px",cursor:"zoom-in",objectFit:"cover"}}/><span style={{fontSize:"12px",color:"var(--muted)",flex:1}}>{imgName}</span><button onClick={()=>{setImgData(null);setImgName(null);}} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer"}}><X size={13}/></button></div>}
          <div style={{display:"flex",gap:"8px"}}><input type="file" ref={fileRef} accept="image/*" style={{display:"none"}} onChange={handleFile}/><Btn variant="ghost" size="sm" onClick={()=>fileRef.current?.click()}><Paperclip size={12}/>Attach image</Btn><Btn variant="primary" size="sm" onClick={post}><Send size={12}/>Post</Btn></div>
        </div>
        {comments.length===0?<div style={{padding:"20px",textAlign:"center",color:"var(--faint)",fontSize:"13px",fontStyle:"italic"}}>No notes yet.</div>
        :<div style={{maxHeight:"300px",overflowY:"auto"}}>{comments.map((c,i)=>(
          <div key={c.id} style={{padding:"12px 16px",borderBottom:i<comments.length-1?"1px solid var(--border)":"none",display:"flex",gap:"10px"}}>
            <div style={{width:"28px",height:"28px",borderRadius:"50%",background:"linear-gradient(135deg,var(--purple),var(--purple2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",fontWeight:700,color:"#fff",flexShrink:0}}>{(c.author||"A")[0].toUpperCase()}</div>
            <div style={{flex:1}}><div style={{display:"flex",alignItems:"baseline",gap:"10px",marginBottom:"4px"}}><span style={{fontSize:"13px",fontWeight:600,color:"var(--text)"}}>{c.author}</span><span style={{fontSize:"11px",color:"var(--faint)"}}>{new Date(c.created_at).toLocaleString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"})}</span></div>{c.text&&<p style={{fontSize:"13px",color:"var(--muted)",lineHeight:1.6}}>{c.text}</p>}{c.image_data&&<img src={c.image_data} onClick={()=>setLightbox(c.image_data)} style={{marginTop:"8px",maxHeight:"120px",maxWidth:"260px",borderRadius:"8px",cursor:"zoom-in",objectFit:"cover",border:"1px solid var(--border)"}}/>}</div>
            <button onClick={()=>onChange(comments.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"var(--faint)",cursor:"pointer",paddingTop:"2px"}}><Trash2 size={12}/></button>
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
    <div className="rg-5" style={{gap:"12px",marginBottom:"20px"}}>
      <Hero label="MTD Sales" value={ch.mtd_sales_actual} target={ch.mtd_sales_target} editing={editing} onChange={v=>set(["mtd_sales_actual"],v)} onChangeTarget={v=>set(["mtd_sales_target"],v)} glow/>
      <Hero label="Week vs Target" value={ch.week_actual} target={ch.week_target} editing={editing} onChange={v=>set(["week_actual"],v)} onChangeTarget={v=>set(["week_target"],v)} glow/>
      <div style={{background:"var(--card2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"18px 20px"}}>
        <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"12px"}}>Cash Balance</div>
        {editing?<div style={{display:"flex",flexDirection:"column",gap:"6px"}}><NI value={ch.cash_balance} onChange={v=>set(["cash_balance"],v)} prefix="$"/><div style={{fontSize:"12px",color:"var(--muted)"}}>Runway: <NI value={ch.cash_runway_months} onChange={v=>set(["cash_runway_months"],v)} suffix="mo"/></div><div style={{fontSize:"12px",color:"var(--muted)"}}>Last week: <NI value={ch.cash_last_week} onChange={v=>set(["cash_last_week"],v)} prefix="$"/></div></div>
        :<><div className="font-display" style={{fontSize:"34px",fontWeight:400,lineHeight:1,marginBottom:"8px"}}>{fmtM(ch.cash_balance)}</div><div style={{fontSize:"12px",color:"var(--muted)"}}>{ch.cash_runway_months} months runway</div><div style={{fontSize:"12px",color:"var(--faint)"}}>vs {fmtM(ch.cash_last_week)} last week</div></>}
      </div>
      <Hero label="Ads Efficiency Ratio" value={ch.aer_actual} target={ch.aer_target} fmt="pct" subtext={!editing?`Ad spend ${fmtM(ch.ad_spend)}`:null} editing={editing} onChange={v=>set(["aer_actual"],v)} onChangeTarget={v=>set(["aer_target"],v)}/>
      <div style={{background:"var(--card2)",border:"1px solid var(--border)",borderRadius:"12px",padding:"18px 20px"}}>
        <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"12px"}}>Adspend / Sales</div>
        {editing?<NI value={ch.adspend_pct} onChange={v=>set(["adspend_pct"],v)} suffix="%"/>:<><div className="font-display" style={{fontSize:"34px",fontWeight:400,lineHeight:1,marginBottom:"8px"}}>{fmtPct(ch.adspend_pct)}</div><div className="font-mono" style={{fontSize:"12px",color:"var(--muted)"}}>{fmtM(ch.adspend_num)} / {fmtM(ch.mtd_sales_actual)}</div></>}
      </div>
    </div>
    <div className="rg-2" style={{gap:"16px",marginBottom:"16px"}}>
      <Card><CardHead title="3 Must-Solve Issues This Week" action={editing&&<Btn variant="ghost" size="sm" onClick={()=>set(["must_solve"],[...ch.must_solve,{owner:"",title:"New issue",detail:""}])}><Plus size={12}/>Add</Btn>}/>
        <div style={{padding:"16px",display:"flex",flexDirection:"column",gap:"14px"}}>
          {ch.must_solve.length===0&&!editing&&<p style={{fontSize:"13px",color:"var(--faint)",fontStyle:"italic"}}>No must-solve issues added yet. Click "Edit numbers" to add.</p>}
          {ch.must_solve.map((m,i)=><div key={i} style={{display:"flex",gap:"12px",alignItems:"flex-start"}}>
            <div style={{width:"3px",minHeight:"44px",background:"var(--red)",borderRadius:"2px",flexShrink:0,marginTop:"4px"}}/>
            {editing
              ?<div style={{flex:1,display:"flex",flexDirection:"column",gap:"6px"}}>
                <div style={{display:"flex",gap:"8px",alignItems:"center"}}>
                  <TI value={m.title} onChange={v=>{const n=[...ch.must_solve];n[i]={...n[i],title:v};set(["must_solve"],n);}} placeholder="Issue title" style={{flex:1}}/>
                  <TI value={m.owner} onChange={v=>{const n=[...ch.must_solve];n[i]={...n[i],owner:v};set(["must_solve"],n);}} placeholder="Owner" style={{width:"90px"}}/>
                  <button onClick={()=>set(["must_solve"],ch.must_solve.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"var(--faint)",cursor:"pointer",padding:"4px"}}><Trash2 size={13}/></button>
                </div>
                <TI value={m.detail} onChange={v=>{const n=[...ch.must_solve];n[i]={...n[i],detail:v};set(["must_solve"],n);}} multi placeholder="Detail — impact, why it matters, current status…"/>
              </div>
              :<div style={{flex:1}}><div style={{display:"flex",alignItems:"baseline",gap:"10px",marginBottom:"3px"}}><span className="font-display" style={{fontSize:"17px",color:"var(--text)"}}>{m.title}</span><span style={{fontSize:"11px",color:"var(--purple2)",fontWeight:600,textTransform:"uppercase",letterSpacing:"0.05em"}}>→ {m.owner}</span></div><p style={{fontSize:"13px",color:"var(--muted)",lineHeight:1.6}}>{m.detail}</p></div>}
          </div>)}
        </div>
      </Card>
      <Card><CardHead title="Forward Cash Risk" action={editing&&<Btn variant="ghost" size="sm" onClick={()=>set(["forward_risks"],[...ch.forward_risks,"New risk — describe the scenario and financial exposure"])}><Plus size={12}/>Add</Btn>}/>
        <div style={{padding:"16px",display:"flex",flexDirection:"column",gap:"10px"}}>
          {ch.forward_risks.length===0&&!editing&&<p style={{fontSize:"13px",color:"var(--faint)",fontStyle:"italic"}}>No forward risks added yet. Click "Edit numbers" to add.</p>}
          {ch.forward_risks.map((r,i)=><div key={i} style={{display:"flex",gap:"10px",alignItems:"flex-start",background:"var(--red-bg)",border:"1px solid rgba(212,44,69,0.15)",borderRadius:"8px",padding:"12px 14px"}}>
            <AlertCircle size={14} style={{color:"var(--red)",flexShrink:0,marginTop:"2px"}}/>
            {editing
              ?<><TI value={r} onChange={v=>{const n=[...ch.forward_risks];n[i]=v;set(["forward_risks"],n);}} multi style={{flex:1}} placeholder="Describe the risk scenario and financial exposure…"/>
                <button onClick={()=>set(["forward_risks"],ch.forward_risks.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"var(--faint)",cursor:"pointer",padding:"4px",flexShrink:0}}><Trash2 size={13}/></button></>
              :<p style={{fontSize:"13px",color:"var(--muted)",lineHeight:1.6,flex:1}}>{r}</p>}
          </div>)}
        </div>
      </Card>
    </div>
    <Card><CardHead title="Full Year Rolling Forecast (3+9)"/>
      {editing
        ?<div style={{padding:"16px"}}>
          <p style={{fontSize:"12px",color:"var(--muted)",marginBottom:"14px",fontStyle:"italic"}}>All figures in $M unless labelled. Fill in what you have — blanks show "—" in view mode.</p>
          <div className="rg-4" style={{gap:"12px"}}>
            {[{g:"Sales",f:[["sa","Actual","$M"],["st","Target","$M"],["yoy","YoY","%"]]},{g:"Margins",f:[["gp","GP %","%"],["ea","EBITDA Act.","$M"],["ep","EBITDA %","%"],["et","EBITDA Tgt.","%"]]},{g:"Costs",f:[["oa","OPEX","$M"],["op","OPEX %","%"],["ot","OPEX Tgt.","%"],["ada","AdSpend","$M"],["adp","AdSpend %","%"],["adly","AdSpend LY","$M"],["hcp","HC %","%"],["hct","HC Tgt.","%"],["ga","G&A","$M"]]},{g:"Bottom Line",f:[["ni","Net Inc.","$M"],["nip","NI %","%"],["c","Cash","$M"],["ct","Cash Tgt.","$M"],["cly","Cash LY","$M"]]}].map(({g,f})=>(
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
          {[["Sales",`$${ch.rf.sa}M`,`$${ch.rf.st}M target`,ch.rf.yoy<0?"bad":"good"],["GP Margin",fmtPct(ch.rf.gp),"above target","good"],["EBITDA",`$${ch.rf.ea}M (${ch.rf.ep}%)`,`${ch.rf.et}% target`,"bad"],["OPEX",`$${ch.rf.oa}M (${ch.rf.op}%)`,`${ch.rf.ot}% target`,"bad"],["Ad Spend",`$${ch.rf.ada}M (${ch.rf.adp}%)`,`$${ch.rf.adly}M LY`,"good"],["Headcount",`${ch.rf.hcp}%`,`${ch.rf.hct}% target`,"bad"],["G&A",`$${ch.rf.ga}M`,"","neutral"],["Net Income",`$${ch.rf.ni}M (${ch.rf.nip}%)`,""," neutral"],["Cash",`$${ch.rf.c}M`,`$${ch.rf.ct}M tgt / $${ch.rf.cly}M LY`,"bad"]].map(([l,v,sub,st],i)=>(
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
  const autoTarget=rows.reduce((s,r)=>s+(parseFloat(r.target)||0),0);
  const autoActual=rows.reduce((s,r)=>s+(parseFloat(r.actual)||0),0);
  return <div className="fade-up">
    <SHead owner="Jill" title="BU Performance Snapshot" cadence="Weekly · Whole-company verdict before BU walk-throughs · MTD only" editing={editing} onEdit={onEdit} onSave={onSave} onCancel={onCancel}/>
    <Card><div style={{overflowX:"auto"}}>
      <table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px"}}>
        <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["BU","Target","Actual","$ Delta","% Delta","Status","YTD YoY","YTD EBITDA","FY EBITDA","Why / Risk + Mit"].map(h=><th key={h} style={{padding:"12px 14px",textAlign:h==="BU"||h==="Why / Risk + Mit"?"left":"right",fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--muted)",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r,i)=>{ const d=delta(r.actual,r.target),dd=(parseFloat(r.actual)||0)-(parseFloat(r.target)||0),st=status(d); return (
            <tr key={i} className="ai-row" style={{borderBottom:"1px solid var(--border)"}}>
              <td style={{padding:"14px",fontFamily:"'Fraunces',serif",fontSize:"17px"}}>{r.bu}</td>
              <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{editing?<NI value={r.target} onChange={v=>{const n=[...rows];n[i]={...n[i],target:v};onChange(["bu_performance"],n);}} prefix="$"/>:fmtM(r.target)}</td>
              <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{editing?<NI value={r.actual} onChange={v=>{const n=[...rows];n[i]={...n[i],actual:v};onChange(["bu_performance"],n);}} prefix="$"/>:fmtM(r.actual)}</td>
              <td style={{padding:"14px",textAlign:"right",color:dd<0?"var(--red)":"var(--green)"}} className="font-mono">{dd>=0?"+":"–"}{fmtM(Math.abs(dd))}</td>
              <td style={{padding:"14px",textAlign:"right"}}><Dt delta={d}/></td>
              <td style={{padding:"14px",textAlign:"right"}}><Pill label={st==="good"?"Green":st==="warn"?"Amber":"Red"} variant={st}/></td>
              <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{editing?<NI value={r.yoy} onChange={v=>{const n=[...rows];n[i]={...n[i],yoy:v};onChange(["bu_performance"],n);}} suffix="%"/>:fmtPct(r.yoy,0)}</td>
              <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{r.ytd_ebitda===null?"n.a":fmtPct(r.ytd_ebitda,0)}</td>
              <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{r.fy_ebitda===null?"n.a":fmtPct(r.fy_ebitda,0)}</td>
              <td style={{padding:"14px",maxWidth:"240px"}}>{editing?<div style={{display:"flex",flexDirection:"column",gap:"6px"}}><TI value={r.why} onChange={v=>{const n=[...rows];n[i]={...n[i],why:v};onChange(["bu_performance"],n);}} multi/><TI value={r.risk} onChange={v=>{const n=[...rows];n[i]={...n[i],risk:v};onChange(["bu_performance"],n);}} multi/></div>:<><div style={{fontSize:"13px",color:"var(--muted)",lineHeight:1.5}}>{r.why}</div><div style={{fontSize:"12px",color:"var(--faint)",marginTop:"4px"}}>{r.risk}</div></>}</td>
            </tr>
          ); })}
          <tr style={{background:"rgba(123,95,245,0.08)"}}>
            <td style={{padding:"14px",fontFamily:"'Fraunces',serif",fontSize:"17px",color:"var(--purple2)"}}>Total Company</td>
            <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{fmtM(autoTarget)}</td>
            <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{fmtM(autoActual)}</td>
            <td style={{padding:"14px",textAlign:"right",color:autoActual<autoTarget?"var(--red)":"var(--green)"}} className="font-mono">{autoActual>=autoTarget?"+":"–"}{fmtM(Math.abs(autoActual-autoTarget))}</td>
            <td style={{padding:"14px",textAlign:"right"}}><Dt delta={delta(autoActual,autoTarget)}/></td>
            <td style={{padding:"14px",textAlign:"right"}}><Pill label={status(delta(autoActual,autoTarget))==="good"?"Green":status(delta(autoActual,autoTarget))==="warn"?"Amber":"Red"} variant={status(delta(autoActual,autoTarget))}/></td>
            <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{editing?<NI value={total.yoy} onChange={v=>onChange(["bu_total","yoy"],v)} suffix="%"/>:fmtPct(total.yoy,0)}</td>
            <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{editing?<NI value={total.ytd_ebitda} onChange={v=>onChange(["bu_total","ytd_ebitda"],v)} suffix="%"/>:fmtPct(total.ytd_ebitda,0)}</td>
            <td style={{padding:"14px",textAlign:"right"}} className="font-mono">{editing?<NI value={total.fy_ebitda} onChange={v=>onChange(["bu_total","fy_ebitda"],v)} suffix="%"/>:fmtPct(total.fy_ebitda,0)}</td>
            <td style={{padding:"14px",fontSize:"10px",color:"var(--faint)",fontStyle:"italic"}}>Target & Actual auto-sum from BU rows</td>
          </tr>
        </tbody>
      </table>
    </div></Card>
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
        <div key={i} style={{background:"linear-gradient(145deg,var(--card2),rgba(123,95,245,0.08))",border:"1px solid rgba(123,95,245,0.15)",borderRadius:"14px",padding:"20px"}}>
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
        {m.initiatives.length===0&&!editing&&<p style={{fontSize:"13px",color:"var(--faint)",fontStyle:"italic"}}>No initiatives added yet — click "Edit numbers" then "Add" to enter this week's initiatives.</p>}
        {m.initiatives.map((it,i)=>editing?<div key={i} style={{display:"flex",gap:"8px"}}><TI value={it} onChange={v=>{const n=[...m.initiatives];n[i]=v;set(["initiatives"],n);}} placeholder="Describe the initiative — e.g. 'Launch $199 offer test on Manifesting pathway'" style={{flex:1}}/><button onClick={()=>set(["initiatives"],m.initiatives.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"var(--faint)",cursor:"pointer"}}><Trash2 size={13}/></button></div>:<div key={i} style={{display:"flex",gap:"10px",alignItems:"flex-start"}}><ChevronRight size={13} style={{color:"var(--gold)",flexShrink:0,marginTop:"3px"}}/><span style={{fontSize:"13px",color:"var(--muted)"}}>{it}</span></div>)}
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
      <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Pathway","Ad Spend MTD","Revenue MTD","ROAS 7D","ROAS 30D","ROAS 90D","CPL","AOV"].map(h=><th key={h} style={{padding:"12px 14px",textAlign:h==="Pathway"?"left":"right",fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--muted)"}}>{h}</th>)}</tr></thead>
      <tbody>{p.rows.map((r,i)=><tr key={i} style={{borderBottom:"1px solid var(--border)"}} className="ai-row">
        <td style={{padding:"14px",fontFamily:"'Fraunces',serif",fontSize:"16px"}}>{r.name}</td>
        {["ad_spend","revenue","roas_7d","roas_30d","roas_90d","cpl","aov"].map(k=><td key={k} style={{padding:"14px",textAlign:"right"}} className="font-mono">{editing?<NI value={r[k]} onChange={v=>{const n=[...p.rows];n[i]={...n[i],[k]:v};set("rows",n);}} prefix={["ad_spend","revenue","cpl","aov"].includes(k)?"$":""} suffix={["roas_7d","roas_30d","roas_90d"].includes(k)?"%":""}/>:(r[k]===null?<span style={{color:"var(--faint)"}}>—</span>:(k.includes("roas")?fmtPct(r[k],0):fmtM(r[k])))}</td>)}
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
                <p style={{fontSize:"13px",color:"var(--faint)",fontStyle:"italic",marginBottom:"10px"}}>No commentary added. Click "Edit numbers" to fill in. Suggested format:</p>
                <p style={{fontSize:"12px",color:"var(--faint)",lineHeight:1.8}}>WINNING — [Pathway]: [What's working and why]<br/>BLEEDING — [Pathway]: [What's off]<br/>BUDGET SHIFTS — [Reallocations this week]<br/>CREATIVE — [New angles being tested]</p>
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
        <div key={k} style={{background:"linear-gradient(145deg,var(--card2),rgba(123,95,245,0.08))",border:"1px solid rgba(123,95,245,0.15)",borderRadius:"12px",padding:"18px"}}>
          <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"12px"}}>{lbl}</div>
          {editing?<NI value={m[k]} onChange={v=>set([k],v)} prefix={fmt==="money"?"$":""} suffix={fmt==="pct"?"%":""}/>:<div className="font-display" style={{fontSize:"28px",lineHeight:1}}>{fmt==="money"?fmtM(m[k]):fmtPct(m[k])}</div>}
        </div>
      ))}
    </div>
    <Card style={{marginBottom:"16px"}}><CardHead title="Product Breakdown"/><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px"}}>
      <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["Product","Sales","Cash Collected","Refund %","PIF %"].map(h=><th key={h} style={{padding:"12px 14px",textAlign:h==="Product"?"left":"right",fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--muted)"}}>{h}</th>)}</tr></thead>
      <tbody>{m.products.map((r,i)=><tr key={i} style={{borderBottom:"1px solid var(--border)"}} className="ai-row">
        <td style={{padding:"14px",fontFamily:"'Fraunces',serif",fontSize:"16px"}}>{r.name}</td>
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
    <div style={{background:"linear-gradient(145deg,var(--card2),rgba(123,95,245,0.06))",border:"1px solid rgba(123,95,245,0.15)",borderRadius:"14px",padding:"24px",marginBottom:"16px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"20px"}}>
        <div><div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"8px"}}>Active Campaign</div><h3 className="font-display" style={{fontSize:"22px",color:"var(--text)"}}>{editing?<TI value={e.campaign_name} onChange={v=>set(["campaign_name"],v)} style={{fontSize:"18px",width:"340px"}}/>:e.campaign_name}</h3></div>
        <Pill label={`ADS ${e.ads_status} · ROAS ${e.ads_roas}%`} variant={e.ads_status==="PAUSED"?"warn":"good"}/>
      </div>
      <div className="rg-4" style={{gap:"20px"}}>
        <div><div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--muted)",marginBottom:"10px"}}>Tickets Sold</div>{editing?<div style={{display:"flex",gap:"6px"}}><NI value={e.tickets_sold} onChange={v=>set(["tickets_sold"],v)}/><span style={{color:"var(--faint)"}}>/</span><NI value={e.tickets_target} onChange={v=>set(["tickets_target"],v)}/></div>:<><div className="font-display" style={{fontSize:"30px",lineHeight:1,marginBottom:"6px"}}>{fmtNum(e.tickets_sold)} <span style={{color:"var(--faint)",fontSize:"16px"}}>/ {fmtNum(e.tickets_target)}</span></div><div className="font-mono" style={{fontSize:"12px",color:"var(--muted)",marginBottom:"8px"}}>{tPct.toFixed(1)}% · {e.tickets_remaining} remaining</div><div className="progress-bar"><div className="progress-fill" style={{width:`${Math.min(100,tPct)}%`,background:"linear-gradient(90deg,var(--purple),var(--purple2))"}}/></div></>}</div>
        <div><div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--muted)",marginBottom:"10px"}}>Net Revenue</div>{editing?<div style={{display:"flex",gap:"6px"}}><NI value={e.revenue_actual} onChange={v=>set(["revenue_actual"],v)} prefix="$"/><span style={{color:"var(--faint)"}}>/</span><NI value={e.revenue_target} onChange={v=>set(["revenue_target"],v)} prefix="$"/></div>:<><div className="font-display" style={{fontSize:"30px",lineHeight:1,marginBottom:"6px"}}>{fmtM(e.revenue_actual)}</div><div className="font-mono" style={{fontSize:"12px",color:"var(--muted)",marginBottom:"8px"}}>{rPct.toFixed(1)}% of {fmtM(e.revenue_target)}</div><div className="progress-bar"><div className="progress-fill" style={{width:`${Math.min(100,rPct)}%`,background:"linear-gradient(90deg,var(--green),rgba(46,204,113,0.5))"}}/></div></>}</div>
        <div><div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--muted)",marginBottom:"10px"}}>Refund Rate (Running)</div>{editing?<NI value={e.refund_rate} onChange={v=>set(["refund_rate"],v)} suffix="%"/>:<><div className="font-display" style={{fontSize:"30px",lineHeight:1,color:"var(--amber)",marginBottom:"6px"}}>{fmtPct(e.refund_rate)}</div><div className="font-mono" style={{fontSize:"12px",color:"var(--muted)"}}>{fmtM(e.refund_dollars)} of {fmtM(e.gross_revenue)} gross</div></>}</div>
        <div><div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--muted)",marginBottom:"10px"}}>Sales Velocity 7D</div>{editing?<div style={{display:"flex",flexDirection:"column",gap:"6px"}}><NI value={e.velocity_7d} onChange={v=>set(["velocity_7d"],v)} suffix="tix"/><div style={{fontSize:"12px",color:"var(--muted)"}}>per day: <NI value={e.velocity_per_day} onChange={v=>set(["velocity_per_day"],v)}/></div></div>:<><div className="font-display" style={{fontSize:"30px",lineHeight:1,marginBottom:"6px"}}>{e.velocity_7d}</div><div className="font-mono" style={{fontSize:"12px",color:e.velocity_per_day<e.velocity_required?"var(--red)":"var(--green)"}}>~{e.velocity_per_day}/day · need {e.velocity_required}/day</div></>}</div>
      </div>
    </div>
    <div className="rg-2" style={{gap:"16px"}}>
      <Card><CardHead title="Refund Forecast"/><div style={{padding:"16px"}}>
        <div className="rg-3" style={{gap:"12px",marginBottom:"14px"}}>{[["2025 Actual",`${e.refund_2025_actual}%`,"neutral"],["Current Running",fmtPct(e.refund_rate),"warn"],["Initial Forecast",`${e.refund_forecast_initial}%`,"neutral"]].map(([l,v,st])=><div key={l}><div style={{fontSize:"10px",fontWeight:700,textTransform:"uppercase",color:"var(--muted)",marginBottom:"4px"}}>{l}</div><div className="font-mono" style={{fontSize:"18px",color:st==="warn"?"var(--amber)":"var(--text)"}}>{v}</div></div>)}</div>
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
  const groups=[{title:"Sales Performance",fields:[["MTD Sales","mtd_sales","$"],["MTD Target","mtd_target","$"],["Bottles Sold","bottles_sold",""],["Bottles Target","bottles_target",""],["Rev/Organic Session","revenue_per_session","$"]]},{title:"Inventory + Expiry Risk",fields:[["Units Left","units_left",""],["Days to Expiry","days_to_expiry","d"],["Required Sell-Through","sell_through_required","%"],["Actual Sell-Through","sell_through_actual","%"],["Projected Write-Off","write_off_projection","$"]]},{title:"Acquisition Efficiency",fields:[["ROAS 7D","roas_7d","%"],["ROAS 30D","roas_30d","%"],["ROAS 90D","roas_90d","%"],["CAC Payback","cac_payback","d"],["CPL","cpl","$"]]},{title:"Repeat + Channel Mix",fields:[["Repeat Rate","repeat_rate","%"],["Time to 2nd","time_to_2nd","d"],["AOV","aov","$"],["Paid %","paid_pct","%"],["Organic %","organic_pct","%"]]}];
  return <div className="fade-up">
    <SHead owner="Moniek" title="States" cadence="Weekly · Physical product · Inventory + expiry is the binding constraint" editing={editing} onEdit={onEdit} onSave={onSave} onCancel={onCancel}/>
    {Object.entries(s).filter(([k])=>k!=="notes").every(([,v])=>v===null)&&!editing&&<div style={{background:"var(--amb-bg)",border:"1px solid rgba(212,120,0,0.2)",borderRadius:"10px",padding:"12px 16px",marginBottom:"16px",fontSize:"13px",color:"var(--amber)",display:"flex",alignItems:"center",gap:"10px"}}><AlertCircle size={14}/>Numbers not yet entered for this week.</div>}
    <div className="rg-2" style={{gap:"16px"}}>
      {groups.map(g=><Card key={g.title}><CardHead title={g.title}/><div style={{padding:"16px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"12px"}}>
        {g.fields.map(([lbl,k,u])=><div key={k}><div style={{fontSize:"10px",fontWeight:700,textTransform:"uppercase",color:"var(--muted)",marginBottom:"4px"}}>{lbl}</div>{editing?<NI value={s[k]} onChange={v=>set([k],v)} prefix={u==="$"?"$":""} suffix={u==="%"||u==="d"?u:""}/>:<div className="font-mono" style={{fontSize:"15px"}}>{s[k]===null?<span style={{color:"var(--faint)"}}>—</span>:(u==="$"?`$${s[k]}`:u==="%"?`${s[k]}%`:`${s[k]}${u}`)}</div>}</div>)}
      </div></Card>)}
    </div>
    <Card style={{marginTop:"16px"}}><CardHead title="Notes"/><div style={{padding:"16px"}}>{editing?<TI value={s.notes} onChange={v=>set(["notes"],v)} multi style={{width:"100%"}}/>:<p style={{fontSize:"13px",color:"var(--muted)",lineHeight:1.7}}>{s.notes}</p>}</div></Card>
    <SectionExtras cfg={data.page_config?.states||{}} onChange={v=>onChange(["page_config","states"],v)}/>
    <CommentsPanel comments={data.section_comments?.states} onChange={onComment} sectionLabel="States"/>
  </div>;
};

const Product = ({ data, editing, onEdit, onSave, onCancel, onChange, onComment }) => {
  const p=data.product; const set=(k,v)=>onChange(["product",k],v);
  const sColors={green:"var(--green)",amber:"var(--amber)",red:"var(--red)",black:"var(--faint)"};
  const sLabels={green:"On Track",amber:"At Risk",red:"Off Track",black:"TBD"};
  return <div className="fade-up">
    <SHead owner="Dario" title="Product" cadence="Weekly · Platform metrics + roadmap aligned with marketing" editing={editing} onEdit={onEdit} onSave={onSave} onCancel={onCancel}/>
    <div className="rg-3" style={{gap:"12px",marginBottom:"16px"}}>
      {[{lbl:"★ Platform Revenue MTD",main:editing?<NI value={p.platform_revenue_mtd} onChange={v=>set("platform_revenue_mtd",v)} prefix="$"/>:<div className="font-display" style={{fontSize:"32px",lineHeight:1}}>{p.platform_revenue_mtd===null?<span style={{color:"var(--faint)"}}>TBD</span>:fmtM(p.platform_revenue_mtd)}</div>,sub:null},{lbl:"★ Engagement",main:editing?<div style={{display:"flex",flexDirection:"column",gap:"6px"}}><NI value={p.engagement} onChange={v=>set("engagement",v)} suffix="%"/><div style={{fontSize:"12px",color:"var(--muted)"}}>WoW pp: <NI value={p.engagement_wow} onChange={v=>set("engagement_wow",v)}/></div></div>:<div className="font-display" style={{fontSize:"32px",lineHeight:1}}>{fmtPct(p.engagement)}</div>,sub:<div style={{fontSize:"12px",color:"var(--muted)",display:"flex",gap:"6px"}}><Dt delta={p.engagement_wow} suffix="pp"/> WoW · <Dt delta={p.engagement_target_delta} suffix="pp"/> vs Q2</div>},{lbl:"★ Activation",main:editing?<div style={{display:"flex",flexDirection:"column",gap:"6px"}}><NI value={p.activation} onChange={v=>set("activation",v)} suffix="%"/><div style={{fontSize:"12px",color:"var(--muted)"}}>WoW pp: <NI value={p.activation_wow} onChange={v=>set("activation_wow",v)}/></div></div>:<div className="font-display" style={{fontSize:"32px",lineHeight:1}}>{fmtPct(p.activation)}</div>,sub:<div style={{fontSize:"12px",color:"var(--muted)",display:"flex",gap:"6px"}}><Dt delta={p.activation_wow} suffix="pp"/> WoW · <Dt delta={p.activation_target_delta} suffix="pp"/> vs Q2</div>}].map((h,i)=>(
        <div key={i} style={{background:"linear-gradient(145deg,var(--card2),rgba(123,95,245,0.08))",border:"1px solid rgba(123,95,245,0.15)",borderRadius:"14px",padding:"20px"}}>
          <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"12px"}}>{h.lbl}</div>
          <div style={{marginBottom:"8px"}}>{h.main}</div>{h.sub}
        </div>
      ))}
    </div>
    <div className="rg-3" style={{gap:"12px",marginBottom:"16px"}}>
      {[["Revenue, Refund & Retention","revenue_refund_retention","Actual % | MoM pp / vs Q2 pp"],["Acquisition / Checkout","acquisition_checkout","Actual % | WoW pp / vs Q2 pp"],["Engagement & Transformation","engagement_transformation","Actual % | WoW pp / vs Q2 pp"]].map(([title,key,note])=>(
        <Card key={key}><CardHead title={title} sub={note}/><div style={{padding:"12px"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:"12px"}}><tbody>
          {p[key].map((r,i)=>{ const k1=r.mom!==undefined?"mom":"wow"; return <tr key={i} style={{borderBottom:"1px solid var(--border)"}} className="ai-row">
            <td style={{padding:"7px 8px",color:"var(--muted)",fontSize:"12px"}}>{r.metric}</td>
            <td style={{padding:"7px 6px",textAlign:"right",fontFamily:"'JetBrains Mono',monospace"}}>
              {editing?<NI value={r.actual} onChange={v=>{const n=[...p[key]];n[i]={...n[i],actual:v};set(key,n);}} suffix="%"/>:(r.actual===null?<span style={{color:"var(--faint)"}}>TBD</span>:fmtPct(r.actual))}
            </td>
            <td style={{padding:"7px 6px",textAlign:"right"}}>
              {editing
                ?<div style={{display:"flex",gap:"4px",alignItems:"center",justifyContent:"flex-end"}}>
                  <NI value={r[k1]} onChange={v=>{const n=[...p[key]];n[i]={...n[i],[k1]:v};set(key,n);}}/>
                  <span style={{color:"var(--faint)",fontSize:"10px"}}>/</span>
                  <NI value={r.vs_target} onChange={v=>{const n=[...p[key]];n[i]={...n[i],vs_target:v};set(key,n);}}/>
                </div>
                :<span style={{display:"flex",alignItems:"center",gap:"3px",justifyContent:"flex-end"}}><Dt delta={r[k1]} suffix="pp"/><span style={{color:"var(--faint)"}}>/</span><Dt delta={r.vs_target} suffix="pp"/></span>}
            </td>
          </tr>; })}
        </tbody></table></div></Card>
      ))}
    </div>
    <Card><CardHead title="Key Product Initiatives" action={editing&&<Btn variant="ghost" size="sm" onClick={()=>set("initiatives",[...p.initiatives,{name:"",status:"amber",note:"",timeline:"",obj:""}])}><Plus size={12}/>Add</Btn>}/>
      <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px"}}>
        <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["#","Initiative","Status","Note","Timeline","Objective"].map(h=><th key={h} style={{padding:"12px 14px",textAlign:h==="#"||h==="Initiative"||h==="Note"?"left":"center",fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--muted)"}}>{h}</th>)}</tr></thead>
        <tbody>{p.initiatives.map((it,i)=><tr key={i} style={{borderBottom:"1px solid var(--border)"}} className="ai-row">
          <td style={{padding:"14px",color:"var(--faint)",fontSize:"12px",fontFamily:"monospace",width:"28px"}}>{i+1}</td>
          <td style={{padding:"14px",fontWeight:500}}>{editing?<TI value={it.name} onChange={v=>{const n=[...p.initiatives];n[i]={...n[i],name:v};set("initiatives",n);}}/>:it.name}</td>
          <td style={{padding:"14px",textAlign:"center"}}>{editing?<select value={it.status} onChange={e=>{const n=[...p.initiatives];n[i]={...n[i],status:e.target.value};set("initiatives",n);}} style={{width:"120px"}}><option value="green">🟢 On Track</option><option value="amber">🟡 At Risk</option><option value="red">🔴 Off Track</option><option value="black">⚫ TBD</option></select>:<span style={{color:sColors[it.status],fontSize:"13px",fontWeight:600}}>{sLabels[it.status]}</span>}</td>
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

const statusStyle=(s)=>s==="Open"?{bg:"var(--red-bg)",color:"var(--red)"}:s==="In Progress"?{bg:"var(--amb-bg)",color:"var(--amber)"}:s==="Complete"?{bg:"var(--grn-bg)",color:"var(--green)"}:s==="Blocked"?{bg:"rgba(123,95,245,0.12)",color:"var(--purple2)"}:{bg:"rgba(127,127,127,0.1)",color:"var(--muted)"};
const prioStyle=(p)=>p==="Critical"?{bg:"var(--red-bg)",color:"var(--red)"}:p==="High"?{bg:"var(--amb-bg)",color:"var(--amber)"}:{bg:"rgba(127,127,127,0.08)",color:"var(--muted)"};
const StatusIcon=({s})=>s==="Complete"?<CircleCheck size={13}/>:s==="Blocked"?<Ban size={13}/>:s==="In Progress"?<Clock size={13}/>:<Circle size={13}/>;

// ─────────────────────────────────────────────────────────
// TRANSCRIPT → AI PARSER PANEL
// ─────────────────────────────────────────────────────────
const TranscriptPanel = ({ onImport }) => {
  const [open,setOpen]=useState(false);
  const [transcript,setTranscript]=useState("");
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState(null);
  const [preview,setPreview]=useState(null);

  const parse=async()=>{
    if(!transcript.trim()) return;
    setLoading(true); setError(null); setPreview(null);
    try {
      const res=await fetch("/api/parse-transcript",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({transcript})});
      const json=await res.json();
      if(!res.ok) throw new Error(json.error||"Parse failed");
      setPreview(json);
    } catch(e){ setError(e.message); }
    finally { setLoading(false); }
  };

  const confirmImport=()=>{
    if(!preview) return;
    onImport(preview.items||[],preview.decisions||[]);
    setPreview(null); setTranscript(""); setOpen(false);
  };

  return (
    <div style={{margin:"28px 0 4px",border:"1px solid var(--border)",borderRadius:"12px",overflow:"hidden",background:"var(--card)"}}>
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
          <div style={{fontSize:"10px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--gold)",marginBottom:"8px"}}>Paste transcript</div>
          <p style={{fontSize:"12px",color:"var(--muted)",marginBottom:"8px",lineHeight:1.6}}>Paste the raw meeting transcript below. The AI will extract action items (owner, priority, due date, OKR) and decisions required — then you can review before importing.</p>
          <textarea value={transcript} onChange={e=>setTranscript(e.target.value)} placeholder="Paste the full meeting transcript here…" rows={8} style={{width:"100%",resize:"vertical",lineHeight:1.7,fontSize:"13px"}}/>
        </div>
        {error&&<div style={{background:"var(--red-bg)",border:"1px solid rgba(212,44,69,0.2)",borderRadius:"8px",padding:"10px 14px",fontSize:"13px",color:"var(--red)"}}>{error}</div>}
        {!preview&&<Btn variant="primary" onClick={parse} disabled={loading||!transcript.trim()}>{loading?<><RotateCcw size={13} style={{animation:"spin 1s linear infinite"}}/>Analyzing…</>:<><Send size={13}/>Analyze with AI</>}</Btn>}
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
        <p style={{fontSize:"11px",color:"var(--faint)"}}>Requires ANTHROPIC_API_KEY in .env.local. Items are appended — existing register is not overwritten.</p>
      </div>}
    </div>
  );
};

const ActionItems = ({ data, editing, onEdit, onSave, onCancel, onChange, onComment }) => {
  const ai=data.action_items;
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
  const stats=[{n:ai.items.length,l:"Total Items",c:"var(--purple)"},{n:ai.items.filter(it=>it.priority==="Critical"&&it.status!=="Complete").length,l:"Critical Open",c:"var(--red)"},{n:ai.items.filter(it=>it.status==="Open").length,l:"Open",c:"var(--amber)"},{n:ai.items.filter(it=>it.status==="In Progress").length,l:"In Progress",c:"var(--amber)"},{n:ai.items.filter(it=>it.status==="Complete").length,l:"Complete",c:"var(--green)"}];
  const dColors=["var(--green)","var(--amber)","var(--red)","var(--purple)","var(--red)"];

  const ItemRow=({ it })=>{
    const ss=statusStyle(it.status); const ps=prioStyle(it.priority);
    const num=String(ai.items.findIndex(x=>x.id===it.id)+1).padStart(2,"0");
    const nc=it.priority==="Critical"?"var(--red)":it.priority==="High"?"var(--amber)":"var(--muted)";
    return <tr className="ai-row" style={{borderBottom:"1px solid var(--border)",borderLeft:it.flagged?"3px solid var(--red)":"3px solid transparent"}}>
      <td style={{padding:"12px 14px",fontFamily:"'JetBrains Mono',monospace",fontSize:"12px",fontWeight:700,color:nc,width:"36px"}}>{num}</td>
      <td style={{padding:"12px 14px",minWidth:"220px"}}>
        {editing
          ? <><div><input value={it.title} onChange={e=>updateItem(it.id,"title",e.target.value)} style={{fontWeight:600,fontSize:"13px",width:"100%",background:"transparent",border:"none",borderBottom:"1px solid transparent",borderRadius:"0",padding:"0 0 2px",color:"var(--text)"}} onFocus={e=>e.target.style.borderBottomColor="var(--purple)"} onBlur={e=>e.target.style.borderBottomColor="transparent"}/></div><div><input value={it.note} onChange={e=>updateItem(it.id,"note",e.target.value)} style={{fontSize:"11.5px",color:"var(--muted)",width:"100%",background:"transparent",border:"none",borderBottom:"1px solid transparent",borderRadius:"0",padding:"0 0 1px"}} onFocus={e=>e.target.style.borderBottomColor="var(--purple)"} onBlur={e=>e.target.style.borderBottomColor="transparent"}/></div></>
          : <><div style={{fontWeight:600,fontSize:"13px",color:"var(--text)",marginBottom:"2px"}}>{it.title}</div><div style={{fontSize:"11.5px",color:"var(--muted)",lineHeight:1.4}}>{it.note}</div></>}
      </td>
      <td style={{padding:"12px 10px",fontSize:"13px"}}>
        {editing ? <input value={it.owner} onChange={e=>updateItem(it.id,"owner",e.target.value)} style={{fontSize:"13px",width:"100%",background:"transparent",border:"none",padding:"0",color:"var(--text)"}}/> : <span style={{color:"var(--text)"}}>{it.owner}</span>}
      </td>
      <td style={{padding:"12px 10px",fontSize:"13px",color:"var(--muted)"}}>
        {editing ? <input value={it.supporting} onChange={e=>updateItem(it.id,"supporting",e.target.value)} style={{fontSize:"13px",width:"100%",background:"transparent",border:"none",padding:"0",color:"var(--muted)"}}/> : <span>{it.supporting}</span>}
      </td>
      <td style={{padding:"12px 10px"}}>
        {editing ? <input value={it.due} onChange={e=>updateItem(it.id,"due",e.target.value)} style={{fontSize:"13px",fontWeight:600,width:"80px",background:"transparent",border:"none",padding:"0",color:"var(--text)"}}/> : <span className="font-mono" style={{fontSize:"12px",fontWeight:600,color:"var(--text)"}}>{it.due}</span>}
      </td>
      <td style={{padding:"12px 10px"}}>
        {editing ? <select value={it.okr} onChange={e=>updateItem(it.id,"okr",e.target.value)} style={{fontSize:"11px",color:"var(--purple2)",fontWeight:600,background:"transparent",border:"none",padding:"0",cursor:"pointer",width:"130px"}}>{OKR_OPTIONS.map(o=><option key={o}>{o}</option>)}</select> : <span style={{fontSize:"11px",color:"var(--purple2)",fontWeight:600}}>{it.okr}</span>}
      </td>
      <td style={{padding:"12px 10px"}}>
        {/* Priority — always dropdown for quick re-classification */}
        <select value={it.priority} onChange={e=>updateItem(it.id,"priority",e.target.value)} style={{background:ps.bg,color:ps.color,border:"none",borderRadius:"20px",padding:"3px 8px",fontSize:"11px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{PRIORITY_OPTIONS.map(o=><option key={o}>{o}</option>)}</select>
      </td>
      <td style={{padding:"12px 10px"}}>
        {/* Status — always dropdown for quick updates during meeting */}
        <select value={it.status} onChange={e=>updateItem(it.id,"status",e.target.value)} style={{background:ss.bg,color:ss.color,border:"none",borderRadius:"20px",padding:"3px 8px",fontSize:"11px",fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>{STATUS_OPTIONS.map(o=><option key={o}>{o}</option>)}</select>
      </td>
      <td style={{padding:"12px 8px",width:"40px"}}>
        {editing&&(confirmDel===it.id
          ? <div style={{display:"flex",gap:"4px",alignItems:"center"}}><span style={{fontSize:"11px",color:"var(--red)",fontWeight:700,whiteSpace:"nowrap"}}>Sure?</span><button onClick={()=>deleteItem(it.id)} style={{background:"var(--red)",color:"#fff",border:"none",borderRadius:"4px",padding:"2px 7px",fontSize:"11px",fontWeight:700,cursor:"pointer"}}>Yes</button><button onClick={()=>setConfirmDel(null)} style={{background:"var(--border)",color:"var(--muted)",border:"none",borderRadius:"4px",padding:"2px 7px",fontSize:"11px",cursor:"pointer"}}>No</button></div>
          : <button onClick={()=>setConfirmDel(it.id)} style={{background:"none",border:"none",color:"var(--faint)",cursor:"pointer",padding:"4px",borderRadius:"4px",display:"flex",alignItems:"center"}}><Trash2 size={13}/></button>)}
      </td>
    </tr>;
  };

  return <div className="fade-up">
    <SHead owner="All" title="Action Item Register" cadence="Weekly · All BUs · Editable tracker" editing={editing} onEdit={onEdit} onSave={onSave} onCancel={onCancel}/>

    {/* PM Flag */}
    {ai.pm_flag_active&&<div style={{background:"var(--red-bg)",border:"1px solid rgba(212,44,69,0.2)",borderRadius:"10px",padding:"14px 18px",marginBottom:"20px",display:"flex",gap:"12px",alignItems:"flex-start"}}>
      <Flag size={15} style={{color:"var(--red)",flexShrink:0,marginTop:"2px"}}/>
      <div style={{flex:1}}><div style={{fontSize:"12px",fontWeight:700,color:"var(--red)",marginBottom:"4px",textTransform:"uppercase",letterSpacing:"0.06em"}}>PM Flag — Immediate Attention Required</div>
        {editing ? <input value={ai.pm_flag_text} onChange={e=>setAI("pm_flag_text",e.target.value)} style={{fontSize:"13px",color:"var(--muted)",background:"transparent",border:"none",padding:"0",width:"100%",lineHeight:1.6}}/> : <p style={{fontSize:"13px",color:"var(--muted)",lineHeight:1.6}}>{ai.pm_flag_text}</p>}
      </div>
      {editing&&<button onClick={()=>setAI("pm_flag_active",false)} style={{background:"none",border:"none",color:"var(--faint)",cursor:"pointer"}}><X size={14}/></button>}
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
        {ai.decisions.map((d,i)=>(
          <div key={d.id} style={{background:"var(--card)",border:"1px solid var(--border)",borderRadius:"10px",padding:"16px",borderTop:`3px solid ${dColors[i%dColors.length]}`}}>
            <div style={{fontSize:"10px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--muted)",marginBottom:"6px"}}>Decision {String(i+1).padStart(2,"0")}</div>
            {editing
              ? <><input value={d.title} onChange={e=>{const n=[...ai.decisions];n[i]={...n[i],title:e.target.value};setAI("decisions",n);}} style={{background:"transparent",border:"none",padding:"0 0 4px",borderBottom:`1px solid ${dColors[i%dColors.length]}`,color:dColors[i%dColors.length],fontWeight:700,fontSize:"14px",width:"100%",marginBottom:"8px"}}/><textarea value={d.body} onChange={e=>{const n=[...ai.decisions];n[i]={...n[i],body:e.target.value};setAI("decisions",n);}} rows={2} style={{fontSize:"12px",color:"var(--muted)",lineHeight:1.6,width:"100%",resize:"vertical",background:"transparent",border:"none",padding:"0"}}/></>
              : <><div style={{fontSize:"14px",fontWeight:700,color:dColors[i%dColors.length],marginBottom:"8px"}}>{d.title}</div><p style={{fontSize:"12px",color:"var(--muted)",lineHeight:1.6}}>{d.body}</p></>}
          </div>
        ))}
        {editing&&<button onClick={()=>setAI("decisions",[...ai.decisions,{id:uid(),title:"New decision needed",body:"Describe the decision and why it's blocked…"}])} style={{background:"transparent",border:"1.5px dashed var(--border)",borderRadius:"10px",padding:"16px",color:"var(--faint)",fontSize:"13px",cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:"8px"}}><Plus size={14}/>Add decision</button>}
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
          ? <Card><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px"}}>
              <thead><tr style={{borderBottom:"1px solid var(--border)"}}>{["#","Action Item","Owner","Supporting","Due","OKR","Priority","Status",""].map(h=><th key={h} style={{padding:"10px 14px",textAlign:"left",fontSize:"10px",fontWeight:700,letterSpacing:"0.08em",textTransform:"uppercase",color:"var(--muted)",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
              <tbody>{rows.map(it=><ItemRow key={it.id} it={it}/>)}</tbody>
            </table></div></Card>
          : <div style={{fontSize:"13px",color:"var(--faint)",fontStyle:"italic",padding:"12px 0"}}>No {prio.toLowerCase()} items match the current filter.</div>}
        {editing&&<button onClick={()=>addItem(prio)} style={{marginTop:"8px",padding:"6px 14px",background:"transparent",border:`1.5px dashed ${prio==="Critical"?"var(--red)":prio==="High"?"var(--amber)":"var(--border)"}`,borderRadius:"7px",color:prio==="Critical"?"var(--red)":prio==="High"?"var(--amber)":"var(--muted)",fontSize:"12px",fontWeight:600,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",gap:"6px"}}><Plus size={12}/>Add {prio} item</button>}
      </div>:null;
    })}

    {/* TRANSCRIPT → AI PARSER */}
    <TranscriptPanel onImport={(items,decisions)=>{
      if(items?.length) setAI("items",[...ai.items,...items.map(it=>({...it,id:(ai.next_id||100)+Math.floor(Math.random()*1000)}))]);
      if(decisions?.length) setAI("decisions",[...ai.decisions,...decisions]);
    }}/>

    <SectionExtras cfg={data.page_config?.action_items||{}} onChange={v=>onChange(["page_config","action_items"],v)}/>
    <CommentsPanel comments={data.section_comments?.action_items} onChange={onComment} sectionLabel="Action Items"/>
  </div>;
};

// ─────────────────────────────────────────────────────────
// SECTION: MEETING NOTES
// ─────────────────────────────────────────────────────────
const MeetingNotesSection = ({ data, onChange, onComment }) => (
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
const HistoryPanel=({ meetings, onLoad, onClose, onDelete })=>(
  <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.7)",zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:"32px"}}>
    <div onClick={e=>e.stopPropagation()} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"16px",maxWidth:"600px",width:"100%",maxHeight:"75vh",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"20px 24px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div><h2 className="font-display" style={{fontSize:"22px",color:"var(--text)"}}>Meeting Archive</h2><p style={{fontSize:"12px",color:"var(--muted)",marginTop:"2px"}}>{meetings.length} saved meeting{meetings.length!==1?"s":""}</p></div>
        <Btn variant="ghost" size="sm" onClick={onClose}><X size={15}/></Btn>
      </div>
      <div style={{overflowY:"auto",padding:"16px"}}>
        {meetings.length===0?<p style={{color:"var(--faint)",fontStyle:"italic",textAlign:"center",padding:"32px",fontSize:"14px"}}>No saved meetings yet.</p>
        :meetings.map(m=><div key={m.id} style={{border:"1px solid var(--border)",borderRadius:"10px",padding:"16px",marginBottom:"8px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"var(--card)"}}>
          <div><div className="font-display" style={{fontSize:"17px",marginBottom:"3px"}}>{m.label||fmtDate(m.date)}</div><div style={{fontSize:"12px",color:"var(--faint)"}}>{fmtDate(m.date)} · {new Date(m.savedAt).toLocaleString()}</div></div>
          <div style={{display:"flex",gap:"8px"}}><Btn variant="outline" size="sm" onClick={()=>onLoad(m.id)}>Open</Btn><Btn variant="danger" size="sm" onClick={()=>onDelete(m.id)}><Trash2 size={12}/></Btn></div>
        </div>)}
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────
// DATE SELECT SCREEN
// ─────────────────────────────────────────────────────────
const DateSelectScreen = ({ draftDate, meetings, onSelectDraft, onSelectPast }) => {
  const sorted=[...meetings].sort((a,b)=>b.date>a.date?1:-1);
  return (
    <div style={{position:"fixed",inset:0,zIndex:100,background:"var(--bg)",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px",overflowY:"auto"}}>
      <div style={{maxWidth:"480px",width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:"36px"}}>
          <div style={{width:"52px",height:"52px",borderRadius:"14px",background:"linear-gradient(135deg,var(--purple),var(--purple2))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"24px",fontWeight:700,color:"#fff",margin:"0 auto 16px"}}>M</div>
          <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"8px"}}>Mindvalley · Revenue Task Force</div>
          <h1 className="font-display" style={{fontSize:"34px",color:"var(--text)",lineHeight:1.1}}>Revenue Meeting</h1>
          <p style={{fontSize:"14px",color:"var(--muted)",marginTop:"10px"}}>Select a meeting week to open</p>
        </div>

        {/* Current draft */}
        <div onClick={onSelectDraft} style={{border:"1px solid rgba(123,95,245,0.4)",borderRadius:"12px",padding:"18px 22px",marginBottom:"10px",cursor:"pointer",background:"rgba(123,95,245,0.08)",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"border-color 0.15s"}}>
          <div>
            <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--gold)",marginBottom:"4px"}}>Current Draft</div>
            <div className="font-display" style={{fontSize:"22px",color:"var(--text)"}}>{fmtDate(draftDate)||"Next Tuesday"}</div>
            <div style={{fontSize:"12px",color:"var(--muted)",marginTop:"2px"}}>Continue editing this week's data</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <Pill label="Draft" variant="warn"/>
            <ArrowRight size={16} style={{color:"var(--purple2)"}}/>
          </div>
        </div>

        {/* Past meetings */}
        {sorted.length>0&&<>
          <div style={{fontSize:"10px",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",color:"var(--faint)",margin:"22px 0 10px"}}>Past Meetings</div>
          {sorted.map(m=>(
            <div key={m.id} onClick={()=>onSelectPast(m.id)} style={{border:"1px solid var(--border)",borderRadius:"12px",padding:"14px 22px",marginBottom:"8px",cursor:"pointer",background:"var(--card)",display:"flex",alignItems:"center",justifyContent:"space-between",transition:"border-color 0.15s"}}>
              <div>
                <div className="font-display" style={{fontSize:"20px",color:"var(--text)"}}>{fmtDate(m.date)}</div>
                <div style={{fontSize:"12px",color:"var(--faint)",marginTop:"2px"}}>{m.label||fmtDate(m.date)}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
                <Pill label="Finalized" variant="good"/>
                <ArrowRight size={16} style={{color:"var(--muted)"}}/>
              </div>
            </div>
          ))}
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
  const [isMobile,setIsMobile]=useState(false);
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const timer=useRef(null);
  const apiTimer=useRef(null);
  const dataRef=useRef(null); // always holds latest data — avoids stale closure in poll
  const localDirty=useRef(false); // true when local changes haven't been flushed to Airtable yet

  // Detect mobile viewport
  useEffect(()=>{
    const mq=window.matchMedia('(max-width:767px)');
    const h=e=>setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener('change',h);
    return ()=>mq.removeEventListener('change',h);
  },[]);

  // Init: hydrate from Airtable draft, fall back to localStorage, create if neither exists
  useEffect(()=>{(async()=>{
    const remote=await apiGet('/api/meetings?draft=1');
    if(remote && !remote.error){
      setData(hydrate(remote));
      setDraftRecordId(remote._recordId);
      lsSet('mv2:draft',remote);
    } else {
      const local=lsGet('mv2:draft');
      if(local){
        setData(hydrate(local));
      } else {
        // No draft anywhere — create a fresh one in Airtable
        const seed=mkSeed();
        const res=await apiPost('/api/meetings',{data:seed,status:'Draft'});
        if(res?.recordId) setDraftRecordId(res.recordId);
        setData(seed);
      }
    }
    const list=await apiGet('/api/meetings');
    if(Array.isArray(list)) setMeetings(list);
    setReady(true);
    setShowDateSelect(true); // always show date picker on load
  })();},[]);

  // Keep dataRef in sync so the polling closure always sees current data
  useEffect(()=>{ dataRef.current=data; },[data]);

  // Draft auto-save: localStorage at 900ms, Airtable at 15s (skip when viewing past)
  useEffect(()=>{
    if(!ready||viewingId!==null) return;
    localDirty.current=true; // mark unsaved local changes so poll won't overwrite them
    clearTimeout(timer.current);
    timer.current=setTimeout(()=>{
      lsSet('mv2:draft',data);
      clearTimeout(apiTimer.current);
      apiTimer.current=setTimeout(async()=>{
        if(draftRecordId){
          await apiPut(`/api/meetings/${draftRecordId}`,{data});
          localDirty.current=false; // Airtable is now in sync
        }
      },15000);
    },900);
  },[data,ready]);

  // 5-second poll for collaborative updates (skip when viewing past)
  useEffect(()=>{
    if(!ready||!draftRecordId||viewingId!==null) return;
    const interval=setInterval(async()=>{
      if(editingSec!==null||localDirty.current) return; // skip if user has unpushed changes
      const remote=await apiGet('/api/meetings?draft=1');
      if(remote&&!remote.error&&JSON.stringify(remote)!==JSON.stringify(dataRef.current)){
        setData(hydrate(remote));
        showFlash();
      }
    },5000);
    return ()=>clearInterval(interval);
  },[ready,draftRecordId,editingSec]);

  const updateData=(path,value)=>setData(prev=>{ const next=JSON.parse(JSON.stringify(prev)); let c=next; for(let i=0;i<path.length-1;i++) c=c[path[i]]; c[path[path.length-1]]=value; return next; });
  const startEdit=(id)=>{ setDraftBak(JSON.parse(JSON.stringify(data))); setEditingSec(id); };
  const saveEdit=()=>{ setEditingSec(null); setDraftBak(null); showFlash(); };
  const cancelEdit=()=>{ if(draftBak) setData(draftBak); setEditingSec(null); setDraftBak(null); };
  const showFlash=()=>{ setFlash(true); setTimeout(()=>setFlash(false),1800); };
  const handleComment=(sectionId,comments)=>updateData(["section_comments",sectionId],comments);

  const saveMeeting=async()=>{
    if(!draftRecordId) return;
    // Finalize the current draft record in Airtable
    await apiPut(`/api/meetings/${draftRecordId}`,{data:{...data,status:"finalized"},status:"Finalized"});
    // Create a blank Draft for next week
    const fresh=mkBlankSeed();
    const res=await apiPost('/api/meetings',{data:fresh,status:'Draft'});
    if(res?.recordId) setDraftRecordId(res.recordId);
    setData(fresh);
    lsDel('mv2:draft');
    const list=await apiGet('/api/meetings');
    if(Array.isArray(list)) setMeetings(list);
    showFlash();
  };
  const loadMeeting=async(id)=>{ const m=await apiGet(`/api/meetings/${id}`); if(m&&!m.error){setData(hydrate(m));setViewingId(id);setShowHistory(false);setActive("company_health");} };
  const deleteMeeting=async(id)=>{ await apiDel(`/api/meetings/${id}`); const list=await apiGet('/api/meetings'); if(Array.isArray(list)) setMeetings(list); };
  const exportData=()=>{ const b=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}); const u=URL.createObjectURL(b); const a=document.createElement("a"); a.href=u; a.download=`mv_performance_${data.meeting_date}.json`; a.click(); URL.revokeObjectURL(u); };
  const resetDraft=async()=>{ if(!confirm("Reset the current draft to a blank week?")) return; const f=mkBlankSeed(); if(draftRecordId) apiPut(`/api/meetings/${draftRecordId}`,{data:f}); lsDel('mv2:draft'); setData(f); };

  // Date change: update both date + label, auto-save handles the Airtable write
  const handleDateChange=(newDate)=>{
    if(viewingId) return;
    setData(prev=>({...prev,meeting_date:newDate,meeting_label:`Week of ${fmtDate(newDate)}`}));
  };

  // Return to the live draft from a past meeting view
  const returnToDraft=async()=>{
    const remote=await apiGet('/api/meetings?draft=1');
    setData(remote&&!remote.error?hydrate(remote):mkSeed());
    setViewingId(null);
    setActive("company_health");
  };

  // Date picker selection
  const selectFromDatePicker=async(id)=>{
    if(id==='draft'){
      setViewingId(null);
      setActive("company_health");
    } else {
      const m=await apiGet(`/api/meetings/${id}`);
      if(m&&!m.error){ setData(hydrate(m)); setViewingId(id); setActive("company_health"); }
    }
    setShowDateSelect(false);
  };

  // Week navigator: sorted finalized list + current draft at end
  const sortedMeetings=[...meetings].sort((a,b)=>a.date<b.date?-1:1);
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
          draftDate={data.meeting_date}
          meetings={meetings}
          onSelectDraft={()=>selectFromDatePicker('draft')}
          onSelectPast={selectFromDatePicker}
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
      <header style={{background:"var(--surface)",borderBottom:"1px solid var(--border)",padding:isMobile?"0 14px":"0 24px",height:"60px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:40,backdropFilter:"blur(8px)"}}>
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
          {!isMobile&&flash&&<span style={{fontSize:"12px",color:"var(--green)",fontWeight:600,display:"flex",alignItems:"center",gap:"4px"}}><Check size={12}/>Saved</span>}
          {!isMobile&&<button onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} title="Toggle light/dark" style={{background:"var(--card)",border:"1px solid var(--border)",color:"var(--text)",borderRadius:"8px",width:"34px",height:"34px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>{theme==="dark"?<Sun size={15}/>:<Moon size={15}/>}</button>}
          {!isMobile&&<Btn variant="ghost" size="sm" onClick={()=>setPresentMode(!presentMode)}>{presentMode?<EyeOff size={13}/>:<Presentation size={13}/>}{presentMode?"Exit":"Present"}</Btn>}
          {!isMobile&&<Btn variant="ghost" size="sm" onClick={()=>setShowHistory(true)}><History size={13}/>History ({meetings.length})</Btn>}
          {!isMobile&&<Btn variant="ghost" size="sm" onClick={exportData}><Download size={13}/>Export</Btn>}
          {!isMobile&&<Btn variant="ghost" size="sm" onClick={resetDraft}><RotateCcw size={13}/></Btn>}
          <Btn variant="gold" size="sm" onClick={saveMeeting}><Save size={13}/>{!isMobile&&"Save Meeting"}</Btn>
          {isMobile&&<button onClick={()=>setSidebarOpen(o=>!o)} style={{background:"var(--card)",border:"1px solid var(--border)",color:"var(--text)",borderRadius:"8px",width:"36px",height:"36px",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}><Menu size={17}/></button>}
        </div>
      </header>

      {/* MOBILE SIDEBAR DRAWER */}
      {isMobile&&sidebarOpen&&(
        <div onClick={()=>setSidebarOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",zIndex:200,display:"flex"}}>
          <aside onClick={e=>e.stopPropagation()} style={{width:"280px",background:"var(--surface)",borderRight:"1px solid var(--border)",display:"flex",flexDirection:"column",height:"100%",overflowY:"auto"}}>
            <div style={{padding:"14px 16px",borderBottom:"1px solid var(--border)",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:"13px",fontWeight:700,color:"var(--text)"}}>Sections</span>
              <button onClick={()=>setSidebarOpen(false)} style={{background:"none",border:"none",color:"var(--muted)",cursor:"pointer",display:"flex",alignItems:"center"}}><X size={18}/></button>
            </div>
            {viewingId&&<div style={{padding:"10px 14px",borderBottom:"1px solid var(--border)"}}><Btn variant="outline" size="sm" onClick={()=>{returnToDraft();setSidebarOpen(false);}}>← Back to Draft</Btn></div>}
            <nav style={{padding:"12px 10px",flex:1}}>
              {SECTIONS.map(s=>{
                const isActive=active===s.id;
                const cCount=s.id==="meeting_notes"?(data.section_comments?.meeting_notes?.length||0):(data.section_comments?.[s.id]?.length||0);
                return <button key={s.id} onClick={()=>{setActive(s.id);setSidebarOpen(false);}} style={{width:"100%",display:"flex",alignItems:"center",gap:"10px",padding:"10px 8px",borderRadius:"8px",textAlign:"left",cursor:"pointer",background:isActive?"rgba(123,95,245,0.15)":"transparent",border:isActive?"1px solid rgba(123,95,245,0.28)":"1px solid transparent",marginBottom:"2px",color:"var(--text)",fontFamily:"inherit",transition:"all 0.12s"}}>
                  <span style={{fontSize:"10px",fontWeight:700,color:isActive?"var(--gold)":"var(--faint)",fontFamily:"'JetBrains Mono',monospace",width:"22px",flexShrink:0}}>{s.num}</span>
                  <div style={{flex:1}}><div style={{fontSize:"13px",fontWeight:500,color:isActive?"var(--text)":"var(--muted)",lineHeight:1}}>{s.label}</div><div style={{fontSize:"10px",color:isActive?"var(--purple2)":"var(--faint)",marginTop:"2px"}}>{s.owner}</div></div>
                  {cCount>0&&<span style={{background:"rgba(123,95,245,0.2)",color:"var(--purple2)",fontSize:"10px",fontWeight:700,borderRadius:"10px",padding:"1px 6px"}}>{cCount}</span>}
                </button>;
              })}
            </nav>
            <div style={{padding:"12px 14px",borderTop:"1px solid var(--border)",display:"flex",flexDirection:"column",gap:"6px"}}>
              <button onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} style={{display:"flex",alignItems:"center",gap:"10px",background:"none",border:"1px solid var(--border)",borderRadius:"8px",padding:"10px 12px",color:"var(--text)",cursor:"pointer",fontFamily:"inherit",fontSize:"13px"}}>{theme==="dark"?<Sun size={15}/>:<Moon size={15}/>}<span>Toggle {theme==="dark"?"Light":"Dark"} mode</span></button>
              <button onClick={()=>{setShowHistory(true);setSidebarOpen(false);}} style={{display:"flex",alignItems:"center",gap:"10px",background:"none",border:"1px solid var(--border)",borderRadius:"8px",padding:"10px 12px",color:"var(--text)",cursor:"pointer",fontFamily:"inherit",fontSize:"13px"}}><History size={15}/><span>History ({meetings.length})</span></button>
              <button onClick={()=>{exportData();setSidebarOpen(false);}} style={{display:"flex",alignItems:"center",gap:"10px",background:"none",border:"1px solid var(--border)",borderRadius:"8px",padding:"10px 12px",color:"var(--text)",cursor:"pointer",fontFamily:"inherit",fontSize:"13px"}}><Download size={15}/><span>Export JSON</span></button>
              <button onClick={()=>{setPresentMode(!presentMode);setSidebarOpen(false);}} style={{display:"flex",alignItems:"center",gap:"10px",background:"none",border:"1px solid var(--border)",borderRadius:"8px",padding:"10px 12px",color:"var(--text)",cursor:"pointer",fontFamily:"inherit",fontSize:"13px"}}><Presentation size={15}/><span>Present mode</span></button>
              <button onClick={()=>{setSidebarOpen(false);resetDraft();}} style={{display:"flex",alignItems:"center",gap:"10px",background:"var(--red-bg)",border:"1px solid rgba(255,77,106,0.2)",borderRadius:"8px",padding:"10px 12px",color:"var(--red)",cursor:"pointer",fontFamily:"inherit",fontSize:"13px"}}><RotateCcw size={15}/><span>Reset to blank week</span></button>
            </div>
          </aside>
        </div>
      )}

      <div style={{display:"flex",flex:1}}>
        {/* SIDEBAR — desktop only */}
        {!presentMode&&!isMobile&&(
          <aside style={{width:"216px",background:"var(--surface)",borderRight:"1px solid var(--border)",minHeight:"calc(100vh - 60px)",position:"sticky",top:"60px",alignSelf:"flex-start",display:"flex",flexDirection:"column"}}>
            <div style={{position:"absolute",left:0,top:0,bottom:0,width:"3px",background:"linear-gradient(180deg,var(--purple),rgba(232,184,75,0.6),var(--purple))",borderRadius:"0 2px 2px 0"}}/>
            <nav style={{padding:"14px 12px",flex:1}}>
              <div style={{fontSize:"9px",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",color:"var(--faint)",padding:"0 6px 10px",display:"flex",alignItems:"center",gap:"6px"}}><Star size={9} style={{color:"var(--gold)"}}/>Sections</div>
              {SECTIONS.map(s=>{
                const isActive=active===s.id;
                const cCount=s.id==="meeting_notes"?(data.section_comments?.meeting_notes?.length||0):(data.section_comments?.[s.id]?.length||0);
                return <button key={s.id} onClick={()=>setActive(s.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:"10px",padding:"8px 8px",borderRadius:"8px",textAlign:"left",cursor:"pointer",background:isActive?"rgba(123,95,245,0.15)":"transparent",border:isActive?"1px solid rgba(123,95,245,0.28)":"1px solid transparent",marginBottom:"2px",color:"var(--text)",fontFamily:"inherit",transition:"all 0.12s"}}>
                  <span style={{fontSize:"10px",fontWeight:700,color:isActive?"var(--gold)":"var(--faint)",fontFamily:"'JetBrains Mono',monospace",width:"22px",flexShrink:0}}>{s.num}</span>
                  <div style={{flex:1}}><div style={{fontSize:"13px",fontWeight:500,color:isActive?"var(--text)":"var(--muted)",lineHeight:1}}>{s.label}</div><div style={{fontSize:"10px",color:isActive?"var(--purple2)":"var(--faint)",marginTop:"2px"}}>{s.owner}</div></div>
                  {cCount>0&&<span style={{background:"rgba(123,95,245,0.2)",color:"var(--purple2)",fontSize:"10px",fontWeight:700,borderRadius:"10px",padding:"1px 6px"}}>{cCount}</span>}
                </button>;
              })}
            </nav>
            <div style={{padding:"12px 16px",borderTop:"1px solid var(--border)",fontSize:"11px",color:"var(--faint)",lineHeight:1.7}}>
              <div style={{fontWeight:700,color:"var(--muted)",marginBottom:"4px",textTransform:"uppercase",fontSize:"9px",letterSpacing:"0.1em"}}>How it works</div>
              Click <span style={{color:"var(--purple2)"}}>Edit numbers</span> on your section. Upload images, add headers, post notes. <span style={{color:"var(--gold)"}}>Save Meeting</span> archives the week.
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
            onComment={(c)=>{ if(active==="meeting_notes"){ updateData(["section_comments","meeting_notes"],c); } else { handleComment(active,c); } }}
          />}

          {presentMode&&<div style={{display:"flex",justifyContent:"space-between",marginTop:"32px"}}>
            <Btn variant="ghost" onClick={()=>{ const i=SECTIONS.findIndex(s=>s.id===active); if(i>0) setActive(SECTIONS[i-1].id); }}>← Previous</Btn>
            <Btn variant="primary" onClick={()=>{ const i=SECTIONS.findIndex(s=>s.id===active); if(i<SECTIONS.length-1) setActive(SECTIONS[i+1].id); }}>Next →</Btn>
          </div>}
        </main>
      </div>

      {showHistory&&<HistoryPanel meetings={meetings} onLoad={loadMeeting} onClose={()=>setShowHistory(false)} onDelete={deleteMeeting}/>}
    </div>
  );
}
