/**
 * AYUSH SHARMA — PREMIUM DEVELOPER PORTFOLIO
 * Vanilla JavaScript Engine
 * - Signature Framer-inspired Scroll Media Photo Animation
 * - Smooth anchor navigation & ScrollSpy
 * - Mobile navigation drawer
 * - Interactive Project Concept Inspector modal
 * - Copy-to-clipboard email utility with toast feedback
 * - Dynamic copyright year
 */

(function () {
  'use strict';

  // --- DOM Elements ---
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const navToggle = document.querySelector('.nav-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const backToTopBtn = document.querySelector('.btn-back-to-top');
  const copyEmailBtn = document.querySelector('.contact-copy-btn');
  const emailTextEl = document.querySelector('.contact-email-text');
  const toastNotice = document.querySelector('.toast-notice');
  const currentYearEl = document.getElementById('current-year');

  // Scroll Media Elements
  const scrollSection = document.getElementById('scroll-media-section');
  const scrollFrame = document.getElementById('scroll-media-frame');
  const scrollImg = document.getElementById('scroll-media-img');
  const scrollOverlay = document.getElementById('scroll-media-overlay');
  const hudFill = document.getElementById('scroll-hud-fill');
  const hudValue = document.getElementById('scroll-hud-value');

  // Project Modal Elements
  const modalOverlay = document.getElementById('project-modal');
  const modalCloseBtn = document.querySelector('.modal-close-btn');
  const modalNumber = document.getElementById('modal-number');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalStack = document.getElementById('modal-stack');
  const modalStage = document.getElementById('modal-stage');
  const inspectButtons = document.querySelectorAll('.project-inspect-btn');

  // --- Dynamic Year ---
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  // --- Fallback Image Handler ---
  // Ensures that if the uploaded image is missing or loading, an elegant SVG editorial monogram shows
  function setupImageFallbacks() {
    const images = document.querySelectorAll('.hero-portrait-img, .scroll-media-img');
    images.forEach((img) => {
      img.addEventListener('error', () => {
        // SVG Editorial Monogram Card
        const svgFallback = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000" fill="%230e0e0e"><rect width="800" height="1000" fill="%230e0e0e"/><rect x="30" y="30" width="740" height="940" fill="none" stroke="%23222222" stroke-width="2"/><circle cx="400" cy="420" r="160" fill="%23171717"/><text x="400" y="445" font-family="monospace" font-size="80" fill="%23f2f2f2" text-anchor="middle" font-weight="600">AS</text><text x="400" y="680" font-family="sans-serif" font-size="28" fill="%23f2f2f2" text-anchor="middle" letter-spacing="4">AYUSH SHARMA</text><text x="400" y="725" font-family="monospace" font-size="16" fill="%233fd6c6" text-anchor="middle" letter-spacing="3">WEB DEVELOPER</text><text x="400" y="765" font-family="monospace" font-size="13" fill="%238a8d91" text-anchor="middle">ASSETS / AYUSH-PROFILE.JPG</text></svg>`;
        img.src = svgFallback;
      });
    });
  }
  setupImageFallbacks();

  // --- 1. SIGNATURE SCROLL MEDIA PHOTO ANIMATION ---
  // Recreates Framer's Scroll Media Component with butter-smooth native RAF updates
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let ticking = false;

  function updateScrollMedia() {
    if (!scrollSection || !scrollFrame || prefersReducedMotion) return;

    const rect = scrollSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const totalScrollDistance = rect.height - windowHeight;

    // Calculate progress normalized between 0.0 and 1.0
    // When the top of the section enters the top of the viewport (rect.top <= 0)
    let progress = 0;
    if (rect.top <= 0) {
      progress = Math.abs(rect.top) / totalScrollDistance;
    }
    progress = Math.max(0, Math.min(1, progress));

    // Responsive dimensions interpolation
    const isMobile = window.innerWidth <= 768;
    
    // Start parameters (initial 4:5 framed portrait crop)
    const startWidth = isMobile ? Math.min(window.innerWidth * 0.85, 340) : 420;
    const startHeight = isMobile ? Math.min(window.innerHeight * 0.62, 425) : 525;
    const startRadius = 16;
    const startGrayscale = 85;
    const startImgScale = 1.18; // Slight zoom for parallax depth
    const startBorderAlpha = 0.2;

    // End parameters (immersive wide cinematic canvas)
    const endWidth = isMobile ? Math.min(window.innerWidth * 0.94, 720) : Math.min(window.innerWidth * 0.94, 1180);
    const endHeight = isMobile ? Math.min(window.innerHeight * 0.78, 580) : Math.min(window.innerHeight * 0.78, 700);
    const endRadius = 6;
    const endGrayscale = 15;
    const endImgScale = 1.0;
    const endBorderAlpha = 0.7;

    // Interpolate current values based on scroll progress
    const currentWidth = startWidth + (endWidth - startWidth) * progress;
    const currentHeight = startHeight + (endHeight - startHeight) * progress;
    const currentRadius = startRadius + (endRadius - startRadius) * progress;
    const currentGrayscale = startGrayscale + (endGrayscale - startGrayscale) * progress;
    const currentImgScale = startImgScale + (endImgScale - startImgScale) * progress;
    const currentBorderAlpha = startBorderAlpha + (endBorderAlpha - startBorderAlpha) * progress;

    // Apply styles to frame
    scrollFrame.style.width = `${currentWidth}px`;
    scrollFrame.style.height = `${currentHeight}px`;
    scrollFrame.style.borderRadius = `${currentRadius}px`;
    scrollFrame.style.borderColor = `rgba(63, 214, 198, ${currentBorderAlpha * 0.45})`;

    // Apply styles to inner image (parallax effect + grayscale transition)
    if (scrollImg) {
      scrollImg.style.transform = `scale(${currentImgScale})`;
      scrollImg.style.filter = `grayscale(${currentGrayscale}%) contrast(1.08)`;
    }

    // Fade in editorial HUD overlay as expansion reaches late stage
    if (scrollOverlay) {
      const overlayProgress = Math.max(0, (progress - 0.35) / 0.65);
      scrollOverlay.style.opacity = overlayProgress.toString();
    }

    // Update floating HUD progress bar
    if (hudFill) {
      hudFill.style.width = `${Math.round(progress * 100)}%`;
    }
    if (hudValue) {
      hudValue.textContent = `${Math.round(progress * 100)}%`;
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollMedia);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    updateScrollMedia();
  }, { passive: true });

  // Initial call
  updateScrollMedia();

  // --- 2. HEADER SCROLL EFFECT & ACTIVE LINK SPY ---
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollY = window.pageYOffset;

    // Header border intensity on scroll
    if (header) {
      if (scrollY > 40) {
        header.style.backgroundColor = 'rgba(5, 5, 5, 0.92)';
        header.style.borderBottomColor = '#303030';
      } else {
        header.style.backgroundColor = 'rgba(5, 5, 5, 0.82)';
        header.style.borderBottomColor = '#222222';
      }
    }

    // Nav Spy
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 180;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

  // --- 3. MOBILE NAVIGATION MENU ---
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);

      // Animate hamburger bars
      const bars = navToggle.querySelectorAll('.nav-toggle-bar');
      if (isOpen) {
        bars[0].style.transform = 'translateY(6.5px) rotate(45deg)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
        document.body.style.overflow = 'hidden';
      } else {
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
        document.body.style.overflow = '';
      }
    });

    // Close on link click
    mobileNav.querySelectorAll('.mobile-nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        const bars = navToggle.querySelectorAll('.nav-toggle-bar');
        bars[0].style.transform = 'none';
        bars[1].style.opacity = '1';
        bars[2].style.transform = 'none';
        document.body.style.overflow = '';
      });
    });
  }

  // --- 4. BACK TO TOP BUTTON ---
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // --- 5. EMAIL COPY CLIPBOARD UTILITY ---
  let toastTimer;
  function showToast(message) {
    if (!toastNotice) return;
    toastNotice.textContent = message;
    toastNotice.classList.add('visible');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotice.classList.remove('visible');
    }, 2800);
  }

  if (copyEmailBtn && emailTextEl) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = emailTextEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(email);
        showToast('✓ Email copied to clipboard');
        const origText = copyEmailBtn.textContent;
        copyEmailBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyEmailBtn.textContent = origText;
        }, 2000);
      } catch (err) {
        // Fallback for clipboard
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('✓ Email copied to clipboard');
      }
    });
  }

  // --- 6. PROJECT CONCEPT INSPECTOR MODAL ---
  const projectDatabase = {
    '1': {
      number: 'PROJECT 01 / CONCEPT & PROTOTYPE',
      title: 'Restaurant QR Menu',
      desc: 'A digital menu concept designed to help restaurants present their food menu through a simple QR-code-based experience. The system focuses on zero-friction customer interaction without downloading mobile apps, organizing dishes into intuitive dietary categories and providing real-time pricing and allergen tags.',
      stack: 'HTML5, CSS3, JavaScript, Responsive Mobile-First Design',
      stage: 'Prototype & Interface System',
    },
    '2': {
      number: 'PROJECT 02 / IN DEVELOPMENT',
      title: 'Inventory Management System',
      desc: 'A hardware-store management concept focused on stock tracking, purchase records, sales, and profit calculations. Designed to handle dense product catalogs, batch restock alerts, supplier invoice reconciliations, and instant gross/net profit margin analytics.',
      stack: 'Full-Stack Architecture Concept, JavaScript, Node.js fundamentals, Relational Data Modeling',
      stage: 'Core Architecture & Logic Development',
    },
    '3': {
      number: 'PROJECT 03 / CONCEPT & DESIGN',
      title: 'Attendance Dashboard',
      desc: 'A clean attendance-management interface concept designed to make attendance tracking easier. Features daily student/employee check-in matrix, automated monthly attendance percentage formulas, and clear visual summaries without visual clutter.',
      stack: 'UI/UX Design Systems, Figma, Modern Frontend Web Standards',
      stage: 'Interface Concept & Frontend Architecture',
    },
  };

  function openProjectModal(id) {
    const data = projectDatabase[id];
    if (!data || !modalOverlay) return;

    modalNumber.textContent = data.number;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalStack.textContent = data.stack;
    modalStage.textContent = data.stage;

    modalOverlay.classList.add('active');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  inspectButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-project');
      openProjectModal(id);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeProjectModal);
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        closeProjectModal();
      }
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        closeProjectModal();
      }
    });
  }

  // --- 7. SMOOTH SCROLL FOR IN-PAGE ANCHORS ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 70;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  });

  // Scroll prompt in Hero
  const scrollPrompt = document.querySelector('.hero-scroll-prompt');
  if (scrollPrompt && scrollSection) {
    scrollPrompt.addEventListener('click', () => {
      scrollSection.scrollIntoView({ behavior: 'smooth' });
    });
  }
})();
