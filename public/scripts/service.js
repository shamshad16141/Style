// @ts-nocheck
(() => {
    window.addEventListener('DOMContentLoaded', () => {
        const user = getUserFromSession();
        if (!user) {
            window.location.href = '/login.html';
        }
    });
    function selectService(serviceName) {
        sessionStorage.setItem('selectedService', serviceName);
        window.location.href = '/barbur.html';
    }
    function flipServiceCard(event, buttonElement) {
        event.stopPropagation();
        const cardElement = buttonElement.closest('.service-card');
        cardElement.classList.toggle('flipped');
    }
    function bookService(event, serviceName) {
        event.stopPropagation();
        selectService(serviceName);
    }
    window.flipServiceCard = flipServiceCard;
    window.bookService = bookService;
})();
