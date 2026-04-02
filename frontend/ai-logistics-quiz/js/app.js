const questions = [
    {
        id: 1,
        question: "ข้อใดอธิบายความหมายของ Logistics ได้ถูกต้องที่สุด",
        options: [
            { text: "การวางแผนทั้งองค์กรให้ทำงานร่วมกัน", letter: "A" },
            { text: "การทำให้สินค้าถึงมือลูกค้าอย่างถูกเวลา", letter: "B" },
            { text: "การบริหารการเงินขององค์กร", letter: "C" },
            { text: "การทำการตลาดและการขายสินค้า", letter: "D" }
        ],
        answer: "B"
    },
    {
        id: 2,
        question: "Supply Chain แตกต่างจาก Logistics อย่างไร",
        options: [
            { text: "Logistics เน้นกลยุทธ / Supply Chain เน้นปฏิบัติการ", letter: "A" },
            { text: "Supply Chain เน้นทั้งระบบตั้งแต่วัตถุดิบถึงลูกค้า / Logistics เน้นการเคลื่อนย้ายและหน้างาน", letter: "B" },
            { text: "ทั้งสองอย่างคือเรื่องเดียวกัน", letter: "C" },
            { text: "Logistics สำคัญกว่า Supply Chain", letter: "D" }
        ],
        answer: "B"
    },
    {
        id: 3,
        question: "มิติสำคัญ 3 ด้านของงานโลจิสติกส์ที่ใช้วัดประสิทธิภาพ คือข้อใด",
        options: [
            { text: "People / Process / Technology", letter: "A" },
            { text: "Cost / Time / Reliability", letter: "B" },
            { text: "Marketing / Sales / Service", letter: "C" },
            { text: "Speed / Profit / Quality", letter: "D" }
        ],
        answer: "B"
    },
    {
        id: 4,
        question: "ปัญหาที่พบบ่อยในงานคลังสินค้า คือข้อใด",
        options: [
            { text: "การทำโฆษณาไม่ตรงกลุ่ม", letter: "A" },
            { text: "หาสินค้าไม่เจอ หยิบผิด สต็อกล้น", letter: "B" },
            { text: "ลูกค้าต่อรองราคา", letter: "C" },
            { text: "การขาดงบประมาณการตลาด", letter: "D" }
        ],
        answer: "B"
    },
    {
        id: 5,
        question: "แนวคิดสำคัญเกี่ยวกับ AI ที่ถูกต้อง คือข้อใด",
        options: [
            { text: "AI คิดแทนมนุษย์ได้ทุกอย่าง", letter: "A" },
            { text: "AI ทำงานได้ดีเพราะมีอารมณ์และประสบการณ์", letter: "B" },
            { text: "AI ทำงานตามข้อมูลและคำสั่งที่ได้รับ", letter: "C" },
            { text: "AI ไม่ต้องใช้ข้อมูลก็ทำงานได้", letter: "D" }
        ],
        answer: "C"
    },
    {
        id: 6,
        question: "เหตุใดจึงกล่าวว่า “AI กินข้อมูลเป็นอาหาร”",
        options: [
            { text: "เพราะ AI ต้องเชื่อมต่ออินเทอร์เน็ตตลอดเวลา", letter: "A" },
            { text: "เพราะ AI เรียนรู้และประมวลผลจากข้อมูลที่ป้อนเข้าไป", letter: "B" },
            { text: "เพราะ AI ต้องใช้ไฟฟ้ามาก", letter: "C" },
            { text: "เพราะ AI ต้องใช้คนดูแลตลอดเวลา", letter: "D" }
        ],
        answer: "B"
    },
    {
        id: 7,
        question: "LLM (Large Language Model) มีบทบาทกับงานโลจิสติกส์อย่างไร",
        options: [
            { text: "ใช้ขับรถขนส่งสินค้า", letter: "A" },
            { text: "ใช้ยกของในคลังสินค้า", letter: "B" },
            { text: "ใช้ประมวลผลภาษา เอกสาร และช่วยวิเคราะห์ข้อมูล", letter: "C" },
            { text: "ใช้แทนระบบบัญชีทั้งหมด", letter: "D" }
        ],
        answer: "C"
    },
    {
        id: 8,
        question: "ปัจจัยที่ทำให้การใช้ AI ได้ผลลัพธ์ดีหรือไม่ดี ขึ้นอยู่กับสิ่งใดมากที่สุด",
        options: [
            { text: "ความเร็วอินเทอร์เน็ต", letter: "A" },
            { text: "ยี่ห้อคอมพิวเตอร์", letter: "B" },
            { text: "วิธีการเขียน Prompt (คำสั่ง)", letter: "C" },
            { text: "จำนวนพนักงานในองค์กร", letter: "D" }
        ],
        answer: "C"
    },
    {
        id: 9,
        question: "เครื่องมือใดต่อไปนี้เป็น Generative AI ที่สามารถนำมาใช้ในงานโลจิสติกส์ได้",
        options: [
            { text: "Microsoft Excel เพียงอย่างเดียว", letter: "A" },
            { text: "เครื่องคิดเลข", letter: "B" },
            { text: "OpenAI (ChatGPT), Google (Gemini), Microsoft (Copilot), Anthropic (Claude)", letter: "C" },
            { text: "โปรแกรมดูหนัง", letter: "D" }
        ],
        answer: "C"
    },
    {
        id: 10,
        question: "วัตถุประสงค์สำคัญของการนำ AI มาใช้ในงานโลจิสติกส์ คือข้อใด",
        options: [
            { text: "เพื่อให้พนักงานทำงานน้อยลงอย่างเดียว", letter: "A" },
            { text: "เพื่อลดต้นทุน ลดเวลา ลดความผิดพลาด และเพิ่มประสิทธิภาพการทำงาน", letter: "B" },
            { text: "เพื่อแทนที่พนักงานทั้งหมด", letter: "C" },
            { text: "เพื่อความทันสมัยขององค์กรเท่านั้น", letter: "D" }
        ],
        answer: "B"
    }
];

let currentQuestions = [...questions];
let currentQuestionIndex = 0;
let userAnswers = {};
let score = 0;
let isSecondAttempt = false;

// Google Apps Script Web App URL (Placeholder - User must replace this)
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby8L8MOHxxBgV_X8hG208jcc0KNkaAfst1u5hWEEJklHX4Z4VHJm11g_XWbPC_JUGIwgw/exec';

function initQuiz() {
    renderQuestion();
    updateProgress();

    document.getElementById('next-btn').addEventListener('click', () => {
        if (currentQuestionIndex < currentQuestions.length - 1) {
            currentQuestionIndex++;
            renderQuestion();
            updateProgress();
        } else {
            showScoreModal();
        }
    });

    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion();
            updateProgress();
        }
    });

    document.getElementById('retry-btn').addEventListener('click', () => {
        isSecondAttempt = true;
        shuffleQuestions();
        currentQuestionIndex = 0;
        userAnswers = {};
        score = 0;
        closeScoreModal();
        renderQuestion();
        updateProgress();
        document.getElementById('score-display').textContent = `คะแนน: 0`;
    });

    document.getElementById('submit-btn').addEventListener('click', submitData);
}

function shuffleQuestions() {
    currentQuestions = [...questions].sort(() => Math.random() - 0.5);
}

function renderQuestion() {
    const q = currentQuestions[currentQuestionIndex];
    const container = document.getElementById('question-container');
    
    // Update navigation visibility
    document.getElementById('prev-btn').style.visibility = currentQuestionIndex === 0 ? 'hidden' : 'visible';
    document.getElementById('next-btn').textContent = currentQuestionIndex === currentQuestions.length - 1 ? 'ดูคะแนน' : 'ถัดไป';
    document.getElementById('question-number').textContent = `คำถามที่ ${currentQuestionIndex + 1}/${currentQuestions.length}`;

    let html = `
        <div class="question-text">${q.question}</div>
        <div class="options">
    `;

    q.options.forEach(opt => {
        const isSelected = userAnswers[q.id] === opt.letter;
        html += `
            <div class="option ${isSelected ? 'selected' : ''}" onclick="selectOption(${q.id}, '${opt.letter}')">
                ${opt.letter}) ${opt.text}
            </div>
        `;
    });

    html += `</div>`;
    container.innerHTML = html;
}

function selectOption(questionId, letter) {
    userAnswers[questionId] = letter;
    renderQuestion();
    calculateScore();
}

function calculateScore() {
    score = 0;
    currentQuestions.forEach(q => {
        if (userAnswers[q.id] === q.answer) {
            score++;
        }
    });
    document.getElementById('score-display').textContent = `คะแนน: ${score}`;
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
}

function showScoreModal() {
    document.getElementById('final-score').textContent = score;
    const modal = document.getElementById('score-modal');
    modal.classList.add('active');
}

function closeScoreModal() {
    document.getElementById('score-modal').classList.remove('active');
}

async function submitData() {
    const modal = document.getElementById('score-modal');
    const submitBtn = document.getElementById('submit-btn');
    const userInfo = JSON.parse(localStorage.getItem('user_info'));

    if (!userInfo) return;

    submitBtn.textContent = 'กำลังส่งข้อมูล...';
    submitBtn.disabled = true;

    const payload = {
        ...userInfo,
        score: score,
        isSecondAttempt: isSecondAttempt,
        timestamp: new Date().toISOString()
    };

    try {
        // Send to Google Sheets
        // Note: In a real scenario, SCRIPT_URL must be valid.
        // We'll use a fetch with no-cors or standard if configured in Apps Script.
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        // Redirect to thanks.html after submission
        window.location.href = 'thanks.html';
    } catch (error) {
        console.error('Error submitting data:', error);
        // Even if error, we might want to redirect if it was a CORS issue (no-cors succeeds but errors)
        window.location.href = 'thanks.html';
    }
}
