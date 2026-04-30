interface StatusProps {
  status: string;
  environment: string;
  uptime: number;
  memoryMB: string;
}

export default function Status({ status, environment, uptime, memoryMB }: StatusProps) {
  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  return (
    <>
      <div className="bg-gradient"></div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
      <div className="grid-pattern"></div>

      <div className="main">
        <div className="header">
          <a href="/" className="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
            Back to Home
          </a>
          <h1 className="title">System Status</h1>
          <p className="subtitle">Real-time health overview of the Lumina application</p>
        </div>

        <div className="status-bar" style={{ animationDelay: '0s', marginBottom: '-0.5rem' }}>
          <div className={`status ${status === 'UP' ? '' : 'status-error'}`}>
            <span className={`status-dot ${status === 'UP' ? '' : 'error'}`}></span>
            {status === 'UP' ? 'All Systems Operational' : 'System Degraded'}
          </div>
        </div>

        <div className="card">
          <div className="card-title">Application</div>
          <div className="info-grid">
            <div className="info-row">
              <div className="info-label">
                <div className="info-icon">🔒</div>
                Status
              </div>
              <div className={`info-value ${status === 'UP' ? 'status-up' : 'status-down'}`}>{status}</div>
            </div>
            <div className="info-row">
              <div className="info-label">
                <div className="info-icon">🌐</div>
                Environment
              </div>
              <div className="info-value env-badge">{environment}</div>
            </div>
            <div className="info-row">
              <div className="info-label">
                <div className="info-icon">⏱️</div>
                Uptime
              </div>
              <div className="info-value">{formatUptime(uptime)}</div>
            </div>
            <div className="info-row">
              <div className="info-label">
                <div className="info-icon">🧠</div>
                Memory Usage
              </div>
              <div className="info-value">{memoryMB} MB</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Services</div>
          <div className="services-grid">
            <div className="service-item">
              <span className={`service-dot ${status === 'UP' ? 'up' : 'down'}`}></span>
              <span className="service-name">Express Server</span>
            </div>
            <div className="service-item">
              <span className={`service-dot ${status === 'UP' ? 'up' : 'down'}`}></span>
              <span className="service-name">Database</span>
            </div>
            <div className="service-item">
              <span className={`service-dot ${status === 'UP' ? 'up' : 'down'}`}></span>
              <span className="service-name">Authentication</span>
            </div>
            <div className="service-item">
              <span className={`service-dot ${status === 'UP' ? 'up' : 'down'}`}></span>
              <span className="service-name">Logging</span>
            </div>
          </div>
        </div>

        <div className="footer">
          <a href="https://github.com/glensonansin/lumina" target="_blank">Lumina</a> — Built with Express & Sequelize
        </div>
      </div>
    </>
  );
}
