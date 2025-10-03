# Design Notes

## job-tracker-design-v1.jpg
This was the **first draft** of the system design for *job-tracker*

### Why it didn't work
This version had to be changed because it was attempting to call a server-side endpoint: /api/scraper. The problem with this is extensions files are pure client-side. Since extension files are downloaded and stored directly in the browser, there is no server.

---

## Alternative Approaches

### 1. Initializing Google API in script.js
**Pros:**
 - More direct/simple implementation
 - Can send job data and save directly into Google API (Spreadsheet)

**Cons:**
 - Exposed API key

---

### 2. Use a Google App Scripts endpoint (Chosen Approach)
**Pros:**
 - Does not expose API key
 - cooler

**Cons:**
 - More complex
 - Requires creating and hosting a custom Apps Script endpoint
