/* ── REPLACE THIS with your Google Apps Script Web App URL ── */
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbylMPLzqSeP7o3-XH7EJb9bBOFnZyn9y_4_Q3jJU22DiHvoXKcAElkNJlUxYJShPib5/exec';

/* ── Animated counter ── */
(function () {
  const target = 847;
  const el = document.getElementById('counter');
  if (!el) return;
  let current = 0;
  const step = Math.ceil(target / 60);
  const interval = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current.toLocaleString();
    if (current >= target) clearInterval(interval);
  }, 22);
})();

/* ── Waitlist form ── */
// Enable confirm button only when required checkbox is ticked
document.getElementById('consent-launch').addEventListener('change', function () {
  document.getElementById('confirm-btn').disabled = !this.checked;
});

function openModal() {
  const input  = document.getElementById('email-input');
  const errMsg = document.getElementById('error-msg');
  const email  = input.value.trim();

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!valid) {
    input.style.borderColor = '#ff6b6b';
    errMsg.style.display = 'block';
    input.focus();
    setTimeout(() => { input.style.borderColor = ''; errMsg.style.display = 'none'; }, 2500);
    return;
  }

  document.getElementById('consent-launch').checked    = false;
  document.getElementById('consent-marketing').checked = false;
  document.getElementById('confirm-btn').disabled = true;
  document.getElementById('privacy-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('privacy-modal').classList.remove('active');
  document.body.style.overflow = '';
}

async function confirmConsent() {
  const email      = document.getElementById('email-input').value.trim();
  const marketing  = document.getElementById('consent-marketing').checked;
  const confirmBtn = document.getElementById('confirm-btn');

  confirmBtn.disabled = true;
  confirmBtn.textContent = 'Joining...';

  try {
    const params = new URLSearchParams({
      email:             email,
      timestamp:         new Date().toISOString(),
      source:            document.referrer || 'direct',
      consent_launch:    'true',
      consent_marketing: marketing ? 'true' : 'false'
    });
    await fetch(GOOGLE_SCRIPT_URL + '?' + params.toString(), {
      method: 'GET',
      mode: 'no-cors'
    });
  } catch (e) {
    console.warn('Submission note:', e);
  }

  closeModal();
  document.getElementById('form-area').style.display = 'none';
  const success = document.getElementById('success-area');
  success.style.display = 'flex';

  const counter = document.getElementById('counter');
  const n = parseInt(counter.textContent.replace(/,/g, '')) + 1;
  counter.textContent = n.toLocaleString();
}

// Close modal if user clicks outside it
document.getElementById('privacy-modal').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});