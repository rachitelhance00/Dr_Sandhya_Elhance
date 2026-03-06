/* =====================================================
   Dr. Sandhya Elhance – Landing Page Scripts
   ===================================================== */

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
const floatingBtn = document.getElementById('floatingBtn');

// Scroll progress bar
const scrollBar = document.createElement('div');
scrollBar.className = 'scroll-progress';
document.body.appendChild(scrollBar);

window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollBar.style.width = progress + '%';

  if (scrollTop > 80) {
    navbar.classList.add('scrolled');
    floatingBtn.classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    floatingBtn.classList.remove('visible');
  }
}, { passive: true });

// ---- Hamburger menu ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  hamburger.querySelectorAll('span')[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)' : '';
  hamburger.querySelectorAll('span')[1].style.opacity = isOpen ? '0' : '';
  hamburger.querySelectorAll('span')[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ---- Smooth scroll for anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = navbar.offsetHeight;
      const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight - 8;
      window.scrollTo({ top: targetPos, behavior: 'smooth' });
    }
  });
});

// ---- Set min date for booking form ----
const prefDateInput = document.getElementById('prefDate');
if (prefDateInput) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const yyyy = tomorrow.getFullYear();
  const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const dd = String(tomorrow.getDate()).padStart(2, '0');
  prefDateInput.min = `${yyyy}-${mm}-${dd}`;

  // Disable Sundays
  prefDateInput.addEventListener('change', function() {
    const date = new Date(this.value);
    if (date.getDay() === 0) { // Sunday
      showFieldError('prefDate', 'Clinic is closed on Sundays. Please select another day.');
      this.value = '';
    } else {
      clearFieldError('prefDate');
    }
  });
}

// ---- Form validation helpers ----
function showFieldError(fieldId, msg) {
  const field = document.getElementById(fieldId);
  const err = document.getElementById('err-' + fieldId);
  if (field) field.classList.add('error');
  if (err) err.textContent = msg;
}

function clearFieldError(fieldId) {
  const field = document.getElementById(fieldId);
  const err = document.getElementById('err-' + fieldId);
  if (field) field.classList.remove('error');
  if (err) err.textContent = '';
}

function clearAllErrors() {
  ['fullName', 'email', 'phone', 'prefDate', 'prefTime', 'concern', 'consent'].forEach(clearFieldError);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  const cleaned = phone.replace(/\s+/g, '').replace(/[-()]/g, '');
  return /^(\+91)?[6-9]\d{9}$/.test(cleaned);
}

// ---- Booking Form submission ----
const bookingForm = document.getElementById('bookingForm');
const bookingSuccess = document.getElementById('bookingSuccess');

if (bookingForm) {
  // Live validation
  ['fullName', 'email', 'phone', 'prefDate', 'prefTime', 'concern'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => clearFieldError(id));
      el.addEventListener('change', () => clearFieldError(id));
    }
  });

  bookingForm.addEventListener('submit', function(e) {
    e.preventDefault();
    clearAllErrors();

    let isValid = true;

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const prefDate = document.getElementById('prefDate').value;
    const prefTime = document.getElementById('prefTime').value;
    const concern = document.getElementById('concern').value;
    const consent = document.getElementById('consent').checked;

    if (!fullName || fullName.length < 2) {
      showFieldError('fullName', 'Please enter your full name.');
      isValid = false;
    }

    if (!email || !validateEmail(email)) {
      showFieldError('email', 'Please enter a valid email address.');
      isValid = false;
    }

    if (!phone || !validatePhone(phone)) {
      showFieldError('phone', 'Please enter a valid Indian mobile number.');
      isValid = false;
    }

    if (!prefDate) {
      showFieldError('prefDate', 'Please select a preferred date.');
      isValid = false;
    } else {
      const selectedDay = new Date(prefDate).getDay();
      if (selectedDay === 0) {
        showFieldError('prefDate', 'Clinic is closed on Sundays.');
        isValid = false;
      }
    }

    if (!prefTime) {
      showFieldError('prefTime', 'Please select a preferred time slot.');
      isValid = false;
    }

    if (!concern) {
      showFieldError('concern', 'Please select your primary concern.');
      isValid = false;
    }

    if (!consent) {
      showFieldError('consent', 'Please agree to the privacy policy to proceed.');
      isValid = false;
    }

    if (!isValid) return;

    // Simulate form submission
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;

    // Format date for display
    const dateObj = new Date(prefDate);
    const formattedDate = dateObj.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    setTimeout(() => {
      bookingForm.style.display = 'none';
      bookingSuccess.style.display = 'block';
      document.getElementById('successDetail').textContent =
        `${fullName} — ${formattedDate} at ${prefTime} for ${concern}`;

      // Scroll to success message
      bookingSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // In a real implementation, you'd POST to a backend here:
      // fetch('/api/booking', { method: 'POST', headers: {'Content-Type':'application/json'},
      //   body: JSON.stringify({ fullName, email, phone, prefDate, prefTime, concern, message }) })
    }, 1200);
  });
}

function resetBooking() {
  if (bookingForm) {
    bookingForm.reset();
    bookingForm.style.display = 'flex';
    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.textContent = 'Confirm My Appointment';
      submitBtn.disabled = false;
    }
  }
  if (bookingSuccess) {
    bookingSuccess.style.display = 'none';
  }
  clearAllErrors();
}

// ---- Quick booking (banner form) ----
function quickBooking() {
  const name = document.getElementById('quickName').value.trim();
  const concern = document.getElementById('quickConcern').value;
  const phone = document.getElementById('quickPhone').value.trim();

  if (!name || !concern || !phone) {
    alert('Please fill in all fields to continue.');
    return;
  }

  // Pre-fill main form and scroll to it
  const fullNameInput = document.getElementById('fullName');
  const concernSelect = document.getElementById('concern');
  const phoneInput = document.getElementById('phone');

  if (fullNameInput) fullNameInput.value = name;
  if (concernSelect) concernSelect.value = concern;
  if (phoneInput) phoneInput.value = phone;

  // Clear quick form
  document.getElementById('quickName').value = '';
  document.getElementById('quickConcern').value = '';
  document.getElementById('quickPhone').value = '';

  // Scroll to booking section
  const bookingSection = document.getElementById('booking');
  if (bookingSection) {
    const navHeight = navbar.offsetHeight;
    const pos = bookingSection.getBoundingClientRect().top + window.scrollY - navHeight - 8;
    window.scrollTo({ top: pos, behavior: 'smooth' });
  }
}

// ---- Newsletter subscribe ----
function subscribeNewsletter() {
  const emailInput = document.getElementById('nlEmail');
  if (!emailInput) return;
  const email = emailInput.value.trim();
  if (!email || !validateEmail(email)) {
    emailInput.style.borderColor = '#ef4444';
    emailInput.placeholder = 'Please enter a valid email';
    return;
  }
  emailInput.style.borderColor = '';
  emailInput.value = '';
  emailInput.placeholder = 'Subscribed! Thank you.';
  setTimeout(() => { emailInput.placeholder = 'your@email.com'; }, 3000);
}

// ---- Intersection Observer for fade-in animations ----
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe cards and sections
document.querySelectorAll('.service-card, .review-card, .about-card, .why-point').forEach(el => {
  el.style.opacity = '0';
  observer.observe(el);
});

// ---- Animated stat counters ----
function animateCounter(el, target, suffix, duration) {
  const start = performance.now();
  const startVal = 0;
  el.textContent = startVal + suffix;
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const numberEl = entry.target.querySelector('.stat-number');
      if (!numberEl) return;
      const text = numberEl.textContent.trim();
      const hasStar = text.includes('★') || text.includes('⭐');
      if (hasStar) { statObserver.unobserve(entry.target); return; }
      const suffix = text.includes('+') ? '+' : '';
      const numStr = text.replace('+', '').replace(',', '');
      const target = parseFloat(numStr);
      if (!isNaN(target) && target > 1) {
        animateCounter(numberEl, target, suffix, 1600);
      }
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.stat-item').forEach(el => statObserver.observe(el));

// ---- Active nav link on scroll ----
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - navbar.offsetHeight - 20;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}, { passive: true });
