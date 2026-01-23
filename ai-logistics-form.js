// Google Sheets Configuration for AI FOR LOGISTICS
const SHEET_ID = '1ViBY3Nj0NhnPtP_oYLzGePHadkRvJRh0HLud93wR4XY';
const SCRIPT_URL = 'YOUR_DEPLOYMENT_URL_HERE'; // Will be updated after Apps Script deployment

// Form Elements
const form = document.getElementById('aiLogisticsForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');
const sessionError = document.getElementById('sessionError');
const successModal = document.getElementById('successModal');
const queueNumberSpan = document.getElementById('queueNumber');

// Form Submission
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Validate session selection
    const selectedSessions = document.querySelectorAll('input[name="session"]:checked');
    if (selectedSessions.length === 0) {
        sessionError.style.display = 'block';
        sessionError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    // Collect selected sessions
    const sessionsArray = [];
    const datesArray = [];
    selectedSessions.forEach(checkbox => {
        sessionsArray.push(checkbox.value);
        datesArray.push(checkbox.dataset.dates);
    });

    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim().toLowerCase(),
        phone: document.getElementById('phone').value.trim(),
        lineId: document.getElementById('lineId').value.trim(),
        occupation: document.getElementById('occupation').value.trim(),
        age: document.getElementById('age').value,
        education: document.getElementById('education').value,
        educationOther: document.getElementById('educationOther').value.trim(),
        position: document.getElementById('position').value.trim(),
        company: document.getElementById('company').value.trim(),
        province: document.getElementById('province').value,
        district: document.getElementById('district').value,
        course: 'AI FOR LOGISTICS',
        sessions: sessionsArray,
        sessionDates: datesArray,
        timestamp: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
    };

    // Disable submit button
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';

    try {
        // Submit to Google Sheets
        const result = await submitToGoogleSheets(formData);

        if (result.success) {
            // Show success modal
            showSuccessModal(result.queueNumber);

            // Reset form
            form.reset();
            document.querySelectorAll('.session-card').forEach(card => {
                card.classList.remove('selected');
            });
        } else {
            throw new Error(result.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
        }

    } catch (error) {
        console.error('Error:', error);
        alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง หรือติดต่อเจ้าหน้าที่');
    } finally {
        submitBtn.disabled = false;
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
    }
});

// Submit to Google Sheets
async function submitToGoogleSheets(formData) {
    try {
        console.log('Sending data to Google Sheets:', formData);

        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            mode: 'no-cors'
        });

        console.log('Data sent successfully');

        // Generate queue number
        const queueNumber = Math.floor(Date.now() / 1000) % 1000;

        return {
            success: true,
            queueNumber: queueNumber
        };

    } catch (error) {
        console.error('Submit error:', error);
        return {
            success: false,
            message: error.message
        };
    }
}

// Show Success Modal
function showSuccessModal(queueNumber) {
    queueNumberSpan.textContent = queueNumber.toString().padStart(2, '0');
    successModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Success Modal
function closeSuccessModal() {
    successModal.classList.remove('active');
    document.body.style.overflow = '';
    window.location.href = 'index.html';
}

// Close modal when clicking overlay
document.querySelector('.modal-overlay')?.addEventListener('click', closeSuccessModal);

// Phone Number Formatting
const phoneInput = document.getElementById('phone');
phoneInput?.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    e.target.value = value;
});

// Email Validation
const emailInput = document.getElementById('email');
emailInput?.addEventListener('blur', function (e) {
    const email = e.target.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
        e.target.setCustomValidity('กรุณากรอกอีเมลให้ถูกต้อง');
        e.target.reportValidity();
    } else {
        e.target.setCustomValidity('');
    }
});

// Province/District Handling
document.addEventListener('DOMContentLoaded', function () {
    const provinceSelect = document.getElementById('province');
    const districtSelect = document.getElementById('district');
    const educationSelect = document.getElementById('education');
    const educationOther = document.getElementById('educationOther');

    // Populate provinces
    if (provinceSelect && typeof thailandData !== 'undefined') {
        const provinces = Object.keys(thailandData).sort();
        provinceSelect.innerHTML = '<option value="">-- เลือกจังหวัด --</option>';
        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province;
            option.textContent = province;
            provinceSelect.appendChild(option);
        });
    }

    // Handle province change
    if (provinceSelect && districtSelect) {
        provinceSelect.addEventListener('change', function () {
            const selectedProvince = this.value;
            districtSelect.innerHTML = '<option value="">-- เลือกอำเภอ/เขต --</option>';

            if (selectedProvince && thailandData[selectedProvince]) {
                const districts = thailandData[selectedProvince];
                districts.forEach(district => {
                    const option = document.createElement('option');
                    option.value = district;
                    option.textContent = district;
                    districtSelect.appendChild(option);
                });
                districtSelect.disabled = false;
            } else {
                districtSelect.disabled = true;
            }
        });
    }

    // Handle education "other" field
    if (educationSelect && educationOther) {
        educationSelect.addEventListener('change', function () {
            if (this.value === 'อื่นๆ') {
                educationOther.style.display = 'block';
                educationOther.required = true;
            } else {
                educationOther.style.display = 'none';
                educationOther.required = false;
                educationOther.value = '';
            }
        });
    }
});

// Session Selection Handling
const sessionCheckboxes = document.querySelectorAll('input[name="session"]');
sessionCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        const card = this.closest('.session-card');
        if (this.checked) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }

        // Hide error if at least one selected
        const anySelected = document.querySelectorAll('input[name="session"]:checked').length > 0;
        if (anySelected) {
            sessionError.style.display = 'none';
        }
    });
});

console.log('✅ AI FOR LOGISTICS Registration Form initialized!');
console.log('📊 Sheet ID:', SHEET_ID);
console.log('🤖 Course: AI FOR LOGISTICS');
