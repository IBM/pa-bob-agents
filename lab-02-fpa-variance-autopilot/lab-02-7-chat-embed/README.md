# Lab 2.7 (Optional) — Embed the Autopilot in a Branded Chat Page

**Duration:** ~10 minutes  
**Prerequisite:** [Lab 2.5](../lab-02-5-orchestrator/README.md) ✅ (orchestrator agent active)  

**Reference:** [developer.watson-orchestrate.ibm.com/webchat](https://developer.watson-orchestrate.ibm.com/webchat/overview)  
**Customisation:** [wxo Embed UI Configuration](https://developer.watson-orchestrate.ibm.com/webchat/ui_configuration)

---

## Goal

Embed the FP&A Variance Autopilot into a branded HTML page using the watsonx Orchestrate **wxoLoader** embed widget — no REST API calls, no tokens, no backend required.

By the end of this lab you will have:
- `saleslens-wxo-embed.html` running locally in a browser
- The SalesLens AI branded chat interface powered by your orchestrator agent
- Understanding of how to embed any watsonx Orchestrate agent into a web page

---

## Background — wxoLoader Embed

watsonx Orchestrate provides a JavaScript loader (`wxoLoader.js`) that renders a fully functional chat widget inside any HTML page. It handles authentication, WebSocket connections, and the Orchestrate session internally — you only provide configuration.

```
[Browser loads saleslens-wxo-embed.html]
        │
        ▼
wxoLoader.js  ──→  watsonx Orchestrate (eu-de)
  orchestrationID                    │
  agentId                            ▼
        │         FP&A Variance Autopilot (Orchestrator)
        │               ├── PA Data Agent
        │               ├── CRM Context Agent
        │               └── ERP Context Agent
        │                            │
        └────────── chat UI ─────────┘
```

---

## Step 1 — Enable Anonymous Embed on Your Agent

Before the embed page can load the chat widget, the agent must allow anonymous (public) access.

1. Go to **watsonx Orchestrate** → open your **FP&A Variance Autopilot** orchestrator agent
2. Click **Deploy** → **Embed** tab
3. Under **Chat user identity**, leave the **Public key** field **empty**
4. Save

> If a public key is registered, the embed requires a signed JWT token on every request. Leave it blank for the workshop demo.

---

## Step 2 — Get Your Embed Values

From the same **Deploy → Embed** tab, copy:

| Value | Where to find it | Example |
|-------|-----------------|---------|
| **Agent ID** | URL of the agent edit page — last path segment | `<YOUR_AGENT_ID>` (provided by your facilitator) |
| **orchestrationID** | Embed code snippet shown on the Deploy tab | `<YOUR_ORCHESTRATION_ID>` (provided by your facilitator) |
| **hostURL** | Your Orchestrate region URL | `<WXO_HOST_URL>` (provided by your facilitator) |

---

## Step 3 — Open the Embed Page

Open the file directly in your browser:

```bash
# macOS
open lab-02-fpa-variance-autopilot/lab-02-7-chat-embed/saleslens-wxo-embed.html

# Windows
start lab-02-fpa-variance-autopilot/lab-02-7-chat-embed/saleslens-wxo-embed.html
```

The page loads with:
- A branded header — **IBM Planning Analytics × watsonx Orchestrate**
- A hero landing panel on the left with agent badges and suggested prompts
- The wxo chat widget on the right

---

## Step 4 — Try a Query

Once the chat widget loads, try one of the suggested prompts:

```
Run variance analysis for January 2024
Analyse APAC Sales — March 2024
Why did NA Sales miss budget in Jan 2024?
```

The orchestrator routes the query across PA, CRM, and ERP agents and returns a CFO-ready explanation.

---

## How the Config Works

The embed is configured in the `<script>` block at the bottom of [`saleslens-wxo-embed.html`](saleslens-wxo-embed.html):

```js
window.wxOConfiguration = {
  orchestrationID: "<YOUR_ORCHESTRATION_ID>",
  hostURL: "<WXO_HOST_URL>",
  rootElementID: "root",
  deploymentPlatform: "ibmcloud",
  crn: "<your-crn>",
  chatOptions: {
    agentId: "<your-agent-id>"
  },
  layout: {
    form: "float",
    height: "900px",
    width: "900px"
  }
};
```

| Property | Description |
|----------|-------------|
| `orchestrationID` | Identifies your Orchestrate tenant |
| `rootElementID` | The `id` of the HTML div the widget mounts into |
| `layout.form` | `float` renders the chat panel inline in the root element |
| `layout.height/width` | Size of the chat panel |

---

## ✅ Checkpoint

- [ ] Agent embed security has no public key (anonymous access)
- [ ] `saleslens-wxo-embed.html` opens in browser without errors
- [ ] Chat widget appears on the right side of the page
- [ ] At least one variance query returns a response from the orchestrator

---

## Troubleshooting

**Chat widget doesn't appear / blank right panel**  
→ Check browser console for errors. Most likely cause: the agent's embed security has a public key registered — clear it in Orchestrate Deploy → Embed.

**"Authentication Error — This content couldn't be loaded"**  
→ A public key is registered in Orchestrate but no `identityToken` is being passed. Remove the public key from the Embed security settings to use anonymous access.

**Chat appears but agent doesn't respond**  
→ Confirm the orchestrator agent is deployed and active in Orchestrate. Check `agentId` matches the agent's ID exactly.

---

## Next

You have completed all sub-labs in the FP&A Variance Autopilot series.

→ **[Lab 2.8 (Bonus) — Get Started with watsonx Orchestrate ADK](../lab-02-8-adk/README.md)**  
→ **[Return to Lab 2 overview](../README.md)**  
→ **[Continue to Session 3 — Bring Your Own Scenario](../../session-03-your-scenario/README.md)**
