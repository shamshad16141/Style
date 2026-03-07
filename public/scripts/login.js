// @ts-nocheck
(() => {
    // Desktop Animation Logic
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');
    signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
    });
    signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
    });
    // Mobile Switch Logic
    function toggleMobile(target) {
        const signInForm = document.getElementById('signInFormMobile');
        const signUpForm = document.getElementById('signUpFormMobile');
        if (target === 'signUp') {
            signInForm.classList.remove('mobile-active');
            signUpForm.classList.add('mobile-active');
        }
        else {
            signUpForm.classList.remove('mobile-active');
            signInForm.classList.add('mobile-active');
        }
    }
    // Handle Signup Form Submission
    async function handleSignup(event) {
        event.preventDefault();
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('signupEmail').value;
        const phone = document.getElementById('phone').value;
        const password = document.getElementById('signupPassword').value;
        const errorDiv = document.getElementById('signupError');
        const successDiv = document.getElementById('signupSuccess');
        try {
            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';
            const response = await createUser({
                firstName,
                lastName,
                email,
                phone,
                password,
                role: 'customer'
            });
            if (response.message && response.message.includes('successfully')) {
                successDiv.textContent = '✓ Account created successfully! Redirecting...';
                successDiv.style.display = 'block';
                saveUserToSession(response.user);
                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 2000);
            }
            else {
                errorDiv.textContent = response.message || 'Signup failed';
                errorDiv.style.display = 'block';
            }
        }
        catch (error) {
            errorDiv.textContent = 'Error: ' + error.message;
            errorDiv.style.display = 'block';
        }
    }
    // Handle Signin Form Submission
    async function handleSignin(event) {
        event.preventDefault();
        const email = document.getElementById('signinEmail').value;
        const password = document.getElementById('signinPassword').value;
        const errorDiv = document.getElementById('signinError');
        const successDiv = document.getElementById('signinSuccess');
        try {
            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';
            const response = await loginUser(email, password);
            if (response.message && response.message.includes('successful')) {
                successDiv.textContent = '✓ Login successful! Redirecting...';
                successDiv.style.display = 'block';
                saveUserToSession(response.user);
                // Redirect to dashboard after 2 seconds
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 2000);
            }
            else {
                errorDiv.textContent = response.message || 'Login failed';
                errorDiv.style.display = 'block';
            }
        }
        catch (error) {
            errorDiv.textContent = 'Error: ' + error.message;
            errorDiv.style.display = 'block';
        }
    }
    // Check if user is already logged in
    window.addEventListener('DOMContentLoaded', () => {
        const user = getUserFromSession();
        if (user) {
            // User already logged in, redirect to dashboard
            window.location.href = '/dashboard.html';
        }
    });
    window.toggleMobile = toggleMobile;
    window.handleSignup = handleSignup;
    window.handleSignin = handleSignin;
})();
