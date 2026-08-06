'use strict';

/**
 * Mock CRM Data — in-memory mutable store (append / edit / delete at runtime).
 * Aligned to fact_financial_data.csv variance scenarios.
 */

let deals = [
  { deal_id:'CRM-2024-001', account_name:'Acme Corp',           account_region:'North America', dept_id:'DEPT-NA-SALES',    owner:'Sarah Johnson',   stage:'Closed Won',      arr_value:120000, scheduled_close:'2024-01-31', actual_close:'2024-02-22', slip_reason:'Customer procurement delayed — legal vendor approval', slip_date:'2024-01-18', rescheduled_close:'2024-02-28', probability:100, account_id:'REV-001', period_impacted:'2024-01', period_recovered:'2024-02', status:'slipped',     classification:'timing' },
  { deal_id:'CRM-2024-002', account_name:'TechStart Inc',        account_region:'North America', dept_id:'DEPT-NA-SALES',    owner:'Sarah Johnson',   stage:'Negotiation',     arr_value:80000,  scheduled_close:'2024-01-31', actual_close:null,          slip_reason:'CFO change triggered internal budget freeze',          slip_date:'2024-01-22', rescheduled_close:'2024-02-15', probability:70,  account_id:'REV-001', period_impacted:'2024-01', period_recovered:'2024-02', status:'slipped',     classification:'timing' },
  { deal_id:'CRM-2024-003', account_name:'GlobalTech GmbH',      account_region:'Europe',        dept_id:'DEPT-EMEA-SALES',  owner:'Michael Schmidt', stage:'Closed Won',      arr_value:45000,  scheduled_close:'2024-02-15', actual_close:'2024-01-28', slip_reason:null, slip_date:null, rescheduled_close:null,         probability:100, account_id:'REV-001', period_impacted:'2024-01', period_recovered:null,      status:'early_close', classification:'favorable' },
  { deal_id:'CRM-2024-004', account_name:'Acme Corp',            account_region:'North America', dept_id:'DEPT-NA-SALES',    owner:'Sarah Johnson',   stage:'Closed Won',      arr_value:120000, scheduled_close:'2024-02-28', actual_close:'2024-02-22', slip_reason:null, slip_date:null, rescheduled_close:null,         probability:100, account_id:'REV-001', period_impacted:'2024-02', period_recovered:null,      status:'closed',      classification:'recovery' },
  { deal_id:'CRM-2024-010', account_name:'Sino-Digital Ltd',     account_region:'Asia Pacific',  dept_id:'DEPT-APAC-SALES',  owner:'Li Wei',          stage:'Pending Approval',arr_value:90000,  scheduled_close:'2024-03-31', actual_close:null,          slip_reason:'China MoC regulatory review — 60-day mandatory period', slip_date:'2024-03-10', rescheduled_close:'2024-04-30', probability:80,  account_id:'REV-001', period_impacted:'2024-03', period_recovered:'2024-04', status:'slipped',     classification:'external_regulatory' },
  { deal_id:'CRM-2024-011', account_name:'NipponSoft KK',        account_region:'Asia Pacific',  dept_id:'DEPT-APAC-SALES',  owner:'Li Wei',          stage:'Proposal Sent',   arr_value:62000,  scheduled_close:'2024-04-15', actual_close:null,          slip_reason:null, slip_date:null, rescheduled_close:null,         probability:60,  account_id:'REV-002', period_impacted:'2024-04', period_recovered:null,      status:'open',        classification:'on_track' },
  { deal_id:'CRM-2024-020', account_name:'BritFinance PLC',      account_region:'Europe',        dept_id:'DEPT-EMEA-SALES',  owner:'Michael Schmidt', stage:'Discovery',       arr_value:55000,  scheduled_close:'2024-05-31', actual_close:null,          slip_reason:'UK election uncertainty — customer paused discretionary spend', slip_date:'2024-05-02', rescheduled_close:'2024-07-31', probability:40,  account_id:'REV-001', period_impacted:'2024-05', period_recovered:null,      status:'at_risk',     classification:'market_conditions' },
  { deal_id:'CRM-2024-030', account_name:'Rodrigues Fintech SA', account_region:'Latin America', dept_id:'DEPT-LATAM-SALES', owner:'Carlos Rodriguez',stage:'Contract Review',  arr_value:38000,  scheduled_close:'2024-06-30', actual_close:null,          slip_reason:null, slip_date:null, rescheduled_close:null,         probability:75,  account_id:'REV-003', period_impacted:'2024-06', period_recovered:null,      status:'open',        classification:'on_track' },
  { deal_id:'CRM-2025-001', account_name:'NovaCorp USA',         account_region:'North America', dept_id:'DEPT-NA-SALES',    owner:'Sarah Johnson',   stage:'Closed Won',      arr_value:210000, scheduled_close:'2025-01-31', actual_close:'2025-01-29', slip_reason:null, slip_date:null, rescheduled_close:null,         probability:100, account_id:'REV-001', period_impacted:'2025-01', period_recovered:null,      status:'closed',      classification:'on_track' },
  { deal_id:'CRM-2025-002', account_name:'EuroPay AG',           account_region:'Europe',        dept_id:'DEPT-EMEA-SALES',  owner:'Michael Schmidt', stage:'Negotiation',     arr_value:95000,  scheduled_close:'2025-02-28', actual_close:null,          slip_reason:'Procurement freeze during EuroPay M&A activity', slip_date:'2025-02-10', rescheduled_close:'2025-03-31', probability:65,  account_id:'REV-001', period_impacted:'2025-02', period_recovered:'2025-03', status:'slipped',     classification:'timing' },
  // 2026 deals
  { deal_id:'CRM-2026-001', account_name:'Acme Corp',            account_region:'North America', dept_id:'DEPT-NA-SALES',    owner:'Sarah Johnson',   stage:'Negotiation',     arr_value:120000, scheduled_close:'2026-01-31', actual_close:null,          slip_reason:'Procurement approval delayed — new vendor onboarding process at Acme expanded to 6 weeks', slip_date:'2026-01-20', rescheduled_close:'2026-02-28', probability:90,  account_id:'REV-001', period_impacted:'2026-01', period_recovered:'2026-02', status:'slipped',     classification:'timing' },
  { deal_id:'CRM-2026-002', account_name:'TechStart Inc',        account_region:'North America', dept_id:'DEPT-NA-SALES',    owner:'Sarah Johnson',   stage:'Contract Review', arr_value:80000,  scheduled_close:'2026-01-31', actual_close:null,          slip_reason:'Customer capital freeze — CFO imposed Q1 discretionary spend hold pending board review', slip_date:'2026-01-22', rescheduled_close:'2026-02-15', probability:75,  account_id:'REV-001', period_impacted:'2026-01', period_recovered:'2026-02', status:'slipped',     classification:'timing' },
  { deal_id:'CRM-2026-003', account_name:'GlobalTech GmbH',      account_region:'Europe',        dept_id:'DEPT-EMEA-SALES',  owner:'Michael Schmidt', stage:'Closed Won',      arr_value:42000,  scheduled_close:'2026-02-10', actual_close:'2026-01-19', slip_reason:null, slip_date:null, rescheduled_close:null,         probability:100, account_id:'REV-001', period_impacted:'2026-01', period_recovered:null,      status:'early_close', classification:'favorable' },
  { deal_id:'CRM-2026-004', account_name:'Acme Corp',            account_region:'North America', dept_id:'DEPT-NA-SALES',    owner:'Sarah Johnson',   stage:'Closed Won',      arr_value:120000, scheduled_close:'2026-02-28', actual_close:'2026-02-18', slip_reason:null, slip_date:null, rescheduled_close:null,         probability:100, account_id:'REV-001', period_impacted:'2026-02', period_recovered:null,      status:'closed',      classification:'recovery' },
  { deal_id:'CRM-2026-005', account_name:'TechStart Inc',        account_region:'North America', dept_id:'DEPT-NA-SALES',    owner:'Sarah Johnson',   stage:'Closed Won',      arr_value:80000,  scheduled_close:'2026-02-28', actual_close:'2026-02-20', slip_reason:null, slip_date:null, rescheduled_close:null,         probability:100, account_id:'REV-001', period_impacted:'2026-02', period_recovered:null,      status:'closed',      classification:'recovery' },
  { deal_id:'CRM-2026-006', account_name:'SinoMfg Holdings',     account_region:'Asia Pacific',  dept_id:'DEPT-APAC-SALES',  owner:'Li Wei',          stage:'Pending Approval',arr_value:90000,  scheduled_close:'2026-03-31', actual_close:null,          slip_reason:'China Type-A product certification renewal — mandatory 60-day regulatory review period', slip_date:'2026-03-08', rescheduled_close:'2026-05-15', probability:80,  account_id:'REV-001', period_impacted:'2026-03', period_recovered:'2026-05', status:'slipped',     classification:'external_regulatory' },
  { deal_id:'CRM-2026-007', account_name:'NovaBuild SA',         account_region:'Latin America', dept_id:'DEPT-LATAM-SALES', owner:'Carlos Rodriguez',stage:'Contract Review',  arr_value:32000,  scheduled_close:'2026-01-31', actual_close:'2026-01-29', slip_reason:null, slip_date:null, rescheduled_close:null,         probability:100, account_id:'REV-001', period_impacted:'2026-01', period_recovered:null,      status:'closed',      classification:'on_track' },
];

let pipelineSummary = {
  'DEPT-NA-SALES': {
    '2024-01': { open_pipeline:850000,  slipped:200000, at_risk:0,      on_track:650000,  early_close:0,     deal_count:8,  coverage_ratio:1.7, quota:500000 },
    '2024-02': { open_pipeline:940000,  slipped:0,      at_risk:50000,  on_track:890000,  early_close:120000,deal_count:9,  coverage_ratio:1.8, quota:520000 },
    '2024-03': { open_pipeline:780000,  slipped:0,      at_risk:80000,  on_track:700000,  early_close:0,     deal_count:7,  coverage_ratio:1.4, quota:560000 },
    '2024-04': { open_pipeline:820000,  slipped:40000,  at_risk:60000,  on_track:720000,  early_close:0,     deal_count:8,  coverage_ratio:1.5, quota:550000 },
    '2024-05': { open_pipeline:760000,  slipped:0,      at_risk:30000,  on_track:730000,  early_close:0,     deal_count:7,  coverage_ratio:1.4, quota:540000 },
    '2024-06': { open_pipeline:900000,  slipped:0,      at_risk:0,      on_track:900000,  early_close:50000, deal_count:9,  coverage_ratio:1.6, quota:560000 },
    '2025-01': { open_pipeline:1100000, slipped:0,      at_risk:60000,  on_track:1040000, early_close:210000,deal_count:11, coverage_ratio:1.9, quota:580000 },
    '2025-02': { open_pipeline:950000,  slipped:95000,  at_risk:100000, on_track:755000,  early_close:0,     deal_count:10, coverage_ratio:1.6, quota:595000 },
    '2025-03': { open_pipeline:870000,  slipped:0,      at_risk:70000,  on_track:800000,  early_close:0,     deal_count:9,  coverage_ratio:1.5, quota:580000 },
  },
  'DEPT-EMEA-SALES': {
    '2024-01': { open_pipeline:520000,  slipped:0,      at_risk:0,      on_track:520000,  early_close:45000, deal_count:6,  coverage_ratio:1.4, quota:370000 },
    '2024-02': { open_pipeline:480000,  slipped:0,      at_risk:30000,  on_track:450000,  early_close:0,     deal_count:5,  coverage_ratio:1.3, quota:375000 },
    '2024-03': { open_pipeline:560000,  slipped:0,      at_risk:0,      on_track:560000,  early_close:0,     deal_count:6,  coverage_ratio:1.5, quota:375000 },
    '2024-04': { open_pipeline:510000,  slipped:0,      at_risk:20000,  on_track:490000,  early_close:0,     deal_count:5,  coverage_ratio:1.3, quota:390000 },
    '2024-05': { open_pipeline:430000,  slipped:55000,  at_risk:80000,  on_track:295000,  early_close:0,     deal_count:5,  coverage_ratio:1.0, quota:420000 },
    '2024-06': { open_pipeline:490000,  slipped:0,      at_risk:40000,  on_track:450000,  early_close:0,     deal_count:5,  coverage_ratio:1.2, quota:410000 },
    '2025-01': { open_pipeline:620000,  slipped:0,      at_risk:0,      on_track:620000,  early_close:80000, deal_count:7,  coverage_ratio:1.6, quota:390000 },
    '2025-02': { open_pipeline:410000,  slipped:95000,  at_risk:0,      on_track:315000,  early_close:0,     deal_count:5,  coverage_ratio:1.1, quota:400000 },
    '2025-03': { open_pipeline:540000,  slipped:0,      at_risk:50000,  on_track:490000,  early_close:0,     deal_count:6,  coverage_ratio:1.3, quota:415000 },
  },
  'DEPT-APAC-SALES': {
    '2024-01': { open_pipeline:290000,  slipped:0,      at_risk:0,      on_track:290000,  early_close:0,     deal_count:4,  coverage_ratio:1.2, quota:240000 },
    '2024-02': { open_pipeline:340000,  slipped:0,      at_risk:20000,  on_track:320000,  early_close:0,     deal_count:4,  coverage_ratio:1.3, quota:260000 },
    '2024-03': { open_pipeline:380000,  slipped:90000,  at_risk:0,      on_track:290000,  early_close:0,     deal_count:4,  coverage_ratio:1.0, quota:280000 },
    '2024-04': { open_pipeline:490000,  slipped:0,      at_risk:0,      on_track:490000,  early_close:0,     deal_count:5,  coverage_ratio:1.6, quota:305000 },
    '2024-05': { open_pipeline:420000,  slipped:0,      at_risk:30000,  on_track:390000,  early_close:0,     deal_count:5,  coverage_ratio:1.4, quota:300000 },
    '2024-06': { open_pipeline:360000,  slipped:0,      at_risk:0,      on_track:360000,  early_close:30000, deal_count:4,  coverage_ratio:1.2, quota:300000 },
    '2025-01': { open_pipeline:530000,  slipped:0,      at_risk:40000,  on_track:490000,  early_close:0,     deal_count:6,  coverage_ratio:1.6, quota:330000 },
    '2025-02': { open_pipeline:320000,  slipped:80000,  at_risk:40000,  on_track:200000,  early_close:0,     deal_count:4,  coverage_ratio:0.9, quota:355000 },
    '2025-03': { open_pipeline:480000,  slipped:0,      at_risk:60000,  on_track:420000,  early_close:0,     deal_count:5,  coverage_ratio:1.4, quota:345000 },
  },
  'DEPT-LATAM-SALES': {
    '2024-01': { open_pipeline:140000,  slipped:0,      at_risk:0,      on_track:140000,  early_close:0,     deal_count:2,  coverage_ratio:1.1, quota:125000 },
    '2024-02': { open_pipeline:160000,  slipped:0,      at_risk:15000,  on_track:145000,  early_close:0,     deal_count:2,  coverage_ratio:1.2, quota:130000 },
    '2024-03': { open_pipeline:175000,  slipped:0,      at_risk:0,      on_track:175000,  early_close:0,     deal_count:2,  coverage_ratio:1.3, quota:135000 },
    '2024-04': { open_pipeline:190000,  slipped:20000,  at_risk:0,      on_track:170000,  early_close:0,     deal_count:3,  coverage_ratio:1.3, quota:145000 },
    '2024-05': { open_pipeline:200000,  slipped:0,      at_risk:25000,  on_track:175000,  early_close:0,     deal_count:3,  coverage_ratio:1.3, quota:150000 },
    '2024-06': { open_pipeline:210000,  slipped:0,      at_risk:20000,  on_track:190000,  early_close:0,     deal_count:3,  coverage_ratio:1.3, quota:160000 },
    '2025-01': { open_pipeline:260000,  slipped:0,      at_risk:0,      on_track:260000,  early_close:0,     deal_count:3,  coverage_ratio:1.5, quota:175000 },
    '2025-02': { open_pipeline:240000,  slipped:30000,  at_risk:20000,  on_track:190000,  early_close:0,     deal_count:3,  coverage_ratio:1.3, quota:185000 },
    '2025-03': { open_pipeline:280000,  slipped:0,      at_risk:30000,  on_track:250000,  early_close:0,     deal_count:3,  coverage_ratio:1.4, quota:200000 },
    '2026-01': { open_pipeline:280000,  slipped:0,      at_risk:0,      on_track:280000,  early_close:32000, deal_count:3,  coverage_ratio:1.6, quota:175000 },
    '2026-02': { open_pipeline:295000,  slipped:0,      at_risk:20000,  on_track:275000,  early_close:0,     deal_count:3,  coverage_ratio:1.5, quota:185000 },
    '2026-03': { open_pipeline:310000,  slipped:0,      at_risk:30000,  on_track:280000,  early_close:0,     deal_count:4,  coverage_ratio:1.6, quota:195000 },
  },
};

// 2026 pipeline summaries — appended to existing dept objects above via Object.assign at module load
Object.assign(pipelineSummary['DEPT-NA-SALES'], {
  '2026-01': { open_pipeline:1180000, slipped:200000, at_risk:80000,  on_track:900000,  early_close:0,     deal_count:12, coverage_ratio:1.9, quota:620000 },
  '2026-02': { open_pipeline:1050000, slipped:0,      at_risk:60000,  on_track:990000,  early_close:200000,deal_count:11, coverage_ratio:1.7, quota:630000 },
  '2026-03': { open_pipeline:920000,  slipped:0,      at_risk:50000,  on_track:870000,  early_close:0,     deal_count:10, coverage_ratio:1.4, quota:640000 },
});
Object.assign(pipelineSummary['DEPT-EMEA-SALES'], {
  '2026-01': { open_pipeline:720000,  slipped:0,      at_risk:0,      on_track:720000,  early_close:42000, deal_count:8,  coverage_ratio:1.5, quota:480000 },
  '2026-02': { open_pipeline:680000,  slipped:0,      at_risk:30000,  on_track:650000,  early_close:0,     deal_count:7,  coverage_ratio:1.4, quota:490000 },
  '2026-03': { open_pipeline:710000,  slipped:0,      at_risk:20000,  on_track:690000,  early_close:0,     deal_count:8,  coverage_ratio:1.4, quota:500000 },
});
Object.assign(pipelineSummary['DEPT-APAC-SALES'], {
  '2026-01': { open_pipeline:480000,  slipped:0,      at_risk:40000,  on_track:440000,  early_close:0,     deal_count:6,  coverage_ratio:1.5, quota:320000 },
  '2026-02': { open_pipeline:560000,  slipped:0,      at_risk:30000,  on_track:530000,  early_close:0,     deal_count:7,  coverage_ratio:1.4, quota:400000 },
  '2026-03': { open_pipeline:420000,  slipped:90000,  at_risk:60000,  on_track:270000,  early_close:0,     deal_count:5,  coverage_ratio:1.2, quota:350000 },
});

let _nextId = 100;
function nextDealId() { return `CRM-CUSTOM-${String(++_nextId).padStart(3,'0')}`; }

module.exports = { get deals(){ return deals; }, set deals(v){ deals=v; }, pipelineSummary, nextDealId };
