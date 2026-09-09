# Lab 2.2 — Create the PA Data Agent

**Duration:** ~30 minutes  
**Prerequisite:** [Lab 2.1](../lab-02-1-pa-mcp-connection/README.md) ✅ (PA connection configured)  
**Reference:** [developer.watson-orchestrate.ibm.com](https://developer.watson-orchestrate.ibm.com)

---

## Goal

Build the **PA Data Agent** — a specialist agent whose only job is to query the `FPA_Variance` cube in Planning Analytics via MCP and return structured budget vs actual data with material variance flags.

You will create the agent, register the Planning Analytics MCP server in its Toolset using the connection configured in Lab 2.1, attach all 10 PA tools, and test the agent.

This agent has **no CRM or ERP tools**. It is intentionally narrow. In Lab 2.5 it becomes a sub-agent inside the orchestrator.

By the end of this lab you will have:
- The `PA Data Agent` created and configured in Orchestrate
- The Planning Analytics Remote MCP server registered in the agent's Toolset
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

1. In Orchestrate, navigate to **Build** → **All agents** → **Create agent** (or **+ New agent**).
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
  Scenario:   BUD (Budget), ACT (Actual)
  Time:       2024-01 through 2026-06
  Version:    V1 (Actuals), V2 (Budget)

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

## Step 3 — Add the Remote MCP Server

1. In the agent editor, scroll to the **Toolset** section.
2. Click **Add tool** → **MCP server**.
3. In the **Add tools and manage MCP servers** window, click **Add MCP server**.
4. Select **Remote MCP server** and click **Next**.
5. Fill in the server details:

| Field | Value |
|-------|-------|
| **Name** | `planning-analytics-mcp` |
| **Description** | IBM Planning Analytics TM1 tools via MCP |
| **Server URL** | `http://<TECHZONE_HOST>:<PORT>/api/<TENANT_ID>/v0/agentic-ai/cube/mcp` |
| **Transport type** | `Streamable HTTP` *(selected by default)* |

> Your facilitator will provide the exact MCP URL for the shared TechZone Planning Analytics server.

6. **Select the connection:**
   - In the **Connection** dropdown, select `Planning Analytics (Basic Auth)`.
   - This uses the team credentials you added in Lab 2.1 — no need to re-enter the password.

7. Click **Connect**.

   ✅ Success: a notification confirms *"MCP server is ready and tools are available."*  
   ❌ Failure: see [Troubleshooting](#troubleshooting) below.

---

## Step 4 — Select and Import PA Tools

1. After connecting, click the **search icon** (🔍) in the server search field.
2. Select `planning-analytics-mcp` from the list.
3. Select all 10 of the following tools:

| Tool name | Description |
|-----------|-------------|
| `get_available_tm1_servers` | Lists all TM1 server instances |
| `list_cubes_with_ai_analysis_metadata` | Lists cubes with pre-analysis status |
| `get_cube_dimensions` | Returns dimensions for a named cube |
| `get_cube_sample_members` | Returns sample members for a dimension |
| `get_data_from_data_explorer` | Natural language data query (pre-analyzed cubes) |
| `execute_mdx_and_get_view` | Runs a raw MDX query |
| `get_cubes_that_may_answer_query` | Finds cubes matching a natural language query |
| `lookup_potential_members` | Finds dimension members by partial name |
| `perform_outlier_detection` | Statistical outlier detection on a cube slice |
| `get_outlier_summary` | Summarises outlier detection results |

4. Click **Add to agent** (or **Save**).

The tools now appear in the agent's **Toolset** section.

> **Do not add any CRM or ERP tools.** This agent is PA-only by design.

---

## Step 5 — Test the Agent

### Test 5.1 — Basic cube discovery

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

### Test 5.2 — Variance query with flagging

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
| NA Sales | Enterprise Software Rev | $500K | $325K | -$175K | -35.0% | 🔴 HIGH |
| NA Sales | Sales & Marketing OpEx | $120K | $145K | +$25K | +20.8% | 🟡 MEDIUM |
| EMEA Sales | Enterprise Software Rev | $380K | $420K | +$40K | +10.5% | ✅ Favorable |

---

### Test 5.3 — MDX fallback (if needed)

If the agent switches to MDX automatically, check the trace — you should see a note like:
```
Data Explorer not available for this cube. Switching to execute_mdx_and_get_view.
```
This is correct behaviour — no intervention required.

---

## ✅ Checkpoint

Before moving to Lab 2.3, confirm:

- [ ] `PA Data Agent` shows **Active** status in Orchestrate
- [ ] Remote MCP server `planning-analytics-mcp` added with **Streamable HTTP** transport
- [ ] Connection `Planning Analytics (Basic Auth)` selected during MCP server setup
- [ ] All 10 PA MCP tools appear in the agent's Toolset
- [ ] Test 5.1 returns `DemoGuide` and 5 dimensions
- [ ] Test 5.2 returns the variance table with at least 2 flagged variances
- [ ] Agent instructions are imported from [`pa-data-agent.yaml`](pa-data-agent.yaml)

---

## ADK Alternative

```bash
# Register the MCP server using the connection created in Lab 2.1
# (no need to re-enter credentials — they are stored against the connection)
orchestrate tools import \
  --kind mcp \
  --url http://<TECHZONE_HOST>:<PORT>/api/<TENANT_ID>/v0/agentic-ai/cube/mcp \
  --name planning-analytics-mcp \
  --connection planning-analytics-basic

# Verify tools were discovered
orchestrate tools list | grep planning-analytics-mcp
```

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

**"Connect" fails on the MCP server**  
→ Verify the team credential is set to the **Live** environment (not just Draft).  
→ Verify the MCP URL — no trailing slash, correct port, correct tenant ID segment.  
→ Open the URL in a browser — a valid MCP endpoint returns a JSON response.

**Tool list is empty after a successful connection**  
→ The MCP server connected but reported no tools. Check with your facilitator that the agentic-AI / MCP endpoint is enabled on the TechZone instance.

**Only SSE is available (no Streamable HTTP)**  
→ Select **Server-Sent Events (SSE)** as the transport type instead. The URL and credentials remain the same.

**`get_available_tm1_servers` returns an auth error in Preview**  
→ Confirm the team credential status shows ✅ in the Live environment under **Manage → Security → Team credentials**.  
→ If it shows ❌, click Options → **Edit** and re-enter the password.

**Agent returns "Cube not found"**  
→ Send: `List available cubes on DemoGuide` — check the exact cube name.  
→ If `FPA_Variance` is missing, the TM1 data load from Lab 1 was not completed. Ask your facilitator.

**MDX query returns no rows**  
→ Verify the `Time` member format: must be `2024-01`, not `Jan 2024` or `January 2024`.  
→ Verify `Version` member: use `V1` for actuals, `V2` for budget.  
→ Call `get_cube_sample_members` on the Time dimension to see valid member names.

**get_data_from_data_explorer returns an error**  
→ Expected if the cube is not pre-analyzed. The agent should auto-switch to MDX.  
→ If the agent asks you what to do instead of switching: add this line to instructions:  
  `If get_data_from_data_explorer fails, immediately retry with execute_mdx_and_get_view without asking the user.`

---

## Next

→ **[Lab 2.3 — Configure the SalesLens API Connection](../lab-02-3-saleslens-connection/README.md)**
