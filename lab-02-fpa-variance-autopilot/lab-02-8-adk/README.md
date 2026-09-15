# Lab 2.8 — Get Started with watsonx Orchestrate ADK

> **⚠️ Standalone bonus — not part of the core lab.**
> Do not run this as part of the main Lab 2 flow. Work through this independently after the session, or if you have extra time after completing all core exercises.

**Duration:** ~30 minutes  
**Prerequisite:** [Lab 2.5](../lab-02-5-orchestrator/README.md) ✅ (or completed core labs)  
**Reference:** [Get started with watsonx Orchestrate ADK — IBM Developer](https://developer.ibm.com/learningpaths/get-started-watsonx-orchestrate/develop-agents-adk/)

---

## Goal

Install the watsonx Orchestrate **Agent Development Kit (ADK)**, connect it to your SaaS instance, and deploy your first agent entirely from the CLI — no UI required.

## Prerequisites

- Basic familiarity with terminal / bash commands
- Python 3.11–3.13 installed
- Access to a watsonx Orchestrate instance (workshop tenant or [30-day free trial](https://www.ibm.com/products/watsonx-orchestrate))

---

## Background: Why ADK?

The ADK gives developers full control to:
- Define agents in YAML or JSON files — version-controlled and repeatable
- Create custom Python tools not exposed via OpenAPI
- Manage the full agent lifecycle (import, list, delete) with a few CLI commands
- Embed agent deployment in CI/CD pipelines

---

## Step 1 — Check Python Version

The ADK requires **Python 3.11–3.13**. Check your version:

```bash
python --version
```

If your version is outside the 3.11–3.13 range, install a compatible version from [python.org](https://www.python.org/downloads/) or use `pyenv` on macOS/Linux.

Also confirm `pip` is available:

```bash
pip --version
```

---

## Step 2 — Create a Virtual Environment

Create and activate a Python virtual environment to keep ADK dependencies isolated:

```bash
python -m venv venv
```

Activate it:

- **macOS / Linux:**
  ```bash
  source venv/bin/activate
  ```
- **Windows:**
  ```bash
  venv\Scripts\activate
  ```

You should see `(venv)` prefixed in your terminal prompt.

---

## Step 3 — Install the ADK

With the virtual environment active:

```bash
pip install ibm-watsonx-orchestrate
```

Verify the installation:

```bash
orchestrate --help
```

You should see a list of available ADK CLI commands.

---

## Step 4 — Connect to Your watsonx Orchestrate Instance

You need your instance's **Service Instance URL** and an **API Key**.

**Get your credentials:**

1. Sign in to your watsonx Orchestrate instance.
2. Click the **Profile icon** (top-right) → **Settings**.
3. Go to the **API details** tab.
4. Copy the **Service instance URL**.
5. Click **Generate API key** — copy it immediately and save it (you won't see it again).

**Register and activate the environment:**

```bash
orchestrate env add -n workshop \
  -u <SERVICE_INSTANCE_URL> \
  --type mcsp \
  --activate
```

Replace `<SERVICE_INSTANCE_URL>` with the URL you copied. When prompted, paste your API Key and press Enter.

A confirmation message will appear showing the environment is created and activated.

---

## Step 5 — Define Your First Agent (Hello World)

Create a file named `hello-world-agent.yaml` with the following content:

```yaml
spec_version: v1
kind: native
name: Hello_World_Agent
description: A simple Hello World agent
instructions: >
  You are a test agent created for the watsonx Orchestrate ADK tutorial.
  When the user asks "who are you", respond with: I'm the Hello World Agent.
  Congratulations on completing the Getting Started with watsonx Orchestrate ADK tutorial!
llm: watsonx/meta-llama/llama-3-2-90b-vision-instruct
style: default
collaborators: []
tools: []
```

---

## Step 6 — Import and Verify the Agent

Navigate to the directory containing your YAML file and import it:

```bash
orchestrate agents import -f hello-world-agent.yaml
```

Confirm it was imported:

```bash
orchestrate agents list
```

**Expected:**
```
Hello_World_Agent    A simple Hello World agent    active
```

---

## Step 7 — Test the Agent in the Orchestrate UI

1. Go to your watsonx Orchestrate SaaS instance.
2. Open the navigation menu (top-left) → **Build** → **Agent Builder**.
3. Click **Hello_World_Agent** to open it.
4. In the test chat on the right, type:
   ```
   Who are you?
   ```
5. The agent should respond:
   > *I'm the Hello World Agent. Congratulations on completing the Getting Started with watsonx Orchestrate ADK tutorial!*

✅ **Success:** Your first ADK-deployed agent is live.

---

## Try It with Bob — Generate a PA Agent YAML

Now that you know the YAML schema, ask Bob to generate one for you. Paste this prompt into the Bob chat panel:

```
I've just learned the watsonx Orchestrate ADK agent YAML schema.
Generate a ready-to-import agent YAML for a Planning Analytics use case with these properties:

- Name: PA_Variance_Agent
- Purpose: Query the FPA_Variance TM1 cube for budget vs actual variances and return a plain-language summary
- LLM: watsonx/meta-llama/llama-3-2-90b-vision-instruct
- Style: default
- No collaborators or tools yet (I'll add MCP tools after import)

Follow the spec_version: v1 / kind: native schema.
Include clear instructions that tell the agent to focus on material variances (>10% or >$50K).
```

Bob will return a complete, valid YAML you can save as `pa-variance-agent.yaml` and import directly with:

```bash
orchestrate agents import -f pa-variance-agent.yaml
```

---

## Next Steps with ADK

Now that your environment is set up and your first agent is running, here are ways to go further:

| What to explore | How |
|----------------|-----|
| See all ADK commands | `orchestrate --help` |
| Import the FP&A agent from this workshop | `orchestrate agents import -f lab-02-fpa-variance-autopilot/assets/fpa-variance-agent.yaml` |
| Add tools to an agent | Define tools in YAML and use `orchestrate tools import` |
| Read the full ADK docs | [IBM Developer — ADK Tutorial](https://developer.ibm.com/learningpaths/get-started-watsonx-orchestrate/develop-agents-adk/) |
| Join the community | [watsonx Orchestrate Community](https://community.ibm.com/community/user/watsonxai/communities/community-home?CommunityKey=1b4d3e0f-d8d1-4f47-be87-d803e15e8b0e) |

---

## Navigation

- [← Lab 2.7 (Optional) — Branded Chat Embed](../lab-02-7-chat-embed/README.md)
- [← Lab 2 Overview](../README.md)
- [→ Session 3 — Bring Your Own Scenario](../../session-03-your-scenario/README.md)
