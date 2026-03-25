/**
 * Registration Processing Logic
 */

function processRegistration(data) {
  const targetSheetName = data.sheetName || 'ซีต1';
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(targetSheetName);

  if (!sheet) {
    sheet = ss.insertSheet(targetSheetName);
    setupHeaders(sheet);
  }

  const timestamp = new Date();
  const id = generateUniqueId();

  // Append data row
  sheet.appendRow([
    timestamp,
    id,
    data.fullName,
    data.email,
    "'" + data.phone, // Force as string
    data.course || "",
    data.position || "",
    data.company || "",
    data.industry || "",
    data.province || "",
    data.source || "",
    data.expectations || "",
    data.referralText || ""
  ]);

  return { 
    success: true, 
    id: id,
    message: 'Data saved successfully'
  };
}

function setupHeaders(sheet) {
  const headers = [
    "Timestamp", "ID", "Full Name", "Email", "Phone", 
    "Course", "Position", "Company", "Industry", 
    "Province", "Source", "Expectations", "Referral Info"
  ];
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#f3f3f3");
}

function generateUniqueId() {
  return 'REG-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}
