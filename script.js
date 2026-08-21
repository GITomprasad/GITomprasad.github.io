/**
 * Om Prasad Sahoo - Developer Portfolio JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initTypewriter();
  initCanvasBackground();
  initSkillFilters();
  initProjectFilters();
  initContactForm();
  initScrollSpy();
  initMobileMenu();
  updateCopyrightYear();
});

/* ==========================================================
   1. THEME TOGGLE (DARK / LIGHT MODE)
   ========================================================== */
function initThemeToggle() {
  const desktopBtn = document.getElementById('theme-toggle-btn');
  const mobileBtn = document.getElementById('theme-toggle-mobile');
  const themeIcon = document.getElementById('theme-icon');

  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  setTheme(savedTheme);

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

  if (desktopBtn) desktopBtn.addEventListener('click', toggleTheme);
  if (mobileBtn) mobileBtn.addEventListener('click', toggleTheme);
}

/* ==========================================================
   2. TYPEWRITER EFFECT
   ========================================================== */
function initTypewriter() {
  const words = [
    'Intelligent NLP Pipelines',
    'Machine Learning Models',
    'Relational SQL Analytics',
    'High-Performance C++ Logic',
    'Data Preprocessing Systems'
  ];
  
  const element = document.getElementById('typewriter-text');
  if (!element) return;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      element.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      element.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 110;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typingSpeed = 2200; // Pause at end of word
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
   3. INTERACTIVE CANVAS PARTICLE CONSTELLATION
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

  const particleCount = Math.min(Math.floor(window.innerWidth / 20), 55);

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.6 + 0.8;
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
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.18 * (1 - dist / 120)})`;
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
   4. SKILL & PROJECT FILTERING
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
        const categories = card.getAttribute('data-category').split(' ');
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
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });
    });
  });
}

/* ==========================================================
   5. CONTACT FORM & FEEDBACK
   ========================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
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

    const mailtoUrl = `mailto:omsahoo07102005@gmail.com?subject=${encodeURIComponent(subject + ' - from ' + name)}&body=${encodeURIComponent("Sender Name: " + name + "\nSender Email: " + email + "\n\n" + message)}`;

    setTimeout(() => {
      window.location.href = mailtoUrl;
      showToast('Message formatted! Opening email client...');
      form.reset();
      submitBtn.innerHTML = originalBtnText;
      submitBtn.disabled = false;
    }, 600);
  });
}

/* ==========================================================
   6. COPY TO CLIPBOARD & TOAST NOTIFICATION
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
    toastIcon.className = 'w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm';
    toastIcon.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
  } else {
    toastIcon.className = 'w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm';
    toastIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
  }

  toast.classList.remove('translate-y-24', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-24', 'opacity-0');
  }, 3200);
}

/* ==========================================================
   7. SCROLL-SPY NAVIGATION
   ========================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    let scrollPosition = window.scrollY + 120;

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

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();
}

/* ==========================================================
   8. MOBILE MENU
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
      menuIcon.classList.remove('fa-bars');
      menuIcon.classList.add('fa-xmark');
    } else {
      mobileMenu.classList.add('hidden');
      menuIcon.classList.remove('fa-xmark');
      menuIcon.classList.add('fa-bars');
    }
  });

  const links = mobileMenu.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.add('hidden');
      menuIcon.classList.remove('fa-xmark');
      menuIcon.classList.add('fa-bars');
    });
  });
}

/* ==========================================================
   9. CERTIFICATE MODAL
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
   10. RESUME MODAL
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

// Close modals on outside click
window.addEventListener('click', (e) => {
  const certModal = document.getElementById('cert-modal');
  const resumeModal = document.getElementById('resume-modal');

  if (e.target === certModal) closeCertModal();
  if (e.target === resumeModal) closeResumeModal();
});

/* ==========================================================
   11. AUTO COPYRIGHT YEAR
   ========================================================== */
function updateCopyrightYear() {
  const yearEl = document.getElementById('year-copy');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
