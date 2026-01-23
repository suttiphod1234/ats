/**
 * AI FOR LOGISTICS Registration Form Handler
 * Google Apps Script for handling form submissions
 * 
 * Sheet ID: 1ViBY3Nj0NhnPtP_oYLzGePHadkRvJRh0HLud93wR4XY
 * 
 * Deploy as Web App:
 * 1. Click Deploy → New deployment
 * 2. Select type: Web app
 * 3. Execute as: Me
 * 4. Who has access: Anyone
 * 5. Copy deployment URL to ai-logistics-form.js
 */

function doPost(e) {
  try {
    // Open the Google Sheet - "ซีต1"
    const sheet = SpreadsheetApp.openById('1ViBY3Nj0NhnPtP_oYLzGePHadkRvJRh0HLud93wR4XY').getSheetByName('ซีต1');
    
    // Parse incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get next queue number
    const lastRow = sheet.getLastRow();
    const queueNumber = lastRow > 1 ? lastRow : 1;
    
    // Handle multiple sessions
    const sessions = Array.isArray(data.sessions) ? data.sessions.join(', ') : data.sessions;
    const sessionDates = Array.isArray(data.sessionDates) ? data.sessionDates.join(', ') : data.sessionDates;
    
    // Handle education with "other"
    const education = data.education + (data.educationOther ? ' (' + data.educationOther + ')' : '');
    
    // Append data to sheet
    sheet.appendRow([
      data.timestamp || new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }),
      queueNumber,
      data.fullName || '',
      data.email || '',
      data.phone || '',
      data.lineId || '',
      data.occupation || '',
      data.age || '',
      education,
      data.position || '',
      data.company || '',
      data.province || '',
      data.district || '',
      data.course || 'AI FOR LOGISTICS',
      sessions,
      sessionDates
    ]);
    
    // Return success
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      queueNumber: queueNumber,
      message: 'ลงทะเบียนสำเร็จ'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'เกิดข้อผิดพลาด: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for checking duplicate emails)
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    const sheet = SpreadsheetApp.openById('1ViBY3Nj0NhnPtP_oYLzGePHadkRvJRh0HLud93wR4XY').getSheetByName('ซีต1');
    
    if (action === 'checkEmail') {
      const email = e.parameter.email;
      
      if (!email) {
        return ContentService.createTextOutput(JSON.stringify({
          exists: false,
          error: 'No email provided'
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      const data = sheet.getDataRange().getValues();
      const emailExists = data.some((row, index) => {
        return index > 0 && row[3] && row[3].toLowerCase() === email.toLowerCase();
      });
      
      return ContentService.createTextOutput(JSON.stringify({
        exists: emailExists
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Invalid action'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error in doGet: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function
 */
function testSheetAccess() {
  try {
    const sheet = SpreadsheetApp.openById('1ViBY3Nj0NhnPtP_oYLzGePHadkRvJRh0HLud93wR4XY').getSheetByName('ซีต1');
    Logger.log('Sheet name: ' + sheet.getName());
    Logger.log('Last row: ' + sheet.getLastRow());
    Logger.log('Sheet access successful!');
  } catch (error) {
    Logger.log('Error: ' + error.toString());
  }
}

/**
 * Setup sheet headers
 */
function setupSheetHeaders() {
  try {
    const sheet = SpreadsheetApp.openById('1ViBY3Nj0NhnPtP_oYLzGePHadkRvJRh0HLud93wR4XY').getSheetByName('ซีต1');
    
    if (sheet.getLastRow() > 0) {
      Logger.log('Headers already exist');
      return;
    }
    
    const headers = [
      'Timestamp',
      'Queue Number',
      'ชื่อ-นามสกุล',
      'อีเมล',
      'มือถือ',
      'Line ID',
      'อาชีพ',
      'อายุ',
      'ระดับการศึกษา',
      'ตำแหน่งงาน',
      'บริษัท',
      'จังหวัด',
      'อำเภอ/เขต',
      'หลักสูตร',
      'รุ่น',
      'วันที่อบรม'
    ];
    
    sheet.appendRow(headers);
    
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#1e40af');
    headerRange.setFontColor('#ffffff');
    
    Logger.log('Headers setup complete!');
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
  }
}
