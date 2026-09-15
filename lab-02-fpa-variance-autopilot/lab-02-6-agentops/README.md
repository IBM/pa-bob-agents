# Lab 2.6 — AgentOps: Tracing & Evaluation

**Duration:** ~15 minutes  
**Prerequisite:** [Lab 2.5](../lab-02-5-orchestrator/README.md) ✅ (Orchestrator running end-to-end)  
**Reference:** [developer.watson-orchestrate.ibm.com](https://developer.watson-orchestrate.ibm.com)

---

## Goal

Use Orchestrate's built-in AgentOps capabilities to trace multi-agent execution, evaluate output quality against LLM-as-a-judge metrics, run a comparison evaluation to quantify the business value of CRM/ERP context, and improve agent instructions based on trace observations.

By the end of this lab you will have:
- Inspected a full multi-agent execution trace in AgentOps
- Evaluated faithfulness and completeness metrics on the variance report
- Run a comparison evaluation demonstrating output quality with vs. without collaborator agents
- Iterated on agent instructions using trace feedback

---

## Step 1 — View the Execution Trace

After running the autopilot in Lab 2.5:

1. In Orchestrate, navigate to **AgentOps** → **Traces** (or **Logs** → **Agent runs**).
2. Find your most recent run and click into it.

You will see the full execution trace across the orchestrator and its collaborators:

```
Run ID: run-a3f9...
Start: 14:23:01  |  End: 14:23:07  |  Duration: 5.8s

┌─ Reasoning step 1 (Orchestrator) ────────────────────────┐
│ Input: "Run FP&A variance analysis for January 2024..."  │
│ Decision: Query Planning Analytics for baseline variance │
│ Collaborator called: pa_data_agent                       │
│ Result: Variance table (NA Sales Rev -$175K, OpEx +$25K) │
└──────────────────────────────────────────────────────────┘
┌─ Reasoning step 2 (Orchestrator) ────────────────────────┐
│ Decision: Investigate revenue miss (REV-001) in CRM      │
│ Collaborator called: crm_context_agent                   │
│ Result: 2 slipped deals ($200K) — Acme Corp + TechStart  │
└──────────────────────────────────────────────────────────┘
┌─ Reasoning step 3 (Orchestrator) ────────────────────────┐
│ Decision: Investigate OpEx overrun (OPEX-001) in ERP     │
│ Collaborator called: erp_context_agent                   │
│ Result: TechWorld PO ($18K) + AE new hire ($8.5K/mo)     │
└──────────────────────────────────────────────────────────┘
┌─ Reasoning step 4 (Orchestrator) ────────────────────────┐
│ Decision: Synthesise final CFO-ready variance report     │
│ Result: Full report with confidence score and alerts     │
└──────────────────────────────────────────────────────────┘
```

**What to observe:**
- How many reasoning steps did the orchestrator take?
- Which collaborator sub-agents were called and in what sequence?
- What payload was passed to each sub-agent and returned back?
- Latency and token consumption per step

---

## Step 2 — Evaluate Output Quality

Orchestrate AgentOps includes built-in evaluation metrics. Navigate to **AgentOps** → **Evaluations** and review:

| Metric | What It Measures | Target |
|--------|-----------------|--------|
| **Faithfulness** | Are the root causes grounded in actual collaborator tool responses? | > 0.85 |
| **Completeness** | Were all material variances addressed? | 1.0 |
| **Tool precision** | Did the orchestrator route to the right collaborator sub-agent? | > 0.90 |
| **Response format** | Did the output follow the defined CFO-ready structure? | Pass |

> **Discussion:** If faithfulness scores low, the agent may be embellishing beyond what the API returned. Review the agent instructions — add `"Only use root cause text directly from context_summary. Do not infer."` to constrain this.

---

## Step 3 — Run a Comparison Evaluation

Orchestrate allows you to test the same prompt against two agent configurations side-by-side:

1. Navigate to **AgentOps** → **Comparisons**.
2. Create a comparison:
   - **Agent A:** Full orchestrator with all 3 collaborator sub-agents (`pa_data_agent`, `crm_context_agent`, `erp_context_agent`)
   - **Agent B:** Orchestrator without the CRM and ERP collaborator agents (Planning Analytics only)
3. Run the same January 2024 prompt against both configurations.
4. Review: how does root cause quality change when the orchestrator cannot query external context?

**Expected finding:** Agent B can only report that variances exist, or falls back to generic explanations. Agent A references specific deal names, vendor names, and PO amounts — demonstrating the concrete business value of cross-system agent collaboration.

---

## Step 4 — Improve Agent Instructions Based on Trace

Based on your trace review, try one instruction improvement. For example, if the orchestrator skipped the ERP check on an OpEx variance or added unnecessary commentary, update the instructions:

```
IMPORTANT: For every material OpEx or COGS variance you must call
erp_context_agent before generating the explanation. Never skip this step.
Only use root cause text directly from context_summary. Do not infer or invent details.
```

Re-run the evaluation and observe the change in faithfulness and tool precision scores.

---

## ✅ Checkpoint

Before moving to Lab 2.7, confirm:

- [ ] Execution trace for the full autopilot run viewed in AgentOps
- [ ] Sub-agent routing and tool executions verified in trace timeline
- [ ] Evaluation metrics reviewed (faithfulness, completeness, precision)
- [ ] Comparison evaluation run (with vs. without CRM/ERP collaborators)

---

## Next

→ **[Lab 2.7 (Optional) — Embed the Autopilot in a Branded Chat Page](../lab-02-7-chat-embed/README.md)**  
→ **[Lab 2.8 (Bonus) — Get Started with watsonx Orchestrate ADK](../lab-02-8-adk/README.md)**
