// User Authentication and Menu Management

class UserAuth {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuthState();
        this.setupEventListeners();
    }

    // Check if user is logged in
    checkAuthState() {
        // Check for stored user data
        const userData = localStorage.getItem('finmetic_user');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                this.updateNavigation();
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.logout();
            }
        }
    }

    // Update navigation based on auth state
    updateNavigation() {
        const loginButton = document.querySelector('.nav__link--login');
        const navMenu = document.querySelector('.nav__menu');
        
        if (this.currentUser) {
            // User is logged in - show user menu
            if (loginButton) {
                loginButton.style.display = 'none';
            }
            
            // Create user menu if it doesn't exist
            if (!document.querySelector('.user-menu')) {
                this.createUserMenu();
            }
        } else {
            // User is not logged in - show login button
            if (loginButton) {
                loginButton.style.display = 'inline-block';
            }
            
            // Remove user menu if it exists
            const userMenu = document.querySelector('.user-menu');
            if (userMenu) {
                userMenu.remove();
            }
        }
    }

    // Create user menu HTML
    createUserMenu() {
        const navMenu = document.querySelector('.nav__menu');
        if (!navMenu) return;

        const userMenuHTML = `
            <li class="nav__item">
                <div class="user-menu">
                    <button class="user-menu__button" onclick="userAuth.toggleUserMenu()">
                        ${this.currentUser.name || this.currentUser.email}
                    </button>
                    <div class="user-menu__dropdown">
                        <a href="/app/features/dashboard/dashboard.html" class="user-menu__item">Dashboard</a>
                        <a href="/app/features/settings/settings.html" class="user-menu__item">Profile</a>
                        <button class="user-menu__item user-menu__item--logout" onclick="userAuth.logout()">Log Out</button>
                    </div>
                </div>
            </li>
        `;

        // Insert user menu before the last item (mobile toggle)
        const lastItem = navMenu.lastElementChild;
        if (lastItem && lastItem.querySelector('.nav__toggle')) {
            navMenu.insertBefore(document.createRange().createContextualFragment(userMenuHTML), lastItem);
        } else {
            navMenu.insertAdjacentHTML('beforeend', userMenuHTML);
        }
    }

    // Toggle user menu dropdown
    toggleUserMenu() {
        const button = document.querySelector('.user-menu__button');
        const dropdown = document.querySelector('.user-menu__dropdown');
        
        if (button && dropdown) {
            const isActive = button.classList.contains('user-menu__button--active');
            
            // Close all other dropdowns
            document.querySelectorAll('.user-menu__button--active').forEach(btn => {
                btn.classList.remove('user-menu__button--active');
            });
            document.querySelectorAll('.user-menu__dropdown--active').forEach(drop => {
                drop.classList.remove('user-menu__dropdown--active');
            });
            
            // Toggle current dropdown
            if (!isActive) {
                button.classList.add('user-menu__button--active');
                dropdown.classList.add('user-menu__dropdown--active');
            }
        }
    }

    // Handle login
    login(userData) {
        this.currentUser = userData;
        localStorage.setItem('finmetic_user', JSON.stringify(userData));
        this.updateNavigation();
        
        // Redirect to dashboard
        window.location.href = '/app/features/dashboard/dashboard.html';
    }

    // Handle logout
    logout() {
        this.currentUser = null;
        localStorage.removeItem('finmetic_user');
        this.updateNavigation();
        
        // Redirect to login page
        window.location.href = '/finmetic/login/login.html';
    }

    // Setup event listeners
    setupEventListeners() {
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                document.querySelectorAll('.user-menu__button--active').forEach(btn => {
                    btn.classList.remove('user-menu__button--active');
                });
                document.querySelectorAll('.user-menu__dropdown--active').forEach(drop => {
                    drop.classList.remove('user-menu__dropdown--active');
                });
            }
        });

        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.querySelectorAll('.user-menu__button--active').forEach(btn => {
                    btn.classList.remove('user-menu__button--active');
                });
                document.querySelectorAll('.user-menu__dropdown--active').forEach(drop => {
                    drop.classList.remove('user-menu__dropdown--active');
                });
            }
        });
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.currentUser;
    }
}

// Initialize user authentication
const userAuth = new UserAuth();

// Export for use in other scripts
window.userAuth = userAuth; 