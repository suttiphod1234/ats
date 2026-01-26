/**
 * LogiSkill Unified Master Script
 * Handles:
 * 1. AI Logistics Registration (Sheet: 'ai logistics')
 * 2. Learner Survey (Sheet: 'survey')
 * 3. General Registration (Sheet: 'ซีต1')
 * 
 * INSTRUCTIONS:
 * 1. Use this single script file.
 * 2. Delete any other .gs files (like Code.gs) to avoid conflicts.
 * 3. Deploy as Web App -> Access: Everyone -> Update config.js with the ONE resulting URL.
 */

const SPREADSHEET_ID = '1Eq-cQO4Z2VYMfkGMhHrlfXve2bJces7YyUM7gbNNL0g';

function doPost(e) {
  try {
    // Check if event object and postData exist (avoids error when run manually from editor)
    if (!e || !e.postData || !e.postData.contents) {
      Logger.log('Error: doPost called without valid event data.');
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        message: 'No data received. (หมายเหตุ: หากคุณกด Run จาก Editor จะขึ้นข้อความนี้เป็นปกติ กรุณาทดสอบผ่านหน้าเว็บครับ)'
      })).setMimeType(ContentService.MimeType.JSON);
    }

    // Parse incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Determine target sheet (Default to 'ซีต1' if not specified)
    const targetSheetName = data.sheetName || 'ซีต1';
    
    // Open the Google Sheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(targetSheetName);
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = ss.insertSheet(targetSheetName);
      // Setup headers based on sheet type
      if (targetSheetName === 'survey') {
        setupSurveyHeaders(sheet);
      } else if (targetSheetName === 'ai logistics') {
        setupAiLogisticsHeaders(sheet);
      } else {
        setupGeneralHeaders(sheet);
      }
    }
    
    // Get next queue number
    const lastRow = sheet.getLastRow();
    const queueNumber = lastRow > 1 ? lastRow : 1;
    
    // --- HANDLE DATA INSERTION BASED ON SHEET TYPE ---
    
    // 1. SURVEY FORM
    if (targetSheetName === 'survey') {
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
    }
    
    // 2. AI LOGISTICS REGISTRATION
    else if (targetSheetName === 'ai logistics') {
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
    
    // 3. GENERAL / LEGACY REGISTRATION (Fallback)
    else {
      const courses = Array.isArray(data.courses) ? data.courses.join(', ') : (data.course || '');
      const sessions = Array.isArray(data.sessions) ? data.sessions.join(', ') : (data.session || '');
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
        courses,
        sessions
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
  const headers = ['Timestamp', 'สื่อที่ได้รับ', 'สายอาชีพที่สนใจ', 'รูปแบบการอบรม', 'วันเวลาที่สะดวก', 'ข้อเสนอแนะ'];
  appendHeaders(sheet, headers, '#10b981');
}

function setupAiLogisticsHeaders(sheet) {
  const headers = ['Timestamp', 'Queue Number', 'ชื่อ-นามสกุล', 'อีเมล', 'มือถือ', 'Line ID', 'อาชีพ', 'อายุ', 'ระดับการศึกษา', 'ตำแหน่งงาน', 'บริษัท', 'จังหวัด', 'อำเภอ/เขต', 'หลักสูตร', 'รุ่น', 'วันที่อบรม'];
  appendHeaders(sheet, headers, '#1e40af');
}

function setupGeneralHeaders(sheet) {
  const headers = ['Timestamp', 'Queue Number', 'ชื่อ-นามสกุล', 'อีเมล', 'มือถือ', 'Line ID', 'อาชีพ', 'อายุ', 'ระดับการศึกษา', 'ตำแหน่งงาน', 'บริษัท', 'จังหวัด', 'อำเภอ/เขต', 'หลักสูตร', 'รุ่น'];
  appendHeaders(sheet, headers, '#4a5568');
}

function appendHeaders(sheet, headers, color) {
  sheet.appendRow(headers);
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setFontWeight('bold');
  headerRange.setBackground(color);
  headerRange.setFontColor('#ffffff');
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    // Default to 'ai logistics' sheet for duplicate checking if not specified, or check all?
    // For now, let's keep checking 'ai logistics' as it's the main use case
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName('ai logistics'); 
    
    if (action === 'checkEmail' && sheet) {
      const email = e.parameter.email;
      if (!email) return jsonResponse({ exists: false, error: 'No email' });
      
      const data = sheet.getDataRange().getValues();
      const emailExists = data.some((row, index) => index > 0 && row[3] && row[3].toString().toLowerCase() === email.toLowerCase());
      
      return jsonResponse({ exists: emailExists });
    }
    
    return jsonResponse({ error: 'Invalid action or sheet not found' });
    
  } catch (error) {
    return jsonResponse({ error: error.toString() });
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
