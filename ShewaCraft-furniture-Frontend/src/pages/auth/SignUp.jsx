import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import {
  validateEmail,
  validatePassword,
} from '../../services/authService';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

const inputClass =
  'w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-60 disabled:cursor-not-allowed';

export default function SignUp() {
  const { signUp, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!authLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
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
    if (!fullName.trim()) nextFieldErrors.fullName = 'Full name is required';

    const emailError = validateEmail(email);
    if (emailError) nextFieldErrors.email = emailError;

    const passwordError = validatePassword(password);
    if (passwordError) nextFieldErrors.password = passwordError;

    if (password !== confirmPassword) {
      nextFieldErrors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) return;

    setSubmitting(true);
    try {
      await signUp({ fullName, email, password });
      navigate('/', { replace: true });
    } catch (err) {
      if (err.fields) setFieldErrors(err.fields);
      setError(err.message || 'Unable to create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join ShewaCraft Furniture">
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
          <label htmlFor="signup-name" className="block text-sm text-gray-700 mb-1.5">
            Full name
          </label>
          <input
            id="signup-name"
            type="text"
            autoComplete="name"
            value={fullName}
            disabled={submitting}
            aria-invalid={Boolean(fieldErrors.fullName)}
            aria-describedby={fieldErrors.fullName ? 'signup-name-error' : undefined}
            onChange={(e) => {
              setFullName(e.target.value);
              clearFieldError('fullName');
            }}
            className={inputClass}
            placeholder="Your full name"
          />
          {fieldErrors.fullName && (
            <p id="signup-name-error" className="text-red-600 text-xs mt-1.5">
              {fieldErrors.fullName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="signup-email" className="block text-sm text-gray-700 mb-1.5">
            Email address
          </label>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            value={email}
            disabled={submitting}
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? 'signup-email-error' : undefined}
            onChange={(e) => {
              setEmail(e.target.value);
              clearFieldError('email');
            }}
            className={inputClass}
            placeholder="you@example.com"
          />
          {fieldErrors.email && (
            <p id="signup-email-error" className="text-red-600 text-xs mt-1.5">
              {fieldErrors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="signup-password" className="block text-sm text-gray-700 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              disabled={submitting}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={
                fieldErrors.password ? 'signup-password-error' : 'signup-password-hint'
              }
              onChange={(e) => {
                setPassword(e.target.value);
                clearFieldError('password');
              }}
              className={`${inputClass} pr-12`}
              placeholder="At least 8 characters"
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
          {fieldErrors.password ? (
            <p id="signup-password-error" className="text-red-600 text-xs mt-1.5">
              {fieldErrors.password}
            </p>
          ) : (
            <p id="signup-password-hint" className="text-gray-500 text-xs mt-1.5">
              Use 8+ characters with at least one letter and one number
            </p>
          )}
        </div>

        <div>
          <label htmlFor="signup-confirm" className="block text-sm text-gray-700 mb-1.5">
            Confirm password
          </label>
          <div className="relative">
            <input
              id="signup-confirm"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirmPassword}
              disabled={submitting}
              aria-invalid={Boolean(fieldErrors.confirmPassword)}
              aria-describedby={
                fieldErrors.confirmPassword ? 'signup-confirm-error' : undefined
              }
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                clearFieldError('confirmPassword');
              }}
              className={`${inputClass} pr-12`}
              placeholder="Re-enter your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              disabled={submitting}
              className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 disabled:opacity-60 ${focusRing}`}
              aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {fieldErrors.confirmPassword && (
            <p id="signup-confirm-error" className="text-red-600 text-xs mt-1.5">
              {fieldErrors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`w-full py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed ${focusRing}`}
        >
          {submitting ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <p className="text-sm text-gray-600 text-center mt-4">
        Already have an account?{' '}
        <Link
          to="/auth/signin"
          className={`text-gray-900 font-medium hover:underline ${focusRing}`}
        >
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}
