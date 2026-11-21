# Technical Documentation – Personal Portfolio (Assignment 3)

**Version:** 3.0.0 · **Last updated:** November 2026

## 1. Overview

A static, single-page portfolio (About, Projects, GitHub, Contact) built with vanilla HTML, CSS and JavaScript. Assignment 3 adds a live GitHub API integration, a filterable and sortable repository list, response caching and a set of performance optimizations. It keeps the persistent theme and validated contact form from Assignment 2.

## 2. Technology Stack

| Layer | Technology | Notes |
|---|---|---|
| Markup | HTML5 | Semantic sections, labelled form fields and controls |
| Styling | CSS3 | Variables, Grid, Flexbox, media queries; no CSS framework |
| Scripting | JavaScript (ES6+) | No frameworks; `fetch`, `async/await`, Web Storage API, `matchMedia` |
| External API | GitHub REST API | Public, unauthenticated, 60 requests/hour per IP |

Bootstrap, used in Assignments 1 and 2, was removed in this assignment (see section 6).

## 3. File Structure

```
index.html            Page structure, GitHub section, controls, form markup
css/styles.css        All styles, including dark mode, repo cards and controls
js/script.js          Theme, smooth scroll, form validation, GitHub API, filter/sort
assets/images/        Optimized project images (WebP)
docs/                 This file and the AI usage report
```

## 4. Features

### 4.1 GitHub API integration

**Endpoint:** `GET https://api.github.com/users/hsnMarhoon/repos?sort=updated&per_page=30`

| Function | Responsibility |
|---|---|
| `showRepoStatus(message, withRetry)` | Writes a loading or error message into `#repo-status`; optionally adds a **Try again** button that calls `loadRepos` |
| `createRepoCard(repo)` | Builds one `<article class="repo-card">` with name (link), description, language, stars and date |
| `loadRepos()` | Reads the cache or fetches from the API, checks the response, filters out forks, stores the result and renders it |
| `getCachedRepos()` / `cacheRepos(data)` | Read and write the `sessionStorage` cache (see 4.4) |

**Security:** cards are built with `createElement` and `textContent`, not `innerHTML`, so repository text from the API can never inject HTML. Links use `target="_blank"` with `rel="noopener noreferrer"`.

**Error handling:**

| Situation | Message shown |
|---|---|
| Network failure (`TypeError` from `fetch`) | "Could not reach GitHub. Check your internet connection." |
| HTTP 403 (rate limit) | "GitHub rate limit reached. Please try again later." |
| HTTP 404 | "GitHub user not found." |
| Any other non-OK status | "Request failed (status)." |
| Empty result | "No public repositories to show yet." |

Every error message includes a **Try again** button, and the filter/sort controls stay hidden until a request succeeds.

### 4.2 Filter and sort (complex logic)

The visitor can filter by programming language and sort the result. The two controls combine in a fixed sequence inside `renderRepos()`:

1. Read the selected language and sort key.
2. **Filter** `allRepos` by language (or keep everything when `all`).
3. **Sort** the filtered list with the matching function from `SORTERS`.
4. Render the cards, update the "Showing X of Y" count, and show "No repositories match this filter." if the list is empty.

| Item | Description |
|---|---|
| `allRepos` | Module-level array holding the fetched repositories; the single source of truth |
| `SORTERS` | Object mapping dropdown values to compare functions: `updated-desc`, `updated-asc`, `name-asc`, `name-desc`, `stars-desc` |
| `populateLanguageFilter(repos)` | Builds the language options from the unique, non-null languages in the data |
| `renderRepos()` | Filters, sorts and renders; called on every dropdown change |
| `setupRepoControls()` | Registers the `change` listeners for both dropdowns |

Because the data is fetched once and re-rendered locally, changing the controls costs no extra API calls.

### 4.3 Theme toggle with localStorage (state management)

Unchanged from Assignment 2.

| Function | Responsibility |
|---|---|
| `getSavedTheme()` | Reads the `theme` key inside `try/catch`; returns `null` if storage is unavailable |
| `saveTheme(theme)` | Writes `'dark'` or `'light'` inside `try/catch` |
| `applyTheme(theme)` | Toggles `dark-mode` on `<body>`, updates the button text and `aria-pressed` |
| `displaytheme()` | Click handler: switches to the opposite theme, applies it and saves it |
| `loadTheme()` | On load: uses the saved theme, else the OS `prefers-color-scheme`, else light |

In this assignment the two `alert()` calls in the storage error paths were replaced with `console.warn()`, because a popup is a poor experience for a non-critical failure.

### 4.4 State summary

| State | Where it lives | Lifetime |
|---|---|---|
| Theme (`dark` / `light`) | `localStorage`, key `theme` | Permanent until cleared |
| Fetched repositories | `allRepos` variable | Until the page is closed or reloaded |
| API response cache | `sessionStorage`, key `github-repos` (`{ time, data }`) | 10 minutes, and until the tab is closed |
| Selected filter and sort | The `<select>` elements | Until the page is reloaded |

### 4.5 Contact form validation

Unchanged from Assignment 2. The form has `novalidate`, so JavaScript shows the errors.

| Field | Rules |
|---|---|
| Username | Required (after trimming) |
| Email | Required; matches `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` |
| Message | Required; at least 10 characters |

`validateField()` returns whether a field is valid and calls `setError()`, which sets `data-error` on the field's `.error-msg` span, toggles `has-error` and sets `aria-invalid`. On submit all fields are checked, focus moves to the first invalid one, and fields re-validate on `input` once they show an error. A valid submission shows a confirmation in `#form-status` (via `textContent`) and resets the form. The form is client-side only; nothing is sent anywhere.

### 4.6 Smooth scrolling

`setupSmoothScroll()` intercepts nav link clicks and calls `scrollIntoView({ behavior: 'smooth' })`.

## 5. Styling System

- **CSS variables** are defined in `:root` and overridden under `body.dark-mode`.
- **Reset:** with Bootstrap removed, a small reset sets `box-sizing: border-box`, `body { margin: 0; line-height: 1.5 }` and `img { max-width: 100%; height: auto }`.
- **Repo grid:** `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` gives as many columns as fit, with no media query needed.
- **Responsive:** extra tweaks at ≤768px and ≤480px (stacked nav, smaller headings, 16px inputs to stop iOS zoom). The filter/sort controls use `flex-wrap`, so they stack on narrow screens.

## 6. Performance

### 6.1 Optimizations

| Optimization | Why it helps |
|---|---|
| Removed Bootstrap 3.4.1 CDN stylesheet | Removes a render-blocking external request and a large amount of unused CSS |
| Script loaded with `defer` in `<head>` | The file downloads in parallel and runs after parsing, so it no longer blocks rendering |
| Images resized to about 800px wide and converted to WebP | Much smaller files; `[hotel_reservation: X KB → Y KB, game-assets: X KB → Y KB]` |
| `width`/`height` on images | The browser reserves space, preventing layout shift |
| `loading="lazy"` and `decoding="async"` on images | Offscreen images load only when needed |
| API response cached for 10 minutes | Repeat visits and reloads make no network request; protects the 60 requests/hour limit |
| Filter/sort re-render locally | No extra API calls when the controls change |
| Removed unused code and images | `alert()` calls, the startup `console.log`, old `.jpg` files and `[any unused CSS you removed]` |

### 6.2 Lighthouse results

Chrome Lighthouse, mobile mode, Incognito window.

| Category | Before | After |
|---|---|---|
| Performance | 0/1 | 1/1 |
| Accessibility | 19/23 | 19/23 |
| Best Practices | 4/4 | 4/4 |
| SEO | 4/6 | 4/6 |

Performance improved to the maximum. Accessibility and SEO did not change because the optimizations did not touch them.

## 7. Initialisation

```js
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    setupSmoothScroll();
    setupContactForm();
    setupRepoControls();
    loadRepos();
});
```

## 8. Testing

| Test | Expected result |
|---|---|
| Load the page online | Repo cards appear; forks are not shown |
| Wrong `GITHUB_USER` | "GitHub user not found." with a **Try again** button; controls hidden |
| Internet off, reload | "Could not reach GitHub." with a **Try again** button |
| Internet back on, click **Try again** | Cards load and controls appear |
| Pick a language | Only that language shows; count reads "Showing X of Y" |
| Change sort with a filter active | Filter stays; order changes correctly for each of the five options |
| Reload within 10 minutes | No new request to `api.github.com` in DevTools → Network |
| Toggle theme, refresh | Theme persists; repo cards and dropdowns readable in dark mode |
| Submit empty form | Three red messages, focus on Username |
| Email `abc` | Format error; clears when corrected |
| Valid submission | Green confirmation, form resets |
| Phone-width view | Layout stacks, nothing overflows |

`[Add the browsers/devices you actually tested and the date.]`

## 9. Known Limitations

- GitHub's unauthenticated limit is 60 requests per hour per IP address. Shared networks (such as a campus) can hit it; the cache and the error message with a retry button reduce the impact.
- Only the 30 most recently updated repositories are requested (`per_page=30`).
- Language is the single language GitHub detects for each repository; repositories without one are excluded when a specific language is chosen.
- The selected filter and sort are not remembered after a reload.
- The contact form is client-side only and does not send email. A backend or a service such as Formspree would be needed.
- Accessibility (19/23) and SEO (4/6) Lighthouse audits still have items to fix.

## 10. Troubleshooting

| Problem | Fix |
|---|---|
| No repository cards, error message shown | Check the `GITHUB_USER` value, your internet connection, and the browser console for the status code |
| "Rate limit reached" | Wait up to an hour, or open the site from a different network |
| Cards don't load when opening `index.html` directly | Some browsers block `fetch` on `file://`; use Live Server or `python -m http.server` |
| Stale repository data | Clear the `github-repos` key in *Application → Session Storage*, or wait 10 minutes |
| Theme doesn't persist | Storage may be blocked (private mode or browser setting) |
| Images missing | Check the `.webp` paths under `assets/images/` |

## 11. Deployment

Static site: push to GitHub and enable *Settings → Pages → Deploy from branch (main, /root)*, or drag the folder to Netlify. No build step or environment variables are needed, and the GitHub API call works from any host because the requested data is public.
