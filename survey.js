/**
 * Survey Form Handler
 */

const SURVEY_CONFIG = CONFIG?.sheets?.survey || {
    scriptUrl: ''
};

document.getElementById('surveyForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');
    const submitError = document.getElementById('submitError');

    // Reset error
    submitError.style.display = 'none';
    submitError.textContent = '';

    // Collect Data
    const formData = new FormData(this);
    const data = {
        sheetName: 'survey', // Tells backend to use survey sheet
        media: formData.getAll('media'),
        career: formData.getAll('career').filter(v => v !== 'อื่นๆ').join(', '), // Join careers
        careerOther: document.getElementById('careerOther').value,
        format: formData.get('format'),
        formatOther: document.getElementById('formatOther').value,
        convenientTime: formData.get('convenientTime'),
        suggestions: formData.get('suggestions')
    };

    // Validation (Simple)
    if (data.media.length === 0) {
        alert('กรุณาเลือกช่องทางที่ได้รับสื่ออย่างน้อย 1 ช่องทาง');
        return;
    }
    if (!data.career && !data.careerOther) {
        alert('กรุณาเลือกสายอาชีพที่สนใจ');
        return;
    }
    if (!data.format && !data.formatOther) {
        alert('กรุณาเลือกรูปแบบการอบรม');
        return;
    }

    // Loading State
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';

    try {
        const response = await fetch(SURVEY_CONFIG.scriptUrl, {
            method: 'POST',
            body: JSON.stringify(data),
            mode: 'cors',
            headers: {
                // Use text/plain to avoid CORS preflight complexity
                'Content-Type': 'text/plain;charset=utf-8'
            }
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const result = await response.json();

        if (result.success) {
            // Show Success Modal
            document.getElementById('successModal').classList.add('active');
            this.reset();
        } else {
            throw new Error(result.message || 'Unknown error');
        }

    } catch (error) {
        console.error('Error:', error);
        submitError.textContent = 'เกิดข้อผิดพลาดในการส่งข้อมูล: ' + error.message;
        submitError.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        btnText.style.display = 'inline-block';
        btnLoader.style.display = 'none';
    }
});
