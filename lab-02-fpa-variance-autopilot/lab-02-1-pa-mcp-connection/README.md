# Lab 2.1 — Configure the Planning Analytics MCP Connection

**Duration:** ~10 minutes  
**Prerequisite:** [Lab 2.0](../lab-02-0-fpa-dataset-catchup/README.md) ✅ (FPA dataset confirmed)  
**IBM Docs:**
- [Creating and managing connections](https://www.ibm.com/docs/en/watsonx/watson-orchestrate/base?topic=credentials-creating-managing-connections)
- [Managing team credentials](https://www.ibm.com/docs/en/watsonx/watson-orchestrate/base?topic=credentials-managing-team)

---

## Goal

Configure the **Planning Analytics Connection** and store **Team credentials** in watsonx Orchestrate so that agents can securely authenticate with the Planning Analytics MCP server.

> **UI note:** There is no **Integrations** menu in the current Orchestrate UI. Connection setup is performed in **Manage → Security → Connections** and **Manage → Security → Team credentials**. You will register the MCP server and attach its tools to the agent in **Lab 2.2**.

By the end of this lab you will have:
- A `planning-analytics-basic` connection created with Basic Auth
- Team credentials (PA username/password) stored in the **Live** environment
- Connection status verified with a green tick ✅

---

## Background — Connections vs Credentials

| Concept | What it is | Where managed |
|---------|-----------|---------------|
| **Connection** | Defines the auth method (Basic Auth, API Key, OAuth…) and connection ID | **Manage → Security → Connections** |
| **Team credentials** | The shared username/password stored against a connection — available to all users | **Manage → Security → Team credentials** |
| **Member credentials** | Personal per-user credentials — each user stores their own | **Profile icon → Settings → Member credentials** |

> **Why Team credentials for this workshop?**  
> The Planning Analytics server is a **shared instance** — all participants use the same hostname and credentials provided by the facilitator. Team credentials are shared across all users of the connection, which is exactly right here. Member credentials would require every participant to individually enter their own PA login — use those in production when each analyst has a personal PA account.

---

## Step 1 — Create the Connection

1. From the main menu, click **Manage → Security**.  
   *(On-premises: use **Manage → Connections**.)*
2. Click the **Connections** tab.
3. Click **Add connection**.
4. Under **Define connection details**, enter:

| Field | Value |
|-------|-------|
| **Connection ID** | `planning-analytics-basic` |
| **Display name** | `Planning Analytics (Basic Auth)` |

5. Click **Next**.
6. Under **Configure draft connection**:
   - **Authentication type** → select **Basic Auth**
   - **Credential type** → select **Team credentials** *(shared by all workshop participants)*
   - Leave SSO off.
7. Click **Next**.
8. Under **Configure live connection**:
   - Click **Paste draft configuration** to copy the draft settings to live.
9. Click **Add connection**.

The connection now appears in the Connections list with a ✅ status indicator.

---

## Step 2 — Add Team Credentials

Now store the actual Planning Analytics username and password against the connection.

1. Still in **Manage → Security**, click the **Team credentials** tab.
2. Select the **Live** environment (or **Draft** if you want to test first).
3. Click **Add team credential**.
4. In the **Select a connection** dropdown, choose `Planning Analytics (Basic Auth)`.
5. Enter the credentials:

| Field | Value |
|-------|-------|
| **Username** | *(provided by your facilitator)* |
| **Password** | *(provided by your facilitator)* |

6. Click **Connect and save**.

The credential appears in the Team credentials list — status shows the connection name, auth type (Basic Auth), and last updated date.

> **Note:** Team credentials are visible and shared by all users in the workspace — any agent using the `planning-analytics-basic` connection will authenticate with these credentials automatically.

---

## ✅ Checkpoint

Before moving to Lab 2.2, confirm:

- [ ] `planning-analytics-basic` connection created (Basic Auth, Team credentials)
- [ ] Team credentials added — PA username + password stored in Live environment
- [ ] Credential status shows ✅ in **Manage → Security → Team credentials**

> **Stop here if the status is not green.** Lab 2.1 is the only place these credentials are verified — the next live tool call is at the end of Lab 2.2, so a wrong password surfaces ~30 minutes later. Resolve it now with your facilitator.

---

## ADK Alternative

```bash
# Install the ADK
pip install ibm-watsonx-orchestrate

# Authenticate
orchestrate env add --env-name workshop \
  --url https://<YOUR_ORCHESTRATE_TENANT>.ai.ibm.com \
  --api-key <YOUR_API_KEY>
orchestrate env activate workshop

# Create connection
orchestrate connections create \
  --name planning-analytics-basic \
  --auth-type basic \
  --credential-type team

# Add team credentials
orchestrate credentials add \
  --connection planning-analytics-basic \
  --username <PA_USER> \
  --password <PA_PASSWORD>
```

---

## Troubleshooting

**Can't find Manage → Security**  
→ This path is available on AWS and IBM Cloud tenants. On-premises: use **Manage → Connections** instead. Both lead to the same Connections and Credentials tabs.

**Connection ID already exists**  
→ Someone else in the workshop already created it. Click the existing `planning-analytics-basic` connection and verify it has Basic Auth + Team credentials set. If correct, verify credentials in Step 2 and proceed.

**Credential shows ❌**  
→ Click the Options menu → **Edit** on the credential in **Manage → Security → Team credentials** and re-enter the password provided by your facilitator.

---

## Next

→ **[Lab 2.2 — Create the PA Data Agent](../lab-02-2-pa-agent/README.md)**
