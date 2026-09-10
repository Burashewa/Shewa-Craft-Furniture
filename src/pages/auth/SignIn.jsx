import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { DEMO_CREDENTIALS, validateEmail } from '../../services/authService';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

const inputClass =
  'w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-60 disabled:cursor-not-allowed';

export default function SignIn() {
  const { signIn, isAuthenticated, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!authLoading && isAuthenticated) {
    const fallback = user?.role === 'admin' ? '/admin' : '/';
    const from = location.state?.from?.pathname || fallback;
    return <Navigate to={from} replace />;
  }

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const nextFieldErrors = {};
    const emailError = validateEmail(email);
    if (emailError) nextFieldErrors.email = emailError;
    if (!password) nextFieldErrors.password = 'Password is required';

    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) return;

    setSubmitting(true);
    try {
      const nextUser = await signIn({ email, password, remember });
      const fallback = nextUser.role === 'admin' ? '/admin' : '/';
      const from = location.state?.from?.pathname || fallback;
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Sign In" subtitle="Welcome back to ShewaCraft Furniture">
      <form
        className="space-y-4"
        onSubmit={handleSubmit}
        noValidate
        aria-busy={submitting}
      >
        {error && (
          <div
            role="alert"
            className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <div>
          <label htmlFor="signin-email" className="block text-sm text-gray-700 mb-1.5">
            Email address
          </label>
          <input
            id="signin-email"
            type="email"
            autoComplete="email"
            value={email}
            disabled={submitting}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'signin-email-error' : undefined}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError('email');
            }}
            className={inputClass}
            placeholder="you@example.com"
          />
          {fieldErrors.email && (
            <p id="signin-email-error" className="text-red-600 text-xs mt-1.5">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="signin-password" className="block text-sm text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="signin-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              disabled={submitting}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={
                fieldErrors.password ? 'signin-password-error' : undefined
              }
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError('password');
              }}
              className={`${inputClass} pr-12`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              disabled={submitting}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 disabled:opacity-60 ${focusRing}`}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {fieldErrors.password && (
            <p id="signin-password-error" className="text-red-600 text-xs mt-1.5">
              {fieldErrors.password}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={remember}
              disabled={submitting}
              onChange={(e) => setRemember(e.target.checked)}
              className={`rounded border-gray-300 ${focusRing}`}
            />
            Remember me for 7 days
          </label>
          <Link
            to="/auth/forgot-password"
            className={`text-sm text-gray-900 font-medium hover:underline ${focusRing}`}
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed ${focusRing}`}
        >
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-sm text-gray-600 text-center mt-4">
        Don&apos;t have an account?{' '}
        <Link
          to="/auth/signup"
          className={`text-gray-900 font-medium hover:underline ${focusRing}`}
        >
          Sign Up
        </Link>
      </p>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 mb-2">Demo accounts</p>
        <ul className="space-y-1 text-xs text-gray-600">
          {DEMO_CREDENTIALS.map((demo) => (
            <li key={demo.email}>
              <span className="capitalize font-medium text-gray-700">{demo.role}:</span>{' '}
              {demo.email} / {demo.password}
            </li>
          ))}
        </ul>
      </div>
    </AuthLayout>
  );
}
