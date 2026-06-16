import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="landing-page">

      {/* NAV */}
      <nav className={`land-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="land-nav-logo">StreamVault</div>
        <div className="land-nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#about">About</a>
        </div>
        <div className="land-nav-cta">
          <Link to="/login" className="btn-ghost">Sign in</Link>
          <Link to="/register" className="btn-gold">Get Started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-eyebrow">
          <span className="status-dot" />
          Now Streaming in HLS
        </div>
        <h1 className="hero-title">
          Your Cinema.<br /><em>Your Rules.</em>
        </h1>
        <p className="hero-sub">
          Upload, stream, and discover videos with adaptive quality,
          seamless playback, and a platform built for creators and viewers alike.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="hero-btn-primary">
            Start Watching →
          </Link>
          <Link to="/login" className="hero-btn-secondary">
            Sign In
          </Link>
        </div>
        <div className="hero-scroll-hint">
          <span>Explore</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ background: "var(--bg)" }}>
        <div className="features-section">
          <p className="section-label">Why StreamVault</p>
          <h2 className="section-title">Built for the Modern Streaming Experience</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Adaptive HLS Streaming</h3>
              <p>Powered by HLS.js, videos automatically adapt quality to your network speed — no buffering, no compromise.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎛</div>
              <h3>Manual Quality Control</h3>
              <p>Take full control with per-stream quality selection. Choose 1080p, 720p, 480p, or let Auto handle it.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Private</h3>
              <p>JWT authentication with automatic token refresh keeps your account and content protected at all times.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Instant Search</h3>
              <p>Find any video in your library instantly with real-time client-side filtering as you type.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📤</div>
              <h3>Easy Uploads</h3>
              <p>Upload your videos directly to the platform. Your content is stored, encoded, and ready to stream.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Cross-Device Ready</h3>
              <p>Fully responsive layout. Watch on desktop, tablet, or mobile — the experience scales beautifully.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="steps-section">
        <div className="steps-inner">
          <p className="section-label">Getting Started</p>
          <h2 className="section-title">Up and Streaming in Minutes</h2>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">01</div>
              <h3>Create Your Account</h3>
              <p>Sign up in seconds with your email. No credit card, no friction — just a free account and you're in.</p>
            </div>
            <div className="step-item">
              <div className="step-number">02</div>
              <h3>Upload Your Videos</h3>
              <p>Drop your files into the upload interface. StreamVault handles encoding and HLS manifest generation automatically.</p>
            </div>
            <div className="step-item">
              <div className="step-number">03</div>
              <h3>Stream & Discover</h3>
              <p>Browse the dashboard, search by title, and watch with adaptive quality controls at your fingertips.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <h2>Ready to <em>Start Streaming?</em></h2>
        <p>Join StreamVault today and experience video streaming the way it should be — fast, flexible, and beautiful.</p>
        <div className="cta-btns">
          <Link to="/register" className="hero-btn-primary">Create Free Account</Link>
          <Link to="/dashboard" className="hero-btn-secondary">Browse Videos</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="land-footer">
        <div className="footer-logo">StreamVault</div>
        <div className="footer-links">
          <Link to="/login">Sign In</Link>
          <Link to="/register">Register</Link>
          <Link to="/dashboard">Dashboard</Link>
        </div>
        <p className="footer-copy">© 2026 StreamVault.</p>
      </footer>

    </div>
  );
};

export default LandingPage;