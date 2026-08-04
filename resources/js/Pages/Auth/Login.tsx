import { FormEvent } from 'react';
import { useForm, usePage } from '@inertiajs/react';

export default function Login() {
  const page = usePage().props as any;

  const { data, setData, post, processing, errors } = useForm({
    email: '',
    password: '',
  });

  // Errors can arrive either from Inertia's own form handling or from the
  // props WebController.login shares back on a failed attempt.
  const emailError = errors.email ?? page.errors?.email;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <>
      <div className="bg-gradient"></div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="grid-pattern"></div>

      <div className="main">
        <div className="logo-wrapper">
          <div className="logo-glow"></div>
          <img src="/img/logo2.png" alt="Lumina Logo" className="logo" />
        </div>

        <div className="header">
          <h1 className="title">Sign in</h1>
          <p className="subtitle">Enter your credentials to continue.</p>
        </div>

        <div className="card">
          <form onSubmit={submit}>
            <div className="form-row">
              <label className="form-label" htmlFor="email">Email</label>
              <input
                id="email"
                className="form-input"
                type="email"
                value={data.email}
                onChange={e => setData('email', e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-row">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                className="form-input"
                type="password"
                value={data.password}
                onChange={e => setData('password', e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            {emailError && <p className="form-error">{emailError}</p>}

            <div className="actions">
              <button type="submit" className="btn btn-primary" disabled={processing}>
                {processing ? 'Signing in…' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
