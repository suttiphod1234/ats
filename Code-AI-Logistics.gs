/**
 * AI FOR LOGISTICS Registration Form Handler
 * Google Apps Script for handling form submissions
 * 
 * Sheet ID: 1Eq-cQO4Z2VYMfkGMhHrlfXve2bJces7YyUM7gbNNL0g
 * Target Sheet Name: ai logistics
 * 
 * Deploy as Web App:
 * 1. Click Deploy → New deployment
 * 2. Select type: Web app
 * 3. Execute as: Me
 * 4. Who has access: Anyone
 * 5. Copy deployment URL to ai-logistics-form.js
 */

const SPREADSHEET_ID = '1Eq-cQO4Z2VYMfkGMhHrlfXve2bJces7YyUM7gbNNL0g';
const SHEET_NAME = 'ai logistics';

function doPost(e) {
  try {
    // Parse incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Determine target sheet
    const targetSheetName = data.sheetName || SHEET_NAME;
    
    // Open the Google Sheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(targetSheetName);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(targetSheetName);
      if (targetSheetName === 'survey') {
        setupSurveyHeaders(sheet);
      } else {
        setupHeaders(sheet);
      }
    }
    
    // Get next queue number (row count)
    const lastRow = sheet.getLastRow();
    const queueNumber = lastRow > 1 ? lastRow : 1;
    
    // Handle Data Insertion
    if (targetSheetName === 'survey') {
      // Handle Survey Data
      const timestamp = new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' });
      const media = Array.isArray(data.media) ? data.media.join(', ') : data.media;
      const career = data.career + (data.careerOther ? ' (' + data.careerOther + ')' : '');
      const format = data.format + (data.formatOther ? ' (' + data.formatOther + ')' : '');
      const convenientTime = data.convenientTime || '';
      const suggestions = data.suggestions || '';

      sheet.appendRow([
        timestamp,
        media,
        career,
        format,
        convenientTime,
        suggestions
      ]);
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'ส่งแบบสอบถามสำเร็จ'
      })).setMimeType(ContentService.MimeType.JSON);

    } else {
      // Handle Registration Data (Existing Logic)
      const sessions = Array.isArray(data.sessions) ? data.sessions.join(', ') : data.sessions;
      const sessionDates = Array.isArray(data.sessionDates) ? data.sessionDates.join(', ') : data.sessionDates;
      const education = data.education + (data.educationOther ? ' (' + data.educationOther + ')' : '');
      
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
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        queueNumber: queueNumber,
        message: 'ลงทะเบียนสำเร็จ'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    Logger.log('Error in doPost: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'เกิดข้อผิดพลาด: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function setupSurveyHeaders(sheet) {
  const headers = [
    'Timestamp',
    'สื่อที่ได้รับ',
    'สายอาชีพที่สนใจ',
    'รูปแบบการอบรม',
    'วันเวลาที่สะดวก',
    'ข้อเสนอแนะ'
  ];
  sheet.appendRow(headers);
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground('#10b981'); // Emerald green for survey
  headerRange.setFontColor('#ffffff');
}

/**
 * Handle GET requests (for checking duplicate emails)
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Create sheet if it doesn't exist (though unlikely for doGet to trigger creation safely without headers)
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        error: 'Sheet not found'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
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
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      Logger.log('Sheet "' + SHEET_NAME + '" not found. Creating it...');
      sheet = ss.insertSheet(SHEET_NAME);
      setupHeaders(sheet);
      Logger.log('Sheet created.');
    }
    
    Logger.log('Sheet name: ' + sheet.getName());
    Logger.log('Last row: ' + sheet.getLastRow());
    Logger.log('Sheet access successful!');
  } catch (error) {
    Logger.log('Error: ' + error.toString());
  }
}

/**
 * Setup sheet headers helper
 */
function setupHeaders(sheet) {
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
}

/**
 * Setup sheet headers manually
 */
function setupSheetHeaders() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }
    
    if (sheet.getLastRow() > 0) {
      Logger.log('Headers already exist');
      return;
    }
    
    setupHeaders(sheet);
    
    Logger.log('Headers setup complete!');
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
  }
}
