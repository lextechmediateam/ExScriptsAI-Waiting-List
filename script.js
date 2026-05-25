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
async function handleJoin() {
  const input  = document.getElementById('email-input');
  const btn    = document.getElementById('join-btn');
  const errMsg = document.getElementById('error-msg');
  if (!input || !btn || !errMsg) return;
  const email  = input.value.trim();

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!valid) {
    input.style.borderColor = '#ff6b6b';
    errMsg.style.display = 'block';
    input.focus();
    setTimeout(() => { input.style.borderColor = ''; errMsg.style.display = 'none'; }, 2500);
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Joining...';

  try {
    const params = new URLSearchParams({
      email: email,
      timestamp: new Date().toISOString(),
      source: document.referrer || 'direct'
    });
    await fetch(GOOGLE_SCRIPT_URL + '?' + params.toString(), {
      method: 'GET',
      mode: 'no-cors'
    });
  } catch (e) {
    console.warn('Submission note:', e);
  }

  document.getElementById('form-area').style.display = 'none';
  const success = document.getElementById('success-area');
  if (success) success.style.display = 'flex';

  const counter = document.getElementById('counter');
  if (counter) {
    const n = parseInt(counter.textContent.replace(/,/g, '')) + 1;
    counter.textContent = n.toLocaleString();
  }
}
