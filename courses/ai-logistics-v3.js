const questions = [
    { q: "โลจิสติกส์ (Logistics) หมายถึงอะไร", options: ["การผลิตสินค้า", "การจัดการการไหลของสินค้าและข้อมูล", "การขายสินค้า", "การตลาดออนไลน์"], ans: 1 },
    { q: "ข้อใดเป็นองค์ประกอบหลักของงานโลจิสติกส์", options: ["การจัดซื้อ การขนส่ง การจัดเก็บ", "การโฆษณา การขาย การบริการลูกค้า", "การผลิต การออกแบบ การวิจัย", "การบัญชี การเงิน การลงทุน"], ans: 0 },
    { q: "ปัญญาประดิษฐ์ (AI) คืออะไร", options: ["เครื่องจักรที่ทำงานด้วยไฟฟ้า", "โปรแกรมที่สามารถเรียนรู้และตัดสินใจได้", "ซอฟต์แวร์สำหรับพิมพ์งาน", "ระบบอินเทอร์เน็ต"], ans: 1 },
    { q: "AI สามารถช่วยงานโลจิสติกส์ด้านใดได้มากที่สุด", options: ["การออกแบบสินค้า", "การพยากรณ์ความต้องการสินค้า", "การตกแต่งร้านค้า", "การประชาสัมพันธ์"], ans: 1 },
    { q: "ข้อใดเป็นตัวอย่างของการใช้ AI ในคลังสินค้า", options: ["การใช้แรงงานคนยกของ", "การใช้หุ่นยนต์จัดเก็บสินค้า", "การเขียนรายงานด้วยมือ", "การโทรศัพท์สั่งสินค้า"], ans: 1 },
    { q: "Machine Learning คืออะไร", options: ["การซ่อมเครื่องจักร", "การเรียนรู้ของเครื่องจากข้อมูล", "การเขียนโปรแกรมคอมพิวเตอร์", "การออกแบบเว็บไซต์"], ans: 1 },
    { q: "ข้อมูล (Data) มีความสำคัญต่อ AI อย่างไร", options: ["ไม่สำคัญ", "ใช้เพียงเล็กน้อย", "เป็นพื้นฐานในการเรียนรู้และวิเคราะห์", "ใช้เฉพาะงานบัญชี"], ans: 2 },
    { q: "ระบบติดตามสินค้าแบบเรียลไทม์ช่วยในด้านใด", options: ["เพิ่มต้นทุน", "ลดความโปร่งใส", "เพิ่มความแม่นยำในการจัดส่ง", "ลดจำนวนลูกค้า"], ans: 2 },
    { q: "ข้อใดเป็นประโยชน์ของ AI ในการวางแผนเส้นทางขนส่ง", options: ["ใช้เวลาเพิ่มขึ้น", "ลดประสิทธิภาพ", "ลดต้นทุนและเวลา", "ทำให้ระบบซับซ้อนขึ้นเท่านั้น"], ans: 2 },
    { q: "ความท้าทายของการนำ AI มาใช้ในโลจิสติกส์คืออะไร", options: ["ไม่มีข้อมูลเพียงพอ", "ต้นทุนการลงทุนสูง", "ต้องใช้บุคลากรที่มีความรู้", "ถูกทุกข้อ"], ans: 3 }
];

document.addEventListener('DOMContentLoaded', () => {
    renderQuiz();
    const form = document.getElementById('reg-form');
    form.addEventListener('submit', handleSubmit);
});

function renderQuiz() {
    const container = document.getElementById('quiz-container');
    questions.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'quiz-item';
        div.innerHTML = `
            <div class="quiz-question">ข้อที่ ${index + 1}: ${item.q}</div>
            <div class="options-group">
                ${item.options.map((opt, optIndex) => `
                    <label class="option-label">
                        <input type="radio" name="q${index}" value="${optIndex}" required>
                        ${String.fromCharCode(65 + optIndex)}. ${opt}
                    </label>
                `).join('')}
            </div>
        `;
        container.appendChild(div);
    });
}

function nextStep(step) {
    // Basic validation for step 1
    if (step === 2) {
        const required = ['fullName', 'email', 'phone', 'age', 'education', 'position'];
        for (let id of required) {
            if (!document.getElementById(id).value) {
                alert('กรุณากรอกข้อมูลให้ครบถ้วน');
                return;
            }
        }
    }

    document.querySelectorAll('.step-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    
    document.getElementById(`step-${step}`).classList.add('active');
    document.getElementById(`step-dot-${step}`).classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function handleSubmit(e) {
    e.preventDefault();
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'กำลังส่งข้อมูล...';

    // Calculate Score
    let score = 0;
    questions.forEach((item, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (selected && parseInt(selected.value) === item.ans) {
            score++;
        }
    });

    const formData = {
        action: 'registerCourse',
        sheetName: CONFIG.sheets["ai-logistics-v3"].sheetName,
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        age: document.getElementById('age').value,
        education: document.getElementById('education').value,
        position: document.getElementById('position').value,
        course: "การประยุกต์ใช้เทคโนโลยีปัญญาประดิษฐ์สำหรับงานโลจิสติกส์",
        score: score,
        maxScore: questions.length
    };

    try {
        const response = await fetch(CONFIG.sheets["ai-logistics-v3"].scriptUrl, {
            method: 'POST',
            mode: 'no-cors', // Apps Script limit
            body: JSON.stringify(formData)
        });

        // Since no-cors, we need to fetch the sequence/result manually or wait
        // In a real scenario, we'd use a GET to verify registration or have a better API.
        // For this demo, let's assume we need to show results. We'll add a helper to fetch rank.
        
        await showResult(formData.fullName, score, formData.email, formData.sheetName, formData.action);

    } catch (error) {
        console.error('Submission error:', error);
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
        submitBtn.disabled = false;
        submitBtn.textContent = 'ส่งข้อมูลลงทะเบียน';
    }
}

async function showResult(name, score, email, sheetName, action) {
    // 1. Determine Level
    let level = "";
    if (score >= 10) level = "ดีมาก มีความรู้พื้นฐานดี สามารถเรียนเนื้อหาเชิงลึกได้";
    else if (score >= 9) level = "มีความเข้าใจค่อนข้างดี พร้อมต่อยอด";
    else if (score >= 7) level = "มีความเข้าใจเบื้องต้น แต่ยังต้องพัฒนา";
    else level = "ควรทบทวนเนื้อหาพื้นฐานและสอบใหม่ (สอบใหม่)";

    // 2. Fetch Rank (Number of rows in sheet)
    let rank = "?";
    try {
        const checkUrl = `${CONFIG.sheets["ai-logistics-v3"].scriptUrl}?action=getRegistrationCount&sheetName=${encodeURIComponent(sheetName)}`;
        const res = await fetch(checkUrl);
        const data = await res.json();
        rank = data.count || rank;
    } catch (e) { console.error(e); }

    // Update UI
    document.getElementById('result-name').textContent = `คุณ ${name}`;
    const statusIdx = document.getElementById('reg-status');
    const msg = document.getElementById('reg-msg');
    
    statusIdx.textContent = `ลำดับที่ ${rank}`;
    if (rank <= 20) {
        statusIdx.className = 'status-badge status-confirmed';
        msg.textContent = 'ยืนยันสิทธิ์เรียบร้อย (กรุณารอรับอีเมล)';
    } else {
        statusIdx.className = 'status-badge status-backup';
        statusIdx.textContent = `ลำดับที่ ${rank} (ตัวสำรอง)`;
        msg.textContent = 'ลำดับของคุณเต็มแล้ว อยู่ในรายชื่อตัวสำรอง';
    }

    document.getElementById('result-score').textContent = score;
    document.getElementById('result-level').textContent = level;
    document.getElementById('result-overlay').style.display = 'flex';
}
