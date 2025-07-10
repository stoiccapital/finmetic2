class WebsiteNavbar {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupNavbar());
        } else {
            this.setupNavbar();
        }
    }

    setupNavbar() {
        const navToggle = document.querySelector('.nav__toggle');
        const navMenu = document.querySelector('.nav__menu');
        
        if (!navToggle || !navMenu) {
            console.warn('Navbar elements not found');
            return;
        }

        // Set active nav item based on current page
        this.setActiveNavItem();

        // Check user authentication status
        this.checkAuthStatus();

        // Listen for authentication state changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'finmetic_user' || e.key === 'finmetic_user_settings') {
                this.checkAuthStatus();
            }
        });

        // Toggle mobile menu
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            navToggle.classList.toggle('nav__toggle--active');
            navMenu.classList.toggle('nav__menu--active');
        });
        
        // Close menu when clicking on a nav link (mobile)
        const navLinks = document.querySelectorAll('.nav__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('nav__toggle--active');
                navMenu.classList.remove('nav__menu--active');
            });
        });
        
        // Close menu when clicking outside (mobile)
        document.addEventListener('click', (event) => {
            const isClickInsideNav = navToggle.contains(event.target) || navMenu.contains(event.target);
            
            if (!isClickInsideNav && navMenu.classList.contains('nav__menu--active')) {
                navToggle.classList.remove('nav__toggle--active');
                navMenu.classList.remove('nav__menu--active');
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navToggle.classList.remove('nav__toggle--active');
                navMenu.classList.remove('nav__menu--active');
            }
        });
    }

    setActiveNavItem() {
        const currentPath = window.location.pathname;
        
        // Remove all active classes first
        document.querySelectorAll('.nav__link').forEach(link => {
            link.classList.remove('nav__link--active');
        });
        
        // Set active class based on current page
        if (currentPath.includes('/blogs/')) {
            const blogsLink = document.getElementById('nav-blogs');
            if (blogsLink) blogsLink.classList.add('nav__link--active');
        } else if (currentPath.includes('/free-tools/')) {
            const freeToolsLink = document.getElementById('nav-free-tools');
            if (freeToolsLink) freeToolsLink.classList.add('nav__link--active');
        }
    }

    checkAuthStatus() {
        // Check if user is logged in by looking for user data in localStorage
        const userData = localStorage.getItem('finmetic_user');
        const userSettings = localStorage.getItem('finmetic_user_settings');
        
        const loginLink = document.getElementById('nav-login');
        if (!loginLink) return;

        if (userData) {
            try {
                const user = JSON.parse(userData);
                const settings = userSettings ? JSON.parse(userSettings) : null;
                
                // Get user name from settings or user data
                const userName = settings?.account?.fullName || user.name || user.email || 'User';
                
                // Update the login link to show user name
                loginLink.textContent = userName;
                loginLink.href = '/app/'; // Redirect to app when logged in
                loginLink.classList.add('nav__link--user');
                
                console.log('User logged in:', userName);
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.showLoginLink();
            }
        } else {
            this.showLoginLink();
        }
    }

    showLoginLink() {
        const loginLink = document.getElementById('nav-login');
        if (loginLink) {
            loginLink.textContent = 'Log In';
            loginLink.href = '/finmetic/login/login.html';
            loginLink.classList.remove('nav__link--user');
        }
    }
}

// Initialize the website navbar
console.log('Website navbar script loaded');
window.websiteNavbar = new WebsiteNavbar(); 