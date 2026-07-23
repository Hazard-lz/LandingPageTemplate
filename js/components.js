/* ==========================================================================
   INTERACTIVE COMPONENTS MODULE
   ========================================================================== */

/* 1. STATISTICAL NUMBER COUNTERS */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const countTo = parseInt(target.getAttribute('data-count'), 10);
        const prefix = target.getAttribute('data-prefix') || '';
        const suffix = target.getAttribute('data-suffix') || '';
        
        let count = 0;
        const duration = 2000;
        const stepTime = 20;
        const increment = countTo / (duration / stepTime);

        const timer = setInterval(() => {
          count += increment;
          if (count >= countTo) {
            count = countTo;
            clearInterval(timer);
          }
          target.textContent = `${prefix}${Math.floor(count)}${suffix}`;
        }, stepTime);

        obs.unobserve(target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => observer.observe(stat));
}

/* 2. PORTFOLIO FILTER & LIGHTBOX MODAL */
function initPortfolioFilterAndLightbox() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxTitle = document.querySelector('.lightbox-title');
  const lightboxDesc = document.querySelector('.lightbox-desc');
  const lightboxClose = document.querySelector('.lightbox-close');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hide');
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  const viewBtns = document.querySelectorAll('.portfolio-btn');
  viewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.portfolio-card');
      const imgSrc = card.querySelector('.portfolio-thumb').getAttribute('src');
      const title = card.querySelector('.portfolio-title').textContent;
      const desc = card.querySelector('.portfolio-desc').textContent;

      if (lightboxImg) lightboxImg.src = imgSrc;
      if (lightboxTitle) lightboxTitle.textContent = title;
      if (lightboxDesc) lightboxDesc.textContent = desc;

      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  if (lightbox) {
    lightboxClose?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
}

/* 3. TESTIMONIALS CAROUSEL SLIDER */
function initTestimonialsCarousel() {
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (!track || !slides.length) return;

  let currentIndex = 0;
  let autoplayTimer = null;

  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (idx === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer?.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dot');

  function updateCarousel() {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
    resetAutoplay();
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    updateCarousel();
  }

  nextBtn?.addEventListener('click', () => {
    nextSlide();
    resetAutoplay();
  });

  prevBtn?.addEventListener('click', () => {
    prevSlide();
    resetAutoplay();
  });

  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  track.parentElement?.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
  track.parentElement?.addEventListener('mouseleave', startAutoplay);

  startAutoplay();
}

/* 4. PRICING TOGGLE */
function initPricingToggle() {
  const toggle = document.getElementById('pricing-toggle');
  const container = document.getElementById('toggle-container');
  const labelMonthly = document.getElementById('label-monthly');
  const labelAnnual = document.getElementById('label-annual');
  const prices = document.querySelectorAll('.price-val');
  const oldPriceWrappers = document.querySelectorAll('.price-old-wrapper');
  const priceAmounts = document.querySelectorAll('.price-amount');
  const savingsBanners = document.querySelectorAll('.savings-banner');

  if (!toggle || !prices.length) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    const isAnnual = toggle.classList.contains('active');

    if (container) container.classList.toggle('annual-active', isAnnual);
    if (labelMonthly) labelMonthly.classList.toggle('active', !isAnnual);
    if (labelAnnual) labelAnnual.classList.toggle('active', isAnnual);

    prices.forEach(priceEl => {
      const monthly = priceEl.getAttribute('data-monthly');
      const annual = priceEl.getAttribute('data-annual');
      priceEl.textContent = isAnnual ? annual : monthly;
    });

    oldPriceWrappers.forEach(w => w.classList.toggle('show', isAnnual));
    priceAmounts.forEach(a => a.classList.toggle('discounted', isAnnual));
    savingsBanners.forEach(b => b.classList.toggle('show', isAnnual));
  });
}

/* 5. FAQ ACCORDION */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    header.addEventListener('click', () => {
      item.classList.toggle('open');
    });
  });
}

/* 6. CONTACT FORM VALIDATION & PHONE MASK */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const phoneInput = document.getElementById('phone');

  if (!form) return;

  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 11) v = v.substring(0, 11);

      if (v.length > 10) {
        v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (v.length > 6) {
        v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      } else if (v.length > 2) {
        v = v.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      } else if (v.length > 0) {
        v = v.replace(/^(\d{0,2})$/, '($1');
      }
      e.target.value = v;
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const submitBtn = form.querySelector('button[type="submit"]');

    let isValid = true;

    form.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));

    if (!name.value.trim()) {
      showError(name, 'Por favor, insira seu nome.');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
      showError(email, 'Insira um e-mail válido.');
      isValid = false;
    }

    if (phoneInput && phoneInput.value.length < 14) {
      showError(phoneInput, 'Insira um telefone válido com DDD.');
      isValid = false;
    }

    if (!message.value.trim()) {
      showError(message, 'Escreva sua mensagem.');
      isValid = false;
    }

    if (isValid) {
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';

      setTimeout(() => {
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        showToast('Mensagem enviada com sucesso! Em breve entraremos em contato.');
      }, 1500);
    }
  });

  function showError(input, msg) {
    const group = input.closest('.form-group');
    const errorEl = group.querySelector('.form-error');
    if (errorEl) errorEl.textContent = msg;
    group.classList.add('error');
  }
}

/* Global Toast Helper */
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.querySelector('.toast-text').textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
