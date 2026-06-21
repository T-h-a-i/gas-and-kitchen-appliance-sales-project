document.addEventListener("DOMContentLoaded", function() {
    // 1. Tìm thẻ input chọn file và thẻ dùng để in chữ ra màn hình
    // (Lưu ý: Bạn cần kiểm tra lại ID và Class trong file HTML của bạn cho khớp nhé)
    let fileInput = document.getElementById('cv-file'); 
    let fileLabel = document.querySelector('.file-label-text'); 

    // 2. Lắng nghe sự kiện khi người dùng chọn file xong (hoặc kéo thả file vào)
    if (fileInput && fileLabel) {
        fileInput.addEventListener('change', function() {
            // Kiểm tra xem người dùng có thực sự chọn file nào chưa
            if (this.files.length > 0) {
                // Lấy tên của file đầu tiên (vị trí số 0) và in đè lên dòng chữ cũ
                fileLabel.textContent = this.files[0].name;
                fileLabel.style.color = "#d81b60"; // Đổi màu chữ cho nổi bật
                fileLabel.style.fontWeight = "bold";
            } else {
                // Nếu người dùng bấm hủy, trả lại dòng chữ mặc định
                fileLabel.textContent = "Kéo thả hoặc chọn file";
                fileLabel.style.color = "#888";
                fileLabel.style.fontWeight = "normal";
            }
        });
    }
});