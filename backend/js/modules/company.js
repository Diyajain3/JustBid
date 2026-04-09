// ============================================
// COMPANY MODULE
// ============================================

import { VIEWS } from './constants.js';
import { state, MOCK_COMPANIES, AI_RECOMMENDATIONS, getRecommendationForCompany } from './state.js';
import { navigateTo } from './navigation.js';
import { escapeHtml, escapeAttr } from './utils.js';

/**
 * Set search input value and trigger search
 * @param {string} term - Search term to set
 */
export function setSearch(term) {
    const input = document.getElementById('company-search-input');
    if (input) {
        input.value = term;
        // Trigger input event manually
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }
}

/**
 * Render search results in container
 * @param {Array} companies - Array of company objects
 * @param {HTMLElement} container - Container element for results
 */
export function renderSearchResults(companies, container) {
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
    `).join('<div class="gap-2" style="height: 8px"></div>');
}

/**
 * Select a company and navigate to AI review
 * @param {string} name - Company name
 */
export function selectCompany(name) {
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
    }, 800);

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
        hydrateAIReviewView(name, rec);

        // Visual Transition - Hide Overlay, Show Content
        if (overlayEl) overlayEl.classList.add('hidden');
        if (contentEl) contentEl.classList.remove('hidden');

    }, 4000);
}

/**
 * Hydrate the AI Review view with recommendation data
 * @param {string} companyName - Company name
 * @param {Object} rec - Recommendation object
 */
export function hydrateAIReviewView(companyName, rec) {
    const nameEl = document.getElementById('ai-company-name');
    if (nameEl) nameEl.textContent = companyName;

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

    // Regions (multiple) - with null checks
    const regionsContainer = document.getElementById('ai-regions');
    if (regionsContainer) {
        if (rec.regions) {
            regionsContainer.innerHTML = rec.regions.map(r =>
                `<span class="badge badge-blue mr-1 mb-1">${escapeHtml(r)}</span>`
            ).join('');
        } else if (rec.region) {
            regionsContainer.innerHTML = `<span class="badge badge-blue mr-1 mb-1">${escapeHtml(rec.region)}</span>`;
        }
    }
}

/**
 * Submit manual company entry with validation
 */
export function submitManualEntry() {
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

/**
 * Setup company search input listener
 */
export function setupCompanySearchListener() {
    const searchInput = document.getElementById('company-search-input');
    const searchResults = document.getElementById('company-search-results');

    if (searchInput && searchResults) {
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
}

// Make functions globally available for inline onclick handlers
window.selectCompany = selectCompany;
window.setSearch = setSearch;
window.submitManualEntry = submitManualEntry;
