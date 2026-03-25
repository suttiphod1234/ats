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
