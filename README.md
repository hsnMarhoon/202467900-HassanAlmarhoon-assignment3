# Personal Portfolio Website – Assignment 3 (Advanced Functionality)

A responsive personal portfolio built with vanilla HTML, CSS and JavaScript. This version builds on Assignments 1 and 2 and adds a live **GitHub API integration**, a **filterable and sortable repository list**, caching, and several performance optimizations.

**Repository:** https://github.com/hsnMarhoon/202467900-HassanAlmarhoon-assignment3

---

## What's New in Assignment 3

| Requirement | What I implemented |
|---|---|
| **API integration** | Repositories are fetched live from the **GitHub REST API** (`/users/hsnMarhoon/repos`) and shown as cards. Forks are hidden. |
| **Error handling** | Friendly messages for a network failure, rate limit (HTTP 403), unknown user (404) and other failed requests, with a **Try again** button |
| **Complex logic** | Language **filter** and **sort** (newest, oldest, name A–Z / Z–A, most stars) that work together: filter first, then sort the filtered result. Also shows a "Showing X of Y" count and a "no matches" message. The contact form keeps its multi-rule validation from Assignment 2. |
| **State management** | Theme saved in `localStorage`; fetched repositories held in memory so filtering and sorting never re-fetch; API response cached in `sessionStorage` for 10 minutes |
| **Performance** | Removed Bootstrap, compressed images (WebP, resized), deferred the script, lazy-loaded images, cached API data. See [Performance Results](#performance-results). |
| **AI integration** | Claude used for code, debugging and documentation. See [AI usage](#ai-usage). |

## Features

- **GitHub repositories section** – live data with name, description, language, stars and last-updated date
- **Filter by language** – the dropdown is built from the languages that actually exist in the data
- **Sort** – five sort options that combine with the filter
- **Dark / light theme toggle** – remembered across visits, no flash of the wrong theme on load
- **Contact form validation** – required fields, email format, minimum message length, accessible error messages
- **Smooth-scrolling navigation** with a sticky nav bar
- **Project cards** with hover effects, tech tags and a responsive grid
- **Responsive design** for phone, tablet and desktop

## Project Structure

```
202467900-HassanAlmarhoon-assignment3/
├── README.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   └── images/
│       ├── hotel_reservation.webp
│       └── game-assets-reverse-engineering.webp
├── docs/
│   ├── ai-usage-report.md
│   └── technical-documentation.md
└── .gitignore
```

## How to Run Locally

No build step or installation is needed.

1. **Get the code**
   ```bash
   git clone https://github.com/hsnMarhoon/202467900-HassanAlmarhoon-assignment3
   cd 202467900-HassanAlmarhoon-assignment3
   ```
2. **Open it** using any one of these:
   - Use the *Live Server* extension in VS Code (right-click `index.html` → *Open with Live Server*), or
   - Run a local server: `python -m http.server 8000`, then visit http://localhost:8000
   - Opening `index.html` directly also works in most browsers, but some block `fetch` requests from `file://`, so a local server is recommended.
3. **An internet connection is required** for the GitHub section. Without it, the page shows an error message with a **Try again** button. The rest of the site still works.

To show your own repositories, change `GITHUB_USER` at the top of the GitHub section in `js/script.js`.

## How to Test the Features

- **API:** scroll to *My GitHub Repositories*; cards should load within a second or two.
- **API error handling:** change `GITHUB_USER` to a name that doesn't exist (expect "GitHub user not found."), or switch off your internet and reload (expect "Could not reach GitHub.") and click **Try again**.
- **Filter and sort:** choose a language, then change the sort order; the filter stays applied and the count updates. Pick a combination that matches nothing to see the empty-state message.
- **Cache:** reload the page and check DevTools → *Network*; within 10 minutes there is no new request to `api.github.com`. The data is stored under the `github-repos` key in *Application → Session Storage*.
- **Theme:** click the toggle, refresh, and the theme should persist (`theme` key in *Local Storage*).
- **Form:** submit it empty to see three red messages; type `abc` as the email to see the format message; submit valid data to see the green confirmation.

## Performance Results

Measured with Chrome Lighthouse (mobile, Incognito window), before and after the optimizations.

| Category | Before | After |
|---|---|---|
| Performance | 0/1 | **1/1** |
| Accessibility | 19/23 | 19/23 |
| Best Practices | 4/4 | 4/4 |
| SEO | 4/6 | 4/6 |

What changed: Bootstrap 3.4.1 (render-blocking CDN stylesheet) removed; images resized and converted to WebP; script loaded with `defer`; images use `loading="lazy"` and explicit `width`/`height`; GitHub API responses cached for 10 minutes. Details are in the [technical documentation](docs/technical-documentation.md#6-performance).

## Technologies

HTML5 · CSS3 (variables, Grid, Flexbox) · JavaScript (ES6+, `fetch`, `async/await`, Web Storage API) · GitHub REST API

## AI Usage

I used **Claude (Anthropic)** during this assignment for: writing the GitHub API integration with error handling, building the language filter and sort logic, planning and applying the performance optimizations, and drafting the documentation. I reviewed and tested all AI-suggested code, and I can explain how it works. The complete log and declaration are in [`docs/ai-usage-report.md`](docs/ai-usage-report.md). The full conversations are in the AI Evidence ZIP submitted on Blackboard.

## Documentation

- [Technical Documentation](docs/technical-documentation.md) – architecture, functions, API handling, performance, testing
- [AI Usage Report](docs/ai-usage-report.md) – usage log and declaration

## Browser Support

Tested in: `[list the browsers you actually tested, e.g. Chrome, Firefox, phone-width view]`. Uses features supported in current versions of Chrome, Firefox, Safari and Edge (CSS variables, Grid, `fetch`, `localStorage`, `sessionStorage`, WebP images).

---

**Last updated:** November 2026 · **Version:** 3.0.0
