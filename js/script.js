
// ============================================
// GITHUB API INTEGRATION
// ============================================

const GITHUB_USER = 'hsnMarhoon';
const REPOS_URL = `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=30`;

/**
 * Show a message (loading / error) in the status area.
 * withRetry adds a "Try again" button.
 */
function showRepoStatus(message, withRetry = false) {
    const status = document.getElementById('repo-status');
    status.textContent = message;

    if (withRetry) {
        const btn = document.createElement('button');
        btn.textContent = 'Try again';
        btn.className = 'retry-btn';
        btn.addEventListener('click', loadRepos);
        status.append(' ', btn);
    }
}

/**
 * Build one repo card using textContent (safe against injected HTML)
 */
function createRepoCard(repo) {
    const card = document.createElement('article');
    card.className = 'repo-card';

    const title = document.createElement('h3');
    const link = document.createElement('a');
    link.href = repo.html_url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = repo.name;
    title.appendChild(link);

    const desc = document.createElement('p');
    desc.textContent = repo.description || 'No description provided.';

    const meta = document.createElement('p');
    meta.className = 'repo-meta';
    const updated = new Date(repo.updated_at).toLocaleDateString();
    meta.textContent = `${repo.language || 'N/A'} · ★ ${repo.stargazers_count} · Updated ${updated}`;

    card.append(title, desc, meta);
    return card;
}

// Holds the repos fetched from the API so we can re-render without re-fetching
let allRepos = [];

/**
 * Sort functions keyed by the dropdown values
 */
const SORTERS = {
    'updated-desc': (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
    'updated-asc':  (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
    'name-asc':     (a, b) => a.name.localeCompare(b.name),
    'name-desc':    (a, b) => b.name.localeCompare(a.name),
    'stars-desc':   (a, b) => b.stargazers_count - a.stargazers_count
};

/**
 * Fill the language dropdown with the languages that actually exist in the data
 */
function populateLanguageFilter(repos) {
    const select = document.getElementById('repo-filter');
    const languages = [...new Set(repos.map(r => r.language).filter(Boolean))].sort();

    select.length = 1; // keep only the "All" option
    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = lang;
        select.appendChild(option);
    });
}

/**
 * Step 1: filter by language. Step 2: sort the result. Step 3: render.
 */
function renderRepos() {
    const list = document.getElementById('repo-list');
    const count = document.getElementById('repo-count');
    const language = document.getElementById('repo-filter').value;
    const sortKey = document.getElementById('repo-sort').value;

    const visible = allRepos
        .filter(repo => language === 'all' || repo.language === language)
        .sort(SORTERS[sortKey]);

    list.innerHTML = '';
    visible.forEach(repo => list.appendChild(createRepoCard(repo)));
    count.textContent = `Showing ${visible.length} of ${allRepos.length}`;

    // Edge case: a filter that matches nothing
    showRepoStatus(visible.length === 0 ? 'No repositories match this filter.' : '');
}

/**
 * Re-render whenever the visitor changes either dropdown
 */
function setupRepoControls() {
    document.getElementById('repo-filter').addEventListener('change', renderRepos);
    document.getElementById('repo-sort').addEventListener('change', renderRepos);
}

// Cache repos for the browser session to avoid repeat API calls
const CACHE_KEY = 'github-repos';
const CACHE_MINUTES = 10;

function getCachedRepos() {
    try {
        const cached = JSON.parse(sessionStorage.getItem(CACHE_KEY));
        if (cached && Date.now() - cached.time < CACHE_MINUTES * 60 * 1000) {
            return cached.data;
        }
    } catch (err) {
        console.warn('Cache unavailable:', err);
    }
    return null;
}

function cacheRepos(data) {
    try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), data }));
    } catch (err) {
        console.warn('Could not cache repos:', err);
    }
}

/**
 * Fetch repos from GitHub and render them
 */
async function loadRepos() {
    const list = document.getElementById('repo-list');
    if (!list) return;

    list.innerHTML = '';
    showRepoStatus('Loading repositories...');

    try {
        let repos = getCachedRepos();

        if (!repos) {
            const response = await fetch(REPOS_URL);

            if (response.status === 403) {
                throw new Error('GitHub rate limit reached. Please try again later.');
            }
            if (response.status === 404) {
                throw new Error('GitHub user not found.');
            }
            if (!response.ok) {
                throw new Error(`Request failed (${response.status}).`);
            }

            repos = await response.json();
            cacheRepos(repos);   // only successful responses are cached
        }
        const own = repos.filter(repo => !repo.fork); // hide forks

        if (own.length === 0) {
            showRepoStatus('No public repositories to show yet.');
            return;
        }

        allRepos = own;
        populateLanguageFilter(allRepos);
        document.getElementById('repo-controls').hidden = false;
        renderRepos();
    } catch (err) {
                document.getElementById('repo-controls').hidden = true;
        // Network failures throw a TypeError, so give those a friendly message too
        const msg = err instanceof TypeError
            ? 'Could not reach GitHub. Check your internet connection.'
            : err.message;
        showRepoStatus(`⚠️ ${msg}`, true);
    }
}

// ============================================
// THEME TOGGLE FUNCTIONALITY
// ============================================

/**
 * Toggle between light and dark theme
 * Stores preference in localStorage
 */
const THEME_KEY = 'theme';

function getSavedTheme() {
    try {
        return localStorage.getItem(THEME_KEY);
    } catch (err) {
        console.warn('localStorage unavailable:', err);
        return null;
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem(THEME_KEY, theme);
    } catch (err) {
        console.warn('Could not save theme preference:', err);
    }
}

function applyTheme(theme) {
    const isDark = theme === 'dark';
    const button = document.getElementById('displaytheme');
    document.body.classList.toggle('dark-mode', isDark);
    button.textContent = isDark ? 'Light Mode' : 'Dark Mode';
    button.setAttribute('aria-pressed', String(isDark));
}

function displaytheme() {
    const next = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
    applyTheme(next);
    saveTheme(next);
}

function loadTheme() {
    const saved = getSavedTheme();
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(saved || (systemDark ? 'dark' : 'light'));
}

/**
 * Smooth scroll for navigation links
 */
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
            });
        }
        });
    });
}

/**
 * Handle contact form submission
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELD_NAMES = { username: 'a username', email: 'your email address', message: 'a message' };

function setError(input, message) {
    const group = input.closest('.form-group');
    const msg = group.querySelector('.error-msg');

    if (message) {
        msg.dataset.error = message;          // CSS ::before reads this
        group.classList.add('has-error');
        input.setAttribute('aria-invalid', 'true');
    } else {
        delete msg.dataset.error;
        group.classList.remove('has-error');
        input.removeAttribute('aria-invalid');
    }
}

function validateField(input) {
    const value = input.value.trim();
    let message = '';

    if (!value) {
        message = `Please enter ${FIELD_NAMES[input.id]}.`;
    } else if (input.id === 'email' && !EMAIL_REGEX.test(value)) {
        message = 'That email looks incomplete. Use the format name@example.com.';
    } else if (input.id === 'message' && value.length < 10) {
        message = 'Your message is too short. Please write at least 10 characters.';
    }

    setError(input, message);
    return !message;
}

function setupContactForm() {
    const form = document.querySelector('.contact-container');
    if (!form) return;

    const fields = form.querySelectorAll('input, textarea');
    const status = document.getElementById('form-status');

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        status.textContent = '';

        let firstInvalid = null;
        fields.forEach(field => {
            if (!validateField(field) && !firstInvalid) firstInvalid = field;
        });

        if (firstInvalid) {
            firstInvalid.focus();
            return;
        }

        const name = document.getElementById('username').value.trim();
        status.textContent = `Thank you, ${name}! Your message has been sent. I'll reply soon.`;
        form.reset();
    });

    // Once a field shows an error, re-check it as the user fixes it
    fields.forEach(field => {
        field.addEventListener('input', () => {
            if (field.closest('.form-group').classList.contains('has-error')) {
                validateField(field);
            }
        });
    });
}


/**
 * Initialize all features on page load
 */
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    setupRepoControls();
    loadRepos();
    setupSmoothScroll();
    setupContactForm();    
});