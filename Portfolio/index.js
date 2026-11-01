(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = [...document.querySelectorAll('.nav-link')];
  const sections = navItems.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const topButton = document.querySelector('.back-top-float');
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');
  const year = document.querySelector('#year');

  if (year) year.textContent = String(new Date().getFullYear());

  if (menuButton && navLinks) {
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      menuButton.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
      navLinks.classList.toggle('open', !expanded);
    });

    navLinks.addEventListener('click', (event) => {
      if (event.target instanceof HTMLAnchorElement) {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Open navigation');
        navLinks.classList.remove('open');
      }
    });
  }

  const setActiveSection = () => {
    const marker = window.scrollY + window.innerHeight * 0.34;
    let activeId = 'home';
    for (const section of sections) {
      if (section.offsetTop <= marker) activeId = section.id;
    }
    navItems.forEach((link) => {
      const active = link.getAttribute('href') === `#${activeId}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    if (topButton) topButton.classList.toggle('visible', window.scrollY > 650);
  };

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        setActiveSection();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  setActiveSection();

  if (topButton) topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  const revealTargets = document.querySelectorAll('.section-heading, .about-content, .about-stats, .project-card, .skill-group, .profile-dashboard, .education-item, .certifications, .contact-banner');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach((target) => {
      target.classList.add('reveal');
      observer.observe(target);
    });
  }

  if (form && status) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const submit = form.querySelector('button[type="submit"]');
      if (!(submit instanceof HTMLButtonElement)) return;

      status.className = 'form-status';
      status.textContent = 'Sending your message…';
      submit.disabled = true;
      submit.setAttribute('aria-busy', 'true');

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (!response.ok) throw new Error(`Form service returned ${response.status}`);
        form.reset();
        status.classList.add('success');
        status.textContent = 'Thanks — your message was submitted successfully.';
      } catch (error) {
        console.error('Contact form submission failed:', error);
        status.classList.add('error');
        status.textContent = 'Your message could not be sent right now. Please email me directly at varmapiyush864@gmail.com.';
      } finally {
        submit.disabled = false;
        submit.removeAttribute('aria-busy');
      }
    });
  }
})();
