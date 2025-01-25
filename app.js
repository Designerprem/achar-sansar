// Initial cart data
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let cartTotal = 0;

// Initial food items data
const foodItems = [
    {
        id: 1,
        name: 'Margherita Pizza',
        price: 1079,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500'
    },
    {
        id: 2,
        name: 'Classic Burger',
        price: 829,
        category: 'Burger',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500'
    },
    {
        id: 3,
        name: 'California Roll',
        price: 1249,
        category: 'Sushi',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500'
    },
    {
        id: 4,
        name: 'Chocolate Cake',
        price: 579,
        category: 'Dessert',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'
    },
    {
        id: 5,
        name: 'Pepperoni Pizza',
        price: 1159,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500'
    },
    {
        id: 6,
        name: 'Cheese Burger',
        price: 919,
        category: 'Burger',
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500'
    },
    {
        id: 7,
        name: 'Dragon Roll',
        price: 1399,
        category: 'Sushi',
        image: 'https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=500'
    },
    {
        id: 8,
        name: 'Tiramisu',
        price: 669,
        category: 'Dessert',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500'
    },
    {
        id: 9,
        name: 'BBQ Chicken Pizza',
        price: 1249,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500'
    },
    {
        id: 10,
        name: 'Bacon Burger',
        price: 999,
        category: 'Burger',
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500'
    }
];

// User roles and credentials
const USERS = {
    admin: {
        username: 'admin',
        password: 'admin123',
        role: 'admin'
    },
    user: {
        username: 'user',
        password: 'user123',
        role: 'user'
    }
};

// Cart functionality
function showToast(message) {
    const toastContainer = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
        <span class="material-icons-round">check_circle</span>
        ${message}
    `;
    toastContainer.appendChild(toast);

    // Remove the toast after animation ends
    setTimeout(() => {
        toast.remove();
    }, 2000);
}

function addToCart(foodItem) {
    const existingItem = cart.find(item => item.id === foodItem.id);
    if (existingItem) {
        existingItem.quantity += 1;
        showToast(`Added another ${foodItem.name} to cart`);
    } else {
        cart.push({ ...foodItem, quantity: 1 });
        showToast(`${foodItem.name} added to cart`);
    }
    updateCartBadge();
    updateCartTotal();
    renderCart();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartBadge();
    updateCartTotal();
    renderCart();
}

function updateQuantity(itemId, delta) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + delta);
        updateCartBadge();
        updateCartTotal();
        renderCart();
    }
}

function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return; // Skip if element not found
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'block' : 'none';
}

function updateCartTotal() {
    // Calculate total from cart items
    cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update all cart total elements
    const cartTotalElements = document.querySelectorAll('#cart-total');
    cartTotalElements.forEach(element => {
        if (element) {
            element.textContent = `Rs ${cartTotal}`;
        }
    });
}

function renderCart() {
    const cartContainer = document.getElementById('search-results');
    if (!cartContainer) return;
    
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = '<div class="empty-cart"><span class="material-icons-round">shopping_cart</span><p>Your cart is empty</p></div>';
        return;
    }

    // Add cart header
    const cartHeader = document.createElement('div');
    cartHeader.className = 'cart-header';
    cartHeader.innerHTML = `
        <h2>Your Cart</h2>
    `;
    cartContainer.appendChild(cartHeader);

    // Add cart items
    const cartItemsContainer = document.createElement('div');
    cartItemsContainer.className = 'cart-items';
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p class="price">Rs ${item.price * item.quantity}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, -1)">
                        <span class="material-icons-round">remove</span>
                    </button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">
                        <span class="material-icons-round">add</span>
                    </button>
                </div>
            </div>
            <button class="remove-button" onclick="removeFromCart(${item.id})">
                <span class="material-icons-round">delete</span>
            </button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    cartContainer.appendChild(cartItemsContainer);

    // Add cart footer with total and checkout button
    const cartFooter = document.createElement('div');
    cartFooter.className = 'cart-footer';
    cartFooter.innerHTML = `
        <div class="cart-total">
            <span>Total Amount:</span>
            <span id="cart-total">Rs ${cartTotal}</span>
        </div>
        <button class="button button-primary checkout-button" onclick="proceedToCheckout()">
            <span class="material-icons-round">shopping_bag</span>
            Proceed to Checkout
        </button>
    `;
    cartContainer.appendChild(cartFooter);
}

function createFoodCard(food) {
    return `
        <div class="food-card">
            <img src="${food.image}" alt="${food.name}">
            <div class="food-info">
                <h3>${food.name}</h3>
                <p class="price">Rs ${food.price}</p>
                <button class="button button-primary" onclick="addToCart(${JSON.stringify(food).replace(/"/g, '&quot;')})">
                    <span class="material-icons-round">add_shopping_cart</span>
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// DOM Elements
const authForm = document.getElementById('auth-form');
const authScreen = document.getElementById('auth-screen');
const mainApp = document.getElementById('main-app');
const foodGrid = document.getElementById('food-grid');
const searchInput = document.getElementById('search-input');
const ordersContainer = document.getElementById('orders-container');

if (!localStorage.getItem('foods')) {
    localStorage.setItem('foods', JSON.stringify(foodItems));
}

// Initialize data
function initializeApp() {
    // Initialize cart from localStorage
    cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Initialize food items if not exists
    if (!localStorage.getItem('foods')) {
        localStorage.setItem('foods', JSON.stringify(foodItems));
    }
    
    // Check auth state
    const userData = localStorage.getItem('userData');
    if (userData) {
        // User is logged in
        authScreen.classList.remove('active');
        mainApp.classList.add('active');
        displayFoodItems();
        displayOrders();
        updateCartBadge();
        renderCart();
    } else {
        // User needs to login
        authScreen.classList.add('active');
        mainApp.classList.remove('active');
        // Clear any remaining data for security
        localStorage.removeItem('cart');
        localStorage.removeItem('lastOrder');
        localStorage.removeItem('orders');
    }
}

// Login handling
function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Input validation
    if (!username || !password) {
        showToast('Please fill in all fields');
        return;
    }

    // Check credentials
    const user = USERS[username];
    if (!user || user.password !== password) {
        showToast('Invalid credentials. Please try again.');
        return;
    }

    // Store user info securely
    const userInfo = {
        username: user.username,
        role: user.role,
        loginTime: new Date().toISOString()
    };
    
    sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
    
    // Show success message
    showToast('Login successful!');
    
    // Redirect based on role
    if (user.role === 'admin') {
        window.location.href = 'admin.html';
    } else {
        window.location.href = 'index.html';
    }
}

// Check authentication status
function checkAuth() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
    const isLoggedIn = !!userInfo.username;
    const isAdmin = userInfo.role === 'admin';
    
    // Get current page
    const currentPage = window.location.pathname.split('/').pop();
    
    // Redirect if not authorized
    if (currentPage === 'admin.html' && (!isLoggedIn || !isAdmin)) {
        window.location.href = 'index.html';
        return false;
    }
    
    return isLoggedIn;
}

// Logout handling
function handleLogout() {
    sessionStorage.removeItem('userInfo');
    showToast('Logged out successfully');
    window.location.href = 'index.html';
}

// Update UI based on login state
function updateUIForAuth() {
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo') || '{}');
    const loginBtn = document.getElementById('loginBtn');
    const adminBtn = document.getElementById('adminBtn');
    
    if (loginBtn) {
        if (userInfo.username) {
            loginBtn.innerHTML = `
                <span class="material-icons-round">logout</span>
                Logout
            `;
            loginBtn.onclick = handleLogout;
        } else {
            loginBtn.innerHTML = `
                <span class="material-icons-round">login</span>
                Login
            `;
            loginBtn.onclick = () => window.location.href = 'admin.html';
        }
    }
    
    if (adminBtn) {
        adminBtn.style.display = userInfo.role === 'admin' ? 'block' : 'none';
    }
}

// Call this when page loads
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    updateUIForAuth();
});

// Authentication handler
function handleAuth(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    // Validate form
    if (!name || !email || !phone) {
        showToast('Please fill in all fields');
        return;
    }

    // Save user data
    const userData = { name, email, phone };
    localStorage.setItem('userData', JSON.stringify(userData));

    // Show main app
    authScreen.classList.remove('active');
    mainApp.classList.add('active');

    // Initialize app with home screen
    showScreen('home');
    initializeApp();
}

// Display food items
function displayFoodItems(category = 'all') {
    const foodGrid = document.getElementById('food-grid');
    if (!foodGrid) return;
    
    // Use foodItems array if localStorage is empty
    const foods = foodItems;
    foodGrid.innerHTML = '';
    
    const filteredFoods = category === 'all' 
        ? foods 
        : foods.filter(food => food.category === category);
    
    filteredFoods.forEach(food => {
        foodGrid.innerHTML += createFoodCard(food);
    });
}

// Filter by category
function filterByCategory(category) {
    document.querySelectorAll('.chip').forEach(chip => {
        chip.classList.remove('active');
    });
    document.querySelector(`.chip[onclick*="${category}"]`).classList.add('active');
    displayFoodItems(category);
}

// Search functionality
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const foodGrid = document.getElementById('food-grid');
    const foods = foodItems;

    if (!foodGrid) return;

    // Clear the current grid
    foodGrid.innerHTML = '';

    if (searchTerm === '') {
        // If search is empty, show all items
        displayFoodItems('all');
        return;
    }

    // Filter foods based on search term
    const filteredFoods = foods.filter(food => 
        food.name.toLowerCase().includes(searchTerm) || 
        food.category.toLowerCase().includes(searchTerm)
    );

    if (filteredFoods.length === 0) {
        foodGrid.innerHTML = `
            <div class="no-results">
                <span class="material-icons-round">search_off</span>
                <p>No items found matching "${searchTerm}"</p>
            </div>
        `;
    } else {
        filteredFoods.forEach(food => {
            foodGrid.innerHTML += createFoodCard(food);
        });
    }
}

// Create order element
function createOrderElement(order) {
    if (!order || !order.items) return null;
    
    const orderElement = document.createElement('div');
    orderElement.className = 'order-item';
    
    const orderHeader = document.createElement('div');
    orderHeader.className = 'order-header';
    
    const orderId = document.createElement('span');
    orderId.className = 'order-id';
    orderId.textContent = order.orderId || 'Unknown Order';
    
    const orderStatus = document.createElement('span');
    orderStatus.className = 'order-status';
    orderStatus.textContent = order.status || 'Delivered';
    
    orderHeader.appendChild(orderId);
    orderHeader.appendChild(orderStatus);
    
    const orderDetails = document.createElement('div');
    orderDetails.className = 'order-details';
    
    // Add items
    const itemsList = document.createElement('div');
    itemsList.className = 'order-items';
    
    order.items.forEach(item => {
        if (!item) return;
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item-detail';
        itemElement.innerHTML = `
            <span>${item.name || 'Unknown Item'}</span>
            <span>x${item.quantity || 0}</span>
            <span>₹${item.price || 0}</span>
        `;
        itemsList.appendChild(itemElement);
    });
    
    const orderTotal = document.createElement('div');
    orderTotal.className = 'order-total';
    orderTotal.innerHTML = `
        <span>Total Amount:</span>
        <span>₹${order.total || 0}</span>
    `;
    
    const orderTime = document.createElement('div');
    orderTime.className = 'order-time';
    orderTime.textContent = `Delivery Time: ${order.deliveryTime || 'Not specified'}`;
    
    orderDetails.appendChild(itemsList);
    orderDetails.appendChild(orderTotal);
    orderDetails.appendChild(orderTime);
    
    orderElement.appendChild(orderHeader);
    orderElement.appendChild(orderDetails);
    
    return orderElement;
}

// Display orders
function displayOrders() {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    ordersContainer.innerHTML = '';
    
    if (orders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-state">
                <span class="material-icons-round">receipt_long</span>
                <h3>No Orders Yet</h3>
                <p>Your order history will appear here</p>
            </div>
        `;
        return;
    }
    
    orders.reverse().forEach(order => {
        const orderElement = createOrderElement(order);
        if (orderElement) {
            ordersContainer.appendChild(orderElement);
        }
    });
}

// Show order modal
function showOrderModal(foodId) {
    const foods = JSON.parse(localStorage.getItem('foods'));
    const food = foods.find(f => f.id === foodId);
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    document.getElementById('order-food-image').src = food.image;
    document.getElementById('order-food-name').textContent = food.name;
    document.getElementById('order-food-price').textContent = `Rs ${food.price}`;
    
    document.getElementById('order-name').value = userData.name || '';
    document.getElementById('order-phone').value = userData.phone || '';
    
    document.getElementById('order-modal').classList.add('active');
    updateOrderTotal();
}

// Update order total
function updateOrderTotal() {
    const quantity = parseInt(document.getElementById('order-quantity').value);
    const price = parseInt(document.getElementById('order-food-price').textContent.slice(4));
    const total = quantity * price;
    document.getElementById('order-total-price').textContent = `Rs ${total}`;
}

// Place order
function placeOrder(event) {
    event.preventDefault();
    // Prevent form submission if required fields are empty
    const name = document.getElementById('order-name').value;
    const phone = document.getElementById('order-phone').value;
    const address = document.getElementById('order-address').value;
    
    if (!name || !phone || !address) {
        showToast('Please fill in all required fields');
        return;
    }

    const foodName = document.getElementById('order-food-name').textContent;
    const foodImage = document.getElementById('order-food-image').src;
    const quantity = parseInt(document.getElementById('order-quantity').value);
    const total = parseInt(document.getElementById('order-total-price').textContent.slice(4));
    
    const orderId = 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const deliveryDate = new Date();
    deliveryDate.setMinutes(deliveryDate.getMinutes() + 30 + Math.floor(Math.random() * 15));
    
    const orderDetails = {
        orderId: orderId,
        items: [{
            name: foodName,
            image: foodImage,
            quantity: quantity,
            price: total / quantity
        }],
        total: total,
        deliveryTime: deliveryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
    closeOrderModal();
    
    // Redirect to success page
    window.location.href = 'success.html';
}

// Modal Management
function closeOrderModal() {
    document.getElementById('order-modal').classList.remove('active');
    document.getElementById('order-form').reset();
}

function showOrderSuccessModal(order) {
    // Format order items for display
    const itemsList = order.items.map(item => 
        `${item.quantity}x ${item.name} (Rs ${item.total})`
    ).join('<br>');
    
    // Update modal content
    document.getElementById('success-order-id').textContent = `Order #${order.id}`;
    document.getElementById('success-order-items').innerHTML = itemsList;
    document.getElementById('success-order-total').textContent = `Total Amount: Rs ${order.total}`;
    document.getElementById('success-order-name').textContent = `Name: ${order.name}`;
    document.getElementById('success-order-phone').textContent = `Phone: ${order.phone}`;
    document.getElementById('success-order-address').textContent = `Address: ${order.address}`;
    
    // Show modal
    const modal = document.getElementById('order-success-modal');
    modal.classList.add('active');
}

function closeOrderSuccessModal() {
    document.getElementById('order-success-modal').classList.remove('active');
    showScreen('orders');
    displayOrders();
}

// Show screens
function showScreen(screenId) {
    // Remove active class from all screens and nav items
    document.querySelectorAll('.screen-content').forEach(screen => {
        screen.classList.remove('active');
    });
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to selected screen and nav item
    const selectedScreen = document.getElementById(screenId + '-screen');
    const selectedNavItem = document.querySelector(`.nav-item[onclick="showScreen('${screenId}')"]`);
    
    if (selectedScreen) {
        selectedScreen.classList.add('active');
    }
    if (selectedNavItem) {
        selectedNavItem.classList.add('active');
    }

    // Special handling for different screens
    if (screenId === 'search') {
        renderCart();
    } else if (screenId === 'orders') {
        displayOrders();
    }
}

// Clear all data
function clearUserData() {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
        localStorage.clear();
        location.reload();
    }
}

// Handle logout
function handleLogout() {
    try {
        // Clear all data
        localStorage.clear();
        
        // Reset cart
        cart = [];
        cartTotal = 0;
        
        // Show login screen
        authScreen.classList.add('active');
        mainApp.classList.remove('active');
        
        // Clear form fields
        if (authForm) {
            authForm.reset();
        }
        
        // Show success message
        showToast('Logged out successfully');
    } catch (error) {
        console.error('Logout error:', error);
        showToast('Error logging out. Please try again.');
    }
}

// Event listeners
if (authForm) {
    authForm.addEventListener('submit', handleAuth);
}

// Add search input event listener
if (searchInput) {
    searchInput.addEventListener('input', handleSearch);
}

document.getElementById('order-quantity').addEventListener('input', updateOrderTotal);

document.getElementById('order-form').addEventListener('submit', placeOrder);

// Initialize the app
initializeApp();

function proceedToCheckout() {
    // Check if cart is empty
    if (cart.length === 0) {
        showToast('Your cart is empty');
        return;
    }

    const modal = document.getElementById('checkout-modal');
    const checkoutItems = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    
    // Display cart items in checkout
    checkoutItems.innerHTML = '';
    cart.forEach(item => {
        const checkoutItem = document.createElement('div');
        checkoutItem.className = 'checkout-item';
        checkoutItem.innerHTML = `
            <div class="checkout-item-name">
                <span>${item.name}</span>
                <span class="checkout-item-quantity">×${item.quantity}</span>
            </div>
            <span>Rs ${item.price * item.quantity}</span>
        `;
        checkoutItems.appendChild(checkoutItem);
    });
    
    // Display total
    checkoutTotal.textContent = `Rs ${cartTotal}`;
    
    // Pre-fill form with user data if available
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (user) {
        document.getElementById('delivery-name').value = user.name || '';
        document.getElementById('delivery-phone').value = user.phone || '';
    }
    
    // Show modal
    modal.classList.add('active');
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.remove('active');
    document.getElementById('checkout-form').reset();
}

function handleCheckout(event) {
    event.preventDefault();
    
    try {
        console.log('Starting checkout process...');
        
        // Check if cart has items
        if (!cart || cart.length === 0) {
            showToast('Your cart is empty. Please add items before checking out.');
            return;
        }
        console.log('Cart validation passed:', cart);

        // Get form data
        const name = document.getElementById('delivery-name').value;
        const phone = document.getElementById('delivery-phone').value;
        const address = document.getElementById('delivery-address').value;
        const paymentMethod = document.getElementById('payment-method').value;

        console.log('Form data:', { name, phone, address, paymentMethod });

        // Basic validation
        if (!name || !phone || !address || !paymentMethod) {
            showToast('Please fill in all delivery details');
            return;
        }
        
        // Validate phone number
        if (!/^\d{10}$/.test(phone)) {
            showToast('Please enter a valid 10-digit phone number');
            return;
        }
        
        // Create order data
        const orderId = 'ORD' + Math.random().toString(36).substr(2, 9).toUpperCase();
        const deliveryDate = new Date();
        deliveryDate.setMinutes(deliveryDate.getMinutes() + 30 + Math.floor(Math.random() * 15));
        
        const orderData = {
            orderId: orderId,
            name: name,
            phone: phone,
            address: address,
            paymentMethod: paymentMethod,
            items: cart.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            total: cartTotal,
            deliveryTime: deliveryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'Confirmed'
        };

        console.log('Order data created:', orderData);

        // Save last order for success page first
        localStorage.setItem('lastOrder', JSON.stringify(orderData));
        console.log('Last order saved to localStorage');
        
        // Get existing orders
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));
        console.log('Order added to orders list');
        
        // Clear cart
        cart = [];
        cartTotal = 0;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        renderCart();
        console.log('Cart cleared');
        
        // Close checkout modal
        closeCheckoutModal();
        console.log('Checkout modal closed');
        
        // Show success message and redirect
        showToast('Order placed successfully! Redirecting...');
        window.location.href = 'success.html';
        
    } catch (error) {
        console.error('Order error details:', error);
        showToast('Error placing order. Please try again.');
    }
}

// Profile Features
function showProfileModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.add('active');
    
    // Pre-fill form data if needed
    if (modalId === 'edit-profile-modal') {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        document.getElementById('edit-name').value = userData.name || '';
        document.getElementById('edit-email').value = userData.email || '';
        document.getElementById('edit-phone').value = userData.phone || '';
    } else if (modalId === 'address-modal') {
        displayAddresses();
    } else if (modalId === 'payment-modal') {
        displayPaymentMethods();
    } else if (modalId === 'settings-modal') {
        loadSettings();
    }
}

function closeProfileModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function handleProfileUpdate(e) {
    e.preventDefault();
    const name = document.getElementById('edit-name').value;
    const email = document.getElementById('edit-email').value;
    const phone = document.getElementById('edit-phone').value;
    
    const userData = { name, email, phone };
    localStorage.setItem('userData', JSON.stringify(userData));
    
    document.getElementById('profile-name').textContent = name;
    document.getElementById('profile-email').textContent = email;
    
    showToast('Profile updated successfully');
    closeProfileModal('edit-profile-modal');
}

function handleAddressAdd(e) {
    e.preventDefault();
    const label = document.getElementById('address-label').value;
    const street = document.getElementById('street-address').value;
    const city = document.getElementById('city').value;
    
    const addresses = JSON.parse(localStorage.getItem('addresses') || '[]');
    addresses.push({ label, street, city });
    localStorage.setItem('addresses', JSON.stringify(addresses));
    
    displayAddresses();
    document.getElementById('address-form').reset();
    showToast('Address added successfully');
}

function displayAddresses() {
    const addressList = document.getElementById('address-list');
    const addresses = JSON.parse(localStorage.getItem('addresses') || '[]');
    
    addressList.innerHTML = addresses.map((addr, index) => `
        <div class="address-item">
            <div class="address-details">
                <h4>${addr.label}</h4>
                <p>${addr.street}, ${addr.city}</p>
            </div>
            <button class="button button-text" onclick="deleteAddress(${index})">
                <span class="material-icons-round">delete</span>
            </button>
        </div>
    `).join('') || '<p>No addresses saved yet</p>';
}

function deleteAddress(index) {
    const addresses = JSON.parse(localStorage.getItem('addresses') || '[]');
    addresses.splice(index, 1);
    localStorage.setItem('addresses', JSON.stringify(addresses));
    displayAddresses();
    showToast('Address deleted');
}

function handlePaymentAdd(e) {
    e.preventDefault();
    const cardNumber = document.getElementById('card-number').value;
    const cardHolder = document.getElementById('card-holder').value;
    const expiry = document.getElementById('card-expiry').value;
    
    const cards = JSON.parse(localStorage.getItem('cards') || '[]');
    cards.push({
        number: '*'.repeat(12) + cardNumber.slice(-4),
        holder: cardHolder,
        expiry: expiry
    });
    localStorage.setItem('cards', JSON.stringify(cards));
    
    displayPaymentMethods();
    document.getElementById('payment-form').reset();
    showToast('Card added successfully');
}

function displayPaymentMethods() {
    const paymentList = document.getElementById('payment-methods-list');
    const cards = JSON.parse(localStorage.getItem('cards') || '[]');
    
    paymentList.innerHTML = cards.map((card, index) => `
        <div class="payment-item">
            <div class="card-details">
                <h4>${card.holder}</h4>
                <p>${card.number}</p>
                <p>Expires: ${card.expiry}</p>
            </div>
            <button class="button button-text" onclick="deleteCard(${index})">
                <span class="material-icons-round">delete</span>
            </button>
        </div>
    `).join('') || '<p>No cards saved yet</p>';
}

function deleteCard(index) {
    const cards = JSON.parse(localStorage.getItem('cards') || '[]');
    cards.splice(index, 1);
    localStorage.setItem('cards', JSON.stringify(cards));
    displayPaymentMethods();
    showToast('Card deleted');
}

function handleSettingChange(setting) {
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    settings[setting] = document.getElementById(`${setting}-toggle`).checked;
    localStorage.setItem('settings', JSON.stringify(settings));
    showToast('Settings updated');
}

function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('settings') || '{}');
    document.getElementById('notifications-toggle').checked = settings.notifications || false;
    document.getElementById('email-updates-toggle').checked = settings.emailUpdates || false;
}

function handleContactSubmit(e) {
    e.preventDefault();
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value;
    
    // Here you would typically send this to a backend server
    console.log('Contact form submitted:', { subject, message });
    
    document.getElementById('contact-form').reset();
    showToast('Message sent successfully');
}

// Show toast message
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}
