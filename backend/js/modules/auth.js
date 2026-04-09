// ============================================
// AUTHENTICATION MODULE
// ============================================

import { VIEWS } from './constants.js';
import { state } from './state.js';
import { navigateTo } from './navigation.js';
import { isValidEmail, validatePassword, showFieldError, hideFieldError } from './utils.js';

/**
 * Handles SSO login button clicks (placeholder for future implementation)
 * @param {string} provider - The SSO provider ('google', 'whatsapp', etc.)
 */
export function handleSSOLogin(provider) {
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
 * @param {Function} onSuccess - Callback on successful login
 * @returns {boolean} - False to prevent default form submission
 */
export function handleLogin(event, onSuccess) {
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
        // Set user state
        state.user = { email };

        // Call success callback or default navigation
        if (onSuccess) {
            onSuccess();
        } else {
            // Default: redirect to app.html for profile selection
            window.location.href = 'app.html?view=profile-selection';
        }
    }

    return false;
}

/**
 * Handles registration form submission with validation
 * @param {Event} event - The form submit event
 * @param {Function} onSuccess - Callback on successful registration
 * @returns {boolean} - False to prevent default form submission
 */
export function handleRegister(event, onSuccess) {
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
        // Set user state
        state.user = { email };

        // Call success callback or default navigation
        if (onSuccess) {
            onSuccess();
        } else {
            // Default: redirect to app.html for company search (new user flow)
            window.location.href = 'app.html?view=company-search';
        }
    }

    return false;
}

/**
 * Toggle between login and register forms
 * @param {string} form - 'login' or 'register'
 */
export function toggleAuthForm(form) {
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

/**
 * Logout user and redirect to landing
 * @param {string} redirectUrl - URL to redirect to after logout
 */
export function logout(redirectUrl = 'index.html') {
    state.user = null;
    state.company = null;
    state.selectedTender = null;
    state.recommendations = null;

    // Redirect to landing page
    window.location.href = redirectUrl;
}

// Make functions globally available for inline onclick handlers
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleSSOLogin = handleSSOLogin;
window.toggleAuthForm = toggleAuthForm;
window.logout = logout;
