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
            scriptUrl: 'https://script.google.com/macros/s/AKfycbzBSQxPLeEbepAUKgt-A_uyDIM9GuN25c9womiw06wlqRXEGsWUe6ZTZHLqnagAToFW/exec',
            sheetName: 'ซีต1'
        },
        // AI FOR LOGISTICS registration form
        aiLogistics: {
            id: '1Eq-cQO4Z2VYMfkGMhHrlfXve2bJces7YyUM7gbNNL0g',
            scriptUrl: 'https://script.google.com/macros/s/AKfycbzBSQxPLeEbepAUKgt-A_uyDIM9GuN25c9womiw06wlqRXEGsWUe6ZTZHLqnagAToFW/exec',
            sheetName: 'ai logistics'
        },
        // Learner Survey Form
        survey: {
            id: '1Eq-cQO4Z2VYMfkGMhHrlfXve2bJces7YyUM7gbNNL0g',
            scriptUrl: 'https://script.google.com/macros/s/AKfycbzBSQxPLeEbepAUKgt-A_uyDIM9GuN25c9womiw06wlqRXEGsWUe6ZTZHLqnagAToFW/exec',
            sheetName: 'survey'
        },
        // Airfreight registration form
        airfreight: {
            id: '1Eq-cQO4Z2VYMfkGMhHrlfXve2bJces7YyUM7gbNNL0g',
            scriptUrl: 'https://script.google.com/macros/s/AKfycbzBSQxPLeEbepAUKgt-A_uyDIM9GuN25c9womiw06wlqRXEGsWUe6ZTZHLqnagAToFW/exec',
            sheetName: 'Airfreight'
        },
        // CFO registration form
        cfo: {
            id: '1Eq-cQO4Z2VYMfkGMhHrlfXve2bJces7YyUM7gbNNL0g',
            scriptUrl: 'https://script.google.com/macros/s/AKfycbzBSQxPLeEbepAUKgt-A_uyDIM9GuN25c9womiw06wlqRXEGsWUe6ZTZHLqnagAToFW/exec',
            sheetName: 'อบรม CFO'
        },
        // Carbon Footprint course
        "carbon-footprint": {
            tabName: "อบรม CFO", // This seems to be a placeholder or a different type of config
            courseName: "Carbon Footprint for Organization"
        },
        // Online Courses booking
        "online-courses": {
            id: '1Eq-cQO4Z2VYMfkGMhHrlfXve2bJces7YyUM7gbNNL0g',
            scriptUrl: 'https://script.google.com/macros/s/AKfycbzBSQxPLeEbepAUKgt-A_uyDIM9GuN25c9womiw06wlqRXEGsWUe6ZTZHLqnagAToFW/exec',
            sheetName: 'Online Booking'
        }
    },

    // Application Settings
    app: {
        name: 'LogiSkill',
        version: '1.0.0',
        timeout: 30000, // 30 seconds
        lineOa: 'https://lin.ee/ws5lf1M'
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


