/**
 * Initializes smooth scrolling for anchor links
 * Sets up event listeners for all anchor tags with href attributes starting with #
 */
export function initSmoothScroll() {
  // Wait for the DOM to be fully loaded
  if (typeof document === 'undefined') return;
  
  // Select all anchor links with href starting with #
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  // Add click event listeners to each anchor link
  anchorLinks.forEach((link) => {
    link.addEventListener('click', function (e) {
      // Prevent default anchor click behavior
      e.preventDefault();
      
      // Get the href attribute
      const href = this.getAttribute('href');
      
      if (!href) return;
      
      // Get the corresponding element
      const targetElement = document.querySelector(href);
      
      // If the element exists, scroll to it smoothly
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
} 