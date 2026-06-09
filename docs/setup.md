# Setting Up Playwright MCP in Windsurf

## What is an MCP Server?

**MCP (Model Context Protocol)** is an open standard that lets AI agents call external tools
— like a browser — through a well-defined interface.  
The **Playwright MCP Server** exposes browser automation as tools the Windsurf AI agent can call,
e.g. `browser_navigate`, `browser_click`, `browser_type`, `browser_snapshot`.

---

## Step 1 — Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 18 or later |
| Windsurf IDE | Latest |
| npx | ships with Node.js |

Check: `node -v` and `npx -v` in your terminal.

---

## Step 2 — Place the MCP Config File

Copy `config/mcp_config.json` from this repo to:

```
C:\Users\Rahul_Namdev\.codeium\windsurf\mcp_config.json
```

If the file already exists, **merge** the `"devin/mcp-playwright"` block into the existing
`"mcpServers"` object — do not replace the whole file.

---

## Step 3 — Explaining Every Field

```json
{
  "mcpServers": {
    "devin/mcp-playwright": {          ← (A) Server key / name
      "command":  "npx",               ← (B) How to launch the server
      "args": [
        "-y",                          ← (C) Auto-accept npx prompt
        "@playwright/mcp@latest"       ← (D) The MCP package to run
      ],
      "disabled": false,               ← (E) Toggle server on/off
      "registry": "devin/mcp-playwright" ← (F) Registry identifier
    }
  }
}
```

### (A) `"devin/mcp-playwright"` — Server Key
The **unique name** Windsurf uses to identify this MCP server internally.
- Format is typically `vendor/server-name`
- This is what appears in the Windsurf Cascade panel under "Tools"
- You can rename it (e.g. `"my-playwright"`) as long as it's unique in the file

### (B) `"command": "npx"`
The **executable** Windsurf runs to start the MCP server process.
- `npx` means "use Node package runner" — no global install needed
- Windsurf spawns this as a child process when the agent needs browser tools
- Could also be `"node"` if you had a local server script instead

### (C) `"-y"` (first arg)
Passes the **`--yes` flag** to npx.
- Without `-y`, npx asks "need to install @playwright/mcp, ok?" and waits for keyboard input
- `-y` auto-confirms, so the server starts silently in the background
- Essential for non-interactive server startup

### (D) `"@playwright/mcp@latest"` (second arg)
The **npm package** that implements the Playwright MCP Server.
- `@playwright/mcp` is the official Playwright MCP package maintained by Microsoft
- `@latest` always pulls the newest version; pin to a version (e.g. `@0.0.28`) for stability
- This package starts a local MCP server that wraps Playwright browser APIs as MCP tools

### (E) `"disabled": false`
**Enables or disables** the server without deleting the config.
- `false` → server is active, Windsurf will start it when needed
- `true`  → server is ignored; useful to temporarily turn off browser automation
- Flip this to `true` if you want to disable Playwright without removing the config

### (F) `"registry": "devin/mcp-playwright"`
The **registry identifier** used to look up the server in the MCP marketplace/registry.
- Windsurf uses this to show metadata (description, icon) in its UI
- Should match the key name for consistency
- Does not affect how the server is launched — that's controlled by `command` + `args`

---

## Step 4 — Restart Windsurf

After saving the config:
1. Fully quit Windsurf (`File → Exit` or kill the process)
2. Reopen Windsurf
3. Open the **Cascade** panel (AI agent chat)
4. You should see `devin/mcp-playwright` listed under **Available Tools**

---

## Step 5 — Verify It Works

In Cascade, type:
```
Navigate to https://example.com and take a screenshot
```

The agent should call `browser_navigate` and `browser_snapshot` — you'll see the tool calls
appear in the Cascade panel, and a browser window may open briefly.

---

## Available Playwright MCP Tools

Once connected, the agent can use:

| Tool | What it does |
|---|---|
| `browser_navigate` | Go to a URL |
| `browser_snapshot` | Capture accessibility snapshot of current page |
| `browser_click` | Click an element |
| `browser_type` | Type text into an input field |
| `browser_select_option` | Choose a dropdown value |
| `browser_hover` | Hover over an element |
| `browser_wait_for` | Wait for an element or condition |
| `browser_take_screenshot` | Save a screenshot |
| `browser_close` | Close the browser |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Server doesn't appear in Cascade | Check JSON syntax in mcp_config.json; restart Windsurf |
| `npx: command not found` | Install Node.js 18+; ensure it's on PATH |
| Browser doesn't open | Run `npx @playwright/mcp@latest` manually in terminal to see errors |
| Tests fail on selectors | Update `config/sites.json` selectors to match your actual site's HTML |
