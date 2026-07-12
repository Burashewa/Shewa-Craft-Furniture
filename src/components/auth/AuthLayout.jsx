import { Link } from 'react-router-dom';

export function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-semibold text-gray-900 tracking-tight">
            ShewaCraft
          </Link>
          <h1 className="text-3xl font-semibold text-gray-900 mt-6">{title}</h1>
          {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
        </div>

        <div className="bg-white p-8 shadow-lg rounded-lg border border-gray-100">
          {children}
        </div>

        <p className="text-center mt-6">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 transition">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
