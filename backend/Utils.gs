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
  const targetSheetName = data.sheetName || 'ซีต1';
  const scriptUrl = 'https://script.google.com/macros/s/AKfycbwrI7LxkOyR658PbvQ24tIlyFXvGstKiuEk1WTzsGGWmGpqpD_TDT2Hvx84nJ8pPLubiw/exec';
  const verifyLink = `${scriptUrl}?action=verify&id=${regId}&sheetName=${encodeURIComponent(targetSheetName)}`;
  
  let subject = `[LogiSkill] กรุณายืนยันการลงทะเบียน: ${data.course || 'หลักสูตรของเรา'}`;
  let scoreInfo = "";
  
  if (targetSheetName === 'ai-logistics-v3' && data.score !== undefined) {
    subject = `[คะแนน: ${data.score}/10] ยืนยันการลงทะเบียน: ${data.course}`;
    
    let levelText = "";
    if (data.score >= 10) levelText = "ดีมาก มีความรู้พื้นฐานดี สามารถเรียนเนื้อหาเชิงลึกได้";
    else if (data.score >= 9) levelText = "มีความเข้าใจค่อนข้างดี พร้อมต่อยอด";
    else if (data.score >= 7) levelText = "มีความเข้าใจเบื้องต้น แต่ยังต้องพัฒนา";
    else levelText = "ควรทบทวนเนื้อหาพื้นฐานและสอบใหม่ (สอบใหม่)";

    scoreInfo = `
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold; color: #3b82f6;">ผลการทดสอบก่อนเรียน (Pre-test):</p>
        <p style="font-size: 1.5rem; margin: 10px 0;">คะแนนของคุณคือ <strong>${data.score} / ${data.maxScore || 10}</strong></p>
        <p style="margin: 0; color: #64748b; font-size: 0.9rem;">${levelText}</p>
      </div>
    `;
  }
  
  const htmlBody = `
    <div style="font-family: 'Prompt', sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
      <div style="background: #3b82f6; color: white; padding: 20px; text-align: center;">
        <h2>ยืนยันการลงทะเบียน LogiSkill</h2>
      </div>
      <div style="padding: 30px; color: #1e293b; line-height: 1.6;">
        <p>สวัสดีคุณ <strong>${data.fullName}</strong>,</p>
        <p>ขอบคุณที่สนใจลงทะเบียนในหลักสูตร <strong>${data.course || 'ของเรา'}</strong></p>
        
        ${scoreInfo}

        <p>เพื่อความถูกต้องของข้อมูลและยืนยันการสำรองที่นั่ง กรุณาคลิกปุ่มด้านล่างเพื่อยืนยันอีเมลของคุณครับ:</p>
        
        <div style="text-align: center; margin: 40px 0;">
          <a href="${verifyLink}" style="background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">ยืนยันอีเมลของฉัน</a>
        </div>
        
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

/**
 * Send survey summary email to customer
 */
function sendSurveyEmail(data, sequence) {
  let subject = `[LogiSkill] สรุปข้อมูลความสนใจหลักสูตร: ${data.course}`;
  
  let htmlBody = `
    <div style="font-family: 'Prompt', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #7c3aed;">ขอบคุณสำหรับข้อมูลความสนใจ</h2>
        <p style="color: #64748b;">เราได้รับข้อมูลของคุณลำดับที่ #${sequence} เรียบร้อยแล้ว</p>
      </div>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
        <h3 style="margin-top: 0; color: #1e293b; border-bottom: 2px solid #ddd; padding-bottom: 10px;">ข้อมูลผู้ร่วมการสำรวจ</h3>
        <p><strong>ชื่อ-นามสกุล:</strong> ${data.fullName}</p>
        <p><strong>เบอร์โทรศัพท์:</strong> ${data.phone}</p>
        <p><strong>อีเมล:</strong> ${data.email}</p>
      </div>
      
      <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
        <h3 style="margin-top: 0; color: #1e293b; border-bottom: 2px solid #ddd; padding-bottom: 10px;">หลักสูตรที่สนใจ</h3>
        <p><strong>หมวดหมู่:</strong> ${data.category}</p>
        <p><strong>วิชา:</strong> ${data.course}</p>
        <p><strong>สิ่งที่คุณอยากเรียนรู้:</strong> ${data.interest || '-'}</p>
      </div>

      <div style="text-align: center; margin-top: 30px; padding: 20px; background: #fffbeb; border-radius: 8px; border: 1px solid #fde68a;">
        <p style="color: #92400e; font-weight: bold; margin: 0;">กรุณารอหลักสูตรอนุมัติและเปิดรอบใหม่</p>
        <p style="color: #b45309; font-size: 0.9rem; margin-top: 5px;">เราจะติดต่อกลับหาคุณผ่านอีเมลหรือเบอร์โทรศัพท์เพื่อแจ้งข่าวสารทันทีที่มีการเปิดสอน</p>
      </div>
      
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
      <p style="font-size: 0.8rem; color: #94a3b8; text-align: center;">LogiSkill - Leading the future of Logistics with AI</p>
    </div>
  `;
  
  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    htmlBody: htmlBody
  });
}
