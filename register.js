/**
 * Registration Form Handler
 * Uses config.js and form-utils.js for better code organization
 */

// Get configuration
const SHEET_CONFIG = CONFIG?.sheets?.general || {
    id: '1Eq-cQO4Z2VYMfkGMhHrlfXve2bJces7YyUM7gbNNL0g',
    scriptUrl: 'https://script.google.com/macros/s/AKfycbyMwlyu1CpiFtPgExaxlcp_rYDLFdJskmsYzeuRlM4ic9_2wMr3-FE48mwnuEfoiw_c/exec'
};

// Form Elements
const form = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');
const btnText = document.querySelector('.btn-text');
const btnLoader = document.querySelector('.btn-loader');
const courseError = document.getElementById('courseError');
const successModal = document.getElementById('successModal');
const queueNumberSpan = document.getElementById('queueNumber');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');

// Email duplicate check state
let isCheckingEmail = false;
let emailCheckTimeout = null;

// Form Submission
form.addEventListener('submit', async function (e) {
    e.preventDefault();

    // Validate course selection
    const selectedCourses = document.querySelectorAll('input[name="courseSession"]:checked');
    if (selectedCourses.length === 0) {
        FormUtils?.showError(courseError, 'กรุณาเลือกหลักสูตรและรุ่นที่ต้องการเข้าอบรม') || 
        (courseError.style.display = 'block');
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
    const rawFormData = {
        fullName: document.getElementById('fullName').value,
        email: emailInput.value,
        phone: phoneInput.value,
        lineId: document.getElementById('lineId').value,
        occupation: document.getElementById('occupation').value,
        age: document.getElementById('age').value,
        education: document.getElementById('education').value,
        educationOther: document.getElementById('educationOther').value,
        position: document.getElementById('position').value,
        company: document.getElementById('company').value,
        province: document.getElementById('province').value,
        district: document.getElementById('district').value,
        courses: coursesArray,
        sessions: sessionsArray
    };

    // Format and validate form data
    const formData = FormUtils?.formatFormData(rawFormData) || {
        ...rawFormData,
        email: rawFormData.email.trim().toLowerCase(),
        timestamp: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
    };

    // Validate required fields
    if (!formData.fullName) {
        FormUtils?.showNotification('กรุณากรอกชื่อ-นามสกุล', 'error');
        document.getElementById('fullName').focus();
        return;
    }

    if (!formData.email || !FormUtils?.validateEmail(formData.email)) {
        FormUtils?.showNotification('กรุณากรอกอีเมลให้ถูกต้อง', 'error');
        emailInput.focus();
        return;
    }

    if (!formData.phone || formData.phone.length !== 10) {
        FormUtils?.showNotification('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)', 'error');
        phoneInput.focus();
        return;
    }

    // Check email duplicate before submitting
    if (FormUtils && SHEET_CONFIG.scriptUrl) {
        try {
            setLoadingState(true);
            const isDuplicate = await FormUtils.checkEmailDuplicate(formData.email, SHEET_CONFIG.scriptUrl);
            
            if (isDuplicate) {
                setLoadingState(false);
                const proceed = confirm('อีเมลนี้เคยลงทะเบียนแล้ว คุณต้องการดำเนินการต่อหรือไม่?');
                if (!proceed) {
                    return;
                }
            }
        } catch (error) {
            console.warn('Email duplicate check failed:', error);
            // Continue with submission even if check fails
        }
    }

    // Disable submit button
    setLoadingState(true);

    try {
        // Submit to Google Sheets
        const result = await submitToGoogleSheets(formData);

        if (result.success) {
            // Show success modal with queue number
            showSuccessModal(result.queueNumber || '--');

            // Reset form
            form.reset();
            document.querySelectorAll('.course-option').forEach(option => option.classList.remove('selected'));
            
            FormUtils?.showNotification('ลงทะเบียนสำเร็จ!', 'success');
        } else {
            throw new Error(result.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
        }

    } catch (error) {
        console.error('Submit error:', error);
        const errorMessage = error.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง หรือติดต่อเจ้าหน้าที่';
        FormUtils?.showNotification(errorMessage, 'error');
    } finally {
        setLoadingState(false);
    }
});

// Submit to Google Sheets with improved error handling
async function submitToGoogleSheets(formData) {
    try {
        console.log('Sending data to Google Sheets:', formData);

        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG?.app?.timeout || 30000);

        // Send data to Google Apps Script
        const response = await fetch(SHEET_CONFIG.scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
            signal: controller.signal,
            mode: 'cors' // Changed from 'no-cors' to read response
        });

        clearTimeout(timeoutId);

        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Try to parse JSON response
        let result;
        try {
            result = await response.json();
        } catch (parseError) {
            // If response is not JSON, assume success (for Google Apps Script)
            console.warn('Response is not JSON, assuming success');
            result = {
                success: true,
                queueNumber: Math.floor(Date.now() / 1000) % 10000
            };
        }

        // Validate result
        if (result.success) {
            console.log('Data sent successfully, Queue Number:', result.queueNumber);
            return result;
        } else {
            throw new Error(result.message || 'การส่งข้อมูลไม่สำเร็จ');
        }

    } catch (error) {
        console.error('Submit error:', error);
        
        if (error.name === 'AbortError') {
            throw new Error('การส่งข้อมูลใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง');
        }
        
        throw new Error(error.message || 'ไม่สามารถส่งข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต');
    }
}

// Set loading state
function setLoadingState(loading) {
    if (submitBtn) {
        submitBtn.disabled = loading;
    }
    if (btnText) {
        btnText.style.display = loading ? 'none' : 'inline-block';
    }
    if (btnLoader) {
        btnLoader.style.display = loading ? 'inline-block' : 'none';
    }
}

// Show Success Modal
function showSuccessModal(queueNumber) {
    if (queueNumberSpan) {
        queueNumberSpan.textContent = queueNumber.toString().padStart(2, '0');
    }
    if (successModal) {
        successModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close Success Modal
function closeSuccessModal() {
    if (successModal) {
        successModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close modal when clicking overlay
document.querySelector('.modal-overlay')?.addEventListener('click', closeSuccessModal);

// Phone Number Formatting
if (phoneInput) {
    phoneInput.addEventListener('input', function (e) {
        const formatted = FormUtils?.formatPhoneNumber(e.target.value) || 
                         e.target.value.replace(/\D/g, '').slice(0, 10);
        e.target.value = formatted;
    });
}

// Email Validation with duplicate check
if (emailInput) {
    emailInput.addEventListener('blur', async function (e) {
        const email = e.target.value.trim();
        
        // Basic validation
        if (email && !FormUtils?.validateEmail(email)) {
            e.target.setCustomValidity('กรุณากรอกอีเมลให้ถูกต้อง');
            e.target.reportValidity();
            return;
        } else {
            e.target.setCustomValidity('');
        }

        // Check duplicate (debounced)
        if (email && FormUtils && SHEET_CONFIG.scriptUrl) {
            // Clear previous timeout
            if (emailCheckTimeout) {
                clearTimeout(emailCheckTimeout);
            }

            // Debounce the check
            emailCheckTimeout = setTimeout(async () => {
                if (isCheckingEmail) return;
                
                try {
                    isCheckingEmail = true;
                    const isDuplicate = await FormUtils.checkEmailDuplicate(email, SHEET_CONFIG.scriptUrl);
                    
                    if (isDuplicate) {
                        e.target.setCustomValidity('อีเมลนี้เคยลงทะเบียนแล้ว');
                        e.target.reportValidity();
                    } else {
                        e.target.setCustomValidity('');
                    }
                } catch (error) {
                    console.warn('Email check error:', error);
                    // Don't show error if check fails
                } finally {
                    isCheckingEmail = false;
                }
            }, 500); // Wait 500ms after user stops typing
        }
    });
}

// Initialize form on page load
document.addEventListener('DOMContentLoaded', function () {
    const provinceSelect = document.getElementById('province');
    const districtSelect = document.getElementById('district');
    const educationSelect = document.getElementById('education');
    const educationOther = document.getElementById('educationOther');

    // Populate provinces using utility function
    if (FormUtils && typeof thailandData !== 'undefined') {
        FormUtils.populateProvinces(provinceSelect, districtSelect);
    } else if (provinceSelect && typeof thailandData !== 'undefined') {
        // Fallback if FormUtils not available
        const provinces = Object.keys(thailandData).sort();
        provinceSelect.innerHTML = '<option value="">-- เลือกจังหวัด --</option>';
        provinces.forEach(province => {
            const option = document.createElement('option');
            option.value = province;
            option.textContent = province;
            provinceSelect.appendChild(option);
        });
    }

    // Handle education "other" field using utility function
    if (FormUtils) {
        FormUtils.handleEducationOther(educationSelect, educationOther);
    } else if (educationSelect && educationOther) {
        // Fallback if FormUtils not available
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

// Multiple Course Selection Handling
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
        if (anySelected && courseError) {
            FormUtils?.hideError(courseError) || (courseError.style.display = 'none');
        }
    });
});

console.log('✅ Registration form initialized!');
console.log('📊 Google Sheets URL:', SHEET_CONFIG.scriptUrl);
console.log('🌏 Province/District system ready');
console.log('📝 Multiple course selection enabled');
console.log('🔒 Using config.js for credentials');