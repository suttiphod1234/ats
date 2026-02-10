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
            id: '1i_Ve9Rg3dbyoxbbhwV_qjAStw58F-dpkiC95SVgEv9I',
            scriptUrl: 'https://script.google.com/macros/s/AKfycbzQNRa4fYum5_Y6UBipUIomOtD5vSDrtVc-1c6hcB8fKyr3-NJE224OU9fJMOitJ4S5/exec',
            sheetName: 'ซีต1'
        },
        // AI FOR LOGISTICS registration form
        aiLogistics: {
            id: '1i_Ve9Rg3dbyoxbbhwV_qjAStw58F-dpkiC95SVgEv9I',
            scriptUrl: 'https://script.google.com/macros/s/AKfycbzQNRa4fYum5_Y6UBipUIomOtD5vSDrtVc-1c6hcB8fKyr3-NJE224OU9fJMOitJ4S5/exec',
            sheetName: 'ai logistics'
        },
        // AI Fundamentals registration form (New)
        aiFundamental: {
            id: '1i_Ve9Rg3dbyoxbbhwV_qjAStw58F-dpkiC95SVgEv9I',
            scriptUrl: 'https://script.google.com/macros/s/AKfycbzQNRa4fYum5_Y6UBipUIomOtD5vSDrtVc-1c6hcB8fKyr3-NJE224OU9fJMOitJ4S5/exec',
            sheetName: 'ai fundamental'
        },
        // Learner Survey Form
        survey: {
            id: '1i_Ve9Rg3dbyoxbbhwV_qjAStw58F-dpkiC95SVgEv9I',
            scriptUrl: 'https://script.google.com/macros/s/AKfycbzQNRa4fYum5_Y6UBipUIomOtD5vSDrtVc-1c6hcB8fKyr3-NJE224OU9fJMOitJ4S5/exec',
            sheetName: 'survey'
        },
        // Airfreight registration form
        airfreight: {
            id: '1i_Ve9Rg3dbyoxbbhwV_qjAStw58F-dpkiC95SVgEv9I',
            scriptUrl: 'https://script.google.com/macros/s/AKfycbzQNRa4fYum5_Y6UBipUIomOtD5vSDrtVc-1c6hcB8fKyr3-NJE224OU9fJMOitJ4S5/exec',
            sheetName: 'Airfreight'
        },
        // CFO registration form
        cfo: {
            id: '1i_Ve9Rg3dbyoxbbhwV_qjAStw58F-dpkiC95SVgEv9I',
            scriptUrl: 'https://script.google.com/macros/s/AKfycbzQNRa4fYum5_Y6UBipUIomOtD5vSDrtVc-1c6hcB8fKyr3-NJE224OU9fJMOitJ4S5/exec',
            sheetName: 'อบรม CFO'
        },
        // Carbon Footprint course
        "carbon-footprint": {
            tabName: "อบรม CFO", // This seems to be a placeholder or a different type of config
            courseName: "Carbon Footprint for Organization"
        },
        // Online Courses booking
        "online-courses": {
            id: '1i_Ve9Rg3dbyoxbbhwV_qjAStw58F-dpkiC95SVgEv9I',
            scriptUrl: 'https://script.google.com/macros/s/AKfycbzQNRa4fYum5_Y6UBipUIomOtD5vSDrtVc-1c6hcB8fKyr3-NJE224OU9fJMOitJ4S5/exec',
            sheetName: 'Online Booking'
        },
        // Power BI Course
        powerBi: {
            id: '1i_Ve9Rg3dbyoxbbhwV_qjAStw58F-dpkiC95SVgEv9I',
            scriptUrl: 'https://script.google.com/macros/s/AKfycbxZ5_Q5v78VJyFNdHqCkziUViT9reSZp0058iAPFBCcjNbgb4S-b04qNR5FU5nXik7e/exec',
            sheetName: 'Power BI'
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


