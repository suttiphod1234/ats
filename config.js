/**
 * Configuration File for LogiSkill
 * 
 * ⚠️ SECURITY NOTE:
 * In production, these values should be stored in environment variables
 * or loaded from a secure server-side endpoint.
 */

const CONFIG = {
    // Google Sheets Configuration
    sheets: {
        // General registration form (Air Freight, CFO, etc.)
        general: {
            id: '1Eq-cQO4Z2VYMfkGMhHrlfXve2bJces7YyUM7gbNNL0g',
            scriptUrl: 'https://script.google.com/macros/s/AKfycbyMwlyu1CpiFtPgExaxlcp_rYDLFdJskmsYzeuRlM4ic9_2wMr3-FE48mwnuEfoiw_c/exec',
            sheetName: 'ซีต1'
        },
        // AI FOR LOGISTICS registration form
        aiLogistics: {
            id: '1Eq-cQO4Z2VYMfkGMhHrlfXve2bJces7YyUM7gbNNL0g',
            scriptUrl: 'https://script.google.com/macros/s/AKfycbw9ZVhL_qgNJ8zAfwI6cei9g640aP0xtNtj2dIykA7i65XsJsKEh1mNLIWpdG2GRhbI/exec',
            sheetName: 'ai logistics'
        },
        // Learner Survey Form
        survey: {
            id: '1Eq-cQO4Z2VYMfkGMhHrlfXve2bJces7YyUM7gbNNL0g',
            scriptUrl: 'https://script.google.com/macros/s/AKfycbw9ZVhL_qgNJ8zAfwI6cei9g640aP0xtNtj2dIykA7i65XsJsKEh1mNLIWpdG2GRhbI/exec',
            sheetName: 'survey'
        }
    },

    // Application Settings
    app: {
        name: 'LogiSkill',
        version: '1.0.0',
        timeout: 30000 // 30 seconds
    },

    // Validation Rules
    validation: {
        phone: {
            minLength: 10,
            maxLength: 10,
            pattern: /^[0-9]{10}$/
        },
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        age: {
            min: 18,
            max: 65
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}


