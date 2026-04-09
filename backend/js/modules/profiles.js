// ============================================
// PROFILES MODULE
// ============================================

import { VIEWS } from './constants.js';
import { state, MOCK_USER_PROFILES, getRecommendationForCompany } from './state.js';
import { navigateTo } from './navigation.js';
import { escapeHtml } from './utils.js';

/**
 * Render user profiles list
 */
export function renderProfiles() {
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

/**
 * Delete a user profile
 * @param {number} id - Profile ID
 */
export function deleteProfile(id) {
    const profile = MOCK_USER_PROFILES.find(p => p.id === id);
    if (profile && confirm(`Möchten Sie das Profil "${profile.company}" wirklich löschen?`)) {
        const index = MOCK_USER_PROFILES.findIndex(p => p.id === id);
        if (index > -1) {
            MOCK_USER_PROFILES.splice(index, 1);
            renderProfiles();
        }
    }
}

/**
 * Select a profile and navigate to dashboard
 * @param {number} id - Profile ID
 */
export function selectProfile(id) {
    const profile = MOCK_USER_PROFILES.find(p => p.id === id);
    if (profile) {
        // Update state with selected profile
        state.company = { name: profile.company };

        // Load recommendations for this company
        const baseRec = getRecommendationForCompany(profile.company);
        state.recommendations = baseRec ? JSON.parse(JSON.stringify(baseRec)) : null;

        // Navigate to dashboard
        navigateTo(VIEWS.DASHBOARD);
    }
}

// Make functions globally available for inline onclick handlers
window.selectProfile = selectProfile;
window.deleteProfile = deleteProfile;
