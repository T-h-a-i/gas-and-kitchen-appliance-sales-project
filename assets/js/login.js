document.addEventListener("DOMContentLoaded", function() {

    // ==========================================
    // 1. XỬ LÝ LUỒNG ĐĂNG KÝ (Bên cột phải)
    // ==========================================
    let registerForm = document.getElementById('register-form');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();

            let usernameInput = document.getElementById('reg-username').value.trim();
            let passwordInput = document.getElementById('reg-password').value;
            let repasswordInput = document.getElementById('reg-repassword').value;

            if (passwordInput !== repasswordInput) {
                alert("Mật khẩu nhập lại không khớp. Vui lòng kiểm tra lại!");
                return; 
            }

            // Lấy data từ localStorage, nếu không có thì mặc định là mảng rỗng
            let usersList = JSON.parse(localStorage.getItem('trunghieugas_users')) || [];

            // Giao việc cho hàm .some() tự rà soát và báo cáo kết quả
            let isExist = usersList.some(user => user.username === usernameInput);

            if (isExist) {
                alert("Tên đăng nhập này đã có người sử dụng!");
                return;
            }

            let newUser = {
                username: usernameInput,
                password: passwordInput
            };
            
            usersList.push(newUser);
            localStorage.setItem('trunghieugas_users', JSON.stringify(usersList));

            alert("Đăng ký thành công! Bạn có thể sử dụng tài khoản này để đăng nhập ngay bên cạnh.");
            registerForm.reset(); 
        });
    }

    // ==========================================
    // 2. XỬ LÝ LUỒNG ĐĂNG NHẬP (Bên cột trái)
    // ==========================================
    let loginForm = document.getElementById('login-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            let usernameInput = document.getElementById('login-username').value.trim();
            let passwordInput = document.getElementById('login-password').value;

            let usersList = JSON.parse(localStorage.getItem('trunghieugas_users')) || [];

            // Ra lệnh cho máy tìm đúng người khớp cả tài khoản lẫn mật khẩu
            let validUser = usersList.find(user => user.username === usernameInput && user.password === passwordInput);

            // Nếu tìm thấy (validUser khác null/undefined), cho phép đăng nhập
            if (validUser) {
                localStorage.setItem('trunghieugas_currentUser', usernameInput);
                alert("Đăng nhập thành công!");
                window.location.href = 'index.html'; 
            } else {
                alert("Sai tên đăng nhập hoặc mật khẩu! Vui lòng kiểm tra lại.");
            }
        });
    }
});