# AI Usage Report – Assignment 3 (Advanced Functionality)

**Name:** Hassan Almarhoon
**Student ID:** 202467900
**Date:** 21 November 2026
**Repository:** `202467900-HassanAlmarhoon-assignment3`

---

## 1. Tools Used & Use Cases

| Tool | How I used it |
|---|---|
| **Claude (Anthropic)** | Reading the assignment and planning the steps, writing the GitHub API integration with error handling, writing the language filter and sort logic, planning the performance optimizations, and drafting the README and documentation |

No other AI tools were used.

## 2. Usage Log

All rows below come from one Claude conversation. If you used AI in more than one separate chat, give each its own ID.

| ID | Tool (model) | Date | Purpose | Files affected | What you changed and how you verified it |
|----|--------------|------|---------|----------------|------------------------------------------|
| C01 | Claude (Sonnet 5.5), step 1 | 2026-11-21 | Read the assignment and my Assignment 2 code; plan the steps; set up the repository structure and AI-logging process | repository structure | created the repo from the previous assignment structure |
| C01 | Claude (Sonnet 5.5), step 2 | 2026-11-21 | GitHub API integration: `fetch` call, repo cards built with `createElement`, loading and error messages with a retry button | `index.html`, `js/script.js`, `css/styles.css` | `[What you changed. Verified by: loading the page, using a wrong username (404 message), switching off the internet (network message)]` |
| C01 | Claude (Sonnet 5.5), step 3 | 2026-11-21 | Language filter and sort dropdown: `allRepos` state, `SORTERS` object, `renderRepos()` | `index.html`, `js/script.js`, `css/styles.css` | `[What you changed. Verified by: each sort option, filter plus sort together, a filter with no matches]` |
| C01 | Claude (Sonnet 5.5), step 4 | 2026-11-21 | Performance: remove Bootstrap, `defer` script, resize and convert images to WebP, `sessionStorage` cache for API data, remove `alert()` calls | `index.html`, `css/styles.css`, `js/script.js`, `assets/images/` | `[What you changed. Verified by: Lighthouse before (Performance 0/1) and after (1/1), Network tab showing no repeat API call within 10 minutes, checking the page for layout changes after removing Bootstrap]` |
| C01 | Claude (Sonnet 5.5), step 5 | 2026-11-21 | Draft `README.md`, `docs/technical-documentation.md` and this report from my Assignment 2 versions | `README.md`, `docs/*.md` | filled the placeholders, checked each claim against my code, replaced the image sizes with real numbers |

> Add a row for any other AI conversation or generated artifact. IDs run C01, C02… for conversations and A01, A02… for artifacts.

## 3. What AI Contributed and What I Did

**GitHub API integration.** Claude suggested using the GitHub REST API, since it is free, needs no key and fits a portfolio. It wrote the `fetch` logic with separate messages for network errors, rate limiting (403) and unknown users (404), and recommended building cards with `textContent` instead of `innerHTML` so API data can't inject HTML.

**Filter and sort.** Claude proposed keeping the fetched repositories in one `allRepos` array and re-rendering from it, with the sort functions stored in a `SORTERS` object keyed by the dropdown values, and filtering before sorting.

**Performance.** Claude listed the optimizations (removing Bootstrap, `defer`, WebP images with `width`/`height` and lazy loading, caching the API response) and the order to apply them. I measured with Lighthouse before and after (Performance 0/1 → 1/1; Accessibility 19/23, Best Practices 4/4 and SEO 4/6 unchanged).

**Documentation.** Claude drafted the README, technical documentation and this report using my Assignment 2 files as templates.

## 4. Understanding Check

I can explain:
- What `fetch` and `async/await` do, and why the request is wrapped in `try/catch`. A failed network request throws a `TypeError`, while an HTTP error like 404 does not throw by itself, so I check `response.ok` and `response.status`.
- Why cards are built with `createElement` and `textContent` rather than `innerHTML` (to avoid injecting HTML from API data).
- How filter and sort work together in `renderRepos()`: `.filter()` runs first, then `.sort()` with the function chosen from `SORTERS`, and the data is only fetched once.
- Why `[...new Set(...)]` gives the unique languages and why `.filter(Boolean)` is used to drop `null` values.
- How the `sessionStorage` cache works: the response is saved with a timestamp and reused if it is under 10 minutes old, which also protects the 60 requests/hour limit.
- Why `defer`, WebP images, explicit `width`/`height` and `loading="lazy"` improve loading, and why removing Bootstrap removes a render-blocking request.

## 5. Benefits and Challenges

**Benefits:** a clear step-by-step plan, working error handling for several failure cases, a cleaner structure for the filter and sort code, and a checklist of performance improvements I could measure with Lighthouse.

**Challenges and limitations:** the AI could not see the middle part of my stylesheet at first, so I had to adjust the dark-mode colours and fix any spacing that changed after removing Bootstrap myself.The AI also cannot run Lighthouse or open my site, so every result in this report comes from my own testing.

## 6. Learning Outcomes

I learned a new API that displays Github repositores, handling errors, managing states, and improveing the performance of a website.

## 7. Responsible Use & Modifications

I did not submit AI output unchanged. For each AI suggestion I read the code line by line, ran it, tested the failure cases and styling and messages to fit my project. I credited the AI in the commit messages of AI-assisted commits (`Assisted-by: Claude (Sonnet 5.5)`). The full conversation and the intermediate artifacts are in the AI Evidence ZIP on Blackboard, and neither is committed to the repository.

## 8. Declaration

> I declare that this report and the attached evidence document all of my AI use in this assignment, with complete and unedited conversations, and that I understand and can explain all the code I submitted. I understand that undeclared AI use or a false declaration will be treated as plagiarism according to KFUPM regulations.

**Name:** Hassan Almarhoon
**ID:** 202467900
**Date:** 21 November 2026
