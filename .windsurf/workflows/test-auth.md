# Workflow: Test Authentication Page
# This file is read by the Windsurf AI agent as context before it acts.
# The agent uses the Playwright MCP Server to control a real browser.

---

## Goal
Test the authentication (login) page of the target website end-to-end using a real browser.

## Input
- Read `config/sites.json` to get:
  - `baseUrl`       → the website root (e.g. https://abc.com)
  - `authPage`      → path to login page (e.g. /login)
  - `testUser`      → email and password to use for testing

## Steps to Execute (via Playwright MCP)

### Step 1 — Navigate to Login Page
- Use the Playwright MCP tool `browser_navigate`
- URL: `{baseUrl}{authPage}` from sites.json

### Step 2 — Assert Login Page Loaded
- Use `browser_snapshot` to capture page state
- Verify the page contains a username/email field and a password field
- If not found, report: "Login page structure not as expected" and stop

### Step 3 — Fill Credentials
- Use `browser_type` to fill the email/username field with `testUser.email`
- Use `browser_type` to fill the password field with `testUser.password`

### Step 4 — Submit the Form
- Use `browser_click` on the submit / login button

### Step 5 — Assert Successful Login
- Use `browser_snapshot` after form submission
- Check that the page does NOT still show the login form
- Check for a success indicator: dashboard element, welcome message, or URL change
- If still on login page: report "Login FAILED — still on auth page"
- If redirected/success element found: report "Login PASSED ✅"

### Step 6 — Test Invalid Credentials (Negative Test)
- Navigate back to `{baseUrl}{authPage}`
- Fill email: `wrong@example.com`, password: `wrongpassword`
- Submit the form
- Assert that an error message appears (e.g. "Invalid credentials", "Wrong password")
- Report result

### Step 7 — Test Empty Submission
- Navigate back to `{baseUrl}{authPage}`
- Click submit without filling any fields
- Assert that validation messages appear
- Report result

## Expected Outputs
After all steps, summarize:
```
Auth Page Test Summary for: {baseUrl}
--------------------------------------
✅ Page loads correctly
✅ Valid login: PASS / ❌ FAIL
✅ Invalid login shows error: PASS / ❌ FAIL
✅ Empty submit shows validation: PASS / ❌ FAIL
```

## Notes
- Do not hardcode URLs or credentials — always read from `config/sites.json`
- Take a `browser_snapshot` before and after each major action for traceability
- If any step throws a Playwright MCP error, log the error and continue to the next test
