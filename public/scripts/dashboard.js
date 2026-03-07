// @ts-nocheck
(() => {
    window.addEventListener('DOMContentLoaded', async () => {
        const user = getUserFromSession();
        if (!user) {
            window.location.href = '/login.html';
            return;
        }
        // Set user name
        document.getElementById('userName').textContent = user.firstName || 'Buddy';
        // Load user bookings
        try {
            const bookings = await getUserBookings(user._id);
            if (bookings && bookings.length > 0) {
                const currentBooking = bookings[0]; // Get first/most recent
                updateBookingPreview(currentBooking);
            }
        }
        catch (error) {
            console.log('No bookings found:', error.message);
        }
        // Handle card clicks
        document.getElementById('viewBookingCard').addEventListener('click', () => {
            document.getElementById('viewBookingCard').classList.add('pulse');
            setTimeout(() => {
                window.location.href = '/summary.html';
            }, 300);
        });
        document.getElementById('bookSlotCard').addEventListener('click', () => {
            document.getElementById('bookSlotCard').classList.add('pulse');
            setTimeout(() => {
                window.location.href = '/service.html';
            }, 300);
        });
        // Logout button
        document.getElementById('logoutBtn').addEventListener('click', () => {
            clearUserSession();
            window.location.href = '/login.html';
        });
        // Settings link
        document.getElementById('settingsLink').addEventListener('click', () => {
            window.location.href = '/dashboard.html';
        });
    });
    function updateBookingPreview(booking) {
        const preview = document.getElementById('bookingPreview');
        const badge = document.getElementById('bookingBadge');
        const dateObj = new Date(booking.date);
        const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        preview.innerHTML = `
                <div class="preview-row">
                    <i class="fas fa-cut"></i>
                    <span class="preview-label">service</span>
                    <span class="preview-value">${booking.serviceName || 'Haircut'}</span>
                </div>
                <div class="preview-row">
                    <i class="fas fa-clock"></i>
                    <span class="preview-label">date</span>
                    <span class="preview-value">${dateStr} · ${booking.time}</span>
                </div>
                <div class="preview-row">
                    <i class="fas fa-user"></i>
                    <span class="preview-label">stylist</span>
                    <span class="preview-value">${booking.stylist || 'Any professional'}</span>
                </div>
                <div class="preview-row">
                    <i class="fas fa-check"></i>
                    <span class="preview-label">status</span>
                    <span class="preview-value" style="text-transform: capitalize;">${booking.status}</span>
                </div>
            `;
        badge.textContent = booking.status === 'confirmed' ? 'active' : booking.status;
    }
})();
