// Store functionality JavaScript

// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let filteredProducts = products;
let currentCategory = 'All';

// Initialize store
document.addEventListener('DOMContentLoaded', function() {
    renderCategories();
    renderProducts(products);
    updateCartUI();
    
    // Event listeners
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('cartBtn').addEventListener('click', toggleCart);
    document.getElementById('closeCart').addEventListener('click', toggleCart);
    document.getElementById('cartOverlay').addEventListener('click', toggleCart);
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);
    
    // Product modal
    const productModal = document.getElementById('productModal');
    const closeModal = document.querySelector('.close-modal');
    
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            productModal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', (e) => {
        if (e.target === productModal) {
            productModal.style.display = 'none';
        }
    });
});

// Render categories
function renderCategories() {
    const categoriesContainer = document.getElementById('categories');
    categoriesContainer.innerHTML = '';
    
    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.textContent = category;
        if (category === currentCategory) {
            btn.classList.add('active');
        }
        btn.addEventListener('click', () => filterByCategory(category));
        categoriesContainer.appendChild(btn);
    });
}

// Filter by category
function filterByCategory(category) {
    currentCategory = category;
    renderCategories();
    
    if (category === 'All') {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    const searchInput = document.getElementById('searchInput').value;
    if (searchInput) {
        handleSearch({ target: { value: searchInput } });
    } else {
        renderProducts(filteredProducts);
    }
    
    document.getElementById('sectionTitle').textContent = category === 'All' ? 'All Products' : category;
}

// Handle search
function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    
    if (currentCategory === 'All') {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(product => product.category === currentCategory);
    }
    
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    renderProducts(filteredProducts);
}

// Render products
function renderProducts(productsToRender) {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';
    
    if (productsToRender.length === 0) {
        productsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;"><h3>No products found</h3><p>Try adjusting your search or filter</p></div>';
        return;
    }
    
    productsToRender.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const stars = generateStars(product.rating);
    
    card.innerHTML = `
        <div class="product-image">${product.image}</div>
        <div class="product-info">
            <div class="product-category">${product.category}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-description">${product.description}</div>
            <div class="product-rating">
                ${stars}
                <span>(${product.reviews} reviews)</span>
            </div>
            <div class="product-price">
                <span class="current-price">$${product.price.toFixed(2)}</span>
                ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
            </div>
            <div class="product-actions">
                <button class="btn-add-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="btn-view-details" onclick="showProductDetails(${product.id})">
                    View Details
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Generate stars for rating
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartUI();
    showNotification(`${product.name} added to cart!`);
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    renderCartItems();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCart();
        updateCartUI();
        renderCartItems();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update cart UI
function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (totalItems > 0) {
        cartCount.style.display = 'flex';
    } else {
        cartCount.style.display = 'none';
    }
    
    renderCartItems();
}

// Render cart items
function renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        cartTotal.textContent = '0.00';
        return;
    }
    
    cartItems.innerHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">${item.image}</div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = total.toFixed(2);
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('show');
}

// Show product details
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const productModal = document.getElementById('productModal');
    const productDetail = document.getElementById('productDetail');
    
    const stars = generateStars(product.rating);
    
    productDetail.innerHTML = `
        <div class="product-detail-image">${product.image}</div>
        <div class="product-detail-info">
            <div class="product-category">${product.category}</div>
            <h2>${product.name}</h2>
            <div class="product-rating">
                ${stars}
                <span>(${product.reviews} reviews)</span>
            </div>
            <div class="product-description">${product.description}</div>
            <div class="product-price">
                <span class="current-price">$${product.price.toFixed(2)}</span>
                ${product.originalPrice ? `<span class="original-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
            </div>
            <div class="product-detail-actions">
                <button class="btn-add-cart" onclick="addToCart(${product.id}); document.getElementById('productModal').style.display='none';">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
            </div>
        </div>
    `;
    
    productModal.style.display = 'flex';
}

// Handle checkout
function handleCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const message = `Thank you for your purchase!\n\nTotal: $${total.toFixed(2)}\n\nThis is a demo store. No actual payment will be processed.`;
    
    alert(message);
    
    // Clear cart after checkout
    cart = [];
    saveCart();
    updateCartUI();
    toggleCart();
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: #2E7D32;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 600;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Add CSS animations for notification
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