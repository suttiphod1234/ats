// Google Sheets Configuration
const SHEET_ID = '1Eq-cQO4Z2VYMfkGMhHrlfXve2bJces7YyUM7gbNNL0g';
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyMwlyu1CpiFtPgExaxlcp_rYDLFdJskmsYzeuRlM4ic9_2wMr3-FE48mwnuEfoiw_c/exec';

// Form Elements
const form = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');
const courseError = document.getElementById('courseError');
const successModal = document.getElementById('successModal');
const queueNumberSpan = document.getElementById('queueNumber');

// Form Submission
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Validate course selection - check for at least one checkbox selected
    const selectedCourses = document.querySelectorAll('input[name="courseSession"]:checked');
    if (selectedCourses.length === 0) {
        courseError.style.display = 'block';
        courseError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    // Collect all selected courses and sessions
    const coursesArray = [];
    const sessionsArray = [];
    selectedCourses.forEach(checkbox => {
        coursesArray.push(checkbox.dataset.course);
        sessionsArray.push(checkbox.dataset.session);
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
        courses: coursesArray,
        sessions: sessionsArray,
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
            // Show success modal with queue number
            showSuccessModal(result.queueNumber);

            // Reset form
            form.reset();
            document.querySelectorAll('.course-option').forEach(option => option.classList.remove('selected'));
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

// Submit to Google Sheets - PRODUCTION MODE
async function submitToGoogleSheets(formData) {
    try {
        console.log('Sending data to Google Sheets:', formData);

        // Send data to Google Apps Script
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            mode: 'no-cors'
        });

        // Note: no-cors mode doesn't allow reading the response
        // We'll assume success if no error is thrown
        console.log('Data sent successfully');

        // Generate a queue number based on timestamp
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
}

// Close modal when clicking overlay
document.querySelector('.modal-overlay')?.addEventListener('click', closeSuccessModal);

// Phone Number Formatting
const phoneInput = document.getElementById('phone');
phoneInput?.addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

    // Limit to 10 digits
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

// ===== PROVINCE/DISTRICT HANDLING =====

// Populate provinces on page load
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

// ===== MULTIPLE COURSE SELECTION HANDLING =====

// Update course selection to handle checkboxes
const checkboxes = document.querySelectorAll('input[name="courseSession"]');

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
        // Update parent course card styling
        const parentCourse = this.closest('.course-option');
        const anyChecked = parentCourse.querySelectorAll('input[name="courseSession"]:checked').length > 0;

        if (anyChecked) {
            parentCourse.classList.add('selected');
        } else {
            parentCourse.classList.remove('selected');
        }

        // Hide error message if at least one course is selected
        const anySelected = document.querySelectorAll('input[name="courseSession"]:checked').length > 0;
        if (anySelected) {
            courseError.style.display = 'none';
        }
    });
});

console.log('✅ Registration form initialized!');
console.log('📊 Google Sheets URL:', SCRIPT_URL);
console.log('🌏 Province/District system ready');
console.log('📝 Multiple course selection enabled');
