// ============================================
// LANDING PAGE ENTRY POINT
// ============================================
// This is the entry point for index.html (landing page)
// It only loads modules needed for the public-facing pages:
// - Landing, Auth, Legal views

import { VIEWS } from './modules/constants.js';
import { state, views, cacheViews } from './modules/state.js';
import { navigateTo, handleUrlParams, setupNavigationListeners, updateHeader } from './modules/navigation.js';
import { handleLogin, handleRegister, handleSSOLogin, toggleAuthForm, logout } from './modules/auth.js';
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
    setupDropdownListeners
} from './modules/ui.js';

// ============================================
// INITIALIZATION
// ============================================

// Initialize theme immediately (before DOMContentLoaded to prevent flash)
initTheme();

document.addEventListener('DOMContentLoaded', () => {
    // Cache view elements
    cacheViews(['landing', 'auth', 'legal']);

    // Setup navigation
    setupNavigationListeners();

    // Setup theme listener for system preference changes
    setupThemeListener();

    // Setup dropdown close listeners
    setupDropdownListeners();

    // Initialize URL state
    handleUrlParams();

    // Update mobile menu theme selection
    updateMobileThemeSelection();

    console.log('Landing page initialized');
});

// ============================================
// LANDING-SPECIFIC OVERRIDES
// ============================================

// Override handleLogin to redirect to app.html
window.handleLogin = function(event) {
    return handleLogin(event, () => {
        window.location.href = 'app.html?view=profile-selection';
    });
};

// Override handleRegister to redirect to app.html
window.handleRegister = function(event) {
    return handleRegister(event, () => {
        window.location.href = 'app.html?view=company-search';
    });
};

// Override logout to stay on landing
window.logout = function() {
    logout('index.html');
};
