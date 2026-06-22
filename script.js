// ===== Mobile nav toggle =====
const navToggle = document.getElementById('navToggle');
const mainNav   = document.getElementById('mainNav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});
mainNav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ===== Pre-select course when card "Enroll Now" is clicked =====
const courseSelect = document.getElementById('course');
document.querySelectorAll('[data-course]').forEach(btn => {
  btn.addEventListener('click', () => {
    if (courseSelect) courseSelect.value = btn.getAttribute('data-course');
  });
});

// ===== Enrollment form — Formspree AJAX submit =====
const enrollForm  = document.getElementById('enrollForm');
const formFields  = document.getElementById('formFields');
const formSuccess = document.getElementById('formSuccess');
const submitBtn   = document.getElementById('submitBtn');

enrollForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (!enrollForm.checkValidity()) {
    enrollForm.reportValidity();
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting…';

  try {
    const data = new FormData(enrollForm);
    const response = await fetch(enrollForm.action, {
      method: 'POST',
      body: data,
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      // Save to localStorage for admin panel
      const entry = {
        id: Date.now(),
        date: new Date().toLocaleString('en-PK'),
        studentName:   data.get('studentName'),
        studentAge:    data.get('studentAge'),
        course:        data.get('course'),
        country:       data.get('country'),
        parentName:    data.get('parentName'),
        whatsapp:      data.get('whatsapp'),
        email:         data.get('email'),
        preferredTime: data.get('preferredTime'),
        message:       data.get('message'),
        status:        'Pending'
      };
      const existing = JSON.parse(localStorage.getItem('ah_enrollments') || '[]');
      existing.unshift(entry);
      localStorage.setItem('ah_enrollments', JSON.stringify(existing));

      // Show payment step
      formFields.hidden  = true;
      formSuccess.hidden = false;
      formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      submitBtn.disabled    = false;
      submitBtn.textContent = 'Submit Enrollment →';
      alert('Something went wrong. Please WhatsApp us directly at +92 305 2972902');
    }
  } catch (err) {
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Submit Enrollment →';
    alert('Network error. Please WhatsApp us directly at +92 305 2972902');
  }
});
