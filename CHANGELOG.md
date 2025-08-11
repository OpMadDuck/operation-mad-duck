# Changelog

## [Unreleased] - Geolocation, Input Validation, and UI Enhancements

### Added
- **Geolocation-based flag capture**:
  - `navigator.geolocation.getCurrentPosition` integrated into the `flagPage()` JavaScript to enforce real-world proximity during flag capture.
  - `FLAG_COORDS` dictionary added to map each flag ID to a real-world latitude/longitude.
  - `calculateDistance(loc1, loc2)` helper function added using the haversine formula.
  - `isWithinRadius(loc1, loc2)` used to restrict capture to within 50 meters of the defined flag coordinates.

- **Distance feedback**:
  - Users now receive detailed error messages if outside geofenced range, including their distance in meters from the flag.

- **XSS Input Sanitization**:
  - `escapeHtml(text)` function added to sanitize contracts before rendering on the scoreboard.

- **Permissions Header for Mobile Browsers**:
  - Added `Permissions-Policy: geolocation=(self)` to `getFlag()` response headers for improved mobile compatibility.

- **User coordinates logging**:
  - Client now sends geolocation data along with the submitted contract via POST to `/capture`.

- **Redirect after successful contract submission**:
  - After positive contract verification, users are redirected to the scoreboard automatically.
  - Added optional alert before redirect for confirmation feedback.

- **Color-coded scoreboard flag names**:
  - The winning team's flag name cell is highlighted in red or blue background upon capture.

### Changed
- Modified `captureFlag()` to include a `location` object in the POST body.
- Rewrote `captureFlag(request)` to reject out-of-radius requests with descriptive messages.
- Changed winning contract logging to allow geolocation-filtered entries.
- Updated `flagPage()` to include `<script>` inside `<body>` tag (prevents `document.querySelector("h2")` from returning null).
- Updated scoreboard rendering so the winning flag name cell displays team color instead of colorizing contracts.

### Fixed
- Fixed an issue where `<script>` tag placement prevented capture buttons from responding to clicks.
- Removed accidental line breaks and escaped characters in JavaScript alert strings to prevent `Uncaught SyntaxError`.
- Fixed KV value persistence issue during development by ensuring manual KV pair initialization on Cloudflare dashboard.

