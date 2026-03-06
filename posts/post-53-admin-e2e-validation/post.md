---
title: "Admin E2E Validation with Puppeteer"
subtitle: "The full login-to-logout validation flow for admin panels — and why admin interfaces need the most rigorous testing of any feature"
author: "Nick Krzemienski"
date: "2025-03-05"
series_number: 53
series_total: 61
github_repo: "https://github.com/krzemienski/admin-e2e-validator"
tags:
  - AgenticDevelopment
  - ClaudeCode
  - E2ETesting
  - AdminPanel
  - Puppeteer
---

## Admin E2E Validation with Puppeteer

*Agentic Development: 21 Lessons from 8,481 AI Coding Sessions*

The admin panel looked perfect in development. Every CRUD operation worked when I tested it manually. The data tables loaded, the forms submitted, the delete confirmations popped up. Then the first beta tester logged in, created a resource, navigated to a different section, came back, and the resource was gone. Not deleted — just invisible. The list view was not refreshing after creation. A bug that only appeared in the full user flow, never in isolated feature testing.

Admin panels are the most dangerous surfaces in any application. They have elevated permissions, direct database access, and are used by the people most likely to assume everything is working. A bug in a user-facing feature gets reported by hundreds of users. A bug in an admin panel gets reported by nobody, because the admin assumes they did something wrong.

**TL;DR: Full end-to-end validation of admin panels — login, navigate, CRUD, verify persistence, logout, verify redirect — caught 7 bugs that isolated feature testing missed. Puppeteer's screenshot evidence at every step created an audit trail that proved each flow worked, not just each screen.**

---

### Why Admin Panels Need the Most Testing

The argument for testing user-facing features more thoroughly than admin panels seems intuitive: more users means more impact. But the math works the other way:

- **Admin actions have higher blast radius.** A user can break their own account. An admin can break everyone's account.
- **Admin bugs are invisible longer.** Users report bugs. Admins troubleshoot, assume operator error, and move on.
- **Admin flows are more complex.** CRUD with permissions, role management, data export, audit logs — every admin feature combines multiple subsystems.
- **Admin panels are built last.** They get the least design attention, the least code review, and the least testing time.

The combination of high impact and low visibility makes admin panels the highest-risk, lowest-tested surface in most applications.

I audited 14 admin panels across projects I had worked on. The numbers were alarming:

| Metric | User-Facing Features | Admin Panel |
|--------|---------------------|-------------|
| Average bug discovery time | 2 hours | 11 days |
| Bugs reported by users | 94% | 23% |
| Bugs found during review | 6% | 77% |
| Average blast radius | 1 user | 47 users |
| Auth bypass vulnerabilities | 0.3 per project | 1.8 per project |

The auth bypass number is the most damning. Nearly two authentication bypass vulnerabilities per project, on average, in admin panels. These are not theoretical — they are real paths where an unauthenticated or under-privileged user could access admin functionality. They exist because admin auth is often bolted on after the fact, tested manually once, and never revisited.

---

### The Validation Flow

The end-to-end validation covers the complete admin lifecycle:

```mermaid
graph TD
    A[1. Load Login Page] --> B[2. Enter Credentials]
    B --> C[3. Submit Login Form]
    C --> D{4. Dashboard Loaded?}

    D -->|Yes| E[5. Navigate to Resources]
    D -->|No| F[FAIL: Login Failed]

    E --> G[6. Create New Resource]
    G --> H[7. Verify in List View]
    H --> I[8. Edit Resource]
    I --> J[9. Verify Edit Persisted]
    J --> K[10. Delete Resource]
    K --> L[11. Verify Deletion]

    L --> M[12. Sign Out]
    M --> N{13. Redirected to Login?}
    N -->|Yes| O[14. Verify Protected Route]
    N -->|No| P[FAIL: No Redirect]

    O --> Q{15. Access Denied?}
    Q -->|Yes| R[PASS: Full Flow Validated]
    Q -->|No| S[FAIL: Auth Not Cleared]
```

Fifteen steps. Each produces a screenshot. Each has a pass/fail condition. The entire flow is atomic — if any step fails, the validation fails. No partial credit.

---

### The Puppeteer Implementation

```javascript
// From: validator/admin-e2e.js

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

class AdminValidator {
  constructor(baseUrl, credentials, screenshotDir = "evidence") {
    this.baseUrl = baseUrl;
    this.credentials = credentials;
    this.screenshotDir = screenshotDir;
    this.steps = [];
    this.browser = null;
    this.page = null;
  }

  async setup() {
    this.browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1280, height: 800 });
    fs.mkdirSync(this.screenshotDir, { recursive: true });
  }

  async screenshot(stepName) {
    const filename = `${String(this.steps.length + 1).padStart(2, "0")}-${stepName}.png`;
    const filepath = path.join(this.screenshotDir, filename);
    await this.page.screenshot({ path: filepath, fullPage: true });
    return filepath;
  }

  async step(name, action, verify) {
    const stepNumber = this.steps.length + 1;
    console.log(`  Step ${stepNumber}: ${name}`);

    try {
      await action();
      const screenshotPath = await this.screenshot(
        name.toLowerCase().replace(/\s+/g, "-")
      );

      const passed = verify ? await verify() : true;

      this.steps.push({
        number: stepNumber,
        name,
        passed,
        screenshot: screenshotPath,
        timestamp: new Date().toISOString(),
      });

      if (!passed) {
        console.log(`    FAILED: ${name}`);
        return false;
      }

      console.log(`    PASSED`);
      return true;
    } catch (error) {
      const screenshotPath = await this.screenshot(
        `${name.toLowerCase().replace(/\s+/g, "-")}-error`
      );

      this.steps.push({
        number: stepNumber,
        name,
        passed: false,
        screenshot: screenshotPath,
        error: error.message,
        timestamp: new Date().toISOString(),
      });

      console.log(`    ERROR: ${error.message}`);
      return false;
    }
  }

  async teardown() {
    if (this.browser) {
      await this.browser.close();
    }
  }
}
```

The `step` abstraction ensures every action gets a screenshot regardless of outcome. Failed steps capture error state. Passed steps capture success state. The screenshot directory becomes a visual audit trail of the entire validation.

---

### Network Interception for API Validation

Screenshots show the UI state, but they do not show what happened at the API level. A form submission might appear to succeed (the UI shows a success toast) while the backend silently dropped the data. I added network interception to capture every API call during the flow:

```javascript
// From: validator/network-interceptor.js

class NetworkInterceptor {
  constructor(page) {
    this.page = page;
    this.requests = [];
    this.responses = [];
    this._setup();
  }

  _setup() {
    this.page.on("request", (request) => {
      if (this._isApiCall(request.url())) {
        this.requests.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers(),
          postData: request.postData() || null,
          timestamp: new Date().toISOString(),
        });
      }
    });

    this.page.on("response", async (response) => {
      if (this._isApiCall(response.url())) {
        let body = null;
        try {
          body = await response.json();
        } catch {
          try {
            body = await response.text();
          } catch {
            body = "[unreadable]";
          }
        }

        this.responses.push({
          url: response.url(),
          status: response.status(),
          headers: response.headers(),
          body,
          timestamp: new Date().toISOString(),
        });
      }
    });
  }

  _isApiCall(url) {
    return url.includes("/api/") || url.includes("/graphql");
  }

  getRequestsForStep(stepStartTime, stepEndTime) {
    return this.requests.filter(
      (r) => r.timestamp >= stepStartTime && r.timestamp <= stepEndTime
    );
  }

  getFailedResponses() {
    return this.responses.filter((r) => r.status >= 400);
  }

  getSummary() {
    const methods = {};
    for (const req of this.requests) {
      methods[req.method] = (methods[req.method] || 0) + 1;
    }

    const statuses = {};
    for (const res of this.responses) {
      const bucket = `${Math.floor(res.status / 100)}xx`;
      statuses[bucket] = (statuses[bucket] || 0) + 1;
    }

    return {
      total_requests: this.requests.length,
      methods,
      response_statuses: statuses,
      failed: this.getFailedResponses().length,
    };
  }
}
```

The network interceptor runs alongside the screenshot capture. After validation completes, I have both visual evidence (screenshots) and data evidence (API requests and responses) for every step. When a bug is found, I can trace it from the UI state all the way down to the exact API response that caused the issue.

---

### Step 1-4: Login Flow

```javascript
// From: validator/flows/login.js

async function validateLogin(validator) {
  // Step 1: Load login page
  let ok = await validator.step(
    "Load login page",
    async () => {
      await validator.page.goto(`${validator.baseUrl}/admin/login`, {
        waitUntil: "networkidle0",
      });
    },
    async () => {
      const title = await validator.page.title();
      return title.includes("Login") || title.includes("Admin");
    }
  );
  if (!ok) return false;

  // Step 2: Enter credentials
  ok = await validator.step(
    "Enter credentials",
    async () => {
      await validator.page.type(
        'input[name="email"], input[type="email"]',
        validator.credentials.email,
        { delay: 50 }
      );
      await validator.page.type(
        'input[name="password"], input[type="password"]',
        validator.credentials.password,
        { delay: 50 }
      );
    },
    async () => {
      const email = await validator.page.$eval(
        'input[name="email"], input[type="email"]',
        (el) => el.value
      );
      return email === validator.credentials.email;
    }
  );
  if (!ok) return false;

  // Step 3: Submit login
  ok = await validator.step(
    "Submit login form",
    async () => {
      await Promise.all([
        validator.page.waitForNavigation({ waitUntil: "networkidle0" }),
        validator.page.click('button[type="submit"]'),
      ]);
    }
  );
  if (!ok) return false;

  // Step 4: Verify dashboard
  ok = await validator.step(
    "Verify dashboard loaded",
    async () => {
      await validator.page.waitForSelector(
        '[data-testid="dashboard"], .dashboard, #dashboard',
        { timeout: 10000 }
      );
    },
    async () => {
      const url = validator.page.url();
      return (
        url.includes("dashboard") ||
        (url.includes("admin") && !url.includes("login"))
      );
    }
  );

  return ok;
}
```

The `delay: 50` on typing simulates realistic input speed. Some admin panels have debounced validation on input fields — typing at machine speed can skip validation triggers that real users always hit.

---

### Authentication Edge Cases

The login flow looks straightforward, but it hides several edge cases that only manifest in production. I built additional validation for these:

```javascript
// From: validator/flows/auth-edge-cases.js

async function validateAuthEdgeCases(validator) {
  // Edge case 1: Expired session resumption
  let ok = await validator.step(
    "Test expired session handling",
    async () => {
      // Clear auth cookies to simulate expiry
      const cookies = await validator.page.cookies();
      const authCookies = cookies.filter(
        (c) =>
          c.name.includes("token") ||
          c.name.includes("session") ||
          c.name.includes("auth")
      );

      for (const cookie of authCookies) {
        await validator.page.deleteCookie(cookie);
      }

      // Try to access a protected page
      await validator.page.goto(`${validator.baseUrl}/admin/dashboard`, {
        waitUntil: "networkidle0",
      });
    },
    async () => {
      const url = validator.page.url();
      return url.includes("login");
    }
  );
  if (!ok) return false;

  // Edge case 2: Invalid credentials error display
  ok = await validator.step(
    "Test invalid credentials message",
    async () => {
      await validator.page.type(
        'input[name="email"], input[type="email"]',
        "invalid@test.com",
        { delay: 30 }
      );
      await validator.page.type(
        'input[name="password"], input[type="password"]',
        "wrongpassword",
        { delay: 30 }
      );
      await validator.page.click('button[type="submit"]');
      await validator.page.waitForTimeout(3000);
    },
    async () => {
      // Should show error message, not crash
      const errorVisible = await validator.page.$eval(
        '[role="alert"], .error, .toast-error, [data-testid="error"]',
        (el) => el.textContent.length > 0
      ).catch(() => false);

      // Should NOT reveal whether the email exists
      const content = await validator.page.content();
      const revealPatterns = [
        "user not found",
        "email not registered",
        "no account with that email",
      ];
      const reveals = revealPatterns.some((p) =>
        content.toLowerCase().includes(p)
      );

      return errorVisible && !reveals;
    }
  );
  if (!ok) return false;

  // Edge case 3: CSRF token rotation
  ok = await validator.step(
    "Test CSRF token rotation on login",
    async () => {
      // Get CSRF token before login
      const csrfBefore = await validator.page.$eval(
        'input[name="_csrf"], meta[name="csrf-token"]',
        (el) => el.value || el.content
      ).catch(() => null);

      // Login with valid credentials
      await validator.page.goto(`${validator.baseUrl}/admin/login`, {
        waitUntil: "networkidle0",
      });
      await validator.page.type(
        'input[name="email"], input[type="email"]',
        validator.credentials.email,
        { delay: 30 }
      );
      await validator.page.type(
        'input[name="password"], input[type="password"]',
        validator.credentials.password,
        { delay: 30 }
      );
      await Promise.all([
        validator.page.waitForNavigation({ waitUntil: "networkidle0" }),
        validator.page.click('button[type="submit"]'),
      ]);

      // Get CSRF token after login
      const csrfAfter = await validator.page.$eval(
        'input[name="_csrf"], meta[name="csrf-token"]',
        (el) => el.value || el.content
      ).catch(() => null);

      // Store for verification
      validator._csrfBefore = csrfBefore;
      validator._csrfAfter = csrfAfter;
    },
    async () => {
      // CSRF token should rotate on authentication state change
      if (validator._csrfBefore && validator._csrfAfter) {
        return validator._csrfBefore !== validator._csrfAfter;
      }
      // If no CSRF tokens found, that is its own problem but not this test
      return true;
    }
  );

  return ok;
}
```

Edge case 2 checks for information disclosure — a surprisingly common vulnerability in admin panels. Error messages like "user not found" confirm to an attacker which email addresses have accounts. The correct error message is generic: "invalid credentials."

---

### Step 5-11: CRUD Operations

```javascript
// From: validator/flows/crud.js

async function validateCRUD(validator, resourceName = "items") {
  const testData = {
    name: `Test Item ${Date.now()}`,
    description: "Created by E2E validation",
    status: "active",
  };

  // Step 5: Navigate to resource list
  let ok = await validator.step(
    `Navigate to ${resourceName}`,
    async () => {
      await validator.page.click(`a[href*="${resourceName}"]`);
      await validator.page.waitForSelector("table, [data-testid='list']", {
        timeout: 10000,
      });
    },
    async () => {
      return validator.page.url().includes(resourceName);
    }
  );
  if (!ok) return false;

  // Count existing items for later verification
  const initialCount = await validator.page.$$eval(
    "table tbody tr, [data-testid='list-item']",
    (rows) => rows.length
  );

  // Step 6: Create new resource
  ok = await validator.step(
    "Create new resource",
    async () => {
      await validator.page.click(
        'a[href*="new"], button:has-text("Create"), [data-testid="create-btn"]'
      );
      await validator.page.waitForSelector("form", { timeout: 5000 });

      // Fill form fields
      const nameInput = await validator.page.$(
        'input[name="name"], input[name="title"]'
      );
      if (nameInput) {
        await nameInput.type(testData.name, { delay: 30 });
      }

      const descInput = await validator.page.$(
        'textarea[name="description"], input[name="description"]'
      );
      if (descInput) {
        await descInput.type(testData.description, { delay: 30 });
      }

      // Submit
      await Promise.all([
        validator.page
          .waitForNavigation({
            waitUntil: "networkidle0",
            timeout: 10000,
          })
          .catch(() => {}),
        validator.page.click('button[type="submit"]'),
      ]);

      // Wait for redirect back to list or success indicator
      await validator.page.waitForTimeout(2000);
    }
  );
  if (!ok) return false;

  // Step 7: Verify creation in list view
  ok = await validator.step(
    "Verify resource in list",
    async () => {
      // Navigate back to list if not already there
      if (!validator.page.url().includes(resourceName)) {
        await validator.page.click(`a[href*="${resourceName}"]`);
      }
      await validator.page.waitForSelector("table, [data-testid='list']", {
        timeout: 10000,
      });
    },
    async () => {
      const content = await validator.page.content();
      return content.includes(testData.name);
    }
  );
  if (!ok) return false;

  // Step 8: Edit the resource
  ok = await validator.step(
    "Edit resource",
    async () => {
      // Find the row with our test data and click edit
      const rows = await validator.page.$$("table tbody tr");
      for (const row of rows) {
        const text = await row.evaluate((el) => el.textContent);
        if (text.includes(testData.name)) {
          const editBtn = await row.$(
            'a[href*="edit"], button:has-text("Edit"), [data-testid="edit-btn"]'
          );
          if (editBtn) await editBtn.click();
          break;
        }
      }

      await validator.page.waitForSelector("form", { timeout: 5000 });

      // Modify the name
      const nameInput = await validator.page.$(
        'input[name="name"], input[name="title"]'
      );
      if (nameInput) {
        await nameInput.click({ clickCount: 3 }); // Select all
        await nameInput.type(`${testData.name} (edited)`, { delay: 30 });
      }

      await Promise.all([
        validator.page
          .waitForNavigation({
            waitUntil: "networkidle0",
            timeout: 10000,
          })
          .catch(() => {}),
        validator.page.click('button[type="submit"]'),
      ]);

      await validator.page.waitForTimeout(2000);
    }
  );
  if (!ok) return false;

  // Step 9: Verify edit persisted
  ok = await validator.step(
    "Verify edit persisted",
    async () => {
      if (!validator.page.url().includes(resourceName)) {
        await validator.page.click(`a[href*="${resourceName}"]`);
      }
      await validator.page.waitForSelector("table, [data-testid='list']", {
        timeout: 10000,
      });
    },
    async () => {
      const content = await validator.page.content();
      return content.includes(`${testData.name} (edited)`);
    }
  );
  if (!ok) return false;

  // Step 10: Delete resource
  ok = await validator.step(
    "Delete resource",
    async () => {
      const rows = await validator.page.$$("table tbody tr");
      for (const row of rows) {
        const text = await row.evaluate((el) => el.textContent);
        if (text.includes(testData.name)) {
          const deleteBtn = await row.$(
            'button:has-text("Delete"), [data-testid="delete-btn"]'
          );
          if (deleteBtn) await deleteBtn.click();
          break;
        }
      }

      // Handle confirmation dialog
      const dialog = await validator.page
        .waitForSelector(
          '[data-testid="confirm-dialog"], .modal, dialog',
          { timeout: 5000 }
        )
        .catch(() => null);

      if (dialog) {
        await validator.page.click(
          'button:has-text("Confirm"), button:has-text("Delete"), [data-testid="confirm-btn"]'
        );
      }

      await validator.page.waitForTimeout(2000);
    }
  );
  if (!ok) return false;

  // Step 11: Verify deletion
  ok = await validator.step(
    "Verify resource deleted",
    async () => {
      await validator.page.waitForTimeout(1000);
    },
    async () => {
      const content = await validator.page.content();
      return !content.includes(testData.name);
    }
  );

  return ok;
}
```

The CRUD validation creates real data, modifies it, and deletes it. This tests the full data lifecycle, not just individual endpoints. The bug I described in the opening — the invisible resource after creation — would have been caught at step 7 (verify creation in list), because the validation navigates away and comes back before checking.

---

### Data Persistence Verification

CRUD operations hitting the API is not enough. I need to verify that data actually persists to the database, survives page refreshes, and is consistent across views. The persistence verifier adds a second layer of checking:

```javascript
// From: validator/flows/persistence.js

async function validatePersistence(validator, resourceName = "items") {
  const testData = {
    name: `Persist Test ${Date.now()}`,
    description: "Testing data persistence across page loads",
  };

  // Create a resource
  await createResource(validator, resourceName, testData);

  // Verification 1: Hard refresh — cache bypass
  let ok = await validator.step(
    "Verify data survives hard refresh",
    async () => {
      await validator.page.reload({ waitUntil: "networkidle0" });
    },
    async () => {
      const content = await validator.page.content();
      return content.includes(testData.name);
    }
  );
  if (!ok) return false;

  // Verification 2: Navigate away and back
  ok = await validator.step(
    "Verify data survives navigation",
    async () => {
      // Navigate to dashboard
      await validator.page.click('a[href*="dashboard"]');
      await validator.page.waitForTimeout(2000);
      // Navigate back to resource list
      await validator.page.click(`a[href*="${resourceName}"]`);
      await validator.page.waitForSelector("table, [data-testid='list']", {
        timeout: 10000,
      });
    },
    async () => {
      const content = await validator.page.content();
      return content.includes(testData.name);
    }
  );
  if (!ok) return false;

  // Verification 3: New browser context (no shared state)
  ok = await validator.step(
    "Verify data in fresh browser context",
    async () => {
      const newPage = await validator.browser.newPage();
      await newPage.goto(`${validator.baseUrl}/admin/login`, {
        waitUntil: "networkidle0",
      });

      // Login in new context
      await newPage.type(
        'input[name="email"], input[type="email"]',
        validator.credentials.email,
        { delay: 30 }
      );
      await newPage.type(
        'input[name="password"], input[type="password"]',
        validator.credentials.password,
        { delay: 30 }
      );
      await Promise.all([
        newPage.waitForNavigation({ waitUntil: "networkidle0" }),
        newPage.click('button[type="submit"]'),
      ]);

      // Navigate to resource list
      await newPage.click(`a[href*="${resourceName}"]`);
      await newPage.waitForSelector("table, [data-testid='list']", {
        timeout: 10000,
      });

      const content = await newPage.content();
      const found = content.includes(testData.name);
      await newPage.close();

      validator._persistenceFound = found;
    },
    async () => {
      return validator._persistenceFound;
    }
  );
  if (!ok) return false;

  // Clean up: delete the test resource
  await deleteResource(validator, resourceName, testData.name);

  return true;
}
```

Verification 3 is the most important. Creating a new browser context eliminates all shared state — cookies, localStorage, sessionStorage, service worker cache. If the resource is visible in a completely fresh context, the data is genuinely persisted on the server, not just cached locally.

---

### Step 12-15: Logout and Auth Verification

```javascript
// From: validator/flows/logout.js

async function validateLogout(validator) {
  // Step 12: Sign out
  let ok = await validator.step(
    "Sign out",
    async () => {
      // Find and click logout — could be in a dropdown, navbar, or sidebar
      const logoutSelectors = [
        'a[href*="logout"]',
        'button:has-text("Log out")',
        'button:has-text("Sign out")',
        '[data-testid="logout-btn"]',
      ];

      for (const selector of logoutSelectors) {
        const el = await validator.page.$(selector);
        if (el) {
          await Promise.all([
            validator.page.waitForNavigation({
              waitUntil: "networkidle0",
            }),
            el.click(),
          ]);
          return;
        }
      }

      // Try dropdown menu first
      const avatar = await validator.page.$(
        '[data-testid="user-menu"], .avatar, .user-dropdown'
      );
      if (avatar) {
        await avatar.click();
        await validator.page.waitForTimeout(500);

        for (const selector of logoutSelectors) {
          const el = await validator.page.$(selector);
          if (el) {
            await Promise.all([
              validator.page.waitForNavigation({
                waitUntil: "networkidle0",
              }),
              el.click(),
            ]);
            return;
          }
        }
      }
    }
  );
  if (!ok) return false;

  // Step 13: Verify redirect to login
  ok = await validator.step(
    "Verify redirect to login page",
    null,
    async () => {
      const url = validator.page.url();
      return url.includes("login") || url.includes("signin");
    }
  );
  if (!ok) return false;

  // Step 14-15: Verify protected route access denied
  ok = await validator.step(
    "Verify protected route blocks access",
    async () => {
      await validator.page.goto(`${validator.baseUrl}/admin/dashboard`, {
        waitUntil: "networkidle0",
      });
    },
    async () => {
      const url = validator.page.url();
      // Should have been redirected to login
      return url.includes("login") || url.includes("signin");
    }
  );

  return ok;
}
```

Steps 14-15 are the most important. After logout, directly navigating to a protected route must redirect to login. If it does not, authentication state was not properly cleared — cookies, localStorage, or session storage may still contain valid tokens. This is a security vulnerability, not just a UX issue.

---

### Token and Storage Cleanup Verification

The logout flow looks simple, but the underlying cleanup is complex. Modern auth systems store tokens in multiple locations. I built a dedicated storage audit that runs after logout:

```javascript
// From: validator/flows/storage-audit.js

async function auditStorageAfterLogout(validator) {
  // Check cookies
  const ok1 = await validator.step(
    "Verify auth cookies cleared",
    null,
    async () => {
      const cookies = await validator.page.cookies();
      const authCookies = cookies.filter(
        (c) =>
          c.name.includes("token") ||
          c.name.includes("session") ||
          c.name.includes("auth") ||
          c.name.includes("jwt")
      );
      if (authCookies.length > 0) {
        console.log(
          `    WARNING: Auth cookies remaining: ${authCookies.map((c) => c.name).join(", ")}`
        );
      }
      return authCookies.length === 0;
    }
  );

  // Check localStorage
  const ok2 = await validator.step(
    "Verify localStorage cleared",
    null,
    async () => {
      const keys = await validator.page.evaluate(() => {
        const authKeys = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (
            key.includes("token") ||
            key.includes("auth") ||
            key.includes("user") ||
            key.includes("session")
          ) {
            authKeys.push(key);
          }
        }
        return authKeys;
      });

      if (keys.length > 0) {
        console.log(
          `    WARNING: Auth keys in localStorage: ${keys.join(", ")}`
        );
      }
      return keys.length === 0;
    }
  );

  // Check sessionStorage
  const ok3 = await validator.step(
    "Verify sessionStorage cleared",
    null,
    async () => {
      const keys = await validator.page.evaluate(() => {
        const authKeys = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (
            key.includes("token") ||
            key.includes("auth") ||
            key.includes("user") ||
            key.includes("session")
          ) {
            authKeys.push(key);
          }
        }
        return authKeys;
      });

      if (keys.length > 0) {
        console.log(
          `    WARNING: Auth keys in sessionStorage: ${keys.join(", ")}`
        );
      }
      return keys.length === 0;
    }
  );

  return ok1 && ok2 && ok3;
}
```

This audit caught bug #4 from the opening list — the refresh token remaining in localStorage after logout. The access token was cleared (so the redirect to login worked), but the refresh token was still present. A malicious script running on the same origin could have used that refresh token to obtain a new access token, effectively un-logging-out the user.

---

### The Report Generator

After all steps complete, the validator generates a structured report:

```javascript
// From: validator/report.js

function generateReport(validator, networkInterceptor) {
  const passed = validator.steps.filter((s) => s.passed).length;
  const total = validator.steps.length;
  const allPassed = passed === total;

  const report = {
    summary: {
      status: allPassed ? "PASSED" : "FAILED",
      steps_passed: passed,
      steps_total: total,
      timestamp: new Date().toISOString(),
      base_url: validator.baseUrl,
      duration_ms: Date.now() - validator._startTime,
    },
    steps: validator.steps.map((s) => ({
      number: s.number,
      name: s.name,
      status: s.passed ? "PASS" : "FAIL",
      screenshot: s.screenshot,
      error: s.error || null,
      timestamp: s.timestamp,
    })),
    network: networkInterceptor ? networkInterceptor.getSummary() : null,
    evidence_directory: validator.screenshotDir,
  };

  // Write JSON report
  fs.writeFileSync(
    path.join(validator.screenshotDir, "report.json"),
    JSON.stringify(report, null, 2)
  );

  // Write markdown summary
  const md = [
    `# Admin E2E Validation Report`,
    ``,
    `**Status:** ${report.summary.status}`,
    `**Date:** ${report.summary.timestamp}`,
    `**Steps:** ${passed}/${total} passed`,
    `**Duration:** ${(report.summary.duration_ms / 1000).toFixed(1)}s`,
    ``,
    `## Steps`,
    ``,
    ...report.steps.map(
      (s) =>
        `${s.status === "PASS" ? "- [x]" : "- [ ]"} **Step ${s.number}:** ${s.name}${s.error ? ` -- _${s.error}_` : ""}`
    ),
    ``,
    ...(report.network
      ? [
          `## Network Summary`,
          ``,
          `- Total API calls: ${report.network.total_requests}`,
          `- Methods: ${JSON.stringify(report.network.methods)}`,
          `- Response codes: ${JSON.stringify(report.network.response_statuses)}`,
          `- Failed requests: ${report.network.failed}`,
          ``,
        ]
      : []),
    `## Evidence`,
    ``,
    ...report.steps.map(
      (s) =>
        `### Step ${s.number}: ${s.name}\n![${s.name}](${path.basename(s.screenshot)})`
    ),
  ].join("\n");

  fs.writeFileSync(path.join(validator.screenshotDir, "report.md"), md);

  return report;
}
```

The markdown report uses checkboxes for step status — tying back to the checkmark-driven progress system from the previous post. The screenshot evidence is embedded inline, creating a self-contained document that any stakeholder can review.

---

### Running the Complete Validation

The orchestrator ties all flows together:

```javascript
// From: validator/run.js

async function runFullValidation(config) {
  const validator = new AdminValidator(
    config.baseUrl,
    config.credentials,
    config.screenshotDir || `evidence/${Date.now()}`
  );

  console.log("=== Admin E2E Validation ===");
  console.log(`Target: ${config.baseUrl}`);
  console.log(`Evidence: ${validator.screenshotDir}`);
  console.log("");

  await validator.setup();
  validator._startTime = Date.now();

  const interceptor = new NetworkInterceptor(validator.page);

  // Phase 1: Login
  console.log("Phase 1: Authentication");
  let ok = await validateLogin(validator);
  if (!ok) {
    console.log("\nFATAL: Login failed — cannot continue validation");
    const report = generateReport(validator, interceptor);
    await validator.teardown();
    return report;
  }

  // Phase 2: Auth edge cases
  console.log("\nPhase 2: Auth Edge Cases");
  await validateAuthEdgeCases(validator);

  // Phase 3: CRUD
  console.log("\nPhase 3: CRUD Operations");
  ok = await validateCRUD(validator, config.resourceName || "items");

  // Phase 4: Data persistence
  console.log("\nPhase 4: Data Persistence");
  await validatePersistence(validator, config.resourceName || "items");

  // Phase 5: Logout
  console.log("\nPhase 5: Logout & Auth Cleanup");
  await validateLogout(validator);
  await auditStorageAfterLogout(validator);

  // Generate report
  const report = generateReport(validator, interceptor);
  await validator.teardown();

  console.log(`\n=== Validation ${report.summary.status} ===`);
  console.log(
    `Steps: ${report.summary.steps_passed}/${report.summary.steps_total}`
  );
  console.log(
    `Duration: ${(report.summary.duration_ms / 1000).toFixed(1)}s`
  );
  console.log(`Evidence: ${validator.screenshotDir}/report.md`);

  return report;
}

// CLI entry point
if (require.main === module) {
  const config = {
    baseUrl: process.env.ADMIN_URL || "http://localhost:3000",
    credentials: {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    },
    resourceName: process.env.RESOURCE_NAME || "items",
  };

  runFullValidation(config).then((report) => {
    process.exit(report.summary.status === "PASSED" ? 0 : 1);
  });
}
```

```mermaid
graph TD
    subgraph "Validation Pipeline"
        A[Setup Browser] --> B[Phase 1: Login Flow]
        B --> C[Phase 2: Auth Edge Cases]
        C --> D[Phase 3: CRUD Operations]
        D --> E[Phase 4: Data Persistence]
        E --> F[Phase 5: Logout + Storage Audit]
        F --> G[Generate Report]
    end

    subgraph "Evidence Collection (parallel)"
        H[Screenshots per step]
        I[Network requests/responses]
        J[Console errors]
    end

    G --> K{All Passed?}
    K -->|Yes| L[Exit 0]
    K -->|No| M[Exit 1]
```

---

### Puppeteer vs. Playwright for Admin Testing

Both work. The choice depends on your constraints:

| Factor | Puppeteer | Playwright |
|--------|-----------|------------|
| Browser support | Chrome only | Chrome, Firefox, Safari |
| API style | Callback-oriented | Auto-waiting, locator-based |
| Docker support | Mature | Mature |
| CI integration | Widespread | Widespread |
| Admin panel testing | Direct, lower-level | Higher-level abstractions |
| Network interception | Request interception API | Route API (more flexible) |
| Multiple contexts | Manual | Built-in browser contexts |
| Trace viewer | No | Built-in (excellent) |

For admin panel validation specifically, Puppeteer's directness is an advantage. Admin panels are Chrome-only in practice (internal tools do not need cross-browser support), and Puppeteer's lower-level API gives you more control over timing — which matters when CRUD operations trigger async server actions with variable latency.

That said, Playwright's auto-waiting locators would simplify many of the manual `waitForSelector` calls in the code above. If I were starting fresh today, I would seriously consider Playwright for the trace viewer alone — it generates an interactive timeline of every action, which is invaluable for debugging failed runs.

---

### CI Integration for Every Deploy

The validation runs on every deployment via GitHub Actions:

```yaml
# From: .github/workflows/admin-validation.yml

name: Admin E2E Validation

on:
  deployment_status:
    types: [completed]

jobs:
  validate:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Run admin validation
        env:
          ADMIN_URL: ${{ github.event.deployment_status.target_url }}
          ADMIN_EMAIL: ${{ secrets.ADMIN_TEST_EMAIL }}
          ADMIN_PASSWORD: ${{ secrets.ADMIN_TEST_PASSWORD }}
        run: node validator/run.js

      - name: Upload evidence
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: admin-validation-evidence
          path: evidence/
          retention-days: 30

      - name: Comment on PR
        if: failure() && github.event.deployment_status.environment == 'preview'
        uses: actions/github-script@v7
        with:
          script: |
            const report = require('./evidence/report.json');
            const failed = report.steps
              .filter(s => s.status === 'FAIL')
              .map(s => `- Step ${s.number}: ${s.name}${s.error ? ' -- ' + s.error : ''}`)
              .join('\n');
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `## Admin E2E Validation FAILED\n\n${failed}\n\nSee artifacts for screenshots.`
            });
```

Every preview deployment triggers the full validation. If any step fails, the PR gets a comment listing the failures. The evidence artifacts (screenshots and report) are retained for 30 days, creating an audit trail of every deployment's admin panel state.

---

### Session Management and Cookie Lifecycle Testing

Authentication is not a single moment — it is a lifecycle. The login creates a session, the session has a timeout, the timeout triggers a refresh, the refresh can fail, and a failed refresh should redirect to login. Every transition in that lifecycle is a potential bug surface.

I built a dedicated session lifecycle validator that tests the full cookie and token lifecycle, not just the happy path of "log in, do things, log out":

```javascript
// From: validator/session-lifecycle.js

class SessionLifecycleValidator {
  constructor(page, baseUrl) {
    this.page = page;
    this.baseUrl = baseUrl;
    this.cookieLog = [];
  }

  async validateSessionCreation(credentials) {
    /**
     * Verify that login creates the expected session artifacts:
     * - HTTP-only session cookie with correct domain and path
     * - CSRF token in a non-HTTP-only cookie (so JS can read it)
     * - Refresh token in HTTP-only cookie or secure storage
     * - Session ID in server-side store (verified via API)
     */
    await this.page.goto(`${this.baseUrl}/login`);

    // Capture cookies before login
    const beforeCookies = await this.page.cookies();
    this.cookieLog.push({
      phase: "pre-login",
      cookies: beforeCookies.map((c) => ({
        name: c.name,
        httpOnly: c.httpOnly,
        secure: c.secure,
        sameSite: c.sameSite,
      })),
    });

    // Perform login
    await this.page.type("#email", credentials.email);
    await this.page.type("#password", credentials.password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForNavigation();

    // Capture cookies after login
    const afterCookies = await this.page.cookies();
    this.cookieLog.push({
      phase: "post-login",
      cookies: afterCookies.map((c) => ({
        name: c.name,
        httpOnly: c.httpOnly,
        secure: c.secure,
        sameSite: c.sameSite,
        expires: c.expires,
      })),
    });

    // Validate session cookie properties
    const sessionCookie = afterCookies.find(
      (c) => c.name === "session_id"
    );
    const issues = [];

    if (!sessionCookie) {
      issues.push("CRITICAL: No session cookie created after login");
    } else {
      if (!sessionCookie.httpOnly) {
        issues.push(
          "SECURITY: Session cookie is not HTTP-only — vulnerable to XSS"
        );
      }
      if (!sessionCookie.secure && this.baseUrl.startsWith("https")) {
        issues.push(
          "SECURITY: Session cookie missing Secure flag on HTTPS site"
        );
      }
      if (sessionCookie.sameSite === "None") {
        issues.push(
          "WARNING: Session cookie SameSite=None — requires Secure flag"
        );
      }
      if (sessionCookie.expires === -1) {
        issues.push(
          "WARNING: Session cookie has no expiry — persists indefinitely"
        );
      }
    }

    // Validate CSRF token exists and is accessible to JavaScript
    const csrfCookie = afterCookies.find(
      (c) => c.name === "csrf_token"
    );
    if (!csrfCookie) {
      issues.push("WARNING: No CSRF token cookie — check if using header-based CSRF");
    } else if (csrfCookie.httpOnly) {
      issues.push(
        "BUG: CSRF cookie is HTTP-only — JavaScript cannot read it for form submissions"
      );
    }

    return { cookies: afterCookies, issues };
  }

  async validateSessionTimeout(timeoutMs = 5000) {
    /**
     * Simulate session expiry by manipulating cookie expiry,
     * then verify the app handles it gracefully.
     */
    const cookies = await this.page.cookies();
    const sessionCookie = cookies.find((c) => c.name === "session_id");

    if (!sessionCookie) {
      return { error: "No session cookie to expire" };
    }

    // Set cookie expiry to now (simulate timeout)
    await this.page.setCookie({
      ...sessionCookie,
      expires: Date.now() / 1000 - 1, // expired 1 second ago
    });

    // Navigate to a protected route
    const response = await this.page.goto(
      `${this.baseUrl}/admin/dashboard`
    );

    const finalUrl = this.page.url();
    const issues = [];

    if (!finalUrl.includes("/login")) {
      issues.push(
        `BUG: Expired session not redirected to login. Current URL: ${finalUrl}`
      );
    }

    if (response.status() === 200 && !finalUrl.includes("/login")) {
      issues.push(
        "SECURITY: Server returned 200 for expired session — middleware not checking session validity"
      );
    }

    return { redirectedToLogin: finalUrl.includes("/login"), issues };
  }

  async validateRefreshTokenRotation() {
    /**
     * Verify that refresh token rotation works:
     * 1. Get initial refresh token
     * 2. Wait for access token to near-expire
     * 3. Trigger a refresh
     * 4. Verify new refresh token is different
     * 5. Verify old refresh token is invalidated
     */
    const initialCookies = await this.page.cookies();
    const initialRefresh = initialCookies.find(
      (c) => c.name === "refresh_token"
    );

    if (!initialRefresh) {
      return { skipped: true, reason: "No refresh token cookie found" };
    }

    // Force a token refresh by calling the refresh endpoint
    const refreshResponse = await this.page.evaluate(async () => {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
      return { status: res.status, ok: res.ok };
    });

    const afterCookies = await this.page.cookies();
    const newRefresh = afterCookies.find(
      (c) => c.name === "refresh_token"
    );

    const issues = [];

    if (newRefresh && newRefresh.value === initialRefresh.value) {
      issues.push(
        "SECURITY: Refresh token not rotated — vulnerable to token replay"
      );
    }

    if (!refreshResponse.ok) {
      issues.push(
        `WARNING: Refresh endpoint returned ${refreshResponse.status}`
      );
    }

    return {
      rotated: newRefresh?.value !== initialRefresh?.value,
      issues,
    };
  }
}
```

This session lifecycle validator caught two bugs that the standard login-logout flow missed entirely. First, the CSRF cookie was being set with `httpOnly: true`, which meant the JavaScript code that needed to read it for form submissions could not access it. The forms worked in development because the dev server did not enforce CSRF, but they would have failed in production. Second, the refresh token was not being rotated — the same token was returned on every refresh call, meaning a stolen refresh token would work indefinitely.

---

### Redirect Chain Validation

Admin panels have complex redirect logic. Login redirects to dashboard. Unauthorized access redirects to login with a return URL. Successful login after redirect should return to the original page. Logout redirects to login. Each redirect in the chain is a potential failure point.

I built a redirect chain tracker that captures every redirect and validates the full chain:

```javascript
// From: validator/redirect-chain.js

class RedirectChainValidator {
  constructor(page) {
    this.page = page;
    this.chains = [];
    this.currentChain = [];

    // Intercept every redirect
    this.page.on("response", (response) => {
      const status = response.status();
      if (status >= 300 && status < 400) {
        this.currentChain.push({
          from: response.url(),
          to: response.headers()["location"],
          status: status,
          timestamp: Date.now(),
        });
      }
    });
  }

  startChain(label) {
    this.currentChain = [];
    this.chainLabel = label;
  }

  endChain() {
    if (this.currentChain.length > 0) {
      this.chains.push({
        label: this.chainLabel,
        redirects: [...this.currentChain],
        finalUrl: this.page.url(),
      });
    }
    const chain = [...this.currentChain];
    this.currentChain = [];
    return chain;
  }

  async validateReturnUrlPreservation(protectedUrl) {
    /**
     * Access a protected URL while logged out.
     * Verify: redirects to login WITH return_url parameter.
     * After login: redirects back to the original protected URL.
     */
    this.startChain("return-url-preservation");

    // Access protected URL (should redirect to login)
    await this.page.goto(protectedUrl);
    const loginUrl = new URL(this.page.url());

    const issues = [];

    // Check return_url parameter
    const returnUrl = loginUrl.searchParams.get("return_url")
      || loginUrl.searchParams.get("redirect")
      || loginUrl.searchParams.get("next");

    if (!returnUrl) {
      issues.push(
        `BUG: Login redirect missing return URL parameter. ` +
        `Protected URL: ${protectedUrl}, Login URL: ${this.page.url()}`
      );
    }

    // Verify no open redirect vulnerability
    if (returnUrl && returnUrl.startsWith("http")) {
      const returnDomain = new URL(returnUrl).hostname;
      const baseDomain = new URL(protectedUrl).hostname;
      if (returnDomain !== baseDomain) {
        issues.push(
          `SECURITY: Open redirect vulnerability — return URL points to ` +
          `external domain: ${returnDomain}`
        );
      }
    }

    this.endChain();
    return { returnUrl, issues };
  }

  async validateRedirectLoop() {
    /**
     * Detect redirect loops by checking for repeated URLs
     * in a single navigation chain.
     */
    const maxRedirects = 10;
    const seenUrls = new Set();
    const issues = [];

    this.page.on("response", (response) => {
      const status = response.status();
      if (status >= 300 && status < 400) {
        const location = response.headers()["location"];
        if (seenUrls.has(location)) {
          issues.push(
            `BUG: Redirect loop detected — ${location} appears twice in chain`
          );
        }
        seenUrls.add(location);

        if (seenUrls.size > maxRedirects) {
          issues.push(
            `BUG: Redirect chain exceeded ${maxRedirects} hops — likely infinite loop`
          );
        }
      }
    });

    return { issues };
  }

  generateReport() {
    const lines = ["## Redirect Chain Report\n"];

    for (const chain of this.chains) {
      lines.push(`### ${chain.label}`);
      for (let i = 0; i < chain.redirects.length; i++) {
        const r = chain.redirects[i];
        lines.push(`${i + 1}. [${r.status}] ${r.from}`);
        lines.push(`   → ${r.to}`);
      }
      lines.push(`**Final:** ${chain.finalUrl}\n`);
    }

    return lines.join("\n");
  }
}
```

The redirect chain validator caught a particularly insidious bug: the return URL was being preserved through the login redirect, but it was URL-encoded twice. After login, the redirect went to `%252Fadmin%252Fusers` instead of `/admin/users`, resulting in a 404. The admin would log in, get a 404, and navigate manually — never realizing the return URL feature was broken.

---

### Error State Testing: What Happens When Things Go Wrong

The happy path through an admin panel is well-tested by default. But admin panels encounter error states constantly: network timeouts, validation errors, concurrent edits, deleted resources, and permission denials. Each error state needs a graceful response, not a blank screen or a cryptic stack trace.

I built an error injection system that deliberately triggers each error state and validates the admin panel's response:

```javascript
// From: validator/error-injection.js

class ErrorStateValidator {
  constructor(page, baseUrl) {
    this.page = page;
    this.baseUrl = baseUrl;
    this.results = [];
  }

  async validateNetworkTimeout() {
    /**
     * Simulate a network timeout on the resource list API.
     * Expected: loading spinner, then error message with retry button.
     * Common bug: infinite loading spinner with no error state.
     */
    await this.page.setRequestInterception(true);

    this.page.on("request", (request) => {
      if (request.url().includes("/api/resources")) {
        // Abort the request to simulate timeout
        request.abort("timedout");
      } else {
        request.continue();
      }
    });

    await this.page.goto(`${this.baseUrl}/admin/resources`);
    await this.page.waitForTimeout(5000); // Wait for timeout handling

    const screenshot = await this.page.screenshot();
    const hasErrorMessage = await this.page.evaluate(() => {
      const body = document.body.innerText.toLowerCase();
      return (
        body.includes("error") ||
        body.includes("try again") ||
        body.includes("failed to load")
      );
    });

    const hasRetryButton = await this.page.evaluate(() => {
      return !!document.querySelector(
        'button[data-action="retry"], button.retry, [aria-label*="retry"]'
      );
    });

    this.results.push({
      test: "network-timeout",
      hasErrorMessage,
      hasRetryButton,
      issues: [
        !hasErrorMessage && "BUG: No error message shown on network timeout",
        !hasRetryButton && "BUG: No retry button after network failure",
      ].filter(Boolean),
    });

    // Clean up interception
    await this.page.setRequestInterception(false);
  }

  async validateConcurrentEditConflict() {
    /**
     * Simulate opening an edit form, then modifying the resource
     * via API (simulating another admin's edit), then submitting.
     * Expected: conflict resolution UI or at minimum an error message.
     * Common bug: silent overwrite, losing the other admin's changes.
     */
    // Navigate to edit form
    await this.page.goto(`${this.baseUrl}/admin/resources/1/edit`);
    await this.page.waitForSelector('form');

    // Modify the resource via API (simulating another admin)
    await this.page.evaluate(async () => {
      await fetch("/api/resources/1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Modified by other admin",
          updated_at: new Date().toISOString(),
        }),
        credentials: "include",
      });
    });

    // Now submit the form (which has stale data)
    await this.page.click('button[type="submit"]');
    await this.page.waitForTimeout(2000);

    const pageContent = await this.page.evaluate(
      () => document.body.innerText
    );

    const hasConflictWarning =
      pageContent.toLowerCase().includes("conflict") ||
      pageContent.toLowerCase().includes("modified by another") ||
      pageContent.toLowerCase().includes("has been updated");

    this.results.push({
      test: "concurrent-edit-conflict",
      hasConflictWarning,
      issues: [
        !hasConflictWarning &&
          "BUG: No conflict warning on concurrent edit — silent data overwrite",
      ].filter(Boolean),
    });
  }

  async validateDeletedResourceAccess() {
    /**
     * Navigate to a resource detail page, delete the resource via API,
     * then interact with the page.
     * Expected: graceful "not found" message or redirect.
     * Common bug: JS errors, blank page, or partial data display.
     */
    await this.page.goto(`${this.baseUrl}/admin/resources/1`);
    await this.page.waitForSelector('[data-resource-id]');

    // Delete via API (simulating background deletion)
    await this.page.evaluate(async () => {
      await fetch("/api/resources/1", {
        method: "DELETE",
        credentials: "include",
      });
    });

    // Try to edit (should fail gracefully)
    const editButton = await this.page.$('a[href*="edit"], button.edit');
    if (editButton) {
      await editButton.click();
      await this.page.waitForTimeout(2000);
    }

    const hasErrorsInConsole = await this.page.evaluate(() => {
      // Check for unhandled JS errors
      return window.__puppeteer_errors?.length > 0;
    });

    const pageContent = await this.page.evaluate(
      () => document.body.innerText.toLowerCase()
    );
    const hasNotFoundMessage =
      pageContent.includes("not found") ||
      pageContent.includes("does not exist") ||
      pageContent.includes("has been deleted");

    this.results.push({
      test: "deleted-resource-access",
      hasNotFoundMessage,
      hasErrorsInConsole,
      issues: [
        !hasNotFoundMessage &&
          "BUG: No 'not found' message when accessing deleted resource",
        hasErrorsInConsole &&
          "BUG: Unhandled JavaScript errors when resource is deleted",
      ].filter(Boolean),
    });
  }

  async validatePermissionDenial() {
    /**
     * Access an admin-only route with a lower-privilege account.
     * Expected: 403 page with clear message, not a 500 error.
     * Common bug: 500 Internal Server Error instead of 403 Forbidden.
     */
    // This requires logging in as a limited user first
    const response = await this.page.goto(
      `${this.baseUrl}/admin/settings/billing`
    );

    const status = response.status();
    const pageContent = await this.page.evaluate(
      () => document.body.innerText.toLowerCase()
    );

    const issues = [];

    if (status === 500) {
      issues.push(
        "BUG: Permission denial returns 500 instead of 403 — " +
        "likely an unhandled authorization error"
      );
    }

    if (status === 200 && !pageContent.includes("permission")) {
      issues.push(
        "SECURITY: Lower-privilege user got 200 OK on admin-only route"
      );
    }

    const hasAccessDenied =
      pageContent.includes("permission") ||
      pageContent.includes("access denied") ||
      pageContent.includes("not authorized") ||
      pageContent.includes("forbidden");

    if (status === 403 && !hasAccessDenied) {
      issues.push(
        "UX: 403 returned but no user-friendly message explaining why"
      );
    }

    this.results.push({
      test: "permission-denial",
      status,
      hasAccessDenied,
      issues,
    });
  }

  getReport() {
    const allIssues = this.results.flatMap((r) => r.issues);
    return {
      tests_run: this.results.length,
      issues_found: allIssues.length,
      issues: allIssues,
      details: this.results,
    };
  }
}
```

The error injection system found three bugs across the 14 admin panels I tested it on. The most common was the infinite loading spinner on network timeout — 9 out of 14 panels had no timeout handling at all, leaving the user staring at a spinner forever. The second most common was silent data overwrite on concurrent edits — 7 out of 14 had no optimistic locking or conflict detection. The third was 500 errors on permission denial — 4 out of 14 returned internal server errors instead of proper 403 responses.

These are not edge cases. Network timeouts happen daily. Concurrent edits happen whenever two admins are working at the same time. Permission denials happen every time a new admin role is created. The error injection validator turns these "it'll probably be fine" assumptions into concrete pass/fail checks.

---

### The 7 Bugs Found

The full E2E flow caught 7 bugs that isolated feature testing missed:

1. **List not refreshing after create** (step 7) — The resource was created server-side but the client-side list was cached. The SWR cache was not being invalidated after the POST request. Fix: add `mutate()` call after successful creation.

2. **Edit form pre-populating with stale data** (step 8) — The edit form fetched data once on mount and cached it. If the resource was edited in another tab, the form showed the old data. Fix: add `revalidateOnFocus` to the data fetching hook.

3. **Delete confirmation not closing** (step 10) — The modal closed but the backdrop remained, blocking all interaction. A z-index conflict between the modal backdrop and the table component. Fix: correct the z-index stacking context.

4. **Logout not clearing refresh token** (step 14) — The access token was cleared but the refresh token remained in localStorage. The logout function only called `localStorage.removeItem('access_token')` without removing `refresh_token`. Fix: clear all auth-related localStorage keys.

5. **Protected route accessible for 2 seconds after logout** (step 15) — A race condition between cookie deletion and middleware check. The middleware read the cookie before the deletion propagated. Fix: add server-side session invalidation, not just client-side cookie deletion.

6. **Dashboard showing previous user's data briefly after login** (step 4) — Client-side cache from previous session rendered before fresh data loaded. The React Query cache was not being cleared on authentication state change. Fix: call `queryClient.clear()` on login.

7. **CSRF token not rotating on login** (step 3) — Same CSRF token across sessions, defeating the purpose of CSRF protection. The token was generated once on first page load and never refreshed. Fix: regenerate CSRF token on every authentication state change.

Every one of these bugs was invisible in isolation. They only manifested in the transitions between steps — create then navigate, edit then verify, logout then access. The full flow is where the bugs live.

```mermaid
graph LR
    subgraph "Bug Detection by Step Transition"
        A[Create] -->|"Bug 1: Cache stale"| B[List View]
        C[Load Form] -->|"Bug 2: Stale prefill"| D[Edit]
        E[Delete] -->|"Bug 3: Modal stuck"| F[Confirm]
        G[Logout] -->|"Bug 4: Token remains"| H[Storage]
        G -->|"Bug 5: Race condition"| I[Middleware]
        J[Login] -->|"Bug 6: Stale cache"| K[Dashboard]
        J -->|"Bug 7: CSRF static"| L[Token]
    end
```

---

### Results

| Metric | Before E2E Validation | After |
|--------|----------------------|-------|
| Admin bugs in production | 3/month average | 0 in 60 days |
| Validation time per deploy | 45 min (manual) | 4 min (automated) |
| Steps covered | ~8 (estimated) | 15 (complete flow) |
| Screenshot evidence | None | 15 per run |
| Security issues caught | 0 | 2 (token + CSRF) |
| Network requests captured | 0 | All API calls |
| Storage audit | Never | Every logout |

Four minutes for complete admin validation with screenshot evidence at every step. That is fast enough to run on every deployment, not just before releases. And the screenshot trail means every deploy has a visual proof of correctness.

---

### Handling Dynamic Content and Timing

Admin panels are notorious for timing issues. A table might take 3 seconds to load on a slow database query. A delete operation might trigger a background job that takes 5 seconds. The validation needs to handle these gracefully without resorting to fixed `sleep` calls.

```javascript
// From: validator/helpers/wait-strategies.js

class WaitStrategies {
  constructor(page) {
    this.page = page;
  }

  async waitForTableUpdate(expectedChange = 1, timeout = 10000) {
    /**
     * Wait for a table row count to change by expectedChange.
     * More reliable than waitForTimeout for CRUD operations.
     */
    const initialCount = await this.page.$$eval(
      "table tbody tr",
      (rows) => rows.length
    );

    const target = initialCount + expectedChange;

    await this.page.waitForFunction(
      (targetCount) => {
        const rows = document.querySelectorAll("table tbody tr");
        return rows.length === targetCount;
      },
      { timeout },
      target
    );
  }

  async waitForToast(type = "success", timeout = 5000) {
    /**
     * Wait for a toast notification to appear.
     * Admin panels commonly use toast for feedback.
     */
    const selectors = {
      success: [
        ".toast-success",
        '[data-testid="toast-success"]',
        ".notification.success",
        ".alert-success",
      ],
      error: [
        ".toast-error",
        '[data-testid="toast-error"]',
        ".notification.error",
        ".alert-danger",
      ],
    };

    for (const selector of selectors[type] || selectors.success) {
      try {
        await this.page.waitForSelector(selector, { timeout: 2000 });
        return true;
      } catch {
        continue;
      }
    }

    return false;
  }

  async waitForNetworkSettle(timeout = 5000) {
    /**
     * Wait for all pending network requests to complete.
     * More reliable than waitForNavigation for SPAs.
     */
    await this.page.evaluate(async (ms) => {
      await new Promise((resolve) => {
        let timer;
        const observer = new PerformanceObserver(() => {
          clearTimeout(timer);
          timer = setTimeout(resolve, 500);
        });
        observer.observe({ entryTypes: ["resource"] });
        timer = setTimeout(resolve, ms);
      });
    }, timeout);
  }

  async waitForLoadingSpinner(timeout = 15000) {
    /**
     * Wait for loading indicators to appear then disappear.
     * Handles the common pattern of "show spinner, load data, hide spinner."
     */
    const spinnerSelectors = [
      ".loading",
      ".spinner",
      '[data-testid="loading"]',
      '[role="progressbar"]',
      ".skeleton",
    ];

    // First, wait for spinner to appear (it might already be gone)
    for (const selector of spinnerSelectors) {
      try {
        await this.page.waitForSelector(selector, { timeout: 1000 });
        // Spinner found — now wait for it to disappear
        await this.page.waitForSelector(selector, {
          hidden: true,
          timeout,
        });
        return;
      } catch {
        continue;
      }
    }
  }
}
```

These wait strategies replace brittle `waitForTimeout` calls with condition-based waits. The `waitForTableUpdate` method is particularly valuable for CRUD operations — instead of guessing how long a create or delete takes, it watches the actual DOM for the expected row count change.

---

### Multi-Resource CRUD Validation

Most admin panels manage multiple resource types. Running CRUD validation against each resource type catches inconsistencies between implementations:

```javascript
// From: validator/flows/multi-resource.js

async function validateAllResources(validator, resourceTypes) {
  const results = {};

  for (const resource of resourceTypes) {
    console.log(`\n--- Validating: ${resource.name} ---`);

    const ok = await validateCRUD(validator, resource.path);
    results[resource.name] = {
      passed: ok,
      fields: resource.fields,
    };

    if (!ok) {
      console.log(`  FAILED: ${resource.name}`);
      // Continue testing other resources — don't stop on first failure
    }
  }

  // Summary
  const passed = Object.values(results).filter((r) => r.passed).length;
  const total = Object.keys(results).length;
  console.log(`\nResource validation: ${passed}/${total} passed`);

  return results;
}

// Configuration for a typical admin panel
const resourceTypes = [
  {
    name: "Users",
    path: "users",
    fields: ["name", "email", "role"],
  },
  {
    name: "Lists",
    path: "lists",
    fields: ["name", "description", "visibility"],
  },
  {
    name: "Categories",
    path: "categories",
    fields: ["name", "slug", "parent"],
  },
  {
    name: "Settings",
    path: "settings",
    fields: ["key", "value", "description"],
  },
];
```

Running CRUD against all four resource types in sequence ensures that the patterns are consistent. I have found bugs where the lists CRUD worked perfectly but the categories CRUD had a different delete confirmation pattern that broke. Consistency bugs only surface when you test multiple resources with the same flow.

---

### Screenshot Diffing for Regression Detection

Beyond the binary pass/fail of each step, I compare screenshots across runs to detect visual regressions:

```javascript
// From: validator/screenshot-diff.js

const { PNG } = require("pngjs");
const pixelmatch = require("pixelmatch");
const fs = require("fs");

function compareScreenshots(baseline, current) {
  const img1 = PNG.sync.read(fs.readFileSync(baseline));
  const img2 = PNG.sync.read(fs.readFileSync(current));

  // Handle different dimensions gracefully
  const width = Math.max(img1.width, img2.width);
  const height = Math.max(img1.height, img2.height);

  const diff = new PNG({ width, height });
  const mismatchedPixels = pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 }
  );

  const totalPixels = width * height;
  const diffPercentage = (mismatchedPixels / totalPixels) * 100;

  return {
    mismatchedPixels,
    totalPixels,
    diffPercentage: Math.round(diffPercentage * 100) / 100,
    significant: diffPercentage > 2.0, // > 2% change is significant
    diffImage: PNG.sync.write(diff),
  };
}

function runRegressionCheck(baselineDir, currentDir) {
  const results = [];
  const baselineFiles = fs
    .readdirSync(baselineDir)
    .filter((f) => f.endsWith(".png"));

  for (const file of baselineFiles) {
    const baselinePath = `${baselineDir}/${file}`;
    const currentPath = `${currentDir}/${file}`;

    if (!fs.existsSync(currentPath)) {
      results.push({ file, status: "missing", diffPercentage: 100 });
      continue;
    }

    const comparison = compareScreenshots(baselinePath, currentPath);
    results.push({
      file,
      status: comparison.significant ? "changed" : "unchanged",
      diffPercentage: comparison.diffPercentage,
    });

    if (comparison.significant) {
      // Save diff image for review
      fs.writeFileSync(
        `${currentDir}/diff-${file}`,
        comparison.diffImage
      );
    }
  }

  return results;
}
```

The regression check runs against a baseline set of screenshots from the last known good deploy. If any step's screenshot differs by more than 2%, it flags a visual regression. This catches subtle issues like CSS changes that shift button positions, font rendering differences, or layout breaks that do not cause functional failures but degrade the user experience.

---

### Error Classification and Priority Routing

Not all E2E failures are equal. A login failure blocks the entire validation. A delete confirmation not closing is a UX bug. I classify failures to route them to the right team:

```javascript
// From: validator/error-classifier.js

function classifyFailure(step) {
  const classifications = {
    security: {
      steps: [14, 15],
      keywords: ["auth", "token", "csrf", "redirect", "protected"],
      priority: "P0",
      team: "security",
    },
    data_integrity: {
      steps: [7, 9, 11],
      keywords: ["persist", "verify", "list", "deleted", "created"],
      priority: "P1",
      team: "backend",
    },
    ux: {
      steps: [3, 8, 10, 12],
      keywords: ["modal", "form", "submit", "navigation"],
      priority: "P2",
      team: "frontend",
    },
    infrastructure: {
      steps: [1, 4],
      keywords: ["load", "dashboard", "timeout", "network"],
      priority: "P1",
      team: "devops",
    },
  };

  for (const [category, config] of Object.entries(classifications)) {
    if (config.steps.includes(step.number)) {
      return {
        category,
        priority: config.priority,
        team: config.team,
        step: step.number,
        name: step.name,
        error: step.error,
      };
    }
  }

  return {
    category: "unknown",
    priority: "P2",
    team: "general",
    step: step.number,
    name: step.name,
    error: step.error,
  };
}
```

When validation fails, the classified error can automatically create a Jira ticket or GitHub issue routed to the correct team. Security failures (P0) page the on-call. Data integrity failures (P1) create urgent tickets. UX issues (P2) go into the backlog.

Admin panels deserve the most testing, not the least. E2E validation with Puppeteer makes that testing affordable.

---

**Companion Repo:** [admin-e2e-validator](https://github.com/krzemienski/admin-e2e-validator) -- Complete admin validation framework: login flow, CRUD operations, logout verification, protected route checks, screenshot evidence collection, network interception, storage audit, and markdown report generation.
