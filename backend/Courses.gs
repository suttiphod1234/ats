/**
 * Course Management Logic (Admin Dashboard)
 */

function listCourses() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName('courses');
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  return data.slice(1).map(row => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = row[i]);
    return obj;
  });
}

function addCourse(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName('courses');
  if (!sheet) {
    sheet = ss.insertSheet('courses');
    sheet.appendRow(['ID', 'Title', 'Subtitle', 'Category', 'Status', 'Icon', 'Dates', 'FormLink', 'StyleClass', 'CalendarEventID']);
  }
  
  const id = 'C' + new Date().getTime();
  const calendarEventId = syncCourseToCalendar(data);
  
  sheet.appendRow([
    id,
    data.title,
    data.subtitle,
    data.category,
    data.status,
    data.icon,
    data.dates,
    data.formLink,
    data.styleClass,
    calendarEventId
  ]);
  
  return { success: true, id: id };
}

function updateCourse(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('courses');
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === data.id) {
      const calendarEventId = syncCourseToCalendar(data, rows[i][9]);
      
      const newRow = [
        data.id,
        data.title,
        data.subtitle,
        data.category,
        data.status,
        data.icon,
        data.dates,
        data.formLink,
        data.styleClass,
        calendarEventId
      ];
      
      sheet.getRange(i + 1, 1, 1, newRow.length).setValues([newRow]);
      return { success: true };
    }
  }
  return { success: false, error: 'Course not found' };
}

function deleteCourse(id) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('courses');
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === id) {
      // Delete calendar event if exists
      const eventId = rows[i][9];
      if (eventId) {
        try {
          const calendar = CalendarApp.getDefaultCalendar();
          const event = calendar.getEventById(eventId);
          if (event) event.deleteEvent();
        } catch (e) {}
      }
      
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, error: 'Course not found' };
}
