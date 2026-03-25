/**
 * Main Entry Points for Google Apps Script Web App
 */

function doGet(e) {
  if (!e || !e.parameter) {
    return jsonResponse({ 
      error: 'doGet called without valid event data.',
      hint: 'This is normal if you click "Run" in the editor. The script is working fine for the website.'
    });
  }
  
  const action = e.parameter.action;
  
  // --- Login doesn't need Spreadsheet access ---
  if (action === 'login') {
    const username = e.parameter.username;
    const password = e.parameter.password;
    if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
      return jsonResponse({ success: true, token: 'logiskill-' + new Date().getTime() });
    } else {
      return jsonResponse({ success: false, error: 'Username หรือ Password ไม่ถูกต้อง' });
    }
  }

  // --- Verification doesn't need to open spreadsheet first (it opens it inside) ---
  if (action === 'verify') {
    const id = e.parameter.id;
    const sName = e.parameter.sheetName || 'ซีต1';
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(sName);
    if (!sheet) return HtmlService.createHtmlOutput('<h3>Error: Sheet not found</h3>');
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const idIdx = headers.indexOf('ID');
    const verifiedIdx = headers.indexOf('Verified');
    
    if (idIdx === -1 || verifiedIdx === -1) return HtmlService.createHtmlOutput('<h3>Error: System columns not found</h3>');
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][idIdx] === id) {
        sheet.getRange(i + 1, verifiedIdx + 1).setValue('YES');
        return HtmlService.createHtmlOutput(`
          <div style="font-family: 'Prompt', sans-serif; text-align: center; padding: 50px;">
            <h2 style="color: #10b981;">✅ ยืนยันอีเมลสำเร็จ!</h2>
            <p>ขอบคุณที่ยืนยันตัวตนกับ LogiSkill ระบบได้บันทึกข้อมูลของคุณเรียบร้อยแล้ว</p>
            <p>กำลังพาคุณไปที่ LINE (LogiSkill) ใน 3 วินาที...</p>
            <br>
            <a href="https://lin.ee/vwRyBD1" style="padding: 10px 20px; background: #00b900; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">ไปที่ LINE OA</a>
            <script>
              setTimeout(function(){ window.location.href = "https://lin.ee/vwRyBD1"; }, 3000);
            </script>
          </div>
        `);
      }
    }
    return HtmlService.createHtmlOutput('<h3>Error: Registration ID not found</h3>');
  }

  const sheetName = e.parameter.sheetName || 'ซีต1';
  
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(sheetName);

    if (action === 'checkEmail' && sheet) {
      const email = e.parameter.email;
      if (!email) return jsonResponse({ exists: false, error: 'No email' });
      
      const data = sheet.getDataRange().getValues();
      const emailExists = data.some((row, index) => index > 0 && row[3] && row[3].toString().toLowerCase() === email.toLowerCase());
      
      return jsonResponse({ exists: emailExists });
    }

    if (action === 'getRegistrationCount') {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const sheet = ss.getSheetByName(sheetName);
      if (!sheet) return jsonResponse({ count: 1 });
      return jsonResponse({ count: sheet.getLastRow() }); // Return current row count as the sequence
    }

    if (action === 'listCourses') {
      return jsonResponse({ success: true, data: listCourses() });
    }
    
    return jsonResponse({ error: 'Invalid action or sheet not found' });
    
  } catch (error) {
    return jsonResponse({ error: error.toString() });
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      return jsonResponse({ 
        error: 'doPost called without valid event data.',
        hint: 'This is normal if you click "Run" in the editor. Use "testPost" for testing.'
      });
    }

    // Parse incoming data
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    // --- ADMIN COURSE MANAGEMENT ACTIONS ---
    if (action === 'login') {
      if (data.username === ADMIN_USER && data.password === ADMIN_PASSWORD) {
        return jsonResponse({ success: true, token: 'logiskill-' + new Date().getTime() });
      } else {
        return jsonResponse({ success: false, error: 'Username หรือ Password ไม่ถูกต้อง' });
      }
    } else if (action === 'addCourse') {
      return jsonResponse(addCourse(data));
    } else if (action === 'updateCourse') {
      return jsonResponse(updateCourse(data));
    } else if (action === 'deleteCourse') {
      return jsonResponse(deleteCourse(data.id));
    }
    
    // --- REGISTRATION ACTIONS ---
    return jsonResponse(processRegistration(data));

  } catch (error) {
    return jsonResponse({ 
      success: false, 
      error: error.toString() 
    });
  }
}
