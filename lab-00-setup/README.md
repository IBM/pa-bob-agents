# Lab 0 — Environment Setup & MCP Configuration

**Duration:** 15–20 minutes
**Goal:** Download and install the Planning Analytics Bob mode and skill, configure the MCP connection to your TechZone environment, and validate all access before the hands-on labs begin.

---

## Overview

Before the hands-on labs begin, you need five things working:

| # | Task | Step |
|---|------|------|
| 0 | Sign up for IBM Bob and **install the IDE** | [Step 0](#step-0--sign-up-and-install-ibm-bob-ide) |
| 1 | Download and install the **Planning Analytics Bob mode** | [Step 1](#step-1--download-the-planning-analytics-bob-mode--skill) |
| 2 | Install the **Planning Analytics Bob skill** | [Step 2](#step-2--install-the-planning-analytics-skill) |
| 3 | Configure the **Planning Analytics MCP connection** in Bob | [Step 3](#step-3--configure-the-planning-analytics-mcp-connection) |
| 4 | Validate MCP connectivity and **watsonx Orchestrate** access | [Steps 4–5](#step-4--validate-the-mcp-connection) |

Raise your hand if you get stuck at any point — facilitators are available throughout this session.

---

## Step 0 — Sign Up and Install IBM Bob IDE

> **Skip this step if you already have IBM Bob IDE installed and your account activated.**

### Step 0a — Sign up and activate your account

1. Go to the **[IBM Bob Sign-Up Page](https://register.bob.ibm.com)** and enter the exact corporate email address where you received this workshop invitation.
2. Fill out your details and create a password to set up your IBMid credentials.
3. Enter the verification code sent to your email to activate the account.

### Step 0b — Download and launch the IDE

1. Download the workspace client from the **[IBM Bob Download Page](https://bob.ibm.com/download)**.
2. Install the package for your operating system (Mac / Windows / Linux).
3. Launch the application. On first open, a browser window will appear prompting you to authenticate.
4. Sign in with the IBMid credentials you created in Step 0a to unlock your enterprise workspace.

✅ **Success:** IBM Bob IDE opens and you are logged in.

---
## Skill & Modes are Optional
## Step 1 — Download the Planning Analytics Bob Mode & Skill

The Planning Analytics **mode** and **skill** are published in the IBM Building Blocks repository on GitHub. Download both assets from the link below before continuing.

### 📦 Download Source

> **Repository:** [ibm-self-serve-assets / building-blocks — optimize/budget-and-forecasting](https://github.com/ibm-self-serve-assets/building-blocks/tree/main/optimize/budget-and-forecasting)

#### Assets to download

| Asset | File | Location in repo | What it provides |
|-------|------|-----------------|-----------------|
| **Bob Mode** | `planning-analytics-mode.zip` | `bob-modes/base-modes/` | Activates TM1 expertise, MCP workflows, and financial analysis patterns in Bob |
| **Bob Skill** | `planning-analytics-skill.zip` | `bob-skills/` | Adds natural language query, variance analysis, outlier detection, and reporting capabilities |

#### How to download individual files from GitHub

1. Navigate to the repo: `https://github.com/ibm-self-serve-assets/building-blocks/tree/main/optimize/budget-and-forecasting`
2. Click into the folder containing the file (e.g. `bob-modes/base-modes/`)
3. Click the filename (`planning-analytics-mode.zip`)
4. On the file detail page, click **Download raw file** (the download icon, top-right)
5. Repeat for `planning-analytics-skill.zip` in the `bob-skills/` folder

> **Tip — Download the whole folder at once:** If you have `git` available, you can use sparse checkout to pull just this folder:
> ```bash
> git clone https://github.com/ibm-self-serve-assets/building-blocks.git \
>   --no-checkout --depth=1 /tmp/bb && \
>   cd /tmp/bb && \
>   git sparse-checkout init --cone && \
>   git sparse-checkout set optimize/budget-and-forecasting && \
>   git checkout
> ```
> Both ZIP files will be in `/tmp/bb/optimize/budget-and-forecasting/`.

---

### Step 1a — Install the Planning Analytics Bob Mode

The mode configures Bob with deep TM1 expertise and activates the correct MCP tool workflows for Planning Analytics tasks.

**Installation steps:**

1. Open **IBM Bob IDE** and open the **workshop folder** (`pa-bob-orchestrate-workshop/`) as the workspace root.
2. Create the required Bob directories if they do not exist:
   ```bash
   mkdir -p .bob/modes
   ```
3. Extract the mode ZIP into the modes directory:
   ```bash
   unzip /path/to/planning-analytics-mode.zip -d .bob/modes/planning-analytics
   ```
4. Move `custom_modes.yaml` up to the `.bob/` directory — **this is required for Bob to detect the mode**:
   ```bash
   mv .bob/modes/planning-analytics/custom_modes.yaml .bob/custom_modes.yaml
   ```
   After this step you should see:
   ```
   .bob/
   ├── custom_modes.yaml
   └── modes/
       └── planning-analytics/
           └── rules-planning-analytics/
               ├── 1_overview.xml
               ├── 2_mcp_tools_reference.xml
               ├── 3_workflows.xml
               ├── 4_best_practices.xml
               ├── 5_response_patterns.xml
               └── 6_troubleshooting.xml
   ```
5. Restart Bob: press `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows) → **`Bob: Restart`**.
   If the command is not available, close and reopen IBM Bob IDE — this has the same effect.

---

### Step 1b — Activate the Planning Analytics Mode

1. In the Bob panel, click the **mode selector** (bottom-left of the chat panel).
2. Select **📊 Planning Analytics** from the list.
3. Confirm the mode name shows `Planning Analytics` in the selector.

✅ **Success:** The mode selector shows `📊 Planning Analytics`.
❌ **Problem:** If the mode is not listed, see [Troubleshooting — Mode Not Appearing](#mode-not-appearing-in-the-mode-selector).

> **What this mode gives you:**
> - TM1 cube modeling expertise
> - Financial analysis workflow patterns (variance, outlier, key driver)
> - Adaptive MCP tool selection (natural language vs MDX)
> - Executive-ready response formatting
> - TurboIntegrator process guidance

---

## Step 2 — Install the Planning Analytics Skill

The Bob skill extends the Planning Analytics mode with business-friendly query patterns, variance analysis templates, and executive reporting capabilities.

**Installation steps:**

1. Create the Bob skills directory:
   ```bash
   mkdir -p .bob/skills
   ```
2. Extract the skill ZIP:
   ```bash
   unzip /path/to/planning-analytics-skill.zip -d .bob/skills/
   ```
   After extraction you should see:
   ```
   .bob/
   └── skills/
       └── planning-analytics/
           ├── SKILL.md
           ├── README.md
           └── USAGE-GUIDE.md
   ```
3. Restart Bob to load the skill: `Cmd+Shift+P` → **`Bob: Restart`**. If the command is not available, close and reopen IBM Bob IDE — this has the same effect.

**Verify the skill is loaded:**

In the Bob chat panel (in Planning Analytics mode), send:
```
What skills do you have available?
```

Bob should list `planning-analytics` as an active skill.

> **What this skill adds:**
> - Natural language financial queries (`"Show Q1 revenue by department"`)
> - Budget vs Actual variance templates
> - Outlier detection and key driver analysis patterns
> - Executive summary generation
> - PDF report generation capability

---

## Step 3 — Configure the Planning Analytics MCP Connection

Bob connects to your Planning Analytics TechZone environment using the **Model Context Protocol (MCP)**. You need to add the MCP server configuration before any data queries will work.

### Step 3a — Generate Your Base64 Credentials Using Bob

The MCP server requires credentials in the format `Basic <base64(username:password)>`. Use Bob to generate this — no terminal needed.

In the Bob chat panel, send:

```
Run this shell command and give me the output:
echo -n "<PA_USERNAME>:<PA_PASSWORD>" | base64
```

Replace `<PA_USERNAME>` and `<PA_PASSWORD>` with the username and password provided by your facilitator.

**Bob will return something like:**
```
YWRtaW46eW91ci1wYXNzd29yZC1oZXJl
```

📋 **Copy this value** — you will paste it as `<YOUR_BASE64_CREDENTIALS>` in the next step.

> **Why Base64?** The Planning Analytics MCP server uses HTTP Basic Auth. The `Authorization: Basic <value>` header requires credentials encoded as `base64(username:password)`. Bob runs the command locally on your machine — your credentials are never sent anywhere.

---

### Step 3b — Open MCP Settings

In IBM Bob IDE, press `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows) and run **`Bob: Open MCP Settings`**.

This opens the `mcp.json` configuration file. If the file does not exist yet, Bob will create it.

---

### Step 3c — Add the MCP Server Configuration

Replace the contents of `mcp.json` with the configuration below.

> **Credentials:** Your facilitator will provide `TECHZONE_HOST`, `PORT`, and `TENANT_ID`. Use the Base64 value you generated in Step 3a for `BASE64_CREDENTIALS`.

```json
{
  "mcpServers": {
    "ibm-pa-tools-tz-server": {
      "type": "streamable-http",
      "url": "http://<TECHZONE_HOST>:<PORT>/api/<YOUR_TENANT_ID>/v0/agentic-ai/analysis/mcp",
      "headers": {
        "Authorization": "Basic <YOUR_BASE64_CREDENTIALS>",
        "Accept": "text/event-stream",
        "Cache-Control": "no-cache"
      },
      "timeout": 300,
      "disabled": false,
      "alwaysAllow": [
        "update_tm1_process",
        "execute_tm1_processes_asynchronously",
        "create_tm1_process",
        "get_tm1_server_process_status",
        "get_tm1_server_process_execution_error_logs",
        "delete_tm1_process",
        "get_tm1_processes",
        "get_tm1_process_details"
      ]
    },
    "ibm-pa-tools-tz-cube": {
      "type": "streamable-http",
      "url": "http://<TECHZONE_HOST>:<PORT>/api/<YOUR_TENANT_ID>/v0/agentic-ai/cube/mcp",
      "headers": {
        "Authorization": "Basic <YOUR_BASE64_CREDENTIALS>",
        "Accept": "text/event-stream",
        "Cache-Control": "no-cache"
      },
      "timeout": 300,
      "disabled": false,
      "alwaysAllow": [
        "get_data_from_data_explorer",
        "get_cubes_that_may_answer_query",
        "lookup_potential_members",
        "get_cube_sample_members",
        "get_cube_dimensions",
        "execute_mdx_and_get_view",
        "list_cubes_with_ai_analysis_metadata",
        "get_tm1_cubes",
        "create_tm1_cube",
        "get_available_tm1_servers",
        "generate_exploration_analysis_report",
        "perform_impact_analysis",
        "perform_outlier_detection",
        "get_outlier_summary",
        "get_impact_analysis_summary"
      ]
    }
  }
}
```

> **Credentials reminder:** Paste the Base64 string you generated in Step 3a as the value for `Authorization: "Basic <...>"`.

---

### Step 3d — Save and Reload

1. Save the file (`Cmd+S` / `Ctrl+S`).
2. Restart Bob: press `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows) → **`Bob: Restart`**.
3. Wait **10–15 seconds** for the connection to establish.

> **Note:** The `Bob: Restart MCP Servers` command has been removed. `Bob: Restart` now restarts Bob and reloads all MCP server connections together.

---

## Step 4 — Validate the MCP Connection

In the Bob chat panel (Planning Analytics mode active), send:

```
List all available TM1 servers
```

**Expected response:** Bob calls `get_available_tm1_servers` and returns one or more server names — for example `DemoGuide` or the TechZone server name shared by your facilitator.

✅ **Success:** A server name is returned.
❌ **Problem:** See [Troubleshooting](#troubleshooting) below.

---

## Step 5 — Validate watsonx Orchestrate Access

1. Open a browser and go to your watsonx Orchestrate tenant URL (provided by your facilitator).
2. Sign in with your IBM ID or the workshop credentials provided.
3. Confirm you can see the **Agents** section in the left navigation.

> **Note:** You will not configure an Orchestrate agent until Lab 2. This step is access validation only.

---

## Validation Checklist

Before moving to Lab 1, confirm **all** items are checked:

- [ ] `planning-analytics-mode.zip` downloaded from the Building Blocks repo
- [ ] Mode extracted to `.bob/modes/planning-analytics/`
- [ ] Bob restarted and **📊 Planning Analytics** mode is visible and active
- [ ] `planning-analytics-skill.zip` downloaded and extracted to `.bob/skills/`
- [ ] Bob confirms skill is loaded when asked
- [ ] `mcp.json` saved with TechZone credentials from facilitator
- [ ] Bob MCP servers restarted
- [ ] `List all available TM1 servers` returns at least one server name
- [ ] watsonx Orchestrate tenant is accessible in browser

---

## Troubleshooting

### Mode not appearing in the mode selector

| Check | Action |
|-------|--------|
| Is `.bob/modes/planning-analytics/custom_modes.yaml` present? | Re-extract the ZIP — the `custom_modes.yaml` must be at `.bob/modes/planning-analytics/` |
| Did you restart Bob after extraction? | Run `Cmd+Shift+P` → `Bob: Restart` |
| Is IBM Bob IDE using the workshop folder as the workspace root? | Open the `pa-bob-orchestrate-workshop/` folder directly — not a parent folder |

### Skill not loading

| Check | Action |
|-------|--------|
| Is `.bob/skills/planning-analytics/SKILL.md` present? | Re-extract the skill ZIP to `.bob/skills/` |
| Did you restart Bob after extraction? | Run `Cmd+Shift+P` → `Bob: Restart` |

### MCP connection fails / no servers returned

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| `Connection refused` | Wrong host or port in URL | Confirm URL with facilitator |
| `401 Unauthorized` | Incorrect or malformed credentials | Re-check Base64 encoding; ensure format is `APIKey:your-key` before encoding |
| `Timeout` | TechZone environment not provisioned | Ask facilitator to verify TechZone instance is running |
| Servers show as disconnected in Bob | `mcp.json` not saved or servers not restarted | Save file then run `Bob: Restart` |

### watsonx Orchestrate login fails

Confirm the tenant URL and your IBM ID with the facilitator. Trial access must be pre-provisioned — it cannot be created during the session.

---

## Quick Reference — Download Links

| Asset | Repository Path | Direct Download |
|-------|----------------|----------------|
| **PA Bob Mode** | `optimize/budget-and-forecasting/bob-modes/base-modes/planning-analytics-mode.zip` | [Browse on GitHub →](https://github.com/ibm-self-serve-assets/building-blocks/tree/main/optimize/budget-and-forecasting/bob-modes/base-modes) |
| **PA Bob Skill** | `optimize/budget-and-forecasting/bob-skills/planning-analytics-skill.zip` | [Browse on GitHub →](https://github.com/ibm-self-serve-assets/building-blocks/tree/main/optimize/budget-and-forecasting/bob-skills) |
| **MCP Config template** | `optimize/budget-and-forecasting/assets/mcp.json` | [Browse on GitHub →](https://github.com/ibm-self-serve-assets/building-blocks/tree/main/optimize/budget-and-forecasting/assets) |
| **FPA Sample Data** | `optimize/budget-and-forecasting/assets/FPA_Variance_Analysis/` | [Browse on GitHub →](https://github.com/ibm-self-serve-assets/building-blocks/tree/main/optimize/budget-and-forecasting/assets/FPA_Variance_Analysis) |
| **PA MCP Tools Reference** | IBM Documentation | [Planning Analytics MCP Tools →](https://www.ibm.com/docs/en/planning-analytics/2.1.0?topic=agent-mcp-tools) |

---

## What's Next

You are now set up and ready for the hands-on labs. Continue to:

**[→ Lab 1: Bob + Planning Analytics via MCP](../lab-01-bob-planning-analytics-mcp/README.md)**
