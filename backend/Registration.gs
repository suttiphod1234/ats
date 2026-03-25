/**
 * Registration Processing Logic
 */

function processRegistration(data) {
  const targetSheetName = data.sheetName || 'ซีต1';
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(targetSheetName);

  if (!sheet) {
    sheet = ss.insertSheet(targetSheetName);
    setupHeaders(sheet, targetSheetName);
  }

  const timestamp = new Date();
  const id = generateUniqueId();

  // Determine Row Data based on sheet type
  let rowData = [];
  if (targetSheetName === 'ai-logistics-v3') {
     rowData = [
      timestamp, id, data.fullName, data.email, "'" + data.phone,
      data.age || "", data.education || "", data.position || "", 
      data.score || 0, data.maxScore || 10, "NO"
     ];
  } else {
     rowData = [
      timestamp, id, data.fullName, data.email, "'" + data.phone,
      data.course || "", data.position || "", data.company || "", 
      data.industry || "", data.province || "", data.source || "", 
      data.expectations || "", data.referralText || "", "NO"
     ];
  }

  sheet.appendRow(rowData);

  // --- Invite Customer to Google Calendar ---
  inviteCustomerToCalendar(data.course, data.email);
  
  // --- Send Verification Email ---
  sendVerificationEmail(data, id);

  return { 
    success: true, 
    id: id,
    message: 'ลงทะเบียนสำเร็จ! กรุณาตรวจสอบอีเมลเพื่อกดลิงก์ยืนยัน'
  };
}

/**
 * ค้นหา Event ID ของหลักสูตรและเชิญลูกค้าเข้า Event
 */
function inviteCustomerToCalendar(courseTitle, customerEmail) {
  if (!courseTitle || !customerEmail) return;
  
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const courseSheet = ss.getSheetByName('courses');
    if (!courseSheet) return;
    
    const courses = courseSheet.getDataRange().getValues();
    const headers = courses[0];
    const eventIdIdx = headers.indexOf('CalendarEventID');
    const titleIdx = headers.indexOf('Title');
    
    if (eventIdIdx === -1) return;
    
    // Find matching course
    for (let i = 1; i < courses.length; i++) {
       // Check if Title matches (fuzzy match or exact)
       if (courses[i][titleIdx] === courseTitle || courseTitle.includes(courses[i][titleIdx])) {
         const eventId = courses[i][eventIdIdx];
         if (eventId) {
           const calendar = CalendarApp.getCalendarById(ADMIN_CALENDAR_ID) || CalendarApp.getDefaultCalendar();
           const event = calendar.getEventById(eventId);
           if (event) {
             event.addGuest(customerEmail);
             Logger.log(`Invited ${customerEmail} to event ${eventId}`);
           }
         }
         break;
       }
    }
  } catch (e) {
    Logger.log('Invitation Error: ' + e.toString());
  }
}

function setupHeaders(sheet, sheetName) {
  let headers = [];
  if (sheetName === 'ai-logistics-v3') {
    headers = [
      "Timestamp", "ID", "Full Name", "Email", "Phone",
      "Age", "Education", "Position", "Score", "Max Score", "Verified"
    ];
  } else {
    headers = [
      "Timestamp", "ID", "Full Name", "Email", "Phone", 
      "Course", "Position", "Company", "Industry", 
      "Province", "Source", "Expectations", "Referral Info",
      "Verified"
    ];
  }
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f3f3");
}

function generateUniqueId() {
  return 'REG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}
