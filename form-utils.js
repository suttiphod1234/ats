/**
 * Form Utility Functions
 * Shared functions for form handling across registration forms
 */

// Phone Number Formatting
function formatPhoneNumber(value) {
    // Remove all non-digit characters
    let cleaned = value.replace(/\D/g, '');

    // Limit to 10 digits
    if (cleaned.length > 10) {
        cleaned = cleaned.slice(0, 10);
    }

    return cleaned;
}

// Email Validation
function validateEmail(email) {
    if (!email || typeof email !== 'string') {
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

// Check Email Duplicate
async function checkEmailDuplicate(email, scriptUrl, sheetName = '') {
    if (!email || !scriptUrl) {
        return false;
    }

    try {
        let checkUrl = `${scriptUrl}?action=checkEmail&email=${encodeURIComponent(email)}`;
        if (sheetName) {
            checkUrl += `&sheetName=${encodeURIComponent(sheetName)}`;
        }

        const response = await fetch(checkUrl, {
            method: 'GET',
            mode: 'cors'
        });

        if (!response.ok) {
            console.warn('Email check failed:', response.status);
            return false; // Assume not duplicate if check fails
        }

        const result = await response.json();
        return result.exists === true;

    } catch (error) {
        console.error('Error checking email duplicate:', error);
        return false; // Assume not duplicate if check fails
    }
}

// Province/District Population
function populateProvinces(provinceSelect, districtSelect) {
    if (!provinceSelect || typeof thailandData === 'undefined') {
        return;
    }

    const provinces = Object.keys(thailandData).sort();
    provinceSelect.innerHTML = '<option value="">-- เลือกจังหวัด --</option>';

    provinces.forEach(province => {
        const option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        provinceSelect.appendChild(option);
    });

    // Handle province change
    if (districtSelect) {
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
}

// Education "Other" Field Handling
function handleEducationOther(educationSelect, educationOtherInput) {
    if (!educationSelect || !educationOtherInput) {
        return;
    }

    educationSelect.addEventListener('change', function () {
        if (this.value === 'อื่นๆ') {
            educationOtherInput.style.display = 'block';
            educationOtherInput.required = true;
        } else {
            educationOtherInput.style.display = 'none';
            educationOtherInput.required = false;
            educationOtherInput.value = '';
        }
    });
}

// Show Error Message
function showError(element, message) {
    if (!element) return;

    element.textContent = message;
    element.style.display = 'block';
    element.classList.add('error-visible');

    // Scroll to error
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Hide Error Message
function hideError(element) {
    if (!element) return;

    element.style.display = 'none';
    element.classList.remove('error-visible');
}

// Show Success Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    const styles = {
        position: 'fixed',
        top: '100px',
        right: '20px',
        background: type === 'success'
            ? 'linear-gradient(135deg, #14b8a6 0%, #10b981 100%)'
            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '1rem',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        animation: 'slideIn 0.3s ease',
        fontWeight: '600',
        maxWidth: '400px',
        wordWrap: 'break-word'
    };

    Object.assign(notification.style, styles);
    document.body.appendChild(notification);

    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

// Validate Form Field
function validateField(field, rules) {
    const value = field.value.trim();
    const errors = [];

    if (rules.required && !value) {
        errors.push('กรุณากรอกข้อมูลในช่องนี้');
        return { valid: false, errors };
    }

    if (rules.email && !validateEmail(value)) {
        errors.push('กรุณากรอกอีเมลให้ถูกต้อง');
    }

    if (rules.phone && CONFIG && CONFIG.validation.phone) {
        const phonePattern = CONFIG.validation.phone.pattern;
        if (!phonePattern.test(value)) {
            errors.push('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก)');
        }
    }

    if (rules.minLength && value.length < rules.minLength) {
        errors.push(`กรุณากรอกอย่างน้อย ${rules.minLength} ตัวอักษร`);
    }

    if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`กรุณากรอกไม่เกิน ${rules.maxLength} ตัวอักษร`);
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

// Format Form Data
function formatFormData(formData) {
    return {
        ...formData,
        email: formData.email ? formData.email.trim().toLowerCase() : '',
        fullName: formData.fullName ? formData.fullName.trim() : '',
        phone: formData.phone ? formatPhoneNumber(formData.phone) : '',
        timestamp: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
    };
}

// Standardized Form Submission
async function submitForm(formData, scriptUrl, options = {}) {
    const {
        onSuccess,
        onError,
        beforeSubmit,
        afterSubmit
    } = options;

    if (beforeSubmit) beforeSubmit();

    try {
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG?.app?.timeout || 30000);

        const response = await fetch(scriptUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            },
            body: JSON.stringify(formData),
            signal: controller.signal,
            mode: 'cors'
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let result;
        try {
            result = await response.json();
        } catch (parseError) {
            console.warn('Response is not JSON, assuming success');
            result = {
                success: true,
                queueNumber: Math.floor(Date.now() / 1000) % 10000
            };
        }

        if (result.success) {
            if (onSuccess) onSuccess(result);
            return result;
        } else {
            throw new Error(result.message || 'การส่งข้อมูลไม่สำเร็จ');
        }

    } catch (error) {
        console.error('Submit error:', error);
        let errorMessage = error.message;

        if (error.name === 'AbortError') {
            errorMessage = 'การส่งข้อมูลใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง';
        } else if (!navigator.onLine) {
            errorMessage = 'ไม่สามารถส่งข้อมูลได้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ต';
        } else if (errorMessage === 'Failed to fetch') {
            errorMessage = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง';
        }

        if (onError) onError(errorMessage);
        throw error;
    } finally {
        if (afterSubmit) afterSubmit();
    }
}

// Export functions for use in other files
if (typeof window !== 'undefined') {
    window.FormUtils = {
        formatPhoneNumber,
        validateEmail,
        checkEmailDuplicate,
        populateProvinces,
        handleEducationOther,
        showError,
        hideError,
        showNotification,
        validateField,
        formatFormData,
        submitForm
    };
}


