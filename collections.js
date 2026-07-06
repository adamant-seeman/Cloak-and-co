/* ==========================================================================
   Cloäk & Co. | Collections Page Interactive Engine (collections.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  loadCollections();
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

// --- Luxury Product Name Mapping ---
const luxuryNamesMap = {
  'ChatGPT Image Jul 1 2026 from bumper.png': 'Signature Blossom Case',
  'ChatGPT Image Jun 29 2026 from bumper.png': 'Classic Botanical Case',
  'ChatGPT Image Jun 29 2026 from bumper (1).png': 'Elegant Petal Case',
  'ChatGPT Image Jun 29 2026 from bumper (2).png': 'Wildflower Meadow Case',
  'ChatGPT Image Jun 29 2026 from bumper (3).png': 'Lavender Bloom Case',
  'ChatGPT Image Jun 29 2026 from bumper (4).png': 'Orchid Grace Case',
  'ChatGPT Image Jun 29 2026 from bumper (5).png': 'Enchanted Garden Case'
};

// Procedural File-to-Title Parser
function getCleanProductName(filename) {
  // Decode special URL components like %20
  const decoded = decodeURIComponent(filename);
  const baseName = decoded.split('/').pop();
  
  if (luxuryNamesMap[baseName]) {
    return luxuryNamesMap[baseName];
  }
  
  // Strip file extension
  const withoutExt = baseName.substring(0, baseName.lastIndexOf('.')) || baseName;
  // Replace hyphens/underscores with spaces
  const spacedName = withoutExt.replace(/[-_]/g, ' ');
  
  // Title Case conversion
  return spacedName
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Default Fallback Array of designs in case file-fetching fails
const defaultCaseDesigns = [
  'ChatGPT Image Jul 1 2026 from bumper.png',
  'ChatGPT Image Jun 29 2026 from bumper (1).png',
  'ChatGPT Image Jun 29 2026 from bumper (2).png',
  'ChatGPT Image Jun 29 2026 from bumper (3).png',
  'ChatGPT Image Jun 29 2026 from bumper (4).png',
  'ChatGPT Image Jun 29 2026 from bumper (5).png',
  'ChatGPT Image Jun 29 2026 from bumper.png'
];

// --- Dynamic Case Image Loader ---
async function loadCollections() {
  const gridContainer = document.getElementById('collections-grid');
  const emptyState = document.getElementById('empty-state');
  
  if (!gridContainer) return;
  
  let files = [];
  
  try {
    console.log('[Cloak Debug] Querying directory index for: ./case design/');
    const response = await fetch('./case design/');
    
    if (response.ok) {
      const htmlText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlText, 'text/html');
      
      // Select all links and filter for image resources
      const linkElements = Array.from(doc.querySelectorAll('a'));
      const foundFiles = linkElements
        .map(a => a.getAttribute('href'))
        .filter(href => {
          if (!href) return false;
          const lower = href.toLowerCase();
          return lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.webp');
        });
      
      if (foundFiles.length > 0) {
        // Remove duplicate relative directory paths if any returned by index
        const uniqueFiles = [...new Set(foundFiles.map(f => f.split('/').pop()))];
        files = uniqueFiles;
        console.log(`[Cloak Debug] Dynamic loading successful! Found ${files.length} design files.`);
      }
    }
  } catch (error) {
    console.warn('[Cloak Debug] Directory fetch failed, loading static fallback sequence.', error);
  }
  
  // Fallback to static sequence if directory loading resolved empty
  if (files.length === 0) {
    files = defaultCaseDesigns;
    console.log('[Cloak Debug] Loading fallback collection list.');
  }

  // Render cards
  renderProductGrid(files, gridContainer, emptyState);
}

function renderProductGrid(filenames, grid, emptyDiv) {
  grid.innerHTML = '';
  
  if (filenames.length === 0) {
    if (emptyDiv) emptyDiv.style.display = 'flex';
    grid.style.display = 'none';
    return;
  }
  
  if (emptyDiv) emptyDiv.style.display = 'none';
  grid.style.display = 'grid';

  filenames.forEach(filename => {
    const cleanName = getCleanProductName(filename);
    // Relative path pointing to the workspace folder
    const imagePath = `case design/${filename}`;
    
    // ProductCard Component Builder
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
      <div class="card-img-wrapper">
        <img src="${imagePath}" alt="${cleanName}" loading="lazy">
      </div>
      <h3 class="card-title">${cleanName}</h3>
      <p class="card-text">Premium designer phone case</p>
      <a href="index.html#shop" class="view-design-btn">View Design</a>
    `;
    
    grid.appendChild(card);
  });
}
