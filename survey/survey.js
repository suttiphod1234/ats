document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('surveyForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const careerSelect = document.getElementById('career');
    const careerOtherGroup = document.getElementById('careerOtherGroup');
    const careerOtherInput = document.getElementById('careerOther');

    // Show/Hide "Other" career input
    careerSelect.addEventListener('change', () => {
        if (careerSelect.value === 'Other') {
            careerOtherGroup.style.display = 'block';
            careerOtherInput.required = true;
        } else {
            careerOtherGroup.style.display = 'none';
            careerOtherInput.required = false;
        }
    });

    // Form Submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Basic Validation
        const mediaChecked = form.querySelectorAll('input[name="media"]:checked').length > 0;
        if (!mediaChecked) {
            alert('กรุณาเลือกช่องทางที่รู้จักเราอย่างน้อย 1 ช่องทาง');
            return;
        }

        // Set Loading State
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';

        try {
            const formData = new FormData(form);

            // Get Checkbox Values
            const media = Array.from(form.querySelectorAll('input[name="media"]:checked'))
                .map(cb => cb.value)
                .join(', ');

            const payload = {
                sheetName: CONFIG.sheets["survey"].sheetName,
                media: media,
                career: formData.get('career'),
                careerOther: formData.get('careerOther'),
                format: formData.get('format'),
                convenientTime: formData.get('convenientTime'),
                suggestions: formData.get('suggestions'),
                timestamp: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
            };

            const response = await fetch(CONFIG.sheets["survey"].scriptUrl, {
                method: 'POST',
                mode: 'no-cors', // standard for Apps Script
                cache: 'no-cache',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            // Show Success Modal
            document.getElementById('successModal').classList.add('active');
            form.reset();
            careerOtherGroup.style.display = 'none';

        } catch (error) {
            console.error('Error:', error);
            alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
        } finally {
            submitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
        }
    });

    // Close modal on outside click (optional, basic modal behavior)
    document.querySelector('.modal-overlay').addEventListener('click', () => {
        document.getElementById('successModal').classList.remove('active');
    });
});
