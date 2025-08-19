# Operation Mad Duck
A CTF exercise designed to help UCWT students plan and execute a tactical operation.

## Production
- A [live scoreboard](https://operation.madduck.workers.dev/board) can be viewed online. Please note that you must refresh the page in order to see newly captured flags. The total score for each team is updated automatically.
- By performing a [game reset](https://operation.madduck.workers.dev/reset), all contract and flag capture data will be erased.
- The `codes` folder of this repository has a QR code for each flag.
- The `points.csv` file lists each flag's unique identifier, name, and point values for each team.

## Development
### Cloudflare
This project is written in JavaScript and is built using two free Cloudflare products:
- **Cloudflare Workers** – provides a [serverless](https://www.cloudflare.com/learning/serverless/what-is-serverless/) execution environment for web applications without managing infrastructure.
- **Workers KV** – a global, low-latency, key-value data store used for storing scoreboard and contract data.

### Environment
When developing this project locally, [Miniflare](https://miniflare.dev) is the preferred method of testing new code/features. You must have Node Package Manager (NPM) and the latest version of NodeJS installed on your system.  
If you would prefer not to configure a local environment, you can use [GitHub Codespaces](https://github.com/features/codespaces).  

Clone this repository and run:
```bash
npm run-script run
```
to stage a local copy of the project. Changes made locally will **not** affect the production instance.

### Recommendations
The `deprecated/acid` branch represents an ongoing migration toward an [ACID](https://en.wikipedia.org/wiki/ACID)-compliant data model, abandoned for the time being by the original developer. This will address the issue where logged contracts could overwrite each other by:
- Storing contracts atomically with:  
  - the contract statement  
  - the team designation  
  - the flag ID  
- Computing scores from a **static array of flag objects** combined with stored contracts, ensuring integrity.

---

## New Features in This Fork

### Geolocation-Based Flag Capture
- Players must be physically within **50 meters** of a flag’s real-world coordinates to capture it.
- Coordinates are stored per-flag in a central `FLAG_COORDS` dictionary.
- Distance is calculated on the server using the **haversine formula** to prevent client-side tampering.

### Location Feedback
- If users are outside the allowed radius, an alert displays:
  - Their **current coordinates**
  - The **exact distance** to the flag
  - A clear “capture failed” message

### Secure Origin Enforcement
- Geolocation requires a secure context (HTTPS).
- Use:
  ```bash
  npx wrangler dev --ip=0.0.0.0 --port=8787
  ```
  with Cloudflare Tunnel or another HTTPS proxy for mobile testing.

### XSS-Protected Contract Display
- All contract text is sanitized with a custom `escapeHtml()` function.
- Correctly captured contracts are **bolded**, incorrect ones are *italicized*.

### Redirect After Successful Capture
- Upon positive contract verification, the user is automatically redirected to the scoreboard.

### Instructor-Only Scoreboard Reset
- The reset dialog no longer shows the reset key in plaintext, ensuring only the instructor can reset scores.

### Splash Page
- Visiting `/` now returns a **splash page** with an overview of the CTF and a button to view the scoreboard.
- The splash page HTML is embedded in the Worker and returned as the default route.

---

## Developer Notes

### Modifying Point Values
- Modify values for desired flag in `resetBoard()` function of `worker.js`
  - This will update the Key-Value (KV) pair data on Cloudflare when a reset is conducted
- Modify values for desired flag on Cloudflare dashboard → (application_name) → Bindings → `Flags-Dev` → View
- If values between these two products don't match, the KV pair value will be used initially, then the `worker.js` `resetBoard()` value will be used once a reset is conducted

### Code Differences vs. Original

| Area | Original | This Fork |
|------|----------|-----------|
| `flagPage()` | Basic click handler | Geolocation prompt, error feedback, enhanced alerts |
| `captureFlag()` | Contract body only | Full geolocation payload + distance validation |
| `boardPage()` | Direct rendering | Sanitizes contract text with `escapeHtml()` |
| `getFlag()` | No special headers | Adds `Permissions-Policy` for location access |
| Reset Logic | Always accessible | Protected by instructor-only UI |
| Post-Capture Flow | Static confirmation | Alert + redirect to scoreboard |
| Default Route | 404 | Splash page HTML with scoreboard link |
| New Functions | N/A | `calculateDistance()`, `isWithinRadius()`, `escapeHtml()` |
