'use strict';

/**
 * Mock ERP Data — in-memory mutable store (append / edit / delete at runtime).
 * Aligned to fact_financial_data.csv OpEx variance scenarios.
 */

let headcountEvents = [
  { event_id:'HC-2024-001', dept_id:'DEPT-NA-SALES',    event_type:'new_hire',   role:'Enterprise Account Executive',    effective_date:'2023-12-01', monthly_cost:8500,  period_first_impact:'2024-01', budget_included:false, notes:'Hire approved via headcount exception — not in original budget. Added to Feb re-forecast.' },
  { event_id:'HC-2024-002', dept_id:'DEPT-PROF-SVC',    event_type:'new_hire',   role:'Cloud Solutions Architect',       effective_date:'2024-01-15', monthly_cost:12000, period_first_impact:'2024-02', budget_included:false, notes:'Backfill for attrition — replacement hire approved but budget line unfilled until Q2.' },
  { event_id:'HC-2024-003', dept_id:'DEPT-PROD-ENG',    event_type:'new_hire',   role:'Senior Software Engineer',        effective_date:'2024-02-01', monthly_cost:11500, period_first_impact:'2024-02', budget_included:true,  notes:'Planned hire — within approved headcount budget.' },
  { event_id:'HC-2024-004', dept_id:'DEPT-MARKETING',   event_type:'contractor', role:'Content Marketing Specialist',    effective_date:'2024-05-01', monthly_cost:6500,  period_first_impact:'2024-05', budget_included:false, notes:'Contract to support v3.0 launch campaign. Approved by CMO outside original headcount plan.' },
  { event_id:'HC-2025-001', dept_id:'DEPT-PROD-ENG',    event_type:'contractor', role:'ML Platform Engineer (Contract)', effective_date:'2025-02-01', monthly_cost:18000, period_first_impact:'2025-03', budget_included:false, notes:'Contract approved to accelerate AI/ML platform delivery for H1 2025 product launch.' },
  { event_id:'HC-2025-002', dept_id:'DEPT-CLOUD-OPS',   event_type:'new_hire',   role:'Site Reliability Engineer',       effective_date:'2025-01-01', monthly_cost:13500, period_first_impact:'2025-01', budget_included:true,  notes:'Planned hire for reliability programme — fully budgeted.' },
  // 2026 headcount
  { event_id:'HC-2026-001', dept_id:'DEPT-NA-SALES',    event_type:'new_hire',   role:'Field Sales Representative',      effective_date:'2025-12-01', monthly_cost:9200,  period_first_impact:'2026-01', budget_included:false, notes:'Hire approved via headcount exception in Dec 2025 to expand NA territory. Not in original 2026 budget — added to Q1 re-forecast.' },
  { event_id:'HC-2026-002', dept_id:'DEPT-PROD-ENG',    event_type:'contractor', role:'AI Platform Engineer (Contract)', effective_date:'2026-01-15', monthly_cost:21000, period_first_impact:'2026-02', budget_included:false, notes:'Contract extended for AI/ML platform Phase 2. Board approved out-of-cycle headcount addition.' },
  { event_id:'HC-2026-003', dept_id:'DEPT-APAC-SALES',  event_type:'new_hire',   role:'Solutions Engineer APAC',         effective_date:'2026-02-01', monthly_cost:11500, period_first_impact:'2026-02', budget_included:true,  notes:'Planned hire for APAC expansion — within approved headcount plan.' },
];

let purchaseOrders = [
  { po_id:'PO-2024-0142', dept_id:'DEPT-NA-SALES',    vendor:'TechWorld Events LLC',    category:'Events & Conferences',   account_id:'OPEX-001', amount:18000,  po_date:'2024-01-09', period:'2024-01', budget_line:'Marketing Programs',     is_budgeted:false, approval_status:'approved', approver:'VP Sales',     notes:'Reactive participation in TechWorld Summit after competitor announced major sponsorship. Approved as competitive response.' },
  { po_id:'PO-2024-0187', dept_id:'DEPT-PROF-SVC',    vendor:'CloudSkills Consulting',  category:'External Contractors',   account_id:'COGS-001', amount:32000,  po_date:'2024-01-05', period:'2024-01', budget_line:'Cost of Goods Sold',      is_budgeted:false, approval_status:'approved', approver:'VP Services',  notes:'Premium rate contractors ($185/hr vs $140/hr budgeted) due to cloud migration skill shortage. Required to meet January delivery commitments.' },
  { po_id:'PO-2024-0198', dept_id:'DEPT-PROD-ENG',    vendor:'AWS',                     category:'Cloud Infrastructure',   account_id:'OPEX-002', amount:18000,  po_date:'2024-01-31', period:'2024-01', budget_line:'Research & Development',  is_budgeted:false, approval_status:'approved', approver:'CTO',          notes:'User growth 15% above January forecast drove higher EC2/RDS consumption. Usage-based cost, no upfront commitment.' },
  { po_id:'PO-2024-0215', dept_id:'DEPT-IT',          vendor:'AWS',                     category:'Cloud Infrastructure',   account_id:'OPEX-007', amount:9500,   po_date:'2024-01-18', period:'2024-01', budget_line:'IT Infrastructure',       is_budgeted:false, approval_status:'approved', approver:'CTO',          notes:'Emergency security patch deployment required additional EC2 instances. Critical vulnerability CVE-2024-0123.' },
  { po_id:'PO-2024-0301', dept_id:'DEPT-FINANCE',     vendor:'Deloitte',                category:'Professional Fees',      account_id:'OPEX-008', amount:13000,  po_date:'2024-03-05', period:'2024-03', budget_line:'Professional Fees',       is_budgeted:false, approval_status:'approved', approver:'CFO',          notes:'Unplanned SOX compliance review requested by Audit Committee following new board member appointment.' },
  { po_id:'PO-2024-0388', dept_id:'DEPT-MARKETING',   vendor:'Digital Spark Agency',    category:'Digital Marketing',      account_id:'OPEX-005', amount:23000,  po_date:'2024-05-08', period:'2024-05', budget_line:'Marketing Programs',      is_budgeted:false, approval_status:'approved', approver:'CMO',          notes:'Additional digital spend for product v3.0 launch campaign. Approved via CMO discretionary budget.' },
  { po_id:'PO-2024-0410', dept_id:'DEPT-CUST-SUC',    vendor:'Salesforce',              category:'SaaS Tools',             account_id:'OPEX-003', amount:7200,   po_date:'2024-04-01', period:'2024-04', budget_line:'General & Administrative', is_budgeted:true,  approval_status:'approved', approver:'VP CS',        notes:'Annual Salesforce renewal — within budget.' },
  { po_id:'PO-2025-0311', dept_id:'DEPT-PROD-ENG',    vendor:'NVIDIA Cloud',            category:'GPU Compute',            account_id:'OPEX-002', amount:27000,  po_date:'2025-03-01', period:'2025-03', budget_line:'Research & Development',  is_budgeted:false, approval_status:'approved', approver:'CTO',          notes:'GPU compute for AI/ML model training — accelerated to meet H1 2025 launch. Budget impact in Q2 re-forecast.' },
  { po_id:'PO-2025-0089', dept_id:'DEPT-HR',          vendor:'LinkedIn Talent',         category:'Recruiting',             account_id:'OPEX-003', amount:5500,   po_date:'2025-01-15', period:'2025-01', budget_line:'General & Administrative', is_budgeted:true,  approval_status:'approved', approver:'VP HR',        notes:'Planned recruiting platform fee — budgeted.' },
  { po_id:'PO-2025-0210', dept_id:'DEPT-CLOUD-OPS',   vendor:'Datadog',                 category:'Monitoring & Observability', account_id:'OPEX-007', amount:11000, po_date:'2025-02-10', period:'2025-02', budget_line:'IT Infrastructure', is_budgeted:false, approval_status:'pending',  approver:'CTO',          notes:'Expanded monitoring coverage for new microservices platform. Pending approval.' },
  // 2026 POs
  { po_id:'PO-2026-0101', dept_id:'DEPT-NA-SALES',    vendor:'Hannover Messe GmbH',     category:'Events & Conferences',   account_id:'OPEX-001', amount:18000,  po_date:'2026-01-12', period:'2026-01', budget_line:'Sales & Distribution',    is_budgeted:false, approval_status:'approved', approver:'VP Sales',     notes:'Late-approved sponsorship for Hannover Messe Industrial Automation 2026. Competitive necessity — three key accounts attending. Approved outside original Q1 plan.' },
  { po_id:'PO-2026-0102', dept_id:'DEPT-NA-SALES',    vendor:'SteelCore Supply Co',     category:'Raw Materials',          account_id:'COGS-001', amount:23000,  po_date:'2026-01-08', period:'2026-01', budget_line:'Cost of Goods Sold',      is_budgeted:false, approval_status:'approved', approver:'VP Operations',notes:'EU tariff change (Regulation 2026/114) effective Jan 1 increased steel plate import duty by 14%. Incremental cost $23K vs budget. Procurement reviewing alternative suppliers in Mexico and South Korea — expect normalisation by Q2.' },
  { po_id:'PO-2026-0103', dept_id:'DEPT-NA-SALES',    vendor:'Digital Forge Agency',    category:'Digital Marketing',      account_id:'OPEX-005', amount:7000,   po_date:'2026-01-15', period:'2026-01', budget_line:'Marketing Programs',      is_budgeted:false, approval_status:'approved', approver:'CMO',          notes:'Digital campaign overspend to support Q1 manufacturing pipeline generation amid revenue softness. Additional paid search and LinkedIn ABM spend.' },
  { po_id:'PO-2026-0201', dept_id:'DEPT-NA-SALES',    vendor:'SteelCore Supply Co',     category:'Raw Materials',          account_id:'COGS-001', amount:24000,  po_date:'2026-02-06', period:'2026-02', budget_line:'Cost of Goods Sold',      is_budgeted:false, approval_status:'approved', approver:'VP Operations',notes:'Steel tariff impact continues into February. Alternative supplier qualification underway — SteelMex SA trial order placed. Expect rate reduction by April.' },
  { po_id:'PO-2026-0301', dept_id:'DEPT-NA-SALES',    vendor:'AWS',                     category:'Cloud Infrastructure',   account_id:'OPEX-002', amount:13000,  po_date:'2026-03-01', period:'2026-03', budget_line:'Research & Development',  is_budgeted:false, approval_status:'approved', approver:'CTO',          notes:'AI platform compute scale-up for March product milestone. Additional EC2 GPU instances for model inference testing.' },
];

const costBenchmarks = {
  'cloud-migration-engineer':  { budgeted_rate:140, market_rate_jan2024:185, variance_pct:32 },
  'ml-platform-engineer':      { budgeted_rate:160, market_rate_mar2025:210, variance_pct:31 },
  'aws-ec2-baseline':          { budgeted_monthly:42000, note:'Based on H2 2023 actuals + 5% growth assumption' },
  'gpu-compute-hourly':        { budgeted_rate:2.50, market_rate_2025:3.80, variance_pct:52 },
};

let _hcNext = 100;
let _poNext  = 9000;
function nextHcId() { return `HC-CUSTOM-${String(++_hcNext).padStart(3,'0')}`; }
function nextPoId() { return `PO-CUSTOM-${String(++_poNext).padStart(4,'0')}`; }

module.exports = {
  get headcountEvents(){ return headcountEvents; }, set headcountEvents(v){ headcountEvents=v; },
  get purchaseOrders(){  return purchaseOrders;  }, set purchaseOrders(v){  purchaseOrders=v;  },
  costBenchmarks, nextHcId, nextPoId,
};
