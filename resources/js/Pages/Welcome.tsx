interface WelcomeProps {
  version: string;
}

export default function Welcome({ version }: WelcomeProps) {
  return (
    <>
      <div className="bg-gradient"></div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      <div className="grid-pattern"></div>

      <div className="main">
        <div className="logo-wrapper">
          <div className="logo-glow"></div>
          <img src="/img/logo2.png" alt="Lumina Logo" className="logo" />
        </div>

        <div className="header">
          <h1 className="title">Lumina</h1>
          <p className="subtitle">A production-grade Express starter kit with Sequelize. Featuring OOP architecture, Singleton services, and type-safe database interactions.</p>
        </div>

        <div className="card">
          <div className="features">
            <div className="feature">
              <div className="feature-icon">🔷</div>
              <div className="feature-text">
                <h3>TypeScript</h3>
                <p>End-to-end type safety</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">🏗️</div>
              <div className="feature-text">
                <h3>OOP Architecture</h3>
                <p>Clean, scalable patterns</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <div className="feature-text">
                <h3>Singleton Services</h3>
                <p>Efficient resource management</p>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">🗄️</div>
              <div className="feature-text">
                <h3>Database Ready</h3>
                <p>Type-safe DB interactions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="status-bar">
          <div className="status">
            <span className="status-dot"></span>
            Application is Running
          </div>
        </div>

        <div className="actions">
          <a href="/status" className="btn btn-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>
            System Status
          </a>
          <a href="https://github.com/glensonansin/lumina" target="_blank" className="btn btn-secondary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.11.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            Documentation
          </a>
        </div>

        <div className="footer">
          <a href="https://github.com/glensonansin/lumina" target="_blank">Lumina</a> — Built with Express & Sequelize
        </div>
      </div>
    </>
  );
}
