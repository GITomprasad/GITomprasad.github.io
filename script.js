/**
 * Om Prasad Sahoo - Developer Portfolio JavaScript Engine
 * UI Upgrade & Feature Improvement Guide (August 2026 Edition)
 */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCustomCursor();
  initThemeToggle();
  initISTClock();
  initTypewriter();
  initCanvasBackground();
  initScrollReveal();
  initSkillProgressBars();
  initBackToTop();
  initSkillFilters();
  initProjectFilters();
  initContactForm();
  initScrollSpy();
  initMobileMenu();
  initGitHubStats();
  updateCopyrightYear();
  registerServiceWorker();
});

/* ==========================================================
   1. PRELOADER / LOADING SCREEN
   ========================================================== */
function initPreloader() {
  const dismissPreloader = () => {
    document.body.classList.add('loaded');
  };

  // Dismiss when window is fully loaded or after safe timeout (max 1.2s)
  if (document.readyState === 'complete') {
    setTimeout(dismissPreloader, 600);
  } else {
    window.addEventListener('load', () => {
      setTimeout(dismissPreloader, 500);
    });
    setTimeout(dismissPreloader, 1200); // Fallback guarantee
  }
}

/* ==========================================================
   2. CUSTOM ANIMATED CURSOR WITH LERP
   ========================================================== */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  // Check if touch device
  if (window.matchMedia('(pointer: coarse)').matches) {
    return;
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;
  let isMoving = false;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    if (!isMoving) {
      isMoving = true;
      requestAnimationFrame(renderCursor);
    }
  });

  function renderCursor() {
    // Smooth lerp (linear interpolation)
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    ring.style.transform = `translate(${ringX}px, ${ringY}px)`;

    if (Math.abs(mouseX - ringX) > 0.1 || Math.abs(mouseY - ringY) > 0.1) {
      requestAnimationFrame(renderCursor);
    } else {
      isMoving = false;
    }
  }

  // Hover detection on interactive elements
  const hoverTargets = 'a, button, input, textarea, .bento-card, .skill-card, .project-item, .cert-card, .skill-filter-btn, .project-filter-btn';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverTargets)) {
      document.body.classList.remove('cursor-hover');
    }
  });
}

/* ==========================================================
   3. THEME TOGGLE (DARK / LIGHT & OS PREFERENCE)
   ========================================================== */
function initThemeToggle() {
  const desktopBtn = document.getElementById('theme-toggle-btn');
  const mobileBtn = document.getElementById('theme-toggle-mobile');
  const themeIcon = document.getElementById('theme-icon');

  // Check saved preference, otherwise detect system preference
  const savedTheme = localStorage.getItem('portfolio-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'dark'); // default dark

  setTheme(initialTheme);

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
  }

  function setTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      if (themeIcon) themeIcon.className = 'fa-regular fa-sun text-base';
    } else {
      document.documentElement.classList.remove('dark');
      if (themeIcon) themeIcon.className = 'fa-regular fa-moon text-base';
    }
  }

  // Listen for OS system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('portfolio-theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });

  if (desktopBtn) desktopBtn.addEventListener('click', toggleTheme);
  if (mobileBtn) mobileBtn.addEventListener('click', toggleTheme);
}

/* ==========================================================
   4. LIVE IST CLOCK (Bento Card C)
   ========================================================== */
function initISTClock() {
  const clockEl = document.getElementById('ist-clock');
  const dateEl = document.getElementById('ist-date');
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    // Format to Indian Standard Time (Asia/Kolkata)
    const optionsTime = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const optionsDate = {
      timeZone: 'Asia/Kolkata',
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    };

    clockEl.textContent = now.toLocaleTimeString('en-US', optionsTime);
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString('en-US', optionsDate) + ' (IST)';
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================
   5. TYPEWRITER EFFECT
   ========================================================== */
function initTypewriter() {
  const words = [
    'Career Intelligence Engine',
    'Urban Risk Intelligence AI',
    'Intelligent NLP Pipelines',
    'Machine Learning Models',
    'Relational SQL Analytics',
    'High-Performance C++ Logic'
  ];

  const element = document.getElementById('typewriter-text');
  if (!element) return;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      element.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      element.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2000; // Pause when word is fully typed
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 400; // Pause before typing next word
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================
   6. INTERACTIVE CONSTELLATION CANVAS
   ========================================================== */
function initCanvasBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  const particleCount = Math.min(Math.floor(window.innerWidth / 22), 50);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.radius = Math.random() * 1.5 + 0.8;
      this.color = Math.random() > 0.5 ? 'rgba(99, 102, 241, ' : 'rgba(6, 182, 212, ';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + '0.7)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distSq = dx * dx + dy * dy;

        if (distSq < 13225) { // 115 * 115
          const dist = Math.sqrt(distSq);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.16 * (1 - dist / 115)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================
   7. SCROLL-TRIGGERED REVEAL ANIMATIONS
   ========================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================
   8. SKILL PROFICIENCY PROGRESS BARS
   ========================================================== */
function initSkillProgressBars() {
  const progressBars = document.querySelectorAll('.progress-bar-fill');
  if (!progressBars.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const targetWidth = entry.target.getAttribute('data-width') || '80%';
        entry.target.style.width = targetWidth;
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  progressBars.forEach(bar => observer.observe(bar));
}

/* ==========================================================
   9. BACK-TO-TOP BUTTON WITH SVG PROGRESS RING
   ========================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  const progressCircle = document.getElementById('progress-ring-circle');
  if (!backToTopBtn || !progressCircle) return;

  const circumference = 2 * Math.PI * 20; // r = 20
  progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
  progressCircle.style.strokeDashoffset = `${circumference}`;

  function updateScrollProgress() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollY / (docHeight || 1), 0), 1);

    const offset = circumference - (progress * circumference);
    progressCircle.style.strokeDashoffset = offset;

    if (scrollY > 380) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });
  updateScrollProgress();

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================
   10. SKILL & PROJECT FILTERING
   ========================================================== */
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });
}

function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectItems.forEach(item => {
        const categories = (item.getAttribute('data-category') || '').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });
    });
  });
}

/* ==========================================================
   11. CONTACT FORM & FEEDBACK (FORMSPREE / AJAX READY)
   ========================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) {
      showToast('Please fill out all fields.', 'error');
      return;
    }

    const submitBtn = document.getElementById('submit-btn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending...</span>';
    submitBtn.disabled = true;

    // Check if form action has a custom Formspree URL or fallback to mailto/interactive feedback
    const formAction = form.getAttribute('action');
    if (formAction && formAction.includes('formspree.io/f/')) {
      try {
        const response = await fetch(formAction, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({ name, email, subject, message })
        });
        if (response.ok) {
          showToast('Message sent successfully! I will reply soon.', 'success');
          form.reset();
        } else {
          showToast('Could not send message via form endpoint. Opening email...', 'error');
          openMailto(name, email, subject, message);
        }
      } catch (err) {
        showToast('Network error. Opening email client...', 'error');
        openMailto(name, email, subject, message);
      } finally {
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }
    } else {
      // Default: Clean feedback and open email client
      setTimeout(() => {
        openMailto(name, email, subject, message);
        showToast('Opening your email client with message...', 'success');
        form.reset();
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
      }, 500);
    }
  });

  function openMailto(name, email, subject, message) {
    const mailtoUrl = `mailto:omsahoo07102005@gmail.com?subject=${encodeURIComponent(subject + ' - from ' + name)}&body=${encodeURIComponent("Sender Name: " + name + "\nSender Email: " + email + "\n\n" + message)}`;
    window.location.href = mailtoUrl;
  }
}

/* ==========================================================
   12. COPY TO CLIPBOARD & TOAST NOTIFICATION
   ========================================================== */
function copyToClipboard(text, message = 'Copied to clipboard!') {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(message);
    }).catch(() => {
      fallbackCopy(text, message);
    });
  } else {
    fallbackCopy(text, message);
  }
}

function fallbackCopy(text, message) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast(message);
  } catch (err) {
    showToast('Failed to copy', 'error');
  }
  document.body.removeChild(textArea);
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;

  if (type === 'error') {
    toastIcon.className = 'w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm shrink-0';
    toastIcon.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
  } else {
    toastIcon.className = 'w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0';
    toastIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
  }

  toast.classList.remove('translate-y-24', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-24', 'opacity-0');
  }, 3400);
}

/* ==========================================================
   13. SCROLL-SPY NAVIGATION
   ========================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    let scrollPosition = window.scrollY + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

/* ==========================================================
   14. MOBILE MENU
   ========================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    const isHidden = mobileMenu.classList.contains('hidden');
    if (isHidden) {
      mobileMenu.classList.remove('hidden');
      if (menuIcon) {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-xmark');
      }
    } else {
      mobileMenu.classList.add('hidden');
      if (menuIcon) {
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
      }
    }
  });

  const links = mobileMenu.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      if (menuIcon) {
        menuIcon.classList.remove('fa-xmark');
        menuIcon.classList.add('fa-bars');
      }
    });
  });
}

/* ==========================================================
   15. CERTIFICATE MODAL
   ========================================================== */
function showCertModal(title, category, pdfUrl = null, issuer = 'Verified Authority', date = 'Completed') {
  const modal = document.getElementById('cert-modal');
  const titleEl = document.getElementById('modal-cert-title');
  const catEl = document.getElementById('modal-cert-category');
  const issuerEl = document.getElementById('modal-cert-issuer');
  const dateEl = document.getElementById('modal-cert-date');
  const iframeEl = document.getElementById('cert-iframe');
  const pdfContainer = document.getElementById('cert-pdf-container');
  const fallbackCard = document.getElementById('cert-fallback-card');
  const fallbackText = document.getElementById('cert-fallback-text');
  const openBtn = document.getElementById('modal-cert-open-btn');
  const downloadBtn = document.getElementById('modal-cert-download-btn');

  if (!modal || !titleEl) return;

  titleEl.textContent = title;
  if (catEl) catEl.textContent = category;
  if (issuerEl) issuerEl.textContent = issuer;
  if (dateEl) dateEl.textContent = `Completion Date: ${date}`;

  if (pdfUrl) {
    if (iframeEl) iframeEl.src = pdfUrl;
    if (pdfContainer) pdfContainer.classList.remove('hidden');
    if (fallbackCard) fallbackCard.classList.add('hidden');

    if (openBtn) {
      openBtn.href = pdfUrl;
      openBtn.classList.remove('hidden');
    }
    if (downloadBtn) {
      downloadBtn.href = pdfUrl;
      downloadBtn.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`;
      downloadBtn.classList.remove('hidden');
    }
  } else {
    if (iframeEl) iframeEl.src = '';
    if (pdfContainer) pdfContainer.classList.add('hidden');
    if (fallbackCard) {
      fallbackCard.classList.remove('hidden');
      fallbackCard.classList.add('flex');
    }
    if (fallbackText) {
      fallbackText.textContent = `Official institutional credential earned by Om Prasad Sahoo from ${issuer} (${category} Specialization).`;
    }
    if (openBtn) openBtn.classList.add('hidden');
    if (downloadBtn) downloadBtn.classList.add('hidden');
  }

  modal.classList.remove('opacity-0', 'pointer-events-none');
  modal.classList.add('opacity-100');
}

function closeCertModal() {
  const modal = document.getElementById('cert-modal');
  const iframeEl = document.getElementById('cert-iframe');
  if (!modal) return;

  if (iframeEl) iframeEl.src = '';
  modal.classList.remove('opacity-100');
  modal.classList.add('opacity-0', 'pointer-events-none');
}

/* ==========================================================
   16. RESUME MODAL
   ========================================================== */
function openResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (!modal) return;
  modal.classList.remove('opacity-0', 'pointer-events-none');
  modal.classList.add('opacity-100');
}

function closeResumeModal() {
  const modal = document.getElementById('resume-modal');
  if (!modal) return;
  modal.classList.remove('opacity-100');
  modal.classList.add('opacity-0', 'pointer-events-none');
}

// Close modals on outside click or ESC key
window.addEventListener('click', (e) => {
  const certModal = document.getElementById('cert-modal');
  const resumeModal = document.getElementById('resume-modal');

  if (e.target === certModal) closeCertModal();
  if (e.target === resumeModal) closeResumeModal();
});

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeCertModal();
    closeResumeModal();
  }
});

/* ==========================================================
   17. AUTO COPYRIGHT YEAR & PWA SERVICE WORKER
   ========================================================== */
function updateCopyrightYear() {
  const yearEl = document.getElementById('year-copy');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

function registerServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {
        // SW registration quiet fail if offline/file protocol
      });
    });
  }
}

/* ==========================================================
   18. GITHUB LIVE STATS FETCHER
   ========================================================== */
function initGitHubStats() {
  const repoCountEl = document.getElementById('gh-repo-count');
  if (!repoCountEl) return;

  fetch('https://api.github.com/users/GITomprasad')
    .then(res => {
      if (res.ok) return res.json();
      throw new Error('API unavailable');
    })
    .then(data => {
      if (data && typeof data.public_repos === 'number') {
        repoCountEl.textContent = data.public_repos;
      }
    })
    .catch(() => {
      // Quietly retain default fallback
    });
}

