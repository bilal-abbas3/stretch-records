# Lesson 05: The System Audit

## 1. Single Point of Failure

- **Observation:** When stopping `json-server` in the terminal (`Ctrl + C`) and reloading the browser page, the network request to `http://localhost:3000/artists` immediately failed with `net::ERR_CONNECTION_REFUSED`. In the DevTools console, this triggered a native `TypeError: Failed to fetch` caught by the `catch` block (`script.js:83`). On the visible UI, the `#loading` indicator vanished via the `finally` block, leaving the main content area below the form completely blank with no user-facing error message.
- **Single Point of Failure:** The local `json-server` process running on `http://localhost:3000` is the single point of failure; if the server process stops, the entire application becomes unusable and cannot fetch or create data.
- **Redundancy:** Redundancy would mean deploying multiple synchronized instances of the API server behind a load balancer so that if one instance crashes, incoming HTTP traffic is automatically routed to an active server without interrupting the user experience.

---

## 2. Latency

- **Observation:** In the DevTools **Network** tab, the network speed was throttled to **Slow 3G**. Upon reloading:
  - **Load Time:** The initial `GET /artists` request took ~2.15 seconds to complete.
  - **Visual State:** While waiting for the request to resolve, the screen held on the visual text `"Loading artists..."` inside the `#loading` element, preventing a jarring flash of missing content.
- **Terminology:** The artificial network delay introduced between sending the request and receiving the response is **latency**.

---

## 3. Caching

- **Disable Cache (Checked):**
  - Re-fetching `http://localhost:3000/artists` resulted in a status code of `200 OK`.
  - The full payload size was downloaded across the network on every page reload.
- **Enable Cache (Unchecked / Repeated Reloads):**
  - Assets returned with status `304 Not Modified` or `(disk cache)`.
  - Transferred data dropped to negligible sizes (< 1 KB) because the browser reused stored copies of resources locally.
- **Terminology:** Storing responses locally to eliminate redundant network round-trips on subsequent requests is **caching**.

---

## 4. The Layers

- **Presentation Layer (Frontend):**
  - `index.html` (DOM structure), `style.css` (layout), and `script.js` (UI logic rendering cards into `#artists-container` and attaching form event listeners).
- **Application Layer (Middle Layer / Web Server):**
  - Node.js executing `json-server`, which handles HTTP routing (`GET`, `POST`), serializes incoming JSON payloads, sets CORS headers (`Access-Control-Allow-Origin`), and handles disk read/write requests.
- **Data Layer (Backend Storage):**
  - The physical `artists.json` file residing on the filesystem, acting as the persistent database.
- **Middle Layer Scope:**
  - **Sits in Middle Layer:** Basic REST API endpoints (`/artists`), HTTP method parsing, header generation, static file reading, and writing serialized JSON.
  - **Does NOT Sit in Middle Layer:** Relational databases, custom business logic, server-side data validation, authentication/authorization mechanisms, rate limiting, and session management.

---

## 5. One Request's Full Journey

Tracing a single `GET /artists` request from initial address to UI render:

1. **Browser Dispatch (DevTools Network Tab):** The browser initiates an HTTP `GET` request to `http://localhost:3000/artists`.
2. **Server Terminal Logging:** The `json-server` terminal displays the incoming request line: `GET /artists 200 - ms`.
3. **Data Retrieval:** `json-server` reads the current data state from `artists.json` on disk and formats it into a JSON string payload.
4. **Network Response (DevTools Network Tab):** DevTools logs an incoming `200 OK` response with headers including `Content-Type: application/json; charset=utf-8` and `Access-Control-Allow-Origin: *`.
5. **DOM Render (Browser Console & UI):** `script.js` receives the resolved `Response` object via `await response.json()`, iterates over the array of objects in `renderArtists()`, builds the HTML card structure, and injects it into `#artists-container`.

---

## 6. STRETCH: What a Real System Would Need (Skipped by json-server)

While `json-server` provides rapid prototyping capabilities, a production-grade backend requires additional capabilities across system layers:

- **Validation (Application Layer):** Checking that incoming `POST` request bodies match exact schema specifications (e.g., verifying that `photo` is a valid URL, `name` is a non-empty string, and unexpected properties are rejected).
- **Identity & Authentication (Application Layer):** Verifying the client's identity (via JWTs, OAuth tokens, or session cookies) before allowing write operations.
- **Rules & Authorization (Application/Data Layer):** Enforcing permissions and business domain rules (e.g., verifying that a user has permission to edit a specific artist, or preventing duplicate entries).
- **Lesson 4 Proof:** Lesson 04 proved that **validation, identity, and business rules cannot live in the browser alone**. Client-side JavaScript can easily be modified, bypassed, or completely ignored by submitting direct HTTP requests via DevTools, Postman, or `curl`. Production systems must enforce these constraints on the server.
