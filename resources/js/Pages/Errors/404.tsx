interface NotFoundProps {
  url: string;
}

export default function NotFound({ url }: NotFoundProps) {
  return (
    <>
      <div className="bg-gradient"></div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2 orb-error"></div>
      <div className="grid-pattern"></div>

      <div className="main">
        <div className="error-code">404</div>

        <div className="header">
          <h1 className="title">Page Not Found</h1>
          <p className="subtitle">The page you're looking for doesn't exist or has been moved. Let's get you back on track.</p>
        </div>

        <a href="/" className="btn">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
          Back to Home
        </a>

        <div className="footer">
          <a href="https://github.com/glensonansin/lumina" target="_blank">Lumina</a> — Built with Express & Sequelize
        </div>
      </div>
    </>
  );
}
