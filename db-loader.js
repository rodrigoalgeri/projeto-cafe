// This script ensures the database is loaded before any other scripts that depend on it
document.addEventListener('DOMContentLoaded', function() {
    if (!window.CafeAromaDB) {
        console.error('Database module not loaded! Make sure database.js is included before other scripts.');
    }
});