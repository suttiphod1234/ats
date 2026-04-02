/**
 * Google Apps Script for AI For Logistics Quiz
 * 1. Store data in Google Sheets
 * 2. Send email notification to user
 */

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheets()[0]; // Use the first sheet

    // 1. Store in Google Sheets
    // Columns: Timestamp, Full Name, Email, Phone, Age, Education, Expectations, Score, Attempt
    sheet.appendRow([
      new Date(),
      data.fullName,
      data.email,
      data.phone,
      data.ageRange,
      data.education,
      data.expectations,
      data.score,
      data.isSecondAttempt ? "ครั้งที่ 2 (สลับข้อ)" : "ครั้งที่ 1"
    ]);

    // 2. Send Email
    sendResultEmail(data);

    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendResultEmail(data) {
  const recipient = data.email;
  const subject = `คะแนนสอบหลักสูตร AI for Logistics: ${data.fullName}`;
  
  const htmlBody = `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="color: #F97316;">ขอแสดงความยินดี! คุณทำแบบทดสอบสำเร็จ</h2>
      <p>สวัสดีคุณ <strong>${data.fullName}</strong>,</p>
      <p>ขอบคุณที่เข้าร่วมการทดสอบหลักสูตร “การประยุกต์ใช้เทคโนโลยีปัญญาประดิษฐ์สำหรับงานโลจิสติกส์ (AI for Logistics)”</p>
      
      <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <span style="font-size: 1.2rem; color: #666;">คะแนนที่คุณสอบได้คือ</span><br>
        <strong style="font-size: 3rem; color: #0F172A;">${data.score} / 10</strong>
      </div>
      
      <p>หากคุณมีคำถามเพิ่มเติม หรือต้องการข้อมูลเกี่ยวกับหลักสูตรอื่นๆ สามารถติดต่อเราได้ที่ช่องทางด้านล่างนี้:</p>
      
      <ul style="list-style: none; padding: 0;">
        <li>🌐 <strong>เว็บไซต์:</strong> <a href="https://suttiphod1234.github.io/ats/frontend/ai-logistics-quiz/index.html">LogiSkill Website</a></li>
        <li>📘 <strong>Facebook:</strong> <a href="https://web.facebook.com/logiskill">LogiSkill Facebook</a></li>
        <li>💬 <strong>Line:</strong> <a href="https://lin.ee/rQhZnwh">Line Official</a></li>
      </ul>
      
      <hr style="border-top: 1px solid #eee; margin: 30px 0;">
      <p style="font-size: 0.8rem; color: #999; text-align: center;">
        อีเมลนี้ถูกส่งโดยอัติโนมัติจากระบบแบบทดสอบ AI for Logistics <br>
        ส่งโดย: art.ru2mbalo@gmail.com
      </p>
    </div>
  `;

  GmailApp.sendEmail(recipient, subject, "", {
    htmlBody: htmlBody,
    from: "art.ru2mbalo@gmail.com" // Ensure this alias is authorized in the Google account
  });
}
