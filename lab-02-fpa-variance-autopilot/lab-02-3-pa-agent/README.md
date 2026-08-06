# Lab 2.3 — Create the PA Data Agent

**Duration:** 20 minutes  
**Prerequisite:** Lab 2.1 ✅ (MCP server registered)  
**Reference:** [developer.watson-orchestrate.ibm.com](https://developer.watson-orchestrate.ibm.com)

---

## Goal

Build the **PA Data Agent** — a specialist agent whose only job is to query the FPA_Variance cube in Planning Analytics and return structured budget vs actual data with material variance flags.

This agent has **no CRM or ERP tools**. It is intentionally narrow. In Lab 2.5 it becomes a sub-agent inside the orchestrator.

By the end of this lab you will have:
- The `PA Data Agent` created and configured in Orchestrate
- All 10 PA MCP tools attached
- A live variance query returning a flagged results table

---

## Background — Why a Standalone PA Agent?

Building a focused PA-only agent first lets you:
1. Validate the MCP integration independently before adding complexity
2. Test MDX fallback logic in isolation
3. Reuse this agent as a sub-agent in the orchestrator (Lab 2.5) without duplication

---

## Step 1 — Create the Agent

### Option A — Orchestrate UI

1. In Orchestrate, navigate to **Agents** → **Create agent** (or **+ New agent**).
2. Fill in the basic details:

| Field | Value |
|-------|-------|
| **Name** | `PA Data Agent` |
| **Description** | Queries the FPA_Variance cube in Planning Analytics via MCP. Returns budget vs actual data with material variance flags. Does not call CRM or ERP systems. |
| **Model** | `ibm/granite-3-3-8b-instruct` (or your tenant default) |

3. Click **Create** (or **Next**).

### Option B — ADK

```bash
# Import directly from the pre-built YAML
orchestrate agents import \
  --file ./pa-data-agent.yaml

# Verify
orchestrate agents list
# Expected: pa_data_agent   PA Data Agent   active
```

---

## Step 2 — Import Agent Instructions from YAML

Rather than typing instructions manually, import from the pre-built YAML:

1. In the agent editor, click **Instructions** tab → **Import from YAML** (or the `</>` YAML editor icon).
2. Open [`pa-data-agent.yaml`](pa-data-agent.yaml) (in this folder).
3. Paste the full content and click **Apply**.

**Key sections to review after import:**

```
Context — cube dimensions:
  Account:    REV-001..REV-004, COGS-001..COGS-002, OPEX-001..OPEX-008
  Department: DEPT-NA-SALES, DEPT-EMEA-SALES, DEPT-APAC-SALES, DEPT-LATAM-SALES ...
  Scenario:   BUD (Budget), ACT (Actual), FC-Q1..FC-Q4 (Forecast), PY-ACT (Prior Year)
  Time:       2023-01 through 2026-06
  Version:    V1 (all data — BUD, ACT, FC, PY-ACT all stored under V1)

Reasoning — query strategy:
  1. get_available_tm1_servers
  2. list_cubes_with_ai_analysis_metadata  ← check is_analyzed flag
  3. get_cube_dimensions + get_cube_sample_members
  4. get_data_from_data_explorer  OR  execute_mdx_and_get_view (auto-fallback)
  5. Calculate variance $ and % for each row
  6. Flag rows exceeding material thresholds

Material variance thresholds:
  Revenue (REV-*):  > $100,000 or > 20%
  COGS (COGS-*):    > $50,000  or > 15%
  OpEx (OPEX-*):    > $50,000  or > 15%
```

---

## Step 3 — Add the PA MCP Tools

1. In the agent editor, go to the **Tools** tab.
2. Click **Add tools** → **From integration** → select `planning-analytics-mcp`.
3. Enable all 10 tools:

```
✅ get_available_tm1_servers
✅ list_cubes_with_ai_analysis_metadata
✅ get_cube_dimensions
✅ get_cube_sample_members
✅ get_data_from_data_explorer
✅ execute_mdx_and_get_view
✅ get_cubes_that_may_answer_query
✅ lookup_potential_members
✅ perform_outlier_detection
✅ get_outlier_summary
```

4. Click **Save**.

> **Do not add any CRM or ERP tools.** This agent is PA-only by design.

---

## Step 4 — Test the Agent

### Test 4.1 — Basic cube discovery

In the agent **Preview** / **Test** panel, send:

```
List available TM1 servers and show the dimensions of the FPA_Variance cube.
```

**Expected tool calls (visible in the trace panel):**
```
→ get_available_tm1_servers        result: ["DemoGuide"]
→ get_cube_dimensions              result: Account, Department, Scenario, Time, Version
```

**Expected response:**
```
Server: DemoGuide
FPA_Variance dimensions: Account · Department · Scenario · Time · Version
```

---

### Test 4.2 — Variance query with flagging

Send:

```
Show me January 2024 actual vs budget for all departments in the FPA_Variance cube.
Flag any variance greater than $100,000 or 20%.
```

**Expected tool calls:**
```
→ list_cubes_with_ai_analysis_metadata
→ get_data_from_data_explorer  (or execute_mdx_and_get_view if not pre-analyzed)
```

**Expected response table:**

| Department | Account | Budget | Actual | Variance $ | Variance % | Flag |
|-----------|---------|--------|--------|------------|------------|------|
| DEPT-NA-SALES | REV-001 | $500K | $325K | -$175K | -35.0% | 🔴 HIGH |
| DEPT-NA-SALES | OPEX-001 | $120K | $145K | +$25K | +20.8% | 🟡 MEDIUM |
| DEPT-EMEA-SALES | REV-001 | $380K | $420K | +$40K | +10.5% | ✅ Favorable |

---

### Test 4.3 — MDX fallback (if needed)

If the agent switches to MDX automatically, check the trace — you should see a note like:
```
Data Explorer not available for this cube. Switching to execute_mdx_and_get_view.
```
This is correct behaviour — no intervention required.

---

## ✅ Checkpoint

Before moving to Lab 2.4, confirm:

- [ ] `PA Data Agent` shows **Active** status in Orchestrate
- [ ] All 10 PA MCP tools are attached
- [ ] Test 4.1 returns `DemoGuide` and 5 dimensions
- [ ] Test 4.2 returns the variance table with at least 2 flagged variances
- [ ] Agent instructions are imported from [`pa-data-agent.yaml`](pa-data-agent.yaml)

---

## How the Agent Decides Which Query Tool to Use

```
list_cubes_with_ai_analysis_metadata
        │
        ├─ is_analyzed: true  ──→  get_data_from_data_explorer (natural language)
        │
        └─ is_analyzed: false ──→  execute_mdx_and_get_view (constructed MDX)
               │
               └─ Also falls back here if Data Explorer returns an error
```

Both paths return the same data — the agent handles this automatically.

---

## Troubleshooting

**Agent returns "Cube not found"**  
→ Send: `List available cubes on DemoGuide` — check the exact cube name.  
→ If `FPA_Variance` is missing, the TM1 data load from Lab 1 was not completed. Ask your facilitator.

**MDX query returns no rows**
→ Verify the `Time` member format: must be `2024-01`, not `Jan 2024` or `January 2024`.
→ Verify `Version` member: always use `V1` — all scenarios (BUD, ACT, FC-Q1..Q4, PY-ACT) are stored under V1.
→ Call `get_cube_sample_members` on the Time dimension to see valid member names.

**get_data_from_data_explorer returns an error**  
→ Expected if the cube is not pre-analyzed. The agent should auto-switch to MDX.  
→ If the agent asks you what to do instead of switching: add this line to instructions:  
  `If get_data_from_data_explorer fails, immediately retry with execute_mdx_and_get_view without asking the user.`

---

## Next

→ **[Lab 2.4 — Create CRM + ERP Sub-Agents](../lab-02-4-crm-erp-agents/README.md)**
