# GeoTrail — Week 14: Hardware & Connectivity

**Type:** Individual Ionic React + Capacitor project
**Assignment location:** `14-week/03-optional-activity/geotrail/`
**Theme:** A privacy-first field checkpoint journal with GPS capture and a protected API.
**Course:** Mobile Programming — Week 14, Term 3.

> This is an independently structured GPS-based exercise, not a camera demo. It uses a local Node.js HTTP API for actual JWT authentication and protected checkpoint persistence in server memory. It is an educational prototype, not a production identity system.

## Features and assessment mapping

| Week 14 criterion | Implementation |
| --- | --- |
| Capacitor hardware plugin and permissions | `@capacitor/geolocation` checks/requests native permissions; a browser uses its native location prompt. Errors for denied, disabled, and timed-out GPS are mapped to readable messages. |
| Token, protected API, HTTP 401, offline | Login returns a signed JWT; `GET` and `POST /api/checkpoints` require `Authorization: Bearer ...`. A 401 removes the in-memory token and returns to login. `@capacitor/network` tracks connection changes and failed fetches show actionable errors. |
| UX, loading/data/error, testing | Three navigable tabs (Records, GPS, Privacy); explicit loading/data/error states; empty state, retry, responsive layout, and automated tests. |
| English README | This README includes the `Quality & connectivity` section and verification steps. |

## Project structure

```text
geotrail/
├── src/
│   ├── api/client.ts             # API client and typed error mapping
│   ├── hooks/useConnectivity.ts  # Capacitor Network plugin
│   ├── services/location.ts      # On-demand GPS + permissions
│   ├── pages/                   # Login, records, capture and privacy UI
│   ├── tests/client.test.ts     # Vitest unit tests
│   ├── App.tsx
│   └── theme.css
├── server/index.mjs             # Real local HTTP API with signed JWT
├── tests/api.test.mjs           # Node API integration tests
├── scripts/                     # Prepare Android plugin permission setup
├── capacitor.config.ts
├── .env.example
└── README.md
```

## Requirements

- Node.js 22 or newer and npm.
- A browser for web development; Android Studio and an Android emulator/device for the native GPS demonstration.
- A working local network connection between the device and the API if testing with a physical phone.

## Quick start (browser)

Open a terminal in this `geotrail` directory:

```bash
npm install
npm run api
```

Open another terminal in the **same directory**:

```bash
npm run dev
```

Visit `http://localhost:5173`.

**Local demonstration account (development only):**

```text
Email:     student@geotrail.test
Password:  GeoTrailDemo#2026
```

The demo API lives at `http://127.0.0.1:3001`. The frontend defaults to `http://localhost:3001` and uses `VITE_API_BASE_URL` to override that URL. The demo password can be changed by setting `DEMO_EMAIL` and `DEMO_PASSWORD` in the environment of the API process. The API generates a new random signing secret each time it runs unless `JWT_SECRET` is supplied as a server-only environment variable. **Never place `JWT_SECRET`, passwords, or access tokens in `VITE_*` variables or commit them.**

A successful demonstration should follow this route:

1. Sign in to the local API.
2. Open **Records** to observe the empty state (or existing data state).
3. Open **GPS**, provide a name, and click **Ask permission & get GPS**.
4. Allow location access on the browser/device and inspect the location preview.
5. Click **Save via protected API**, then visit **Records** and confirm the record appears.
6. Go to **Privacy** to inspect network status and sign out.

Data is stored in the demo server process memory and disappears when that process stops. GPS capture does not automatically transmit the location; the user must press Save.

## Native Android setup

For native GPS testing, install dependencies, build the web content, create the Android project, and configure permissions:

```bash
npm install
npm run build
npm run android:init
npx cap open android
```

The `android:init` script generates `android/` (if missing), adds `ACCESS_COARSE_LOCATION` and `ACCESS_FINE_LOCATION` to `AndroidManifest.xml`, enables **local development HTTP only**, and syncs Capacitor assets. When changing the app again:

```bash
npm run build
npm run android:sync
```

**API URL on Android:** Capacitor's WebView is not the same as your desktop browser. Set `VITE_API_BASE_URL` in a local `.env` before building:

- Browser: `VITE_API_BASE_URL=http://localhost:3001`
- Android emulator: `VITE_API_BASE_URL=http://10.0.2.2:3001`
- Physical Android phone: `VITE_API_BASE_URL=http://YOUR_PC_LAN_IP:3001`

On a phone, start the API with `API_HOST=0.0.0.0` and allow TCP 3001 through the development machine's firewall. Use PowerShell on Windows:

```powershell
$env:API_HOST = '0.0.0.0'
npm run api
```

This HTTP exception is only for testing against a local API. Production releases must use HTTPS, remove the cleartext traffic exception, replace demo authentication with a real user store/password hashes, persist data appropriately, and configure CORS and server authorization for the real deployment. Android Studio must be used to run the app on the emulator/device; a native hardware permission check cannot be fully proven by a desktop web preview alone.

## Quality & connectivity

GeoTrail requests location permission only after the user explicitly taps the GPS capture button. On Android, the application checks the existing permission state and requests access when necessary; on the web, the browser prompts during location access. If permission is denied, location services are disabled, or the GPS request times out, the interface explains what the user should do instead of failing silently. A successful login receives a short-lived, HMAC-signed JWT, and protected checkpoint requests send it through the `Authorization` header rather than as a URL parameter. The token stays in React memory and is discarded when the user signs out, refreshes the app, or receives an HTTP 401 response. The Network plugin observes connectivity changes, while request failures also produce recoverable errors because network presence does not guarantee API availability. The Records screen clearly distinguishes loading, retrieved records (including an empty result), and error states with a retry action. The GPS location is displayed locally before the user separately authorizes sending it to the API by pressing Save. The API does not place passwords or the JWT signing key in token claims, and it verifies token signatures and expiration before allowing protected actions.

A JWT is readable by the device owner and is **not a secrecy container**. This coursework demo therefore avoids personal secrets in JWT claims, uses expiration, and does not log tokens. A production app must additionally use HTTPS, server-side authorization, secure user management, and a suitable native secret-storage strategy if persistent sessions are required.

## Tests

```bash
npm test
npm run test:api
npm run build
```

The Vitest suite checks `401` response classification, blocking requests when offline, and handling a real `Response(401)` from `fetch`. The Node integration suite starts the API on an ephemeral port and verifies unauthorized requests, successful login, protected reads, protected writes, wrong passwords, and forged tokens.

**Manual test cases for the presentation:**

| Scenario | Expected result |
| --- | --- |
| Valid demo credentials | Authenticated tabs become visible. |
| Incorrect password | Login shows an error; no access to records. |
| No or forged JWT | Protected API answers 401. |
| Wi-Fi / mobile data disabled | Offline warning and no protected API request. |
| API stopped while device still has Wi-Fi | API unreachable error and retry opportunity. |
| GPS permission denied | Permission guidance appears; no checkpoint is sent. |
| GPS enabled and approved | Coordinates preview appears, not uploaded yet. |
| Save checkpoint with valid token | API returns 201 and Record tab shows the item. |
| Narrow viewport (around 320–375px) | Labels and buttons stay readable; cards and coordinates wrap. |

You can demonstrate a protected endpoint independently with these PowerShell commands (API must be running):

```powershell
curl.exe -i http://localhost:3001/api/checkpoints
# Expected: HTTP/1.1 401 Unauthorized

curl.exe -i -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"student@geotrail.test","password":"wrong"}'
# Expected: HTTP/1.1 401 Unauthorized
```

For PowerShell versions that transform quoting in `curl.exe`, use a browser API client or `Invoke-RestMethod` to send the same JSON.

## Suggested evidence for the GitHub submission

Create an `evidence/` folder with **your own actual screenshots** after running the project: `01-login.png`, `02-gps-permission.png`, `03-gps-preview.png`, `04-records.png`, `05-offline.png`, and `06-tests.png`. Do not submit fabricated screenshots or reuse screenshots from a classmate. Keep API secrets and access tokens out of images, console output, and screenshots.

## GitHub submission notes

Put this complete project under `14-week/03-optional-activity/geotrail/` **inside your own class repository fork**. Run the tests before committing, create a commit yourself, and push to a feature branch on your fork. Open a pull request only if the instructor requests it, and verify its source/target repositories before sending it. Maintain the `CONFIG` block (`FULL_NAME` and `GITHUB_USER`) in your **GitHub profile repository** according to the course manual.
