document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('onlineBookingForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const checkboxes = form.querySelectorAll('input[name="courses"]');
    const courseError = document.getElementById('courseError');

    // Handle course selection validation
    function validateCourses() {
        const checked = Array.from(checkboxes).some(cb => cb.checked);
        if (!checked) {
            courseError.style.display = 'block';
            checkboxes[0].setCustomValidity('กรุณาเลือกอย่างน้อย 1 หลักสูตร');
        } else {
            courseError.style.display = 'none';
            checkboxes[0].setCustomValidity('');
        }
        return checked;
    }

    checkboxes.forEach(cb => {
        cb.addEventListener('change', validateCourses);
    });

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!validateCourses()) return;

        // Set Loading State
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';

        try {
            const formData = new FormData(form);
            const courses = Array.from(checkboxes)
                .filter(cb => cb.checked)
                .map(cb => cb.value)
                .join(', ');

            const payload = {
                sheetName: CONFIG.sheets["online-courses"].sheetName,
                fullName: formData.get('fullName'),
                phone: formData.get('phone'),
                email: formData.get('email'),
                lineId: formData.get('lineId'),
                occupation: formData.get('occupation'),
                interest: formData.get('interest'),
                courses: courses,
                timestamp: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
            };

            const response = await fetch(CONFIG.sheets["online-courses"].scriptUrl, {
                method: 'POST',
                mode: 'no-cors', // standard for Apps Script
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // Show Success Modal
            document.getElementById('summaryName').textContent = payload.fullName;
            document.getElementById('summaryCourses').textContent = payload.courses;
            document.getElementById('successModal').classList.add('active');

            form.reset();

            // Redirect to LINE OA after a short delay
            setTimeout(() => {
                if (document.getElementById('successModal').classList.contains('active')) {
                    window.location.href = CONFIG.app.lineOa;
                }
            }, 3000);

        } catch (error) {
            console.error('Error:', error);
            alert('เกิดข้อผิดพลาดคในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
        } finally {
            submitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
        }
    });
});
