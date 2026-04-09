// ============================================
// SETTINGS MODULE
// ============================================

import { VIEWS } from './constants.js';
import { state, currentEditField, setCurrentEditField, getRecommendationForCompany } from './state.js';
import { navigateTo } from './navigation.js';
import { escapeHtml } from './utils.js';
import { toggleModal } from './ui.js';
import { hydrateAIReviewView } from './company.js';

/**
 * Show a settings tab
 * @param {string} tabId - Tab ID (billing, profile, notifications, team, security)
 */
export function showSettingsTab(tabId) {
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
    const clickedItem = document.querySelector(`.settings-nav-item[onclick*="${tabId}"]`);
    if (clickedItem) {
        document.querySelectorAll('.settings-nav-item').forEach(item => {
            item.classList.remove('is-active');
        });
        clickedItem.classList.add('is-active');
    }
}

/**
 * Open profile settings (AI review wizard)
 */
export function openProfileSettings() {
    // Ensure we have recommendations data for the current profile
    if (!state.recommendations && state.company) {
        const baseRec = getRecommendationForCompany(state.company.name);
        state.recommendations = baseRec ? JSON.parse(JSON.stringify(baseRec)) : null;
    }

    const rec = state.recommendations;

    // Company name
    const nameEl = document.getElementById('ai-company-name');
    if (nameEl) nameEl.textContent = state.company?.name || 'Unbekannt';

    if (rec) {
        hydrateAIReviewView(state.company?.name || 'Unbekannt', rec);
    } else {
        console.warn('openProfileSettings: No recommendations available for', state.company?.name);
    }

    // Show content directly (skip loading animation)
    const overlayEl = document.getElementById('ai-loading-overlay');
    const contentEl = document.getElementById('ai-results-content');
    if (overlayEl) overlayEl.classList.add('hidden');
    if (contentEl) contentEl.classList.remove('hidden');

    // Navigate to AI review view
    navigateTo(VIEWS.AI_REVIEW);
}

/**
 * Open edit modal for a field
 * @param {string} field - Field name to edit
 */
export function openEditModal(field) {
    setCurrentEditField(field);

    // Ensure recommendations are loaded
    if (!state.recommendations && state.company) {
        const baseRec = getRecommendationForCompany(state.company.name);
        state.recommendations = baseRec ? JSON.parse(JSON.stringify(baseRec)) : null;
    }

    const rec = state.recommendations;

    const titleEl = document.getElementById('modal-edit-title');
    const contentEl = document.getElementById('modal-edit-content');

    if (!titleEl || !contentEl || !rec) {
        console.warn('openEditModal: Cannot open modal - missing elements or recommendations');
        return;
    }

    // Title labels
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
                <input type="text" id="edit-input" class="input" value="${escapeHtml(rec.region || '')}">
            </div>
        `;
    } else if (field === 'keywords') {
        html = `
            <div class="form-group">
                <label class="form-label">Such-Keywords (Kommagetrennt)</label>
                <textarea id="edit-input-pos" class="input input-sm mb-2">${(rec.keywords || []).join(', ')}</textarea>
                <label class="form-label">Ausschluss-Keywords (Kommagetrennt)</label>
                <textarea id="edit-input-neg" class="input input-sm">${(rec.excludeKeywords || []).join(', ')}</textarea>
            </div>
        `;
    } else if (field === 'cpv' || field === 'npk') {
        let value = '';
        if (field === 'cpv') value = (rec.cpv || []).map(c => c.code).join(', ');
        else value = (rec.npk || []).join(', ');

        html = `
            <div class="form-group">
                <label class="form-label">${field.toUpperCase()} Codes (Kommagetrennt)</label>
                <textarea id="edit-input" class="input input-md">${escapeHtml(value)}</textarea>
                <div class="text-sm text-secondary mt-1">Nur Codes eingeben.</div>
            </div>
        `;
    }

    contentEl.innerHTML = html;
    toggleModal('edit', true);
}

/**
 * Save edit from modal
 */
export function saveEdit() {
    const rec = state.recommendations;
    const input = document.getElementById('edit-input');
    const field = currentEditField;

    if (!rec) return;

    if (field === 'industry') {
        if (input) rec.industry = input.value;
        const el = document.getElementById('ai-industry');
        if (el) el.textContent = rec.industry;

    } else if (field === 'size') {
        if (input) rec.size = input.value;
        const el = document.getElementById('ai-size');
        if (el) el.textContent = rec.size;

    } else if (field === 'region') {
        if (input) rec.region = input.value;
        const el = document.getElementById('ai-region');
        if (el) el.textContent = rec.region;

    } else if (field === 'keywords') {
        const posInput = document.getElementById('edit-input-pos');
        const negInput = document.getElementById('edit-input-neg');

        const pos = posInput ? posInput.value.split(',').map(s => s.trim()).filter(s => s) : [];
        const neg = negInput ? negInput.value.split(',').map(s => s.trim()).filter(s => s) : [];

        rec.keywords = pos;
        rec.excludeKeywords = neg;

        // Re-render keywords
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

    } else if (field === 'cpv') {
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

    } else if (field === 'npk') {
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

// Make functions globally available for inline onclick handlers
window.showSettingsTab = showSettingsTab;
window.openProfileSettings = openProfileSettings;
window.openEditModal = openEditModal;
window.saveEdit = saveEdit;
