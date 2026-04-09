// ============================================
// CONSTANTS
// ============================================

const VIEWS = {
    LANDING: 'landing',
    AUTH: 'auth',
    PROFILE_SELECTION: 'profile-selection',
    COMPANY_SEARCH: 'company-search',
    MANUAL_ENTRY: 'manual-entry',
    AI_REVIEW: 'ai-review',
    DASHBOARD: 'dashboard',
    TENDER_DETAIL: 'tender-detail',
    SETTINGS: 'settings'
};

const FILTERS = {
    ALL: 'all',
    OPEN: 'open',
    CLOSING: 'closing',
    BOOKMARKED: 'bookmarked',
    APPLIED: 'applied',
    HIDDEN: 'hidden'
};

const SORT_OPTIONS = {
    MATCH: 'match',
    DEADLINE: 'deadline',
    TITLE: 'title',
    PRICE: 'price'
};

const TENDER_STATUS = {
    OPEN: 'Offen',
    CLOSING_SOON: 'Bald fällig'
};

// ============================================
// SECURITY HELPERS
// ============================================

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} str - The string to escape
 * @returns {string} - The escaped string
 */
function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return String(str).replace(/[&<>"']/g, char => htmlEntities[char]);
}

/**
 * Validates an email address format
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates password strength
 * @param {string} password - The password to validate
 * @returns {{valid: boolean, message: string}} - Validation result
 */
function validatePassword(password) {
    if (!password || password.length < 8) {
        return { valid: false, message: 'Passwort muss mindestens 8 Zeichen lang sein.' };
    }
    return { valid: true, message: '' };
}

/**
 * Sanitizes a string for use in onclick handlers (escapes quotes)
 * @param {string} str - The string to sanitize
 * @returns {string} - The sanitized string
 */
function escapeAttr(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

/**
 * Looks up AI recommendations for a company by name
 * Uses the company's searchKey to find matching recommendations
 * @param {string} companyName - The company name to look up
 * @returns {Object|null} - The recommendation object or null if not found
 */
function getRecommendationForCompany(companyName) {
    if (!companyName) {
        console.warn('getRecommendationForCompany: No company name provided');
        return null;
    }

    // Find the company in MOCK_COMPANIES by name
    const company = MOCK_COMPANIES.find(c => c.name === companyName);

    if (company && company.searchKey && AI_RECOMMENDATIONS[company.searchKey]) {
        return AI_RECOMMENDATIONS[company.searchKey];
    }

    // Fallback: return first available recommendation
    const keys = Object.keys(AI_RECOMMENDATIONS);
    if (keys.length > 0) {
        console.warn('getRecommendationForCompany: Using fallback for company:', companyName);
        return AI_RECOMMENDATIONS[keys[0]];
    }

    console.error('getRecommendationForCompany: No recommendations available');
    return null;
}

// ============================================
// STATE
// ============================================

// Test Data - Loaded from JSON
let MOCK_COMPANIES = [];
let AI_RECOMMENDATIONS = {};
let MOCK_TENDERS = [];
let MOCK_USER_PROFILES = [];
let TEST_DATA = null;

// Current field being edited in modal
let currentEditField = null;

// Load test data from JSON
async function loadTestData() {
    try {
        const response = await fetch('data/test_data.json');
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        TEST_DATA = await response.json();

        // Map companies to expected format
        MOCK_COMPANIES = TEST_DATA.companies.map(c => ({
            name: c.name,
            uid: c.uid,
            city: c.city,
            type: c.type,
            id: c.id,
            searchKey: c.searchKey
        }));

        // Map AI recommendations - create lookup by searchKey for backwards compatibility
        AI_RECOMMENDATIONS = {};
        for (const [companyId, rec] of Object.entries(TEST_DATA.aiRecommendations)) {
            const company = TEST_DATA.companies.find(c => c.id === companyId);
            if (company) {
                // Format NPK codes as strings for display
                const formattedRec = {
                    ...rec,
                    npk: rec.npk.map(n => `${n.code} - ${n.name}`)
                };
                AI_RECOMMENDATIONS[company.searchKey] = formattedRec;
            }
        }

        // Map tenders
        MOCK_TENDERS = TEST_DATA.tenders.map(t => ({
            id: t.id,
            title: t.title,
            authority: t.authority,
            price: t.price,
            deadline: t.deadline,
            deadlineDate: t.deadlineDate,
            status: t.status,
            match: t.match,
            region: t.region,
            cpv: t.cpv,
            description: t.description,
            details: t.details,
            bookmarked: t.bookmarked,
            applied: t.applied,
            hidden: t.hidden
        }));

        // Map user profiles
        MOCK_USER_PROFILES = TEST_DATA.userProfiles.map(p => ({
            id: p.id,
            name: p.name,
            role: p.role,
            company: p.company
        }));

        console.log('Test data loaded:', MOCK_COMPANIES.length, 'companies,', MOCK_TENDERS.length, 'tenders');
        return true;
    } catch (error) {
        console.error('Failed to load test data:', error);
        console.error('Note: If using file:// protocol, run a local server instead: npx serve');
        return false;
    }
}

// State
const state = {
    view: 'landing', // landing, auth, profile-selection, company-search, ai-review, dashboard, tender-detail
    company: null,
    user: null,
    selectedTender: null,
    currentFilter: 'all', // all, open, closing, bookmarked
    currentSort: 'match' // match, deadline, title, price
};

// DOM Elements
const views = {};
const nav = {};

// Init
document.addEventListener('DOMContentLoaded', async () => {
    // Load test data first
    await loadTestData();

    // Cache Views
    ['landing', 'auth', 'profile-selection', 'company-search', 'ai-review', 'dashboard', 'tender-detail', 'settings', 'manual-entry'].forEach(id => {
        views[id] = document.getElementById(`view-${id}`);
    });

    // Navigation
    document.querySelectorAll('[data-goto]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const target = el.dataset.goto;
            navigateTo(target);
        });
    });

    // Render Profiles
    renderProfiles();

    // Init URL State
    handleUrlParams();
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.view) {
            navigateTo(e.state.view);
        }
    });

    // ... Search Logic etc ...
    const searchInput = document.getElementById('company-search-input');
    const searchResults = document.getElementById('company-search-results');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length > 2) {
                const matches = MOCK_COMPANIES.filter(c => c.name.toLowerCase().includes(query));
                renderSearchResults(matches, searchResults);
            } else {
                searchResults.innerHTML = '';
            }
        });
    }

    // Render Feed
    renderTenderFeed();

    // Initialize mobile menu selections
    updateMobileThemeSelection();
});

// ============================================
// FORM VALIDATION
// ============================================

/**
 * Shows an error message for a form field
 * @param {string} elementId - The ID of the error span element
 * @param {string} message - The error message to display
 */
function showFieldError(elementId, message) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = message;
        el.classList.remove('hidden');
    }
}

/**
 * Hides an error message for a form field
 * @param {string} elementId - The ID of the error span element
 */
function hideFieldError(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = '';
        el.classList.add('hidden');
    }
}

/**
 * Handles SSO login button clicks (placeholder for future implementation)
 * @param {string} provider - The SSO provider ('google', 'whatsapp', etc.)
 */
function handleSSOLogin(provider) {
    const providerNames = {
        google: 'Google',
        microsoft: 'Microsoft',
        whatsapp: 'WhatsApp'
    };
    const displayName = providerNames[provider] || provider;
    alert(`Demo: ${displayName} SSO wird in Kürze verfügbar sein.`);
}

/**
 * Handles login form submission with validation
 * @param {Event} event - The form submit event
 * @returns {boolean} - False to prevent default form submission
 */
function handleLogin(event) {
    event.preventDefault();

    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');

    // Reset errors
    hideFieldError('login-email-error');
    hideFieldError('login-password-error');

    let isValid = true;

    // Validate email
    const email = emailInput?.value?.trim() || '';
    if (!email) {
        showFieldError('login-email-error', 'E-Mail ist erforderlich.');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFieldError('login-email-error', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
        isValid = false;
    }

    // Validate password
    const password = passwordInput?.value || '';
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        showFieldError('login-password-error', passwordValidation.message);
        isValid = false;
    }

    if (isValid) {
        // Demo: proceed to profile selection
        navigateTo(VIEWS.PROFILE_SELECTION);
    }

    return false;
}
window.handleLogin = handleLogin;

/**
 * Handles registration form submission with validation
 * @param {Event} event - The form submit event
 * @returns {boolean} - False to prevent default form submission
 */
function handleRegister(event) {
    event.preventDefault();

    const emailInput = document.getElementById('register-email');
    const passwordInput = document.getElementById('register-password');
    const passwordConfirmInput = document.getElementById('register-password-confirm');
    const termsCheckbox = document.getElementById('register-terms');

    // Reset all errors
    hideFieldError('register-email-error');
    hideFieldError('register-password-error');
    hideFieldError('register-password-confirm-error');
    hideFieldError('register-terms-error');

    let isValid = true;

    // Validate email
    const email = emailInput?.value?.trim() || '';
    if (!email) {
        showFieldError('register-email-error', 'E-Mail ist erforderlich.');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showFieldError('register-email-error', 'Bitte geben Sie eine gültige E-Mail-Adresse ein.');
        isValid = false;
    }

    // Validate password
    const password = passwordInput?.value || '';
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
        showFieldError('register-password-error', passwordValidation.message);
        isValid = false;
    }

    // Validate password confirmation
    const passwordConfirm = passwordConfirmInput?.value || '';
    if (!passwordConfirm) {
        showFieldError('register-password-confirm-error', 'Bitte bestätigen Sie Ihr Passwort.');
        isValid = false;
    } else if (password !== passwordConfirm) {
        showFieldError('register-password-confirm-error', 'Die Passwörter stimmen nicht überein.');
        isValid = false;
    }

    // Validate terms acceptance
    if (!termsCheckbox?.checked) {
        showFieldError('register-terms-error', 'Bitte akzeptieren Sie die AGB und Datenschutzerklärung.');
        isValid = false;
    }

    if (isValid) {
        // Demo: proceed to company search
        navigateTo(VIEWS.COMPANY_SEARCH);
    }

    return false;
}
window.handleRegister = handleRegister;

// ============================================
// AUTH CONTROLLER
// ============================================

function logout() {
    state.user = null;
    state.company = null;
    state.selectedTender = null;
    state.recommendations = null;

    navigateTo(VIEWS.LANDING);
}
window.logout = logout;

// Navigation Controller
function navigateTo(viewId) {
    // Hide all
    Object.values(views).forEach(el => {
        if (el) el.classList.remove('active');
    });

    // Show Target
    if (views[viewId]) {
        views[viewId].classList.add('active');
        state.view = viewId;
        window.scrollTo(0, 0);

        // Update URL and Header
        updateUrl(viewId);
        updateHeader();
    }
}

function updateUrl(viewId) {
    const url = new URL(window.location);
    url.searchParams.set('view', viewId);
    window.history.pushState({ view: viewId }, '', url);
}

function updateHeader() {
    const authNav = document.getElementById('nav-links-auth');
    const publicNav = document.getElementById('nav-links-public');
    const authCta = document.getElementById('nav-cta-auth');
    const publicCta = document.getElementById('nav-cta-public');

    // Simple logic: If view implies auth, show auth nav
    const authViews = ['dashboard', 'settings', 'profile-selection', 'company-search', 'ai-review', 'tender-detail', 'manual-entry'];
    const isAuth = authViews.includes(state.view);

    if (isAuth) {
        if (authNav) authNav.classList.remove('hidden');
        if (publicNav) publicNav.classList.add('hidden');
        if (authCta) authCta.classList.remove('hidden');
        if (publicCta) publicCta.classList.add('hidden');
    } else {
        if (authNav) authNav.classList.add('hidden');
        if (publicNav) publicNav.classList.remove('hidden');
        if (authCta) authCta.classList.add('hidden');
        if (publicCta) publicCta.classList.remove('hidden');
    }

    // Sync mobile menu with auth state
    if (typeof syncMobileMenuAuth === 'function') {
        syncMobileMenuAuth(isAuth);
    }
}

function handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    if (view && views[view]) {
        navigateTo(view);
    }
}
window.navigateTo = navigateTo;

// Submit manual company entry with validation
function submitManualEntry() {
    const nameInput = document.getElementById('manual-name');
    const cityInput = document.getElementById('manual-city');

    const name = nameInput?.value?.trim() || '';
    const city = cityInput?.value?.trim() || '';

    // Validate required fields
    if (!name) {
        alert('Bitte geben Sie einen Firmennamen ein.');
        if (nameInput) nameInput.focus();
        return;
    }

    if (!city) {
        alert('Bitte geben Sie eine Stadt ein.');
        if (cityInput) cityInput.focus();
        return;
    }

    // Set state and navigate to AI review
    state.company = { name, city };
    selectCompany(name);
}
window.submitManualEntry = submitManualEntry;

// Helpers
function setSearch(term) {
    const input = document.getElementById('company-search-input');
    const results = document.getElementById('company-search-results');
    if (input) {
        input.value = term;
        // Trigger input event manually
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }
}

function renderSearchResults(companies, container) {
    container.innerHTML = companies.map(c => `
        <div class="card card-interactive" onclick="selectCompany('${escapeAttr(c.name)}')">
            <div class="flex justify-between items-center">
                <div>
                    <div class="text-h3">${escapeHtml(c.name)}</div>
                    <div class="text-sm text-secondary">${escapeHtml(c.uid)} • ${escapeHtml(c.city)}</div>
                </div>
                <div class="btn btn-sm btn-secondary">Auswählen</div>
            </div>
        </div>
    `).join('<div class="gap-2" style="height: 8px"></div>'); // vertical spacer
}

function selectCompany(name) {
    state.company = { name };

    // Determine recommendations using company's searchKey
    const baseRec = getRecommendationForCompany(name);

    // Clone to state to allow editing without affecting base mock (handle null case)
    state.recommendations = baseRec ? JSON.parse(JSON.stringify(baseRec)) : null;
    const rec = state.recommendations;

    // Simulate AI Processing State
    const overlayEl = document.getElementById('ai-loading-overlay');
    const contentEl = document.getElementById('ai-results-content');
    const statusTextEl = document.getElementById('ai-loading-text');

    // Reset state
    if (overlayEl) overlayEl.classList.remove('hidden');
    if (contentEl) contentEl.classList.add('hidden');

    navigateTo(VIEWS.AI_REVIEW);

    // Animation Steps
    const steps = [
        "Zefix-Datenbank wird durchsucht...",
        "Web-Präsenz wird analysiert...",
        "Branchencodes werden identifiziert...",
        "NPK-Datenbank wird geprüft...",
        "Profil wird fertiggestellt..."
    ];

    let stepIndex = 0;
    if (statusTextEl) statusTextEl.textContent = steps[0];

    const interval = setInterval(() => {
        stepIndex++;
        if (stepIndex < steps.length && statusTextEl) {
            statusTextEl.textContent = steps[stepIndex];
        }
    }, 800); // Change text every 800ms

    setTimeout(() => {
        clearInterval(interval);

        // Guard against null recommendations
        if (!rec) {
            console.error('No recommendations found for company:', name);
            if (overlayEl) overlayEl.classList.add('hidden');
            if (contentEl) contentEl.classList.remove('hidden');
            return;
        }

        // Hydrate AI Review View
        const nameEl = document.getElementById('ai-company-name');
        if (nameEl) nameEl.textContent = name;

        // Industry
        const industryEl = document.getElementById('ai-industry');
        if (industryEl) industryEl.textContent = rec.industry || '';

        // Size
        const sizeEl = document.getElementById('ai-size');
        if (sizeEl) sizeEl.textContent = rec.size || '';

        // Keywords - with null checks
        const keywordsContainer = document.getElementById('ai-keywords');
        if (keywordsContainer) {
            const positive = (rec.keywords || []).map(k =>
                `<span class="badge badge-green mr-1 mb-1">+ ${escapeHtml(k)}</span>`
            ).join('');
            const negative = (rec.excludeKeywords || []).map(k =>
                `<span class="badge badge-red mr-1 mb-1">- ${escapeHtml(k)}</span>`
            ).join('');
            keywordsContainer.innerHTML = positive + negative;
        }

        // NPK Codes - with null checks
        const npkSection = document.getElementById('ai-npk-section');
        const npkContainer = document.getElementById('ai-npk-codes');
        if (npkSection && npkContainer) {
            if (rec.npk && rec.npk.length > 0) {
                npkSection.style.display = 'block';
                npkContainer.innerHTML = rec.npk.map(code =>
                    `<div class="flex items-center gap-2"><svg class="text-accent" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> <span>${escapeHtml(code)}</span></div>`
                ).join('');
            } else {
                npkSection.style.display = 'none';
            }
        }

        // CPV Codes - with null checks
        const cpvContainer = document.getElementById('ai-cpv-codes');
        if (cpvContainer && rec.cpv) {
            cpvContainer.innerHTML = rec.cpv.map(c => `
                <div class="flex items-center gap-2">
                    <svg class="text-accent" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <span>${escapeHtml(c.code)} - ${escapeHtml(c.label)}</span>
                </div>
            `).join('');
        }

        // Region
        const regionEl = document.getElementById('ai-region');
        if (regionEl) regionEl.textContent = rec.region || '';

        // Visual Transition - Hide Overlay, Show Content
        if (overlayEl) overlayEl.classList.add('hidden');
        if (contentEl) contentEl.classList.remove('hidden');

    }, 4000); // 4s total duration
}

function renderTenderFeed(tenders = MOCK_TENDERS) {
    const feedContainerEl = document.getElementById('tender-feed');
    if (!feedContainerEl) return;

    // Update filter counts
    updateFilterCounts();

    if (tenders.length === 0) {
        feedContainerEl.innerHTML = `<div class="p-8 text-center text-secondary">Keine Ausschreibungen gefunden.</div>`;
        return;
    }

    feedContainerEl.innerHTML = tenders.map(t => {
        let badgeColor = 'green';
        if (t.status === TENDER_STATUS.CLOSING_SOON) badgeColor = 'orange';
        if (t.applied) badgeColor = 'blue';

        // Status indicators (escape status text)
        const statusBadge = t.applied
            ? `<span class="badge badge-blue">Beworben</span>`
            : `<span class="badge badge-${badgeColor}">${escapeHtml(t.status)}</span>`;

        // Action button states
        const bookmarkClass = t.bookmarked ? 'is-active' : '';
        const appliedClass = t.applied ? 'is-active' : '';
        const hiddenClass = t.hidden ? 'is-active' : '';

        // Ensure ID is numeric to prevent injection
        const tenderId = parseInt(t.id, 10);

        return `
            <div class="card card-interactive" onclick="viewTender(${tenderId})">
                <div class="flex justify-between items-center mb-3">
                    ${statusBadge}
                    <span class="text-h3 text-accent">${parseInt(t.match, 10)}%</span>
                </div>
                <h3 class="text-h3 mb-2">${escapeHtml(t.title)}</h3>
                <div class="text-secondary text-sm mb-4">${escapeHtml(t.authority)}</div>

                <div class="flex justify-between items-center text-sm text-muted mb-4">
                    <span>${escapeHtml(t.price)}</span>
                    <span class="flex items-center gap-1">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        ${escapeHtml(t.deadline)}
                    </span>
                </div>

                <div class="tender-actions">
                    <button class="tender-action ${bookmarkClass}" onclick="toggleBookmark(${tenderId}, event)" title="${t.bookmarked ? 'Nicht mehr merken' : 'Merken'}" aria-label="${t.bookmarked ? 'Nicht mehr merken' : 'Merken'}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="${t.bookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
                        </svg>
                        <span>${t.bookmarked ? 'Gemerkt' : 'Merken'}</span>
                    </button>
                    <button class="tender-action ${appliedClass}" onclick="toggleApplied(${tenderId}, event)" title="${t.applied ? 'Bewerbung zurückziehen' : 'Als beworben markieren'}" aria-label="${t.applied ? 'Bewerbung zurückziehen' : 'Als beworben markieren'}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        <span>${t.applied ? 'Beworben' : 'Bewerben'}</span>
                    </button>
                    <button class="tender-action ${hiddenClass}" onclick="toggleHidden(${tenderId}, event)" title="${t.hidden ? 'Wieder anzeigen' : 'Ausblenden'}" aria-label="${t.hidden ? 'Wieder anzeigen' : 'Ausblenden'}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            ${t.hidden
                                ? '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'
                                : '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>'
                            }
                        </svg>
                        <span>${t.hidden ? 'Anzeigen' : 'Ausblenden'}</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Filter tabs functionality
function filterTenders(filter) {
    state.currentFilter = filter;

    // Update active tab styling (only target buttons with data-filter attribute)
    const tabs = document.querySelectorAll('#filter-tabs button[data-filter]');
    tabs.forEach(tab => {
        if (tab.dataset.filter === filter) {
            tab.classList.remove('btn-ghost');
            tab.classList.add('btn-primary');
        } else {
            tab.classList.remove('btn-primary');
            tab.classList.add('btn-ghost');
        }
    });

    // Filter the tenders
    let filtered = MOCK_TENDERS;

    switch (filter) {
        case FILTERS.OPEN:
            filtered = MOCK_TENDERS.filter(t => t.status === TENDER_STATUS.OPEN && !t.hidden);
            break;
        case FILTERS.CLOSING:
            filtered = MOCK_TENDERS.filter(t => t.status === TENDER_STATUS.CLOSING_SOON && !t.hidden);
            break;
        case FILTERS.BOOKMARKED:
            filtered = MOCK_TENDERS.filter(t => t.bookmarked === true && !t.hidden);
            break;
        case FILTERS.APPLIED:
            filtered = MOCK_TENDERS.filter(t => t.applied === true);
            break;
        case FILTERS.HIDDEN:
            filtered = MOCK_TENDERS.filter(t => t.hidden === true);
            break;
        case FILTERS.ALL:
        default:
            // "All" excludes hidden tenders
            filtered = MOCK_TENDERS.filter(t => !t.hidden);
            break;
    }

    // Apply current sort
    const sorted = getSortedTenders(filtered);
    renderTenderFeed(sorted);
}

function updateFilterCounts() {
    const countAll = document.getElementById('count-all');
    const countOpen = document.getElementById('count-open');
    const countClosing = document.getElementById('count-closing');
    const countBookmarked = document.getElementById('count-bookmarked');
    const countApplied = document.getElementById('count-applied');
    const countHidden = document.getElementById('count-hidden');

    // "All" count excludes hidden
    if (countAll) countAll.textContent = MOCK_TENDERS.filter(t => !t.hidden).length;
    if (countOpen) countOpen.textContent = MOCK_TENDERS.filter(t => t.status === TENDER_STATUS.OPEN && !t.hidden).length;
    if (countClosing) countClosing.textContent = MOCK_TENDERS.filter(t => t.status === TENDER_STATUS.CLOSING_SOON && !t.hidden).length;
    if (countBookmarked) countBookmarked.textContent = MOCK_TENDERS.filter(t => t.bookmarked === true && !t.hidden).length;
    if (countApplied) countApplied.textContent = MOCK_TENDERS.filter(t => t.applied === true).length;
    if (countHidden) countHidden.textContent = MOCK_TENDERS.filter(t => t.hidden === true).length;
}

// Toggle tender status functions
function toggleBookmark(id, event) {
    event.stopPropagation();
    const tender = MOCK_TENDERS.find(t => t.id === id);
    if (tender) {
        tender.bookmarked = !tender.bookmarked;
        filterTenders(state.currentFilter);
    }
}

function toggleApplied(id, event) {
    event.stopPropagation();
    const tender = MOCK_TENDERS.find(t => t.id === id);
    if (tender) {
        tender.applied = !tender.applied;
        filterTenders(state.currentFilter);
    }
}

function toggleHidden(id, event) {
    event.stopPropagation();
    const tender = MOCK_TENDERS.find(t => t.id === id);
    if (tender) {
        tender.hidden = !tender.hidden;
        filterTenders(state.currentFilter);
    }
}

// Make functions globally available
window.filterTenders = filterTenders;
window.toggleBookmark = toggleBookmark;
window.toggleApplied = toggleApplied;
window.toggleHidden = toggleHidden;

// Sorting functionality
function toggleSortDropdown() {
    const dropdownEl = document.querySelector('.sort-dropdown');
    if (dropdownEl) {
        dropdownEl.classList.toggle('is-open');
    }
}

function sortTenders(sortBy) {
    state.currentSort = sortBy;

    // Update dropdown UI
    const sortLabel = document.getElementById('sort-label');
    const sortOptions = document.querySelectorAll('.sort-option');

    const labels = {
        match: 'Match',
        deadline: 'Frist',
        title: 'Titel',
        price: 'Wert'
    };

    if (sortLabel) sortLabel.textContent = labels[sortBy] || sortBy;

    sortOptions.forEach(opt => {
        opt.classList.remove('is-active');
        if (opt.textContent.toLowerCase().includes(sortBy) ||
            (sortBy === 'match' && opt.textContent.includes('Match')) ||
            (sortBy === 'deadline' && opt.textContent.includes('Frist')) ||
            (sortBy === 'title' && opt.textContent.includes('Titel')) ||
            (sortBy === 'price' && opt.textContent.includes('Auftragswert'))) {
            opt.classList.add('is-active');
        }
    });

    // Close dropdown
    const dropdownEl = document.querySelector('.sort-dropdown');
    if (dropdownEl) dropdownEl.classList.remove('is-open');

    // Re-apply current filter (which will also apply sort)
    filterTenders(state.currentFilter);
}

function getSortedTenders(tenders) {
    const sorted = [...tenders];

    switch (state.currentSort) {
        case 'match':
            sorted.sort((a, b) => b.match - a.match);
            break;
        case 'deadline':
            sorted.sort((a, b) => new Date(a.deadlineDate) - new Date(b.deadlineDate));
            break;
        case 'title':
            sorted.sort((a, b) => a.title.localeCompare(b.title, 'de'));
            break;
        case 'price':
            // Extract numeric value from price string for sorting
            const getPrice = (p) => {
                const match = p.price.match(/[\d.]+/);
                return match ? parseFloat(match[0]) : 0;
            };
            sorted.sort((a, b) => getPrice(b) - getPrice(a));
            break;
    }

    return sorted;
}

// Close sort dropdown when clicking outside
document.addEventListener('click', (e) => {
    const sortDropdownEl = document.querySelector('.sort-dropdown');
    if (sortDropdownEl && !sortDropdownEl.contains(e.target)) {
        sortDropdownEl.classList.remove('is-open');
    }
});

// Profile settings - open wizard to edit search profile
function openProfileSettings() {
    // Ensure we have recommendations data for the current profile
    if (!state.recommendations && state.company) {
        // Look up recommendation using company's searchKey
        const baseRec = getRecommendationForCompany(state.company.name);

        // Clone to state (handle null case)
        state.recommendations = baseRec ? JSON.parse(JSON.stringify(baseRec)) : null;
    }

    // Populate the AI review view with current data
    const rec = state.recommendations;

    // Company name (always show, even without recommendations)
    const nameEl = document.getElementById('ai-company-name');
    if (nameEl) nameEl.textContent = state.company?.name || 'Unbekannt';

    if (rec) {
        // Industry
        const industryEl = document.getElementById('ai-industry');
        if (industryEl) industryEl.textContent = rec.industry || '';

        // Size
        const sizeEl = document.getElementById('ai-size');
        if (sizeEl) sizeEl.textContent = rec.size || '';

        // Keywords - with null checks
        const keywordsContainer = document.getElementById('ai-keywords');
        if (keywordsContainer) {
            const positive = (rec.keywords || []).map(k =>
                `<span class="badge badge-green mr-1 mb-1">+ ${escapeHtml(k)}</span>`
            ).join('');
            const negative = (rec.excludeKeywords || []).map(k =>
                `<span class="badge badge-red mr-1 mb-1">- ${escapeHtml(k)}</span>`
            ).join('');
            keywordsContainer.innerHTML = positive + negative;
        }

        // NPK Codes - with null checks
        const npkSection = document.getElementById('ai-npk-section');
        const npkContainer = document.getElementById('ai-npk-codes');
        if (npkSection && npkContainer) {
            if (rec.npk && rec.npk.length > 0) {
                npkSection.style.display = 'block';
                npkContainer.innerHTML = rec.npk.map(code =>
                    `<div class="flex items-center gap-2"><svg class="text-accent" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> <span>${escapeHtml(code)}</span></div>`
                ).join('');
            } else {
                npkSection.style.display = 'none';
            }
        }

        // Regions - with null checks
        const regionsContainer = document.getElementById('ai-regions');
        if (regionsContainer) {
            if (rec.regions) {
                regionsContainer.innerHTML = rec.regions.map(r =>
                    `<span class="badge badge-blue mr-1 mb-1">${escapeHtml(r)}</span>`
                ).join('');
            } else if (rec.region) {
                // Fallback to single region field
                regionsContainer.innerHTML = `<span class="badge badge-blue mr-1 mb-1">${escapeHtml(rec.region)}</span>`;
            }
        }

        // CPV Codes - with null checks
        const cpvContainer = document.getElementById('ai-cpv-codes');
        if (cpvContainer && rec.cpv) {
            cpvContainer.innerHTML = rec.cpv.map(code =>
                `<div class="flex items-center gap-2"><svg class="text-accent" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> <span>${escapeHtml(code)}</span></div>`
            ).join('');
        }
    } else {
        console.warn('openProfileSettings: No recommendations available for', state.company?.name);
    }

    // Show content directly (skip loading animation)
    const overlayEl = document.getElementById('ai-loading-overlay');
    const contentEl = document.getElementById('ai-results-content');
    if (overlayEl) overlayEl.classList.add('hidden');
    if (contentEl) contentEl.classList.remove('hidden');

    // Navigate to the AI review view
    navigateTo(VIEWS.AI_REVIEW);
}

window.toggleSortDropdown = toggleSortDropdown;
window.sortTenders = sortTenders;
window.openProfileSettings = openProfileSettings;

function viewTender(id) {
    const tender = MOCK_TENDERS.find(t => t.id === id);
    if (!tender) return;

    state.selectedTender = tender;

    // Update Breadcrumbs
    const breadcrumbs = document.getElementById('tender-detail-breadcrumbs');
    if (breadcrumbs) {
        breadcrumbs.innerHTML = `
            <span class="breadcrumb-item is-clickable" onclick="navigateTo('${VIEWS.PROFILE_SELECTION}')">Meine Profile</span>
            <span class="breadcrumb-separator">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                </svg>
            </span>
            <span class="breadcrumb-item is-clickable" onclick="navigateTo('${VIEWS.DASHBOARD}')">Müller Bau AG</span>
            <span class="breadcrumb-separator">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                </svg>
            </span>
            <span class="breadcrumb-item is-current is-truncate">${escapeHtml(tender.title)}</span>
        `;
    }

    // Safely build details list if present
    let detailsList = '';
    if (tender.details) {
        const items = [];
        if (tender.details.baustart) {
            items.push(`<li>Baustart: ${escapeHtml(tender.details.baustart)}</li>`);
        }
        if (tender.details.dauer) {
            items.push(`<li>Dauer: ${escapeHtml(tender.details.dauer)}</li>`);
        }
        if (tender.details.bkp && tender.details.bkp.length > 0) {
            const bkpEscaped = tender.details.bkp.map(b => escapeHtml(b)).join(', ');
            items.push(`<li>BKP ${bkpEscaped}</li>`);
        }
        if (items.length > 0) {
            detailsList = `<ul class="text-secondary list-disc pl-6">${items.join('')}</ul>`;
        }
    }

    // Populate Detail View
    const detailContainer = document.getElementById('tender-detail-content');
    detailContainer.innerHTML = `
        <div class="flex justify-between items-start mb-6">
            <div>
                <span class="badge badge-blue mb-2">${escapeHtml(tender.status)}</span>
                <h1 class="text-display">${escapeHtml(tender.title)}</h1>
                <div class="text-h3 text-secondary mt-2">${escapeHtml(tender.authority)}</div>
            </div>
            <div class="text-center">
                <div class="text-display text-accent">${parseInt(tender.match, 10)}%</div>
                <div class="text-sm text-muted">Übereinstimmung</div>
            </div>
        </div>

        <div class="detail-stats mb-8">
            <div class="card">
                <div class="text-sm text-muted">Auftragswert</div>
                <div class="text-h3">${escapeHtml(tender.price)}</div>
            </div>
            <div class="card">
                <div class="text-sm text-muted">Eingabefrist</div>
                <div class="text-h3">${escapeHtml(tender.deadlineDate)}</div>
            </div>
            <div class="card">
                <div class="text-sm text-muted">Region</div>
                <div class="text-h3">${escapeHtml(tender.region)}</div>
            </div>
        </div>

        <div class="mb-8">
            <h3 class="text-h2 mb-4">Beschreibung</h3>
            <p class="text-secondary mb-4">
                ${escapeHtml(tender.description) || 'Keine Beschreibung verfügbar.'}
            </p>
            ${detailsList}
        </div>

        <div class="flex gap-4">
            <button class="btn btn-lg btn-primary">Jetzt Bewerben</button>
            <button class="btn btn-lg btn-secondary">Ausschreibung ansehen (SIMAP)</button>
        </div>
    `;
    navigateTo(VIEWS.TENDER_DETAIL);
}

// Make functions global for inline onclick handlers
window.selectCompany = selectCompany;
window.viewTender = viewTender;
window.setSearch = setSearch;
window.selectProfile = selectProfile;

function renderProfiles() {
    const profileContainerEl = document.getElementById('profile-list');
    if (!profileContainerEl) return;

    profileContainerEl.innerHTML = MOCK_USER_PROFILES.map(p => {
        // Ensure ID is numeric to prevent injection
        const profileId = parseInt(p.id, 10);
        // Safely get avatar initials
        const avatarText = escapeHtml(String(p.company || '').substring(0, 2).toUpperCase());

        return `
        <div class="card card-interactive">
            <div class="flex justify-between items-center">
                <div class="flex items-center gap-4 flex-1 cursor-pointer" onclick="selectProfile(${profileId})">
                    <div class="avatar">${avatarText}</div>
                    <div>
                        <div class="text-h3">${escapeHtml(p.company)}</div>
                        <div class="text-sm text-secondary">${escapeHtml(p.role)}</div>
                    </div>
                </div>
                <div class="flex items-center gap-2">
                    <button class="btn btn-ghost btn-sm text-error" onclick="event.stopPropagation(); deleteProfile(${profileId})" title="Profil löschen">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M3 6h18"/>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        </svg>
                    </button>
                    <svg class="text-accent cursor-pointer" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" onclick="selectProfile(${profileId})"><polyline points="9 18 15 12 9 6"/></svg>
                </div>
            </div>
        </div>
    `}).join('');
}

function deleteProfile(id) {
    const profile = MOCK_USER_PROFILES.find(p => p.id === id);
    if (profile && confirm('Möchten Sie das Profil "' + escapeHtml(profile.company) + '" wirklich löschen?')) {
        const index = MOCK_USER_PROFILES.findIndex(p => p.id === id);
        if (index > -1) {
            MOCK_USER_PROFILES.splice(index, 1);
            renderProfiles();
        }
    }
}
window.deleteProfile = deleteProfile;

function selectProfile(id) {
    const profile = MOCK_USER_PROFILES.find(p => p.id === id);
    if (profile) {
        // Mock State Update
        state.company = { name: profile.company };
        // Assuming profile is already set up, go to dashboard
        navigateTo(VIEWS.DASHBOARD);
    }
}

// Editing Logic
window.openEditModal = openEditModal;
// Filter Logic
function applyFilters() {
    const statusOpen = document.getElementById('filter-status-open')?.checked ?? true;
    const statusClosing = document.getElementById('filter-status-closing')?.checked ?? true;
    const region = document.getElementById('filter-region')?.value ?? 'all';
    const matchesOnly = document.getElementById('filter-matches-only')?.checked ?? false;

    // Filter Logic
    const filteredTenders = MOCK_TENDERS.filter(t => {
        // Status
        let statusMatch = false;
        if (t.status === 'Offen' && statusOpen) statusMatch = true;
        if (t.status === 'Bald fällig' && statusClosing) statusMatch = true;
        if (!statusOpen && !statusClosing) statusMatch = true;

        // Region
        let regionMatch = (region === 'all') || (t.region.includes(region));

        // Match Score
        let scoreMatch = true;
        if (matchesOnly) {
            scoreMatch = t.match >= 80;
        }

        return statusMatch && regionMatch && scoreMatch;
    });

    renderTenderFeed(filteredTenders);
    toggleModal('filter', false);
}

// Make globally available
window.applyFilters = applyFilters;

window.saveEdit = saveEdit;

function openEditModal(field) {
    currentEditField = field;
    const rec = state.recommendations;
    // Ensure titles exist
    const titleEl = document.getElementById('modal-edit-title');
    const contentEl = document.getElementById('modal-edit-content');

    if (!titleEl || !contentEl) return;

    // Title
    const fieldLabels = {
        industry: 'Branche',
        size: 'Unternehmensgrösse',
        region: 'Region',
        keywords: 'Keywords',
        cpv: 'CPV Codes',
        npk: 'NPK Codes'
    };
    titleEl.textContent = `${fieldLabels[field] || field} bearbeiten`;

    let html = '';

    if (field === 'industry') {
        html = `
            <div class="form-group">
                <label class="form-label">Branche wählen</label>
                <select id="edit-input" class="input">
                    <option value="Baugewerbe / Hochbau" ${rec.industry.includes('Hochbau') ? 'selected' : ''}>Baugewerbe / Hochbau</option>
                    <option value="Baugewerbe / Tiefbau" ${rec.industry.includes('Tiefbau') ? 'selected' : ''}>Baugewerbe / Tiefbau</option>
                    <option value="IT-Dienstleistungen" ${rec.industry.includes('IT') ? 'selected' : ''}>IT-Dienstleistungen</option>
                    <option value="Gartenbau" ${rec.industry.includes('Garten') ? 'selected' : ''}>Gartenbau</option>
                    <option value="Sicherheitsdienste" ${rec.industry.includes('Sicherheit') ? 'selected' : ''}>Sicherheitsdienste</option>
                </select>
            </div>
        `;
    } else if (field === 'size') {
        html = `
            <div class="form-group">
                 <label class="form-label">Unternehmensgrösse</label>
                 <select id="edit-input" class="input">
                    <option value="1-9 Mitarbeitende" ${rec.size.includes('1-9') ? 'selected' : ''}>1-9 Mitarbeitende</option>
                    <option value="10-49 Mitarbeitende" ${rec.size.includes('10-49') ? 'selected' : ''}>10-49 Mitarbeitende</option>
                    <option value="50-249 Mitarbeitende" ${rec.size.includes('50') ? 'selected' : ''}>50-249 Mitarbeitende</option>
                    <option value="250+ Mitarbeitende" ${rec.size.includes('250') ? 'selected' : ''}>250+ Mitarbeitende</option>
                </select>
            </div>
        `;
    } else if (field === 'region') {
        html = `
            <div class="form-group">
                <label class="form-label">Regionen (Kommagetrennt)</label>
                <input type="text" id="edit-input" class="input" value="${rec.region}">
            </div>
        `;
    } else if (field === 'keywords') {
        html = `
            <div class="form-group">
                <label class="form-label">Such-Keywords (Kommagetrennt)</label>
                <textarea id="edit-input-pos" class="input input-sm mb-2">${rec.keywords.join(', ')}</textarea>
                <label class="form-label">Ausschluss-Keywords (Kommagetrennt)</label>
                <textarea id="edit-input-neg" class="input input-sm">${rec.excludeKeywords.join(', ')}</textarea>
            </div>
        `;
    } else if (field === 'cpv' || field === 'npk') {
        let value = '';
        if (field === 'cpv') value = rec.cpv.map(c => c.code).join(', ');
        else value = rec.npk.join(', ');

        html = `
            <div class="form-group">
                <label class="form-label">${field.toUpperCase()} Codes (Kommagetrennt)</label>
                <textarea id="edit-input" class="input input-md">${value}</textarea>
                <div class="text-sm text-secondary mt-1">Nur Codes eingeben.</div>
            </div>
        `;
    }

    contentEl.innerHTML = html;
    toggleModal('edit', true);
}

function saveEdit() {
    const rec = state.recommendations;
    const input = document.getElementById('edit-input');

    if (currentEditField === 'industry') {
        if (input) rec.industry = input.value;
        const el = document.getElementById('ai-industry');
        if (el) el.textContent = rec.industry;

    } else if (currentEditField === 'size') {
        if (input) rec.size = input.value;
        const el = document.getElementById('ai-size');
        if (el) el.textContent = rec.size;

    } else if (currentEditField === 'region') {
        if (input) rec.region = input.value;
        const el = document.getElementById('ai-region');
        if (el) el.textContent = rec.region;

    } else if (currentEditField === 'keywords') {
        const posInput = document.getElementById('edit-input-pos');
        const negInput = document.getElementById('edit-input-neg');

        const pos = posInput ? posInput.value.split(',').map(s => s.trim()).filter(s => s) : [];
        const neg = negInput ? negInput.value.split(',').map(s => s.trim()).filter(s => s) : [];

        rec.keywords = pos;
        rec.excludeKeywords = neg;

        // Re-render keywords with escaping
        const keywordsContainer = document.getElementById('ai-keywords');
        if (keywordsContainer) {
            const positiveHtml = rec.keywords.map(k =>
                `<span class="badge badge-green mr-1 mb-1">+ ${escapeHtml(k)}</span>`
            ).join('');
            const negativeHtml = rec.excludeKeywords.map(k =>
                `<span class="badge badge-red mr-1 mb-1">- ${escapeHtml(k)}</span>`
            ).join('');
            keywordsContainer.innerHTML = positiveHtml + negativeHtml;
        }

    } else if (currentEditField === 'cpv') {
        if (input) {
            const codes = input.value.split(',').map(s => s.trim()).filter(s => s);
            rec.cpv = codes.map(c => ({ code: c, label: "Manuell" }));

            const cpvContainer = document.getElementById('ai-cpv-codes');
            if (cpvContainer) {
                cpvContainer.innerHTML = rec.cpv.map(c => `
                    <div class="flex items-center gap-2">
                        <svg class="text-accent" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        <span>${escapeHtml(c.code)} - ${escapeHtml(c.label)}</span>
                    </div>
                `).join('');
            }
        }

    } else if (currentEditField === 'npk') {
        if (input) {
            const codes = input.value.split(',').map(s => s.trim()).filter(s => s);
            rec.npk = codes;

            const npkContainer = document.getElementById('ai-npk-codes');
            if (npkContainer) {
                npkContainer.innerHTML = rec.npk.map(code =>
                    `<div class="flex items-center gap-2"><svg class="text-accent" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> <span>${escapeHtml(code)}</span></div>`
                ).join('');
            }
        }
    }

    toggleModal('edit', false);
}

// Settings Tab Navigation
function showSettingsTab(tabId) {
    // Hide all panels
    document.querySelectorAll('.settings-panel').forEach(panel => {
        panel.classList.remove('is-active');
    });

    // Remove active from all nav items
    document.querySelectorAll('.settings-nav-item').forEach(item => {
        item.classList.remove('is-active');
    });

    // Show selected panel
    const panel = document.getElementById(`settings-${tabId}`);
    if (panel) {
        panel.classList.add('is-active');
    }

    // Mark the clicked nav item as active
    const navItems = document.querySelectorAll('.settings-nav-item');
    navItems.forEach(item => {
        if (item.textContent.trim().toLowerCase().includes(tabId.substring(0, 4))) {
            item.classList.add('is-active');
        }
    });

    // Better approach: find by onclick attribute
    const clickedItem = document.querySelector(`.settings-nav-item[onclick*="${tabId}"]`);
    if (clickedItem) {
        document.querySelectorAll('.settings-nav-item').forEach(item => {
            item.classList.remove('is-active');
        });
        clickedItem.classList.add('is-active');
    }
}

// Make globally available
window.showSettingsTab = showSettingsTab;

// Language Dropdown Functions
function toggleLangDropdown() {
    const dropdownEl = document.querySelector('.lang-dropdown');
    if (dropdownEl) {
        dropdownEl.classList.toggle('is-open');
    }
}

function selectLang(lang) {
    // Update the current language display
    const currentLang = document.querySelector('.lang-current');
    if (currentLang) {
        currentLang.textContent = lang;
    }

    // Update active state in dropdown
    document.querySelectorAll('.lang-option').forEach(option => {
        option.classList.remove('is-active');
        if (option.textContent.includes(getLangName(lang))) {
            option.classList.add('is-active');
        }
    });

    // Close dropdown
    const dropdownEl = document.querySelector('.lang-dropdown');
    if (dropdownEl) {
        dropdownEl.classList.remove('is-open');
    }
}

function getLangName(code) {
    const names = {
        'DE': 'Deutsch',
        'FR': 'Français',
        'IT': 'Italiano',
        'EN': 'English'
    };
    return names[code] || code;
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    const dropdownEl = document.querySelector('.lang-dropdown');
    if (dropdownEl && !dropdownEl.contains(e.target)) {
        dropdownEl.classList.remove('is-open');
    }
});

// Make globally available
window.toggleLangDropdown = toggleLangDropdown;
window.selectLang = selectLang;

// Toggle between login and register forms
function toggleAuthForm(form) {
    const loginForm = document.getElementById('auth-login');
    const registerForm = document.getElementById('auth-register');

    if (form === 'register') {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    } else {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    }
}
window.toggleAuthForm = toggleAuthForm;

// Theme Toggle (Dark Mode)
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateMobileThemeSelection();
}

// Set specific theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateMobileThemeSelection();
}
window.setTheme = setTheme;

// Update mobile menu theme selection visual state
function updateMobileThemeSelection() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    document.querySelectorAll('.mobile-menu-pref-option[data-theme]').forEach(option => {
        if (option.dataset.theme === currentTheme) {
            option.classList.add('is-active');
        } else {
            option.classList.remove('is-active');
        }
    });
}
window.updateMobileThemeSelection = updateMobileThemeSelection;

// Update mobile menu language selection visual state
function updateMobileLangSelection(lang) {
    document.querySelectorAll('.mobile-menu-pref-option[data-lang]').forEach(option => {
        if (option.dataset.lang === lang) {
            option.classList.add('is-active');
        } else {
            option.classList.remove('is-active');
        }
    });
}
window.updateMobileLangSelection = updateMobileLangSelection;

// Initialize theme from localStorage or system preference
function initTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

// Run theme init immediately (before DOMContentLoaded to prevent flash)
initTheme();

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
}

window.toggleTheme = toggleTheme;

// Mobile Menu Toggle
function toggleMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const backdrop = document.querySelector('.mobile-menu-backdrop');
    const menu = document.querySelector('.mobile-menu');

    if (!toggleBtn || !backdrop || !menu) return;

    const isActive = menu.classList.contains('is-active');

    if (isActive) {
        // Close menu
        toggleBtn.classList.remove('is-active');
        backdrop.classList.remove('is-active');
        menu.classList.remove('is-active');
        document.body.style.overflow = '';
        toggleBtn.setAttribute('aria-label', 'Menü öffnen');
    } else {
        // Open menu
        toggleBtn.classList.add('is-active');
        backdrop.classList.add('is-active');
        menu.classList.add('is-active');
        document.body.style.overflow = 'hidden';
        toggleBtn.setAttribute('aria-label', 'Menü schließen');
    }
}
window.toggleMobileMenu = toggleMobileMenu;

// Sync mobile menu with auth state
function syncMobileMenuAuth(isAuthenticated) {
    const mobileNavPublic = document.getElementById('mobile-nav-public');
    const mobileNavAuth = document.getElementById('mobile-nav-auth');
    const mobileNavLogout = document.getElementById('mobile-nav-logout');
    const mobileMenuProfile = document.getElementById('mobile-menu-profile');

    if (mobileNavPublic && mobileNavAuth) {
        if (isAuthenticated) {
            mobileNavPublic.classList.add('hidden');
            mobileNavAuth.classList.remove('hidden');
            if (mobileNavLogout) mobileNavLogout.classList.remove('hidden');
            if (mobileMenuProfile) mobileMenuProfile.classList.remove('hidden');
        } else {
            mobileNavPublic.classList.remove('hidden');
            mobileNavAuth.classList.add('hidden');
            if (mobileNavLogout) mobileNavLogout.classList.add('hidden');
            if (mobileMenuProfile) mobileMenuProfile.classList.add('hidden');
        }
    }
}
window.syncMobileMenuAuth = syncMobileMenuAuth;
