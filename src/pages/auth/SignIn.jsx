import { Link } from "react-router-dom";

export default function SignIn() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-gray-900 mb-6 text-center">
          Sign In
        </h2>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-gray-900"
          />

          <button className="w-full py-3 bg-gray-900 text-white hover:bg-gray-800 transition">
            Sign In
          </button>
        </form>

        <p className="text-sm text-gray-600 text-center mt-4">
          Don’t have an account?{" "}
          <Link to="/auth/signup" className="text-gray-900 font-medium hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
