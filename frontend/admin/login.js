document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const submitBtn = document.getElementById('submit-btn');
    const messageDiv = document.getElementById('login-message');

    // If already logged in, redirect to dashboard
    if (sessionStorage.getItem('adminToken')) {
        window.location.href = 'dashboard.html';
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'กำลังตรวจสอบ...';
        messageDiv.textContent = '';
        messageDiv.className = '';

        try {
            const response = await fetch(CONFIG.sheets.general.scriptUrl, {
                method: 'POST',
                mode: 'no-cors', // Apps Script CORS limitation with POST
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'login',
                    username: username,
                    password: password
                })
            });

            // Note: Since we use 'no-cors', we can't actually see the response JSON here.
            // This is a known limitation when using POST with Apps Script directly.
            // WORKAROUND: For better UX, we'll try to use GET for login instead,
            // or we'll just implement a simple redirect logic assuming success for demo,
            // but for real security we should use the same technique as addCourse.
            
            // Re-attempting with a standard fetch pattern (this might trigger CORS error but we can handle it)
            // Actually, for Apps Script, the best way for Login is to use a GET request or a proper POST handling.
            
            // Let's use a GET request for login to avoid 'no-cors' limitations
            const loginUrl = `${CONFIG.sheets.general.scriptUrl}?action=login&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
            const getResponse = await fetch(loginUrl);
            const result = await getResponse.json();

            if (result.success) {
                messageDiv.className = 'success-message';
                messageDiv.textContent = 'เข้าสู่ระบบสำเร็จ! กำลังเข้าสู่หน้าหลัก...';
                sessionStorage.setItem('adminToken', result.token);
                sessionStorage.setItem('adminUser', username);
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                messageDiv.className = 'error-message';
                messageDiv.textContent = result.error || 'Username หรือ Password ไม่ถูกต้อง';
                submitBtn.disabled = false;
                submitBtn.textContent = 'เข้าสู่ระบบ';
            }
        } catch (error) {
            console.error('Login error:', error);
            messageDiv.className = 'error-message';
            messageDiv.textContent = 'เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์';
            submitBtn.disabled = false;
            submitBtn.textContent = 'เข้าสู่ระบบ';
        }
    });
});
