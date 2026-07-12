import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import {
  validateEmail,
  validatePassword,
} from '../../services/authService';

export default function SignUp() {
  const { signUp, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!authLoading && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

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
      setError(err.message || 'Unable to create account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join ShewaCraft Furniture">
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
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
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Your full name"
          />
          {fieldErrors.fullName && (
            <p className="text-red-600 text-xs mt-1.5">{fieldErrors.fullName}</p>
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
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="you@example.com"
          />
          {fieldErrors.email && (
            <p className="text-red-600 text-xs mt-1.5">{fieldErrors.email}</p>
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
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {fieldErrors.password ? (
            <p className="text-red-600 text-xs mt-1.5">{fieldErrors.password}</p>
          ) : (
            <p className="text-gray-500 text-xs mt-1.5">
              Use 8+ characters with at least one letter and one number
            </p>
          )}
        </div>

        <div>
          <label htmlFor="signup-confirm" className="block text-sm text-gray-700 mb-1.5">
            Confirm password
          </label>
          <input
            id="signup-confirm"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
            placeholder="Re-enter your password"
          />
          {fieldErrors.confirmPassword && (
            <p className="text-red-600 text-xs mt-1.5">{fieldErrors.confirmPassword}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-gray-900 text-white hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>

      <p className="text-sm text-gray-600 text-center mt-4">
        Already have an account?{' '}
        <Link to="/auth/signin" className="text-gray-900 font-medium hover:underline">
          Sign In
        </Link>
      </p>
    </AuthLayout>
  );
}
