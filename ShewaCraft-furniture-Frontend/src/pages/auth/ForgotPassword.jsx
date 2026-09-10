import { useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import {
  forgotPassword,
  resetPassword,
  validateEmail,
  validatePassword,
} from '../../services/authService';

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-2';

const inputClass =
  'w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-60 disabled:cursor-not-allowed';

export default function ForgotPassword() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  if (!authLoading && isAuthenticated) {
    const fallback = user?.role === 'admin' ? '/admin' : '/';
    return <Navigate to={fallback} replace />;
  }

  const step = resetDone
    ? 'success'
    : resetToken
      ? 'password'
      : emailSent
        ? 'check-email'
        : 'email';

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
    setError('');

    const nextFieldErrors = {};
    const emailError = validateEmail(email);
    if (emailError) nextFieldErrors.email = emailError;

    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length > 0) return;

    setSubmitting(true);
    try {
      await forgotPassword(email);
      setEmailSent(true);
    } catch (err) {
      if (err.fields) setFieldErrors(err.fields);
      setError(err.message || 'Unable to send a reset link');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');

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
      await resetPassword({ token: resetToken, password });
      setResetDone(true);
    } catch (err) {
      if (err.fields) setFieldErrors(err.fields);
      setError(err.message || 'Unable to update password');
    } finally {
      setSubmitting(false);
    }
  };

  const title =
    step === 'success'
      ? 'Password updated'
      : step === 'password'
        ? 'Set a new password'
        : step === 'check-email'
          ? 'Check your email'
          : 'Forgot password';

  const subtitle =
    step === 'success'
      ? 'You can sign in with your new password.'
      : step === 'password'
        ? 'Choose a new password for your account.'
        : step === 'check-email'
          ? 'If an account exists, a reset link was sent.'
          : 'Enter your email to continue the reset flow.';

  return (
    <AuthLayout title={title} subtitle={subtitle}>
      {error && step !== 'success' && step !== 'check-email' && (
        <div
          role="alert"
          className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-4"
        >
          {error}
        </div>
      )}

      {step === 'email' && (
        <form
          className="space-y-4"
          onSubmit={handleEmailSubmit}
          noValidate
          aria-busy={submitting}
        >
          <p className="text-sm text-gray-600">
            If an account exists for that email, we will send a reset link. We do
            not confirm whether the address is registered.
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
            {submitting ? 'Sending...' : 'Send reset link'}
          </button>
        </form>
      )}

      {step === 'check-email' && (
        <div className="space-y-4">
          <div
            role="status"
            className="rounded border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            If an account exists for that email, you can continue with the reset
            link. In development the API logs the URL in the server console.
          </div>
          <Link
            to="/auth/signin"
            className={`block w-full py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition text-center ${focusRing}`}
          >
            Back to Sign In
          </Link>
        </div>
      )}

      {step === 'password' && (
        <form
          className="space-y-4"
          onSubmit={handlePasswordSubmit}
          noValidate
          aria-busy={submitting}
        >
          <p className="text-sm text-gray-600">
            Enter a new password for your ShewaCraft account.
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
            Your password was updated. You can sign in with the new password.
          </div>
          <Link
            to="/auth/signin"
            className={`block w-full py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition text-center ${focusRing}`}
          >
            Back to Sign In
          </Link>
        </div>
      )}

      {step !== 'success' && step !== 'check-email' && (
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
