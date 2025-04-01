/**
 * Café Aroma - User Authentication Module
 * 
 * This module handles user authentication including registration, login,
 * and session management using localStorage.
 */

// Function to check if a user is logged in
function isLoggedIn() {
    return localStorage.getItem('cafeAromaUser') !== null;
}

// Function to get current user data
function getCurrentUser() {
    const userData = localStorage.getItem('cafeAromaUser');
    return userData ? JSON.parse(userData) : null;
}

// Function to get user profile image URL or initials
function getUserProfileImage(user) {
    if (!user) return null;
    
    // If user has a custom profile image
    if (user.profileImage) {
        return user.profileImage;
    }
    
    // Otherwise, return initials
    return `${user.firstName ? user.firstName.charAt(0) : ''}${user.lastName ? user.lastName.charAt(0) : ''}`;
}

// Login function
async function login(email, password) {
    // Simulate server request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('cafeAromaUsers') || '[]');
    
    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store user data in localStorage (except password)
        const userData = { ...user };
        delete userData.password;
        localStorage.setItem('cafeAromaUser', JSON.stringify(userData));
        
        // Update all pages that need to know about the logged in user
        updateNavbarForLoggedInUser();
        
        return true;
    }
    
    return false;
}

// Register function
async function register(userData) {
    // Simulate server request delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('cafeAromaUsers') || '[]');
    
    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
        throw new Error('Este email já está em uso');
    }
    
    // Add user ID and registration date
    const newUser = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
    };
    
    // Add to users array
    users.push(newUser);
    
    // Save back to localStorage
    localStorage.setItem('cafeAromaUsers', JSON.stringify(users));
    
    return true;
}

// Logout function
function logout() {
    localStorage.removeItem('cafeAromaUser');
    
    // Update UI
    updateNavbarForLoggedInUser();
    
    // Redirect to home page if on a protected page
    const protectedPages = ['pedido.html', 'profile.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage)) {
        window.location.href = 'index.html';
    }
}

// Update navbar for logged-in user
function updateNavbarForLoggedInUser() {
    const user = getCurrentUser();
    const navbarNav = document.getElementById('navbarNav');
    
    if (!navbarNav) return;
    
    const userMenuExists = document.getElementById('userMenu');
    
    // If user menu already exists, remove it
    if (userMenuExists) {
        userMenuExists.remove();
    }
    
    if (user) {
        // Get user profile image or initials
        const profileImage = getUserProfileImage(user);
        const isInitials = !user.profileImage;
        
        // Add user menu to navbar
        const userMenu = document.createElement('ul');
        userMenu.className = 'navbar-nav ms-3';
        userMenu.id = 'userMenu';
        
        userMenu.innerHTML = `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown">
                    ${isInitials ? 
                        `<div class="user-avatar-small me-2">${profileImage}</div>` : 
                        `<img src="${profileImage}" class="user-avatar-small me-2" alt="${user.firstName}">`
                    }
                    ${user.firstName}
                </a>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li><a class="dropdown-item" href="profile.html"><i class="fas fa-id-card me-2"></i>Meu Perfil</a></li>
                    <li><a class="dropdown-item" href="pedido.html"><i class="fas fa-shopping-bag me-2"></i>Meus Pedidos</a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" id="logoutBtn"><i class="fas fa-sign-out-alt me-2"></i>Sair</a></li>
                </ul>
            </li>
        `;
        
        navbarNav.parentNode.appendChild(userMenu);
        
        // Add logout functionality
        document.getElementById('logoutBtn').addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    } else {
        // Add login/register buttons if not already present
        if (!document.getElementById('loginRegisterMenu')) {
            const loginRegisterMenu = document.createElement('ul');
            loginRegisterMenu.className = 'navbar-nav ms-3';
            loginRegisterMenu.id = 'loginRegisterMenu';
            
            loginRegisterMenu.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="login.html"><i class="fas fa-sign-in-alt me-1"></i>Login</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="register.html"><i class="fas fa-user-plus me-1"></i>Cadastro</a>
                </li>
            `;
            
            navbarNav.parentNode.appendChild(loginRegisterMenu);
        }
    }
}

// Function to update user data
async function updateUserData(userData) {
    // Get existing users
    const users = JSON.parse(localStorage.getItem('cafeAromaUsers') || '[]');
    
    // Find user by ID
    const userIndex = users.findIndex(u => u.id === userData.id);
    
    if (userIndex === -1) {
        throw new Error('Usuário não encontrado');
    }
    
    // Update user
    users[userIndex] = {
        ...users[userIndex],
        ...userData
    };
    
    // Save back to localStorage
    localStorage.setItem('cafeAromaUsers', JSON.stringify(users));
    
    // Update current user session
    localStorage.setItem('cafeAromaUser', JSON.stringify(userData));
    
    return true;
}

// Function to change password
async function changePassword(currentPassword, newPassword) {
    const user = getCurrentUser();
    
    if (!user) {
        throw new Error('Usuário não autenticado');
    }
    
    // Get existing users
    const users = JSON.parse(localStorage.getItem('cafeAromaUsers') || '[]');
    
    // Find user by ID
    const userIndex = users.findIndex(u => u.id === user.id);
    
    if (userIndex === -1) {
        throw new Error('Usuário não encontrado');
    }
    
    // Verify current password
    if (users[userIndex].password !== currentPassword) {
        throw new Error('Senha atual incorreta');
    }
    
    // Update password
    users[userIndex].password = newPassword;
    
    // Save back to localStorage
    localStorage.setItem('cafeAromaUsers', JSON.stringify(users));
    
    return true;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    updateNavbarForLoggedInUser();
});