import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="sky-home">

      {/* NAVBAR */}
      <header className="sky-home-nav">
        <Link to="/" className="sky-home-logo">
          SKY<span>NETWORK</span>
        </Link>

        <nav className="sky-home-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/map">Live Traffic</Link>
          <Link to="/analytics">Analytics</Link>
          <Link to="/search">Global Search</Link>
        </nav>

        <div className="sky-home-nav-status">
          <span className="sky-status-dot" />
          SYSTEM OPERATIONAL
        </div>
      </header>

      {/* HERO */}
      <section className="sky-home-hero">

        <div className="sky-hero-grid" />

        <div className="sky-hero-content">

          <div className="sky-eyebrow">
            <span className="sky-status-dot" />
            GLOBAL AVIATION INTELLIGENCE PLATFORM
          </div>

          <h1>
            REVOLUTIONIZING
            <br />
            <span>GLOBAL AIRSPACE.</span>
          </h1>

          <p>
            Real-time aviation intelligence for monitoring global
            flight operations, network activity and aircraft
            maintenance infrastructure.
          </p>

          <div className="sky-hero-actions">
            <Link to="/dashboard" className="sky-primary-btn">
              ENTER COMMAND CENTER
              <span>→</span>
            </Link>

            <Link to="/map" className="sky-secondary-btn">
              VIEW LIVE TRAFFIC
            </Link>
          </div>

          <div className="sky-hero-meta">
            <div>
              <strong>LIVE</strong>
              <span>Flight telemetry</span>
            </div>

            <div>
              <strong>GLOBAL</strong>
              <span>Network coverage</span>
            </div>

            <div>
              <strong>MRO</strong>
              <span>Maintenance intelligence</span>
            </div>
          </div>

        </div>

        {/* GLOBE / RADAR VISUAL */}
        <div className="sky-globe">

          <div className="sky-globe-ring ring-one" />
          <div className="sky-globe-ring ring-two" />
          <div className="sky-globe-ring ring-three" />

          <div className="sky-globe-core">
            <div className="sky-globe-lat lat-one" />
            <div className="sky-globe-lat lat-two" />
            <div className="sky-globe-lat lat-three" />
            <div className="sky-globe-lon lon-one" />
            <div className="sky-globe-lon lon-two" />
            <div className="sky-globe-lon lon-three" />

            <span className="sky-plane plane-one">✈</span>
            <span className="sky-plane plane-two">✈</span>
            <span className="sky-plane plane-three">✈</span>

            <span className="sky-map-point point-one" />
            <span className="sky-map-point point-two" />
            <span className="sky-map-point point-three" />
            <span className="sky-map-point point-four" />
          </div>

          <div className="sky-orbit orbit-one" />
          <div className="sky-orbit orbit-two" />

        </div>

      </section>

      {/* STATS */}
      <section className="sky-home-stats">

        <div className="sky-stat">
          <span>01</span>
          <strong>ACTIVE FLIGHTS</strong>
          <small>LIVE TELEMETRY</small>
        </div>

        <div className="sky-stat">
          <span>02</span>
          <strong>MRO NETWORK</strong>
          <small>GLOBAL FACILITIES</small>
        </div>

        <div className="sky-stat">
          <span>03</span>
          <strong>NETWORK INTELLIGENCE</strong>
          <small>REAL-TIME ANALYTICS</small>
        </div>

        <div className="sky-stat">
          <span>04</span>
          <strong>GLOBAL COVERAGE</strong>
          <small>CONNECTED AIRSPACE</small>
        </div>

      </section>

      {/* FEATURES */}
      <section className="sky-features">

        <div className="sky-section-heading">
          <span>01 / PLATFORM</span>
          <h2>NEXT-GENERATION<br />AEROSPACE INTELLIGENCE</h2>
        </div>

        <div className="sky-feature-grid">

          <Link to="/map" className="sky-feature-card">
            <span className="sky-feature-number">01</span>
            <div className="sky-feature-icon">◉</div>
            <h3>LIVE AIRSPACE</h3>
            <p>
              Monitor aircraft positions, routes, airports and
              global flight activity through an interactive map.
            </p>
            <span className="sky-feature-link">
              EXPLORE MAP →
            </span>
          </Link>

          <Link to="/analytics" className="sky-feature-card">
            <span className="sky-feature-number">02</span>
            <div className="sky-feature-icon">▥</div>
            <h3>NETWORK ANALYTICS</h3>
            <p>
              Transform aviation telemetry into operational
              intelligence and network-level insights.
            </p>
            <span className="sky-feature-link">
              VIEW ANALYTICS →
            </span>
          </Link>

          <Link to="/map" className="sky-feature-card">
            <span className="sky-feature-number">03</span>
            <div className="sky-feature-icon">◇</div>
            <h3>MRO INTELLIGENCE</h3>
            <p>
              Discover aircraft maintenance facilities, capabilities,
              hangars and annual maintenance capacity.
            </p>
            <span className="sky-feature-link">
              VIEW MRO NETWORK →
            </span>
          </Link>

        </div>
      </section>

      {/* CTA */}
      <section className="sky-home-cta">
        <div>
          <span>SKYNETWORK / OPERATIONS</span>
          <h2>READY TO COMMAND<br />THE SKIES?</h2>
        </div>

        <Link to="/dashboard" className="sky-primary-btn">
          ENTER OPERATIONS CENTER →
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="sky-home-footer">
        <span>SKYNETWORK</span>
        <span>GLOBAL AVIATION INTELLIGENCE</span>
        <span>© 2026</span>
      </footer>

    </div>
  );
}