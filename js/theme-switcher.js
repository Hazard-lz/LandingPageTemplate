/* ==========================================================================
   THEME, NICHE & INTERFACE CONTROLLER MODULE
   ========================================================================== */

/* 1. PRELOADER & SCREEN ENTRANCE */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const progressBar = document.querySelector('.loader-progress');
  
  if (!preloader) return;

  document.body.style.overflow = 'hidden';

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 15) + 12;
    if (progress > 100) progress = 100;
    if (progressBar) progressBar.style.width = `${progress}%`;

    if (progress === 100) {
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('fade-out');
        document.body.style.overflow = '';
      }, 300);
    }
  }, 50);
}

/* 2. NAVBAR & SCROLL PROGRESS BAR */
function initNavbarAndProgress() {
  const navbar = document.querySelector('.navbar');
  const scrollProgress = document.getElementById('scroll-progress');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  let ticking = false;
  let sectionPositions = [];

  function calculateSectionPositions() {
    sectionPositions = Array.from(sections).map(section => ({
      id: section.getAttribute('id'),
      top: section.offsetTop - 150,
      bottom: section.offsetTop + section.offsetHeight - 150
    }));
  }

  calculateSectionPositions();
  window.addEventListener('resize', calculateSectionPositions, { passive: true });

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrollState();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  function updateScrollState() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    if (scrollProgress && docHeight > 0) {
      const progress = (scrollY / docHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
    }

    if (navbar) {
      if (scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    sectionPositions.forEach(pos => {
      if (scrollY >= pos.top && scrollY < pos.bottom) {
        const activeLink = document.querySelector(`.nav-menu a[href*="#${pos.id}"]`);
        if (activeLink && !activeLink.classList.contains('active')) {
          navLinks.forEach(link => link.classList.remove('active'));
          activeLink.classList.add('active');
        }
      }
    });
  }

  if (hamburger && navMenu) {
    function closeMobileMenu() {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
    }

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isActive = navMenu.classList.contains('active');
      if (isActive) {
        closeMobileMenu();
      } else {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        document.body.classList.add('menu-open');
      }
    });

    const allMobileMenuLinks = navMenu.querySelectorAll('a');
    allMobileMenuLinks.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    const backdrop = document.getElementById('nav-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', closeMobileMenu);
    }

    const mobileMenuCloseBtn = document.getElementById('mobile-menu-close');
    if (mobileMenuCloseBtn) {
      mobileMenuCloseBtn.addEventListener('click', closeMobileMenu);
    }

    // Fechar menu de navegação ao clicar fora
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active')) {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
          closeMobileMenu();
        }
      }
    });

    // Fechar menu ao pressionar a tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });
    // Ouvinte para o ícone flutuante do WhatsApp
    const waFloat = document.querySelector('.whatsapp-float');
    if (waFloat) {
      waFloat.addEventListener('click', (e) => {
        const href = waFloat.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    }
  }
}

/* 3. BACK TO TOP BUTTON */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        if (window.scrollY > 400) {
          backToTopBtn.classList.add('show');
        } else {
          backToTopBtn.classList.remove('show');
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* 4. ENHANCED LIVE INTERACTIVE NICHE DEMO SWITCHER WIDGET */
function initNicheSwitcher() {
  const toggleBtn = document.getElementById('niche-toggle');
  const menu = document.getElementById('niche-menu');
  const options = document.querySelectorAll('.niche-opt');
  const currentDot = document.getElementById('current-theme-dot');
  const root = document.documentElement;

  const brandNavs = document.querySelectorAll('.nav-brand-text');
  const brandHeadline = document.getElementById('brand-headline');
  const brandCopyright = document.getElementById('copyright-brand');

  if (!toggleBtn || !menu) return;

  let justToggled = false;

  toggleBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    justToggled = true;
    menu.classList.toggle('show');
    toggleBtn.classList.toggle('active');
    setTimeout(() => { justToggled = false; }, 150);
  });

  menu.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  document.addEventListener('click', (e) => {
    if (justToggled) return;
    if (!toggleBtn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('show');
      toggleBtn.classList.remove('active');
    }
  });

  const themes = {
    tech: {
      name: 'Tema Azul',
      brandHtml: 'SUA<strong class="brand-accent">EMPRESA</strong>',
      brandPlain: 'Sua Empresa',
      copyright: 'Sua Empresa',
      primary: '#2563eb',
      accent: '#7c3aed',
      gradPrimary: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
      gradText: 'linear-gradient(135deg, #ffffff 30%, #93c5fd 60%, #60a5fa 100%)',
      glow: 'rgba(37, 99, 235, 0.35)'
    },
    health: {
      name: 'Tema Verde',
      brandHtml: 'SUA<strong class="brand-accent">EMPRESA</strong>',
      brandPlain: 'Sua Empresa',
      copyright: 'Sua Empresa',
      primary: '#10b981',
      accent: '#06b6d4',
      gradPrimary: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
      gradText: 'linear-gradient(135deg, #ffffff 30%, #a7f3d0 60%, #34d399 100%)',
      glow: 'rgba(16, 185, 129, 0.35)'
    },
    beauty: {
      name: 'Tema Roxo',
      brandHtml: 'SUA<strong class="brand-accent">EMPRESA</strong>',
      brandPlain: 'Sua Empresa',
      copyright: 'Sua Empresa',
      primary: '#7c3aed',
      accent: '#a855f7',
      gradPrimary: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
      gradText: 'linear-gradient(135deg, #ffffff 30%, #d8b4fe 60%, #c084fc 100%)',
      glow: 'rgba(124, 58, 237, 0.35)'
    },
    gourmet: {
      name: 'Tema Vermelho',
      brandHtml: 'SUA<strong class="brand-accent">EMPRESA</strong>',
      brandPlain: 'Sua Empresa',
      copyright: 'Sua Empresa',
      primary: '#ef4444',
      accent: '#f43f5e',
      gradPrimary: 'linear-gradient(135deg, #ef4444 0%, #f43f5e 100%)',
      gradText: 'linear-gradient(135deg, #ffffff 30%, #fecdd3 60%, #f87171 100%)',
      glow: 'rgba(239, 68, 68, 0.35)'
    },
    fitness: {
      name: 'Tema Ciano',
      brandHtml: 'SUA<strong class="brand-accent">EMPRESA</strong>',
      brandPlain: 'Sua Empresa',
      copyright: 'Sua Empresa',
      primary: '#06b6d4',
      accent: '#3b82f6',
      gradPrimary: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
      gradText: 'linear-gradient(135deg, #ffffff 30%, #bae6fd 60%, #38bdf8 100%)',
      glow: 'rgba(6, 182, 212, 0.35)'
    },
    law: {
      name: 'Tema Dourado',
      brandHtml: 'SUA<strong class="brand-accent">EMPRESA</strong>',
      brandPlain: 'Sua Empresa',
      copyright: 'Sua Empresa',
      primary: '#eab308',
      accent: '#ca8a04',
      gradPrimary: 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)',
      gradText: 'linear-gradient(135deg, #ffffff 30%, #fef08a 60%, #eab308 100%)',
      glow: 'rgba(234, 179, 8, 0.35)'
    }
  };

  function applyTheme(themeKey, isInitialLoad = false) {
    const theme = themes[themeKey];
    if (!theme) return;

    if (!isInitialLoad) {
      document.body.classList.add('theme-transitioning');
      setTimeout(() => document.body.classList.remove('theme-transitioning'), 500);
    }

    root.style.setProperty('--primary', theme.primary);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--grad-primary', theme.gradPrimary);
    root.style.setProperty('--grad-text', theme.gradText);
    root.style.setProperty('--primary-glow', theme.glow);

    brandNavs.forEach(el => el.innerHTML = theme.brandHtml);
    if (brandHeadline) brandHeadline.textContent = theme.brandPlain;
    if (brandCopyright) brandCopyright.textContent = theme.copyright;
    if (currentDot) currentDot.style.background = theme.primary;

    options.forEach(opt => {
      const active = opt.getAttribute('data-theme') === themeKey;
      opt.classList.toggle('active', active);
    });

    localStorage.setItem('demo_niche_theme', themeKey);

    if (!isInitialLoad) {
      showToast(`Tema alterado com sucesso para: ${theme.name}`);
    }
  }

  options.forEach(opt => {
    opt.addEventListener('click', () => {
      const themeKey = opt.getAttribute('data-theme');
      applyTheme(themeKey);
      menu.classList.remove('show');
      toggleBtn.classList.remove('active');
    });
  });

  const savedTheme = localStorage.getItem('demo_niche_theme');
  if (savedTheme && themes[savedTheme]) {
    applyTheme(savedTheme, true);
  }
}

/* 5. DARK / LIGHT THEME MODE CONTROLLER */
function initThemeMode() {
  const toggleBtn = document.getElementById('theme-mode-toggle');
  const nicheToggleBtn = document.getElementById('niche-mode-toggle');
  const nicheModeIcon = document.getElementById('niche-mode-icon');
  const nicheModeText = document.getElementById('niche-mode-text');

  const savedMode = localStorage.getItem('theme-mode');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

  let currentMode = savedMode ? savedMode : (prefersLight ? 'light' : 'dark');

  applyMode(currentMode);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      currentMode = currentMode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme-mode', currentMode);
      applyMode(currentMode);
      showToast(`Modo ${currentMode === 'light' ? 'Claro' : 'Escuro'} Ativado!`);
    });
  }

  if (nicheToggleBtn) {
    nicheToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      currentMode = currentMode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme-mode', currentMode);
      applyMode(currentMode);
      showToast(`Modo ${currentMode === 'light' ? 'Claro' : 'Escuro'} Ativado!`);
    });
  }

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme-mode')) {
        currentMode = e.matches ? 'light' : 'dark';
        applyMode(currentMode);
      }
    });
  }

  function applyMode(mode) {
    if (mode === 'light') {
      document.body.classList.add('light-mode');
      if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-sun" style="color: #f59e0b;"></i>';
      if (nicheModeIcon) nicheModeIcon.className = 'fa-solid fa-moon';
      if (nicheModeText) nicheModeText.textContent = 'Modo Escuro';
    } else {
      document.body.classList.remove('light-mode');
      if (toggleBtn) toggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
      if (nicheModeIcon) nicheModeIcon.className = 'fa-solid fa-sun';
      if (nicheModeText) nicheModeText.textContent = 'Modo Claro';
    }
  }
}
