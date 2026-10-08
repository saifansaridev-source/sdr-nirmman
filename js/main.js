/* ==========================================================================
   SDR Nirmman Private Limited - Property Research & Analysis
   Global JavaScript Interactions (single combined file for all pages)
   ========================================================================== */

/* ==========================================================================
   0. Splash / Preloader Logo Animation (runs before DOMContentLoaded body)
   ========================================================================== */
(function initSplash() {
  const alreadyShown = sessionStorage.getItem('sdrSplashShown');

  const splash = document.createElement('div');
  splash.id = 'site-splash';
  splash.innerHTML = `
    <img src="assets/images/logo.png" alt="SDR Nirmman Pvt Ltd" class="splash-logo">
    <div class="splash-brand">SDR <span>Nirmman</span> Pvt Ltd</div>
    <div class="splash-bar"></div>
  `;

  document.body.insertBefore(splash, document.body.firstChild);
  document.body.classList.add('splash-active');

  const removeSplash = () => {
    splash.classList.add('splash-hide');
    document.body.classList.remove('splash-active');
    setTimeout(() => splash.remove(), 650);
  };

  if (alreadyShown) {
    setTimeout(removeSplash, 500);
  } else {
    sessionStorage.setItem('sdrSplashShown', '1');
    setTimeout(removeSplash, 1600);
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons if loaded
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 1. Mobile Hamburger Menu
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navOverlay = document.querySelector('.nav-overlay');

  const closeMenu = () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
  };

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
      if (navOverlay) navOverlay.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    if (navOverlay) {
      navOverlay.addEventListener('click', closeMenu);
    }

    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        closeMenu();
      }
    });
  }

  // 2. Sticky Header
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    });
  }

  // 3. Stats Counter Animation
  const stats = document.querySelectorAll('.stat-number');
  if (stats.length > 0) {
    const runCounter = () => {
      stats.forEach(stat => {
        const target = +stat.getAttribute('data-target');
        const speed = 150;
        const increment = target / speed;

        const updateCount = () => {
          const current = +stat.innerText.replace('+', '').replace(',', '');
          if (current < target) {
            const nextValue = Math.ceil(current + increment);
            stat.innerText = (nextValue > target ? target : nextValue) + '+';
            setTimeout(updateCount, 15);
          } else {
            stat.innerText = target.toLocaleString() + '+';
          }
        };
        updateCount();
      });
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
      counterObserver.observe(statsSection);
    }
  }

  // 4. Testimonial / Director Slider Carousel
  // Scoped per .testimonial-container so multiple sliders on a page never conflict.
  const containers = document.querySelectorAll('.testimonial-container');

  containers.forEach(container => {
    const slides = container.querySelectorAll('.testimonial-slide');
    const prevBtn = container.querySelector('.testimonial-prev');
    const nextBtn = container.querySelector('.testimonial-next');
    const dotsContainer = container.querySelector('.testimonial-dots');

    if (!slides.length) return;

    let currentSlide = 0;
    let slideInterval;

    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('testimonial-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
      });
    }

    const dots = dotsContainer ? dotsContainer.querySelectorAll('.testimonial-dot') : [];

    function updateSlider() {
      slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
      dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
    }

    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      updateSlider();
    }

    function prevSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateSlider();
    }

    function goToSlide(index) {
      currentSlide = index;
      updateSlider();
      resetInterval();
    }

    function startInterval() {
      slideInterval = setInterval(nextSlide, 6000);
    }

    function resetInterval() {
      clearInterval(slideInterval);
      startInterval();
    }

    // FIXED: next button correctly calls nextSlide, prev button calls prevSlide
    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetInterval(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetInterval(); });

    startInterval();
  });

  // 5. FAQ Accordion Toggle
  const faqHeaders = document.querySelectorAll('.faq-header');
  faqHeaders.forEach(faqHeader => {
    faqHeader.addEventListener('click', () => {
      const faqItem = faqHeader.parentElement;
      const faqBody = faqItem.querySelector('.faq-body');

      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem && item.classList.contains('active')) {
          item.classList.remove('active');
          item.querySelector('.faq-body').style.maxHeight = null;
        }
      });

      faqItem.classList.toggle('active');
      if (faqItem.classList.contains('active')) {
        faqBody.style.maxHeight = faqBody.scrollHeight + "px";
      } else {
        faqBody.style.maxHeight = null;
      }
    });
  });

  // 6. Floating Back-to-Top Button Control
  const backToTopBtn = document.querySelector('.floating-back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 7. Search Form Action on Hero Widget
  const searchForm = document.getElementById('heroSearchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const state = document.getElementById('searchState').value;
      const searchVal = document.getElementById('searchInput').value.trim();

      if (!searchVal) {
        alert('Please enter a location or query to search.');
        return;
      }

      window.location.href = `services.html?state=${encodeURIComponent(state)}&query=${encodeURIComponent(searchVal)}`;
    });
  }

  // 8. Contact & Consultation Form Validation (generic forms, e.g. contact/booking pages)
  const formsToValidate = document.querySelectorAll('.validate-form');
  formsToValidate.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');

      inputs.forEach(input => {
        input.style.borderColor = '';

        if (!input.value.trim()) {
          isValid = false;
          input.style.borderColor = 'red';
        } else if (input.type === 'email' && !validateEmail(input.value)) {
          isValid = false;
          input.style.borderColor = 'red';
        } else if (input.type === 'tel' && !validatePhone(input.value)) {
          isValid = false;
          input.style.borderColor = 'red';
        }
      });

      if (isValid) {
        sendFormToWhatsApp(form);
        showSuccessModal(form);
      } else {
        alert('Please fill out all fields correctly. Invalid fields are highlighted in red.');
      }
    });
  });

  function sendFormToWhatsApp(form) {
    const WHATSAPP_NUMBER = '919335555000'; // business WhatsApp number (no + or leading 0)
    const fields = form.querySelectorAll('input, select, textarea');
    const lines = [];

    fields.forEach(field => {
      if (!field.value.trim()) return;
      const label = field.id ? form.querySelector(`label[for="${field.id}"]`) : null;
      let labelText = label
        ? label.textContent.replace('*', '').trim()
        : (field.placeholder || field.name || field.id || 'Field');
      let value = field.value.trim();
      if (field.tagName === 'SELECT') {
        value = field.options[field.selectedIndex].textContent.trim();
      }
      lines.push(`*${labelText}:* ${value}`);
    });

    let formTitle = 'New Website Enquiry';
    if (form.classList.contains('newsletter-form')) {
      formTitle = 'New Newsletter Signup';
    } else if (document.getElementById('bookingPlan')) {
      formTitle = 'New Consultation Booking';
    }
    const message = `${formTitle}%0A%0A${lines.map(l => encodeURIComponent(l)).join('%0A')}`;
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    window.open(waUrl, '_blank', 'noopener');
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePhone(phone) {
    const re = /^[0-9]{10,12}$/;
    return re.test(phone.replace(/[\s-+()]/g, ''));
  }

  function showSuccessModal(form) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '50%';
    modal.style.left = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.background = '#ffffff';
    modal.style.padding = '2.5rem';
    modal.style.boxShadow = '0 10px 45px rgba(13, 43, 94, 0.25)';
    modal.style.zIndex = '9999';
    modal.style.borderRadius = '8px';
    modal.style.textAlign = 'center';
    modal.style.maxWidth = '400px';
    modal.style.width = '90%';
    modal.style.border = '2px solid #f5b402';
    modal.style.animation = 'fadeIn 0.3s ease';

    modal.innerHTML = `
      <div style="font-size: 3rem; color: #25d366; margin-bottom: 1rem;"><i class="lucide-check-circle"></i></div>
      <h3 style="color: #0d2b5e; font-family: 'Poppins', sans-serif; margin-bottom: 0.5rem; font-weight: 600;">Request Submitted</h3>
      <p style="color: #64748b; font-size: 0.9rem; margin-bottom: 1.5rem;">Thank you for contacting SDR Nirmman. We've opened WhatsApp with your details pre-filled &mdash; just hit send, and our senior property analyst will reply within 2 business hours.</p>
      <button class="btn btn-primary" id="closeModalBtn" style="margin: 0 auto;">Close</button>
    `;

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(13, 43, 94, 0.6)';
    overlay.style.backdropFilter = 'blur(4px)';
    overlay.style.zIndex = '9998';

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    if (typeof lucide !== 'undefined') {
      lucide.createIcons({ attrs: { style: 'stroke-width: 2;' } });
    }

    const closeModal = () => {
      document.body.removeChild(modal);
      document.body.removeChild(overlay);
      form.reset();
    };

    document.getElementById('closeModalBtn').addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
  }

  // -----------------------------------------------------------------------
  // 9. Payment confirmation -> WhatsApp handoff (used on payment.html)
  // IMPORTANT: change WHATSAPP_NUMBER below to your business WhatsApp number
  // Format: countrycode + number, no +, no spaces, no dashes.
  // -----------------------------------------------------------------------
  const PAYMENT_WHATSAPP_NUMBER = "919335555000"; // <-- change this to your real WhatsApp number

  const paymentForm = document.getElementById("paymentForm");
  if (paymentForm) {
    paymentForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("payName").value.trim();
      const phone = document.getElementById("payPhone").value.trim();
      const amount = document.getElementById("payAmount").value.trim();
      const serviceSelect = document.getElementById("payService");
      const service = serviceSelect.options[serviceSelect.selectedIndex]
        ? serviceSelect.options[serviceSelect.selectedIndex].textContent.trim()
        : "";
      const utr = document.getElementById("payUtr").value.trim();

      if (!name || !phone || !amount || !service) {
        alert("Please fill all required fields before sending confirmation.");
        return;
      }

      if (!/^[0-9]{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
      }

      const lines = [
        "*New Payment Confirmation — SDR Nirmman*",
        "",
        "Name: " + name,
        "Phone: " + phone,
        "Amount Paid: ₹" + amount,
        "Service / Plan: " + service,
        "UPI Transaction ID / UTR: " + (utr ? utr : "Not provided"),
        "TID (SmartHub): 82296651",
        "",
        "Payment made via QR / UPI on sdrnirmman.com. Please verify and confirm."
      ];

      const message = encodeURIComponent(lines.join("\n"));
      const waUrl = "https://wa.me/" + PAYMENT_WHATSAPP_NUMBER + "?text=" + message;

      window.open(waUrl, "_blank", "noopener");
    });
  }

  // 12. Interactive Focus Video Showcase Controller
  const focusPlayer = document.getElementById('video-focus-player');
  const mainVideo = document.getElementById('vfp-main-video');
  const playTrigger = document.getElementById('vfp-play-trigger');
  const thumbCards = document.querySelectorAll('.video-thumb-card');
  const tagEl = document.getElementById('vfp-now-tag');
  const titleEl = document.getElementById('vfp-now-title');
  const descEl = document.getElementById('vfp-now-desc');
  const statusEl = document.getElementById('vfp-status-text');

  if (focusPlayer && mainVideo && thumbCards.length > 0) {
    let currentSrc = mainVideo.querySelector('source')?.getAttribute('src') || thumbCards[0].getAttribute('data-src');

    const updateActiveMeta = (card) => {
      if (tagEl) tagEl.textContent = card.getAttribute('data-tag') || '';
      if (titleEl) titleEl.textContent = card.getAttribute('data-title') || '';
      if (descEl) descEl.textContent = card.getAttribute('data-desc') || '';
    };

    const playWithAudio = () => {
      // Ensure audio is fully unmuted and audible on user interaction
      mainVideo.muted = false;
      mainVideo.volume = 1.0;

      const playPromise = mainVideo.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          focusPlayer.classList.add('is-playing');
          if (statusEl) statusEl.textContent = 'Playing with Sound • HD';
        }).catch(() => {
          // Fallback if browser requires user gesture confirmation for sound
          mainVideo.muted = true;
          mainVideo.play().then(() => {
            focusPlayer.classList.add('is-playing');
            if (statusEl) statusEl.textContent = 'Playing (Tap volume to unmute)';
          }).catch(err => {
            console.warn('Video playback notice:', err);
          });
        });
      }
    };

    // Thumbnail Selection & Playback
    thumbCards.forEach((card, index) => {
      card.addEventListener('click', () => {
        const targetSrc = card.getAttribute('data-src');
        const targetPoster = card.getAttribute('data-poster');
        const isCurrentVideo = (currentSrc === targetSrc);

        // Update active class on cards
        thumbCards.forEach(c => c.classList.remove('is-active'));
        card.classList.add('is-active');

        if (isCurrentVideo) {
          // If already the selected video, toggle play/pause
          if (mainVideo.paused) {
            playWithAudio();
          } else {
            mainVideo.pause();
          }
        } else {
          // Switch to new video
          mainVideo.pause();
          focusPlayer.classList.remove('is-playing');
          currentSrc = targetSrc;
          mainVideo.src = targetSrc;
          if (targetPoster) mainVideo.poster = targetPoster;
          updateActiveMeta(card);
          mainVideo.load();
          playWithAudio();
        }
      });
    });

    // Big Overlay Play Trigger Button
    if (playTrigger) {
      playTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        playWithAudio();
      });
    }

    // Video Lifecycle Events
    mainVideo.addEventListener('play', () => {
      focusPlayer.classList.add('is-playing');
      if (statusEl && !mainVideo.muted) {
        statusEl.textContent = 'Playing with Sound • HD';
      }
    });

    mainVideo.addEventListener('pause', () => {
      focusPlayer.classList.remove('is-playing');
      if (statusEl && !mainVideo.ended) {
        statusEl.textContent = 'Paused • Click to resume';
      }
    });

    mainVideo.addEventListener('ended', () => {
      // Clean idle return state: do NOT auto-advance or loop
      focusPlayer.classList.remove('is-playing');
      if (statusEl) {
        statusEl.textContent = 'Finished • Select another reel';
      }
      mainVideo.currentTime = 0;
    });

    mainVideo.addEventListener('volumechange', () => {
      if (statusEl && focusPlayer.classList.contains('is-playing')) {
        statusEl.textContent = mainVideo.muted ? 'Muted' : 'Audio Enabled • HD';
      }
    });
  }

  // 13. Floating Dual-Number Call Popover Controller
  const callContainers = document.querySelectorAll('.floating-call-container');
  callContainers.forEach(container => {
    const callBtn = container.querySelector('.floating-call');
    if (callBtn) {
      callBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        container.classList.toggle('active');
      });
    }
  });

  // Close floating call popovers on outside click
  document.addEventListener('click', (e) => {
    callContainers.forEach(container => {
      if (!container.contains(e.target)) {
        container.classList.remove('active');
      }
    });
  });
});