# FP&A External Systems Mock API

A lightweight **Node.js / Express** application that simulates the CRM and ERP external systems used in the **FP&A Variance Autopilot** (Lab 2). The watsonx Orchestrate agent calls this API to retrieve root-cause context — deal slippage, pipeline data, unbudgeted purchase orders, and headcount events — when explaining Planning Analytics variances.

Deploy it once to **IBM Code Engine** and share the endpoint URL with all workshop participants.

---

## What It Provides

| System | Endpoints | Data |
|--------|-----------|------|
| **Mock CRM** | `/crm/variance-context` `/crm/deals` `/crm/pipeline-summary` | Deal slippage, early closes, pipeline coverage — aligned to `fact_financial_data.csv` variance scenarios |
| **Mock ERP** | `/erp/cost-context` `/erp/purchase-orders` `/erp/headcount-events` | Unbudgeted POs, contractor events, infrastructure overruns |
| **Discovery** | `/` `/health` `/api-spec` | Service info, health check, OpenAPI 3.0 spec |

All data is seeded from the same variance scenarios in the workshop dataset — so every agent call returns a realistic, contextually-correct explanation.

---

## Quickstart — Local

```bash
# 1. Install dependencies
cd pa-bob-orchestrate-workshop/lab-02-fpa-variance-autopilot/assets/saleslens-api
npm install

# 2. Start the server
npm start
# → Running on http://localhost:8080

# 3. Test it
curl http://localhost:8080/health
curl -H "X-Api-Key: workshop-demo-key" \
  "http://localhost:8080/crm/variance-context?dept_id=DEPT-NA-SALES&period=2024-01"
```

---

## Quickstart — Docker

```bash
# Build and run with docker-compose
docker compose up --build

# Or build and run manually
docker build -t fpa-external-systems-mock .
docker run -p 8080:8080 \
  -e API_KEY=workshop-demo-key \
  fpa-external-systems-mock
```

Run the smoke tests against the container:
```bash
node test/smoke-test.js
```

---

## Deploy to IBM Code Engine

IBM Code Engine is the recommended deployment target. A single deployment serves all workshop participants.

### Prerequisites

- IBM Cloud CLI: `ibmcloud` with Code Engine plugin (`ibmcloud plugin install code-engine`)
- IBM Container Registry namespace (or use Docker Hub)
- Logged in: `ibmcloud login --sso`

---

### Step 1 — Build and Push the Image

**Option A — IBM Container Registry (ICR):**

```bash
# Log in to ICR
ibmcloud cr login

# Tag and push
IMAGE=icr.io/<your-namespace>/fpa-external-systems-mock:1.0.0
docker build -t $IMAGE .
docker push $IMAGE
```

**Option B — Docker Hub:**

```bash
IMAGE=<your-dockerhub-username>/fpa-external-systems-mock:1.0.0
docker build -t $IMAGE .
docker push $IMAGE
```

---

### Step 2 — Create or Target a Code Engine Project

```bash
# Create a new project (once per workshop)
ibmcloud ce project create --name fpa-workshop

# Or target an existing project
ibmcloud ce project select --name fpa-workshop
```

---

### Step 3 — Create the Application

```bash
ibmcloud ce application create \
  --name fpa-mock-api \
  --image $IMAGE \
  --port 8080 \
  --min-scale 1 \
  --max-scale 2 \
  --cpu 0.25 \
  --memory 0.5G \
  --env API_KEY=workshop-demo-key \
  --env NODE_ENV=production
```

> **`--min-scale 1`** keeps one instance warm so the first agent call is instant. For a workshop this avoids cold-start delays.

---

### Step 4 — Get the Public URL

```bash
ibmcloud ce application get --name fpa-mock-api --output url
```

The output will look like:
```
https://fpa-mock-api.<random>.us-south.codeengine.appdomain.cloud
```

**Share this URL and the API key with participants** — they need both to configure the SalesLens connection in Lab 2.3 and import the CRM/ERP tools in Lab 2.4.

---

### Step 5 — Validate the Deployment

```bash
BASE_URL=https://fpa-mock-api.<random>.us-south.codeengine.appdomain.cloud \
API_KEY=workshop-demo-key \
node test/smoke-test.js
```

All tests should show ✅.

---

### Updating the Deployment

If you change the data or code:

```bash
# Rebuild and push a new image tag
docker build -t $IMAGE .
docker push $IMAGE

# Update the Code Engine application
ibmcloud ce application update --name fpa-mock-api --image $IMAGE
```

---

### Teardown After the Workshop

```bash
ibmcloud ce application delete --name fpa-mock-api --force
# Optionally delete the project
ibmcloud ce project delete --name fpa-workshop --force
```

---

## API Reference

### Authentication

All endpoints except `/health` and `/` require an API key in the request header:

```
X-Api-Key: workshop-demo-key
```

The full OpenAPI 3.0 spec is available at `/api-spec` once the app is running.

---

### CRM Endpoints

#### `GET /crm/variance-context` ⭐ Primary agent endpoint

Returns slipped deals, early closes, and pipeline coverage for a specific revenue variance. This is the main endpoint the Orchestrate agent calls.

```
GET /crm/variance-context?dept_id=DEPT-NA-SALES&period=2024-01&account_id=REV-001
```

**Response:**
```json
{
  "dept_id": "DEPT-NA-SALES",
  "period": "2024-01",
  "context_summary": "2 deal(s) totalling $200K slipped from 2024-01: Acme Corp ($120K — customer procurement delayed); TechStart ($80K — budget freeze). Rescheduled: Acme Corp → 2024-02-28, TechStart → 2024-02-15.",
  "slipped_deals": [ ... ],
  "early_closes": [],
  "total_slipped_value": 200000,
  "pipeline_summary": { "open_pipeline": 850000, "coverage_ratio": 1.7, ... }
}
```

---

#### `GET /crm/deals`

Filter deals by department, period, status, and account.

| Param | Required | Example |
|-------|----------|---------|
| `dept_id` | No | `DEPT-NA-SALES` |
| `period` | No | `2024-01` |
| `status` | No | `slipped` \| `at_risk` \| `closed` \| `early_close` |
| `account_id` | No | `REV-001` |

---

#### `GET /crm/pipeline-summary`

Returns pipeline coverage ratio and risk breakdown.

| Param | Required | Example |
|-------|----------|---------|
| `dept_id` | Yes | `DEPT-NA-SALES` |
| `period` | Yes | `2024-01` |

---

### ERP Endpoints

#### `GET /erp/cost-context` ⭐ Primary agent endpoint

Returns unbudgeted purchase orders and headcount events for an OpEx variance.

```
GET /erp/cost-context?dept_id=DEPT-NA-SALES&period=2024-01&account_id=OPEX-001
```

**Response:**
```json
{
  "dept_id": "DEPT-NA-SALES",
  "period": "2024-01",
  "context_summary": "1 unbudgeted purchase order(s) totalling $18K: TechWorld Events LLC — Events & Conferences (PO-2024-0142): Reactive participation in TechWorld Summit. 1 unbudgeted headcount event(s) adding $8K/month: Enterprise Account Executive (new_hire): Hire approved via headcount exception.",
  "total_unplanned_cost": 26000,
  "unbudgeted_purchase_orders": [ ... ],
  "unbudgeted_headcount_events": [ ... ]
}
```

---

#### `GET /erp/purchase-orders`

| Param | Required | Example |
|-------|----------|---------|
| `dept_id` | No | `DEPT-NA-SALES` |
| `period` | No | `2024-01` |
| `account_id` | No | `OPEX-001` |

---

#### `GET /erp/headcount-events`

| Param | Required | Example |
|-------|----------|---------|
| `dept_id` | No | `DEPT-NA-SALES` |
| `period` | No | `2024-01` |

---

## Variance Scenarios Covered

| Period | Dept | Account | Variance | CRM/ERP Context Available |
|--------|------|---------|---------|--------------------------|
| 2024-01 | NA Sales | REV-001 | -$175K (-35%) | 2 slipped deals: Acme Corp + TechStart |
| 2024-01 | EMEA Sales | REV-001 | +$40K (+10.5%) | Early close: GlobalTech |
| 2024-01 | NA Sales | OPEX-001 | +$25K (+20.8%) | PO: TechWorld trade show + HC event |
| 2024-01 | Prof Svcs | COGS-001 | +$7K (+9.3%) | PO: CloudSkills contractor premium |
| 2024-01 | IT | OPEX-007 | +$14K (+18.7%) | PO: Emergency AWS security patch |
| 2024-03 | APAC Sales | REV-001 | -$85K (-30.4%) | Slipped deal: Sino-Digital regulatory delay |
| 2024-05 | EMEA Sales | REV-001 | -$35K (-8.3%) | At-risk deal: UK market uncertainty |
| 2024-05 | Marketing | OPEX-005 | +$23K (+24.2%) | PO: Digital campaign for product launch |
| 2025-03 | Prod Eng | OPEX-002 | +$45K (+8.7%) | PO: NVIDIA GPU + HC: ML contractor |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | HTTP port to listen on |
| `API_KEY` | `workshop-demo-key` | API key required in `X-Api-Key` header |
| `NODE_ENV` | `production` | Node environment |

> **Production tip:** Generate a unique key per workshop: `openssl rand -hex 20`

---

## File Structure

```
sample-app/
├── server.js              ← Express app entry point
├── openapi.json           ← OpenAPI 3.0 spec (served at /api-spec)
├── package.json
├── Dockerfile             ← Multi-stage build, non-root user, Code Engine ready
├── docker-compose.yml     ← Local development
├── .dockerignore
├── routes/
│   ├── crm.js             ← CRM endpoints
│   ├── erp.js             ← ERP endpoints
│   └── health.js          ← Health check
├── data/
│   ├── crm-data.js        ← Mock deals and pipeline data
│   └── erp-data.js        ← Mock POs, headcount events
└── test/
    └── smoke-test.js      ← Endpoint smoke tests
```

---

*Part of the Planning Analytics × Bob × watsonx Orchestrate Workshop — Lab 2: FP&A Variance Autopilot*
