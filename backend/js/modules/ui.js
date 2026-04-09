// ============================================
// UI MODULE - Theme, Language, Mobile Menu, Modals
// ============================================

// ============================================
// THEME
// ============================================

/**
 * Toggle between light and dark theme
 */
export function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateMobileThemeSelection();
}

/**
 * Set specific theme
 * @param {string} theme - 'light' or 'dark'
 */
export function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateMobileThemeSelection();
}

/**
 * Initialize theme from localStorage or system preference
 */
export function initTheme() {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
}

/**
 * Setup system theme change listener
 */
export function setupThemeListener() {
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        });
    }
}

/**
 * Update mobile menu theme selection visual state
 */
export function updateMobileThemeSelection() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    document.querySelectorAll('.mobile-menu-pref-option[data-theme]').forEach(option => {
        if (option.dataset.theme === currentTheme) {
            option.classList.add('is-active');
        } else {
            option.classList.remove('is-active');
        }
    });
}

// ============================================
// LANGUAGE
// ============================================

/**
 * Toggle language dropdown visibility
 */
export function toggleLangDropdown() {
    const dropdownEl = document.querySelector('.lang-dropdown');
    if (dropdownEl) {
        dropdownEl.classList.toggle('is-open');
    }
}

/**
 * Select a language
 * @param {string} lang - Language code (DE, FR, IT, EN)
 */
export function selectLang(lang) {
    // Update the current language display
    const currentLang = document.querySelector('.lang-current');
    if (currentLang) {
        currentLang.textContent = lang;
    }

    // Update active state in dropdown
    document.querySelectorAll('.lang-option').forEach(option => {
        option.classList.remove('is-active');
        if (option.textContent.includes(getLangName(lang))) {
            option.classList.add('is-active');
        }
    });

    // Close dropdown
    const dropdownEl = document.querySelector('.lang-dropdown');
    if (dropdownEl) {
        dropdownEl.classList.remove('is-open');
    }
}

/**
 * Get full language name from code
 * @param {string} code - Language code
 * @returns {string} - Full language name
 */
export function getLangName(code) {
    const names = {
        'DE': 'Deutsch',
        'FR': 'Français',
        'IT': 'Italiano',
        'EN': 'English'
    };
    return names[code] || code;
}

/**
 * Update mobile menu language selection visual state
 * @param {string} lang - Selected language code
 */
export function updateMobileLangSelection(lang) {
    document.querySelectorAll('.mobile-menu-pref-option[data-lang]').forEach(option => {
        if (option.dataset.lang === lang) {
            option.classList.add('is-active');
        } else {
            option.classList.remove('is-active');
        }
    });
}

// ============================================
// MOBILE MENU
// ============================================

/**
 * Toggle mobile menu open/closed
 */
export function toggleMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-menu-toggle');
    const backdrop = document.querySelector('.mobile-menu-backdrop');
    const menu = document.querySelector('.mobile-menu');

    if (!toggleBtn || !backdrop || !menu) return;

    const isActive = menu.classList.contains('is-active');

    if (isActive) {
        // Close menu
        toggleBtn.classList.remove('is-active');
        backdrop.classList.remove('is-active');
        menu.classList.remove('is-active');
        document.body.style.overflow = '';
        toggleBtn.setAttribute('aria-label', 'Menü öffnen');
    } else {
        // Open menu
        toggleBtn.classList.add('is-active');
        backdrop.classList.add('is-active');
        menu.classList.add('is-active');
        document.body.style.overflow = 'hidden';
        toggleBtn.setAttribute('aria-label', 'Menü schließen');
    }
}

// ============================================
// MODALS
// ============================================

/**
 * Toggle modal visibility
 * @param {string} modalName - Name of the modal (without 'modal-' prefix)
 * @param {boolean} show - Whether to show or hide
 */
export function toggleModal(modalName, show) {
    const modal = document.getElementById(`modal-${modalName}`);
    if (modal) {
        if (show) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// ============================================
// DROPDOWN CLOSE ON OUTSIDE CLICK
// ============================================

/**
 * Setup click-outside listeners for dropdowns
 */
export function setupDropdownListeners() {
    document.addEventListener('click', (e) => {
        // Close language dropdown
        const langDropdownEl = document.querySelector('.lang-dropdown');
        if (langDropdownEl && !langDropdownEl.contains(e.target)) {
            langDropdownEl.classList.remove('is-open');
        }

        // Close sort dropdown
        const sortDropdownEl = document.querySelector('.sort-dropdown');
        if (sortDropdownEl && !sortDropdownEl.contains(e.target)) {
            sortDropdownEl.classList.remove('is-open');
        }
    });
}

// ============================================
// GLOBAL EXPORTS FOR INLINE HANDLERS
// ============================================

window.toggleTheme = toggleTheme;
window.setTheme = setTheme;
window.toggleLangDropdown = toggleLangDropdown;
window.selectLang = selectLang;
window.updateMobileLangSelection = updateMobileLangSelection;
window.updateMobileThemeSelection = updateMobileThemeSelection;
window.toggleMobileMenu = toggleMobileMenu;
window.toggleModal = toggleModal;
