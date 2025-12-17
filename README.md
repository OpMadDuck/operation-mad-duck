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

### New Features along with revised points on 17Dec25
Of course. It's a great idea to document the evolution of the project. Based on our entire conversation, I have created a summary that details all the features you requested.

This summary is written in Markdown, making it perfect for a GitHub `README.md` file or for use in commit messages or release notes.

---

### Project Summary: Operation Mad Duck Scoreboard

This Cloudflare Worker project hosts a real-time, interactive scoreboard for a "Capture the Flag" style competition. The system allows users to scan QR codes that link to flag capture pages. The first team to correctly submit their contract for a flag earns points, and the central scoreboard updates dynamically for all viewers.

### Feature Updates

Over the course of development, several key features were added to enhance the game's strategy, user experience, and visual clarity:

#### 1. Dynamic & Asymmetrical Scoring System
The initial scoring logic was updated to create a more competitive and strategic environment.
*   **Negative Scoring:** When a team successfully captures a flag, the opposing team's score is now negatively impacted, making each capture more significant.
*   **Scenario-Based Points:** The point values are asymmetrical and depend on which team makes the capture. The game now supports different point awards for a "Red Team First Capture" versus a "Blue Team First Capture," with unique positive and negative outcomes for each flag.

#### 2. Enhanced Real-Time Scoreboard UI
The scoreboard interface was significantly improved to provide instant visual feedback and stay current without manual intervention.
*   **Auto-Refresh:** The page automatically refreshes every 15 seconds, ensuring the scores and capture states are always up-to-date for all viewers.
*   **Visual Capture Indicator:** Rows for captured flags are now highlighted with the winning team's color (red or blue), and the text is changed to bolded white for high-contrast readability.

#### 3. Game Countdown & Winner Announcement
A timed game-end sequence was implemented to create a clear conclusion to the competition.
*   **Persistent 30-Minute Timer:** A "Start Timer" button initiates a global 30-minute countdown. The timer's state is saved in the browser's `localStorage`, ensuring it persists across the 15-second auto-refreshes and manual page loads for a consistent countdown across all clients.
*   **Game Reset Integration:** The reset function now also clears the timer from `localStorage`, allowing for a clean start to a new game.
*   **Automated Winner Declaration:** Once the timer expires, a full-screen overlay appears, automatically calculating and declaring the winning team (or a tie) based on the final point totals.

### New from the Fork from Wills Wire...
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
| `flagPage()` | Basic click handler |
| `captureFlag()` |
| `boardPage()` | Direct rendering | Now sanitizes input via `escapeHtml()` |
| `getFlag()` | No headers | Adds `Permissions-Policy` for location access |
| New Functions | X |`escapeHtml()` |

