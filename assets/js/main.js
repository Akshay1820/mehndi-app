// ── PRELOADER ──────────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('preloader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 600);
  }
});

// ── NAVBAR ─────────────────────────────────────────
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// ── HAMBURGER ──────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileClose = document.querySelector('.mobile-close');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
}
if (mobileClose) {
  mobileClose.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
}
document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => {
    hamburger && hamburger.classList.remove('open');
    mobileMenu && mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── ACTIVE NAV LINK ────────────────────────────────
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
  const href = link.getAttribute('href');
  if (href && (href === currentPage || href.endsWith(currentPage))) {
    link.classList.add('active');
  }
});

// ── HERO SLIDER ────────────────────────────────────
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');
let current = 0, timer;

function goToSlide(idx) {
  slides[current].classList.remove('active');
  dots[current] && dots[current].classList.remove('active');
  current = idx;
  slides[current].classList.add('active');
  dots[current] && dots[current].classList.add('active');
}

function nextSlide() {
  goToSlide((current + 1) % slides.length);
}

if (slides.length > 0) {
  timer = setInterval(nextSlide, 5000);
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(timer);
      goToSlide(i);
      timer = setInterval(nextSlide, 5000);
    });
  });
}

// ── SCROLL ANIMATIONS ──────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => {
  observer.observe(el);
});

// ── GALLERY FILTERS ────────────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.masonry-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    galleryItems.forEach(item => {
      if (filter === 'all' || item.dataset.cat === filter) {
        item.style.display = '';
        item.style.opacity = '0';
        setTimeout(() => item.style.opacity = '1', 50);
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// ── LIGHTBOX ───────────────────────────────────────
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
let lbImages = [], lbCurrent = 0;

function buildLightboxImages() {
  lbImages = [];
  document.querySelectorAll('.masonry-item img').forEach(img => {
    lbImages.push({ src: img.src, alt: img.alt });
  });
}

document.querySelectorAll('.masonry-item').forEach((item, i) => {
  item.addEventListener('click', () => {
    buildLightboxImages();
    lbCurrent = i;
    lightboxImg.src = lbImages[i].src;
    lightboxImg.alt = lbImages[i].alt;
    lightbox && lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox && lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

lightboxClose && lightboxClose.addEventListener('click', closeLightbox);
lightbox && lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

lightboxPrev && lightboxPrev.addEventListener('click', e => {
  e.stopPropagation();
  lbCurrent = (lbCurrent - 1 + lbImages.length) % lbImages.length;
  lightboxImg.src = lbImages[lbCurrent].src;
});

lightboxNext && lightboxNext.addEventListener('click', e => {
  e.stopPropagation();
  lbCurrent = (lbCurrent + 1) % lbImages.length;
  lightboxImg.src = lbImages[lbCurrent].src;
});

document.addEventListener('keydown', e => {
  if (!lightbox || !lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') lightboxPrev && lightboxPrev.click();
  if (e.key === 'ArrowRight') lightboxNext && lightboxNext.click();
});

// ── CONTACT FORM ───────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#4caf50';
      contactForm.reset();
      setTimeout(() => {
        btn.textContent = 'Send Message';
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1500);
  });
}

// ── LAZY LOADING ───────────────────────────────────
if ('loading' in HTMLImageElement.prototype) {
  document.querySelectorAll('img[data-src]').forEach(img => {
    img.src = img.dataset.src;
  });
} else {
  const lazyObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.src = e.target.dataset.src;
        lazyObserver.unobserve(e.target);
      }
    });
  });
  document.querySelectorAll('img[data-src]').forEach(img => lazyObserver.observe(img));
}

// ── HERO ARROW BUTTONS ─────────────────────────────
const heroPrev = document.getElementById('heroPrev');
const heroNext = document.getElementById('heroNext');

if (heroPrev) {
  heroPrev.addEventListener('click', () => {
    clearInterval(timer);
    goToSlide((current - 1 + slides.length) % slides.length);
    timer = setInterval(nextSlide, 5000);
  });
}
if (heroNext) {
  heroNext.addEventListener('click', () => {
    clearInterval(timer);
    nextSlide();
    timer = setInterval(nextSlide, 5000);
  });
}

// ── MASONRY ITEM SCROLL ANIMATION ─────────────────
const masonryObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 60);
      masonryObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.masonry-item').forEach(item => {
  masonryObserver.observe(item);
});
