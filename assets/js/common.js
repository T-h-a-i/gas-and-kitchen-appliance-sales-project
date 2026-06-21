// =========================================================================
// 1. ĐỒNG BỘ SỐ LƯỢNG GIỎ HÀNG TOÀN HỆ THỐNG
// =========================================================================
function updateGlobalCartCount() {
    let cart = JSON.parse(localStorage.getItem('trunghieugas_cart')) || [];
    let localProducts = [];
    try {
        if (typeof productsData !== 'undefined') {
            localProducts = productsData;
        } else {
            localProducts = JSON.parse(localStorage.getItem('trunghieugas_products')) || [];
        }
    } catch(ex) {}

    let totalItems = 0;
    cart.forEach(item => {
        if (localProducts.some(p => p.id === item.id)) {        // dùng câu đk để phòng TH sp mà khách hàng chọn đẫ bị xóa khỏi cửa hàng
            totalItems += item.quantity;
        }
    });

    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => el.textContent = totalItems);
}

// =========================================================================
// 2. HỆ THỐNG PHÂN QUYỀN & QUẢN LÝ ĐĂNG NHẬP / ĐĂNG XUẤT (AUTH LOGIC)
// =========================================================================
function initAuthGlobal() {
    const topBarRight = document.querySelector('.top-bar-right');
    const currentUser = localStorage.getItem('trunghieugas_currentUser');

    if (topBarRight) {
        if (currentUser) {
            topBarRight.innerHTML = `
                <span style="color: #666; margin-right: 15px;">Xin chào, <strong style="color:#d81b60;">${currentUser}</strong></span>
                <a href="#" onclick="handleLogout(event)" style="color: #666; font-weight: bold; transition: color 0.3s;" onmouseover="this.style.color='#d81b60'" onmouseout="this.style.color='#666'"><i class="fas fa-sign-out-alt"></i> Đăng xuất</a>
            `;
            const mobileAuthLinks = document.querySelectorAll('.mobile-auth-action a');
            mobileAuthLinks.forEach(link => {
                link.innerHTML = `<i class="fas fa-sign-out-alt"></i> ĐĂNG XUẤT`;
                link.href = "#";
                link.onclick = handleLogout;
            });
        } else {
            topBarRight.innerHTML = `
                <a href="login.html" style="color: #666; font-weight: bold; transition: color 0.3s;" onmouseover="this.style.color='#d81b60'" onmouseout="this.style.color='#666'"><i class="fas fa-user"></i> Đăng nhập / Đăng ký</a>
            `;
            const mobileAuthLinks = document.querySelectorAll('.mobile-auth-action a');
            mobileAuthLinks.forEach(link => {
                link.innerHTML = `<i class="fas fa-user"></i> ĐĂNG NHẬP / ĐĂNG KÝ`;
                link.href = "login.html";
                link.onclick = null;
            });
        }
    }

    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navLinks = document.querySelectorAll('.main-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuToggle && mobileMenuToggle.checked) {
                mobileMenuToggle.checked = false;
            }
        });
    });
}

function handleLogout(e) {
    e.preventDefault();
    localStorage.removeItem('trunghieugas_currentUser');
    alert("Bạn đã đăng xuất thành công!");
    window.location.href = 'index.html';
}

// =========================================================================
// KHỞI CHẠY HỆ THỐNG KHI TẢI TRANG XONG
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
    updateGlobalCartCount();
    initAuthGlobal();
});