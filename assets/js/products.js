// =========================================================================
// 1. CƠ SỞ DỮ LIỆU SẢN PHẨM 
// =========================================================================
const defaultProductsData = [
    { id: 1, brand: "PETROLIMEX", category: "Gas Bình", name: "Bình Gas Petrolimex 12kg van ngang", image: "assets/images/gas-petrolimex-12kg-van-ngang.png", rating: 5, reviewCount: 128, priceCurrent: 380000, priceOld: 420000, stock: 18 },
    { id: 2, brand: "SUNHOUSE", category: "Bếp Gas Âm Kính", name: "Bếp gas âm kính Sunhouse SHB62050", image: "assets/images/beo-am-kinh-sunhouse-shb62050.png", rating: 4.5, reviewCount: 312, priceCurrent: 1250000, priceOld: 1550000, stock: 5 },
    { id: 3, brand: "KANGAROO", category: "Máy Hút Mùi", name: "Máy hút mùi kính cong Kangaroo KGCH70H1C", image: "assets/images/may-hut-mui-kinh-cong-kangaroo-kgch70h1c.png", rating: 4, reviewCount: 56, priceCurrent: 2450000, priceOld: 2800000, stock: 12 },
    { id: 4, brand: "FASTER", category: "Bếp Gas Âm Kính", name: "Bếp gas âm 3 vùng nấu Faster FS-319S", image: "assets/images/bep-gas-am-faster-fs319s.png", rating: 5, reviewCount: 89, priceCurrent: 1250000, priceOld: 1450000, stock: 8 },
    { id: 5, brand: "PETRO VIỆT NAM", category: "Gas Bình", name: "Bình Gas Petro Việt Nam 12kg (Hồng)", image: "assets/images/gas-petrovietnam-12kg-hong.png", rating: 4, reviewCount: 45, priceCurrent: 350000, priceOld: 380000, stock: 25 },
    { id: 6, brand: "BOSCH", category: "Máy Hút Mùi", name: "Máy hút mùi ống khói Bosch DWW07W850", image: "assets/images/may-hut-mui-bosch-dww07w850.png", rating: 4.5, reviewCount: 15, priceCurrent: 4200000, priceOld: 5500000, stock: 3 }
];

if (!localStorage.getItem('trunghieugas_products')) {
    localStorage.setItem('trunghieugas_products', JSON.stringify(defaultProductsData));
}
let productsData = JSON.parse(localStorage.getItem('trunghieugas_products'));

// =========================================================================
// 2. CÁC HÀM TIỆN ÍCH
// =========================================================================
function formatCurrency(number) { 
    return number.toLocaleString('vi-VN') + 'đ'; 
}

function generateStarsHtml(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (rating >= i) {
            stars += '<i class="fas fa-star"></i>';
        } else if (rating >= i - 0.5) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// =========================================================================
// 3. RENDER DANH SÁCH & KHỞI TẠO BỘ LỌC
// =========================================================================
function renderProductList(products) {
    const productGrid = document.getElementById('product-grid');
    if (!productGrid) return; 

    productGrid.innerHTML = '';

    if (products.length === 0) {
        productGrid.innerHTML = `
            <p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #888;">Không tìm thấy sản phẩm nào phù hợp.</p>`;
        return;
    }

    let htmlContent = '';
    products.forEach(product => {
        // Sử dụng toán tử 3 ngôi để gán mã HTML nếu có giá cũ
        let discountHtml = (product.priceOld && product.priceOld > product.priceCurrent) ? `<span class="price-discount">-${Math.round(((product.priceOld - product.priceCurrent) / product.priceOld) * 100)}%</span>` : '';
            
        let priceOldHtml = product.priceOld ? `<span class="price-old">${formatCurrency(product.priceOld)}</span>` : '';

        htmlContent += `
            <div class="product-card">
                <div class="product-img-wrap">
                    <img src="${product.image}" alt="${product.name}" class="product-img">
                </div>
                <div class="product-info-wrap">
                    <span class="product-brand">${product.brand}</span>
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-rating">
                        ${generateStarsHtml(product.rating)}
                        <span class="review-count">(${product.reviewCount})</span>
                    </div>
                    <div class="product-price-row">
                        <span class="price-current">${formatCurrency(product.priceCurrent)}</span>
                        ${priceOldHtml}
                        ${discountHtml}
                    </div>
                    <div class="product-actions">
                        <a href="product-detail.html?id=${product.id}" class="btn-action btn-outline">Chi Tiết</a>
                        <button class="btn-action btn-solid" onclick="addToCart(${product.id}, 1)">Thêm Giỏ</button>
                    </div>
                </div>
            </div>`;
    });
    
    productGrid.innerHTML = htmlContent;
}

function updateToolbarCount(matchedCount) {
    const toolbarText = document.querySelector('.toolbar-left p');
    if (toolbarText) {
        toolbarText.innerHTML = `Hiển thị <strong>1–${matchedCount}</strong> trong <strong>${productsData.length}</strong> sản phẩm`;
    }
}

function initSidebarFilters() {
    const filterGroups = document.querySelectorAll('.sidebar-filter .filter-group');
    if (filterGroups.length < 4) return;
    
    // Khởi tạo Danh mục
    const uniqueCategories = [...new Set(productsData.map(p => p.category))];   /*Lưu ý*/
    let catHtml = `
        <h3 class="filter-title">DANH MỤC</h3>
        <label class="custom-checkbox">
            <input type="checkbox" id="cat-all" checked>
            <span class="checkmark"></span>Tất cả sản phẩm
            <span class="badge">${productsData.length}</span>
        </label>`;
        
    uniqueCategories.forEach(cat => {
        let count = productsData.filter(p => p.category === cat).length;
        catHtml += `
            <label class="custom-checkbox">
                <input type="checkbox" class="category-checkbox" value="${cat}">
                <span class="checkmark"></span>${cat}
                <span class="badge">${count}</span>
            </label>`;
    });
    filterGroups[0].innerHTML = catHtml;

    // Khởi tạo Thương hiệu
    const uniqueBrands = [...new Set(productsData.map(p => p.brand))];
    let brandHtml = `<h3 class="filter-title">THƯƠNG HIỆU</h3>`;
    
    uniqueBrands.forEach(brand => {
        let count = productsData.filter(p => p.brand === brand).length;
        brandHtml += `
            <label class="custom-checkbox">
                <input type="checkbox" class="brand-checkbox" value="${brand}">
                <span class="checkmark"></span>${brand}
                <span class="badge">${count}</span>
            </label>`;
    });
    filterGroups[1].innerHTML = brandHtml;

    setupCategoryCheckboxLogic();
}

function setupCategoryCheckboxLogic() {
    const catAllCheck = document.getElementById('cat-all');
    const catChecks = document.querySelectorAll('.category-checkbox');
    if (!catAllCheck) return;
    
    // Nếu click vào "Tất cả"
    catAllCheck.addEventListener('change', function() { 
        if (this.checked) {
            catChecks.forEach(cb => {
                cb.checked = false;
            });
        }
        filterProducts(); 
    });
    
    // Nếu click vào các danh mục con
    catChecks.forEach(cb => { 
        cb.addEventListener('change', function() { 
            if (this.checked) {
                catAllCheck.checked = false; 
            }
            // Tự động check lại "Tất cả" nếu không có danh mục con nào được chọn
            if (document.querySelectorAll('.category-checkbox:checked').length === 0) {
                catAllCheck.checked = true; 
            }
            filterProducts(); 
        }); 
    });
}

// =========================================================================
// 4. THUẬT TOÁN LỌC SẢN PHẨM (Dùng hàm .filter hiện đại, dễ đọc)
// =========================================================================
function filterProducts() {
    // Lấy trạng thái từ giao diện
    let catAllCheck = document.getElementById('cat-all');
    let isAllCatChecked = catAllCheck ? catAllCheck.checked : false;
    
    let selectedCats = Array.from(document.querySelectorAll('.category-checkbox:checked')).map(cb => cb.value);
    let selectedBrands = Array.from(document.querySelectorAll('.brand-checkbox:checked')).map(cb => cb.value);
    let selectedRatings = Array.from(document.querySelectorAll('.rating-checkbox:checked')).map(cb => parseFloat(cb.value));

    let priceSlider = document.querySelector('.price-slider');
    let currentMaxPrice = priceSlider ? parseInt(priceSlider.value) : 10000000;
    
    let maxLabel = document.querySelector('.price-max');
    if (maxLabel) {
        maxLabel.textContent = "Đến: " + formatCurrency(currentMaxPrice);
    }

    // Thực hiện lọc qua mảng gốc
    let filtered = productsData.filter(product => {
        // Toán tử 3 ngôi kiểm tra logic từng trạm
        let passCategory = (isAllCatChecked || selectedCats.length === 0) ? true : selectedCats.includes(product.category);
        let passBrand = (selectedBrands.length === 0) ? true : selectedBrands.includes(product.brand);
        let passPrice = product.priceCurrent <= currentMaxPrice;
        let passRating = (selectedRatings.length === 0) ? true : selectedRatings.some(r => product.rating >= r);

        // Trả về true nếu lọt qua cả 4 trạm
        return passCategory && passBrand && passPrice && passRating;
    });

    // Sắp xếp kết quả
    let sortDropdown = document.querySelector('.sort-dropdown');
    let sortValue = sortDropdown ? sortDropdown.value : 'default';
    
    if (sortValue === 'price-asc') {
        filtered.sort((a, b) => a.priceCurrent - b.priceCurrent);
    } else if (sortValue === 'price-desc') {
        filtered.sort((a, b) => b.priceCurrent - a.priceCurrent);
    }

    renderProductList(filtered);
    updateToolbarCount(filtered.length);
}

// =========================================================================
// 5. XỬ LÝ SỰ KIỆN NÚT XÓA BỘ LỌC VÀ LẮNG NGHE SỰ KIỆN
// =========================================================================
function initClearFilterButton() {
    const btnClear = document.querySelector('.btn-clear-filter');
    if (!btnClear) return;
    
    btnClear.addEventListener('click', () => {
        if (document.getElementById('cat-all')) {
            document.getElementById('cat-all').checked = true;
        }
        document.querySelectorAll('.category-checkbox, .brand-checkbox, .rating-checkbox').forEach(cb => {
            cb.checked = false;
        });
        let slider = document.querySelector('.price-slider');
        if (slider) {
            slider.value = slider.max;
        }
        let sortDropdown = document.querySelector('.sort-dropdown');
        if (sortDropdown) {
            sortDropdown.value = 'default';
        }
        filterProducts();
    });
}

function registerGlobalEventListeners() {
    document.querySelectorAll('.brand-checkbox, .rating-checkbox, .sort-dropdown').forEach(el => {
        el.addEventListener('change', filterProducts);
    });
    let slider = document.querySelector('.price-slider');
    if (slider) {
        slider.addEventListener('input', filterProducts);
    }
}

// =========================================================================
// 6. RENDER TRANG CHI TIẾT SẢN PHẨM
// =========================================================================
function renderProductDetail() {
    const detailWrapper = document.getElementById('product-detail-wrapper');
    if (!detailWrapper) return; 

    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    const product = productsData.find(p => p.id === productId);

    if (!product) {
        detailWrapper.innerHTML = `
            <div style="text-align: center; padding: 50px; width: 100%;">
                <h2>Sản phẩm không tồn tại!</h2>
                <a href="products.html" class="btn-primary" style="margin-top: 20px;">Quay lại cửa hàng</a>
            </div>`;
        return;
    }

    const breadcrumbItems = document.querySelectorAll('.mini-nav li');
    if (breadcrumbItems.length >= 3) {
        breadcrumbItems[2].textContent = product.name;
    }

    // Áp dụng toán tử 3 ngôi cho việc hiển thị giảm giá trang chi tiết
    let discountHtml = (product.priceOld && product.priceOld > product.priceCurrent) ? `<span class="discount-badge">-${Math.round(((product.priceOld - product.priceCurrent) / product.priceOld) * 100)}%</span>` : '';
        
    let priceOldHtml = product.priceOld ? `<span class="detail-old-price">${formatCurrency(product.priceOld)}</span>` : '';

    detailWrapper.innerHTML = `
        <div class="product-gallery">
            <div class="main-image-box">
                ${discountHtml}
                <img src="${product.image}" alt="${product.name}">
            </div>
        </div>
        <div class="product-info">
            <h1 class="detail-name">${product.name}</h1>
            <div class="price-section">
                <span class="detail-new-price">${formatCurrency(product.priceCurrent)}</span>
                ${priceOldHtml}
            </div>
            <div class="product-description">
                <ul>
                    <li><strong>Thương hiệu:</strong> ${product.brand}</li>
                    <li><strong>Danh mục:</strong> ${product.category}</li>
                    <li><strong>Đánh giá:</strong> <span style="color: #ffc107;">${generateStarsHtml(product.rating)}</span></li>
                </ul>
            </div>
            <div class="quantity-stock-box">
                <span class="qty-label">Số Lượng</span>
                <div class="qty-control-wrapper">
                    <div class="qty-control">
                        <button type="button" class="qty-btn-minus">-</button>
                        <input type="text" value="1" readonly id="detail-qty-input">
                        <button type="button" class="qty-btn-plus">+</button>
                    </div>
                    <div class="stock-status">
                        <i class="fas fa-check-circle"></i> Còn ${product.stock} sản phẩm
                    </div>
                </div>
            </div>
            <div class="action-buttons">
                <button class="btn-add-to-cart" onclick="addToCartFromDetail(${product.id})">
                    <i class="fas fa-cart-plus"></i> Thêm Vào Giỏ
                </button>
                <button class="btn-buy-now" onclick="buyNowFromDetail(${product.id})">
                    Mua Ngay
                </button>
            </div>
        </div>`;

    // Tách dòng các sự kiện tăng giảm số lượng
    const btnMinus = document.querySelector('.qty-btn-minus');
    const btnPlus = document.querySelector('.qty-btn-plus');
    const qtyInput = document.getElementById('detail-qty-input');
    
    if (btnMinus && btnPlus && qtyInput) {
        btnMinus.addEventListener('click', () => { 
            let currentQty = parseInt(qtyInput.value);
            if (currentQty > 1) {
                qtyInput.value = currentQty - 1; 
            }
        });
        
        btnPlus.addEventListener('click', () => { 
            let currentQty = parseInt(qtyInput.value);
            if (currentQty < product.stock) {
                qtyInput.value = currentQty + 1; 
            } else {
                alert(`Chỉ còn ${product.stock} sản phẩm trong kho!`);
            }
        });
    }
}

// =========================================================================
// KHỞI CHẠY HỆ THỐNG
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
    initSidebarFilters();           
    registerGlobalEventListeners();   
    initClearFilterButton();         
    filterProducts();   
    renderProductDetail();
});