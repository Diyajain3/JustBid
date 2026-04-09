// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Escapes HTML special characters to prevent XSS attacks
 * @param {string} str - The string to escape
 * @returns {string} - The escaped string
 */
export function escapeHtml(str) {
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
export function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates password strength
 * @param {string} password - The password to validate
 * @returns {{valid: boolean, message: string}} - Validation result
 */
export function validatePassword(password) {
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
export function escapeAttr(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

/**
 * Shows an error message for a form field
 * @param {string} elementId - The ID of the error span element
 * @param {string} message - The error message to display
 */
export function showFieldError(elementId, message) {
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
export function hideFieldError(elementId) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = '';
        el.classList.add('hidden');
    }
}
