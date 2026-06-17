import React, { useState, useEffect } from "react";

export default function App() {
  const [email, setEmail] = useState("");
  const [consentLaunch, setConsentLaunch] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showError, setShowError] = useState(false);
  const [counter, setCounter] = useState(0);

  const targetCounter = 847;

  // Animated counter on mount
  useEffect(() => {
    let current = 0;
    const step = Math.ceil(targetCounter / 60);
    const interval = setInterval(() => {
      current = Math.min(current + step, targetCounter);
      setCounter(current);
      if (current >= targetCounter) clearInterval(interval);
    }, 22);
    return () => clearInterval(interval);
  }, []);

  const handleJoinClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setShowError(true);
      setTimeout(() => setShowError(false), 2500);
      return;
    }
    setConsentLaunch(false);
    setConsentMarketing(false);
    setIsModalOpen(true);
  };

  const handleConfirmConsent = async () => {
    setIsSubmitting(true);
    const apiURL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/waitlist";

    try {
      const payload = {
        email: email.trim(),
        consent_launch: true,
        consent_marketing: consentMarketing,
        referrer: document.referrer || "direct"
      };

      await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn("Submission error:", e);
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
      setIsSubmitted(true);
      setCounter((prev) => prev + 1);
    }
  };

  return (
    <>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      {isModalOpen && (
        <div 
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal-top-bar"></div>
            <div className="modal-body">
              <h2 id="modal-title">Before we add you to the waitlist</h2>
              <p className="modal-sub">Please confirm your preferences below to continue.</p>

              <div className={`consent-item ${consentLaunch ? "checked" : ""}`}>
                <input 
                  type="checkbox" 
                  id="consent-launch"
                  checked={consentLaunch}
                  onChange={(e) => setConsentLaunch(e.target.checked)}
                />
                <label htmlFor="consent-launch">
                  I agree to receive a launch notification email from ExScripts / LexTech Ecosystem Limited when the product becomes available.
                  <span className="tag tag-required">Required</span>
                </label>
              </div>

              <div className={`consent-item ${consentMarketing ? "checked" : ""}`}>
                <input 
                  type="checkbox" 
                  id="consent-marketing"
                  checked={consentMarketing}
                  onChange={(e) => setConsentMarketing(e.target.checked)}
                />
                <label htmlFor="consent-marketing">
                  I agree to receive product updates and marketing communications about ExScripts, including feature announcements, early-access offers, and pricing information.
                  <span className="tag tag-optional">Optional</span>
                </label>
              </div>

              <div className="modal-actions">
                <button className="btn-ghost" onClick={() => setIsModalOpen(false)}>No thanks</button>
                <button 
                  className="btn-confirm" 
                  onClick={handleConfirmConsent}
                  disabled={!consentLaunch || isSubmitting}
                >
                  {isSubmitting ? "Joining..." : "Confirm & Join Waitlist"}
                </button>
              </div>

              <div className="modal-footer">
                You can unsubscribe at any time &nbsp;&middot;&nbsp;
                <a href="mailto:privacy@lextechgroup.com">privacy@lextechgroup.com</a>
              </div>
            </div>
          </div>
        </div>
      )}

      <main>
        <div className="badge">Early Access · Limited Spots</div>

        <div className="hero">
          <h1>
            <span className="line1">Transcribe in Seconds with</span>
            <span className="brand">ExScripts</span>
          </h1>
          <p>
            Accurate, lightning-fast AI transcription built for professionals.
            Join the waitlist and be first to experience the future of audio-to-text.
          </p>
        </div>

        <div className="card">
          {!isSubmitted ? (
            <div id="form-area">
              <label className="form-label" htmlFor="email-input">Your Email</label>
              <div className="input-row">
                <input 
                  type="email" 
                  id="email-input" 
                  placeholder="you@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email" 
                  required 
                />
                <button className="btn" onClick={handleJoinClick}>Join Waitlist</button>
              </div>
              {showError && <p className="error-msg" id="error-msg">Please enter a valid email address.</p>}
              <p className="privacy-note">No spam. Unsubscribe anytime. Your data stays private.</p>
            </div>
          ) : (
            <div className="success-msg" id="success-area">
              <div className="check">&#10003;</div>
              <h3>You're on the list!</h3>
              <p>We'll notify you the moment ExScripts launches.</p>
            </div>
          )}
        </div>

        <div className="stats">
          <div className="stat">
            <div className="num" id="counter">{counter.toLocaleString()}</div>
            <div className="lbl">Signed Up</div>
          </div>
          <div className="stat">
            <div className="num">Q3 '26</div>
            <div className="lbl">Target Launch</div>
          </div>
          <div className="stat">
            <div className="num">Free</div>
            <div className="lbl">Early Access Tier</div>
          </div>
        </div>

        <div className="features">
          <div className="feat"><span className="feat-dot"></span>99%+ Accuracy</div>
          <div className="feat"><span className="feat-dot"></span>Multi-language support</div>
          <div className="feat"><span className="feat-dot"></span>Real-time transcription</div>
          <div className="feat"><span className="feat-dot"></span>Speaker identification</div>
          <div className="feat"><span className="feat-dot"></span>Export to any format</div>
        </div>
      </main>

      <footer>&#169; 2026 ExScripts &middot; All rights reserved</footer>
    </>
  );
}
