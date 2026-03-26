/**
 * Admin Data Aggregation Logic
 */

function getAdminSummary() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheets = ss.getSheets();
  
  let totalRegistrations = 0;
  let totalSurveys = 0;
  let trackStats = {};
  let ageStats = {};
  let recentActivities = [];

  // System sheet names to exclude from registration count
  const systemSheets = ['courses', 'course-survey', 'config'];

  sheets.forEach(sheet => {
    const name = sheet.getName();
    const data = sheet.getDataRange().getValues();
    if (data.length <= 1) return; // Empty or only headers

    // 1. Survey Data Processing
    if (name === SURVEY_SHEET_NAME) {
      totalSurveys = data.length - 1;
      
      const headers = data[0];
      const catIdx = headers.indexOf('Category');
      const ageIdx = headers.indexOf('Age Range');
      const nameIdx = headers.indexOf('Full Name');
      const timeIdx = headers.indexOf('Timestamp');

      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        
        // Track stats
        if (catIdx !== -1) {
          const cat = row[catIdx];
          trackStats[cat] = (trackStats[cat] || 0) + 1;
        }
        
        // Age stats
        if (ageIdx !== -1) {
          const age = row[ageIdx];
          ageStats[age] = (ageStats[age] || 0) + 1;
        }

        // Add to recent activities (limited to 10 latest)
        recentActivities.push({
          type: 'SURVEY',
          name: row[nameIdx] || 'Anonymous',
          detail: row[catIdx] || 'New Interest',
          time: row[timeIdx]
        });
      }
    } 
    // 2. Registration Data Processing (Exclude system sheets)
    else if (!systemSheets.includes(name)) {
      totalRegistrations += (data.length - 1);
      
      const headers = data[0];
      const nameIdx = headers.indexOf('Full Name');
      const timeIdx = headers.indexOf('Timestamp');
      const courseIdx = headers.indexOf('Course'); // Standard registration
      
      for (let i = 1; i < data.length; i++) {
        recentActivities.push({
          type: 'REGISTRATION',
          name: data[i][nameIdx] || 'Anonymous',
          detail: name === 'ai-logistics-v3' ? 'AI FOR Logistics' : (data[i][courseIdx] || name),
          time: data[i][timeIdx]
        });
      }
    }
  });

  // Sort and limit recent activities
  recentActivities.sort((a, b) => new Date(b.time) - new Date(a.time));
  recentActivities = recentActivities.slice(0, 5);

  return {
    success: true,
    totalRegistrations: totalRegistrations,
    totalSurveys: totalSurveys,
    trackStats: trackStats,
    ageStats: ageStats,
    recentActivities: recentActivities
  };
}
