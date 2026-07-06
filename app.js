/* ==========================================================================
   Cloäk & Co. | Premium Landing Page Engine (app.js)
   ========================================================================== */

// --- Debug Error Logging Overlay ---
window.onerror = function (message, source, lineno, colno, error) {
  const errDiv = document.getElementById('debug-log') || document.createElement('div');
  errDiv.id = 'debug-log';
  errDiv.style.position = 'fixed';
  errDiv.style.top = '10px';
  errDiv.style.left = '10px';
  errDiv.style.padding = '15px';
  errDiv.style.background = 'rgba(255, 0, 0, 0.9)';
  errDiv.style.color = '#fff';
  errDiv.style.zIndex = '999999';
  errDiv.style.fontFamily = 'monospace';
  errDiv.style.fontSize = '12px';
  errDiv.style.borderRadius = '8px';
  errDiv.style.maxHeight = '80vh';
  errDiv.style.overflowY = 'auto';
  errDiv.innerHTML = `<strong>JS Error:</strong> ${message}<br>at ${source}:${lineno}:${colno}`;
  document.body.appendChild(errDiv);
  return false;
};

window.addEventListener('unhandledrejection', function (event) {
  const errDiv = document.getElementById('debug-log') || document.createElement('div');
  errDiv.id = 'debug-log';
  errDiv.style.position = 'fixed';
  errDiv.style.top = '100px';
  errDiv.style.left = '10px';
  errDiv.style.padding = '15px';
  errDiv.style.background = 'rgba(255, 68, 68, 0.9)';
  errDiv.style.color = '#fff';
  errDiv.style.zIndex = '999999';
  errDiv.style.fontFamily = 'monospace';
  errDiv.style.fontSize = '12px';
  errDiv.style.borderRadius = '8px';
  errDiv.innerHTML = `<strong>Promise Rejection:</strong> ${event.reason}`;
  document.body.appendChild(errDiv);
});

// --- Main Initialization ---
function initEngine() {
  
  // --- UI Elements ---
  const canvas = document.getElementById('hero-canvas');
  const ctx = canvas.getContext('2d');
  const cardStack = document.getElementById('cards-wrapper');
  const cards = document.querySelectorAll('.glass-card');
  const canvasOverlay = document.querySelector('.canvas-overlay');
  const finalSection = document.getElementById('shop');
  const loaderOverlay = document.getElementById('loader-overlay');
  const loaderBar = document.getElementById('loader-bar');
  const loaderText = document.getElementById('loader-text');
  
  // --- Scene 1 Cinematic Settings ---
  const scene1FrameCount = 94;
  const scene1Images = [];
  let scene1LoadedCount = 0;
  let scene1Playing = true;
  let currentScene1Frame = 0;
  
  // --- Existing Website Settings ---
  const frameCount = 192;
  const images = [];
  let loadedCount = 0;
  
  let currentFrame = 1;
  let targetFrame = 1;
  let lastRenderedFrame = -1;
  
  // --- Path Helpers ---
  function getScene1Path(index) {
    const pad = String(index).padStart(5, '0');
    return `scene 1/${pad}.png`;
  }
  
  function getFramePath(index) {
    const pad = String(index).padStart(5, '0');
    return `frames/${pad}.png`;
  }
  
  // --- Scroll Lock Utilities ---
  function disableScroll() {
    document.body.classList.add('scene1-active');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    if (typeof lenis !== 'undefined' && lenis) {
      lenis.stop();
    }
  }
  
  function enableScroll() {
    document.body.classList.remove('scene1-active');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.height = '';
    if (typeof lenis !== 'undefined' && lenis) {
      lenis.start();
    }
    ScrollTrigger.refresh();
  }
  
  // --- Scene 1 Preloader ---
  function preloadScene1() {
    disableScroll();
    
    for (let i = 1; i <= scene1FrameCount; i++) {
      const img = new Image();
      img.src = getScene1Path(i);
      img.onload = () => {
        scene1Images[i - 1] = img;
        scene1LoadedCount++;
        
        const percent = Math.round((scene1LoadedCount / scene1FrameCount) * 100);
        if (loaderText) loaderText.textContent = `Loading Intro Cinematic... ${percent}%`;
        if (loaderBar) loaderBar.style.width = `${percent}%`;
        
        if (scene1LoadedCount === scene1FrameCount) {
          console.log(`[Cloak Debug] Scene 1 preloading complete. Total: ${scene1LoadedCount}`);
          hideLoader();
          startScene1();
        }
      };
      img.onerror = () => {
        console.error(`[Cloak Debug] Failed to load Scene 1 frame ${i} at path: ${img.src}`);
        scene1LoadedCount++;
        if (scene1LoadedCount === scene1FrameCount) {
          hideLoader();
          startScene1();
        }
      };
    }
  }
  
  // --- Play Scene 1 & Preload existing website in background ---
  function startScene1() {
    preloadFramesBackground();
    
    resizeCanvas();
    
    const fps = 24;
    const frameDuration = 1000 / fps;
    let lastTime = performance.now();
    
    function playIntroFrame(time) {
      if (!scene1Playing) return;
      
      const elapsed = time - lastTime;
      if (elapsed >= frameDuration) {
        lastTime = time - (elapsed % frameDuration);
        
        renderScene1Frame(currentScene1Frame);
        currentScene1Frame++;
        
        if (currentScene1Frame >= scene1FrameCount) {
          scene1Playing = false;
          enableScroll();
          
          // Seamlessly update canvas to show Frame 1 of scroll experience
          lastRenderedFrame = -1;
          resizeCanvas();
          return;
        }
      }
      
      requestAnimationFrame(playIntroFrame);
    }
    
    requestAnimationFrame(playIntroFrame);
  }
  
  function renderScene1Frame(index) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0b0914';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const img = scene1Images[index];
    if (img && img.complete) {
      drawCoverImage(img);
    }
  }
  
  // --- Parallel Background Preloader for main experience ---
  function preloadFramesBackground() {
    // Preload Frame 1 first for instant handover availability
    const firstImage = new Image();
    firstImage.src = getFramePath(1);
    firstImage.onload = () => {
      images[0] = firstImage;
      loadedCount++;
      console.log(`[Cloak Debug] First frame of scroll experience loaded at: ${firstImage.src}`);
      
      // Preload the remaining 191 frames in background
      for (let i = 2; i <= frameCount; i++) {
        const img = new Image();
        img.src = getFramePath(i);
        
        img.onload = () => {
          images[i - 1] = img;
          loadedCount++;
          
          if (loadedCount === frameCount) {
            console.log(`[Cloak Debug] Preloading complete. Total loaded frames: ${loadedCount}`);
          }
        };
        
        img.onerror = () => {
          console.error(`[Cloak Debug] Failed to load frame ${i} at path: ${img.src}`);
          loadedCount++;
        };
      }
    };
    
    firstImage.onerror = () => {
      console.error(`[Cloak Debug] Failed to load first frame of scroll experience`);
      loadedCount++;
    };
  }
  
  function hideLoader() {
    if (loaderOverlay && !loaderOverlay.classList.contains('fade-out')) {
      loaderOverlay.classList.add('fade-out');
    }
  }
  
  // --- Canvas Rendering Engine ---
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    
    if (scene1Playing) {
      renderScene1Frame(currentScene1Frame);
    } else {
      renderFrame(Math.round(currentFrame) - 1);
    }
  }
  
  function renderFrame(index) {
    if (scene1Playing) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0b0914';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const img = images[index];
    if (img && img.complete) {
      drawCoverImage(img);
    } else {
      let nearestIndex = -1;
      let minDistance = Infinity;
      for (let i = 0; i < frameCount; i++) {
        if (images[i] && images[i].complete) {
          const dist = Math.abs(i - index);
          if (dist < minDistance) {
            minDistance = dist;
            nearestIndex = i;
          }
        }
      }
      if (nearestIndex !== -1) {
        drawCoverImage(images[nearestIndex]);
      }
    }
  }
  
  function drawCoverImage(img) {
    const dpr = window.devicePixelRatio || 1;
    const canvasW = canvas.width / dpr;
    const canvasH = canvas.height / dpr;
    const imgRatio = img.width / img.height;
    const canvasRatio = canvasW / canvasH;
    
    let drawWidth, drawHeight, drawX, drawY;
    
    if (canvasRatio > imgRatio) {
      drawWidth = canvasW;
      drawHeight = canvasW / imgRatio;
      drawX = 0;
      drawY = (canvasH - drawHeight) / 2;
    } else {
      drawWidth = canvasH * imgRatio;
      drawHeight = canvasH;
      drawX = (canvasW - drawWidth) / 2;
      drawY = 0;
    }
    
    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    ctx.restore();
  }
  
  window.addEventListener('resize', resizeCanvas);
  
  // --- Smooth Scroll & ScrollTrigger Bindings ---
  const lenis = new Lenis({
    duration: 1.5,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false
  });
  
  lenis.on('scroll', ScrollTrigger.update);
  
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);
  
  const trigger = ScrollTrigger.create({
    trigger: ".scroll-container",
    start: "top top",
    end: "bottom bottom",
    scrub: 1.2,
    onUpdate: (self) => {
      if (scene1Playing) return;
      targetFrame = 1 + self.progress * (frameCount - 1);
      
      updateCards(self.progress);
      
      if (self.progress > 0.90) {
        const transitionProgress = (self.progress - 0.90) / 0.08;
        const mainOpacity = Math.max(0, 1 - transitionProgress);
        const finalOpacity = Math.min(1, transitionProgress);
        
        canvas.style.opacity = mainOpacity;
        if (canvasOverlay) canvasOverlay.style.opacity = mainOpacity;
        if (cardStack) cardStack.style.opacity = mainOpacity;
        
        if (finalSection) {
          finalSection.style.opacity = finalOpacity;
          if (finalOpacity > 0.1) {
            finalSection.classList.add('visible');
          } else {
            finalSection.classList.remove('visible');
          }
        }
      } else {
        canvas.style.opacity = 1;
        if (canvasOverlay) canvasOverlay.style.opacity = 1;
        if (cardStack) cardStack.style.opacity = 1;
        
        if (finalSection) {
          finalSection.style.opacity = 0;
          finalSection.classList.remove('visible');
        }
      }
    }
  });
  
  // --- Animation Frame Loop ---
  function tick() {
    if (!scene1Playing) {
      const diff = targetFrame - currentFrame;
      if (Math.abs(diff) > 0.001) {
        currentFrame += diff * 0.08;
      } else {
        currentFrame = targetFrame;
      }
      
      const roundedFrame = Math.round(currentFrame) - 1;
      if (roundedFrame !== lastRenderedFrame) {
        renderFrame(roundedFrame);
        lastRenderedFrame = roundedFrame;
      }
    }
    
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  
  // --- Card Stacking Trigger System ---
  const cardThresholds = [0.12, 0.28, 0.42, 0.56, 0.70, 0.84];
  
  function updateCards(progress) {
    if (scene1Playing) return;
    cards.forEach((card, index) => {
      const thresh = cardThresholds[index];
      if (progress >= thresh) {
        card.classList.add('visible');
      } else {
        card.classList.remove('visible');
      }
    });
    
    // Dynamic Mobile Translation
    let offset = 0;
    if (window.innerWidth <= 768) {
      const visibleCards = Array.from(cards).filter(c => c.classList.contains('visible'));
      let totalHeight = 0;
      
      visibleCards.forEach(card => {
        totalHeight += card.offsetHeight + 10;
      });
      
      const maxHeight = window.innerHeight * 0.45;
      if (totalHeight > maxHeight) {
        offset = totalHeight - maxHeight;
      }
    }
    
    if (cardStack) {
      if (window.innerWidth <= 768) {
        cardStack.style.transform = `translateY(-${offset}px)`;
      } else {
        cardStack.style.transform = 'none';
      }
    }
  }
  
  // Explicit initial card state calculation
  updateCards(0);
  
  // Start the preloading of Scene 1
  preloadScene1();
  
  // --- Floating Navbar Interactive Logic ---
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
    if (scene1Playing) return;
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

// Avoid DOMContentLoaded race conditions
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initEngine);
} else {
  initEngine();
}
