/* ==========================================================================
   Cloäk & Co. | Contact Page Interactive Engine (contact.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initAccordions();
  initFormValidation();
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

// --- FAQ Accordion Interactions ---
function initAccordions() {
  const headers = document.querySelectorAll('.accordion-header');
  
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion-content');
      const isOpen = item.classList.contains('open');
      
      // Close other open accordion items
      document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('open')) {
          otherItem.classList.remove('open');
          otherItem.querySelector('.accordion-content').style.maxHeight = '0px';
        }
      });
      
      // Toggle current item
      if (isOpen) {
        item.classList.remove('open');
        content.style.maxHeight = '0px';
      } else {
        item.classList.add('open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

// --- Glass Form Validation & Success Overlay ---
function initFormValidation() {
  const form = document.getElementById('contact-form');
  const successOverlay = document.getElementById('form-success');
  const closeSuccessBtn = document.getElementById('success-close');
  
  if (!form) return;

  const inputs = form.querySelectorAll('input[required], textarea[required]');
  
  // Clear error classes on user input
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const group = input.parentElement;
      group.classList.remove('has-error');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate inputs
    inputs.forEach(input => {
      const group = input.parentElement;
      let fieldValid = true;

      // Check empty values
      if (!input.value.trim()) {
        fieldValid = false;
      } 
      // Check email format
      else if (input.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
          fieldValid = false;
        }
      }

      if (!fieldValid) {
        group.classList.add('has-error');
        isValid = false;
      } else {
        group.classList.remove('has-error');
      }
    });

    if (isValid) {
      // Trigger success confirmation screen overlay
      if (successOverlay) {
        successOverlay.classList.add('active');
      }
    }
  });

  // success overlay back-to-form trigger
  if (closeSuccessBtn && successOverlay && form) {
    closeSuccessBtn.addEventListener('click', () => {
      form.reset();
      successOverlay.classList.remove('active');
    });
  }
}
