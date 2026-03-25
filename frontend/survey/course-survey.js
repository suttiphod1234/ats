/**
 * Course Survey Logic - Categorical Filtering & Submission
 */

// Course Data Mapping
const COURSE_MAPPING = {
    "Warehouse & Inventory Master": [
        "การจัดการคลังสินค้ายุคใหม่อย่างมีประสิทธิภาพ",
        "เทคนิคการจัดการคลังสินค้า (ระดับสูง)",
        "การจัดซื้อและบริหารสินค้าคงคลัง",
        "การจัดการสินค้าคงคลัง (การบริหารการสั่งซื้อ)",
        "การจัดการวัตถุดิบและสินค้าคงคลัง",
        "การใช้โปรแกรม Microsoft Excel ในการบริหารสินค้าคงคลัง",
        "การจัดทำระบบคลังสินค้า",
        "ผู้ควบคุมสินค้าคงคลัง ระดับ 1",
        "ผู้ปฏิบัติการคลังสินค้า ระดับ 1"
    ],
    "Transportation & Distribution Pro": [
        "การบริหารจัดการงานขนส่งสินค้า",
        "นักบริหารงานขนส่งสินค้า ระดับ 1",
        "เทคนิคการวางแผนและบริหารงานขนส่งสินค้าทางถนน (ระดับพื้นฐาน)",
        "การจัดการการขนส่งสินค้าระหว่างประเทศทางอากาศ",
        "การปฏิบัติการขนส่งสินค้าทางอากาศ",
        "พนักงานขนส่งสินค้าผ่านแดนและข้ามแดน ระดับ 1",
        "การให้บริการภาคพื้น Check in (สำหรับงานขนส่งทางอากาศ)"
    ],
    "Supply Chain & Purchasing Strategy": [
        "การบริหารจัดการระบบโลจิสติกส์และห่วงโซ่อุปทาน",
        "การจัดการโลจิสติกส์และซัพพลายเชน",
        "การบริหารจัดการโลจิสติกส์ภาคการเกษตร",
        "พนักงานจัดซื้อจัดหา ระดับ 1",
        "ตัวแทนออกของเพื่อการส่งออกและนำเข้า",
        "พนักงานนำเข้าและส่งออก ระดับ 1"
    ],
    "Future Logistics Technology": [
        "การวิเคราะห์ระบบ GPS ในงานขนส่งสินค้า",
        "การประยุกต์ใช้ระบบ RFID ควบคุมการเคลื่อนย้ายสินค้า",
        "การประยุกต์ใช้เทคโนโลยีปัญญาประดิษฐ์ (AI) สำหรับงานโลจิสติกส์",
        "การพัฒนาองค์กรสู่ความเป็นกลางทางคาร์บอนเพื่อความยั่งยืนในอุตสาหกรรมโลจิสติกส์"
    ],
    "People Management in Logistics": [
        "พนักงานบริหารงานโลจิสติกส์ ระดับ 1",
        "การสอนงานด้านโลจิสติกส์ (ระดับพื้นฐาน)",
        "เทคนิคการสอนงานด้านโลจิสติกส์ (ระดับสูง)"
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('category');
    const courseSelect = document.getElementById('course');
    const surveyForm = document.getElementById('courseSurveyForm');
    const submitBtn = document.getElementById('submitBtn');
    const successModal = document.getElementById('successModal');

    // 1. Dynamic Filtering Logic
    categorySelect.addEventListener('change', () => {
        const selectedCategory = categorySelect.value;
        courseSelect.innerHTML = '<option value="">--- เลือกรายวิชาที่คุณสนใจ ---</option>';
        
        if (selectedCategory && COURSE_MAPPING[selectedCategory]) {
            courseSelect.disabled = false;
            COURSE_MAPPING[selectedCategory].forEach(course => {
                const option = document.createElement('option');
                option.value = course;
                option.textContent = course;
                courseSelect.appendChild(option);
            });
        } else {
            courseSelect.disabled = true;
            courseSelect.innerHTML = '<option value="">--- กรุณาเลือกหมวดหมู่ก่อน ---</option>';
        }
    });

    // 2. Form Submission
    surveyForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').style.display = 'none';
        submitBtn.querySelector('.btn-loader').style.display = 'inline';

        const formData = new FormData(surveyForm);
        const data = Object.fromEntries(formData.entries());
        data.action = 'courseSurvey';

        try {
            const scriptUrl = CONFIG.sheets.general.scriptUrl;
            const response = await fetch(scriptUrl, {
                method: 'POST',
                mode: 'no-cors', // standard for GAS
                cache: 'no-cache',
                body: JSON.stringify(data)
            });

            // Since no-cors doesn't give us the body, we'll try a GET to get the actual sequence if needed,
            // or just assume success if it doesn't error out.
            // But for sequence, we'll suggest a small delay and redirect to success modal.
            
            // To get actual sequence, we use a separate fetch with action=getRegistrationCount or similar
            // or we use the 'courseSurvey' action with regular cors (requires GAS headers fix)
            
            // Let's assume the user wants the real sequence, so we'll do a quick fetch
            const seqResponse = await fetch(`${scriptUrl}?action=getRegistrationCount&sheetName=course-survey`);
            const seqResult = await seqResponse.json();
            const sequence = seqResult.count || '?';

            // Show Success Modal
            document.getElementById('summarySeq').textContent = `#${sequence}`;
            document.getElementById('summaryName').textContent = data.fullName;
            document.getElementById('summaryCourse').textContent = data.course;
            
            successModal.classList.add('active');
            surveyForm.reset();

        } catch (error) {
            console.error('Survey Error:', error);
            alert('ขออภัย เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
        } finally {
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').style.display = 'inline';
            submitBtn.querySelector('.btn-loader').style.display = 'none';
        }
    });
});
