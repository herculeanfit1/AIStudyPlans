/**
 * AIStudyPlans Admin Authentication Utility
 * 
 * This script provides developer utilities for admin authentication.
 * For development use only.
 */

// Simple authentication utility
const AdminAuth = {
  /**
   * Set admin authentication in browser storage
   * @returns {boolean} Success status
   */
  login: function() {
    try {
      // Set localStorage
      localStorage.setItem('isAdmin', 'true');
      
      // Set cookie
      document.cookie = "isAdmin=true; path=/; max-age=86400";
      
      console.log('✅ Admin authentication set successfully');
      console.log('📌 You can now access admin pages at /admin');
      
      return true;
    } catch (err) {
      console.error('❌ Authentication error:', err);
      return false;
    }
  },
  
  /**
   * Remove admin authentication
   * @returns {boolean} Success status
   */
  logout: function() {
    try {
      // Clear localStorage
      localStorage.removeItem('isAdmin');
      
      // Clear cookie
      document.cookie = "isAdmin=false; path=/; max-age=0";
      
      console.log('✅ Admin authentication cleared');
      
      return true;
    } catch (err) {
      console.error('❌ Logout error:', err);
      return false;
    }
  },
  
  /**
   * Check current authentication status
   * @returns {boolean} Whether user is authenticated as admin
   */
  status: function() {
    try {
      const localStorageAdmin = localStorage.getItem('isAdmin') === 'true';
      const cookieAdmin = document.cookie.includes('isAdmin=true');
      
      console.log('📊 Authentication status:');
      console.log(`- LocalStorage: ${localStorageAdmin ? '✅ Authenticated' : '❌ Not authenticated'}`);
      console.log(`- Cookie: ${cookieAdmin ? '✅ Authenticated' : '❌ Not authenticated'}`);
      
      return localStorageAdmin || cookieAdmin;
    } catch (err) {
      console.error('❌ Status check error:', err);
      return false;
    }
  },
  
  /**
   * Go to admin monitoring page
   */
  monitoring: function() {
    if (this.login()) {
      window.location.href = '/admin/settings?tab=monitoring';
    }
  }
};

// Make available in global scope for console use
window.AdminAuth = AdminAuth;

// Log instructions to console if script is loaded directly
console.log('🔧 Admin Authentication Utility loaded');
console.log('- Use AdminAuth.login() to authenticate');
console.log('- Use AdminAuth.logout() to log out');
console.log('- Use AdminAuth.status() to check status');
console.log('- Use AdminAuth.monitoring() to go to monitoring'); 