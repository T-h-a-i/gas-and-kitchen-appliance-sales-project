// =========================================================================
// XỬ LÝ SỰ KIỆN GỬI FORM TRANG LIÊN HỆ
// =========================================================================
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        alert("Cảm ơn bạn! Yêu cầu của bạn đã được gửi thành công.");
        
        contactForm.reset();
    });
}

// Khởi chạy hệ thống ngay khi cấu trúc HTML tải xong
document.addEventListener("DOMContentLoaded", function() {
    initContactForm();
});