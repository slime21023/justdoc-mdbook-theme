// Add any JavaScript functionality here

document.addEventListener('DOMContentLoaded', function() {
    // Set up collapsible sections
    setupCollapsibleSections();
    
    // Set up search
    setupSearch();
    
    // Add dark mode toggle
    setupDarkMode();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add styles for the dark mode toggle
    const style = document.createElement('style');
    style.textContent = `
        .dark-mode-toggle {
            position: fixed;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            z-index: 1000;
        }
        .dark-mode-toggle:hover {
            background-color: rgba(0, 0, 0, 0.1);
        }
        body.dark-mode .dark-mode-toggle {
            color: #ffffff;
        }
        body.dark-mode .dark-mode-toggle:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
    `;
    document.head.appendChild(style);
});

function setupCollapsibleSections() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    
    toggleButtons.forEach(button => {
        // Find the child list for this button
        const childList = button.nextElementSibling;
        
        // Set initial state (collapsed)
        if (childList && childList.classList.contains('nav-list-child')) {
            childList.style.display = 'none';
        }
        
        // Add click handler
        button.addEventListener('click', function() {
            if (childList) {
                // Toggle visibility
                if (childList.style.display === 'none') {
                    childList.style.display = 'block';
                    button.querySelector('.icon').textContent = '▾';
                } else {
                    childList.style.display = 'none';
                    button.querySelector('.icon').textContent = '▸';
                }
            }
        });
    });
    
    // Expand current section
    const currentPage = window.location.pathname;
    const activeLinks = document.querySelectorAll('.nav-link');
    
    activeLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage || 
            currentPage.endsWith(link.getAttribute('href'))) {
            link.classList.add('active');
            
            // If this is inside a child list, expand the parent
            const parentList = link.closest('.nav-list-child');
            if (parentList) {
                parentList.style.display = 'block';
                const toggleBtn = parentList.previousElementSibling;
                if (toggleBtn && toggleBtn.classList.contains('toggle-btn')) {
                    toggleBtn.querySelector('.icon').textContent = '▾';
                }
            }
        }
    });
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        
        if (query.length < 2) {
            resetSearch();
            return;
        }
        
        const navItems = document.querySelectorAll('.nav-item');
        let hasResults = false;
        
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            if (!link) return;
            
            const text = link.textContent.toLowerCase();
            
            if (text.includes(query)) {
                item.style.display = 'flex';
                highlightText(link, query);
                hasResults = true;
                
                // Make sure parent lists are visible
                const parentList = item.closest('.nav-list-child');
                if (parentList) {
                    parentList.style.display = 'block';
                    const toggleBtn = parentList.previousElementSibling;
                    if (toggleBtn && toggleBtn.classList.contains('toggle-btn')) {
                        toggleBtn.querySelector('.icon').textContent = '▾';
                    }
                }
            } else {
                item.style.display = 'none';
            }
        });
        
        if (!hasResults) {
            // Show a "no results" message or similar
            console.log('No search results found');
        }
    });
    
    // Reset search when clicking outside or pressing escape
    document.addEventListener('click', function(e) {
        if (e.target !== searchInput) {
            resetSearch();
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            resetSearch();
            searchInput.value = '';
        }
    });
}

function resetSearch() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.style.display = '';
        
        const link = item.querySelector('.nav-link');
        if (link) {
            // Remove any highlighting
            link.innerHTML = link.textContent;
        }
    });
    
    // Reset any expanded sections to their default state
    setupCollapsibleSections();
}

function highlightText(element, query) {
    const text = element.textContent;
    const lowerText = text.toLowerCase();
    const index = lowerText.indexOf(query);
    
    if (index >= 0) {
        const before = text.substring(0, index);
        const match = text.substring(index, index + query.length);
        const after = text.substring(index + query.length);
        
        element.innerHTML = before + '<mark>' + match + '</mark>' + after;
    }
}

function setupDarkMode() {
    // Add dark mode toggle
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'dark-mode-toggle';
    darkModeToggle.innerHTML = '🌙';
    darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
    document.body.appendChild(darkModeToggle);

    // Check for saved dark mode preference
    const savedMode = localStorage.getItem('theme');
    if (savedMode === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '☀️';
    }

    // Toggle dark mode on click
    darkModeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.innerHTML = isDark ? '☀️' : '🌙';
    });
}
