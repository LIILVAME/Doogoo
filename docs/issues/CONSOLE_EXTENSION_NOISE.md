# Console noise from browser extensions

## Summary
In some QA sessions the browser console is flooded with errors such as:

- `chrome-extension://.../background.js` stack traces
- "Failed to set badge state Error: No tab with id ..."
- SignalR or WebSocket failures referencing `bitwarden.com`

These messages originate from password-manager extensions (for example Bitwarden) that inject scripts into every page. They are not emitted by the Doogoo application and do not affect functionality.

## What to do
- **Ignore for Doogoo validation:** These logs are extension noise and can be disregarded when testing or debugging the app.
- **Reproduce without extensions:** If you need a clean console, try an incognito window with extensions disabled or temporarily toggle off the password manager.
- **Confirm app logs:** Actual Doogoo logs use the standard Vite/Vue prefixes and never include `chrome-extension://` URLs.

Documenting this helps keep QA reports focused on actionable app issues rather than external browser tooling.
