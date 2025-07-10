// Login Page JavaScript

// Check authentication state on page load
async function checkAuthState() {
    try {
        // Check if AuthService is available
        if (typeof AuthService === 'undefined') {
            console.log('AuthService not available yet, skipping auth check');
            return;
        }
        
        const { user, error } = await AuthService.getCurrentUser();
        
        if (user && !error) {
            // User is already logged in, redirect to dashboard
            console.log('User already logged in:', user);
            window.location.href = '/app/index.html';
            return;
        }
    } catch (error) {
        console.log('No authenticated user found or AuthService error:', error);
    }
}

// Wait for AuthService to be available
function waitForAuthService(maxAttempts = 30) {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        
        const checkAuthService = () => {
            attempts++;
            console.log(`Checking for AuthService... attempt ${attempts}/${maxAttempts}`);
            
            if (typeof AuthService !== 'undefined' && AuthService !== null) {
                console.log('AuthService found!');
                resolve(AuthService);
            } else if (attempts >= maxAttempts) {
                console.error('AuthService not available after maximum attempts');
                reject(new Error('AuthService not available after maximum attempts. Please refresh the page.'));
            } else {
                setTimeout(checkAuthService, 200);
            }
        };
        
        checkAuthService();
    });
}

// Initialize login functionality
async function initializeLogin() {
    console.log('Initializing login page...');
    
    // Wait for AuthService to be available, then check if user is already logged in
    try {
        console.log('Waiting for AuthService...');
        await waitForAuthService();
        console.log('AuthService loaded successfully');
        await checkAuthState();
    } catch (error) {
        console.error('AuthService not available:', error.message);
        showMessage('Authentication service is not available. Please refresh the page or try again later.', 'error');
    }
    
    // Set up tab switching functionality
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and forms
            authTabs.forEach(t => t.classList.remove('auth-tab--active'));
            authForms.forEach(f => f.classList.remove('auth-form--active'));
            
            // Add active class to clicked tab and corresponding form
            this.classList.add('auth-tab--active');
            document.getElementById(targetTab + '-form').classList.add('auth-form--active');
        });
    });

    // Password confirmation validation
    const signupPassword = document.getElementById('signup-password');
    const signupConfirmPassword = document.getElementById('signup-confirm-password');
    
    if (signupConfirmPassword) {
        signupConfirmPassword.addEventListener('input', function() {
            if (this.value !== signupPassword.value) {
                this.setCustomValidity('Passwords do not match');
            } else {
                this.setCustomValidity('');
            }
        });
    }

    // Add event listeners for social buttons and forgot password
    setupEventListeners();
}

// Initialize when script loads
initializeLogin();
    
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    authTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and forms
            authTabs.forEach(t => t.classList.remove('auth-tab--active'));
            authForms.forEach(f => f.classList.remove('auth-form--active'));
            
            // Add active class to clicked tab and corresponding form
            this.classList.add('auth-tab--active');
            document.getElementById(targetTab + '-form').classList.add('auth-form--active');
        });
    });

    // Password confirmation validation
    const signupPassword = document.getElementById('signup-password');
    const signupConfirmPassword = document.getElementById('signup-confirm-password');
    
    if (signupConfirmPassword) {
        signupConfirmPassword.addEventListener('input', function() {
            if (this.value !== signupPassword.value) {
                this.setCustomValidity('Passwords do not match');
            } else {
                this.setCustomValidity('');
            }
        });
    }

// Sign In form handler
async function handleSignIn(event) {
    event.preventDefault();
    
    const email = document.getElementById('signin-email').value;
    const password = document.getElementById('signin-password').value;
    const rememberMe = document.getElementById('remember-me').checked;
    
    // Basic validation
    if (!email || !password) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('.auth-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing In...';
    submitBtn.disabled = true;
    
    try {
        // Wait for AuthService to be available
        await waitForAuthService();
        
        // Use Supabase authentication
        const { data, error } = await AuthService.signIn(email, password);
        
        if (error) {
            throw error;
        }
        
        // Successfully signed in
        showMessage('Successfully signed in!', 'success');
        
        // Create user data object
        const userData = {
            name: data.user.user_metadata?.full_name || email.split('@')[0],
            email: data.user.email,
            isLoggedIn: true,
            id: data.user.id
        };
        
        // Use the new userAuth system
        if (window.userAuth) {
            userAuth.login(userData);
        } else {
            // Fallback to localStorage
            localStorage.setItem('finmetic_user', JSON.stringify(userData));
            
            // Create initial settings
            const userSettings = {
                account: {
                    emailAddress: data.user.email,
                    fullName: userData.name,
                    phoneNumber: data.user.phone || ''
                }
            };
            localStorage.setItem('finmetic_user_settings', JSON.stringify(userSettings));
            
            console.log('User data saved:', userData);
            console.log('User settings saved:', userSettings);
            
            // Redirect to app dashboard
            setTimeout(() => {
                window.location.href = '/app/index.html';
            }, 1000);
        }
        
    } catch (error) {
        console.error('Sign in error:', error);
        showMessage(error.message || 'Failed to sign in. Please try again.', 'error');
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Sign Up form handler
async function handleSignUp(event) {
    event.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const agreeTerms = document.getElementById('agree-terms').checked;
    
    // Basic validation
    if (!name || !email || !password || !confirmPassword) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    if (password.length < 8) {
        showMessage('Password must be at least 8 characters', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showMessage('Please agree to the Terms of Service and Privacy Policy', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = event.target.querySelector('.auth-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;
    
    try {
        // Wait for AuthService to be available
        await waitForAuthService();
        
        // Use Supabase authentication
        const { data, error } = await AuthService.signUp(email, password, {
            full_name: name
        });
        
        if (error) {
            throw error;
        }
        
        // Successfully signed up
        showMessage('Account created successfully! Please check your email to verify your account.', 'success');
        
        // Save user data as JSON
        const userData = {
            name: name,
            email: email,
            isLoggedIn: true,
            id: data.user?.id
        };
        
        // Save to localStorage as JSON
        localStorage.setItem('finmetic_user', JSON.stringify(userData));
        
        // Create initial settings
        const userSettings = {
            account: {
                emailAddress: email,
                fullName: name,
                phoneNumber: ''
            }
        };
        localStorage.setItem('finmetic_user_settings', JSON.stringify(userSettings));
        
        console.log('User data saved:', userData);
        console.log('User settings saved:', userSettings);
        
        // Switch to sign in tab and redirect to app
        setTimeout(() => {
            document.querySelector('[data-tab="signin"]').click();
            // Clear sign up form
            event.target.reset();
            
            // Redirect to app dashboard
            setTimeout(() => {
                window.location.href = '/app/index.html';
            }, 500);
        }, 1000);
        
    } catch (error) {
        console.error('Sign up error:', error);
        showMessage(error.message || 'Failed to create account. Please try again.', 'error');
    } finally {
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Social authentication handlers
async function handleGoogleAuth() {
    console.log('Google authentication clicked');
    
    try {
        const { data, error } = await AuthService.signInWithGoogle();
        
        if (error) {
            throw error;
        }
        
        showMessage('Redirecting to Google...', 'info');
        
    } catch (error) {
        console.error('Google auth error:', error);
        showMessage(error.message || 'Failed to authenticate with Google. Please try again.', 'error');
    }
}

async function handleGitHubAuth() {
    console.log('GitHub authentication clicked');
    
    try {
        const { data, error } = await AuthService.signInWithGitHub();
        
        if (error) {
            throw error;
        }
        
        showMessage('Redirecting to GitHub...', 'info');
        
    } catch (error) {
        console.error('GitHub auth error:', error);
        showMessage(error.message || 'Failed to authenticate with GitHub. Please try again.', 'error');
    }
}

// Message display function
function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `auth-message auth-message--${type}`;
    messageEl.textContent = message;
    
    // Insert message at the top of the auth container
    const authContainer = document.querySelector('.auth-container');
    authContainer.insertBefore(messageEl, authContainer.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageEl.parentNode) {
            messageEl.remove();
        }
    }, 5000);
}

// Forgot password handler
async function handleForgotPassword(event) {
    event.preventDefault();
    const email = prompt('Enter your email address to reset your password:');
    if (email) {
        try {
            const { error } = await AuthService.resetPassword(email);
            
            if (error) {
                throw error;
            }
            
            showMessage('Password reset link sent to your email!', 'success');
        } catch (error) {
            console.error('Reset password error:', error);
            showMessage(error.message || 'Failed to send reset link. Please try again.', 'error');
        }
    }
}

// Add event listeners for social buttons and forgot password
function setupEventListeners() {
    // Social authentication buttons
    const googleBtns = document.querySelectorAll('.social-btn--google');
    const githubBtns = document.querySelectorAll('.social-btn--github');
    
    googleBtns.forEach(btn => {
        btn.addEventListener('click', handleGoogleAuth);
    });
    
    githubBtns.forEach(btn => {
        btn.addEventListener('click', handleGitHubAuth);
    });
    
    // Forgot password link
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', handleForgotPassword);
    }
} 