/**
 * LogiSkill Registration Form Handler
 * Google Apps Script for handling form submissions to Google Sheets
 * 
 * Sheet ID: 1Eq-cQO4Z2VYMfkGMhHrlfXve2bJces7YyUM7gbNNL0g
 * 
 * Deploy this as a Web App:
 * 1. Click Deploy → New deployment
 * 2. Select type: Web app
 * 3. Execute as: Me
 * 4. Who has access: Anyone
 * 5. Copy the deployment URL to register.js
 */

function doPost(e) {
  try {
    // Open the Google Sheet - specifically "ซีต1"
    const sheet = SpreadsheetApp.openById('1Eq-cQO4Z2VYMfkGMhHrlfXve2bJces7YyUM7gbNNL0g').getSheetByName('ซีต1');
    
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get next queue number (based on last row)
    const lastRow = sheet.getLastRow();
    const queueNumber = lastRow > 1 ? lastRow : 1;
    
    // Handle multiple courses (if array, join with comma)
    const courses = Array.isArray(data.courses) ? data.courses.join(', ') : (data.course || '');
    const sessions = Array.isArray(data.sessions) ? data.sessions.join(', ') : (data.session || '');
    
    // Handle education with "other" field
    const education = data.education + (data.educationOther ? ' (' + data.educationOther + ')' : '');
    
    // Append new row to sheet with all form data
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
      courses,
      sessions
    ]);
    
    // Return success response with queue number
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      queueNumber: queueNumber,
      message: 'ลงทะเบียนสำเร็จ'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error response
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
    const sheet = SpreadsheetApp.openById('1Eq-cQO4Z2VYMfkGMhHrlfXve2bJces7YyUM7gbNNL0g').getSheetByName('ซีต1');
    
    if (action === 'checkEmail') {
      const email = e.parameter.email;
      
      if (!email) {
        return ContentService.createTextOutput(JSON.stringify({
          exists: false,
          error: 'No email provided'
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      // Get all data from sheet
      const data = sheet.getDataRange().getValues();
      
      // Check if email exists (column D, index 3)
      // Skip header row (index 0)
      const emailExists = data.some((row, index) => {
        return index > 0 && row[3] && row[3].toLowerCase() === email.toLowerCase();
      });
      
      return ContentService.createTextOutput(JSON.stringify({
        exists: emailExists
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Default response for unknown actions
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
 * Test function to verify sheet access
 * Run this from Apps Script editor to test
 */
function testSheetAccess() {
  try {
    const sheet = SpreadsheetApp.openById('1Eq-cQO4Z2VYMfkGMhHrlfXve2bJces7YyUM7gbNNL0g').getSheetByName('ซีต1');
    Logger.log('Sheet name: ' + sheet.getName());
    Logger.log('Last row: ' + sheet.getLastRow());
    Logger.log('Sheet access successful!');
  } catch (error) {
    Logger.log('Error accessing sheet: ' + error.toString());
  }
}

/**
 * Initialize sheet with headers (run once)
 */
function setupSheetHeaders() {
  try {
    const sheet = SpreadsheetApp.openById('1Eq-cQO4Z2VYMfkGMhHrlfXve2bJces7YyUM7gbNNL0g').getSheetByName('ซีต1');
    
    // Check if headers already exist
    if (sheet.getLastRow() > 0) {
      Logger.log('Headers already exist. Skipping setup.');
      return;
    }
    
    // Add headers
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
      'รุ่น'
    ];
    
    sheet.appendRow(headers);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4a5568');
    headerRange.setFontColor('#ffffff');
    
    Logger.log('Headers setup complete!');
    
  } catch (error) {
    Logger.log('Error setting up headers: ' + error.toString());
  }
}
