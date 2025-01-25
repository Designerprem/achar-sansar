document.addEventListener('DOMContentLoaded', function() {
    try {
        // Get order data from localStorage
        const orderData = JSON.parse(localStorage.getItem('lastOrder'));
        if (!orderData) {
            window.location.href = 'index.html';
            return;
        }

        // Display order ID
        document.getElementById('orderId').textContent = `Order ID: ${orderData.orderId}`;

        // Display order items
        const orderItemsContainer = document.getElementById('orderItems');
        orderData.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <span>${item.name}</span>
                <span>x${item.quantity}</span>
                <span>₹${item.price * item.quantity}</span>
            `;
            orderItemsContainer.appendChild(itemElement);
        });

        // Display total
        document.getElementById('orderTotal').innerHTML = `
            <span>Total Amount:</span>
            <span>₹${orderData.total}</span>
        `;

        // Display customer info
        const customerInfo = document.getElementById('customerInfo');
        customerInfo.innerHTML = `
            <p><strong>Name:</strong> ${orderData.name}</p>
            <p><strong>Phone:</strong> ${orderData.phone}</p>
            <p><strong>Address:</strong> ${orderData.address}</p>
            <p><strong>Payment Method:</strong> ${orderData.paymentMethod}</p>
        `;

        // Display delivery time
        document.getElementById('deliveryTime').textContent = `Estimated Delivery: ${orderData.deliveryTime}`;

        // Handle home button click
        const homeButton = document.querySelector('a[href="index.html"]');
        if (homeButton) {
            homeButton.addEventListener('click', function(e) {
                e.preventDefault();
                // Check if user data exists
                const userData = localStorage.getItem('userData');
                if (userData) {
                    // User is logged in, go to index.html and let app.js handle the auth state
                    window.location.href = 'index.html';
                } else {
                    // Clear any remaining data and go to login
                    localStorage.clear();
                    window.location.href = 'index.html';
                }
            });
        }

        // Handle download button
        document.getElementById('downloadOrder').addEventListener('click', function() {
            const orderDetails = `
Order Details
------------
Order ID: ${orderData.orderId}

Items:
${orderData.items.map(item => `- ${item.name} x${item.quantity} = ₹${item.price * item.quantity}`).join('\n')}

Total Amount: ₹${orderData.total}

Delivery Information:
- Name: ${orderData.name}
- Phone: ${orderData.phone}
- Address: ${orderData.address}
- Payment Method: ${orderData.paymentMethod}
- Estimated Delivery: ${orderData.deliveryTime}
            `.trim();

            const blob = new Blob([orderDetails], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `order-${orderData.orderId}.txt`;
            a.click();
            window.URL.revokeObjectURL(url);
        });

    } catch (error) {
        console.error('Error displaying order:', error);
        window.location.href = 'index.html';
    }
});
