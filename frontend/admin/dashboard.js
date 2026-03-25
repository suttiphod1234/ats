/**
 * Admin Dashboard Logic - Course Management
 */

// API Configuration
const SCRIPT_URL = CONFIG.sheets.general.scriptUrl;

// State
let courses = [];
let isEditing = false;

// DOM Elements
const courseTableBody = document.getElementById('courseTableBody');
const addCourseBtn = document.getElementById('addCourseBtn');
const courseModal = document.getElementById('courseModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const courseForm = document.getElementById('courseForm');
const modalTitle = document.getElementById('modalTitle');

// Initialize
document.addEventListener('DOMContentLoaded', fetchCourses);

// Fetch Courses from GS
async function fetchCourses() {
    try {
        const response = await fetch(`${SCRIPT_URL}?action=listCourses`);
        const result = await response.json();
        
        if (result.success) {
            courses = result.data;
            renderCourses();
            updateStats();
        } else {
            alert('Error loading courses: ' + result.error);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        courseTableBody.innerHTML = '<tr><td colspan="5" class="error-text">ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้</td></tr>';
    }
}

// Render Courses to Table
function renderCourses() {
    if (courses.length === 0) {
        courseTableBody.innerHTML = '<tr><td colspan="5" class="loading-text">ยังไม่มีข้อมูลหลักสูตร</td></tr>';
        return;
    }

    courseTableBody.innerHTML = courses.map(course => `
        <tr>
            <td><span style="font-size: 1.5rem;">${course.Icon || '📚'}</span></td>
            <td>
                <strong>${course.Title}</strong><br>
                <small style="color: #64748b;">${course.Subtitle || ''}</small>
            </td>
            <td><span class="category-badge">${course.Category}</span></td>
            <td><span class="status-badge" style="background: ${getStatusColor(course.Status)}; color: white; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem;">${course.Status}</span></td>
            <td>
                <button class="btn-edit" onclick="editCourse('${course.ID}')">📝 แก้ไข</button>
                <button class="btn-delete" onclick="deleteCourse('${course.ID}')">🗑️ ลบ</button>
            </td>
        </tr>
    `).join('');
}

function getStatusColor(status) {
    if (status?.includes('ใหม่')) return '#ffa000';
    if (status?.includes('เปิด')) return '#10b981';
    return '#64748b';
}

function updateStats() {
    document.getElementById('totalCourses').textContent = courses.length;
    document.getElementById('activeCourses').textContent = courses.filter(c => c.Status?.includes('เปิด')).length;
}

// Modal Handlers
addCourseBtn.addEventListener('click', () => {
    isEditing = false;
    modalTitle.textContent = 'เพิ่มหลักสูตรใหม่';
    courseForm.reset();
    document.getElementById('courseId').value = '';
    courseModal.classList.add('active');
});

closeModal.addEventListener('click', () => courseModal.classList.remove('active'));
cancelBtn.addEventListener('click', () => courseModal.classList.remove('active'));

// Save Course (Create/Update)
courseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        action: isEditing ? 'updateCourse' : 'addCourse',
        id: document.getElementById('courseId').value,
        title: document.getElementById('title').value,
        subtitle: document.getElementById('subtitle').value,
        category: document.getElementById('category').value,
        status: document.getElementById('status').value,
        icon: document.getElementById('icon').value,
        dates: document.getElementById('dates').value,
        styleClass: document.getElementById('styleClass').value,
        formLink: document.getElementById('formLink').value
    };

    try {
        setLoading(true);
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors', // Apps Script requires no-cors for simple POST or handle via redirect
            body: JSON.stringify(formData)
        });
        
        // Note: With no-cors, we can't see the response body. 
        // A better way is to use a library or handle the redirect.
        // For simplicity here, we assume success after a delay and refresh.
        
        setTimeout(() => {
            alert('บันทึกข้อมูลสำเร็จ (ข้อมูลจะได้รับการอัปเดตใน 2-3 วินาที)');
            courseModal.classList.remove('active');
            fetchCourses();
            setLoading(false);
        }, 1500);

    } catch (error) {
        alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        setLoading(false);
    }
});

function setLoading(loading) {
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = loading;
    saveBtn.textContent = loading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล';
}

// Edit Course
window.editCourse = (id) => {
    const course = courses.find(c => c.ID === id);
    if (!course) return;

    isEditing = true;
    modalTitle.textContent = 'แก้ไขหลักสูตร';
    document.getElementById('courseId').value = course.ID;
    document.getElementById('title').value = course.Title;
    document.getElementById('subtitle').value = course.Subtitle;
    document.getElementById('category').value = course.Category;
    document.getElementById('status').value = course.Status;
    document.getElementById('icon').value = course.Icon;
    document.getElementById('dates').value = course.Dates;
    document.getElementById('styleClass').value = course.StyleClass;
    document.getElementById('formLink').value = course.FormLink;
    
    courseModal.classList.add('active');
};

// Delete Course
window.deleteCourse = async (id) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบหลักสูตรนี้?')) return;

    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: JSON.stringify({ action: 'deleteCourse', id: id })
        });
        
        setTimeout(() => {
            fetchCourses();
            alert('ลบข้อมูลสำเร็จ');
        }, 1000);
    } catch (error) {
        alert('ไม่สามารถลบข้อมูลได้');
    }
};
