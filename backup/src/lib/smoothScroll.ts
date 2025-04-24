/**
 * Initializes smooth scrolling for anchor links
 * Sets up event listeners for all anchor tags with href starting with #
 */
export const initSmoothScroll = (): void => {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (href) {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });
}; 