/**
 * AKASH PORTFOLIO – JAVASCRIPT
 * =============================================================
 * Author: Akash (built with Antigravity)
 *
 * This file controls all the interactive behaviour of the site:
 *   1. Navigation — scroll effects, active-link highlighting,
 *      mobile menu open/close
 *   2. Hero typing animation (optional subtle enhancement)
 *   3. Skill bar animation — triggered when visible on screen
 *   4. Scroll-triggered fade-in animations
 *   5. Education scores toggle
 *   6. Contact form validation (client-side only)
 *   7. Back-to-top button
 *   8. Footer year
 *   9. Keyboard/accessibility helpers
 *  10. How to add a new project (comment guide)
 * =============================================================
 */

/* -----------------------------------------------------------------
   UTILITY: Wait for the DOM to fully load before running code.
   "DOM" = the HTML tree that the browser builds from your HTML file.
----------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------------------------
     1. NAVIGATION
     ---------------------------------------------------------------
     "Scrolled" class — adds blur/background when page scrolls
     Active link highlighting — marks which section is in view
     Mobile menu — hamburger button open/close
  --------------------------------------------------------------- */

  const navbar        = document.getElementById('navbar');
  const hamburger     = document.getElementById('hamburger');
  const navLinks      = document.getElementById('navLinks');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const allNavLinks   = document.querySelectorAll('.nav-link');

  // — Navbar scroll effect —
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // — Mobile menu toggle —
  function openMobileMenu() {
    navLinks.classList.add('mobile-open');
    mobileOverlay.classList.add('active');
    mobileOverlay.removeAttribute('aria-hidden');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // prevent background scroll
  }

  function closeMobileMenu() {
    navLinks.classList.remove('mobile-open');
    mobileOverlay.classList.remove('active');
    mobileOverlay.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', function () {
    const isOpen = navLinks.classList.contains('mobile-open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // Close menu when clicking overlay
  mobileOverlay.addEventListener('click', closeMobileMenu);

  // Close menu when a nav link is clicked (mobile)
  allNavLinks.forEach(function (link) {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close menu on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  // — Active link highlighting via IntersectionObserver —
  // IntersectionObserver watches elements and fires when they
  // enter or leave the visible part of the browser window.
  const sections = document.querySelectorAll('section[id]');

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          allNavLinks.forEach(function (link) {
            link.classList.toggle('active', link.dataset.section === id);
          });
        }
      });
    },
    {
      rootMargin: '-50% 0px -50% 0px', // trigger when section is at screen centre
    }
  );

  sections.forEach(function (sec) {
    sectionObserver.observe(sec);
  });

  /* ---------------------------------------------------------------
     2. SKILL BAR ANIMATION
     ---------------------------------------------------------------
     Each .skill-bar has a "data-width" attribute (e.g. data-width="40").
     When the skill card scrolls into view, we set the CSS width
     to that value, triggering the smooth CSS transition.
  --------------------------------------------------------------- */
  const skillBars = document.querySelectorAll('.skill-bar');

  const skillObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-width') || '0';
          // Small delay makes it feel natural
          setTimeout(function () {
            bar.style.width = targetWidth + '%';
          }, 200);
          skillObserver.unobserve(bar); // animate only once
        }
      });
    },
    { threshold: 0.3 }
  );

  skillBars.forEach(function (bar) {
    skillObserver.observe(bar);
  });

  /* ---------------------------------------------------------------
     3. SCROLL-TRIGGERED FADE-IN ANIMATIONS
     ---------------------------------------------------------------
     Any element with class "animate-on-scroll" starts invisible
     (opacity:0, translated down). When it enters the viewport,
     the "visible" class is added, which CSS transitions to full opacity.
  --------------------------------------------------------------- */

  // Auto-add the class to cards, timeline items, interest cards etc.
  const autoAnimateSelectors = [
    '.skill-card',
    '.interest-card',
    '.timeline-card',
    '.project-card',
    '.info-card',
    '.highlight-item',
    '.contact-card',
    '.goal-item',
  ];

  autoAnimateSelectors.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      el.classList.add('animate-on-scroll');
    });
  });

  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  const fadeObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  animatedElements.forEach(function (el) {
    fadeObserver.observe(el);
  });

  /* ---------------------------------------------------------------
     4. EDUCATION SCORES TOGGLE
     ---------------------------------------------------------------
     Clicking the "Show Academic Scores" button reveals the hidden
     score cards inside the education timeline items.
  --------------------------------------------------------------- */
  const toggleScoresBtn = document.getElementById('toggleScores');
  const scoreRevealEls  = document.querySelectorAll('.score-reveal');
  let scoresVisible     = false;

  if (toggleScoresBtn) {
    toggleScoresBtn.addEventListener('click', function () {
      scoresVisible = !scoresVisible;

      scoreRevealEls.forEach(function (el) {
        if (scoresVisible) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      });

      // Update button text and aria attribute
      toggleScoresBtn.setAttribute('aria-pressed', scoresVisible ? 'true' : 'false');
      toggleScoresBtn.innerHTML = scoresVisible
        ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg> Hide Academic Scores'
        : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg> Show Academic Scores';
    });
  }

  /* ---------------------------------------------------------------
     5. CONTACT FORM VALIDATION
     ---------------------------------------------------------------
     Checks that the name, email, and message fields are filled
     correctly before "submitting". Since there is no backend,
     we just show a friendly message.
  --------------------------------------------------------------- */
  const contactForm   = document.getElementById('contactForm');
  const nameInput     = document.getElementById('contactName');
  const emailInput    = document.getElementById('contactEmail');
  const messageInput  = document.getElementById('contactMessage');
  const nameError     = document.getElementById('nameError');
  const emailError    = document.getElementById('emailError');
  const messageError  = document.getElementById('messageError');
  const formSuccess   = document.getElementById('formSuccess');
  const submitBtn     = document.getElementById('submitBtn');

  // Helper: validate a single email string
  function isValidEmail(email) {
    // Simple regex check
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  // Helper: show or clear an error
  function setError(inputEl, errorEl, message) {
    if (message) {
      inputEl.classList.add('error');
      errorEl.textContent = message;
    } else {
      inputEl.classList.remove('error');
      errorEl.textContent = '';
    }
  }

  // Live validation — clears error as user types
  if (nameInput) {
    nameInput.addEventListener('input', function () {
      if (nameInput.value.trim().length > 0) {
        setError(nameInput, nameError, '');
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', function () {
      if (isValidEmail(emailInput.value)) {
        setError(emailInput, emailError, '');
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener('input', function () {
      if (messageInput.value.trim().length > 10) {
        setError(messageInput, messageError, '');
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault(); // stop the browser from reloading the page

      let hasErrors = false;

      // Validate name
      if (!nameInput.value.trim()) {
        setError(nameInput, nameError, 'Please enter your name.');
        hasErrors = true;
      } else {
        setError(nameInput, nameError, '');
      }

      // Validate email
      if (!emailInput.value.trim()) {
        setError(emailInput, emailError, 'Please enter your email address.');
        hasErrors = true;
      } else if (!isValidEmail(emailInput.value)) {
        setError(emailInput, emailError, 'Please enter a valid email address.');
        hasErrors = true;
      } else {
        setError(emailInput, emailError, '');
      }

      // Validate message
      if (!messageInput.value.trim()) {
        setError(messageInput, messageError, 'Please write a message.');
        hasErrors = true;
      } else if (messageInput.value.trim().length < 10) {
        setError(messageInput, messageError, 'Message must be at least 10 characters.');
        hasErrors = true;
      } else {
        setError(messageInput, messageError, '');
      }

      if (hasErrors) {
        return; // stop here if there are errors
      }

      // All good — show success message (no backend connected)
      formSuccess.classList.remove('hidden');
      submitBtn.disabled = true;
      submitBtn.textContent = '✅ Message Noted!';
      submitBtn.style.opacity = '0.7';

      // Reset the form after 5 seconds
      setTimeout(function () {
        contactForm.reset();
        formSuccess.classList.add('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Send Message';
        submitBtn.style.opacity = '';
      }, 5000);
    });
  }

  /* ---------------------------------------------------------------
     6. BACK TO TOP BUTTON
     ---------------------------------------------------------------
     Shows a floating button once the user scrolls past 300px.
     Clicking it smoothly scrolls back to the top of the page.
  --------------------------------------------------------------- */
  const backToTopBtn = document.getElementById('backToTop');

  function handleBackToTopVisibility() {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  }

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------------------
     7. FOOTER YEAR
     ---------------------------------------------------------------
     Dynamically sets the copyright year so you never need to
     manually update it each January 1st.
  --------------------------------------------------------------- */
  const footerYearEl = document.getElementById('footerYear');
  if (footerYearEl) {
    footerYearEl.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------------
     8. SCROLL EVENT LISTENER
     ---------------------------------------------------------------
     All scroll-dependent functions are called here from one
     listener (more efficient than multiple scroll listeners).
  --------------------------------------------------------------- */
  window.addEventListener('scroll', function () {
    handleNavbarScroll();
    handleBackToTopVisibility();
  }, { passive: true }); // passive: true = better scroll performance

  // Run once on load in case page is refreshed mid-scroll
  handleNavbarScroll();
  handleBackToTopVisibility();

  /* ---------------------------------------------------------------
     9. SMOOTH SCROLL FOR ANCHOR LINKS (fallback for older browsers)
     ---------------------------------------------------------------
     Modern browsers support CSS scroll-behavior: smooth.
     This JS fallback ensures it works everywhere.
  --------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return; // href="#" with nothing after

      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const navHeight = navbar ? navbar.offsetHeight : 70;
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });
    });
  });

  /* ---------------------------------------------------------------
     10. PROFILE IMAGE ERROR HANDLER
     ---------------------------------------------------------------
     If profile.jpg doesn't load, the onerror in HTML adds the
     'no-photo' class to the wrapper, which CSS uses to show the
     fallback SVG avatar. No extra JS needed here, but we also
     handle it in JS for safety.
  --------------------------------------------------------------- */
  const profileImg = document.querySelector('.profile-img');
  if (profileImg) {
    profileImg.addEventListener('error', function () {
      this.style.display = 'none';
      const wrapper = this.closest('.photo-wrapper');
      if (wrapper) wrapper.classList.add('no-photo');
    });
  }

  console.log(
    '%c👋 Hello from Akash\'s Portfolio!',
    'color:#a855f7;font-size:16px;font-weight:bold;'
  );
  console.log(
    '%cBuilt with HTML, CSS & vanilla JavaScript.\nIf you\'re reading this, you\'re curious — keep exploring! 🚀',
    'color:#06b6d4;font-size:12px;'
  );

}); // end DOMContentLoaded

/* =================================================================
   HOW TO ADD A NEW PROJECT
   =================================================================

   1. Open index.html
   2. Find the section with id="projects-grid"
   3. Copy one of the existing <article class="project-card ...">
      blocks
   4. Paste it BEFORE the closing </div> of projects-grid
   5. Update the following fields:
      - project-icon:   change the emoji
      - project-status-badge: change class to "done" for completed
        projects; update the text e.g. "✅ Completed"
      - project-title:  your project name
      - project-desc:   describe what it does
      - project-tags:   update the technology tags (HTML, Python, etc.)
      - GitHub button:  change `disabled` to `href="YOUR_GITHUB_URL"`
        and remove the `disabled` attribute and `disabled` class
      - Live Demo:      similarly add your live URL

   EXAMPLE of a completed project card:

   <article class="project-card">
     <div class="project-card-header">
       <div class="project-icon">🔐</div>
       <div class="project-status-badge done">✅ Completed</div>
     </div>
     <div class="project-card-body">
       <h3 class="project-title">Password Strength Checker</h3>
       <p class="project-desc">
         A Python script that evaluates password strength.
       </p>
       <div class="project-tags">
         <span class="tag tag-python">Python</span>
       </div>
     </div>
     <div class="project-card-footer">
       <a href="https://github.com/yourusername/project" target="_blank" class="btn-project">
         GitHub
       </a>
       <a href="https://your-demo-link.com" target="_blank" class="btn-project">
         Live Demo
       </a>
     </div>
   </article>

================================================================= */
