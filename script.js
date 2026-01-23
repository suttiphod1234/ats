// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');

        // Animate hamburger menu
        const spans = mobileMenuToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            // Close mobile menu if open
            navMenu.classList.remove('active');

            // Reset hamburger menu
            const spans = mobileMenuToggle?.querySelectorAll('span');
            if (spans) {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }

            // Smooth scroll to target
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Add fade-in class to elements and observe them
const animateElements = document.querySelectorAll('.track-card, .course-card, .feature-card');
animateElements.forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Search Functionality
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => {
        performSearch();
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
        alert('กรุณากรอกคำค้นหา');
        return;
    }

    // Simple search implementation - in production, this would connect to a backend
    const allCourses = document.querySelectorAll('.course-list li, .course-title');
    let found = false;

    allCourses.forEach(course => {
        if (course.textContent.toLowerCase().includes(query)) {
            found = true;
            // Highlight the course or scroll to it
            course.scrollIntoView({ behavior: 'smooth', block: 'center' });
            course.style.backgroundColor = 'rgba(20, 184, 166, 0.2)';

            setTimeout(() => {
                course.style.backgroundColor = '';
            }, 2000);
        }
    });

    if (!found) {
        alert(`ไม่พบหลักสูตรที่ตรงกับ "${query}"`);
    }
}

// Track Card Hover Effects - Show/Hide Course List
const trackCards = document.querySelectorAll('.track-card');

trackCards.forEach(card => {
    const courseList = card.querySelector('.course-list');

    if (courseList) {
        card.addEventListener('mouseenter', () => {
            const listHeight = courseList.scrollHeight;
            courseList.style.maxHeight = listHeight + 'px';
        });

        card.addEventListener('mouseleave', () => {
            courseList.style.maxHeight = '0';
        });
    }
});

// Button Click Handlers (Placeholder - would connect to actual functionality)
const allButtons = document.querySelectorAll('.btn-track, .btn-course, .btn-primary, .btn-secondary');

allButtons.forEach(button => {
    button.addEventListener('click', function (e) {
        // Prevent default for demo purposes
        const buttonText = this.textContent.trim();

        // Add click animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);

        // Log action (in production, this would navigate or open modals)
        console.log(`Button clicked: ${buttonText}`);

        // Show feedback for certain buttons
        if (buttonText.includes('เริ่มเรียน') || buttonText.includes('ลงทะเบียน')) {
            showNotification('กำลังเปิดหน้าลงทะเบียน...');
        } else if (buttonText.includes('ดูหลักสูตร')) {
            showNotification('กำลังโหลดหลักสูตร...');
        }
    });
});

// Notification System
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #14b8a6 0%, #10b981 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 1rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 600;
    `;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add notification animations to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Navbar Background on Scroll
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.9)';
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Chart Animation on Scroll
const chartBars = document.querySelectorAll('.chart-bar');
const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll('.chart-bar');
            bars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.transform = 'scaleY(1)';
                    bar.style.transformOrigin = 'bottom';
                }, index * 100);
            });
        }
    });
}, { threshold: 0.5 });

const chartPlaceholder = document.querySelector('.chart-placeholder');
if (chartPlaceholder) {
    // Initially hide bars
    chartBars.forEach(bar => {
        bar.style.transform = 'scaleY(0)';
        bar.style.transformOrigin = 'bottom';
        bar.style.transition = 'transform 0.5s ease';
    });

    chartObserver.observe(chartPlaceholder);
}

// Stats Counter Animation
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Animate stats when they come into view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber && !statNumber.dataset.animated) {
                const targetText = statNumber.textContent;
                const target = parseInt(targetText.replace(/\D/g, ''));

                if (!isNaN(target)) {
                    statNumber.dataset.animated = 'true';
                    animateCounter(statNumber, target);
                }
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// Log page load
console.log('LogiSkill Platform Loaded Successfully! 🚀');
console.log('Total Courses: 29');
console.log('Learning Tracks: 5');

// ===== MODAL POPUP FUNCTIONALITY =====

// Course Data for Modals
const courseData = {
    'ai-logistics': {
        badge: 'เปิดรับสมัคร',
        title: 'เปิดรับสมัครหลักสูตร AI FOR LOGISTICS',
        subtitle: 'การประยุกต์ใช้เทคโนโลยีปัญญาประดิษฐ์สำหรับงานโลจิสติกส์',
        description: 'หลักสูตรที่จะพาคุณเข้าสู่ยุคใหม่ของการบริหารจัดการโลจิสติกส์ด้วย AI และเทคโนโลยีล้ำสมัย เหมาะสำหรับผู้ที่ต้องการยกระดับทักษะและนำเทคนิคใหม่ๆ มาใช้ในองค์กร',
        info: {
            'รุ่นที่ 1': '14-15 และ 21-22 กุมภาพันธ์ 2569',
            'รุ่นที่ 2': '16-17 และ 23-24 กุมภาพันธ์ 2569',
            'เวลา': '08.30 - 17.00 น.',
            'จำนวนรับ': 'เพียง 20 คนเท่านั้น',
            'ค่าลงทะเบียน': 'ฟรี!',
            'สถานที่': 'สถาบันพัฒนาฝีมือแรงงาน 17 ระยอง',
            'โทร': '087 617 1121'
        },
        topics: [
            'การใช้เทคโนโลยี Prompt Engineering ด้วย Generative AI',
            'AI for Warehouse Management System',
            'AI for Transportation Management System',
            'AI for Procurement Management',
            'การวิเคราะห์ข้อมูลด้วย AI และ Machine Learning'
        ],
        highlights: [
            'ลงทะเบียนฟรี ไม่มีค่าใช้จ่าย',
            'รับวุฒิบัตรจากกรมพัฒนาฝีมือแรงงาน',
            'เรียนรู้จากผู้เชี่ยวชาญด้าน AI และโลจิสติกส์',
            'ได้ลงมือปฏิบัติจริง'
        ],
        requirements: [
            'สัญชาติไทย อายุ 18 ปีขึ้นไป',
            'มีประสบการณ์ด้านโลจิสติกส์หรือสนใจด้าน AI',
            'สามารถเข้าร่วมอบรมได้ครบทุกวัน',
            'ผู้ที่ต้องการนำ AI มาใช้ในการทำงาน'
        ]
    },
    'air-freight': {
        badge: 'เปิดรับสมัคร',
        title: 'อบรม Airfreight ฟรี!',
        subtitle: 'International Air Freight Management',
        description: 'หลักสูตรการจัดการขนส่งสินค้าทางอากาศระหว่างประเทศ ครอบคลุมทุกกระบวนการตั้งแต่การจัดการเอกสาร การคำนวณค่าระวาง ไปจนถึงกฎระเบียบสากล',
        info: {
            'วันอบรม': '12-13 และ 19-20 มีนาคม 2569',
            'เวลา': '08.30 - 17.00 น.',
            'จำนวนรับ': 'เพียง 20 คนเท่านั้น',
            'ค่าลงทะเบียน': 'ฟรี!',
            'สถานที่': 'สถาบันพัฒนาฝีมือแรงงาน 17 ระยอง',
            'โทร': '087 617 1121'
        },
        topics: [
            'เข้าใจระบบและสินค้าคำว่าการแพนน้อยคว่าพิ้น Air Freight Process & Operations',
            'จัดการเอกสาร Air Cargo และมาตรฐาน IATA (AWB)',
            'คำนวณอัตราค่าระวางได้ถูกต้อง (Freight Rate & Cost Calculation)',
            'รับมือสินค้าอันตราย (Dangerous Goods Regulation)',
            'การขนส่งสัตว์มีชีวิต (Live Animals) & Special Cargo',
            'ใช้ความรู้ในงานจริงได้ทันที'
        ],
        highlights: [
            'อบรมฟรี รับเพียง 20 คน สมัครก่อน มีสิทธิก่อน',
            'รับวุฒิบัตรจากกรมพัฒนาฝีมือแรงงาน 30 ชั่วโมง',
            'เหมาะสำหรับ: พนักงานโลจิสติกส์ / Freight Forwarder / งาน Import-Export / ผู้จัดการ Upskill / งาน Airfreight / อายุ 18 ปีขึ้นไป'
        ],
        requirements: [
            'สัญชาติไทย อายุ 18 ปีขึ้นไป',
            'ทำงานด้าน Freight Forwarder หรือ Import-Export',
            'ผู้ที่สนใจงาน Airfreight',
            'สามารถเข้าร่วมอบรมได้ครบทุกวัน'
        ]
    },
    'carbon-footprint': {
        badge: 'เปิดรับสมัคร',
        title: 'อบรม CFO ฟรี!',
        subtitle: 'Carbon Footprint for Organization',
        description: 'หลักสูตรมีรับรองโดยกรมพัฒนาฝีมือแรงงาน 30 ชั่วโมง เรียนรู้การคำนวณและจัดการ Carbon Footprint ขององค์กร เพื่อความยั่งยืนและตอบสนองมาตรฐานสากล',
        info: {
            'วันอบรม': '12-13 และ 19-20 กุมภาพันธ์ 2569',
            'เวลา': '08.30 - 17.00 น.',
            'จำนวนรับ': 'เพียง 20 คนเท่านั้น',
            'ค่าลงทะเบียน': 'ฟรี!',
            'สถานที่': 'สถาบันพัฒนาฝีมือแรงงาน 17 ระยอง',
            'โทร': '087 617 1121'
        },
        topics: [
            'เข้าใจหลักการ CFO & แนวโน้มการบอนโลก (Global Carbon Trends)',
            'คำนวณการปล่อยก๊าซเรือนกระจก (Scope 1, 2, 3 Calculation)',
            'จัดทำรายงาน Carbon Footprint ตามมาตรฐาน CFO',
            'การใช้เครื่องมือคำนวณและฐานข้อมูล (Tools & Database)',
            'กลยุทธ์การลดและชดเชยคาร์บอน (Reduction & Offset Strategies)',
            'เตรียมความพร้อมสำหรับการทวนสอบ (Verification Readiness)'
        ],
        highlights: [
            'อบรมฟรี รับเพียง 20 คน',
            'รับวุฒิบัตรจากกรมพัฒนาฝีมือแรงงาน',
            'เหมาะสำหรับ: ผู้รับผิดชอบด้านสิ่งแวดล้อม / ทีมงาน CSR / ISO 14001 / องค์กรที่มุ่งสู่ Net Zero'
        ],
        requirements: [
            'สัญชาติไทย อายุ 18 ปีขึ้นไป',
            'ทำงานด้านสิ่งแวดล้อม หรือ CSR',
            'องค์กรที่ต้องการรับรอง ISO 14001',
            'สามารถเข้าร่วมอบรมได้ครบทุกวัน'
        ]
    }
};

// Modal Elements
const modal = document.getElementById('courseModal');
const modalBody = document.querySelector('.modal-body');
const modalClose = document.querySelector('.modal-close');
const modalOverlay = document.querySelector('.modal-overlay');

// Open Modal Function
function openModal(courseId) {
    const course = courseData[courseId];
    if (!course) return;

    // Generate modal content
    const modalContent = `
        <div class="modal-header">
            <div class="modal-badge">${course.badge}</div>
            <h2 class="modal-title">${course.title}</h2>
            <p class="modal-subtitle">${course.subtitle}</p>
            <p style="color: var(--text-gray); line-height: 1.8;">${course.description}</p>
        </div>

        <div class="modal-section">
            <h3>📋 ข้อมูลการอบรม</h3>
            <div class="modal-info-grid">
                ${Object.entries(course.info).map(([label, value]) => `
                    <div class="modal-info-item">
                        <div class="modal-info-label">${label}</div>
                        <div class="modal-info-value">${value}</div>
                    </div>
                `).join('')}
            </div>
        </div>

        <div class="modal-section">
            <h3>📚 ทำไงต้องเรียน & เนื้อหาหลัก (Highlight)</h3>
            <ul class="modal-list">
                ${course.topics.map(topic => `<li>${topic}</li>`).join('')}
            </ul>
        </div>

        <div class="modal-highlight">
            <h4>🎁 สิทธิพิเศษ</h4>
            <ul class="modal-list">
                ${course.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
            </ul>
        </div>

        <div class="modal-section">
            <h3>✅ คุณสมบัติผู้เข้าอบรม</h3>
            <ul class="modal-list">
                ${course.requirements.map(req => `<li>${req}</li>`).join('')}
            </ul>
        </div>

        <div class="modal-actions">
            <button class="btn-modal-register" onclick="registerNow('${courseId}')">
                ลงทะเบียนตอนนี้
            </button>
            <button class="btn-modal-close" onclick="closeModal()">
                ปิด
            </button>
        </div>
    `;

    modalBody.innerHTML = modalContent;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
}

// Close Modal Function
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
}

// Register Now Function
function registerNow(courseId) {
    // Redirect to appropriate registration page based on course
    if (courseId === 'ai-logistics') {
        window.location.href = 'ai-logistics-form.html';
    } else {
        window.location.href = 'register.html';
    }
}
}

// Event Listeners for Registration Cards
document.querySelectorAll('.registration-card').forEach(card => {
    card.addEventListener('click', function (e) {
        // Don't open if clicking the button directly
        if (e.target.classList.contains('btn-register')) return;

        const courseId = this.dataset.course;
        openModal(courseId);
    });
});

// Event Listeners for Registration Buttons
document.querySelectorAll('.btn-register').forEach(button => {
    button.addEventListener('click', function (e) {
        e.stopPropagation(); // Prevent card click
        const courseId = this.dataset.course;
        openModal(courseId);
    });
});

// Close modal when clicking X button
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

// Close modal when clicking overlay
if (modalOverlay) {
    modalOverlay.addEventListener('click', closeModal);
}

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Add fade-in animation to registration cards
const registrationCards = document.querySelectorAll('.registration-card');
registrationCards.forEach(card => {
    card.classList.add('fade-in');
    observer.observe(card);
});

console.log('Modal system initialized! 🎉');

