interface MaintenanceProps {
  message?: string;
}

export default function Maintenance({ message }: MaintenanceProps) {
  return (
    <>
      <div className="bg-gradient"></div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2 orb-error"></div>
      <div className="grid-pattern"></div>

      <div className="main">
        <div className="error-code" style={{ fontSize: '5rem', marginBottom: '-1rem' }}>503</div>

        <div className="header">
          <h1 className="title">Maintenance Mode</h1>
          <p className="subtitle">{message || "We're performing some scheduled maintenance. We'll be back online shortly!"}</p>
        </div>

        <div className="status-bar" style={{ animationDelay: '0s' }}>
          <div className="status status-error">
            <span className="status-dot error"></span>
            System Offline
          </div>
        </div>

        <div className="footer">
          <a href="https://github.com/glensonansin/lumina" target="_blank">Lumina</a> — Built with Express & Sequelize
        </div>
      </div>
    </>
  );
}
