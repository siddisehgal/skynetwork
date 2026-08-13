import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-page">

      {/* HERO */}
      <section className="home-hero">
        <div className="home-eyebrow">
          <span className="home-status-dot" />
          <span style={{ fontSize: 11 }}>
            GLOBAL AVIATION INTELLIGENCE // SYSTEM ONLINE
          </span>
        </div>

        <div className="home-title-block">
          <h1 className="home-title font-display glow-cyan">
            REVOLUTIONIZING
            <br />
            GLOBAL AIRSPACE.
          </h1>

          <div
            className="home-title-brand"
            style={{ fontSize: 11 }}
          >
            SKYNETWORK / OPERATIONS
          </div>
        </div>

        <p
          className="home-subtitle"
          style={{ fontSize: 16 }}
        >
          A real-time aviation intelligence platform connecting flight
          operations, network analytics and maintenance infrastructure
          into one global operational view.
        </p>

        <div className="home-actions">
          <Link to="/dashboard" className="home-primary-btn">
            ENTER OPERATIONS CENTER
            <span>→</span>
          </Link>

          <a href="#capabilities" className="home-secondary-btn">
            EXPLORE SYSTEM
          </a>
        </div>

        {/* TELEMETRY */}
        <div className="home-telemetry">
          <div>
            <span style={{ fontSize: 11 }}>NETWORK</span>
            <strong style={{ fontSize: 14 }}>GLOBAL</strong>
          </div>

          <div>
            <span style={{ fontSize: 11 }}>TELEMETRY</span>
            <strong style={{ fontSize: 14 }}>LIVE</strong>
          </div>

          <div>
            <span style={{ fontSize: 11 }}>STATUS</span>
            <strong style={{ fontSize: 14 }}>OPTIMAL</strong>
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section id="capabilities" className="home-section">
        <div className="home-section-header">
          <span className="home-section-index">01</span>

          <div>
            <span
              className="home-section-label"
              style={{ fontSize: 11 }}
            >
              SYSTEM CAPABILITIES
            </span>

            <h2>AVIATION INTELLIGENCE</h2>
          </div>
        </div>

        <div className="home-capabilities-grid">

          {/* LIVE AIRSPACE */}
          <article className="home-capability">
            <span className="capability-number">01</span>

            <div>
              <span
                className="capability-label"
                style={{ fontSize: 11 }}
              >
                LIVE AIRSPACE
              </span>

              <h3>REAL-TIME FLIGHT MONITORING</h3>

              <p style={{ fontSize: 14 }}>
                Track active aircraft and global flight activity through
                live operational telemetry.
              </p>
            </div>

            <span className="capability-arrow">↗</span>
          </article>

          {/* NETWORK ANALYTICS */}
          <article className="home-capability">
            <span className="capability-number">02</span>

            <div>
              <span
                className="capability-label"
                style={{ fontSize: 11 }}
              >
                NETWORK ANALYTICS
              </span>

              <h3>UNDERSTAND THE NETWORK</h3>

              <p style={{ fontSize: 14 }}>
                Analyze traffic patterns, airline activity, routes and
                sector-level network behavior.
              </p>
            </div>

            <span className="capability-arrow">↗</span>
          </article>

          {/* MRO INTELLIGENCE */}
          <article className="home-capability">
            <span className="capability-number">03</span>

            <div>
              <span
                className="capability-label"
                style={{ fontSize: 11 }}
              >
                MRO INTELLIGENCE
              </span>

              <h3>MAINTENANCE INFRASTRUCTURE</h3>

              <p style={{ fontSize: 14 }}>
                Connect aircraft operations with maintenance, repair
                and overhaul infrastructure across the network.
              </p>
            </div>

            <span className="capability-arrow">↗</span>
          </article>

          {/* GLOBAL SEARCH */}
          <article className="home-capability">
            <span className="capability-number">04</span>

            <div>
              <span
                className="capability-label"
                style={{ fontSize: 11 }}
              >
                GLOBAL SEARCH
              </span>

              <h3>FIND WHAT MATTERS</h3>

              <p style={{ fontSize: 14 }}>
                Search across flights, airports and operational data
                from a single intelligence interface.
              </p>
            </div>

            <span className="capability-arrow">↗</span>
          </article>

        </div>
      </section>

      {/* PLATFORM */}
      <section className="home-section home-platform">
        <div className="home-section-header">
          <span className="home-section-index">02</span>

          <div>
            <span
              className="home-section-label"
              style={{ fontSize: 11 }}
            >
              THE PLATFORM
            </span>

            <h2>SEE THE NETWORK</h2>
          </div>
        </div>

        <div className="home-platform-grid">

          {/* NETWORK VISUAL */}
          <div className="home-network-visual">
            <div className="network-ring ring-one" />
            <div className="network-ring ring-two" />
            <div className="network-ring ring-three" />

            <div className="network-core">
              SN
            </div>
          </div>

          {/* PLATFORM DESCRIPTION */}
          <div className="home-platform-copy">
            <span
              className="home-data-label"
              style={{ fontSize: 11 }}
            >
              OPERATIONAL OVERVIEW
            </span>

            <h3>
              FROM INDIVIDUAL FLIGHTS TO THE GLOBAL NETWORK
            </h3>

            <p style={{ fontSize: 14 }}>
              SkyNetwork brings flight operations, network analytics,
              geographic intelligence and maintenance infrastructure
              together in one operational environment.
            </p>

            <Link
              to="/dashboard"
              className="home-inline-link"
            >
              ACCESS LIVE SYSTEM →
            </Link>
          </div>

        </div>
      </section>

      {/* RESEARCH */}
      <section className="home-section home-research">
        <div className="home-section-header">
          <span className="home-section-index">03</span>

          <div>
            <span
              className="home-section-label"
              style={{ fontSize: 11 }}
            >
              RESEARCH DIRECTION
            </span>

            <h2>BUILT FOR WHAT COMES NEXT</h2>
          </div>
        </div>

        <div className="home-research-grid">

          <div>
            <span style={{ fontSize: 12 }}>
              01 // PREDICTIVE OPERATIONS
            </span>

            <span style={{ fontSize: 12 }}>
              02 // NETWORK OPTIMIZATION
            </span>
          </div>

          <div>
            <span style={{ fontSize: 12 }}>
              03 // MRO INTELLIGENCE
            </span>

            <span style={{ fontSize: 12 }}>
              04 // DECISION SUPPORT
            </span>
          </div>

        </div>
      </section>

      {/* FINAL CTA */}
<section className="home-final-cta">
  <div className="home-final-cta-content">
    <span className="home-section-label" style={{ fontSize: 11 }}>
      SKYNETWORK / OPERATIONS
    </span>

    <h2>READY TO ENTER THE NETWORK?</h2>

    <p style={{ fontSize: 14 }}>
      Access the live aviation intelligence environment and
      explore the global network in real time.
    </p>

    <Link to="/dashboard" className="home-final-cta-btn">
      ENTER OPERATIONS CENTER
      <span>→</span>
    </Link>
  </div>

  <div className="home-final-cta-index">
    04
  </div>
</section>

      {/* FOOTER */}
      <footer className="home-footer">

        <div>
          <strong
            className="font-display"
            style={{ fontSize: 16 }}
          >
            SKYNETWORK
          </strong>

          <span style={{ fontSize: 10 }}>
            GLOBAL AVIATION INTELLIGENCE
          </span>
        </div>

        <div
          className="home-footer-status"
          style={{ fontSize: 10 }}
        >
          <span className="home-status-dot" />
          SYSTEM OPERATIONAL
        </div>

      </footer>

    </div>
  );
}