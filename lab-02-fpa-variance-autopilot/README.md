# Lab 2 — FP&A Variance Autopilot

**Duration:** 90-minute session slot — core path is Labs 2.0–2.5  
**Tools:** watsonx Orchestrate · IBM Planning Analytics · SalesLens Mock API  

**Prerequisite:** [Lab 0](../lab-00-setup/README.md) ✅ and [Lab 1](../lab-01-bob-planning-analytics-mcp/README.md) ✅ completed  

**Reference:** [developer.watson-orchestrate.ibm.com](https://developer.watson-orchestrate.ibm.com)

---

## Overview

Your FP&A team currently spends **3–4 days each month** manually investigating budget variances across dozens of cost centres — cross-referencing Planning Analytics data with CRM pipeline reports and ERP operational data. By the time root causes are identified, the window for corrective action has often closed.

**In this lab you will build the FP&A Variance Autopilot** — a multi-agent watsonx Orchestrate system that:

1. **Detects** material budget variances in Planning Analytics (>$100K or >20%)
2. **Calls the SalesLens CRM/ERP API** to enrich each variance with real business context
3. **Generates** a plain-language CFO-ready explanation for every variance
4. **Routes alerts** to the right stakeholders based on severity

Time to complete the same workflow: **under 5 minutes**.

---

## Sub-Lab Structure

This lab is organised as a series of focused sub-labs following the natural build flow: configure connection → build agent. Each sub-lab has a single deliverable. Complete them in order:

| Sub-Lab | Title | Deliverable | Time |
|---------|-------|-------------|------|
| [2.0](lab-02-0-fpa-dataset-catchup/README.md) | Confirm the FP&A Dataset | `FPA_Variance` cube data confirmed | 5 min |
| [2.1](lab-02-1-pa-mcp-connection/README.md) | Configure the PA MCP Connection | `planning-analytics-basic` connection active | 10 min |
| [2.2](lab-02-2-pa-agent/README.md) | Create the PA Data Agent | `PA Data Agent` live with 10 PA MCP tools | 30 min |
| [2.3](lab-02-3-saleslens-connection/README.md) | Configure the SalesLens API Connection | `saleslens-api-key` connection active | 10 min |
| [2.4](lab-02-4-crm-erp-agents/README.md) | Create the CRM & ERP Agents | `CRM Context Agent` + `ERP Context Agent` live | 30 min |
| [2.5](lab-02-5-orchestrator/README.md) | Create the Orchestrator Agent | `FP&A Variance Autopilot` running end-to-end | 25 min |
| [2.6](lab-02-6-agentops/README.md) *(if time allows)* | AgentOps: Tracing & Evaluation | Execution traces, metrics & comparison | 15 min |
| [2.7](lab-02-7-chat-embed/README.md) *(if time allows)* | Embed in Branded Chat Page | `saleslens-wxo-embed.html` — wxoLoader embed | 10 min |
| [2.8](lab-02-8-adk/README.md) *(bonus)* | Get Started with Orchestrate ADK | Agent lifecycle management via ADK CLI | 30 min |

**→ [Start with Lab 2.0](lab-02-0-fpa-dataset-catchup/README.md)**

> **Pacing:** The times above total ~110 minutes for the core path (2.0–2.5) and assume you read every background section. Lab 2 is scheduled in a 90-minute slot, so 2.6–2.8 sit outside that budget and work well as self-paced follow-ups. Connections only need creating once per workshop — both 2.1 and 2.3 tell participants to skip a connection that already exists, which recovers ~15 minutes for a shared tenant.

---

## Architecture

```
User / Scheduler / TM1 Event
           │
           ▼
  ┌──────────────────────────────────────────────────────────┐
  │                  watsonx Orchestrate                      │
  │           FP&A Variance Autopilot (Orchestrator)          │
  │                                                           │
  │  ┌─────────────────┐ ┌────────────────┐ ┌─────────────┐  │
  │  │  PA Data Agent  │ │ CRM Context    │ │ ERP Context │  │
  │  │   (Lab 2.2)     │ │ Agent (Lab 2.4)│ │ Agent (2.4) │  │
  │  └────────┬────────┘ └───────┬────────┘ └──────┬──────┘  │
  └───────────┼──────────────────┼─────────────────┼─────────┘
              │                  │                  │
              ▼                  ▼                  ▼
  ┌───────────────────┐  ┌───────────────────────────────┐
  │  IBM Planning     │  │       SalesLens Mock API       │
  │  Analytics (TM1)  │  │   ┌──────────┐ ┌──────────┐  │
  │  FPA_Variance     │  │   │   CRM    │ │   ERP    │  │
  │  (Budget/Actual)  │  │   │/variance │ │  /cost-  │  │
  └───────────────────┘  │   │-context  │ │  context │  │
                         │   └──────────┘ └──────────┘  │
                         └───────────────────────────────┘
              │                        │
              └────────────┬───────────┘
                           ▼
               ┌───────────────────────┐
               │  CFO-Ready Variance   │
               │  Report + Stakeholder │
               │  Alert Routing        │
               └───────────────────────┘
```

---

## What You Will Do

| Step | What happens | Who/What does it |
|------|-------------|-----------------|
| 1️⃣ | Material budget variances detected in Planning Analytics (>$100K or >20%) | PA Data Agent (Lab 2.2) |
| 2️⃣ | Root cause investigated — CRM queried for revenue misses, ERP for cost overruns | CRM & ERP Context Agents (Lab 2.4) |
| 3️⃣ | Plain-language CFO-ready explanation generated for every variance | Orchestrator Agent (Lab 2.5) |
| 4️⃣ | Stakeholder alerts routed by severity — VP email, FP&A dashboard, CFO digest | Orchestrator Agent (Lab 2.5) |

By the end of this lab you will have built all four of these steps as a live multi-agent system in watsonx Orchestrate, running end-to-end in under 5 minutes.

---

## The SalesLens Mock API (External Systems)

The **SalesLens** app is a live REST API deployed for this workshop. It simulates the CRM and ERP systems your agent will query to explain variances.

| System | Base Path | Primary Agent Endpoint | What It Returns |
|--------|-----------|------------------------|-----------------|
| CRM | `/crm` | `GET /crm/variance-context` | Slipped deals, pipeline coverage, context summary |
| ERP | `/erp` | `GET /erp/cost-context` | Unbudgeted POs, headcount events, cost context summary |

**API Key:** `<SALESLENS_API_KEY>` (header: `X-Api-Key`) — provided by your facilitator  
**Demo UI:** `<YOUR_APP_URL>/demo` — Variance Lookup, Deals, POs, Headcount  
**Swagger:** `<YOUR_APP_URL>/docs` — try every endpoint live  
**OpenAPI spec:** `lab-02-4-crm-erp-agents/saleslens-openapi-spec.json` — used to import tools into Orchestrate

> Your facilitator will provide the deployed app URL. For local testing: `http://localhost:8080`

---

## Business Value Summary

| Metric | Manual Process | With Autopilot |
|--------|---------------|----------------|
| Time to investigate variances | 3–4 days | < 5 minutes |
| Coverage (% explained) | ~60% | 100% |
| Stakeholder notification | Day 3–4 of close | Immediate |
| CRM/ERP cross-reference | Manual lookup | Automatic |
| Audit trail in PA | Manual, inconsistent | Automatic, timestamped |

---

## Appendix A — Agent Configuration Reference

| Field | Value |
|-------|-------|
| **Name** | `FP&A Variance Autopilot` |
| **Model** | `ibm/granite-3-3-8b-instruct` |
| **Revenue threshold** | > $100,000 or > 20% |
| **OpEx threshold** | > $50,000 or > 15% |
| **HIGH severity** | > 25% or > $150,000 |
| **MEDIUM severity** | 15–25% or $75K–$150K |
| **LOW severity** | 10–15% or $25K–$75K |
| **PA MCP tools** | 10 (see Lab 2.2) |
| **SalesLens tools** | 6 (3 CRM + 3 ERP, see Lab 2.4) |

---

## Appendix B — SalesLens API Quick Reference

| Endpoint | Parameters | Agent Use |
|----------|-----------|-----------|
| `GET /crm/variance-context` | `dept_id`, `period`, `account_id?` | Revenue variance root cause |
| `GET /crm/deals` | `dept_id?`, `period?`, `status?` | Individual deal lookup |
| `GET /crm/pipeline-summary` | `dept_id`, `period` | Coverage ratio check |
| `GET /erp/cost-context` | `dept_id`, `period`, `account_id?` | OpEx variance root cause |
| `GET /erp/purchase-orders` | `dept_id?`, `period?` | PO detail lookup |
| `GET /erp/headcount-events` | `dept_id?`, `period?` | Headcount cost detail |

---

## What's Next

Continue to **Session 3: Adapt to Your Own Use Case** →

[→ Go to Session 3](../session-03-your-scenario/README.md)
