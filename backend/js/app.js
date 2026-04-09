// ============================================
// APP ENTRY POINT
// ============================================
// This is the entry point for app.html (authenticated app)
// It loads all modules needed for the authenticated experience

import { VIEWS } from './modules/constants.js';
import { state, views, cacheViews, loadTestData } from './modules/state.js';
import { navigateTo, handleUrlParams, setupNavigationListeners, updateHeader } from './modules/navigation.js';
import { logout } from './modules/auth.js';
import {
    initTheme,
    setupThemeListener,
    toggleTheme,
    setTheme,
    toggleLangDropdown,
    selectLang,
    updateMobileLangSelection,
    updateMobileThemeSelection,
    toggleMobileMenu,
    toggleModal,
    setupDropdownListeners
} from './modules/ui.js';
import { setSearch, selectCompany, submitManualEntry, setupCompanySearchListener } from './modules/company.js';
import { renderTenderFeed, filterTenders, toggleBookmark, toggleApplied, toggleHidden, toggleSortDropdown, sortTenders, applyFilters } from './modules/tenders.js';
import { renderProfiles, selectProfile, deleteProfile } from './modules/profiles.js';
import { viewTender } from './modules/tender-detail.js';
import { showSettingsTab, openProfileSettings, openEditModal, saveEdit } from './modules/settings.js';

// ============================================
// INITIALIZATION
// ============================================

// Initialize theme immediately (before DOMContentLoaded to prevent flash)
initTheme();

document.addEventListener('DOMContentLoaded', async () => {
    // Load test data first
    await loadTestData();

    // Cache view elements
    cacheViews([
        'profile-selection',
        'company-search',
        'manual-entry',
        'ai-review',
        'dashboard',
        'tender-detail',
        'settings'
    ]);

    // Setup navigation
    setupNavigationListeners();

    // Setup theme listener for system preference changes
    setupThemeListener();

    // Setup dropdown close listeners
    setupDropdownListeners();

    // Setup company search listener
    setupCompanySearchListener();

    // Render initial data
    renderProfiles();
    renderTenderFeed();

    // Initialize URL state
    handleUrlParams();

    // If no view specified, default to profile selection
    if (!state.view || state.view === 'landing') {
        navigateTo(VIEWS.PROFILE_SELECTION);
    }

    // Update mobile menu theme selection
    updateMobileThemeSelection();

    console.log('App initialized');
});

// ============================================
// APP-SPECIFIC OVERRIDES
// ============================================

// Override logout to redirect to landing page
window.logout = function() {
    logout('index.html');
};
