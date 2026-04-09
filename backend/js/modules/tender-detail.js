// ============================================
// TENDER DETAIL MODULE
// ============================================

import { VIEWS } from './constants.js';
import { state, MOCK_TENDERS } from './state.js';
import { navigateTo } from './navigation.js';
import { escapeHtml } from './utils.js';

/**
 * View tender details
 * @param {number} id - Tender ID
 */
export function viewTender(id) {
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
            <span class="breadcrumb-item is-clickable" onclick="navigateTo('${VIEWS.DASHBOARD}')">${escapeHtml(state.company?.name || 'Dashboard')}</span>
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
    if (detailContainer) {
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
    }

    navigateTo(VIEWS.TENDER_DETAIL);
}

// Make function globally available for inline onclick handlers
window.viewTender = viewTender;
