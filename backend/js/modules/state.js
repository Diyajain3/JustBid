// ============================================
// APPLICATION STATE
// ============================================

// Test Data - Loaded from JSON
export let MOCK_COMPANIES = [];
export let AI_RECOMMENDATIONS = {};
export let MOCK_TENDERS = [];
export let MOCK_USER_PROFILES = [];
export let TEST_DATA = null;

// Current field being edited in modal
export let currentEditField = null;

export function setCurrentEditField(field) {
    currentEditField = field;
}

// Application State
export const state = {
    view: 'landing',
    company: null,
    user: null,
    selectedTender: null,
    currentFilter: 'all',
    currentSort: 'match',
    recommendations: null
};

// DOM Element Cache
export const views = {};
export const nav = {};

/**
 * Load test data from JSON file
 * @param {string} basePath - Base path to data directory (default: '' for same directory)
 * @returns {Promise<boolean>} - Whether loading succeeded
 */
export async function loadTestData(basePath = '') {
    try {
        const dataPath = basePath ? `${basePath}/data/test_data.json` : 'data/test_data.json';
        const response = await fetch(dataPath);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        TEST_DATA = await response.json();

        // Map companies to expected format
        MOCK_COMPANIES = TEST_DATA.companies.map(c => ({
            name: c.name,
            uid: c.uid,
            city: c.city,
            type: c.type,
            id: c.id,
            searchKey: c.searchKey
        }));

        // Map AI recommendations - create lookup by searchKey for backwards compatibility
        AI_RECOMMENDATIONS = {};
        for (const [companyId, rec] of Object.entries(TEST_DATA.aiRecommendations)) {
            const company = TEST_DATA.companies.find(c => c.id === companyId);
            if (company) {
                // Format NPK codes as strings for display
                const formattedRec = {
                    ...rec,
                    npk: rec.npk.map(n => `${n.code} - ${n.name}`)
                };
                AI_RECOMMENDATIONS[company.searchKey] = formattedRec;
            }
        }

        // Map tenders
        MOCK_TENDERS = TEST_DATA.tenders.map(t => ({
            id: t.id,
            title: t.title,
            authority: t.authority,
            price: t.price,
            deadline: t.deadline,
            deadlineDate: t.deadlineDate,
            status: t.status,
            match: t.match,
            region: t.region,
            cpv: t.cpv,
            description: t.description,
            details: t.details,
            bookmarked: t.bookmarked,
            applied: t.applied,
            hidden: t.hidden
        }));

        // Map user profiles
        MOCK_USER_PROFILES = TEST_DATA.userProfiles.map(p => ({
            id: p.id,
            name: p.name,
            role: p.role,
            company: p.company
        }));

        console.log('Test data loaded:', MOCK_COMPANIES.length, 'companies,', MOCK_TENDERS.length, 'tenders');
        return true;
    } catch (error) {
        console.error('Failed to load test data:', error);
        console.error('Note: If using file:// protocol, run a local server instead: npx serve');
        return false;
    }
}

/**
 * Looks up AI recommendations for a company by name
 * @param {string} companyName - The company name to look up
 * @returns {Object|null} - The recommendation object or null if not found
 */
export function getRecommendationForCompany(companyName) {
    if (!companyName) {
        console.warn('getRecommendationForCompany: No company name provided');
        return null;
    }

    // Find the company in MOCK_COMPANIES by name
    const company = MOCK_COMPANIES.find(c => c.name === companyName);

    if (company && company.searchKey && AI_RECOMMENDATIONS[company.searchKey]) {
        return AI_RECOMMENDATIONS[company.searchKey];
    }

    // Fallback: return first available recommendation
    const keys = Object.keys(AI_RECOMMENDATIONS);
    if (keys.length > 0) {
        console.warn('getRecommendationForCompany: Using fallback for company:', companyName);
        return AI_RECOMMENDATIONS[keys[0]];
    }

    console.error('getRecommendationForCompany: No recommendations available');
    return null;
}

/**
 * Cache view elements in the views object
 * @param {string[]} viewIds - Array of view IDs to cache
 */
export function cacheViews(viewIds) {
    viewIds.forEach(id => {
        views[id] = document.getElementById(`view-${id}`);
    });
}
