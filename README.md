<div align="center">

# 🎭 Windsurf × Playwright
### Let AI write your tests. Then watch them pass.

*Point it at a URL. Walk away. Come back to a test report.*

---

[![Playwright](https://img.shields.io/badge/Playwright-MCP-45ba4b?logo=playwright&logoColor=white)](https://playwright.dev)
[![Windsurf](https://img.shields.io/badge/Windsurf-Workflow-6366f1?logo=codeium&logoColor=white)](https://codeium.com/windsurf)
[![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)

</div>

---

## ✨ What is this?

A simple repo that wires together two powerful tools:

| | Tool | Role |
|---|---|---|
| 🪁 | **Windsurf** | AI agent that *thinks* about what to test |
| 🎭 | **Playwright MCP** | Browser robot that *executes* the tests |

You tell it your website. It opens a browser, logs in, tries to break things, and reports back — **no manual test writing needed.**

---

## 🗂 Project Layout

```
windsurf-playwright-testing/
│
├──   .windsurf/workflows/
│   └── test-auth.md        ← AI agent instructions (the "brain")
│
├──   tests/
│   └── auth.spec.ts        ← Standalone Playwright tests (optional)
│
├──   config/
│   ├── sites.json          ← YOUR site URL + test credentials go here
│   └── mcp_caonfig.json     ← Drop this into Windsurf settings once
│
├──   docs/
│   └── setup.md            ← Deep-dive: MCP config explained field by field
│
└── playwright.config.ts
```

---

##  Up & Running in 4 Steps

### 1 — Install

```bash
npm install
npx playwright install
```

### 2 — Tell it your website

Open `config/sites.json` and fill in your details:

```json
{
  "baseUrl": "https://abc.com",
  "authPage": "/login",
  "testUser": {
    "email": "test@abc.com",
    "password": "yourpassword"
  }
}
```

> 💡 This is the **only file you need to edit** to point at a different site.

### 3 — Connect Playwright to Windsurf

Copy `config/mcp_config.json` to:

```
C:\Users\xyz\.codeium\windsurf\mcp_config.json
```

Restart Windsurf. Done. The Playwright browser tools now appear in your Cascade panel.

> See [docs/setup.md](docs/setup.md) for a full breakdown of what every field in that config means.

### 4 — Run the AI workflow

Open **Windsurf → Cascade** and type:

```
Run the test-auth workflow
```

The agent reads `.windsurf/workflows/test-auth.md`, then drives a real browser through your login page automatically.

---

## 🔬 What Gets Tested

The workflow covers three scenarios out of the box:

| Scenario | What it checks |
|---|---|
|  **Happy path** | Valid credentials → lands on dashboard |
|  **Wrong password** | Error message appears |
|  **Empty form** | Validation messages fire |

---

##  How the Pieces Fit Together

```
You
 │
 │  "Run test-auth workflow"
 ▼
Windsurf (Cascade AI)
 │  reads .windsurf/workflows/test-auth.md
 │  reads config/sites.json for URL + credentials
 │
 │  calls MCP tools ↓
 ▼
Playwright MCP Server
 │  browser_navigate  → opens abc.com/login
 │  browser_type      → fills in email & password
 │  browser_click     → hits the login button
 │  browser_snapshot  → checks what's on screen
 │
 ▼
Test Report  
```

---

##  Skip Windsurf — Run Tests Directly

If you just want to run the Playwright specs without the AI layer:

```bash
# All tests
npx playwright test

# Auth tests only
npx playwright test tests/auth.spec.ts

# Watch the browser do its thing
npx playwright test --headed
```

---

##  The MCP Config, Explained

```jsonc
"devin/mcp-playwright": {
  "command":  "npx",               // how to launch the server
  "args": ["-y", "@playwright/mcp@latest"],
  //         ↑                ↑
  //   skip install       the package
  //   confirmation
  "disabled": false,               // flip to true to pause, not delete
  "registry": "devin/mcp-playwright"  // used by Windsurf's UI only
}
```

Full field-by-field explanation → [docs/setup.md](docs/setup.md)

---

##  Requirements

- Node.js 18+
- Windsurf IDE (latest)
- That's it — Playwright and the MCP server install themselves via `npx`

---

<div align="center">

*Built to show how AI agents + browser automation = tests that write themselves.*

</div>
