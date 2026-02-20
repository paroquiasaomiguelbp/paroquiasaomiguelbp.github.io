document.addEventListener('DOMContentLoaded', function () {
  const navbar = document.querySelector('.navbar');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Throttle helper for scroll performance
  const throttle = (fn, wait) => {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn(...args);
      }
    };
  };

  // 1. Navbar scroll effect
  const handleNavbarScroll = () => {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // 4. Scroll to top button visibility
  const handleScrollTopVisibility = () => {
    if (!scrollTopBtn) return;
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  };

  // 6. Active nav link update
  const handleActiveNav = () => {
    if (!sections.length || !navLinks.length) return;
    const navbarHeight = navbar ? navbar.offsetHeight : 70;
    let currentId = '';

    sections.forEach((section) => {
      const top = section.offsetTop - navbarHeight - 20;
      if (window.scrollY >= top) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + currentId) {
        link.classList.add('active');
      }
    });
  };

  // Combined scroll handler (throttled)
  const onScroll = throttle(() => {
    handleNavbarScroll();
    handleScrollTopVisibility();
    handleActiveNav();
  }, 100);

  window.addEventListener('scroll', onScroll, { passive: true });
  // Run once on load
  onScroll();

  // 2. Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const navbarHeight = navbar ? navbar.offsetHeight : 70;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPos,
        behavior: 'smooth',
      });
    });
  });

  // 3. Mobile menu auto-close
  if (navbarCollapse) {
    navbarCollapse.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      });
    });
  }

  // 4. Scroll to top button click
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 5. Fade-in on scroll animation
  const fadeElements = document.querySelectorAll('.fade-in');
  if (fadeElements.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    fadeElements.forEach((el) => observer.observe(el));
  }

  // Gallery modal image handler
  const galleryImages = document.querySelectorAll('.gallery-img');
  const galleryModalImg = document.getElementById('galleryModalImg');
  if (galleryImages.length && galleryModalImg) {
    galleryImages.forEach((img) => {
      img.addEventListener('click', () => {
        galleryModalImg.src = img.dataset.img || img.src;
        galleryModalImg.alt = img.alt;
      });
    });
  }
});

// WhatsApp form submission
function sendWhatsApp() {
  const name = document.getElementById('formName').value.trim();
  const email = document.getElementById('formEmail').value.trim();
  const subject = document.getElementById('formSubject').value;
  const message = document.getElementById('formMessage').value.trim();

  if (!name || !email || !message) {
    alert('Por favor, preencha todos os campos obrigatórios.');
    return;
  }

  const text = `*Contato via Site da Paróquia*%0A%0A` +
    `*Nome:* ${encodeURIComponent(name)}%0A` +
    `*E-mail:* ${encodeURIComponent(email)}%0A` +
    `*Assunto:* ${encodeURIComponent(subject)}%0A` +
    `*Mensagem:* ${encodeURIComponent(message)}`;

  window.open(`https://wa.me/5511919079413?text=${text}`, '_blank');
}
