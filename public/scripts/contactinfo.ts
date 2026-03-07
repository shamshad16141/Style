// @ts-nocheck
(() => {
        window.addEventListener('DOMContentLoaded', () => {
            const user = getUserFromSession();
            if (!user) {
                window.location.href = '/login.html';
                return;
            }

            document.getElementById('email').value = user.email || '';
            document.getElementById('contactForm').addEventListener('submit', handleSubmit);
        });

        async function handleSubmit(e) {
            e.preventDefault();
            const messageDiv = document.getElementById('message');
            messageDiv.classList.remove('show');

            const user = getUserFromSession();
            const formData = new FormData(e.target);

            try {
                await updateUser(user._id, {
                    address: formData.get('address'),
                    phone: formData.get('phone'),
                    email: formData.get('email')
                });

                messageDiv.textContent = '✓ Booking confirmed! Redirecting...';
                messageDiv.className = 'message success show';

                setTimeout(() => {
                    window.location.href = '/payment.html';
                }, 2000);
            } catch (error) {
                messageDiv.textContent = 'Error: ' + error.message;
                messageDiv.className = 'message error show';
            }
        }


})();
