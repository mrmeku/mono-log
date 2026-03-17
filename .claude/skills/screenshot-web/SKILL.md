---
name: screenshot-web
description: Use when you need to visually verify the app renders correctly — after UI changes, styling updates, component swaps, or integration work. Takes a Playwright screenshot of the running Expo web app.
---

# UI Verification

## Steps

1. Ensure the Expo web server is running:
   ```bash
   bash .claude/skills/screenshot-web/ensure-web-server.sh
   ```
2. Playwright MCP `browser_navigate` to `http://localhost:8081`.
3. Playwright MCP `browser_take_screenshot`. Analyze against `$ARGUMENTS` if provided.
4. Playwright MCP `browser_close`.
