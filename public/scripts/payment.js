// @ts-nocheck
(() => {
    // Service pricing mapping
    const servicePrices = {
        'Haircut': 25,
        'Beard Trim': 15,
        'Hair Wash': 10,
        'Shave': 20,
        'Hair Coloring': 40,
        'Package Deal': 45,
        'Classic Shave': 20
    };
    window.addEventListener('DOMContentLoaded', () => {
        const user = getUserFromSession();
        if (!user) {
            window.location.href = '/login.html';
            return;
        }
        // Get selected service from sessionStorage and display correct amount
        const selectedService = sessionStorage.getItem('selectedService') || 'Haircut';
        const amount = servicePrices[selectedService] || 25;
        document.getElementById('amountDisplay').textContent = `$${amount.toFixed(2)}`;
        document.getElementById('paymentForm').addEventListener('submit', handlePayment);
        // Update card display in real time
        document.getElementById('cardName').addEventListener('input', updateCardDisplay);
        document.getElementById('cardNumber').addEventListener('input', updateCardDisplay);
        document.getElementById('expiry').addEventListener('input', updateCardDisplay);
        document.getElementById('cvv').addEventListener('input', updateCardDisplay);
    });
    function updateCardDisplay() {
        const cardName = document.getElementById('cardName').value || 'YOUR NAME';
        const cardNumber = document.getElementById('cardNumber').value || '';
        const expiry = document.getElementById('expiry').value || 'MM/YY';
        const cvv = document.getElementById('cvv').value || '';
        // Update front of card
        document.getElementById('displayName').textContent = cardName.toUpperCase();
        document.getElementById('displayExpiry').textContent = expiry || 'MM/YY';
        // Format and display card number
        const formattedNumber = formatCardNumber(cardNumber);
        const displayNumber = formattedNumber.length > 0 ? formattedNumber : '•••• •••• •••• ••••';
        document.getElementById('displayCardNumber').textContent = displayNumber;
        // Update back of card - mask CVV except last digit
        const maskedCVV = cvv.length > 0 ? '*'.repeat(Math.max(0, cvv.length - 1)) + cvv.charAt(cvv.length - 1) : '•••';
        const displayCVV = document.getElementById('displayCVV');
        if (displayCVV) {
            displayCVV.textContent = maskedCVV;
        }
    }
    function formatCardNumber(value) {
        return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    }
    function formatExpiry(value) {
        return value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2').substring(0, 5);
    }
    document.getElementById('cardNumber').addEventListener('input', (e) => {
        e.target.value = formatCardNumber(e.target.value);
        updateCardDisplay();
    });
    document.getElementById('expiry').addEventListener('input', (e) => {
        e.target.value = formatExpiry(e.target.value);
        updateCardDisplay();
    });
    async function handlePayment(e) {
        e.preventDefault();
        const messageDiv = document.getElementById('message');
        messageDiv.classList.remove('show');
        // In a real application, you would send this to a payment processor
        // For now, we'll just simulate a successful payment
        messageDiv.textContent = '✓ Payment processed successfully! Redirecting...';
        messageDiv.className = 'message success show';
        setTimeout(() => {
            window.location.href = '/summary.html';
        }, 2000);
    }
})();
