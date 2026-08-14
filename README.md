# Riverside Sports Club Admin

A mobile-first club administration dashboard for staff and member-facing workflows, built with React, Vite, Redux Toolkit, and SCSS modules. The app includes login, dashboard summary cards, member listing, language switching, responsive navigation, and mock API-backed data flows.

## 1) How to run it

### Prerequisites

- Node.js 18+ recommended
- npm 9+
- A browser for local UI testing

### Install dependencies

```bash
npm install
```

### Start the mock API server

This app expects a mock backend for auth, summary data, members, and session data.

```bash
npm run api
```

By default, the mock API runs at:

- http://localhost:4000

### Start the frontend

In a second terminal:

```bash
npm run dev
```

Then open:

- http://localhost:5173

### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Run tests

#### Unit tests

```bash
npm run test
```

#### End-to-end tests

```bash
npm run test:e2e
```

#### Optional: open Playwright UI

```bash
npm run test:e2e:ui
```

### Linting

```bash
npm run lint
```

---

## 2) Decisions made and why

### Architecture decisions

#### React + Vite

I used React with Vite because the project is a single-page UI with a moderate data model and a fast feedback loop. Vite gives quick local development, excellent DX, and straightforward production builds.

This is a good fit for a product that is primarily UI-driven rather than server-heavy. It is also easy to extend without bringing in a heavy framework or a multi-step build pipeline.

#### Feature-oriented structure

The codebase is organized around feature boundaries rather than a generic “components only” structure:

- `src/features/auth`
- `src/features/dashboard`
- `src/features/members`
- `src/shared`
- `src/layouts`
- `src/routes`

This helps keep the app easier to reason about as it grows. Feature-first organization is usually a better default than a single large `src/components` tree for real products, especially when responsibilities differ by domain.

#### Redux Toolkit state management

Redux Toolkit was used for predictable state transitions and local data flow. The app has several concerns that are stateful:

- user session and auth status
- selected language
- member query/filter state
- dashboard summary
- UI state such as sidebar visibility

This makes state updates easier to control, trace, and test than ad-hoc React state scattered through many components.

I also deliberately kept the state model small and explicit instead of introducing a heavier pattern like a large global state machine or a custom data-layer abstraction.

#### Route-aware authentication gating

The app route logic checks the current path and whether the user is authenticated. This keeps the UI simple and avoids overengineering route guards.

It is intentionally lightweight:

- anonymous users see the auth shell
- authenticated users see dashboard sections
- unknown routes fall back to the appropriate layout

This is pragmatic for a small product but would likely evolve with more route metadata and permission checks in a larger app.

#### Lazy loading and fallback shell

Several routes are lazily loaded with `React.lazy()` and `Suspense`. That reduces initial bundle size and keeps the first render lighter.

This is a useful choice for a dashboard-style app where not every route or feature is needed immediately.

#### Shared API client pattern

The project has a clean shared API layer under `src/shared/api` and feature-specific service modules. This keeps the network layer centralized and makes the app easier to swap or extend later.

That is a good trade-off for medium-size applications because it reduces repeated fetch logic and encourages a single request convention.

---

### Styling decisions

#### SCSS Modules

The app uses SCSS modules instead of a single giant stylesheet. This gives:

- local component scoping
- fewer accidental global collisions
- better maintainability in a growing codebase

The project also uses CSS variables and tokens, which is a strong pattern for design consistency and theming. This keeps layout decisions and color values centralized and easier to change.

#### Mobile-first responsive approach

Responsive behavior was a key requirement. The sidebar is intentionally mobile-first and is used behind a burger-trigger pattern. On narrow screens, the sidebar becomes a slide-over drawer rather than a static desktop nav.

This is a sensible default for a club admin product where users may work from phones or tablets in the field.

The app also adapts the shell, spacing, and navigation behavior to smaller viewports without trying to reinvent a completely different mobile app framework.

#### Design tokens and layout primitives

The styling system uses tokens for spacing, colors, borders, and semantic values such as success/error states. That makes it easier to support multiple themes or later RTL/LTR updates without reworking the UI wholesale.

---

### Performance decisions

#### Debounced member search

The members table uses a debounce for search input. This prevents excessive API calls while the user types and reduces unnecessary network churn.

This is a strong choice for filtering or searching large datasets.

#### Memoized column definitions and route-level loading

The table columns are memoized, and routes are lazy-loaded. That helps prevent unnecessary render churn and limits the cost of initial navigation.

#### Minimal data-fetching strategy

The app loads only the data it needs for the active view. The dashboard summary and members table are separate concerns. This is better than a monolithic “fetch everything at app load” approach.

If more time were available, I would also consider:

- query caching with stale-while-revalidate patterns
- more selective data normalization
- virtualized rows for very large tables
- heavier bundle splitting for larger feature modules

---

### Security decisions

#### Session cookie-based auth

The mock API uses a session cookie rather than storing authentication state directly in local storage. This is a better default for real-world web apps because it reduces exposure of auth material in client storage.

#### No secret data exposure in client code

The app does not hardcode production credentials or tokens in front-end code. The mock API is intentionally local and test-only, which is appropriate for a short assignment.

#### Access boundaries are intentionally simple

For this challenge, the app treats auth as a binary condition: signed in or not signed in. That is appropriate for the brief and keeps the user flow understandable.

### role based access control 
only user  with admin role allow to access routes in this dashboard 

With more time, I would add:

- more advanced role-based access control (RBAC)
- permission-aware route guards
- authorization checks on sensitive actions (e.g., editing, deleting, class booking permissions)
- stronger validation of server-side auth data

---

### Scalability and reliability

#### Feature boundaries and modular code

The app is structured so new sections can be added without forcing all code into a single file. That keeps the project maintainable as it grows.

#### Centralized mock API and data contract assumptions

The mock API is intentionally small but realistic. It makes front-end behavior testable without a full backend. For a production app, this is a useful prototype pattern before integrating with a real API layer and schema validation.

#### Error boundaries and skeleton loading

There is an `ErrorBoundary` and a `PageSkeleton` used during auth/session hydration and route transitions. That improves resilience and prevents a single failed sub-tree from crashing the entire app.

This is a good baseline for reliability but would be expanded with more specialized error states, retry behavior, and toast notifications in real production.

#### More time would allow

- typed API responses and DTO validation
- retry policies and offline behavior
- state persistence strategy for session restoration
- end-user observability via logging and analytics
- better performance measurement and bundle analysis

---

### Error handling

The app is intentionally pragmatic:

- login errors are surfaced via the Redux auth slice
- failed member or summary calls are handled at the UI layer
- skeleton UI is displayed while checking the session
- the app uses a global error boundary for unexpected crashes

This is a good middle ground for a short project. It keeps the user from seeing a blank screen while still preserving a clear failure path.

With more time, I would add:

- explicit retry actions for failed API calls
- richer validation for user input
- centralized network error mapping
- better telemetry and logging for 4xx/5xx errors
- graceful offline states

---

### Accessibility and responsive UX

#### Accessible semantics

The app includes key ARIA behaviors:

- `aria-expanded` on the menu toggle
- `aria-controls` for menu relationships
- `aria-hidden` on the sidebar when closed
- `aria-label` on buttons and sections
- `role="dialog"` and `aria-modal="true"` for modal content

This is important for keyboard and assistive-technology users.

#### Mobile-first interaction model

The sidebar uses a fixed drawer pattern on mobile and a static nav on larger screens. This is a common and effective pattern for dashboard products.

#### More time would allow

- focus management improvements for the mobile drawer
- keyboard navigation for menu and table controls
- more robust screen-reader naming and live-region announcements
- color contrast auditing and accessibility regression checks
- handle dark mode 

---

## 3) What I would do with more time

If this project were extended beyond the brief, I would prioritize the following:

### TypeScript

- add `tsconfig.json` and strict type safety
- define interfaces for auth responses, members, sessions, and UI state
- reduce runtime mistakes caused by loose object shapes

### Test coverage

- add a larger unit test suite covering reducers, selectors, and API behavior
- add keyboard accessibility tests
- add coverage thresholds in CI
- add visual regression checks for core screens

### CI/CD and quality gates

- add a GitHub Actions workflow for lint + unit tests + build + E2E
- enforce coverage thresholds
- fail PRs when bundle size grows beyond a threshold
- run security and dependency audits

### Bundle and performance improvements

- analyze bundle composition with Vite build stats
- split routes further
- lazy-load charts and complex components
- optimize image/icon imports and assets

### Security and RBAC

- permission-aware route guards
- roles such as admin, staff, and member more advanced handling 
- explicit authorization on actions and routes
- backend-level verification for privileged actions

### Reliability

- retries for flaky network conditions
- better toast and inline error handling
- session refresh flows
- offline detection and graceful fallback messages
- add sentry configurations 
---

## 4) Tests written and why

### Existing test strategy

The project includes a mix of unit and end-to-end tests aimed at the highest-risk user flows:

#### End-to-end tests

The Playwright tests focus on realistic user journeys and accessibility contracts, which is where the product is most likely to fail in production.

Examples covered include:

- login flow
- dashboard landing state
- language switch behavior
- mobile sidebar open/close behavior
- member modal opening from a table row

These are the most important flows because they validate the actual app behavior as a user experiences it. They catch issues that unit tests often miss, especially around rendered DOM state, accessibility attributes, and interaction timing.

#### Why these tests

I prioritized tests that cover:

- the critical sign-in path
- state transitions driven by real UI interaction
- accessibility-related values such as `aria-expanded` and `aria-hidden`
- real user journeys rather than implementation details

This gives good confidence without creating a brittle suite full of CSS selector or snapshot-only assertions.

#### What I intentionally did not do

I did not spend time creating large exhaustive coverage of every possible member filter combination or every edge-case table row. That would be a lower return for the effort in a small project unless the app were much larger.
and didn't translate  fallback messages
---

## Project structure overview

```text
.
├── .github/workflows/ci.yml
├── mock-api/
│   └── server.mjs
├── public/
├── src/
│   ├── App.jsx
│   ├── features/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── members/
│   ├── layouts/
│   ├── routes/
│   ├── shared/
│   └── styles/
├── e2e/
├── package.json
├── vite.config.js
├── vitest.config.js
├── playwright.config.js
├── .eslintrc.cjs
├── .prettierrc
├── jsconfig.json
└── style.md
```

---

## Summary

This project is a pragmatic frontend implementation: fast to run, easy to reason about, responsive by default, and structured for modest growth. It uses familiar patterns that are easy to extend without over-engineering.

The biggest trade-offs are deliberate:

- small enough to maintain quickly
- realistic enough to showcase real UI patterns
- production-minded in key areas such as accessibility and state handling
- intentionally scoped to the task rather than a broad enterprise platform
-  intentionally commit  large changes and doesn't give detailed pull request  description in certain 
If more time were available, I would add stronger type safety, broader coverage, more mature CI/reliability tooling, and real RBAC/permission enforcement.
