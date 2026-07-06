/* ==========================================================================
   Cloäk & Co. | About Us Page Interactive Engine (about.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
});

// --- Floating Glass Navbar Interactions ---
function initNavbar() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navbar = document.querySelector('.glass-navbar');
  
  if (mobileMenuToggle && navbar) {
    mobileMenuToggle.addEventListener('click', () => {
      navbar.classList.toggle('mobile-menu-active');
    });
    
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        navbar.classList.remove('mobile-menu-active');
      });
    });
  }

  // Hide navbar on scroll down, show on scroll up
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 100) {
      if (currentScrollY > lastScrollY && !navbar.classList.contains('mobile-menu-active')) {
        navbar.style.transform = 'translate(-50%, -100px)';
      } else {
        navbar.style.transform = 'translate(-50%, 0)';
      }
    } else {
      navbar.style.transform = 'translate(-50%, 0)';
    }
    lastScrollY = currentScrollY;
  });
}

// --- Viewport Intersection Observer for Scroll Fade-Ups ---
function initScrollAnimations() {
  const fadeElements = document.querySelectorAll('.fade-up');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null, // Viewport
      threshold: 0.12, // Trigger when 12% of the element is visible
      rootMargin: '0px 0px -50px 0px' // Offset trigger for a more natural feel
    };

    const observer = new IntersectionObserver((entries, self) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          self.unobserve(entry.target); // Animate once
        }
      });
    }, observerOptions);

    fadeElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    fadeElements.forEach(element => {
      element.classList.add('visible');
    });
  }
}
