// @ts-nocheck
(() => {
        window.addEventListener('DOMContentLoaded', () => {
            const user = getUserFromSession();
            if (!user) {
                window.location.href = '/login.html';
                return;
            }

            loadBookingSummary(user);
        });

        async function loadBookingSummary(user) {
            try {
                let booking = null;
                const latestBookingId = sessionStorage.getItem('latestBookingId');

                if (latestBookingId) {
                    try {
                        booking = await getBooking(latestBookingId);
                    } catch (_error) {
                        booking = null;
                    }
                }

                if (!booking) {
                    const bookings = await getUserBookings(user._id);
                    if (Array.isArray(bookings) && bookings.length > 0) {
                        booking = bookings[0];
                    }
                }

                if (booking) {
                    renderBookingDetails(booking);
                    return;
                }

                setFallbackDetails();
            } catch (error) {
                console.error('Failed to load booking summary:', error);
                setFallbackDetails();
            }
        }

        function renderBookingDetails(booking) {
            const bookingRef = document.getElementById('bookingRef');
            const detailService = document.getElementById('detailService');
            const detailDate = document.getElementById('detailDate');
            const detailTime = document.getElementById('detailTime');
            const detailStylist = document.getElementById('detailStylist');

            const reference = booking._id ? `#STYLE-${booking._id.slice(-6).toUpperCase()}` : '#STYLE-XXXX';
            const serviceName = booking.serviceName || sessionStorage.getItem('selectedService') || 'Haircut';
            const dateText = formatBookingDate(booking.date);
            const timeText = booking.time || 'Time not set';
            const stylistText = booking.stylist || 'Any professional';

            bookingRef.textContent = reference;
            detailService.textContent = serviceName;
            detailDate.textContent = dateText;
            detailTime.textContent = timeText;
            detailStylist.textContent = stylistText;
        }

        function formatBookingDate(dateValue) {
            if (!dateValue) {
                return 'Date not set';
            }

            const parsedDate = new Date(dateValue);
            if (Number.isNaN(parsedDate.getTime())) {
                return 'Date not set';
            }

            return parsedDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }

        function setFallbackDetails() {
            const detailService = document.getElementById('detailService');
            const detailDate = document.getElementById('detailDate');
            const detailTime = document.getElementById('detailTime');
            const detailStylist = document.getElementById('detailStylist');

            detailService.textContent = sessionStorage.getItem('selectedService') || 'Haircut';
            detailDate.textContent = 'Date not available';
            detailTime.textContent = 'Time not available';
            detailStylist.textContent = 'Any professional';
        }

})();
