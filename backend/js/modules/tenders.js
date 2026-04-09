// ============================================
// TENDERS MODULE
// ============================================

import { FILTERS, TENDER_STATUS } from './constants.js';
import { state, MOCK_TENDERS } from './state.js';
import { escapeHtml } from './utils.js';
import { toggleModal } from './ui.js';

/**
 * Render the tender feed
 * @param {Array} tenders - Array of tender objects (defaults to MOCK_TENDERS)
 */
export function renderTenderFeed(tenders = MOCK_TENDERS) {
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

        // Status indicators
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

/**
 * Filter tenders by type
 * @param {string} filter - Filter type from FILTERS constant
 */
export function filterTenders(filter) {
    state.currentFilter = filter;

    // Update active tab styling
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
            filtered = MOCK_TENDERS.filter(t => !t.hidden);
            break;
    }

    // Apply current sort
    const sorted = getSortedTenders(filtered);
    renderTenderFeed(sorted);
}

/**
 * Update filter count badges
 */
export function updateFilterCounts() {
    const countAll = document.getElementById('count-all');
    const countOpen = document.getElementById('count-open');
    const countClosing = document.getElementById('count-closing');
    const countBookmarked = document.getElementById('count-bookmarked');
    const countApplied = document.getElementById('count-applied');
    const countHidden = document.getElementById('count-hidden');

    if (countAll) countAll.textContent = MOCK_TENDERS.filter(t => !t.hidden).length;
    if (countOpen) countOpen.textContent = MOCK_TENDERS.filter(t => t.status === TENDER_STATUS.OPEN && !t.hidden).length;
    if (countClosing) countClosing.textContent = MOCK_TENDERS.filter(t => t.status === TENDER_STATUS.CLOSING_SOON && !t.hidden).length;
    if (countBookmarked) countBookmarked.textContent = MOCK_TENDERS.filter(t => t.bookmarked === true && !t.hidden).length;
    if (countApplied) countApplied.textContent = MOCK_TENDERS.filter(t => t.applied === true).length;
    if (countHidden) countHidden.textContent = MOCK_TENDERS.filter(t => t.hidden === true).length;
}

/**
 * Toggle bookmark status for a tender
 * @param {number} id - Tender ID
 * @param {Event} event - Click event
 */
export function toggleBookmark(id, event) {
    event.stopPropagation();
    const tender = MOCK_TENDERS.find(t => t.id === id);
    if (tender) {
        tender.bookmarked = !tender.bookmarked;
        filterTenders(state.currentFilter);
    }
}

/**
 * Toggle applied status for a tender
 * @param {number} id - Tender ID
 * @param {Event} event - Click event
 */
export function toggleApplied(id, event) {
    event.stopPropagation();
    const tender = MOCK_TENDERS.find(t => t.id === id);
    if (tender) {
        tender.applied = !tender.applied;
        filterTenders(state.currentFilter);
    }
}

/**
 * Toggle hidden status for a tender
 * @param {number} id - Tender ID
 * @param {Event} event - Click event
 */
export function toggleHidden(id, event) {
    event.stopPropagation();
    const tender = MOCK_TENDERS.find(t => t.id === id);
    if (tender) {
        tender.hidden = !tender.hidden;
        filterTenders(state.currentFilter);
    }
}

/**
 * Toggle sort dropdown visibility
 */
export function toggleSortDropdown() {
    const dropdownEl = document.querySelector('.sort-dropdown');
    if (dropdownEl) {
        dropdownEl.classList.toggle('is-open');
    }
}

/**
 * Sort tenders by specified criteria
 * @param {string} sortBy - Sort criteria
 */
export function sortTenders(sortBy) {
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

/**
 * Get sorted tenders array
 * @param {Array} tenders - Array of tenders to sort
 * @returns {Array} - Sorted tenders
 */
export function getSortedTenders(tenders) {
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
            const getPrice = (p) => {
                const match = p.price.match(/[\d.]+/);
                return match ? parseFloat(match[0]) : 0;
            };
            sorted.sort((a, b) => getPrice(b) - getPrice(a));
            break;
    }

    return sorted;
}

/**
 * Apply filters from filter modal
 */
export function applyFilters() {
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

// Make functions globally available for inline onclick handlers
window.filterTenders = filterTenders;
window.toggleBookmark = toggleBookmark;
window.toggleApplied = toggleApplied;
window.toggleHidden = toggleHidden;
window.toggleSortDropdown = toggleSortDropdown;
window.sortTenders = sortTenders;
window.applyFilters = applyFilters;
