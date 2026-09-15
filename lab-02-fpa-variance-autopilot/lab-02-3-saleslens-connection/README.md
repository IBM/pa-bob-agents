# Lab 2.3 — Configure the SalesLens API Connection

**Duration:** ~10 minutes  
**Prerequisite:** [Lab 2.2](../lab-02-2-pa-agent/README.md) ✅ (PA Data Agent created)  
**IBM Docs:**
- [Creating and managing connections](https://www.ibm.com/docs/en/watsonx/watson-orchestrate/base?topic=credentials-creating-managing-connections)
- [Managing team credentials](https://www.ibm.com/docs/en/watsonx/watson-orchestrate/base?topic=credentials-managing-team)

---

## Goal

Configure the **SalesLens API Connection** and store **Team credentials** in watsonx Orchestrate so that CRM and ERP agents can authenticate with the SalesLens Mock API.

> **UI note:** Connection setup is performed in **Manage → Security → Connections** and **Manage → Security → Team credentials**. You will import the OpenAPI spec and attach the CRM and ERP tools to their respective agents in **Lab 2.4**.

By the end of this lab you will have:
- A `saleslens-api-key` connection created with API Key authentication
- Team credentials (`<SALESLENS_API_KEY>`) stored in the **Live** environment
- Connection status verified with a green tick ✅

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
| **OpenAPI spec file** | `saleslens-openapi-spec.json` *(located in `lab-02-4-crm-erp-agents/`)* |
| **Swagger UI** | `<APP_URL>/docs` |
| **Demo UI** | `<APP_URL>/demo` |

---

## Step 1 — Create the Connection

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

## Step 2 — Add Team Credentials

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

## ✅ Checkpoint

Before moving to Lab 2.4, confirm:

- [ ] `saleslens-api-key` connection created (API Key, Team credential)
- [ ] Team credential added — `<SALESLENS_API_KEY>` stored in Live environment, status ✅

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
```

---

## Troubleshooting

**"Connection failed. Check the information and try again."**  
→ Orchestrate's connection test sends a request to the Server URL and expects HTTP `200`. Most likely causes:
- App returning a `302` redirect — image is outdated (pre-1.0.2). Redeploy with the latest image (ask your facilitator for the image tag)
- Trailing slash in Server URL — use the URL without a trailing `/`
- API Key field has the header name included — enter only the key value
- Verify the app is live: `curl <SALESLENS_ENDPOINT_URL>/health`

**Connection ID already exists**  
→ Someone already created it. Click the existing `saleslens-api-key` connection, verify it has API Key + Team credentials set, and proceed to Lab 2.4.

---

## Next

→ **[Lab 2.4 — Create the CRM Agent & ERP Agent](../lab-02-4-crm-erp-agents/README.md)**
