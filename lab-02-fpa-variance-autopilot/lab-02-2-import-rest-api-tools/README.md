# Lab 2.2 — Import SalesLens REST API as CRM & ERP Tools

**Duration:** 15 minutes  
**Prerequisite:** Lab 2.1 ✅ (PA MCP tools added to the agent)  
**IBM Docs:**
- [Creating and managing connections](https://www.ibm.com/docs/en/watsonx/watson-orchestrate/base?topic=credentials-creating-managing-connections)
- [Managing team credentials](https://www.ibm.com/docs/en/watsonx/watson-orchestrate/base?topic=credentials-managing-team)
- [Import tools from an OpenAPI](https://www.ibm.com/docs/en/watsonx/watson-orchestrate/base?topic=tools-importing-from-openapi)

---

## Goal

Import the SalesLens OpenAPI spec into watsonx Orchestrate to auto-generate 6 CRM and ERP tools, attach them to the agent, and validate with a live call.

By the end of this lab you will have:
- 3 CRM tools added to the agent's toolset (`getCrmVarianceContext`, `getCrmDeals`, `getCrmPipelineSummary`)
- 3 ERP tools added to the agent's toolset (`getErpCostContext`, `getErpPurchaseOrders`, `getErpHeadcountEvents`)
- A live `getCrmVarianceContext` call returning a root cause narrative

---

## Background — Connections vs Credentials

| Concept | What it is | Where managed |
|---------|-----------|---------------|
| **Connection** | Defines the auth method (API Key, Basic Auth…) and connection ID | **Manage → Security → Connections** |
| **Team credentials** | The shared API key stored against a connection — available to all users | **Manage → Security → Team credentials** |

> **Why Team credentials?**  
> SalesLens is a **shared workshop instance** — all participants use the same API key. Team credentials are shared across all users so every agent call is automatically authenticated without each participant entering the key individually.

---

## Background — The SalesLens Mock API

SalesLens is a Node.js/Express REST API that simulates the CRM and ERP systems your agent will query to explain Planning Analytics variances.

| System | Base path | Primary endpoint | Returns |
|--------|-----------|-----------------|---------|
| CRM | `/crm` | `GET /crm/variance-context` | Deal slippage, pipeline coverage, root cause narrative |
| ERP | `/erp` | `GET /erp/cost-context` | Unbudgeted POs, headcount events, cost narrative |

**Connection details:**

| | Value |
|-|-------|
| **App URL** | `<SALESLENS_ENDPOINT_URL>` — provided by your facilitator *(e.g. `https://saleslens-api.<id>.eu-de.codeengine.appdomain.cloud`)* |
| **API Key** | `<SALESLENS_API_KEY>` — provided by your facilitator |
| **Header** | `X-Api-Key` |
| **OpenAPI spec file** | `saleslens-openapi-spec.json` *(in this folder)* |
| **Swagger UI** | `<APP_URL>/docs` |
| **Demo UI** | `<APP_URL>/demo` |

---

## Pre-Step 1 — Create the Connection

1. From the main menu, click **Manage → Security**.
2. Click the **Connections** tab.
3. Click **Add connection**.
4. Under **Define connection details**, enter:

| Field | Value |
|-------|-------|
| **Connection ID** | `saleslens-api-key` |
| **Display name** | `SalesLens API Key` |

5. Click **Next**.
6. Under **Configure draft connection**:
   - **Authentication type** → select **API Key**
   - **Server URL** *(optional)* → `<SALESLENS_ENDPOINT_URL>` (provided by your facilitator)
   - **API Key Location** *(optional)* → `Header`
   - **Credential type** → select **Team credential**
   - Leave SSO off.
7. Click **Next**.
8. Under **Configure live connection**:
   - Click **Paste draft configuration** to copy the draft settings to live.
9. Click **Add connection**.

The connection now appears in the Connections list.

---

## Pre-Step 2 — Add Team Credentials

Now store the actual API key against the connection.

1. Still in **Manage → Security**, click the **Team credentials** tab.
2. Select the **Live** environment.
3. Click **Add team credential**.
4. In the **Select a connection** dropdown, choose `SalesLens API Key`.
5. Enter the credentials:

| Field | Value |
|-------|-------|
| **API Key** *(Required)* | `<SALESLENS_API_KEY>` — provided by your facilitator |

6. Click **Connect and save** — the status dot should turn green ✅.
   - If you see **"Connection failed"** — see [Troubleshooting](#troubleshooting).

The credential appears in the Team credentials list — all agents using `saleslens-api-key` will authenticate automatically.

---

## Step 1 — Open the Agent in Build

1. From the main menu, click **Build**.
2. Select your workspace.
3. Click **All agents** → select your agent.

---

## Step 2 — Import the CRM Tools via OpenAPI

1. In the **Toolset** section, click **Add tool**.
2. Click **OpenAPI**.
3. **Drag and drop** `saleslens-openapi-spec.json` from this folder into the upload area (or click to browse).
4. After the file uploads, click **Next**.
5. In the operations list, select the **3 CRM operations**:

```
✅ getCrmVarianceContext     GET /crm/variance-context
✅ getCrmDeals               GET /crm/deals
✅ getCrmPipelineSummary     GET /crm/pipeline-summary
```

   Deselect all ERP operations for now.

6. Click **Next**.
7. In the **Connection** dropdown, select `SalesLens API Key`.
8. Click **Done**.

The 3 CRM tools now appear in the agent's Toolset.

> **Why import CRM and ERP separately?** In Lab 2.4 you will create a dedicated CRM Agent and ERP Agent, each with only their relevant tools. Separate imports make tool assignment cleaner.

---

## Step 3 — Import the ERP Tools via OpenAPI

Repeat using the **same spec file**:

1. **Toolset** → **Add tool** → **OpenAPI**.
2. **Drag and drop** `saleslens-openapi-spec.json` again.
3. Click **Next**.
4. This time select the **3 ERP operations**:

```
✅ getErpCostContext         GET /erp/cost-context
✅ getErpPurchaseOrders      GET /erp/purchase-orders
✅ getErpHeadcountEvents     GET /erp/headcount-events
```

   Deselect all CRM operations.

5. Click **Next**.
6. In the **Connection** dropdown, select `SalesLens API Key`.
7. Click **Done**.

---

## Step 4 — Verify All 6 Tools Are in the Toolset

In the **Toolset** section, confirm all 6 tools are listed:

| Tool | Endpoint |
|------|----------|
| `getCrmVarianceContext` | `GET /crm/variance-context` |
| `getCrmDeals` | `GET /crm/deals` |
| `getCrmPipelineSummary` | `GET /crm/pipeline-summary` |
| `getErpCostContext` | `GET /erp/cost-context` |
| `getErpPurchaseOrders` | `GET /erp/purchase-orders` |
| `getErpHeadcountEvents` | `GET /erp/headcount-events` |

> **Tip:** Click any tool → **Edit details** to sharpen its description. The agent model reads the description to decide *when* to call the tool. For example for `getCrmVarianceContext`: *"Call this for any Revenue variance (REV-*) to get CRM deal slippage context and pipeline coverage."*

---

## Step 5 — Test Live Tool Calls from Preview

### CRM test

In the agent **Preview** panel, send:

```
Get CRM variance context for DEPT-NA-SALES in January 2024.
```

**Expected tool call:**
```
→ getCrmVarianceContext   dept_id=DEPT-NA-SALES, period=2024-01
```

**Expected response includes:**
```json
{
  "context_summary": "2 deal(s) totalling $200K slipped from 2024-01: Acme Corp ($120K — customer procurement delayed); TechStart ($80K — budget freeze)...",
  "total_slipped_value": 200000
}
```

### ERP test

```
Get ERP cost context for DEPT-NA-SALES in January 2024.
```

**Expected tool call:**
```
→ getErpCostContext   dept_id=DEPT-NA-SALES, period=2024-01
```

**Expected response includes:**
```json
{
  "context_summary": "1 unbudgeted purchase order(s) totalling $18K: TechWorld Events LLC — Events & Conferences. 1 unbudgeted headcount event(s) adding $8K/month: Enterprise Account Executive (new_hire).",
  "total_unplanned_cost": 26000
}
```

---

## Step 6 — Explore the Demo UI (Optional)

Open `<SALESLENS_ENDPOINT_URL>/demo` → **Variance Lookup** → enter `DEPT-NA-SALES` / `2024-01` → **Fetch context**.

You will see the same `context_summary` strings — this is exactly what the agent received under the hood.

---

## ✅ Checkpoint

- [ ] `saleslens-api-key` connection created (API Key, Team credential)
- [ ] Team credential added — `<SALESLENS_API_KEY>` stored in Live environment, status ✅
- [ ] 3 CRM tools imported and visible in the agent Toolset
- [ ] 3 ERP tools imported and visible in the agent Toolset
- [ ] Both imports use the `SalesLens API Key` connection
- [ ] `getCrmVarianceContext` returns `context_summary` with 2 slipped deals from Preview
- [ ] `getErpCostContext` returns `context_summary` with PO + headcount from Preview

---

## ADK Alternative

```bash
# Create connection
orchestrate connections create \
  --name saleslens-api-key \
  --auth-type apikey \
  --header X-Api-Key \
  --credential-type team

# Add team credential
orchestrate credentials add \
  --connection saleslens-api-key \
  --value <SALESLENS_API_KEY>

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

# Verify
orchestrate tools list | grep saleslens
```

---

## Troubleshooting

**"Connection failed. Check the information and try again."**  
→ Orchestrate's connection test sends a request to the Server URL and expects HTTP `200`. Most likely causes:
- App returning a `302` redirect — image is outdated (pre-1.0.2). Redeploy: `ibmcloud ce application update --name saleslens-api --image de.icr.io/sales-lens-workshop/saleslens:1.0.2`
- Trailing slash in Server URL — use the URL without a trailing `/`
- API Key field has the header name included — enter only the value: `workshop-demo-key`
- Verify the app is live: `curl <SALESLENS_ENDPOINT_URL>/health`

**Connection ID already exists**  
→ Someone already created it. Click the existing `saleslens-api-key` connection, verify it has API Key + Team credentials set, and skip Pre-Steps 1–2.

**File upload fails or no operations appear**  
→ Verify `saleslens-openapi-spec.json` is valid JSON: `python3 -m json.tool saleslens-openapi-spec.json`  
→ The file must start with `{` — not HTML.

**Only some operations appear in the list**  
→ Ensure the spec version is OpenAPI 3.0.x (not Swagger 2.x).

**401 Unauthorized when the agent calls a tool**  
→ The connection was not associated during import. Open each tool → **Edit details** → confirm the connection shows `SalesLens API Key`.  
→ Verify the team credential status is ✅ in the Live environment under **Manage → Security → Team credentials**.

**`getCrmVarianceContext` returns empty `slipped_deals`**  
→ Valid dept IDs: `DEPT-NA-SALES`, `DEPT-EMEA-SALES`, `DEPT-APAC-SALES`, `DEPT-LATAM-SALES`  
→ Valid period format: `2024-01` (not `January 2024`). Test at `<APP_URL>/docs`.

---

## Next

→ **[Lab 2.3 — Create the PA Data Agent](../lab-02-3-pa-agent/README.md)**
