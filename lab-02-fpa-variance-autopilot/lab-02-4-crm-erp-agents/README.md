# Lab 2.4 — Create the CRM Agent & ERP Agent

**Duration:** ~30 minutes  
**Prerequisite:** [Lab 2.3](../lab-02-3-saleslens-connection/README.md) ✅ (SalesLens connection configured)  
**IBM Docs:**
- [Import tools from an OpenAPI](https://www.ibm.com/docs/en/watsonx/watson-orchestrate/base?topic=tools-importing-from-openapi)

---

## Goal

Build two focused sub-agents — one for CRM deal context and one for ERP cost context. You will import the SalesLens OpenAPI spec into each agent so each receives only its own 3 relevant tools. Test each independently before wiring them to the orchestrator in Lab 2.5.

By the end of this lab you will have:
- `CRM Context Agent` active in Orchestrate — 3 CRM tools (`getCrmVarianceContext`, `getCrmDeals`, `getCrmPipelineSummary`), revenue root cause
- `ERP Context Agent` active in Orchestrate — 3 ERP tools (`getErpCostContext`, `getErpPurchaseOrders`, `getErpHeadcountEvents`), OpEx root cause
- Both agents returning structured `context_summary` narratives

---

## Background — Why Two Separate Agents?

| Single CRM+ERP agent | Two separate agents |
|---------------------|---------------------|
| All 6 tools in one agent | 3 tools each — focused context |
| Model must decide CRM vs ERP on every call | Orchestrator routes by account type — no ambiguity |
| Harder to evaluate and iterate independently | Each agent can be tested, improved, swapped |
| One failure affects both systems | Isolated failure modes |

The orchestrator in Lab 2.5 routes to the right agent based on account type (`REV-*` → CRM, `OPEX-*`/`COGS-*` → ERP). This is the recommended multi-agent pattern for Orchestrate.

---

## Part A — CRM Context Agent

### Step A1 — Create the Agent

**Option A — Orchestrate UI:**

1. Navigate to **Build** → **All agents** → **Create agent**.
2. Fill in:

| Field | Value |
|-------|-------|
| **Name** | `CRM Context Agent` |
| **Description** | Queries the SalesLens CRM API for deal slippage and pipeline context. Returns root cause narratives for revenue variances. Does not query Planning Analytics or ERP. |
| **Model** | `ibm/granite-3-3-8b-instruct` (or tenant default) |

3. Click **Create**.

**Option B — ADK:**

```bash
orchestrate agents import \
  --file ./crm-agent.yaml
```

---

### Step A2 — Import CRM Agent Instructions

1. In the agent editor → **Instructions** tab → **Import from YAML**.
2. Open [`crm-agent.yaml`](crm-agent.yaml) (in this folder) and paste the full content.
3. Click **Apply**.

**Key instruction sections:**

```
Primary workflow:
  1. Call getCrmVarianceContext(dept_id, period, account_id?)
  2. Return context_summary verbatim — this is the root cause narrative
  3. List slipped deals: name, value, slip_reason, rescheduled_close
  4. Report pipeline coverage_ratio — flag ⚠️ if < 1.0

Constraint:
  Never fabricate deal names, amounts, or reasons.
  Only use data returned directly from the API.
```

---

### Step A3 — Import CRM Tools via OpenAPI

> ⚠️ **Before uploading:** Open [`saleslens-openapi-spec.json`](saleslens-openapi-spec.json) in a text editor and replace the `<SALESLENS_ENDPOINT_URL>` placeholder in the `"servers"` block with the actual URL provided by your facilitator. Save the file before proceeding — Orchestrate will use this URL as the base for all tool calls.

1. In the **Toolset** section of the `CRM Context Agent`, click **Add tool**.
2. Click **OpenAPI**.
3. **Drag and drop** `saleslens-openapi-spec.json` from this folder into the upload area (or click to browse).
4. After the file uploads, click **Next**.
5. In the operations list, select the **3 CRM operations**:

```
✅ getCrmVarianceContext     GET /crm/variance-context
✅ getCrmDeals               GET /crm/deals
✅ getCrmPipelineSummary     GET /crm/pipeline-summary
```

   Deselect all ERP operations for this agent.

6. Click **Next**.
7. In the **Connection** dropdown, select `SalesLens API Key` (configured in Lab 2.3).
8. Click **Done**.

The 3 CRM tools now appear in the agent's Toolset.

> **Do not add ERP tools to this agent.**

---

### Step A4 — Test the CRM Agent

In the agent **Preview** panel, send:

```
Get CRM variance context for DEPT-NA-SALES in January 2024.
```

**Expected tool call:**
```
→ getCrmVarianceContext   dept_id=DEPT-NA-SALES, period=2024-01
```

**Expected response:**
```
🤝 CRM Context — DEPT-NA-SALES | 2024-01

context_summary: "2 deal(s) totalling $200K slipped from 2024-01: Acme Corp
($120K — customer procurement delayed); TechStart ($80K — budget freeze).
Rescheduled: Acme Corp → 2024-02-28, TechStart → 2024-02-15."

Slipped deals:
  • Acme Corp — $120,000 — customer procurement delayed — rescheduled 2024-02-28
  • TechStart Inc — $80,000 — budget freeze — rescheduled 2024-02-15

Pipeline coverage: 1.7x ($850,000 open pipeline)
```

**Try a second test — EMEA favorable variance:**

```
Get CRM context for DEPT-EMEA-SALES, period 2024-01.
```

Expected: an early close (GlobalTech deal) — favorable context.

---

## Part B — ERP Context Agent

### Step B1 — Create the Agent

**Option A — Orchestrate UI:**

1. Navigate to **Build** → **All agents** → **Create agent**.
2. Fill in:

| Field | Value |
|-------|-------|
| **Name** | `ERP Context Agent` |
| **Description** | Queries the SalesLens ERP API for unbudgeted purchase orders and headcount events. Returns root cause narratives for OpEx and COGS variances. Does not query Planning Analytics or CRM. |
| **Model** | `ibm/granite-3-3-8b-instruct` (or tenant default) |

3. Click **Create**.

**Option B — ADK:**

```bash
orchestrate agents import \
  --file ./erp-agent.yaml
```

---

### Step B2 — Import ERP Agent Instructions

1. **Instructions** tab → **Import from YAML**.
2. Open [`erp-agent.yaml`](erp-agent.yaml) (in this folder) and paste.
3. Click **Apply**.

**Key instruction sections:**

```
Primary workflow:
  1. Call getErpCostContext(dept_id, period, account_id?)
  2. Return context_summary verbatim — this is the root cause narrative
  3. List unbudgeted POs: vendor, category, amount, reason
  4. List headcount events: role, event_type, monthly_cost
  5. Report total_unplanned_cost

Constraint:
  Never fabricate vendor names, PO amounts, or headcount roles.
  Only use data returned directly from the API.
```

---

### Step B3 — Import ERP Tools via OpenAPI

Repeat the OpenAPI import using the **same spec file**:

1. In the **Toolset** section of the `ERP Context Agent`, click **Add tool** → **OpenAPI**.
2. **Drag and drop** `saleslens-openapi-spec.json` again.
3. Click **Next**.
4. This time select the **3 ERP operations**:

```
✅ getErpCostContext         GET /erp/cost-context
✅ getErpPurchaseOrders      GET /erp/purchase-orders
✅ getErpHeadcountEvents     GET /erp/headcount-events
```

   Deselect all CRM operations for this agent.

5. Click **Next**.
6. In the **Connection** dropdown, select `SalesLens API Key`.
7. Click **Done**.

The 3 ERP tools now appear in the agent's Toolset.

> **Do not add CRM tools to this agent.**

---

### Step B4 — Test the ERP Agent

In the agent **Preview** panel, send:

```
Get ERP cost context for DEPT-NA-SALES in January 2024.
```

**Expected tool call:**
```
→ getErpCostContext   dept_id=DEPT-NA-SALES, period=2024-01
```

**Expected response:**
```
🏭 ERP Context — DEPT-NA-SALES | 2024-01

context_summary: "1 unbudgeted purchase order(s) totalling $18K:
TechWorld Events LLC — Events & Conferences (PO-2024-0142): Reactive
participation in TechWorld Summit. 1 unbudgeted headcount event(s)
adding $8K/month: Enterprise Account Executive (new_hire): Hire approved
via headcount exception."

Unbudgeted POs:
  • TechWorld Events LLC — Events & Conferences — $18,000
    Reason: Reactive participation in TechWorld Summit

Headcount events:
  • Enterprise Account Executive — new_hire — $8,500/month

Total unplanned cost: $26,000
```

**Try a second test — Prod Eng GPU spend:**

```
Get ERP cost context for DEPT-PROD-ENG in March 2025.
```

Expected: NVIDIA GPU purchase order + ML contractor headcount event.

---

## Step C — Explore the Demo UI Side-by-Side (Optional)

Open `<SALESLENS_ENDPOINT_URL>/demo` in a browser tab. Go to **Variance Lookup** and enter:
- **Department:** `DEPT-NA-SALES`
- **Period:** `2024-01`

Click **Fetch context**. You will see the exact same `context_summary` strings the agents returned — this confirms what Orchestrate called under the hood via `getCrmVarianceContext` and `getErpCostContext`.

> **Key insight for participants:** The agent is not hallucinating root causes — it is reading them directly from a live REST API. This is the pattern for any real implementation: your CRM (Salesforce, HubSpot) or ERP (SAP, Oracle) exposes an endpoint; the agent calls it.

---

## ✅ Checkpoint

Before moving to Lab 2.5, confirm:

- [ ] `CRM Context Agent` shows **Active** in Orchestrate — 3 CRM tools attached
- [ ] `ERP Context Agent` shows **Active** in Orchestrate — 3 ERP tools attached
- [ ] CRM test: `getCrmVarianceContext` returns `context_summary` with 2 slipped deals
- [ ] ERP test: `getErpCostContext` returns `context_summary` with PO + headcount event
- [ ] Neither agent has tools from the other system

---

## ADK Alternative

```bash
# Import CRM tools
orchestrate tools import \
  --kind openapi \
  --spec ./saleslens-openapi-spec.json \
  --name saleslens-crm \
  --connection saleslens-api-key

# Import ERP tools
orchestrate tools import \
  --kind openapi \
  --spec ./saleslens-openapi-spec.json \
  --name saleslens-erp \
  --connection saleslens-api-key

# Verify tools
orchestrate tools list | grep saleslens
```

---

## Variance Scenarios You Can Test

| Period | Dept | Account | Expected CRM/ERP response |
|--------|------|---------|--------------------------|
| 2024-01 | DEPT-NA-SALES | REV-001 | CRM: 2 slipped deals ($200K) |
| 2024-01 | DEPT-EMEA-SALES | REV-001 | CRM: 1 early close (GlobalTech) |
| 2024-01 | DEPT-NA-SALES | OPEX-001 | ERP: TechWorld PO + new hire |
| 2024-01 | DEPT-PROF-SVC | COGS-001 | ERP: CloudSkills contractor premium |
| 2024-03 | DEPT-APAC-SALES | REV-001 | CRM: Sino-Digital regulatory delay |
| 2025-03 | DEPT-PROD-ENG | OPEX-002 | ERP: NVIDIA GPU + ML contractor |

---

## Troubleshooting

**File upload fails or no operations appear**  
→ Verify `saleslens-openapi-spec.json` is valid JSON: `python3 -m json.tool saleslens-openapi-spec.json`  
→ The file must start with `{` — not HTML.

**Only some operations appear in the list**  
→ Ensure the spec version is OpenAPI 3.0.x (not Swagger 2.x).

**401 Unauthorized when the agent calls a tool**  
→ The connection was not associated during import. Open each tool → **Edit details** → confirm the connection shows `SalesLens API Key`.  
→ Verify the team credential status is ✅ in the Live environment under **Manage → Security → Team credentials**.

**`getCrmVarianceContext` returns empty `slipped_deals`**  
→ Check dept_id spelling exactly: `DEPT-NA-SALES` (all caps, hyphens).  
→ Check period format: `2024-01` not `January 2024`. Test at `<APP_URL>/docs`.

**`getErpCostContext` returns 404**  
→ Check the SalesLens app is running: `curl <BASE_URL>/health`  
→ Valid dept IDs for ERP include all 12 departments (not just Sales regions).

**Agent calls the wrong tool first**  
→ Review the instructions — the agent should call `getCrmVarianceContext` / `getErpCostContext` first, not the filter endpoints.  
→ Add to the top of the instructions: `Always start with the primary endpoint (getCrmVarianceContext / getErpCostContext) before calling filter endpoints.`

---

## Next

→ **[Lab 2.5 — Create the Orchestrator Agent](../lab-02-5-orchestrator/README.md)**
