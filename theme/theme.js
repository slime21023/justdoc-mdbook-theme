// Just the Docs Theme for mdbook
// Main JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
  // Initialize theme
  initTheme();
  
  // Setup sidebar functionality
  setupSidebar();
  
  // Setup table of contents
  setupTableOfContents();
  
  // Setup search functionality
  setupSearch();
  
  // Setup copy code buttons
  setupCodeBlocks();
  
  // Setup smooth scrolling for anchor links
  setupSmoothScrolling();
});

/**
 * Initialize theme preferences
 */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  
  // Check for saved theme preference or use OS preference
  const savedTheme = localStorage.getItem('theme');
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
    document.body.classList.add('dark-mode');
    updateThemeToggleIcon(true);
  } else {
    document.body.classList.remove('dark-mode');
    updateThemeToggleIcon(false);
  }
  
  // Add theme toggle click handler
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      const isDarkMode = document.body.classList.toggle('dark-mode');
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      updateThemeToggleIcon(isDarkMode);
    });
  }
  
  // Listen for OS theme changes
  prefersDarkScheme.addEventListener('change', e => {
    if (!localStorage.getItem('theme')) {
      if (e.matches) {
        document.body.classList.add('dark-mode');
        updateThemeToggleIcon(true);
      } else {
        document.body.classList.remove('dark-mode');
        updateThemeToggleIcon(false);
      }
    }
  });
}

/**
 * Update theme toggle button icons
 */
function updateThemeToggleIcon(isDarkMode) {
  const lightIcon = document.querySelector('.theme-icon-light');
  const darkIcon = document.querySelector('.theme-icon-dark');
  
  if (lightIcon && darkIcon) {
    if (isDarkMode) {
      lightIcon.style.display = 'none';
      darkIcon.style.display = 'block';
    } else {
      lightIcon.style.display = 'block';
      darkIcon.style.display = 'none';
    }
  }
}

/**
 * Setup sidebar functionality
 */
function setupSidebar() {
  // Setup toggle buttons for sidebar items
  const toggleButtons = document.querySelectorAll('.toggle-btn');
  
  toggleButtons.forEach(button => {
    // Add click handler
    button.addEventListener('click', function() {
      const expanded = this.getAttribute('data-expanded') === 'true';
      const navItem = this.closest('.nav-item');
      const childList = navItem.querySelector('.nav-list-child');
      
      if (childList) {
        if (expanded) {
          childList.style.display = 'none';
          this.setAttribute('data-expanded', 'false');
        } else {
          childList.style.display = 'block';
          this.setAttribute('data-expanded', 'true');
        }
      }
    });
  });
  
  // Toggle sidebar on mobile
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', function() {
      sidebar.classList.toggle('sidebar-visible');
    });
  }
  
  // Close sidebar when clicking outside of it on mobile
  document.addEventListener('click', function(event) {
    if (window.innerWidth <= 768 && 
        sidebar && 
        sidebar.classList.contains('sidebar-visible') && 
        !sidebar.contains(event.target) && 
        !sidebarToggle.contains(event.target)) {
      sidebar.classList.remove('sidebar-visible');
    }
  });
}

/**
 * Generate and setup table of contents
 */
function setupTableOfContents() {
  const contentElement = document.getElementById('content');
  const tocContainer = document.getElementById('page-toc-container');
  
  if (!contentElement || !tocContainer) return;
  
  // Find all headings in content
  const headings = contentElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  if (headings.length <= 1) {
    // Hide TOC if there's only the page title or no headings
    const toc = document.getElementById('toc');
    if (toc) toc.style.display = 'none';
    return;
  }
  
  // Create TOC
  const tocList = document.createElement('ul');
  tocList.className = 'toc-list';
  
  let prevLevel = 0;
  let lists = [tocList];
  
  headings.forEach((heading, index) => {
    // Skip the first h1 which is usually the page title
    if (index === 0 && heading.tagName === 'H1') return;
    
    // Get heading level and create anchor
    const level = parseInt(heading.tagName.substring(1));
    
    // Create an ID if the heading doesn't have one
    if (!heading.id) {
      heading.id = heading.textContent.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
    }
    
    // Create list item
    const listItem = document.createElement('li');
    listItem.className = 'toc-list-item';
    
    // Create link
    const link = document.createElement('a');
    link.href = `#${heading.id}`;
    link.textContent = heading.textContent;
    
    // Add active class on click
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Remove active class from all TOC items
      document.querySelectorAll('.toc-list-item').forEach(item => {
        item.classList.remove('active');
      });
      
      // Add active class to clicked item
      listItem.classList.add('active');
      
      // Scroll to heading
      document.getElementById(heading.id).scrollIntoView({
        behavior: 'smooth'
      });
    });
    
    listItem.appendChild(link);
    
    // Handle list nesting
    if (level > prevLevel) {
      // Create a new nested list
      const nestedList = document.createElement('ul');
      nestedList.className = 'toc-list-level-' + level;
      lists[prevLevel - 1].lastChild.appendChild(nestedList);
      lists.push(nestedList);
    } else if (level < prevLevel) {
      // Go back to parent list
      lists = lists.slice(0, level);
    }
    
    // Add item to the appropriate list
    lists[lists.length - 1].appendChild(listItem);
    
    prevLevel = level;
  });
  
  tocContainer.appendChild(tocList);
  
  // Highlight current section while scrolling
  window.addEventListener('scroll', highlightTocOnScroll);
}

/**
 * Highlight current section in TOC while scrolling
 */
function highlightTocOnScroll() {
  const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
  if (!headings.length) return;
  
  let currentHeadingId = null;
  const scrollPosition = window.scrollY + 100; // Offset to highlight slightly before reaching heading
  
  // Find the current heading
  for (let i = 0; i < headings.length; i++) {
    if (headings[i].offsetTop > scrollPosition) {
      currentHeadingId = i > 0 ? headings[i - 1].id : headings[0].id;
      break;
    }
    
    // If we're at the last heading
    if (i === headings.length - 1) {
      currentHeadingId = headings[i].id;
    }
  }
  
  if (currentHeadingId) {
    // Remove active class from all TOC items
    document.querySelectorAll('.toc-list-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // Add active class to current item
    const currentTocItem = document.querySelector(`.toc-list-item a[href="#${currentHeadingId}"]`);
    if (currentTocItem) {
      currentTocItem.parentElement.classList.add('active');
    }
  }
}

/**
 * Setup search functionality
 */
function setupSearch() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');
  
  if (!searchInput || !searchResults) return;
  
  // Map of all navigation links for search
  const navLinks = Array.from(document.querySelectorAll('.nav-link')).map(link => {
    return {
      url: link.getAttribute('href'),
      title: link.textContent.trim(),
      element: link
    };
  });
  
  searchInput.addEventListener('input', debounce(function() {
    const query = this.value.toLowerCase().trim();
    
    // Clear previous results
    searchResults.innerHTML = '';
    
    if (query.length < 2) {
      searchResults.style.display = 'none';
      return;
    }
    
    // Find matches
    const matches = navLinks.filter(item => 
      item.title.toLowerCase().includes(query)
    );
    
    if (matches.length === 0) {
      searchResults.style.display = 'block';
      const noResults = document.createElement('div');
      noResults.className = 'search-no-results';
      noResults.textContent = 'No results found';
      searchResults.appendChild(noResults);
      return;
    }
    
    // Display results
    searchResults.style.display = 'block';
    
    matches.slice(0, 10).forEach(match => {
      const resultItem = document.createElement('a');
      resultItem.className = 'search-result-item';
      resultItem.href = match.url;
      
      // Highlight matching text
      const highlightedTitle = highlightText(match.title, query);
      resultItem.innerHTML = highlightedTitle;
      
      searchResults.appendChild(resultItem);
    });
  }, 200));
  
  // Close search results when clicking outside
  document.addEventListener('click', function(e) {
    if (e.target !== searchInput && !searchResults.contains(e.target)) {
      searchResults.style.display = 'none';
    }
  });
  
  // Handle keyboard navigation in search results
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      searchResults.style.display = 'none';
      searchInput.value = '';
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const firstResult = searchResults.querySelector('.search-result-item');
      if (firstResult) firstResult.focus();
    }
  });
}

/**
 * Highlight matching text
 */
function highlightText(text, query) {
  const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'));
  
  return parts.map(part => 
    part.toLowerCase() === query.toLowerCase() 
      ? `<mark>${part}</mark>` 
      : part
  ).join('');
}

/**
 * Setup copy buttons for code blocks
 */
function setupCodeBlocks() {
  const codeBlocks = document.querySelectorAll('pre');
  
  codeBlocks.forEach(block => {
    // Create copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.textContent = 'Copy';
    
    // Position the button
    block.style.position = 'relative';
    block.appendChild(copyButton);
    
    // Add click handler
    copyButton.addEventListener('click', function() {
      const code = block.querySelector('code').textContent;
      
      // Copy to clipboard
      navigator.clipboard.writeText(code).then(
        () => {
          // Success feedback
          copyButton.textContent = 'Copied!';
          setTimeout(() => {
            copyButton.textContent = 'Copy';
          }, 2000);
        },
        () => {
          // Error feedback
          copyButton.textContent = 'Failed!';
          setTimeout(() => {
            copyButton.textContent = 'Copy';
          }, 2000);
        }
      );
    });
  });
}

/**
 * Setup smooth scrolling for anchor links
 */
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Debounce function for performance
 */
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}
