// =========================================================================
// HỆ THỐNG GIỎ HÀNG & THANH TOÁN (CART.JS)
// =========================================================================

function addToCart(productId, quantityToAdd = 1) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    let cart = JSON.parse(localStorage.getItem('trunghieugas_cart')) || [];
    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex !== -1) {
        let newQuantity = cart[existingIndex].quantity + quantityToAdd;
        if (newQuantity > product.stock) {
            alert(`Lỗi: Vượt quá ${product.stock} sản phẩm trong kho!`);
            return false;
        }
        cart[existingIndex].quantity = newQuantity;
    } else {
        if (quantityToAdd > product.stock) {
            alert(`Lỗi: Kho chỉ còn ${product.stock} sản phẩm!`);
            return false;
        }
        cart.push({ id: productId, quantity: quantityToAdd, selected: true }); 
    }

    localStorage.setItem('trunghieugas_cart', JSON.stringify(cart));
    updateGlobalCartCount();
    
    alert(`Đã thêm ${quantityToAdd} sản phẩm vào giỏ hàng!`);
    return true;
}

function addToCartFromDetail(productId) {
    const qtyInput = document.getElementById('detail-qty-input');
    const qty = qtyInput ? parseInt(qtyInput.value) : 1;
    addToCart(productId, qty);
}

function buyNowFromDetail(productId) {
    const qtyInput = document.getElementById('detail-qty-input');
    const qty = qtyInput ? parseInt(qtyInput.value) : 1;
    const isSuccess = addToCart(productId, qty);
    if (isSuccess) {
        window.location.href = 'cart.html';
    }
}

function renderCartPage() {
    const cartList = document.getElementById('cart-list');
    if (!cartList) return; 

    const checkoutSection = document.querySelector('.checkout-section');
    if (checkoutSection) checkoutSection.style.display = 'block';

    let cart = JSON.parse(localStorage.getItem('trunghieugas_cart')) || [];
    
    if (cart.length === 0) {
        cartList.innerHTML = `
        <div style="text-align: center; padding: 50px; color: #888;">
            <i class="fas fa-shopping-cart" style="font-size: 3rem; color: #ddd; margin-bottom: 20px;"></i>
            <h3>Giỏ hàng của bạn đang trống</h3>
            <a href="products.html" class="btn-primary" style="display:inline-block; margin-top:20px;">Tiếp tục mua sắm</a>
        </div>`;
        document.getElementById('cart-header-count').textContent = `0 sản phẩm`;
        document.getElementById('check-all-text').textContent = `Chọn tất cả (0 sản phẩm)`;
        document.getElementById('cart-final-total').textContent = `0 đ`;
        return;
    }

    let htmlContent = '';
    cart.forEach((item, index) => {
        const product = productsData.find(p => p.id === item.id);
        if (product) {
            const isChecked = item.selected !== false; 
            htmlContent += `
                <div class="cart-item">
                    <div class="item-check">
                        <label class="custom-checkbox">
                            <input type="checkbox" class="cart-item-check" ${isChecked ? 'checked' : ''} onchange="toggleCartItem(${index})">
                            <span class="checkmark"></span>
                        </label>
                    </div>
                    <div class="item-img"><img src="${product.image}" alt="${product.name}"></div>
                    <div class="item-info">
                        <span class="item-brand">${product.brand}</span>
                        <h3 class="item-name">${product.name}</h3>
                        <p class="item-variant">Danh mục: ${product.category}</p>
                        <div class="item-qty-price">
                            <div class="qty-box">
                                <button type="button" class="qty-btn" onclick="updateCartQty(${index}, -1)">-</button>
                                <input type="text" value="${item.quantity}" readonly> <!-- readonly để không cho khách hàng gõ trực tiếp vào ô số lượng-->
                                <button type="button" class="qty-btn" onclick="updateCartQty(${index}, 1)">+</button>
                            </div>
                            <span class="unit-price">${formatCurrency(product.priceCurrent)} / sản phẩm</span>
                        </div>
                    </div>
                    <div class="item-total-action">
                        <span class="item-total" style="color: #d81b60; font-weight: bold;">${formatCurrency(product.priceCurrent * item.quantity)}</span>
                        <button class="btn-remove-item" onclick="removeCartItem(${index})"><i class="far fa-trash-alt"></i> Xóa</button>
                    </div>
                </div>`;
        }
    });

    cartList.innerHTML = htmlContent;
    updateCartSummary();

    const checkAllCb = document.getElementById('check-all-cart');
    if (checkAllCb) {
        checkAllCb.checked = cart.every(item => item.selected !== false);
        checkAllCb.onchange = function() {
            let currentCart = JSON.parse(localStorage.getItem('trunghieugas_cart')) || [];
            currentCart.forEach(item => item.selected = this.checked);
            localStorage.setItem('trunghieugas_cart', JSON.stringify(currentCart));
            renderCartPage();
        };
    }
}

function updateCartSummary() {
    let cart = JSON.parse(localStorage.getItem('trunghieugas_cart')) || [];
    let totalMoney = 0;
    let totalItemsInCart = 0;
    
    cart.forEach(item => {
        const p = productsData.find(x => x.id === item.id);
        if (p) {
            totalItemsInCart += item.quantity;
            if (item.selected !== false) {
                totalMoney += p.priceCurrent * item.quantity;
            }
        }
    });
    
    const finalTotalEl = document.getElementById('cart-final-total');
    if (finalTotalEl) finalTotalEl.textContent = formatCurrency(totalMoney);
    const headerCountEl = document.getElementById('cart-header-count');
    if (headerCountEl) headerCountEl.textContent = `${totalItemsInCart} sản phẩm`;
    const checkAllTextEl = document.getElementById('check-all-text');
    if (checkAllTextEl) checkAllTextEl.textContent = `Chọn tất cả (${totalItemsInCart} sản phẩm)`;
}

function updateCartQty(index, change) {
    let cart = JSON.parse(localStorage.getItem('trunghieugas_cart')) || [];
    const product = productsData.find(p => p.id === cart[index].id);
    if (!product) return;

    let newQty = cart[index].quantity + change;
    if (newQty < 1) newQty = 1;
    if (newQty > product.stock) {
        alert(`Chỉ còn ${product.stock} sản phẩm trong kho!`);
        newQty = product.stock;
    }
    cart[index].quantity = newQty;
    localStorage.setItem('trunghieugas_cart', JSON.stringify(cart));
    renderCartPage();
    if(typeof updateGlobalCartCount === 'function') updateGlobalCartCount();
}

function toggleCartItem(index) {
    let cart = JSON.parse(localStorage.getItem('trunghieugas_cart')) || [];
    cart[index].selected = cart[index].selected === false ? true : false;
    localStorage.setItem('trunghieugas_cart', JSON.stringify(cart));
    renderCartPage();
}

function removeCartItem(index) {
    let cart = JSON.parse(localStorage.getItem('trunghieugas_cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('trunghieugas_cart', JSON.stringify(cart));
    renderCartPage();
    if(typeof updateGlobalCartCount === 'function') updateGlobalCartCount();
}

function clearCart() {
    let cart = JSON.parse(localStorage.getItem('trunghieugas_cart')) || [];
    const beforeCount = cart.length;
    cart = cart.filter(item => item.selected === false);      // các sp được tick để xóa đã bị xóa ở ngay bước này
    
    if(cart.length === beforeCount) {
        alert("Bạn chưa chọn sản phẩm nào để xóa!");
        return;
    }

    localStorage.setItem('trunghieugas_cart', JSON.stringify(cart));
    renderCartPage();
    if(typeof updateGlobalCartCount === 'function') updateGlobalCartCount();
    alert("Đã xóa sản phẩm chọn khỏi giỏ hàng!");
}

function initCheckoutForm() {
    const checkoutForm = document.getElementById('checkout-form');
    if(!checkoutForm) return;

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let cart = JSON.parse(localStorage.getItem('trunghieugas_cart')) || [];
        const selectedItems = cart.filter(item => item.selected !== false);
        
        if (selectedItems.length === 0) {
            alert('Bạn chưa chọn sản phẩm nào để thanh toán!');
            return;
        }

        const currentUser = localStorage.getItem('trunghieugas_currentUser');
        if (!currentUser) {
            alert("Vui lòng đăng nhập để thanh toán!");
            setTimeout(() => { window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.href); }, 1500);
            return;
        }

        // Kiểm tra tồn kho bằng vòng lặp for...of ngắt luồng sớm
        for (let cartItem of selectedItems) {
            const product = productsData.find(p => p.id === cartItem.id);
            
            if (product && cartItem.quantity > product.stock) {
                alert(`Sản phẩm ${product.name} chỉ còn ${product.stock} trong kho!`);
                return; // Dừng ngay lập tức, không kiểm tra thêm nữa
            }
        }

        // Trừ đi số lượng tồn kho của các sản phẩm vừa mua
        selectedItems.forEach(cartItem => {
            const prodIndex = productsData.findIndex(p => p.id === cartItem.id);
            if (prodIndex !== -1) {
                productsData[prodIndex].stock -= cartItem.quantity;
            }
        });
        localStorage.setItem('trunghieugas_products', JSON.stringify(productsData));

        const paymentMethodEl = document.querySelector('input[name="payment"]:checked');

        const orderData = {
            id: 'ORD' + Date.now(),
            customerName: document.getElementById('HoTenNhan').value,
            phone: document.getElementById('SDTNhan').value,
            email: document.getElementById('EmailNhan').value,
            address: document.getElementById('DiaChiNhan').value,
            paymentMethod: paymentMethodEl ? paymentMethodEl.parentElement.textContent.trim() : "COD",
            items: selectedItems,
            date: new Date().toISOString(),
            status: 'Pending'
        };
        
        let orders = JSON.parse(localStorage.getItem('trunghieugas_orders')) || [];
        orders.push(orderData);
        localStorage.setItem('trunghieugas_orders', JSON.stringify(orders));

        alert('Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại Trung Hiếu Gas.');
        
        cart = cart.filter(item => item.selected === false);
        localStorage.setItem('trunghieugas_cart', JSON.stringify(cart));
        
        checkoutForm.reset();
        renderCartPage();
        if(typeof updateGlobalCartCount === 'function') updateGlobalCartCount();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    if(typeof renderCartPage === 'function') renderCartPage();
    if(typeof initCheckoutForm === 'function') initCheckoutForm();
});