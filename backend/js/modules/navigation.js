// ============================================
// NAVIGATION MODULE
// ============================================

import { state, views } from './state.js';

/**
 * Navigate to a specific view
 * @param {string} viewId - The view ID to navigate to
 */
export function navigateTo(viewId) {
    // Hide all views
    Object.values(views).forEach(el => {
        if (el) el.classList.remove('active');
    });

    // Show target view
    if (views[viewId]) {
        views[viewId].classList.add('active');
        state.view = viewId;
        window.scrollTo(0, 0);

        // Update URL and Header
        updateUrl(viewId);
        updateHeader();
    }
}

/**
 * Update the browser URL with current view
 * @param {string} viewId - The view ID to set in URL
 */
export function updateUrl(viewId) {
    const url = new URL(window.location);
    url.searchParams.set('view', viewId);
    window.history.pushState({ view: viewId }, '', url);
}

/**
 * Update header navigation based on auth state
 */
export function updateHeader() {
    const authNav = document.getElementById('nav-links-auth');
    const publicNav = document.getElementById('nav-links-public');
    const authCta = document.getElementById('nav-cta-auth');
    const publicCta = document.getElementById('nav-cta-public');

    // Views that imply authenticated state
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
    syncMobileMenuAuth(isAuth);
}

/**
 * Handle URL parameters on page load
 */
export function handleUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    if (view && views[view]) {
        navigateTo(view);
    }
}

/**
 * Sync mobile menu with authentication state
 * @param {boolean} isAuthenticated - Whether user is authenticated
 */
export function syncMobileMenuAuth(isAuthenticated) {
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

/**
 * Setup navigation event listeners
 */
export function setupNavigationListeners() {
    // Navigation via data-goto attributes
    document.querySelectorAll('[data-goto]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const target = el.dataset.goto;
            navigateTo(target);
        });
    });

    // Handle browser back/forward
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.view) {
            navigateTo(e.state.view);
        }
    });
}

// Make navigateTo globally available for inline onclick handlers
window.navigateTo = navigateTo;
