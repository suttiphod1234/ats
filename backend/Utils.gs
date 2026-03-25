/**
 * Utility Functions & Helpers
 */

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function syncCourseToCalendar(data, existingEventId) {
  try {
    const calendar = CalendarApp.getCalendarById(ADMIN_CALENDAR_ID) || CalendarApp.getDefaultCalendar();
    const title = `[Course] ${data.title}`;
    const description = `${data.subtitle}\nLink: ${data.formLink}`;
    
    // --- Better Date Parsing ---
    let startDate = new Date();
    // Default to a 2H duration if no specific time is provided
    let endDate = new Date(startDate.getTime() + (2 * 60 * 60 * 1000)); 

    // Try to extract date from data.dates (Expected format: "YYYY-MM-DD" or similar)
    if (data.dates) {
      const dateMatch = data.dates.match(/(\d{4})-(\d{2})-(\d{2})/);
      if (dateMatch) {
         startDate = new Date(dateMatch[0]);
         startDate.setHours(9, 0, 0); // Start at 9 AM
         endDate = new Date(startDate);
         endDate.setHours(17, 0, 0); // End at 5 PM
      }
    }
    
    if (existingEventId) {
      try {
        const event = calendar.getEventById(existingEventId);
        if (event) {
          event.setTitle(title);
          event.setDescription(description);
          event.setTime(startDate, endDate);
          return existingEventId;
        }
      } catch (e) {
        Logger.log('Could not find existing event: ' + existingEventId);
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
 * ส่งอีเมลยืนยันตัวตนให้ลูกค้า
 */
function sendVerificationEmail(data, regId) {
  const sheetName = data.sheetName || 'ซีต1';
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbyt5ixNoX9jl6lYZrytzqPXRD1ZFqfJGnuMPmm4sbifa67neVYz7E43ba0KAm_EPCeKeA/exec';
  const verifyLink = `${scriptUrl}?action=verify&id=${regId}&sheetName=${encodeURIComponent(sheetName)}`;
  
  const subject = `[LogiSkill] กรุณายืนยันการลงทะเบียน: ${data.course || 'หลักสูตรของเรา'}`;
  
  const htmlBody = `
    <div style="font-family: 'Prompt', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
      <div style="background: #3b82f6; color: white; padding: 20px; text-align: center;">
        <h2>ยืนยันการลงทะเบียน LogiSkill</h2>
      </div>
      <div style="padding: 30px; color: #1e293b; line-height: 1.6;">
        <p>สวัสดีคุณ <strong>${data.fullName}</strong>,</p>
        <p>ขอบคุณที่สนใจลงทะเบียนในหลักสูตร <strong>${data.course || 'ของเรา'}</strong></p>
        <p>เพื่อความถูกต้องของข้อมูลและยืนยันการสำรองที่นั่ง กรุณาคลิกปุ่มด้านล่างเพื่อยืนยันอีเมลของคุณครับ:</p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${verifyLink}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">ยืนยันอีเมลของฉัน</a>
        </div>
        
        <p style="color: #64748b; font-size: 0.9rem;">หากคุณไม่สามารถกดปุ่มด้านบนได้ สามารถคัดลอกลิงก์ด้านล่างไปวางใน Browser ได้ครับ:</p>
        <p style="word-break: break-all; font-size: 0.8rem; color: #3b82f6;">${verifyLink}</p>
        
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
        <p style="font-size: 0.8rem; color: #94a3b8; text-align: center;">นี่คืออีเมลอัตโนมัติ กรุณาอย่าตอบกลับอีเมลนี้<br>LogiSkill - Leading the future of Logistics with AI</p>
      </div>
    </div>
  `;

  try {
    MailApp.sendEmail({
      to: data.email,
      subject: subject,
      htmlBody: htmlBody
    });
    Logger.log('Verification email sent to ' + data.email);
  } catch (e) {
    Logger.log('Email Error: ' + e.toString());
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
