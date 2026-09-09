# Your Scenario

**Duration:** 15 minutes (canvas 5 min · Bob prompt 8 min · write your sentence 2 min)
**Format:** Facilitated discussion — no hands-on required  
**Prerequisite:** [Lab 2](../lab-02-fpa-variance-autopilot/README.md) ✅ completed

---

## What This Session Is

You have built the FP&A Variance Autopilot. Now map the same pattern to your own organisation. A facilitator will circulate. Bob is open.

---

## Inspiration — What Others Have Built

Use this table to spark ideas before you fill in the canvas below.

| Scenario | Planning Object | Root Cause System | Trigger |
|----------|----------------|-------------------|---------|
| Sales Performance Autopilot | Revenue by rep, region, product | CRM deal pipeline | Monthly actuals close |
| Headcount Variance Monitor | HC and comp by department | HRIS attrition + open positions | Bi-weekly payroll run |
| Capex Tracker | Project spend vs approved budget | ERP purchase orders + invoices | Weekly actuals posting |
| Manufacturing Cost Sentinel | Production costs by plant | MES downtime and scrap rates | Daily production close |
| Marketing ROI Autopilot | Campaign spend vs pipeline | CRM influenced pipeline | Campaign close |
| Cash Flow Early Warning | Cash actuals vs forecast | AP/AR aging from ERP | Daily bank reconciliation |

---

## The Canvas 

Answer these three questions for a Planning Analytics use case from your own work. One sentence each. Write them down — you will paste them into Bob next.

**1. What is the planning object?**
> The cube / data you would monitor.  
> *e.g. Headcount and comp by department · Capex by project · Manufacturing costs by plant*

**2. What is the variance story?**
> The comparison that matters.  
> *e.g. Budget vs Actual at month-end · Forecast vs Actual mid-month · YoY performance*

**3. Where does the root cause live?**
> The external system that explains the variance.  
> *e.g. HRIS (open positions, attrition) · ERP (POs, invoices) · Operations (downtime, yield)*

---

## The Bob Prompt 

Paste this into Bob with your three answers filled in:

```
I want to adapt the FP&A Variance Autopilot for my own scenario:

- Planning object: [your answer to Q1]
- Variance story:  [your answer to Q2]
- Root cause system: [your answer to Q3]

Based on this:
1. What would the agent description look like for this use case?
2. What are the 2–3 most important changes to make to the
   orchestrator agent instructions?
3. What external API or data source would I need to connect?

Keep it concise — one paragraph per answer.
```

Bob's response is your starting point for a real PoC. Save it.

---

## Bob Prompt — Generate Your Agent YAML *(Optional)*

Take your three canvas answers and ask Bob to produce a ready-to-import ADK agent YAML for your scenario. Paste this into the Bob chat panel, filling in your answers from the canvas above:

```
Generate a ready-to-import watsonx Orchestrate ADK agent YAML for my scenario:

- Planning object: [your answer to Q1]
- Variance story:  [your answer to Q2]
- Root cause system: [your answer to Q3]

Requirements:
- spec_version: v1, kind: native
- Give the agent a clear name (snake_case) and a one-line description
- Write instructions that tell the agent to detect material variances, investigate root cause from the external system, and return a CFO-ready plain-language summary
- LLM: watsonx/meta-llama/llama-3-2-90b-vision-instruct
- style: default, no collaborators or tools yet

Return only the YAML — no explanation needed.
```

Save the YAML Bob returns. It is ready to import with:

```bash
orchestrate agents import -f your-scenario-agent.yaml
```

> **What this shows:** Bob understands the ADK agent schema and can generate deployment-ready YAML from a plain-language description — bridging your business scenario directly to code.

---

## Bonus — Go Further with the watsonx Orchestrate ADK *(Optional)*

If you want to move beyond the UI and define agents, tools, and deployments entirely from code, the **Agent Development Kit (ADK)** is the developer path.

| What you can do with the ADK | Example |
|-----------------------------|---------|
| Import MCP servers as toolsets via CLI | `orchestrate tools import --kind mcp ...` |
| Deploy agents from YAML in CI/CD | `orchestrate agents import --file agent.yaml` |
| Chat with agents from the terminal | `orchestrate agents chat --agent fpa_variance_autopilot` |
| Call agents via REST API from any app | `POST /v1/chat` with your agent ID |

**→ Work through [lab-02-8-adk](../lab-02-fpa-variance-autopilot/lab-02-8-adk/README.md)** — standalone bonus, work through it independently at your own pace.

**→ IBM Developer learning path:** [Get started with watsonx Orchestrate — Develop agents with ADK](https://developer.ibm.com/learningpaths/get-started-watsonx-orchestrate/develop-agents-adk/)

---

## Resources — Take These Away

| Resource | Link |
|----------|------|
| IBM Planning Analytics Documentation | [ibm.com/docs/en/planning-analytics](https://www.ibm.com/docs/en/planning-analytics) |
| watsonx Orchestrate Documentation | [ibm.com/docs/en/watsonx/watson-orchestrate](https://www.ibm.com/docs/en/watsonx/watson-orchestrate) |
| Planning Analytics Building Blocks | [github.com/ibm-self-serve-assets/building-blocks](https://github.com/ibm-self-serve-assets/building-blocks/tree/main/optimize/budget-and-forecasting) |
| Workshop Repository | Fork this repo and use it as your PoC starting point |
| Agent YAMLs to adapt | `lab-02-2-pa-agent/`, `lab-02-4-crm-erp-agents/`, `lab-02-5-orchestrator/` |
| **ADK Learning Path** | [developer.ibm.com — Develop agents with ADK](https://developer.ibm.com/learningpaths/get-started-watsonx-orchestrate/develop-agents-adk/) |

---

[← Back to Workshop Home](../README.md)
