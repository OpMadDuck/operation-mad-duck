# Operation Mad Duck
A CTF exercise designed to help UCWT students plan and execute a tactical operation.

## Production
- A [live scoreboard](https://operation.madduck.workers.dev/board) can be viewed online. Please note that you must refresh the page in order to see newly captured flags. The total score for each team is updated automatically.
- By performing a [game reset](https://operation.madduck.workers.dev/reset), all contract and flag capture data will be erased.
- The `codes` folder of this repository has a QR code for each flag.
- The `points.csv` file lists each flag's unique identifier, name, and point values for each team.

## Development
### Cloudflare
This project is written in JavaScript and is built using two free Cloudflare products. Cloudflare Workers provides a [serverless](https://www.cloudflare.com/learning/serverless/what-is-serverless/) execution environment that allows you to create entire web applications without configuring, maintaining or paying for infrastructure. Scoreboard data is stored in [Workers KV](https://developers.cloudflare.com/workers/learning/how-kv-works/) - a global, low-latency, key-value data store.

### Environment
When developing this project locally, [Miniflare](https://miniflare.dev) is the preferred method of testing new code/features. You must have Node Package Manager (NPM) and the latest version of NodeJS installed on your system. If you would prefer not to configure a local development environment, check out [GitHub Codespaces](https://github.com/features/codespaces).  Clone this repository and run `npm run-script run` to stage a local copy of the project. Changes made locally will not affect the production instance of the code.

### Recommendations
The `dev` branch is a work-in-progress of migrating the project to an [ACID](https://en.wikipedia.org/wiki/ACID)-compliant framework. This will hopefully fix the issue where logged-contracts can sometimes overwrite each other. Instead of storing flag data an contract logs under the ID for each flag, it is better to store the contracts atomically. The code in the `dev` branch aims to accomplish this by storing contracts in the KV with: the contract statement, a team designation, and the flag id. The scoreboard should then compare these stored contracts with a static array of flag objects to determine realized point values and successfully logged contracts.

## New Features in This Fork

### Geolocation-Based Flag Capture
- Players must physically be within **50 meters** of a flag’s real-world coordinates to capture it.
- Coordinates are stored per-flag in a central `FLAG_COORDS` dictionary.
- Distance is calculated on the server using the haversine formula to ensure integrity.

### Location Feedback
- If users are outside the allowed range, an alert displays:
  - Their **current coordinates**
  - The **exact distance** from the flag
  - A message that capture failed

### ⚠Secure Origin Enforcement
- Chrome, Firefox, and Safari require secure contexts for geolocation access.
- Use `npx wrangler dev --ip=0.0.0.0 --port=8787` locally and access via `https://` (e.g., via Cloudflare Tunnel or HTTPS proxy) for mobile device testing.

### XSS-Protected Contract Display
- All contracts shown on the scoreboard are sanitized using a custom `escapeHtml()` function.
- Properly captured contracts are **bolded**, incorrect ones are **italicized**.

---

## Developer Notes

### Code Differences vs. Original

| Area | Original | This Fork |
|------|----------|-----------|
| `flagPage()` | Basic click handler | Includes geolocation prompt, error feedback, and enhanced alert |
| `captureFlag()` | Only contract body | Adds full geolocation payload and distance check |
| `boardPage()` | Direct rendering | Now sanitizes input via `escapeHtml()` |
| `getFlag()` | No headers | Adds `Permissions-Policy` for location access |
| New Functions | X | `calculateDistance()`, `isWithinRadius()`, `escapeHtml()` |

