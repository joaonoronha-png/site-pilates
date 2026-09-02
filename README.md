# site-pilates

## 21st.dev CLI

This project uses the [21st.dev CLI](https://21st.dev) (`@21st-dev/cli`) to search, install and generate UI components, and to power the `21st-*` Claude/Cursor/Codex skills under `.claude/skills/`, `.cursor/skills/`, and `.codex/skills/`. The `21st-dev` MCP server is configured in `.mcp.json`.

### Local setup

Install and sign in — this opens a browser and saves a token locally:

```bash
npm i -g @21st-dev/cli
21st login
```

> The browser login flow only works on a machine where the CLI and the browser run together. It will not complete inside a headless/remote environment (the callback goes to `localhost` on that machine) — use the API key method below there instead.

### CI / scripts / remote environments

Skip login and authenticate with an API key instead. Generate one at [21st.dev/mcp](https://21st.dev/mcp), then either:

```bash
21st <command> --api-key "$API_KEY_21ST"
```

or export it once per shell/session:

```bash
export API_KEY_21ST=your-key-here
```

The same `API_KEY_21ST` variable is read by `.mcp.json` for the `21st-dev` MCP server.

## Figma MCP server

The `figma` MCP server (`.mcp.json`) points at Figma's official remote endpoint (`https://mcp.figma.com/mcp`), which lets Claude read Figma files, frames, and Dev Mode data directly.

It uses OAuth, not an API key. Authorize it once per machine/session, inside an **interactive** Claude Code session (not headless/remote):

```
/mcp
```

Select `figma`, choose **Authenticate**, and approve access in the browser tab that opens. This cannot be completed in a non-interactive/CI environment — it needs a human clicking "Allow" in Figma's own login screen.
