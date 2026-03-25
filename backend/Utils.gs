/**
 * Utility Functions & Helpers
 */

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function syncCourseToCalendar(data, existingEventId) {
  try {
    const calendar = CalendarApp.getDefaultCalendar();
    const title = `[Course] ${data.title}`;
    const description = `${data.subtitle}\nLink: ${data.formLink}`;
    
    // Default to today
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); // +2 hours
    
    if (existingEventId) {
      const event = calendar.getEventById(existingEventId);
      if (event) {
        event.setTitle(title);
        event.setDescription(description);
        return existingEventId;
      }
    }
    
    const newEvent = calendar.createEvent(title, startDate, endDate, {
      description: description
    });
    return newEvent.getId();
  } catch (e) {
    Logger.log('Calendar Sync Error: ' + e.toString());
    return existingEventId || '';
  }
}

/**
 * ฟังก์ชันสำหรับทดสอบการทำงานจากภายใน Apps Script Editor
 */
function testPost() {
  const testData = {
    fullName: "ทดสอบ ระบบ (Refactored)",
    email: "test-refactor@example.com",
    phone: "0812345678",
    sheetName: "ซีต1", 
    course: "TEST REFACTOR"
  };
  
  const dummyEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(dummyEvent);
  Logger.log('--- ผลการทดสอบ ---');
  Logger.log(result.getContent());
  Logger.log('------------------');
}
