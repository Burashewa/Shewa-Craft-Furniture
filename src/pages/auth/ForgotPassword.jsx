import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
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

function delay(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function ForgotPassword() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();

  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!authLoading && isAuthenticated) {
    const fallback = user?.role === 'admin' ? '/admin' : '/';
    return <Navigate to={fallback} replace />;
  }

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    const nextFieldErrors = {};
    const emailError = validateEmail(email);
    if (emailError) nextFieldErrors.email = emailError;

    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) return;

    setSubmitting(true);
    try {
      await delay();
      setStep('password');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const nextFieldErrors = {};
    const passwordError = validatePassword(password);
    if (passwordError) nextFieldErrors.password = passwordError;

    if (password !== confirmPassword) {
      nextFieldErrors.confirmPassword = 'Passwords do not match';
    }

    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) return;

    setSubmitting(true);
    try {
      await delay();
      setStep('success');
    } finally {
      setSubmitting(false);
    }
  };

  const title =
    step === 'success'
      ? 'Password updated'
      : step === 'password'
        ? 'Set a new password'
        : 'Forgot password';

  const subtitle =
    step === 'success'
      ? 'You can sign in with your existing account password.'
      : step === 'password'
        ? 'Choose a new password for this demo. It is not saved to your account.'
        : 'Enter your email to continue the reset flow.';

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      {step === 'email' && (
        <form
          className="space-y-4"
          onSubmit={handleEmailSubmit}
          noValidate
          aria-busy={submitting}
        >
          <p className="text-sm text-gray-600">
            If an account exists for that email, you can continue to the next step. We
            do not confirm whether the address is registered.
          </p>

          <div>
            <label htmlFor="reset-email" className="block text-sm text-gray-700 mb-1.5">
              Email address
            </label>
            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              value={email}
              disabled={submitting}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? 'reset-email-error' : undefined}
              onChange={(e) => {
                setEmail(e.target.value);
                clearFieldError('email');
              }}
              className={inputClass}
              placeholder="you@example.com"
            />
            {fieldErrors.email && (
              <p id="reset-email-error" className="text-red-600 text-xs mt-1.5">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed ${focusRing}`}
          >
            {submitting ? 'Checking...' : 'Continue'}
          </button>
        </form>
      )}

      {step === 'password' && (
        <form
          className="space-y-4"
          onSubmit={handlePasswordSubmit}
          noValidate
          aria-busy={submitting}
        >
          <p className="text-sm text-gray-600">
            Resetting for <span className="text-gray-900 font-medium">{email}</span>
          </p>

          <div>
            <label
              htmlFor="reset-password"
              className="block text-sm text-gray-700 mb-1.5"
            >
              New password
            </label>
            <div className="relative">
              <input
                id="reset-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                disabled={submitting}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={
                  fieldErrors.password ? 'reset-password-error' : 'reset-password-hint'
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
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {fieldErrors.password ? (
              <p id="reset-password-error" className="text-red-600 text-xs mt-1.5">
                {fieldErrors.password}
              </p>
            ) : (
              <p id="reset-password-hint" className="text-gray-500 text-xs mt-1.5">
                Use 8+ characters with at least one letter and one number
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="reset-confirm"
              className="block text-sm text-gray-700 mb-1.5"
            >
              Confirm new password
            </label>
            <div className="relative">
              <input
                id="reset-confirm"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                disabled={submitting}
                aria-invalid={Boolean(fieldErrors.confirmPassword)}
                aria-describedby={
                  fieldErrors.confirmPassword ? 'reset-confirm-error' : undefined
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
                aria-label={
                  showConfirm ? 'Hide confirm password' : 'Show confirm password'
                }
              >
                {showConfirm ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <p id="reset-confirm-error" className="text-red-600 text-xs mt-1.5">
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={`w-full py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed ${focusRing}`}
          >
            {submitting ? 'Updating...' : 'Update password'}
          </button>
        </form>
      )}

      {step === 'success' && (
        <div className="space-y-4">
          <div
            role="status"
            className="rounded border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            Your password was updated for this demo session only. Demo and existing
            account passwords are unchanged.
          </div>
          <Link
            to="/auth/signin"
            className={`block w-full py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition text-center ${focusRing}`}
          >
            Back to Sign In
          </Link>
        </div>
      )}

      {step !== 'success' && (
        <p className="text-sm text-gray-600 text-center mt-4">
          Remember your password?{' '}
          <Link
            to="/auth/signin"
            className={`text-gray-900 font-medium hover:underline ${focusRing}`}
          >
            Sign In
          </Link>
          {' · '}
          <Link
            to="/auth/signup"
            className={`text-gray-900 font-medium hover:underline ${focusRing}`}
          >
            Sign Up
          </Link>
        </p>
      )}
    </AuthLayout>
  );
}
