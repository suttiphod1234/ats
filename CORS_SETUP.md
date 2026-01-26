# 🔧 คู่มือการตั้งค่า CORS สำหรับ Google Apps Script

## 📋 ภาพรวม

เพื่อให้โปรเจค LogiSkill สามารถอ่าน response จาก Google Apps Script ได้ ต้องตั้งค่า CORS headers อย่างถูกต้อง

---

## ✅ วิธีที่ 1: ใช้ Google Apps Script Web App (แนะนำ)

Google Apps Script Web App จะจัดการ CORS headers อัตโนมัติเมื่อ deploy เป็น Web App

### ขั้นตอน:

1. **เปิด Google Apps Script Editor**
   - ไปที่ [script.google.com](https://script.google.com)
   - เลือกโปรเจค `Code.gs` หรือ `Code-AI-Logistics.gs`

2. **Deploy เป็น Web App**
   - คลิก **Deploy** → **New deployment**
   - เลือก **Type:** Web app
   - ตั้งค่า:
     - **Execute as:** Me
     - **Who has access:** Anyone
   - คลิก **Deploy**

3. **คัดลอก Web App URL**
   - คัดลอก URL ที่ได้
   - วางใน `config.js` ในส่วน `scriptUrl`

---

## ✅ วิธีที่ 2: เพิ่ม CORS Headers ในโค้ด (ถ้าจำเป็น)

ถ้าใช้วิธีอื่นที่ไม่ใช่ Web App อาจต้องเพิ่ม headers เอง

### ใน `Code.gs`:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getSheetByName('ซีต1');
    const data = JSON.parse(e.postData.contents);
    
    // ... existing code ...
    
    const lastRow = sheet.getLastRow();
    const queueNumber = lastRow > 1 ? lastRow : 1;
    
    // Append data
    sheet.appendRow([...]);
    
    // Return with CORS headers
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      queueNumber: queueNumber,
      message: 'ลงทะเบียนสำเร็จ'
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: 'เกิดข้อผิดพลาด: ' + error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    const sheet = SpreadsheetApp.openById('YOUR_SHEET_ID').getSheetByName('ซีต1');
    
    if (action === 'checkEmail') {
      const email = e.parameter.email;
      
      if (!email) {
        return ContentService.createTextOutput(JSON.stringify({
          exists: false,
          error: 'No email provided'
        }))
        .setMimeType(ContentService.MimeType.JSON);
      }
      
      const data = sheet.getDataRange().getValues();
      const emailExists = data.some((row, index) => {
        return index > 0 && row[3] && row[3].toLowerCase() === email.toLowerCase();
      });
      
      return ContentService.createTextOutput(JSON.stringify({
        exists: emailExists
      }))
      .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Invalid action'
    }))
    .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}
```

---

## 🔍 การทดสอบ CORS

### 1. ทดสอบด้วย Browser Console:

```javascript
fetch('YOUR_SCRIPT_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ test: 'data' }),
  mode: 'cors'
})
.then(response => response.json())
.then(data => console.log('Success:', data))
.catch(error => console.error('Error:', error));
```

### 2. ตรวจสอบ Network Tab:

1. เปิด Developer Tools (F12)
2. ไปที่ **Network** tab
3. Submit form
4. ตรวจสอบ response headers:
   - ควรมี `Access-Control-Allow-Origin: *`
   - Status code ควรเป็น 200

---

## ⚠️ ปัญหาที่อาจพบ

### ปัญหา: CORS error ใน console

**สาเหตุ:**
- Google Apps Script ไม่ได้ deploy เป็น Web App
- Script URL ไม่ถูกต้อง

**วิธีแก้:**
1. ตรวจสอบว่า deploy เป็น Web App แล้ว
2. ตรวจสอบ Script URL ใน `config.js`
3. ลอง deploy ใหม่

### ปัญหา: Response ไม่ใช่ JSON

**สาเหตุ:**
- Google Apps Script return HTML แทน JSON

**วิธีแก้:**
- ตรวจสอบว่าใช้ `ContentService.createTextOutput()` และ `.setMimeType(ContentService.MimeType.JSON)`

---

## 📝 Checklist

- [ ] Deploy Google Apps Script เป็น Web App
- [ ] ตั้งค่า "Who has access" เป็น "Anyone"
- [ ] คัดลอก Web App URL ไปใส่ใน `config.js`
- [ ] ทดสอบการ submit form
- [ ] ตรวจสอบว่า Queue Number ถูกต้อง
- [ ] ทดสอบ email duplicate check
- [ ] ตรวจสอบ error handling

---

## 🎯 สรุป

**วิธีที่ง่ายที่สุด:** ใช้ Google Apps Script Web App ซึ่งจะจัดการ CORS อัตโนมัติ

**สำคัญ:** ต้องตั้งค่า "Who has access" เป็น "Anyone" เพื่อให้สามารถเรียกใช้จากเว็บไซต์ได้

---

**วันที่สร้าง:** $(date)


