/**
 * Om Prasad Sahoo - Developer Portfolio JavaScript Engine
 * Refined Human-Crafted Architecture (2026)
 */

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');
  initThemeToggle();
  initISTClock();
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
   1. THEME TOGGLE (DARK / LIGHT & OS PREFERENCE)
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
   2. LIVE IST CLOCK (Engineering Timezone Bar)
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
   3. SCROLL-TRIGGERED REVEAL ANIMATIONS (Subtle & Quiet)
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
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================
   4. SKILL PROFICIENCY PROGRESS BARS
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
   5. BACK-TO-TOP BUTTON WITH SVG PROGRESS RING
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
   6. SKILL & PROJECT FILTERING
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
   7. CONTACT FORM & FEEDBACK (FORMSPREE / AJAX READY)
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
      }, 400);
    }
  });

  function openMailto(name, email, subject, message) {
    const mailtoUrl = `mailto:omsahoo07102005@gmail.com?subject=${encodeURIComponent(subject + ' - from ' + name)}&body=${encodeURIComponent('Sender Name: ' + name + '\nSender Email: ' + email + '\n\n' + message)}`;
    window.location.href = mailtoUrl;
  }
}

/* ==========================================================
   8. COPY TO CLIPBOARD & TOAST NOTIFICATION
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
    toastIcon.className = 'w-8 h-8 rounded-lg bg-[#ff453a]/20 text-[#ff453a] flex items-center justify-center font-bold text-sm shrink-0';
    toastIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
  }

  toast.classList.remove('translate-y-24', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-24', 'opacity-0');
  }, 3000);
}

/* ==========================================================
   9. SCROLL-SPY NAVIGATION
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
   10. MOBILE MENU
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
   11. CERTIFICATE MODAL
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
   12. RESUME MODAL
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
   13. AUTO COPYRIGHT YEAR & PWA SERVICE WORKER
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
      navigator.serviceWorker.register('./sw.js').then((registration) => {
        // Force check for updated sw.js immediately
        registration.update();
      }).catch(() => {
        // SW registration quiet fail if offline/file protocol
      });
    });
  }
}

/* ==========================================================
   14. GITHUB LIVE STATS FETCHER
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
