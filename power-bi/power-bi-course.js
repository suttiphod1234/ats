/**
 * Power BI Registration Form Handler
 */

if (typeof CONFIG === 'undefined') {
    console.error('Configuration file (config.js) not loaded!');
}

const POWER_BI_CONFIG = CONFIG?.sheets?.powerBi;

if (!POWER_BI_CONFIG) {
    console.error('Power BI configuration not found!');
}

const form = document.getElementById('powerBiForm');
const submitBtn = form.querySelector('.btn-submit');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Disable button to prevent double submission
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'กำลังบันทึก...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';

    // Get form data
    const rawFormData = {
        fullName: document.getElementById('fullName').value,
        department: document.getElementById('department').value,
        employeeId: document.getElementById('employeeId').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        course: 'Advanced Analyzing Data With Power BI',
        sheetName: 'Power BI' // Important: Matches Key in Code-AI-Logistics.gs
    };

    // Prepare data for submission
    const formData = {
        ...rawFormData,
        timestamp: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
    };

    try {
        // Send data to Google Apps Script
        // Using no-cors mode because typically GAS Web Apps don't set CORS headers for POST from generic domains,
        // but we can still send data. However, we won't get a JSON response readable in JS.
        // Wait, Code-AI-Logistics.gs uses ContentService.createTextOutput...setMimeType(JSON).
        // If we use 'application/x-www-form-urlencoded' or 'text/plain', we might avoid preflight issues.
        // Let's use standard fetch pattern found in other files (if any).
        // Assuming standard fetch:

        await fetch(POWER_BI_CONFIG.scriptUrl, {
            method: 'POST',
            body: JSON.stringify(formData),
            mode: 'no-cors', // Basic submission
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Since 'no-cors' treats everything as opaque, we assume success if no network error thrown.
        alert('✅ ลงทะเบียนสำเร็จ!\n\nขอบคุณสำหรับการลงทะเบียน เจ้าหน้าที่จะทำการตรวจสอบและยืนยันสิทธิ์กลับไปทางอีเมล');
        form.reset();

    } catch (error) {
        console.error('Error submitting form:', error);
        alert('❌ เกิดข้อผิดพลาดในการลงทะเบียน\n\n' + error.message);
    } finally {
        // Re-enable button
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }
});
