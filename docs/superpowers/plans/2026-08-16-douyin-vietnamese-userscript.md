# Douyin Vietnamese Userscript Implementation Plan

> **For agentic workers:** Execute this plan task-by-task with verification checkpoints.

**Goal:** Build a directly installable Douyin Web Vietnamese userscript that translates system UI without translating feed content.

**Architecture:** Keep the implementation in one browser-ready userscript. Export pure helpers through a CommonJS-compatible branch for Node's built-in test runner. Use exact-match translation, UI boundary checks, and a debounced `MutationObserver`.

**Tech Stack:** Plain JavaScript userscript, Tampermonkey/Violentmonkey metadata, Node.js `node:test`.

---

### Task 1: Add failing translation-policy tests

**Files:** `tests/douyin-vh.test.js`, `package.json`

- [ ] Write tests for exact translation, whitespace preservation, embedded-content rejection, UI boundary classification, and the observed shell labels.
- [ ] Run `npm test`; expect failure because `douyin-vh.user.js` does not exist yet.

### Task 2: Implement the userscript core

**Files:** `douyin-vh.user.js`

- [ ] Add userscript metadata, the UI dictionary, `normalizeText`, and `translateExact`.
- [ ] Add safe UI classification: shell and interactive controls are allowed; ordinary feed content is excluded.
- [ ] Add text/attribute scanning, debounced `MutationObserver`, idempotence, and duplicate-start protection.
- [ ] Run `npm test`; expect all tests to pass.

### Task 3: Document installation

**Files:** `README.md`

- [ ] Explain Tampermonkey/Violentmonkey installation and refresh steps.
- [ ] Explain the exact-match safety boundary and how to extend the dictionary.
- [ ] Run `npm test` again.

### Task 4: Verify in the active Douyin tab

**Files:** `douyin-vh.user.js` only if a concrete browser defect is found.

- [ ] Execute the userscript body in the connected tab and inspect visible shell labels.
- [ ] Trigger a dynamic menu or player control and verify it is translated.
- [ ] Confirm caption/hashtag text remains unchanged, then run `npm test`.
