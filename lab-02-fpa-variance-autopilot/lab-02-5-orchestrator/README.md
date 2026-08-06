# Lab 2.5 — Create the FP&A Orchestrator Agent

**Duration:** 25 minutes  
**Prerequisite:** Labs 2.1 ✅ · 2.2 ✅ · 2.3 ✅ · 2.4 ✅  
**Reference:** [developer.watson-orchestrate.ibm.com](https://developer.watson-orchestrate.ibm.com)

---

## Goal

Build the **FP&A Variance Autopilot** as a multi-agent orchestrator. This agent does not call tools directly — it delegates to the three sub-agents you built in Labs 2.3 and 2.4, synthesises their outputs, and produces a single CFO-ready variance report.

By the end of this lab you will have:
- The `FP&A Variance Autopilot` orchestrator active in Orchestrate
- Three sub-agents wired: PA Data Agent · CRM Context Agent · ERP Context Agent
- A full end-to-end variance analysis running in under 5 minutes

---

## Background — Multi-Agent Pattern in watsonx Orchestrate

In Orchestrate, an orchestrator agent can call other agents as **collaborators** (in addition to or instead of tools). The orchestrator receives a high-level request, decides which sub-agent handles which part, passes sub-tasks to each one, and assembles the final answer.

```
User prompt
    │
    ▼
FP&A Variance Autopilot (Orchestrator)
    │
    ├── pa_data_agent          ← "Get variance data for Jan 2024"
    │       └── [PA MCP tools] ← TM1 / Planning Analytics
    │
    ├── crm_context_agent      ← "Get CRM context for DEPT-NA-SALES/2024-01"
    │       └── [CRM tools]    ← SalesLens CRM API
    │
    └── erp_context_agent      ← "Get ERP context for DEPT-NA-SALES/2024-01"
            └── [ERP tools]    ← SalesLens ERP API
```

The orchestrator then synthesises all three responses into one variance report.

---

## Step 1 — Confirm Sub-Agents Are Ready

Before creating the orchestrator, verify all three sub-agents are active:

1. In Orchestrate, navigate to **Agents**.
2. Confirm these agents show **Active** status:

| Agent name | Created in |
|-----------|-----------|
| `PA Data Agent` | Lab 2.3 |
| `CRM Context Agent` | Lab 2.4 |
| `ERP Context Agent` | Lab 2.4 |

> If any sub-agent is missing, complete the relevant lab before continuing.

---

## Step 2 — Create the Orchestrator Agent

### Option A — Orchestrate UI

1. Navigate to **Agents** → **Create agent**.
2. Fill in:

| Field | Value |
|-------|-------|
| **Name** | `FP&A Variance Autopilot` |
| **Description** | Multi-agent orchestrator. Coordinates PA Data Agent, CRM Context Agent, and ERP Context Agent to detect material budget variances in Planning Analytics, enrich with CRM/ERP root cause context, and produce a CFO-ready variance report with stakeholder routing. |
| **Model** | `ibm/granite-3-3-8b-instruct` (or tenant default) |

3. Click **Create**.

### Option B — ADK

```bash
orchestrate agents import \
  --file ./fpa-orchestrator-agent.yaml

# Verify
orchestrate agents list
# Expected: fpa_variance_autopilot   FP&A Variance Autopilot   active
```

---

## Step 3 — Import Orchestrator Instructions from YAML

1. In the agent editor → **Instructions** tab → **Import from YAML**.
2. Open [`fpa-orchestrator-agent.yaml`](fpa-orchestrator-agent.yaml) (in this folder) and paste.
3. Click **Apply**.

**Key orchestration logic sections to review:**

```
STEP 2 — Get PA data:
  Call pa_data_agent: "Return budget vs actual for [scope] in FPA_Variance for [period]"

STEP 3 — Route each material variance:
  IF account is REV-*    → call crm_context_agent
  IF account is OPEX-*   → call erp_context_agent
  IF account is COGS-*   → call erp_context_agent
  (Sub-agents can be called in parallel for multiple variances)

STEP 4 — Severity classification:
  HIGH:   > 25% or > $150,000
  MEDIUM: 15–25% or $75K–$150K
  LOW:    10–15% or $25K–$75K

STEP 6 — Stakeholder routing:
  HIGH → Regional VP / Dept Head (email, immediate)
  MEDIUM → FP&A Manager (dashboard)
  LOW → FP&A team (monthly summary)
```

---

## Step 4 — Add Sub-Agents as Collaborators

1. In the agent editor, go to the **Agents** tab (distinct from the Tools tab).
2. Click **Add agent** → select from the list of active agents.
3. Add all three:

```
✅ PA Data Agent
✅ CRM Context Agent
✅ ERP Context Agent
```

4. Click **Save**.

> **Note:** The orchestrator should have **no direct tools** from MCP or REST. All data flows through sub-agents. If your Orchestrate version does not yet have an Agents tab on the agent editor, see the ADK approach in Step 2 Option B — the `agents:` section in the YAML handles this.

---

## Step 5 — Run the End-to-End Autopilot

In the agent **Preview** / **Test** panel, use any of the prompts below.

> **Tip:** Always specify the **cube name** and **server name** in your prompt — the agent discovers dynamically but explicit names give faster, more reliable results.

### 🔍 Discovery prompts (PA exploration — no variance analysis)

```
List all cubes on DemoGuide.
```
```
What cubes are available on 24Retail?
```
```
Show me the dimensions of the FPA_Variance cube on DemoGuide.
```
```
Which cubes are pre-analyzed on DemoGuide?
```

> These are delegated directly to `pa_data_agent` and returned without triggering variance analysis.

---

### 📊 Full variance analysis prompts

**Recommended format — explicit server + cube:**
```
Run the FP&A variance analysis for January 2026 on the FPA_Variance cube
on the DemoGuide server. Identify all material variances, investigate root
causes using the CRM and ERP systems, and generate a full variance report.
```

**With custom thresholds:**
```
Show me January 2026 actual vs budget for all departments on the FPA_Variance
cube on DemoGuide. Flag any variance greater than $100,000 or 20%.
Investigate root causes and generate a variance report.
```

**Focused on a department:**
```
Run variance analysis for March 2026 on FPA_Variance on DemoGuide.
Focus on APAC Sales only. Include CRM root cause context.
```

**Focused on a period + department:**
```
Run variance analysis for March 2025 on FPA_Variance on DemoGuide.
Focus on Product Engineering. Check ERP for unbudgeted costs.
```

**Open-ended (agent discovers server + cube):**
```
Run the FP&A variance autopilot for January 2026. Identify all material
variances and investigate root causes.
```

### Watch the sub-agent call trace

In the **Trace** / **Steps** panel on the right, you should see:

```
Step 1 → pa_data_agent
         "Return budget vs actual for all depts in FPA_Variance on DemoGuide for 2026-01 using V1"
         Result: variance table — 3 material variances flagged

Step 2 → crm_context_agent
         "Get CRM context for dept_id=DEPT-NA-SALES, period=2026-01, account_id=REV-001"
         Result: 2 slipped orders, $200K, context_summary returned

Step 3 → erp_context_agent
         "Get ERP context for dept_id=DEPT-NA-SALES, period=2026-01, account_id=COGS-001"
         Result: steel tariff $23K overspend, context_summary returned

Step 3b → erp_context_agent
         "Get ERP context for dept_id=DEPT-NA-SALES, period=2026-01, account_id=OPEX-001"
         Result: 1 unbudgeted PO ($18K Hannover Messe) + headcount event, context_summary returned

Step 4 → [Synthesise report]
```

---

### Expected output

```
📊 FP&A Variance Analysis — January 2026

Server: DemoGuide | Cube: FPA_Variance | Period: 2026-01
Sub-agents: pa_data_agent · crm_context_agent · erp_context_agent
Analysis time: 5.1 seconds

MATERIAL VARIANCES DETECTED: 3

─────────────────────────────────────────────────────
🔴 HIGH — DEPT-NA-SALES | REV-001 (Finished Goods Revenue)
─────────────────────────────────────────────────────
  Budget: $620,000 | Actual: $445,000
  Variance: -$175,000 (-28.2%) ← Unfavorable

  Root Cause: Two major orders slipped to February — Acme Corp $120K
  (procurement approval delayed) and TechStart $80K (customer capital
  freeze). Timing-related variance, not structural. [source: CRM]

  Classification: Timing-related slippage
  Forecast Action: None required — orders expected February
  CRM Action: Confirm close dates — Acme Corp + TechStart

─────────────────────────────────────────────────────
🟡 MEDIUM — DEPT-NA-SALES | COGS-001 (Raw Materials Cost)
─────────────────────────────────────────────────────
  Budget: $145,000 | Actual: $168,000
  Variance: +$23,000 (+15.9%) ← Unfavorable

  Root Cause: Steel plate prices rose 14% due to EU tariff changes.
  $23K unbudgeted raw material overspend. Procurement reviewing
  alternative suppliers. [source: ERP]

  Classification: External/pricing — procurement action required
  Forecast Action: +$20K Q1 COGS adjustment recommended

─────────────────────────────────────────────────────
🟡 MEDIUM — DEPT-NA-SALES | OPEX-001 (Sales & Distribution OPEX)
─────────────────────────────────────────────────────
  Budget: $120,000 | Actual: $145,000
  Variance: +$25,000 (+20.8%) ← Unfavorable

  Root Cause: Unplanned Hannover Messe sponsorship ($18K approved late)
  and additional headcount in December not in original plan. [source: ERP]

  Classification: Controllable overspend
  Forecast Action: +$15K Q1 OpEx adjustment recommended

─────────────────────────────────────────────────────
✅ FAVORABLE — DEPT-EMEA-SALES | REV-001 (Finished Goods Revenue)
  Budget: $480,000 | Actual: $520,000
  +$40,000 (+8.3%) — GlobalTech framework order closed early.

─────────────────────────────────────────────────────
SUMMARY
  Revenue Variance (Net):   -$135,000 (-8.8% vs budget)
  OpEx/COGS Variance (Net): +$48,000  (+18.2% vs budget)
  Material Variances: 3 (1 High, 2 Medium)
  Coverage: 100% of material variances explained

RECOMMENDED ACTIONS:
  1. [HIGH]   Confirm Feb close — Acme Corp + TechStart (VP Sales)
  2. [MEDIUM] Procure alternative steel suppliers — EU tariff mitigation (Procurement)
  3. [MEDIUM] Review NA OpEx run-rate for Q1 re-forecast (FP&A)

Confidence: 0.95 | Alerts: VP Sales (email), CFO flag, FP&A Manager (dashboard)
```

---

## Step 6 — Try Additional Periods & Scenarios

| Prompt | Expected result |
|--------|----------------|
| `Run variance analysis for March 2026 on FPA_Variance on DemoGuide. Focus on APAC Sales.` | `-$105K (-30.0%)` APAC revenue → CRM: China regulatory delay |
| `Run variance analysis for March 2024 on FPA_Variance on DemoGuide. Focus on APAC Sales.` | `-$85K (-30.4%)` APAC revenue → CRM: Regulatory approval delays |
| `Run variance analysis for January 2024 on FPA_Variance on DemoGuide. Focus on Product Engineering.` | `+$18K (+4.0%)` Prod Eng OpEx → ERP: Cloud infrastructure costs |
| `Run variance analysis for May 2024 on FPA_Variance on DemoGuide. Focus on EMEA Sales.` | `-$35K (-8.3%)` EMEA revenue → CRM: Economic uncertainty |

---

## Step 7 — Compare: Orchestrator vs Monolithic Agent (Optional)

The original `fpa-variance-agent.yaml` (in [`../assets/`](../assets/)) is a monolithic reference agent that holds all 15 tools directly. Compare:

| | Monolithic | Multi-agent |
|--|-----------|-------------|
| Tool count per agent | 15 | 3–10 (focused) |
| Sub-agent isolation | None | Full |
| Independent testability | No | Yes |
| Trace granularity | Tool-level | Agent + tool level |
| Failure isolation | Whole agent fails | Sub-agent fails, others continue |
| Add new data source | Edit one big agent | Add a new sub-agent |

---

## ✅ Checkpoint

Before moving to Lab 2.6 (optional), confirm:

- [ ] `FP&A Variance Autopilot` orchestrator shows **Active** in Orchestrate
- [ ] All 3 sub-agents appear under the **Agents** tab of the orchestrator
- [ ] Jan 2026 full autopilot produces a report with 3 material variances (1 High, 2 Medium)
- [ ] Trace shows sub-agent calls in the correct order
- [ ] Report includes `[source: CRM]` and `[source: ERP]` citations

---

## Troubleshooting

**Orchestrator calls tools directly instead of sub-agents**  
→ Verify no direct tools are added to the orchestrator — only sub-agents under the Agents tab.  
→ If tools were accidentally added, remove them and re-test.

**Sub-agent not available in the collaborator picker**  
→ The sub-agent must be in **Active** status. Check Agents list and re-activate if needed.  
→ Sub-agents must be in the same Orchestrate tenant and project.

**Orchestrator stops after PA data — does not call CRM/ERP**  
→ Review instructions: ensure routing logic is explicit:  
  `IF account type is Revenue (REV-*) → call crm_context_agent`  
→ Add to instructions: `Always call the appropriate context sub-agent for EVERY material variance before generating the final report. Never skip this step.`

**Report has low Confidence score**  
→ A sub-agent returned no data for one or more variances. Check the trace to see which call failed, then test that sub-agent independently.

---

## Next (Optional)

→ **[Lab 2.6 — Embed the Agent in an HTML Chat Interface](../lab-02-6-chat-embed/README.md)**

Or return to the **[Lab 2 overview](../README.md)**.
