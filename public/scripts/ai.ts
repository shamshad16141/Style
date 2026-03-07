// @ts-nocheck
(() => {
        window.addEventListener('DOMContentLoaded', () => {
            const user = getUserFromSession();
            if (!user) {
                window.location.href = '/login.html';
                return;
            }

            document.getElementById('userInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') sendMessage();
            });
        });

        function sendMessage() {
            const input = document.getElementById('userInput');
            const message = input.value.trim();
            
            if (!message) return;

            const chatContainer = document.getElementById('chatContainer');
            
            // Add user message
            const userMsg = document.createElement('div');
            userMsg.className = 'message user';
            userMsg.innerHTML = `
                <div class="message-avatar">👤</div>
                <div class="message-content">${message}</div>
            `;
            chatContainer.appendChild(userMsg);

            input.value = '';

            // Simulate AI response
            setTimeout(() => {
                const aiMsg = document.createElement('div');
                aiMsg.className = 'message ai';
                aiMsg.innerHTML = `
                    <div class="message-avatar">🤖</div>
                    <div class="message-content">
                        That's a great question! Based on your inquiry, I recommend booking a consultation with one of our professional stylists. They can provide personalized advice tailored to your specific needs and hair type.
                    </div>
                `;
                chatContainer.appendChild(aiMsg);
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }, 500);

            chatContainer.scrollTop = chatContainer.scrollHeight;
        }


(window as any).sendMessage = sendMessage;
})();
