// @ts-nocheck
(() => {
    window.addEventListener('DOMContentLoaded', () => {
        const user = getUserFromSession();
        if (!user || user.role !== 'admin') {
            window.location.href = '/login.html';
            return;
        }
        loadAdminData();
    });
    async function loadAdminData() {
        try {
            const bookings = await APIFetch('/api/bookings');
            if (Array.isArray(bookings)) {
                document.getElementById('totalBookings').textContent = bookings.length;
                const confirmed = bookings.filter(b => b.status === 'confirmed').length;
                document.getElementById('confirmedToday').textContent = confirmed;
                const revenue = bookings.reduce((sum, b) => sum + (b.price || 25), 0);
                document.getElementById('revenue').textContent = '$' + revenue;
                populateTable(bookings);
            }
        }
        catch (error) {
            console.log('Error loading data:', error);
        }
    }
    function populateTable(bookings) {
        const tbody = document.getElementById('tableBody');
        tbody.innerHTML = bookings.map(b => `
                <tr>
                    <td>${b._id.substring(0, 8)}</td>
                    <td>${b.customerName || 'Unknown'}</td>
                    <td>${b.serviceName || '-'}</td>
                    <td>${new Date(b.date).toLocaleDateString()}</td>
                    <td>${b.time || '-'}</td>
                    <td>
                        <span class="status-badge status-${b.status}">
                            ${b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                        </span>
                    </td>
                </tr>
            `).join('');
        if (bookings.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No bookings found</td></tr>';
        }
    }
    async function APIFetch(url) {
        try {
            const response = await fetch(url);
            return await response.json();
        }
        catch (error) {
            throw error;
        }
    }
    function logout() {
        clearUserSession();
        window.location.href = '/login.html';
    }
    window.logout = logout;
})();
