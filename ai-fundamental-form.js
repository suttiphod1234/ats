/**
 * AI Fundamentals Registration Form Handler
 */

if (typeof CONFIG === 'undefined') {
    console.error('Configuration file (config.js) not loaded!');
}

const FORM_CONFIG = CONFIG?.sheets?.aiFundamental;

// Form Elements
const form = document.getElementById('aiFundamentalForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = submitBtn.querySelector('.btn-text');
const btnLoader = submitBtn.querySelector('.btn-loader');
const successModal = document.getElementById('successModal');
const successNameSpan = document.getElementById('successName');

// Form Submission
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Collect Data
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value.trim().toLowerCase(),
        phone: document.getElementById('phone').value,
        lineId: document.getElementById('lineId').value,
        age: document.getElementById('age').value,
        occupation: document.getElementById('occupation').value,
        education: document.getElementById('education').value,
        company: document.getElementById('company').value,
        province: document.getElementById('province').value,
        district: document.getElementById('district').value,
        course: 'AI Fundamentals',
        sheetName: FORM_CONFIG.sheetName,
        timestamp: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
    };

    // Simple validation (Phone 10 digits)
    const phoneClean = formData.phone.replace(/\D/g, '');
    if (phoneClean.length !== 10) {
        alert('กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก');
        return;
    }

    try {
        setLoading(true);

        // Submit to Google Apps Script
        const response = await fetch(FORM_CONFIG.scriptUrl, {
            method: 'POST',
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.status === 'success') {
            showSuccess(formData.fullName);
            form.reset();
        } else {
            throw new Error(result.message || 'Submission failed');
        }

    } catch (error) {
        console.error('Error submitting form:', error);
        alert('เกิดข้อผิดพลาดในการส่งข้อมูล: ' + error.message);
    } finally {
        setLoading(false);
    }
});

function setLoading(isLoading) {
    submitBtn.disabled = isLoading;
    btnText.style.display = isLoading ? 'none' : 'inline';
    btnLoader.style.display = isLoading ? 'inline' : 'none';
}

function showSuccess(name) {
    successNameSpan.textContent = name;
    successModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSuccessModal() {
    successModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Populate Thailand Data
document.addEventListener('DOMContentLoaded', () => {
    const provinceSelect = document.getElementById('province');
    const districtSelect = document.getElementById('district');

    if (FormUtils && typeof thailandData !== 'undefined') {
        FormUtils.populateProvinces(provinceSelect, districtSelect);
    }
});

// Close modal on overlay click
document.querySelector('.modal-overlay').addEventListener('click', closeSuccessModal);
