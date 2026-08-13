import React, { useEffect, useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import FlightMap from './pages/FlightMap';
import Analytics from './pages/Analytics';
import Search from './pages/Search';
import Home from './pages/Home';

import './styles/hud.css';

// =========================================================
// NAVIGATION ICONS
// =========================================================

const DashboardIcon = () => (
  <svg className="hud-nav-icon" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="9" />
    <rect x="14" y="3" width="7" height="5" />
    <rect x="14" y="12" width="7" height="9" />
    <rect x="3" y="16" width="7" height="5" />
  </svg>
);

const MapIcon = () => (
  <svg className="hud-nav-icon" viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
  </svg>
);

const AnalyticsIcon = () => (
  <svg className="hud-nav-icon" viewBox="0 0 24 24">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="hud-nav-icon" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const nav = [
  { to: '/dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
  { to: '/map', label: 'Flight Map', icon: <MapIcon /> },
  { to: '/analytics', label: 'Analytics', icon: <AnalyticsIcon /> },
  { to: '/search', label: 'Global Search', icon: <SearchIcon /> },
];

// =========================================================
// SHELL
// =========================================================

function Shell({ children }) {
  const location = useLocation();

  const [theme, setTheme] = useState(
    localStorage.getItem('skynetwork-theme') || 'dark'
  );

  const [notificationsOpen, setNotificationsOpen] = useState(false);
const [profileOpen, setProfileOpen] = useState(false);
const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('skynetwork-theme', theme);
  }, [theme]);

  // Landing page has its own website layout
  if (location.pathname === '/') {
    return (
      <div className="home-shell">
        {children}
      </div>
    );
  }

  const toggleTheme = () => {
    setTheme((current) =>
      current === 'dark' ? 'light' : 'dark'
    );
  };

  return (
    <div className="hud-layout">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="hud-sidebar">
        <div className="hud-sidebar-top">

          <div className="hud-sector-indicator">
            <span className="hud-sector-name">
              Sector 01
            </span>

            <span className="hud-sector-status">
              ● OPERATIONAL
            </span>
          </div>

          <nav>
            <ul className="hud-nav-list">
              {nav.map((item) => (
                <li
                  key={item.to}
                  className={`hud-nav-item ${
                    location.pathname === item.to ? 'active' : ''
                  }`}
                >
                  <Link to={item.to}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

        </div>

        <div className="hud-sidebar-bottom">
          <div className="hud-system-health">
            <span className="hud-system-health-label">
              System Status
            </span>

            <span className="hud-system-health-value">
              OPTIMAL
            </span>
          </div>
        </div>
      </aside>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <div className="hud-main">

        {/* HEADER */}

        <header className="hud-header">

          <Link to="/" className="hud-logo font-display">
            SKYCOMMAND
          </Link>

          <div className="hud-search-bar">
            <svg
              className="hud-search-icon"
              viewBox="0 0 24 24"
            >
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />

              <line
                x1="21"
                y1="21"
                x2="16.65"
                y2="16.65"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>

            <input
  type="text"
  placeholder="QUICK SEARCH..."
  className="hud-search-input"
  onKeyDown={(e) => {
    if (e.key !== 'Enter') return;

    const query = e.currentTarget.value.trim().toLowerCase();

    if (!query) return;

    if (query === 'dashboard') {
      window.location.href = '/dashboard';
      return;
    }

    if (
      query === 'map' ||
      query === 'flight map' ||
      query === 'flightmap'
    ) {
      window.location.href = '/map';
      return;
    }

    if (
      query === 'analytics' ||
      query === 'analytics page'
    ) {
      window.location.href = '/analytics';
      return;
    }

    if (
      query === 'search' ||
      query === 'global search'
    ) {
      window.location.href = '/search';
      return;
    }

    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  }}
/>
          </div>

          <div className="hud-header-controls">

            {/* =================================================
                THEME
            ================================================= */}

            <button
              className="hud-icon-btn"
              title={
                theme === 'dark'
                  ? 'Switch to light mode'
                  : 'Switch to dark mode'
              }
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg
                  viewBox="0 0 24 24"
                  style={{
                    width: 18,
                    height: 18,
                    fill: 'none',
                    stroke: 'currentColor',
                    strokeWidth: 2,
                  }}
                >
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  style={{
                    width: 18,
                    height: 18,
                    fill: 'none',
                    stroke: 'currentColor',
                    strokeWidth: 2,
                  }}
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              )}
            </button>

            {/* =================================================
                NOTIFICATIONS
            ================================================= */}

            <div className="hud-control-wrapper">

              <button
                className="hud-icon-btn"
                title="Notifications"
                onClick={() => {
                  setNotificationsOpen((open) => !open);
                  setProfileOpen(false);
                }}
                aria-label="Notifications"
              >
                <svg
                  viewBox="0 0 24 24"
                  style={{
                    width: 18,
                    height: 18,
                    fill: 'none',
                    stroke: 'currentColor',
                    strokeWidth: 2,
                  }}
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>

                <span className="hud-notification-dot" />
              </button>

              {notificationsOpen && (
                <div className="hud-dropdown hud-notifications">

                  <div className="hud-dropdown-header">
                    <strong>NOTIFICATIONS</strong>
                    <span>03</span>
                  </div>

                  <div className="hud-notification-item">
                    <span className="notification-status active" />

                    <div>
                      <strong>Flight telemetry online</strong>
                      <span>Live network data available</span>
                    </div>
                  </div>

                  <div className="hud-notification-item">
                    <span className="notification-status warning" />

                    <div>
                      <strong>OpenSky rate limit</strong>
                      <span>Fallback telemetry active</span>
                    </div>
                  </div>

                  <div className="hud-notification-item">
                    <span className="notification-status active" />

                    <div>
                      <strong>System operational</strong>
                      <span>All dashboard modules available</span>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* =================================================
                PROFILE
            ================================================= */}

            <div className="hud-control-wrapper">

              <button
                className="hud-avatar hud-avatar-btn"
                onClick={() => {
                  setProfileOpen((open) => !open);
                  setNotificationsOpen(false);
                }}
                aria-label="Open operator profile"
              >
                SC
              </button>

              {profileOpen && (
                <div className="hud-dropdown hud-profile">

                  <div className="hud-profile-avatar">
                    SC
                  </div>

                  <div className="hud-profile-info">
                    <strong>SKYCOMMAND</strong>
                    <span>OPERATIONS USER</span>
                  </div>

                  <div className="hud-profile-status">
                    <span className="hud-status-dot-small" />
                    SYSTEM ACCESS ACTIVE
                  </div>

                  <button
  className="hud-profile-action"
  onClick={() => {
    setSettingsOpen(true);
    setProfileOpen(false);
  }}
>
  OPERATOR SETTINGS
</button>

                </div>
              )}

            </div>

          </div>
        </header>

        {/* OPERATOR SETTINGS */}

{settingsOpen && (
  <div
    className="hud-settings-overlay"
    onClick={() => setSettingsOpen(false)}
  >
    <div
      className="hud-settings-panel"
      onClick={(event) => event.stopPropagation()}
    >

      <div className="hud-settings-header">
        <div>
          <span>SKYCOMMAND / CONFIGURATION</span>
          <h2>OPERATOR SETTINGS</h2>
        </div>

        <button
          className="hud-settings-close"
          onClick={() => setSettingsOpen(false)}
          aria-label="Close settings"
        >
          ×
        </button>
      </div>

      <div className="hud-settings-section">
        <span className="hud-settings-label">
          APPEARANCE
        </span>

        <div className="hud-setting-row">
          <div>
            <strong>Interface Theme</strong>
            <span>
              Choose the operational interface appearance.
            </span>
          </div>

          <button
            className="hud-theme-toggle"
            onClick={toggleTheme}
          >
            {theme === 'dark' ? 'DARK MODE' : 'LIGHT MODE'}
          </button>
        </div>
      </div>

      <div className="hud-settings-section">
        <span className="hud-settings-label">
          SYSTEM
        </span>

        <div className="hud-setting-row">
          <div>
            <strong>Telemetry Status</strong>
            <span>Live aviation data connection</span>
          </div>

          <span className="hud-setting-online">
            ● ONLINE
          </span>
        </div>

        <div className="hud-setting-row">
          <div>
            <strong>Fallback Data</strong>
            <span>
              Used when external telemetry is unavailable
            </span>
          </div>

          <span className="hud-setting-online">
            ● ACTIVE
          </span>
        </div>
      </div>

    </div>
  </div>
)}

{/* PAGE CONTENT */}

<main className="hud-content">
  {children}
</main>

      </div>
    </div>
  );
}

// =========================================================
// APP
// =========================================================

function App() {
  return (
    <BrowserRouter>
      <Shell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/map" element={<FlightMap />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      </Shell>
    </BrowserRouter>
  );
}

export default App;