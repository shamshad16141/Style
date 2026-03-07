// @ts-nocheck
(() => {
    window.addEventListener('DOMContentLoaded', () => {
        const user = getUserFromSession();
        if (!user) {
            window.location.href = '/login.html';
        }
    });
    function bookWithBarber(barberName) {
        sessionStorage.setItem('selectedBarber', barberName);
        window.location.href = '/booking.html';
    }
    function flipBarberCard(event, buttonElement) {
        event.stopPropagation();
        const cardElement = buttonElement.closest('.barber-card');
        cardElement.classList.toggle('flipped');
    }
    window.flipBarberCard = flipBarberCard;
    window.bookWithBarber = bookWithBarber;
})();
