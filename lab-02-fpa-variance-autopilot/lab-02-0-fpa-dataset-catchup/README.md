# Lab 2.0 — Confirm the FP&A Dataset

**Duration:** ~5 minutes  
**Prerequisite:** [Lab 0](../../lab-00-setup/README.md) ✅ · [Lab 1](../../lab-01-bob-planning-analytics-mcp/README.md) ✅  
**Reference:** [developer.watson-orchestrate.ibm.com](https://developer.watson-orchestrate.ibm.com)

---

## Goal

Confirm that the `FPA_Variance` cube is loaded on your Planning Analytics server and spot-check the key budget vs. actual variances that the autopilot will investigate in subsequent labs.

> **Note:** If you completed **Lab 1 Exercise 5**, the `FPA_Variance` cube is already loaded on your TechZone server — run Step 2 to confirm and move directly to Lab 2.1 (~2 minutes).

---

## Step 1 — Confirm the Cube Exists

In Bob (Planning Analytics mode), send:

```
List available cubes on the DemoGuide server.
Show me the dimensions of the FPA_Variance cube.
```

**Expected response:** `FPA_Variance` cube with dimensions:
```
Account · Department · Scenario · Time · Version
```

> If the cube is not present, ask your facilitator — it can be pre-loaded, or re-run Lab 1 Exercise 5 in ~8 minutes.

---

## Step 2 — Spot-Check the Variance Data

In Bob, send:

```
Show me January 2024 actual vs budget for all departments in FPA_Variance.
Flag any variance greater than $100,000 or 20%.
```

You should see the key variances this lab is built around:

| Department | Account | Budget | Actual | Variance |
|-----------|---------|--------|--------|---------|
| NA Sales | Enterprise Software Revenue | $500K | $325K | **-$175K (-35.0%) 🔴** |
| NA Sales | Sales & Marketing OpEx | $120K | $145K | **+$25K (+20.8%) 🟡** |
| EMEA Sales | Enterprise Software Revenue | $380K | $420K | +$40K (+10.5%) ✅ |

These are the variances the autopilot will investigate in Labs 2.2–2.5.

---

## ✅ Checkpoint

Before moving to Lab 2.1, confirm:

- [ ] `FPA_Variance` cube exists on the `DemoGuide` server
- [ ] Dimensions confirmed: Account, Department, Scenario, Time, Version
- [ ] January 2024 variances visible and match the expected values above

---

## Next

→ **[Lab 2.1 — Configure the Planning Analytics MCP Connection](../lab-02-1-pa-mcp-connection/README.md)**
