# Planning Analytics, Bob & watsonx Orchestrate Workshop

## AI-Powered Planning Experiences for FP&A Teams

---

This hands-on workshop demonstrates how **IBM Bob**, **IBM Planning Analytics (TM1)**, and **IBM watsonx Orchestrate** work together to build intelligent, AI-powered planning experiences. Participants will move from foundational concepts to working labs — finishing the day with practical skills they can apply to their own Finance & Planning use cases.

**Duration:** 6 hours (full day)
**Format:** Instructor-led with hands-on lab exercises
**Level:** Intermediate

---

## Workshop Overview

| # | Session | Duration |
|---|---------|----------|
| — | Welcome, introductions, and objectives | 10 min |
| [Deck](https://ibm.box.com/s/ajwak3kycul3n3oj3m5otehp18cd0flq) | watsonx Orchestrate overview | 30 min |
| [Deck](https://ibm.box.com/s/tyu4uivnxfiuiwfqsl41kd8i5f7knkam) | Bob overview & Demo: Planning Analytics assistant experience | 30 min |
| [Lab 0](./lab-00-setup/README.md) | Environment setup, access validation & MCP configuration | 30 min |
| — | *Break* | *15 min* |
| [Lab 1](./lab-01-bob-planning-analytics-mcp/README.md) | **Hands-On Lab 1:** Bob + Planning Analytics via MCP | 60 min |
| — | Use case overview: FP&A Variance Autopilot | 10 min |
| — | *Lunch / Break* | *60 min* |
| [Lab 2](./lab-02-fpa-variance-autopilot/README.md) | **Hands-On Lab 2:** FP&A Variance Autopilot | 90 min |
| [Your Scenario](./session-03-your-scenario/README.md) | Your Scenario — map the pattern to your own use case | 15 min |
| — | Shareback + Wrap-up, next steps, and Q&A | 10 min |

---

## Learning Objectives

By the end of this workshop, you will be able to:

- Understand how **watsonx Orchestrate** enables agentic workflows for enterprise finance
- Understand how **Bob** simplifies Planning Analytics development and analysis through conversational AI
- Configure a **Planning Analytics MCP connection** in Bob to interact with TM1 data using natural language
- Build and query a **TM1 cube** from CSV data using Bob's Planning Analytics mode
- Run a complete **FP&A Variance Autopilot** — detecting variances, investigating root causes across CRM and ERP systems, generating AI explanations, and routing stakeholder alerts
- Adapt the autopilot pattern to your own Planning Analytics scenario

---

## Prerequisites

Before attending the workshop, ensure the following access is confirmed:

| Requirement | Details |
|-------------|---------|
| **IBM Bob** | Access with minimum 200 coins — confirm with your workshop organiser |
| **IBM Planning Analytics** | TechZone-provisioned environment — URL and credentials shared ahead of the session |
| **watsonx Orchestrate** | Trial access or IBM SaaS tenant — confirm with your workshop organiser |
| **IBM Bob IDE** | Download and install from [bob.ibm.com/download](https://bob.ibm.com/download) — confirm access with your workshop organiser |
| **Laptop** | macOS or Windows with internet access |

> **Access Clarification:** TechZone Planning Analytics environments will be shared with participants before the session. Bob and Orchestrate access models should be confirmed with the workshop organiser in advance.

---

## Repository Structure

```
pa-bob-orchestrate-workshop/
├── README.md                              ← You are here
│
├── lab-00-setup/
│   └── README.md                          ← Environment setup and MCP configuration
│
├── lab-01-bob-planning-analytics-mcp/
│   ├── README.md                          ← Lab 1 instructions
│   ├── mcp.json                           ← MCP server configuration template
│   └── assets/
│       ├── fact_financial_data.csv        ← Financial fact data (loaded in Lab 1 Ex 5)
│       └── dim_*.csv                      ← Dimension data files (Account, Dept, Time…)
│
├── lab-02-fpa-variance-autopilot/
│   ├── README.md                          ← Lab 2 overview + sub-lab navigation
│   ├── TODO.md                            ← Asset checklist and facilitator notes
│   ├── assets/
│   │   ├── fpa-variance-agent.yaml        ← Full agent YAML (working version)
│   │   ├── fpa-variance-agent-reference.yaml  ← Reference / answer key
│   │   └── saleslens-api/                 ← SalesLens Mock CRM+ERP API (Node.js app)
│   ├── lab-02-1-add-mcp-server/
│   │   └── README.md                      ← Sub-lab: register PA MCP + credentials
│   ├── lab-02-2-import-rest-api-tools/
│   │   └── README.md                      ← Sub-lab: import SalesLens OpenAPI tools
│   ├── lab-02-3-pa-agent/
│   │   ├── README.md                      ← Sub-lab: PA Data Agent instructions
│   │   └── pa-data-agent.yaml             ← PA Data Agent definition
│   ├── lab-02-4-crm-erp-agents/
│   │   ├── README.md                      ← Sub-lab: CRM + ERP agent instructions
│   │   ├── crm-agent.yaml                 ← CRM Agent definition
│   │   └── erp-agent.yaml                 ← ERP Agent definition
│   ├── lab-02-5-orchestrator/
│   │   ├── README.md                      ← Sub-lab: Orchestrator agent instructions
│   │   └── fpa-orchestrator-agent.yaml    ← Orchestrator Agent definition
│   └── lab-02-6-chat-embed/
│       ├── README.md                      ← Sub-lab (optional): HTML chat embed
│       └── saleslens-crm-erp.html         ← Embeddable chat UI
│
└── session-03-your-scenario/
    └── README.md                          ← 15-min canvas + Bob prompt + shareback
```

---

## Featured Use Cases

### Use Case 1 — Bob + Planning Analytics via MCP
Bob uses the **Planning Analytics MCP integration** to interact with your TM1 environment through natural language. You can build TM1 models from CSV files, query cubes, perform variance analysis, detect outliers, and automate TurboIntegrator processes — all through conversation.

### Use Case 2 — FP&A Variance Autopilot
A **multi-agent watsonx Orchestrate system** monitors Planning Analytics for material budget variances (>$100K or >20%). When a variance is detected, the PA Data Agent retrieves the financial data, the CRM and ERP Context Agents investigate root causes from external systems, and the Orchestrator Agent synthesises a plain-language CFO-ready explanation and routes context-rich alerts to the right stakeholders — in under 5 minutes.

---

## Expected Outcomes

| Outcome | Delivered By |
|---------|-------------|
| Understand Orchestrate's role in agentic FP&A workflows | Presentation + Lab 2 |
| Understand how Bob supports PA development and analysis | Presentation + Lab 1 |
| Configure MCP and query TM1 using natural language | Lab 0 + Lab 1 |
| Build a TM1 cube from CSV data via Bob | Lab 1 |
| Run end-to-end variance detection and explanation | Lab 2 |
| Adapt the autopilot to your own Planning Analytics use case | Your Scenario session |

---

## Additional Resources

- [IBM Planning Analytics Documentation](https://www.ibm.com/docs/en/planning-analytics)
- [watsonx Orchestrate Documentation](https://www.ibm.com/docs/en/watsonx/watson-orchestrate)
- [IBM Bob — Getting Started](https://www.ibm.com/products/bob)
- [IBM Planning Analytics MCP Tools Reference](./lab-01-bob-planning-analytics-mcp/README.md#mcp-tools-reference)

---

> **Made with IBM Bob** · Planning Analytics × watsonx Orchestrate Workshop · Version 1.0
